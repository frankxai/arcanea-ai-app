---
description: "Manage ArcaneaClaw media engine — start/stop daemon, run pipeline, check status, process media, view inbox"
thinking: false
---

# ArcaneaClaw Engine Control

You have direct control over the ArcaneaClaw media processing daemon. Parse the user's subcommand and execute the appropriate operations.

## Environment Setup

ArcaneaClaw expects these paths (configure for your installation):

- **Engine directory**: `~/arcanea-claw/`
- **Python venv**: `~/arcanea-claw/venv/`
- **Config**: `~/arcanea-claw/config.yaml`
- **PID file**: `~/arcanea-claw/arcanea-claw.pid`
- **Logs**: `~/arcanea-claw/logs/daemon.log`
- **Health endpoint**: `http://localhost:8080/health`

Environment activation (run before any Python command):
```bash
source ~/arcanea-claw/.env 2>/dev/null
source ~/arcanea-claw/venv/bin/activate
export PYTHONPATH=~/arcanea-claw:$PYTHONPATH
export ARCANEA_CLAW_CONFIG=~/arcanea-claw/config.yaml
```

## Subcommands

Parse `$ARGUMENTS` for the subcommand. If no subcommand is given, run `status`.

### `status`
Check daemon health and show current state.
```bash
# Check PID
if [ -f ~/arcanea-claw/arcanea-claw.pid ]; then
  PID=$(cat ~/arcanea-claw/arcanea-claw.pid)
  ps -p $PID -o pid,rss,etime,args --no-headers 2>/dev/null && echo "RUNNING (PID $PID)" || echo "NOT RUNNING (stale PID)"
else
  echo "NOT RUNNING (no PID file)"
fi

# Health endpoint
curl -s --max-time 3 http://localhost:8080/health | python3 -m json.tool 2>/dev/null || echo "Health endpoint not responding"
```

### `start`
```bash
bash ~/arcanea-claw/run.sh start
```

### `stop`
```bash
bash ~/arcanea-claw/run.sh stop
```

### `restart`
```bash
bash ~/arcanea-claw/run.sh restart
```

### `run`
Trigger an immediate full pipeline run (standalone, does not require the daemon):
```bash
cd ~/arcanea-claw && python3 -c "
import asyncio
from engine.daemon import load_config, run_pipeline
config = load_config()
results = asyncio.run(run_pipeline(config))
for r in results:
    status = r['status'].upper()
    elapsed = r.get('elapsed_s', '-')
    print(f'  [{status}] {r[\"skill\"]} ({elapsed}s)')
print(f'\nTotal: {len(results)} skills, {sum(1 for r in results if r[\"status\"]==\"error\")} errors')
"
```

### `scan`
Run only the media scan skill to discover new files:
```bash
cd ~/arcanea-claw && python3 -c "
from engine.skills.media_scan import run
from engine.daemon import load_config
from engine import supabase_client as db
config = load_config()
result = run(config, db.get_client())
print(result)
"
```

### `classify`
Run only the classify skill on unclassified assets:
```bash
cd ~/arcanea-claw && python3 -c "
import os, google.generativeai as genai
from engine.skills.media_classify import run
from engine.daemon import load_config
from engine import supabase_client as db
genai.configure(api_key=os.environ['GEMINI_API_KEY'])
model = genai.GenerativeModel('gemini-2.0-flash')
config = load_config()
result = run(config, db.get_client(), gemini_model=model)
print(result)
"
```

### `inbox`
Show asset counts by pipeline status:
```bash
cd ~/arcanea-claw && python3 -c "
from engine import supabase_client as db
c = db.get_client()
total = len(c.table('asset_metadata').select('id', count='exact').execute().data or [])
new = len(c.table('asset_metadata').select('id').is_('classified_at', 'null').execute().data or [])
classified = len(c.table('asset_metadata').select('id').not_.is_('classified_at', 'null').is_('processed_at', 'null').execute().data or [])
processed = len(c.table('asset_metadata').select('id').not_.is_('processed_at', 'null').is_('taste_score', 'null').execute().data or [])
scored = len(c.table('asset_metadata').select('id').not_.is_('taste_score', 'null').is_('uploaded_at', 'null').execute().data or [])
uploaded = len(c.table('asset_metadata').select('id').not_.is_('uploaded_at', 'null').execute().data or [])
print(f'Total: {total} | New: {new} | Classified: {classified} | Processed: {processed} | Scored: {scored} | Uploaded: {uploaded}')
"
```

### `heroes`
Show all hero-tier assets (TASTE score 80+):
```bash
cd ~/arcanea-claw && python3 -c "
from engine import supabase_client as db
c = db.get_client()
heroes = c.table('asset_metadata').select('id,file_path,guardian,element,taste_score,content_type').gte('taste_score', 80).order('taste_score', desc=True).execute().data or []
for h in heroes:
    print(f'  [{h[\"taste_score\"]}] {h.get(\"guardian\", \"?\")} / {h.get(\"element\", \"?\")} -- {h.get(\"content_type\", \"?\")} -- {h[\"file_path\"]}')
print(f'Total heroes: {len(heroes)}')
"
```

### `approve <ids>`
Approve specific assets by comma-separated ID:
```bash
cd ~/arcanea-claw && python3 -c "
from engine import supabase_client as db
ids = '$IDS'.split(',')
c = db.get_client()
for aid in ids:
    c.table('asset_metadata').update({'approved': True}).eq('id', aid.strip()).execute()
    print(f'Approved: {aid.strip()}')
"
```
Replace `$IDS` with the user-provided comma-separated asset IDs.

### `stats`
Full dashboard statistics (guardian coverage, element distribution, tier breakdown):
```bash
cd ~/arcanea-claw && python3 -c "
from engine import supabase_client as db
c = db.get_client()
all_assets = c.table('asset_metadata').select('guardian,element,taste_score,content_type').execute().data or []
guardians, elements, tiers, types = {}, {}, {'hero':0,'gallery':0,'thumbnail':0,'reject':0,'unscored':0}, {}
for a in all_assets:
    g = a.get('guardian') or 'Unassigned'; guardians[g] = guardians.get(g,0)+1
    e = a.get('element') or 'Unassigned'; elements[e] = elements.get(e,0)+1
    ct = a.get('content_type') or 'unknown'; types[ct] = types.get(ct,0)+1
    s = a.get('taste_score')
    if s is None: tiers['unscored']+=1
    elif s>=80: tiers['hero']+=1
    elif s>=60: tiers['gallery']+=1
    elif s>=40: tiers['thumbnail']+=1
    else: tiers['reject']+=1
print('Guardians:', guardians)
print('Elements:', elements)
print('Tiers:', tiers)
print('Types:', types)
print(f'Total: {len(all_assets)}')
"
```

### `social`
Show social publishing queue status:
```bash
cd ~/arcanea-claw && python3 -c "
from engine import supabase_client as db
c = db.get_client()
queue = c.table('social_queue').select('*').order('created_at', desc=True).limit(20).execute().data or []
pending = [q for q in queue if not q.get('published_at')]
print(f'Pending: {len(pending)} | Published: {len(queue)-len(pending)}')
for q in pending[:10]:
    print(f'  [{q.get(\"platform\",\"?\")}] {q.get(\"guardian\",\"?\")} -- {(q.get(\"caption\",\"\") or \"\")[:60]}')
"
```

### `logs`
Show recent daemon log entries:
```bash
tail -50 ~/arcanea-claw/logs/daemon.log 2>/dev/null || echo "No log file found"
```

## Architecture Reference

ArcaneaClaw runs an 8-skill pipeline every 15 minutes:

```
scan -> classify -> dedup -> process -> taste_score -> upload -> social_prep -> notify
```

**Key concepts:**
- **TASTE Score**: 5 dimensions x 20 points = 100 total (Canon Alignment, Design Compliance, Emotional Impact, Technical Fit, Uniqueness)
- **Quality Tiers**: hero (80+), gallery (60-79), thumbnail (40-59), reject (<40)
- **Supabase Tables**: `agent_registry`, `asset_metadata`, `social_queue`, `publish_pipeline`
- **AI Model**: Gemini 2.0 Flash for both classification and scoring
- **Health Endpoint**: `http://localhost:8080/health` serves daemon state as JSON

## Response Format

Present results in structured tables. Use status indicators (RUNNING / STOPPED / ERROR). Highlight hero-tier assets and errors. The database is queryable even when the daemon is stopped.
