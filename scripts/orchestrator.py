#!/usr/bin/env python3
"""Multi-terminal agent orchestrator for shared task and memory coordination."""
import argparse, json, subprocess, sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TASKS_DIR = ROOT / "tasks"
ACTIVE_MD = TASKS_DIR / "active.md"
AGENTS_JSON = TASKS_DIR / "agents.json"
MEMSEARCH = ROOT / "scripts" / "memsearch-sqlite.py"
VECTORS_DB = Path.home() / ".memsearch" / "vectors.db"


def load_agents() -> dict:
    with open(AGENTS_JSON) as f:
        return json.load(f)


def save_agents(data: dict):
    with open(AGENTS_JSON, "w") as f:
        json.dump(data, f, indent=2)


def parse_tasks() -> tuple[list[dict], list[dict]]:
    """Parse active.md into queue and completed lists."""
    text = ACTIVE_MD.read_text()
    queue, completed, section = [], [], None
    for line in text.splitlines():
        if line.strip().startswith("## Queue"):
            section = "queue"
        elif line.strip().startswith("## Completed"):
            section = "completed"
        elif line.startswith("|") and section:
            cols = [c.strip() for c in line.split("|")[1:-1]]
            if not cols or cols[0] in ("#", "---", ""):
                continue
            if section == "queue" and len(cols) >= 5:
                queue.append(dict(id=int(cols[0]), task=cols[1], agent=cols[2],
                                  priority=cols[3], status=cols[4]))
            elif section == "completed" and len(cols) >= 4:
                completed.append(dict(id=int(cols[0]), task=cols[1], agent=cols[2],
                                      completed=cols[3]))
    return queue, completed


def write_tasks(queue: list[dict], completed: list[dict]):
    lines = ["# Active Tasks", "", "## Queue",
             "| # | Task | Agent | Priority | Status |",
             "|---|------|-------|----------|--------|"]
    for t in queue:
        lines.append(f"| {t['id']} | {t['task']} | {t['agent']} | {t['priority']} | {t['status']} |")
    lines += ["", "## Completed", "| # | Task | Agent | Completed |",
              "|---|------|-------|-----------|"]
    for t in completed:
        lines.append(f"| {t['id']} | {t['task']} | {t['agent']} | {t['completed']} |")
    ACTIVE_MD.write_text("\n".join(lines) + "\n")


def next_id(queue, completed) -> int:
    return max((t["id"] for t in queue + completed), default=0) + 1


def now_stamp() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M")


def update_agent(name: str, status: str, task_id=None):
    data = load_agents()
    for a in data["agents"]:
        if a["name"] == name:
            a["status"], a["current_task"], a["last_active"] = status, task_id, now_stamp()
            break
    save_agents(data)

# --- Commands ---

def cmd_add(args):
    queue, completed = parse_tasks()
    tid = next_id(queue, completed)
    agent = args.agent or "unassigned"
    queue.append(dict(id=tid, task=args.description, agent=agent,
                      priority=args.priority, status="pending"))
    write_tasks(queue, completed)
    if agent != "unassigned":
        update_agent(agent, "assigned", tid)
    print(f"Task #{tid} added: {args.description} [{args.priority}] -> {agent}")


def cmd_assign(args):
    queue, completed = parse_tasks()
    for t in queue:
        if t["id"] == args.task_id:
            old = t["agent"]
            t["agent"], t["status"] = args.agent, "assigned"
            write_tasks(queue, completed)
            if old != "unassigned":
                update_agent(old, "idle")
            update_agent(args.agent, "working", args.task_id)
            print(f"Task #{args.task_id} assigned to {args.agent}")
            return
    print(f"Task #{args.task_id} not found."); sys.exit(1)


def cmd_complete(args):
    queue, completed = parse_tasks()
    for i, t in enumerate(queue):
        if t["id"] == args.task_id:
            done = queue.pop(i)
            completed.append(dict(id=done["id"], task=done["task"],
                                  agent=done["agent"], completed=now_stamp()))
            write_tasks(queue, completed)
            if done["agent"] != "unassigned":
                update_agent(done["agent"], "idle")
            print(f"Task #{args.task_id} completed.")
            return
    print(f"Task #{args.task_id} not found."); sys.exit(1)


def cmd_list(_args):
    queue, completed = parse_tasks()
    if not queue and not completed:
        print("No tasks."); return
    if queue:
        PRI = {"high": "\033[91mhigh\033[0m", "medium": "\033[93mmedium\033[0m",
               "low": "\033[92mlow\033[0m"}
        print(f"\n{'#':>3}  {'Priority':<8}  {'Status':<10}  {'Agent':<14}  Task")
        print("  " + "-" * 70)
        for t in queue:
            pri = PRI.get(t["priority"], t["priority"])
            print(f"  {t['id']:>2}  {pri:<17}  {t['status']:<10}  {t['agent']:<14}  {t['task']}")
    if completed:
        print(f"\n  Completed: {len(completed)} task(s)")


def cmd_status(_args):
    data = load_agents()
    queue, completed = parse_tasks()
    COLORS = {"idle": "\033[92m", "working": "\033[93m", "assigned": "\033[96m"}
    print("\n  AGENT ORCHESTRATOR STATUS")
    print("  " + "=" * 62)
    print(f"  {'Agent':<14} {'Model':<16} {'Status':<10} {'Task':<6} Last Active")
    print("  " + "-" * 62)
    for a in data["agents"]:
        c = COLORS.get(a["status"], "")
        print(f"  {a['name']:<14} {a['model']:<16} {c}{a['status']:<10}\033[0m "
              f"{str(a.get('current_task') or '-'):<6} {a.get('last_active') or '-'}")
    print("  " + "-" * 62)
    pending = sum(1 for t in queue if t["status"] == "pending")
    active = sum(1 for t in queue if t["status"] in ("assigned", "working"))
    print(f"  Tasks: {len(queue)} queued ({pending} pending, {active} active), "
          f"{len(completed)} completed")
    db_size = f"{VECTORS_DB.stat().st_size / 1024:.0f} KB" if VECTORS_DB.exists() else "missing"
    print(f"  Memory DB: {db_size} ({VECTORS_DB})\n")


def cmd_reindex(args):
    if not MEMSEARCH.exists():
        print(f"memsearch-sqlite.py not found at {MEMSEARCH}"); sys.exit(1)
    print(f"Re-indexing {args.path} ...")
    r = subprocess.run([sys.executable, str(MEMSEARCH), "index", args.path],
                       capture_output=True, text=True)
    if r.returncode == 0:
        print(f"Done. {r.stdout.strip()}")
    else:
        print(f"Error: {r.stderr.strip()}"); sys.exit(1)


def main():
    p = argparse.ArgumentParser(description="Multi-agent task orchestrator")
    sub = p.add_subparsers(dest="command", required=True)
    a = sub.add_parser("add", help="Add a task")
    a.add_argument("description"); a.add_argument("--agent", "-a")
    a.add_argument("--priority", "-p", choices=["high", "medium", "low"], default="medium")
    a.set_defaults(func=cmd_add)
    a = sub.add_parser("assign", help="Assign task to agent")
    a.add_argument("task_id", type=int); a.add_argument("agent")
    a.set_defaults(func=cmd_assign)
    a = sub.add_parser("complete", help="Mark task complete")
    a.add_argument("task_id", type=int); a.set_defaults(func=cmd_complete)
    a = sub.add_parser("list", help="List all tasks"); a.set_defaults(func=cmd_list)
    a = sub.add_parser("status", help="Show dashboard"); a.set_defaults(func=cmd_status)
    a = sub.add_parser("reindex", help="Re-index into memory DB")
    a.add_argument("path"); a.set_defaults(func=cmd_reindex)
    args = p.parse_args()
    TASKS_DIR.mkdir(parents=True, exist_ok=True)
    args.func(args)


if __name__ == "__main__":
    main()
