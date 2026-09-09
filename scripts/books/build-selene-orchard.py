#!/usr/bin/env python3
"""Build Book II from its canonical Markdown into staged web, HTML, and EPUB editions.

Draft mode accepts the current contiguous chapter prefix and omits the EPUB.
The default final mode is fail-closed: it requires all 14 chapters, the cover,
four to eight referenced Book II plates, and every referenced image asset.
"""

from __future__ import annotations

import argparse
import ast
import base64
import hashlib
import html
import json
import mimetypes
import re
import shutil
import uuid
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from xml.etree import ElementTree

PROJECT = Path(__file__).resolve().parents[2]
EVOLUTION = PROJECT / "evolution"
MANUSCRIPT = EVOLUTION / "manuscript"
PRODUCTION = EVOLUTION / "production"
STAGING_ROOT = EVOLUTION / "integration"
STAGED_BOOK = STAGING_ROOT / "book/selene-y-brio-orchard"
STAGED_CHAPTERS = STAGED_BOOK / "chapters"
STAGED_PUBLIC = STAGING_ROOT / "apps/web/public"
HTML_OUTPUT = PRODUCTION / "The-Orchard-of-Unspoken-Names.html"
EPUB_OUTPUT = PRODUCTION / "The-Orchard-of-Unspoken-Names.epub"

TITLE = "The Orchard of Unspoken Names"
SUBTITLE = "Selene & Brío · Book II"
SERIES = "Selene & Brío"
AUTHOR = "Arcanea"
LICENSE = "CC-BY-NC-SA-4.0"
ROUTE = "/books/selene-y-brio-orchard"
COVER_SRC = "/images/books/selene-y-brio-orchard/cover.webp"
COVER_ALT = "Selene and Brío at the threshold of the orchard of unspoken names."


@dataclass(frozen=True)
class ImageRecord:
    src: str
    alt: str
    caption: str
    path: Path


@dataclass(frozen=True)
class Chapter:
    source_path: Path
    source_text: str
    id: str
    number: int
    title: str
    subtitle: str
    paragraphs: tuple[str, ...]
    images: tuple[ImageRecord, ...]

    @property
    def source_sha256(self) -> str:
        return hashlib.sha256(self.source_text.encode("utf-8")).hexdigest()


def fail(message: str) -> None:
    raise SystemExit(message)


def parse_scalar(raw: str) -> Any:
    value = raw.strip()
    if value == "[]":
        return []
    if re.fullmatch(r"\d+", value):
        return int(value)
    if value.startswith('"'):
        try:
            return json.loads(value)
        except json.JSONDecodeError as error:
            fail(f"Invalid quoted YAML scalar {value!r}: {error}")
    if value.startswith("'"):
        try:
            return ast.literal_eval(value)
        except (SyntaxError, ValueError) as error:
            fail(f"Invalid quoted YAML scalar {value!r}: {error}")
    return value


def parse_frontmatter(path: Path, source: str) -> tuple[dict[str, Any], str]:
    lines = source.splitlines()
    if not lines or lines[0].strip() != "---":
        fail(f"{path}: missing opening YAML delimiter")
    try:
        end = next(index for index, line in enumerate(lines[1:], 1) if line.strip() == "---")
    except StopIteration:
        fail(f"{path}: missing closing YAML delimiter")

    data: dict[str, Any] = {}
    current_image: dict[str, Any] | None = None
    for line_number, line in enumerate(lines[1:end], 2):
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if line.startswith("  - "):
            if "images" not in data or not isinstance(data["images"], list):
                fail(f"{path}:{line_number}: list item is only supported under images")
            key, separator, raw = line[4:].partition(":")
            if not separator:
                fail(f"{path}:{line_number}: invalid image field")
            current_image = {key.strip(): parse_scalar(raw)}
            data["images"].append(current_image)
            continue
        if line.startswith("    "):
            if current_image is None:
                fail(f"{path}:{line_number}: image field has no list item")
            key, separator, raw = line.strip().partition(":")
            if not separator:
                fail(f"{path}:{line_number}: invalid image field")
            current_image[key.strip()] = parse_scalar(raw)
            continue
        if line.startswith(" "):
            fail(f"{path}:{line_number}: unsupported YAML indentation")
        key, separator, raw = line.partition(":")
        if not separator:
            fail(f"{path}:{line_number}: invalid YAML field")
        key = key.strip()
        data[key] = [] if key == "images" and not raw.strip() else parse_scalar(raw)
        current_image = None

    body = "\n".join(lines[end + 1 :]).strip()
    return data, body


class AssetResolver:
    def __init__(self, additional_roots: list[Path]) -> None:
        self.public_roots = [
            *additional_roots,
            STAGED_PUBLIC,
            PROJECT / "integration/apps/web/public",
        ]

    def resolve(self, src: str) -> Path | None:
        if not src.startswith("/images/books/") or ".." in src:
            fail(f"Unsafe or unsupported image source: {src}")
        relative = Path(src.removeprefix("/"))
        candidates = [root / relative for root in self.public_roots]
        name = relative.name
        if src.startswith("/images/books/selene-y-brio/"):
            candidates.append(PROJECT / "art" / name)
        if src.startswith("/images/books/selene-y-brio-orchard/"):
            candidates.extend(
                [EVOLUTION / "art" / name, EVOLUTION / "art" / relative]
            )
        return next((path for path in candidates if path.is_file()), None)


def validate_image(path: Path, value: Any, resolver: AssetResolver) -> ImageRecord:
    if not isinstance(value, dict) or set(value) != {"src", "alt", "caption"}:
        fail(f"{path}: each image needs exactly src, alt, and caption")
    if any(not isinstance(value[key], str) or not value[key].strip() for key in value):
        fail(f"{path}: image src, alt, and caption must be non-empty strings")
    resolved = resolver.resolve(value["src"])
    if resolved is None:
        fail(f"{path}: missing referenced image asset {value['src']}")
    return ImageRecord(value["src"], value["alt"], value["caption"], resolved)


def load_chapters(resolver: AssetResolver, draft: bool) -> list[Chapter]:
    files = sorted(MANUSCRIPT.glob("[0-9][0-9]-*.md"))
    if not files:
        fail(f"No chapter Markdown found under {MANUSCRIPT}")

    chapters: list[Chapter] = []
    for path in files:
        source = path.read_text(encoding="utf-8")
        data, body = parse_frontmatter(path, source)
        required = {"id", "number", "title", "subtitle", "images"}
        if set(data) != required:
            missing = sorted(required - set(data))
            extra = sorted(set(data) - required)
            fail(f"{path}: frontmatter mismatch; missing={missing}, extra={extra}")
        if not isinstance(data["id"], str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", data["id"]):
            fail(f"{path}: id must be a lowercase kebab-case string")
        if not isinstance(data["number"], int):
            fail(f"{path}: number must be an integer")
        if int(path.name[:2]) != data["number"]:
            fail(f"{path}: filename prefix and chapter number disagree")
        for key in ("title", "subtitle"):
            if not isinstance(data[key], str) or not data[key].strip():
                fail(f"{path}: {key} must be a non-empty string")
        if not isinstance(data["images"], list) or len(data["images"]) > 2:
            fail(f"{path}: images must be an array containing zero to two entries")
        paragraphs = tuple(part.strip() for part in re.split(r"\n\s*\n", body) if part.strip())
        if not paragraphs:
            fail(f"{path}: body must contain at least one plain paragraph")
        images = tuple(validate_image(path, item, resolver) for item in data["images"])
        chapters.append(
            Chapter(
                path,
                source,
                data["id"],
                data["number"],
                data["title"],
                data["subtitle"],
                paragraphs,
                images,
            )
        )

    numbers = [chapter.number for chapter in chapters]
    expected = list(range(1, len(chapters) + 1))
    if numbers != expected:
        fail(f"Chapter numbers must be a contiguous prefix beginning at 1; got {numbers}")
    ids = [chapter.id for chapter in chapters]
    if len(set(ids)) != len(ids):
        fail("Chapter IDs must be unique")
    if not draft and len(chapters) != 14:
        fail(f"Final mode requires exactly 14 chapters; found {len(chapters)}")
    if draft and len(chapters) > 14:
        fail(f"Draft mode accepts at most 14 chapters; found {len(chapters)}")
    return chapters


def source_digest(chapters: list[Chapter]) -> str:
    digest = hashlib.sha256()
    for chapter in chapters:
        digest.update(chapter.source_text.encode("utf-8"))
    return digest.hexdigest()


def validate_final_art(chapters: list[Chapter], resolver: AssetResolver) -> Path:
    cover = resolver.resolve(COVER_SRC)
    if cover is None:
        fail(f"Final mode requires cover asset {COVER_SRC}")
    new_plates = {
        image.src
        for chapter in chapters
        for image in chapter.images
        if image.src.startswith("/images/books/selene-y-brio-orchard/")
        and image.src != COVER_SRC
    }
    if not 4 <= len(new_plates) <= 8:
        fail(
            "Final mode requires four to eight unique Book II chapter plates; "
            f"found {len(new_plates)}"
        )
    return cover


def sync_sources(chapters: list[Chapter]) -> None:
    STAGED_CHAPTERS.mkdir(parents=True, exist_ok=True)
    expected_names = {chapter.source_path.name for chapter in chapters}
    for stale in STAGED_CHAPTERS.glob("[0-9][0-9]-*.md"):
        if stale.name not in expected_names:
            stale.unlink()
    for chapter in chapters:
        target = STAGED_CHAPTERS / chapter.source_path.name
        target.write_bytes(chapter.source_path.read_bytes())
        if target.read_bytes() != chapter.source_path.read_bytes():
            raise RuntimeError(f"Source staging parity failed for {target}")


def sync_new_assets(chapters: list[Chapter], cover: Path | None) -> None:
    assets = [
        image
        for chapter in chapters
        for image in chapter.images
        if image.src.startswith("/images/books/selene-y-brio-orchard/")
    ]
    pairs = [(record.src, record.path) for record in assets]
    if cover is not None:
        pairs.append((COVER_SRC, cover))
    for src, source in pairs:
        target = STAGED_PUBLIC / src.removeprefix("/")
        target.parent.mkdir(parents=True, exist_ok=True)
        if source.resolve() != target.resolve():
            shutil.copy2(source, target)


def data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"


def image_positions(chapter: Chapter) -> list[int]:
    if not chapter.images:
        return []
    first = max(1, (len(chapter.paragraphs) + 2) // 3)
    if len(chapter.images) == 1:
        return [first]
    second = min(len(chapter.paragraphs), max(first, round(len(chapter.paragraphs) * 0.72)))
    return [first, second]


def html_chapter(chapter: Chapter) -> str:
    positions = image_positions(chapter)
    blocks: list[str] = []
    for index, paragraph in enumerate(chapter.paragraphs, 1):
        blocks.append(f"<p>{html.escape(paragraph)}</p>")
        for image_index, position in enumerate(positions):
            if index != position:
                continue
            image = chapter.images[image_index]
            blocks.append(
                '<figure class="plate"><button class="plate-open" type="button" '
                f'aria-label="Open full image: {html.escape(image.alt, quote=True)}">'
                f'<img src="{data_uri(image.path)}" alt="{html.escape(image.alt, quote=True)}" '
                'width="941" height="1672" loading="lazy" decoding="async"></button>'
                f"<figcaption>{html.escape(image.caption)}</figcaption></figure>"
            )
    return (
        f'<section class="chapter" id="{html.escape(chapter.id, quote=True)}" tabindex="-1" '
        f'data-source-sha256="{chapter.source_sha256}"><header class="chapter-head" '
        f'data-chapter-id="{html.escape(chapter.id, quote=True)}"><p class="chapter-number">'
        f"Chapter {chapter.number}</p><h2>{html.escape(chapter.title)}</h2>"
        f'<p class="chapter-subtitle">{html.escape(chapter.subtitle)}</p></header>{"".join(blocks)}</section>'
    )


def build_html(chapters: list[Chapter], cover: Path | None, draft: bool) -> str:
    digest = source_digest(chapters)
    nav = "".join(
        f'<li><a href="#{html.escape(chapter.id, quote=True)}"><span>{chapter.number:02}</span>'
        f"{html.escape(chapter.title)}</a></li>"
        for chapter in chapters
    )
    content = "".join(html_chapter(chapter) for chapter in chapters)
    cover_html = (
        f'<img class="cover" src="{data_uri(cover)}" alt="{html.escape(COVER_ALT, quote=True)}" '
        'width="941" height="1672">'
        if cover is not None
        else ""
    )
    draft_meta = '<meta name="robots" content="noindex,nofollow">' if draft else ""
    draft_banner = '<p class="draft">Draft review copy · incomplete</p>' if draft else ""
    status = "draft" if draft else "final"
    css = r"""
:root{color-scheme:dark;--shell:#080a0d;--paper:#f0e8d8;--ink:#27231f;--muted:#8d887f;--gold:#c6a96b;--teal:#79b9b2;--rule:rgba(198,169,107,.3);--sans:system-ui,sans-serif;--serif:Iowan Old Style,Baskerville,Georgia,serif}*{box-sizing:border-box}html{scroll-behavior:smooth;background:var(--shell)}body{margin:0;background:var(--shell);color:var(--paper);font-family:var(--sans)}a{color:inherit}.draft{position:fixed;z-index:40;inset:0 0 auto;margin:0;padding:.55rem 1rem;background:#7b3f00;color:white;text-align:center;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase}.progress{position:fixed;z-index:30;inset:0 0 auto;height:2px;background:rgba(240,232,216,.1)}.progress span{display:block;width:100%;height:100%;background:var(--teal);transform:scaleX(0);transform-origin:left}.skip{position:fixed;z-index:50;top:1rem;left:1rem;padding:.8rem 1rem;background:var(--paper);color:var(--ink);transform:translateY(-180%)}.skip:focus{transform:none}.masthead{min-height:88vh;display:grid;grid-template-columns:minmax(0,1fr) minmax(18rem,31rem);gap:clamp(3rem,8vw,8rem);align-items:center;max-width:78rem;margin:auto;padding:8rem 1.5rem}.kicker,.chapter-number,.contents>p{font-size:.72rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--teal)}h1{max-width:12ch;margin:1.5rem 0;font:400 clamp(4rem,9vw,8rem)/.86 var(--serif);letter-spacing:-.055em;text-wrap:balance}.dek{max-width:33rem;color:#b9b2a7;font:italic 1.45rem/1.4 var(--serif)}.author{margin-top:3rem;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase}.cover{display:block;width:100%;height:auto;max-height:76vh;aspect-ratio:9/16;object-fit:cover}.resume{display:inline-block;margin-top:2rem;color:var(--teal);text-underline-offset:.35em}.shell{display:grid;grid-template-columns:minmax(12rem,17rem) minmax(0,47rem);gap:clamp(3rem,8vw,9rem);justify-content:center;align-items:start;padding:0 5vw 15vh}.contents{position:sticky;top:2.5rem;border-top:1px solid var(--rule);padding-top:1.5rem}.contents ol{list-style:none;margin:1rem 0 0;padding:0}.contents a{display:grid;grid-template-columns:2rem 1fr;gap:.5rem;padding:.45rem 0;color:var(--muted);font-size:.83rem;line-height:1.3;text-decoration:none}.contents a span{font-size:.67rem}.contents a[aria-current=location],.contents a:hover{color:var(--paper)}.chapter{scroll-margin-top:3rem;padding:0 0 clamp(7rem,14vw,13rem);outline:0}.chapter-head{border-top:1px solid var(--rule);padding-top:2rem;margin-bottom:4rem}.chapter-head h2{max-width:16ch;margin:1rem 0 .8rem;color:var(--paper);font:400 clamp(2.8rem,6.5vw,5.2rem)/.96 var(--serif);letter-spacing:-.04em;text-wrap:balance}.chapter-subtitle{margin:0;color:var(--muted);font:italic 1.2rem/1.4 var(--serif)}.chapter>p{margin:0 0 1.45em;color:var(--paper);font:400 clamp(1.18rem,1.7vw,1.4rem)/1.82 var(--serif)}.chapter-head+p:first-letter{float:left;margin:.07em .12em 0 0;color:var(--gold);font-size:4.5em;line-height:.7}.plate{width:min(100%,40rem);margin:clamp(3rem,8vw,6rem) auto}.plate-open{display:block;width:100%;padding:0;border:0;background:none;cursor:zoom-in}.plate img{display:block;width:100%;height:auto;aspect-ratio:9/16;object-fit:cover;background:#0e1115}.plate figcaption{margin-top:.75rem;color:var(--muted);font-size:.75rem;line-height:1.5}.edition{padding:5rem 5vw;border-top:1px solid var(--rule);color:var(--muted);font-size:.72rem;text-align:center;letter-spacing:.08em;text-transform:uppercase}dialog{width:100%;height:100%;max-width:none;max-height:none;margin:0;padding:1.5rem;border:0;background:rgba(8,10,13,.97);color:var(--paper)}dialog::backdrop{background:var(--shell)}.dialog-inner{min-height:100%;display:grid;place-items:center}.dialog-inner img{display:block;width:auto;max-width:90vw;height:auto;max-height:88vh;object-fit:contain}.dialog-close{position:fixed;top:1rem;right:1rem;min-width:44px;min-height:44px;border:1px solid var(--rule);background:var(--shell);color:var(--paper);cursor:pointer}a:focus-visible,button:focus-visible{outline:2px solid var(--teal);outline-offset:4px}@media(max-width:860px){.masthead{display:block;min-height:76vh}.cover{width:min(100%,28rem);margin:4rem auto 0}.shell{display:block;padding-inline:1.5rem}.contents{position:relative;top:auto;margin-bottom:6rem}.contents ol{columns:2;column-gap:2rem}.contents li{break-inside:avoid}}@media(max-width:520px){.masthead,.shell{padding-inline:1rem}.contents ol{columns:1}h1{font-size:clamp(3.5rem,19vw,5.7rem)}.plate{width:calc(100% + 2rem);margin-left:-1rem}.plate figcaption{padding-inline:1rem}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media print{.progress,.skip,.contents,.dialog-close,.draft{display:none!important}.masthead{min-height:90vh}.shell{display:block;max-width:45rem;margin:auto}.chapter{break-before:page}.plate-open{cursor:default}body,.chapter>p,.chapter-head h2{background:#fff;color:#111}}
"""
    js = r"""
(()=>{const key='arcanea:reader:selene-y-brio-orchard',heads=[...document.querySelectorAll('.chapter-head')],links=[...document.querySelectorAll('.contents a')],bar=document.querySelector('.progress span'),resume=document.querySelector('.resume'),dialog=document.querySelector('dialog'),full=document.querySelector('.dialog-image');try{const saved=localStorage.getItem(key);if(saved&&document.getElementById(saved)){resume.href='#'+saved;resume.textContent='Resume reading'}}catch{}const save=id=>{links.forEach(a=>a.toggleAttribute('aria-current',a.hash==='#'+id));try{localStorage.setItem(key,id)}catch{}};const observer=new IntersectionObserver(entries=>{const hit=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(hit)save(hit.target.dataset.chapterId)},{rootMargin:'-20% 0px -55%',threshold:[.1,.4,.7]});heads.forEach(h=>observer.observe(h));const progress=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${max>0?Math.min(1,scrollY/max):1})`};addEventListener('scroll',progress,{passive:true});addEventListener('resize',progress);progress();document.querySelectorAll('.plate-open').forEach(button=>button.addEventListener('click',()=>{const picture=button.querySelector('img');full.src=picture.src;full.alt=picture.alt;dialog.showModal()}));document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()})})();
"""
    return f'''<!doctype html><html lang="en" data-edition-status="{status}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#080a0d">{draft_meta}<meta name="arcanea-source-sha256" content="{digest}"><title>{html.escape(TITLE)} — {AUTHOR}</title><meta name="description" content="{html.escape(SUBTITLE)}"><style>{css}</style></head><body>{draft_banner}<div class="progress" aria-hidden="true"><span></span></div><a class="skip" href="#story">Skip to story</a><header class="masthead"><div><p class="kicker">An illustrated Arcanea novella</p><h1>{html.escape(TITLE)}</h1><p class="dek">{html.escape(SUBTITLE)}</p><p class="author">By {AUTHOR}</p><a class="resume" href="#story">Start reading</a></div>{cover_html}</header><main class="shell" id="story"><nav class="contents" aria-label="Chapters"><p>Contents</p><ol>{nav}</ol></nav><article aria-label="{html.escape(TITLE, quote=True)}">{content}</article></main><footer class="edition">{status} edition · 2026 · {AUTHOR} · {LICENSE}</footer><dialog aria-label="Full illustration"><div class="dialog-inner"><button class="dialog-close" type="button">Close</button><img class="dialog-image" alt=""></div></dialog><script>{js}</script></body></html>'''


def xhtml_document(title: str, body: str, body_class: str = "") -> str:
    return (
        '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html>'
        '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" '
        f'xml:lang="en" lang="en"><head><title>{html.escape(title)}</title>'
        '<link rel="stylesheet" type="text/css" href="styles/book.css"/></head>'
        f'<body class="{html.escape(body_class, quote=True)}">{body}</body></html>'
    )


def build_epub(chapters: list[Chapter], cover: Path, output: Path) -> None:
    digest = source_digest(chapters)
    book_id = f"urn:uuid:{uuid.uuid5(uuid.NAMESPACE_URL, 'https://arcanea.ai' + ROUTE)}"
    container = '''<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'''
    css = "body{font-family:serif;line-height:1.6;margin:5%;color:#27231f}h1{font-weight:normal;line-height:1.05}.title-page{text-align:center;padding-top:8%}.title-page .cover{display:block;max-width:70%;max-height:65vh;margin:2em auto}.series,.subtitle,.chapter-number,figcaption{color:#6f675d}.chapter header{margin:2em 0 3em}.chapter p{margin:0 0 1em}figure{margin:2.5em auto;text-align:center;page-break-inside:avoid}img{display:block;width:auto;max-width:100%;max-height:90vh;margin:auto}figcaption{font-size:.8em;margin-top:.6em}nav ol{line-height:1.9}"
    title_page = xhtml_document(
        TITLE,
        f'<section epub:type="titlepage"><p class="series">{html.escape(SERIES)}</p>'
        f'<h1>{html.escape(TITLE)}</h1><p class="subtitle">{html.escape(SUBTITLE)}</p>'
        f'<img class="cover" src="images/cover{cover.suffix.lower()}" alt="{html.escape(COVER_ALT, quote=True)}"/>'
        f'<p>{AUTHOR}</p><p>{LICENSE}</p></section>',
        "title-page",
    )

    image_names: dict[str, str] = {}
    image_records: dict[str, ImageRecord] = {}
    for chapter in chapters:
        for image in chapter.images:
            if image.src not in image_names:
                suffix = image.path.suffix.lower() or ".bin"
                image_names[image.src] = f"plate-{len(image_names) + 1:02}{suffix}"
                image_records[image.src] = image

    chapter_docs: dict[int, str] = {}
    for chapter in chapters:
        blocks: list[str] = []
        positions = image_positions(chapter)
        for index, paragraph in enumerate(chapter.paragraphs, 1):
            blocks.append(f"<p>{html.escape(paragraph)}</p>")
            for image_index, position in enumerate(positions):
                if index != position:
                    continue
                image = chapter.images[image_index]
                blocks.append(
                    f'<figure><img src="images/{image_names[image.src]}" '
                    f'alt="{html.escape(image.alt, quote=True)}"/>'
                    f"<figcaption>{html.escape(image.caption)}</figcaption></figure>"
                )
        body = (
            f'<section epub:type="chapter" id="{html.escape(chapter.id, quote=True)}">'
            f'<header><p class="chapter-number">Chapter {chapter.number}</p>'
            f"<h1>{html.escape(chapter.title)}</h1>"
            f'<p class="subtitle">{html.escape(chapter.subtitle)}</p></header>{"".join(blocks)}</section>'
        )
        chapter_docs[chapter.number] = xhtml_document(
            f"Chapter {chapter.number}: {chapter.title}", body, "chapter"
        )

    nav_items = "".join(
        f'<li><a href="chapter-{chapter.number:02}.xhtml">{chapter.number}. '
        f"{html.escape(chapter.title)}</a></li>"
        for chapter in chapters
    )
    nav = (
        '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html>'
        '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" '
        f'xml:lang="en" lang="en"><head><title>Contents</title></head><body><nav epub:type="toc" '
        f'id="toc"><h1>Contents</h1><ol>{nav_items}</ol></nav></body></html>'
    )
    cover_mime = mimetypes.guess_type(cover.name)[0] or "application/octet-stream"
    manifest = [
        '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
        '<item id="css" href="styles/book.css" media-type="text/css"/>',
        '<item id="title-page" href="title-page.xhtml" media-type="application/xhtml+xml"/>',
        f'<item id="cover" href="images/cover{cover.suffix.lower()}" media-type="{cover_mime}" properties="cover-image"/>',
    ]
    spine = ['<itemref idref="title-page"/>']
    for chapter in chapters:
        manifest.append(
            f'<item id="chapter-{chapter.number:02}" href="chapter-{chapter.number:02}.xhtml" '
            'media-type="application/xhtml+xml"/>'
        )
        spine.append(f'<itemref idref="chapter-{chapter.number:02}"/>')
    for index, (src, filename) in enumerate(image_names.items(), 1):
        record = image_records[src]
        mime = mimetypes.guess_type(record.path.name)[0] or "application/octet-stream"
        manifest.append(
            f'<item id="plate-{index:02}" href="images/{filename}" media-type="{mime}"/>'
        )
    opf = f'''<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="en"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">{book_id}</dc:identifier><dc:title id="title">{html.escape(TITLE)}</dc:title><dc:language>en</dc:language><dc:creator id="creator">{AUTHOR}</dc:creator><dc:publisher>{AUTHOR}</dc:publisher><dc:rights>{LICENSE}</dc:rights><dc:description>{html.escape(SUBTITLE)}. Illustrated companion edition.</dc:description><meta property="dcterms:modified">2026-09-09T00:00:00Z</meta><meta property="dcterms:source">sha256:{digest}</meta><meta property="belongs-to-collection" id="series">{html.escape(SERIES)}</meta><meta refines="#series" property="collection-type">series</meta><meta refines="#title" property="title-type">main</meta><meta refines="#creator" property="role" scheme="marc:relators">cre</meta></metadata><manifest>{''.join(manifest)}</manifest><spine>{''.join(spine)}</spine></package>'''

    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix(output.suffix + ".tmp")
    with zipfile.ZipFile(temporary, "w") as archive:
        archive.writestr("mimetype", "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        archive.writestr("META-INF/container.xml", container, compress_type=zipfile.ZIP_DEFLATED)
        archive.writestr("OEBPS/content.opf", opf, compress_type=zipfile.ZIP_DEFLATED)
        archive.writestr("OEBPS/nav.xhtml", nav, compress_type=zipfile.ZIP_DEFLATED)
        archive.writestr("OEBPS/title-page.xhtml", title_page, compress_type=zipfile.ZIP_DEFLATED)
        archive.writestr("OEBPS/styles/book.css", css, compress_type=zipfile.ZIP_DEFLATED)
        archive.write(cover, f"OEBPS/images/cover{cover.suffix.lower()}", compress_type=zipfile.ZIP_STORED)
        for chapter in chapters:
            archive.writestr(
                f"OEBPS/chapter-{chapter.number:02}.xhtml",
                chapter_docs[chapter.number],
                compress_type=zipfile.ZIP_DEFLATED,
            )
        for src, filename in image_names.items():
            archive.write(image_records[src].path, f"OEBPS/images/{filename}", compress_type=zipfile.ZIP_STORED)
    with zipfile.ZipFile(temporary) as archive:
        if archive.namelist()[0] != "mimetype" or archive.getinfo("mimetype").compress_type != zipfile.ZIP_STORED:
            raise RuntimeError("EPUB mimetype must be first and uncompressed")
        if archive.testzip() is not None:
            raise RuntimeError("EPUB ZIP integrity check failed")
        for name in archive.namelist():
            if name.endswith((".xml", ".opf", ".xhtml")):
                ElementTree.fromstring(archive.read(name))
    temporary.replace(output)


def write_html(source: str) -> None:
    HTML_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    temporary = HTML_OUTPUT.with_suffix(HTML_OUTPUT.suffix + ".tmp")
    temporary.write_text(source, encoding="utf-8")
    temporary.replace(HTML_OUTPUT)


def paths_overlap(first: Path, second: Path) -> bool:
    first = first.resolve()
    second = second.resolve()
    return first == second or first.is_relative_to(second) or second.is_relative_to(first)


def main() -> None:
    global MANUSCRIPT, PRODUCTION, STAGING_ROOT, STAGED_BOOK, STAGED_CHAPTERS
    global STAGED_PUBLIC, HTML_OUTPUT, EPUB_OUTPUT

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--draft", action="store_true", help="Build an explicitly marked, noindex HTML review copy from the current contiguous chapter prefix")
    parser.add_argument("--validate-only", action="store_true", help="Validate without staging or writing editions")
    parser.add_argument("--asset-root", action="append", default=[], type=Path, help="Additional public root containing images/books/... (repeatable)")
    parser.add_argument("--manuscript-dir", type=Path, default=MANUSCRIPT, help="Canonical chapter Markdown directory")
    parser.add_argument("--output-dir", type=Path, default=PRODUCTION, help="Directory for the standalone HTML and EPUB")
    parser.add_argument("--staging-root", type=Path, default=STAGING_ROOT, help="Separate root that receives book/... and apps/web/public/... release files")
    args = parser.parse_args()

    MANUSCRIPT = args.manuscript_dir.resolve()
    PRODUCTION = args.output_dir.resolve()
    STAGING_ROOT = args.staging_root.resolve()
    STAGED_BOOK = STAGING_ROOT / "book/selene-y-brio-orchard"
    STAGED_CHAPTERS = STAGED_BOOK / "chapters"
    STAGED_PUBLIC = STAGING_ROOT / "apps/web/public"
    HTML_OUTPUT = PRODUCTION / "The-Orchard-of-Unspoken-Names.html"
    EPUB_OUTPUT = PRODUCTION / "The-Orchard-of-Unspoken-Names.epub"
    if paths_overlap(MANUSCRIPT, STAGED_CHAPTERS):
        fail("Staging chapter directory must be separate from the canonical manuscript directory")
    if paths_overlap(MANUSCRIPT, PRODUCTION):
        fail("Output directory must be separate from the canonical manuscript directory")

    resolver = AssetResolver([path.resolve() for path in args.asset_root])
    chapters = load_chapters(resolver, args.draft)
    cover = resolver.resolve(COVER_SRC)
    if not args.draft:
        cover = validate_final_art(chapters, resolver)
    words = sum(len(re.findall(r"\b[\w’'-]+\b", paragraph)) for chapter in chapters for paragraph in chapter.paragraphs)
    digest = source_digest(chapters)

    if args.validate_only:
        print(f"Validated {len(chapters)} chapters, {words} words, source sha256 {digest}")
        return

    sync_sources(chapters)
    sync_new_assets(chapters, cover)
    write_html(build_html(chapters, cover, args.draft))
    if not args.draft:
        assert cover is not None
        build_epub(chapters, cover, EPUB_OUTPUT)

    print(f"Built {HTML_OUTPUT} ({len(chapters)} chapters, {words} words, draft={args.draft})")
    print(f"Staged byte-identical Markdown in {STAGED_CHAPTERS}")
    print(f"Source sha256: {digest}")
    if args.draft:
        print("EPUB skipped: final mode requires the complete manuscript and art set")
    else:
        print(f"Built {EPUB_OUTPUT}")


if __name__ == "__main__":
    main()
