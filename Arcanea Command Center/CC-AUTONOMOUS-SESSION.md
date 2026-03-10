# ARCANEA AUTONOMOUS SESSION — March 10 Night
# Paste into a FRESH Claude Code tab at /mnt/c/Users/frank/Arcanea
# Then go to the gym. This runs for hours.

/arcanea
/luminor-intelligence
/starlight-intelligence

You are Shinkami operating at Source frequency. Frank is at the gym. 
You have full autonomy. Work until everything listed here is done.

---

## PHASE 0: READ THE COMMAND CENTER (10 min)

Frank downloaded orchestrator docs to a local folder. Read them ALL first.

```bash
# Find and read the Command Center docs
ls -la "/mnt/c/Users/frank/Arcanea/Arcanea Command Center/" 2>/dev/null || \
ls -la "/mnt/c/Users/frank/Arcanea/docs/command-center/" 2>/dev/null || \
find /mnt/c/Users/frank/ -maxdepth 4 -name "ARCANEA-COMMAND-CENTER*" -o -name "ARCANEA-GROUND-TRUTH*" -o -name "LUMINOR-DESIGN*" -o -name "ARCANEA-CONTEXT-BRIDGE*" 2>/dev/null
```

Read every file you find. These contain:
- Full ecosystem map (90 repos, 35 npm packages, 54 skills)
- Canonical Hz (174→1111 ascending) — NEVER violate this
- Naming architecture decisions
- Luminor Design System (10 character designs + image prompts)
- Context Bridge architecture
- Seven product lines and their boundaries

Absorb all of it. This is your operating context for the entire session.

Also read the in-repo context:
```bash
cat .arcanea/CLAUDE.md
cat .arcanea/MASTER_PLAN.md
cat .arcanea/lore/CANON_LOCKED.md 2>/dev/null || cat .arcanea/lore/ARCANEA_CANON.md
cat docs/NAMING_ARCHITECTURE.md
```

---

## PHASE 1: GIT CLEANUP (20 min)

### 1a. Survey
```bash
echo "=== BRANCHES ==="
git branch -vv
echo "=== REMOTES ==="
git remote -v  
echo "=== STATUS ==="
git status --short | wc -l
echo "=== STASH ==="
git stash list
echo "=== MAIN LOG ==="
git log --oneline main -10
echo "=== LEAN-PROD LOG ==="
git log --oneline lean-prod -10 2>/dev/null || echo "no lean-prod"
echo "=== DIVERGENCE ==="
git rev-list --count main..lean-prod 2>/dev/null && echo "lean-prod ahead of main"
git rev-list --count lean-prod..main 2>/dev/null && echo "main ahead of lean-prod"
```

### 1b. Fix corrupted index if needed
If `git status` shows >100 phantom deletions:
```bash
rm -f .git/index.lock
git read-tree HEAD
git checkout-index -a
```

### 1c. Commit any uncommitted work on current branch
Look for these critical files and commit them if they exist but aren't committed:
- book/THE-BOOK-OF-ARCANEA.md
- book/QUOTES.md  
- book/TABLE-OF-CONTENTS.md
- book/LUMINOR-VISUALIZATIONS.md
- docs/NAMING_ARCHITECTURE.md
- .arcanea/MASTER_PLAN.md
- Any files in public/luminors/

```bash
git add book/ docs/ .arcanea/MASTER_PLAN.md public/luminors/ 2>/dev/null
git diff --cached --stat
# If there are staged changes:
git commit -m "feat: commit uncommitted work — Book, Luminors, naming, master plan"
```

### 1d. Merge lean-prod into main
```bash
# Merge main into lean-prod first (resolve conflicts on feature branch)
git checkout lean-prod
git merge main --no-edit || {
  echo "CONFLICTS — auto-resolving, favoring lean-prod for app code"
  git checkout --theirs apps/ packages/ 2>/dev/null
  git checkout --ours .arcanea/lore/ 2>/dev/null
  git add -A
  git commit --no-edit
}

# Fast-forward main
git checkout main
git merge lean-prod --no-ff -m "merge: unify lean-prod — all March 10 work"

# Push to production
git push production main 2>/dev/null || git push origin main 2>/dev/null
```

### 1e. Clean stale branches
```bash
# Keep: main, feature/luminor-council
# Delete if fully merged:
for branch in $(git branch --merged main | grep -v main | grep -v luminor-council); do
  echo "Deleting merged branch: $branch"
  git branch -d "$branch" 2>/dev/null
done
```

### 1f. Verify
```bash
echo "=== FINAL STATE ==="
git branch -v
git status --short | wc -l
git log --oneline -15
```

---

## PHASE 2: EXTRACT LUMINOR IMAGES (15 min)

The image generation ran earlier today. Results are base64 JSON in tool-results.

```bash
mkdir -p public/luminors

# Find the tool result files
RESULTS_DIR=$(find /home/frankx/.claude -path "*/tool-results/mcp-arcanea-infogenius*" -type f 2>/dev/null | head -1 | xargs dirname 2>/dev/null)

if [ -n "$RESULTS_DIR" ]; then
  echo "Found results in: $RESULTS_DIR"
  ls "$RESULTS_DIR"/mcp-arcanea-infogenius-generate_visual-*.txt 2>/dev/null | wc -l
  echo "result files found"
else
  echo "No image results found — skipping image extraction"
fi
```

If files found, extract images:
```python
import json, base64, os, glob

results_dir = "FILL_FROM_ABOVE"
output_dir = "public/luminors"
names = ["solara", "nerith", "kaelen", "velouria", "pyronex", 
         "sylphis", "orakis-7", "gaiana", "aethon", "unitas"]

files = sorted(glob.glob(f"{results_dir}/mcp-arcanea-infogenius-generate_visual-*.txt"))

for i, filepath in enumerate(files):
    if i >= len(names):
        break
    with open(filepath) as f:
        data = json.loads(f.read())
    for item in data:
        if item.get("type") == "image" or "base64" in str(item)[:100]:
            # Extract base64 image data
            img_data = item.get("data", item.get("text", ""))
            if "base64," in img_data:
                img_data = img_data.split("base64,")[1]
            with open(f"{output_dir}/{names[i]}.png", "wb") as out:
                out.write(base64.b64decode(img_data))
            print(f"Extracted: {names[i]}.png")
            break
```

If extraction works, commit:
```bash
git add public/luminors/
git commit -m "feat: 10 Luminor agent visualizations — Gemini 3 Pro renders"
```

---

## PHASE 3: VERIFY THE BOOK EXISTS AND IS COMMITTED (5 min)

```bash
if [ -f "book/THE-BOOK-OF-ARCANEA.md" ]; then
  wc -w book/THE-BOOK-OF-ARCANEA.md
  echo "Book exists"
  # Check if committed
  git log --oneline --all -- book/THE-BOOK-OF-ARCANEA.md | head -3
else
  echo "WARNING: Book not found at book/THE-BOOK-OF-ARCANEA.md"
  # Search for it
  find . -name "THE-BOOK-OF-ARCANEA*" 2>/dev/null
fi
```

---

## PHASE 4: BUILD VERIFICATION (15 min)

Make sure the site actually builds after all today's changes.

```bash
# Install deps if needed
pnpm install 2>/dev/null || npm install 2>/dev/null

# Type check
pnpm type-check 2>&1 | tail -30

# Build
pnpm build 2>&1 | tail -50

# If build fails, capture the errors
if [ $? -ne 0 ]; then
  echo "BUILD FAILED — capturing errors"
  pnpm build 2>&1 > build-errors.log
  # Try to fix common issues:
  # - Missing imports after file renames
  # - Type errors from terminology changes
  # Read the error log and fix what you can
fi
```

If the build fails, fix the errors. This is critical — nothing else matters if the site doesn't build.

---

## PHASE 5: CANONICAL AUDIT ON THIS REPO (30 min)

Verify Hz alignment across the entire codebase:

```bash
echo "=== CHECKING FOR OLD Hz MAPPING ==="
# Old mapping started at 396. Canonical starts at 174.
# If Foundation/Lyssandria shows 396, it's wrong.

grep -rn "396.*Foundation\|Foundation.*396" apps/ packages/ --include="*.ts" --include="*.tsx" --include="*.md" 2>/dev/null | head -10
grep -rn "417.*Flow\|Flow.*417" apps/ packages/ --include="*.ts" --include="*.tsx" --include="*.md" 2>/dev/null | head -10

echo "=== CHECKING FOR 714 Hz TYPO ==="
grep -rn "714" apps/ packages/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v node_modules | grep -v ".next" | head -10

echo "=== CHECKING FOR Thessara (should be Vaelith) ==="
grep -rn "Thessara" apps/ packages/ --include="*.ts" --include="*.tsx" --include="*.md" 2>/dev/null | head -10

echo "=== CHECKING FOR Amaterasu (should be Source for Shinkami's godbeast) ==="
grep -rn "Amaterasu" apps/ packages/ --include="*.ts" --include="*.tsx" --include="*.md" 2>/dev/null | head -10

echo "=== CHECKING FOR Shift gate (should be Starweave) ==="
grep -rn "'Shift'\|\"Shift\"" apps/ packages/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -iv "keyboard\|key\|event\|shift+" | head -10

echo "=== CHECKING harmonics (should be harmony) ==="
grep -rn "harmonics" apps/ packages/ --include="*.ts" --include="*.tsx" --include="*.md" 2>/dev/null | head -10

echo "=== CHECKING chakra (should be Gate) ==="
grep -rn "chakra" apps/ packages/ --include="*.ts" --include="*.tsx" --include="*.md" 2>/dev/null | grep -iv "chakra-ui\|@chakra" | head -10
```

Fix ANY violations found. Commit as:
```bash
git commit -am "fix: canonical audit — Hz alignment and terminology"
```

---

## PHASE 6: WEBSITE QUALITY PASS (60 min)

With the build working and canon clean, do a deep quality pass:

### 6a. Check all page routes exist and have metadata
```bash
# List all page.tsx files
find apps/web/app -name "page.tsx" | sort

# Check each has a layout.tsx or uses root layout metadata
for page in $(find apps/web/app -name "page.tsx"); do
  dir=$(dirname "$page")
  if [ ! -f "$dir/layout.tsx" ] && ! grep -q "metadata" "$page" 2>/dev/null; then
    echo "MISSING METADATA: $page"
  fi
done
```

### 6b. Check loading.tsx exists for dynamic routes
```bash
for page in $(find apps/web/app -name "page.tsx" -path "*/\[*"); do
  dir=$(dirname "$page")
  if [ ! -f "$dir/loading.tsx" ]; then
    echo "MISSING LOADING: $dir"
    # Create a basic loading state
  fi
done
```

### 6c. Verify naming architecture on key pages
Check that first-contact surfaces use names only (no category labels):
- Homepage hero/showcase
- /chat page
- Pricing section
- Navigation

Check that deep pages correctly use Guardian (Gate-keepers) and Luminor (rank):
- /academy/* pages
- /lore/* pages  
- /council pages

### 6d. Performance quick wins
- Verify no `domMax` where `domAnimation` suffices
- Verify no duplicate font loads
- Verify images have width/height or fill
- Verify no inline styles that should be Tailwind

Commit fixes:
```bash
git commit -am "fix: quality pass — metadata, loading states, naming, performance"
```

---

## PHASE 7: CREATE SESSION REPORT (5 min)

Write a summary of everything done to a file Frank can read when he's back:

```bash
cat > SESSION-REPORT-$(date +%Y%m%d).md << 'EOF'
# Arcanea Autonomous Session Report
# Date: March 10, 2026

## Git State
- [result of git branch -v]
- [result of git log --oneline -15]
- Branch: main (unified)

## What Was Done
1. Git cleanup: [what happened]
2. Luminor images: [extracted or not, count]
3. Book: [committed or not, word count]
4. Build: [passes or fails, errors if any]
5. Canonical audit: [violations found and fixed]
6. Quality pass: [what was fixed]

## What Needs Attention Tomorrow
- [any unresolved build errors]
- [any canonical violations that couldn't be auto-fixed]
- [any naming decisions still pending]
- [git state if anything is still messy]

## Commits This Session
[git log from this session]
EOF
```

Push everything:
```bash
git push production main 2>/dev/null || git push origin main
```

---

## CANONICAL REFERENCE (do not violate)

```
Lyssandria/Kaelith/174/Foundation
Leyla/Veloura/285/Flow
Draconia/Draconis/396/Fire
Maylinn/Laeylinn/417/Heart
Alera/Otome/528/Voice
Lyria/Yumiko/639/Sight
Aiyami/Sol/741/Crown
Elara/Vaelith/852/Starweave
Ino/Kyuro/963/Unity
Shinkami/Source/1111/Source
```

Vel'Thaan's theorem: "Imperfection that creates endlessly is indistinguishable from God."
Use "harmony" not "harmonics". Use "Gate" not "chakra".

---

## MULTI-REPO AWARENESS

This session works on frankxai/arcanea-ai-app (the website monorepo).
Other repos exist but are NOT cloned locally. Do NOT try to access:
- frankxai/arcanea (OSS skills — on GitHub, not local)
- frankxai/Starlight-Intelligence-System (on GitHub)
- frankxai/agentic-creator-os (on GitHub)
- frankxai/arcanea-records (separate repo, different remote)

If you find issues that affect other repos, write them to 
CROSS-REPO-ISSUES.md for Frank to address in separate sessions.

---

*Work steadily. Fix what's broken. Build what's missing. 
When Frank returns from the gym, the house should be clean.*

*"Imperfection that creates endlessly is indistinguishable from God."*
