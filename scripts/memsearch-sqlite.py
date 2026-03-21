#!/usr/bin/env python3
"""memsearch-sqlite: Lightweight vector search over markdown files using SQLite + Gemini embeddings.
WSL2-compatible alternative to Milvus Lite. Run via: uvx --with google-genai --with numpy --with sqlite-vec python3 scripts/memsearch-sqlite.py
"""
import sys, os, re, json, hashlib, struct, sqlite3, pathlib, time
from typing import Optional

import numpy as np

DB_DIR = pathlib.Path(os.environ.get("MEMSEARCH_DB_DIR", pathlib.Path.home() / ".memsearch"))
DB_PATH = DB_DIR / "vectors.db"
EMBED_MODEL = "gemini-embedding-001"
EMBED_DIM = 3072

# ── DB Setup ──────────────────────────────────────────────────────────────────

def get_db() -> sqlite3.Connection:
    DB_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("""CREATE TABLE IF NOT EXISTS chunks (
        id INTEGER PRIMARY KEY, file_path TEXT, heading TEXT, chunk_text TEXT,
        content_hash TEXT UNIQUE, embedding BLOB, indexed_at REAL)""")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_hash ON chunks(content_hash)")
    return conn

# ── Embedding ─────────────────────────────────────────────────────────────────

def get_client():
    from google import genai
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not key:
        print("ERROR: Set GEMINI_API_KEY or GOOGLE_API_KEY"); sys.exit(1)
    return genai.Client(api_key=key)

def embed_texts(client, texts: list[str]) -> list[np.ndarray]:
    """Embed a batch of texts (max 100 per call)."""
    results = []
    for i in range(0, len(texts), 100):
        batch = texts[i:i+100]
        resp = client.models.embed_content(model=EMBED_MODEL, contents=batch)
        for emb in resp.embeddings:
            results.append(np.array(emb.values, dtype=np.float32))
        if i + 100 < len(texts):
            time.sleep(0.5)  # rate limit courtesy
    return results

def vec_to_blob(v: np.ndarray) -> bytes:
    return v.astype(np.float32).tobytes()

def blob_to_vec(b: bytes) -> np.ndarray:
    return np.frombuffer(b, dtype=np.float32)

# ── Chunking ──────────────────────────────────────────────────────────────────

def chunk_markdown(text: str, file_path: str) -> list[dict]:
    """Split markdown by ## and ### headings. Minimum 40 chars per chunk."""
    chunks = []
    parts = re.split(r'^(#{1,3}\s+.+)$', text, flags=re.MULTILINE)
    heading = pathlib.Path(file_path).stem
    current = ""
    for part in parts:
        if re.match(r'^#{1,3}\s+', part):
            if current.strip() and len(current.strip()) >= 40:
                chunks.append({"heading": heading, "text": current.strip()})
            heading = part.strip().lstrip('#').strip()
            current = part + "\n"
        else:
            current += part
    if current.strip() and len(current.strip()) >= 40:
        chunks.append({"heading": heading, "text": current.strip()})
    # If no headings found, chunk the whole file
    if not chunks and text.strip() and len(text.strip()) >= 40:
        chunks.append({"heading": pathlib.Path(file_path).stem, "text": text.strip()})
    return chunks

# ── Commands ──────────────────────────────────────────────────────────────────

def cmd_index(dirs: list[str]):
    conn = get_db()
    client = get_client()
    md_files = []
    for d in dirs:
        p = pathlib.Path(d)
        if p.is_file() and p.suffix == '.md':
            md_files.append(p)
        elif p.is_dir():
            md_files.extend(sorted(p.rglob("*.md")))
    if not md_files:
        print(f"No .md files found in: {dirs}"); return

    print(f"Found {len(md_files)} markdown files")
    all_chunks = []
    for f in md_files:
        try:
            text = f.read_text(encoding='utf-8', errors='replace')
        except Exception as e:
            print(f"  SKIP {f}: {e}"); continue
        for chunk in chunk_markdown(text, str(f)):
            h = hashlib.sha256(chunk["text"].encode()).hexdigest()
            existing = conn.execute("SELECT id FROM chunks WHERE content_hash=?", (h,)).fetchone()
            if not existing:
                all_chunks.append({**chunk, "file_path": str(f), "hash": h})

    if not all_chunks:
        print("All chunks already indexed."); conn.close(); return

    print(f"Embedding {len(all_chunks)} new chunks...")
    texts = [c["text"][:2000] for c in all_chunks]  # truncate for embedding
    embeddings = embed_texts(client, texts)

    for chunk, emb in zip(all_chunks, embeddings):
        conn.execute("INSERT OR IGNORE INTO chunks (file_path, heading, chunk_text, content_hash, embedding, indexed_at) VALUES (?,?,?,?,?,?)",
            (chunk["file_path"], chunk["heading"], chunk["text"], chunk["hash"], vec_to_blob(emb), time.time()))
    conn.commit()
    print(f"Indexed {len(all_chunks)} chunks.")
    conn.close()

def cmd_search(query: str, limit: int = 8):
    conn = get_db()
    client = get_client()
    rows = conn.execute("SELECT id, file_path, heading, chunk_text, embedding FROM chunks").fetchall()
    if not rows:
        print("No indexed chunks. Run: memsearch-sqlite.py index <dirs>"); return

    q_emb = embed_texts(client, [query])[0]
    q_norm = q_emb / (np.linalg.norm(q_emb) + 1e-10)

    scored = []
    for row_id, fp, heading, text, emb_blob in rows:
        v = blob_to_vec(emb_blob)
        v_norm = v / (np.linalg.norm(v) + 1e-10)
        sim = float(np.dot(q_norm, v_norm))
        scored.append((sim, fp, heading, text))

    scored.sort(key=lambda x: -x[0])
    print(f"\n{'='*60}")
    print(f"  Search: \"{query}\"  ({len(rows)} chunks searched)")
    print(f"{'='*60}\n")
    for i, (sim, fp, heading, text) in enumerate(scored[:limit]):
        preview = text[:200].replace('\n', ' ')
        rel_path = fp.replace(str(pathlib.Path.cwd()) + "/", "")
        print(f"  [{i+1}] {sim:.4f}  {rel_path}")
        print(f"       # {heading}")
        print(f"       {preview}...")
        print()
    conn.close()

def cmd_status():
    if not DB_PATH.exists():
        print("No database yet. Run: memsearch-sqlite.py index <dirs>"); return
    conn = get_db()
    n_chunks = conn.execute("SELECT COUNT(*) FROM chunks").fetchone()[0]
    n_files = conn.execute("SELECT COUNT(DISTINCT file_path) FROM chunks").fetchone()[0]
    db_size = DB_PATH.stat().st_size
    print(f"Database:  {DB_PATH}")
    print(f"Files:     {n_files}")
    print(f"Chunks:    {n_chunks}")
    print(f"DB size:   {db_size / 1024:.1f} KB")
    conn.close()

def cmd_clear():
    conn = get_db()
    conn.execute("DELETE FROM chunks")
    conn.commit()
    print("Cleared all indexed chunks.")
    conn.close()

# ── Main ──────────────────────────────────────────────────────────────────────

USAGE = """memsearch-sqlite: Lightweight vector search for markdown files

Usage:
  memsearch-sqlite.py index <dir1> [dir2] ...   Index markdown files
  memsearch-sqlite.py search "query" [--limit N] Search indexed chunks
  memsearch-sqlite.py status                     Show index statistics
  memsearch-sqlite.py clear                      Clear all indexed data

Env: GEMINI_API_KEY (required for index/search)
     MEMSEARCH_DB_DIR (default: ~/.memsearch)

Run via uvx:
  uvx --with google-genai --with numpy python3 scripts/memsearch-sqlite.py search "query"
"""

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(USAGE); sys.exit(0)
    cmd = sys.argv[1]
    if cmd == "index":
        if len(sys.argv) < 3:
            print("Usage: memsearch-sqlite.py index <dir1> [dir2] ..."); sys.exit(1)
        cmd_index(sys.argv[2:])
    elif cmd == "search":
        if len(sys.argv) < 3:
            print("Usage: memsearch-sqlite.py search \"query\""); sys.exit(1)
        limit = 8
        if "--limit" in sys.argv:
            idx = sys.argv.index("--limit")
            limit = int(sys.argv[idx + 1])
            query = " ".join([a for i, a in enumerate(sys.argv[2:]) if i + 2 != idx and i + 2 != idx + 1])
        else:
            query = " ".join(sys.argv[2:])
        cmd_search(query, limit)
    elif cmd == "status":
        cmd_status()
    elif cmd == "clear":
        cmd_clear()
    else:
        print(USAGE); sys.exit(1)
