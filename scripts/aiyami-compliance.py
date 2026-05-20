#!/usr/bin/env python3
import os
import re
import sys
import yaml
import glob
from collections import Counter

# Canonical Voice Config path
VOICE_CONFIG_PATH = ".arcanea/config/voice.yaml"

# Slop words from Quality Canon / AGENTS.md
BANNED_AI_PATTERNS = {
    "delve": "AI generic exploration verb. Use 'explore', 'probe', 'venture', or active details.",
    "tapestry": "Overused AI metaphor. Describe the specific, complex threads instead.",
    "nestled": "Lazy setting descriptor. Describe the spatial layout actively.",
    "myriad": "AI descriptor for abundance. Use specific quantities or let the depth speak.",
    "beacon": "Cliché indicator of hope/wisdom. Detail the source and force of light instead.",
    "testament": "Cliché verification phrase. Use evidence or delete the sentence.",
    "realm": "Generic fantasy cliché. Specify the province, state, gate, or district."
}

def load_voice_config():
    if os.path.exists(VOICE_CONFIG_PATH):
        with open(VOICE_CONFIG_PATH, 'r', encoding='utf-8') as f:
            try:
                return yaml.safe_load(f)
            except Exception:
                pass
    return {}

def get_changed_files():
    # In GitHub Actions, we can find changes between HEAD and HEAD~1, or just scan all books
    # For a robust script, we will scan the entire book/ and world/ directory structure
    # and focus on any file that was recently added or modified.
    # If not running in Git, we scan all folders matching book/*/ or world/*/.
    books = glob.glob("book/*")
    worlds = glob.glob("world/*")
    return books, worlds

def get_ngrams(text, n=4):
    """Generate n-grams for plagiarism and content similarity check."""
    words = re.findall(r'\w+', text.lower())
    if len(words) < n:
        return set()
    return set(tuple(words[i:i+n]) for i in range(len(words) - n + 1))

def calculate_jaccard(set1, set2):
    if not set1 or not set2:
        return 0.0
    return len(set1.intersection(set2)) / len(set1.union(set2))

def run_checks():
    books, worlds = get_changed_files()
    
    report_lines = []
    report_lines.append("# Aiyami Submission Swarm Report")
    report_lines.append("> [!NOTE]")
    report_lines.append("> Managed by **Aiyami**, Guardian of the Crown Gate. These sandboxed out-of-band checks protect Arcanea's core IP, enforce the Quality Canon, and shield the platform from licensing liability.")
    report_lines.append("")

    overall_pass = True
    book_results = []
    world_results = []

    # Plagiarism baseline: load existing canon files to compare against
    canon_fingerprints = {}
    for md_path in glob.glob("book/**/*.md", recursive=True):
        try:
            with open(md_path, 'r', encoding='utf-8') as f:
                content = f.read()
                ngrams = get_ngrams(content, n=4)
                if ngrams:
                    canon_fingerprints[md_path] = ngrams
        except Exception:
            pass

    # 1. Check Books
    for book in books:
        if not os.path.isdir(book):
            continue
        book_slug = os.path.basename(book)
        manifest_path = os.path.join(book, "book.yaml")
        
        status = "PASS"
        issues = []
        metrics = {"words": 0, "slop": 0, "similarity": 0.0}

        # Validate manifest
        if not os.path.exists(manifest_path):
            status = "FAIL"
            issues.append("Missing `book.yaml` manifest in the root of the book folder.")
        else:
            try:
                with open(manifest_path, 'r', encoding='utf-8') as f:
                    manifest = yaml.safe_load(f)
                
                # Check for zero-liability tags & license
                if 'license' not in manifest:
                    status = "FAIL"
                    issues.append("Missing `license` in `book.yaml`. All community contributions must explicitly declare an open license (e.g., CC-BY-4.0 or MIT) to waive platform liability.")
                elif manifest['license'] not in ['CC-BY-4.0', 'CC0-1.0', 'MIT']:
                    issues.append(f"Non-standard license '{manifest['license']}'. We recommend CC-BY-4.0 or CC0-1.0 for community books.")

                if 'tier' in manifest and manifest['tier'] == 'canon':
                    status = "FAIL"
                    issues.append("Only the Council of Guardians can assign the `canon` tier. Community submissions must set tier to `community`.")
            except Exception as e:
                status = "FAIL"
                issues.append(f"Failed to parse `book.yaml`: {str(e)}")

        # Validate Chapters & Tone
        chapters = glob.glob(os.path.join(book, "chapters", "*.md"))
        if not chapters:
            issues.append("No chapters found in `chapters/` directory.")
        else:
            total_words = 0
            slop_words_found = Counter()
            max_plagiarism = 0.0
            most_similar_file = ""

            for chapter_path in chapters:
                try:
                    with open(chapter_path, 'r', encoding='utf-8') as f:
                        text = f.read()
                    
                    # Word count
                    words = len(text.split())
                    total_words += words
                    
                    # Slop count
                    for word in BANNED_AI_PATTERNS:
                        matches = len(re.findall(r'\b' + re.escape(word) + r'\b', text.lower()))
                        if matches > 0:
                            slop_words_found[word] += matches

                    # Plagiarism / Fingerprint overlap check
                    current_ngrams = get_ngrams(text, n=4)
                    for path, ngrams in canon_fingerprints.items():
                        if path in chapters: # Don't compare against itself inside the same book
                            continue
                        sim = calculate_jaccard(current_ngrams, ngrams)
                        if sim > max_plagiarism:
                            max_plagiarism = sim
                            most_similar_file = path
                except Exception as e:
                    issues.append(f"Failed to check chapter {chapter_path}: {str(e)}")

            metrics["words"] = total_words
            metrics["slop"] = sum(slop_words_found.values())
            metrics["similarity"] = max_plagiarism

            # Slop threshold check: density > 0.3%
            if total_words > 0:
                density = metrics["slop"] / total_words
                if density > 0.003:
                    if status != "FAIL":
                        status = "WARN"
                    issues.append(f"High AI slop word density detected ({density:.2%}). Banned words used: {dict(slop_words_found)}.")
            
            # Plagiarism threshold: > 20% Jaccard 4-gram overlap is highly suspicious
            if max_plagiarism > 0.20:
                status = "FAIL"
                issues.append(f"Plagiarism / content collision flagged! {max_plagiarism:.1%} structural overlap with existing file `{os.path.basename(most_similar_file)}`.")

        book_results.append({
            "name": book_slug,
            "status": status,
            "issues": issues,
            "metrics": metrics
        })
        if status == "FAIL":
            overall_pass = False

    # 2. Check Worlds
    for world in worlds:
        if not os.path.isdir(world):
            continue
        world_slug = os.path.basename(world)
        manifest_path = os.path.join(world, "world.yaml")
        status = "PASS"
        issues = []
        metrics = {"nodes": 0, "slop": 0}

        if not os.path.exists(manifest_path):
            status = "FAIL"
            issues.append("Missing `world.yaml` manifest in the root of the world folder.")
        else:
            try:
                with open(manifest_path, 'r', encoding='utf-8') as f:
                    manifest = yaml.safe_load(f)
                
                # Check required fields
                required = ['name', 'slug', 'description', 'license', 'authority']
                for req in required:
                    if req not in manifest:
                        status = "FAIL"
                        issues.append(f"Missing required field `{req}` in `world.yaml` manifest.")
            except Exception as e:
                status = "FAIL"
                issues.append(f"Failed to parse `world.yaml`: {str(e)}")

        # Count nodes / lore markdown files
        nodes = glob.glob(os.path.join(world, "**", "*.md"), recursive=True)
        metrics["nodes"] = len(nodes)

        world_results.append({
            "name": world_slug,
            "status": status,
            "issues": issues,
            "metrics": metrics
        })
        if status == "FAIL":
            overall_pass = False

    # Build the Markdown Report
    if overall_pass:
        report_lines.append("## Status: ✅ PASS")
        report_lines.append("All structural, tone, and compliance quality gates have passed successfully! This contribution aligns perfectly with the Arcanea Quality Canon and holds zero liability risk.")
    else:
        report_lines.append("## Status: ⚠️ ACTION REQUIRED")
        report_lines.append("The Submission Swarm flagged one or more compliance blockers. Please review the issues in the tables below and apply edits before merging.")

    report_lines.append("")
    report_lines.append("### Swarm Verification Details")
    report_lines.append("")

    if book_results:
        report_lines.append("#### Community Books Analysis")
        report_lines.append("| Book Directory | Status | Total Words | Slop Count | Structural Similarity | Details |")
        report_lines.append("|---|---|---|---|---|---|")
        for br in book_results:
            details = "<br>".join(br["issues"]) if br["issues"] else "All checks clear."
            report_lines.append(f"| `{br['name']}` | **{br['status']}** | {br['metrics']['words']} | {br['metrics']['slop']} | {br['metrics']['similarity']:.1%} | {details} |")
        report_lines.append("")

    if world_results:
        report_lines.append("#### Community Worlds Analysis")
        report_lines.append("| World Directory | Status | Total Nodes | Details |")
        report_lines.append("|---|---|---|---|")
        for wr in world_results:
            details = "<br>".join(wr["issues"]) if wr["issues"] else "All checks clear."
            report_lines.append(f"| `{wr['name']}` | **{wr['status']}** | {wr['metrics']['nodes']} | {details} |")
        report_lines.append("")

    # Add Tone Guides and Recommendations
    report_lines.append("### 🌸 Aiyami's Guide to Premium Writing Style")
    report_lines.append("To elevate your writing to our elite standards, please avoid these common machine habits:")
    for word, reason in BANNED_AI_PATTERNS.items():
        report_lines.append(f"- **`{word}`**: {reason}")

    # Write out report
    with open("aiyami-report.md", "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))

    print(f"Compliance check run successfully. Overall Pass: {overall_pass}")
    if not overall_pass:
        sys.exit(1)

if __name__ == "__main__":
    run_checks()
