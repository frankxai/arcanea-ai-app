"""
Arcanea Voice — System Tray Recorder
Click the tray icon to start/stop recording from anywhere.
Right-click for mode selection and management.

Run: pythonw .arcanea/scripts/voice/voice-tray.pyw
Or: python .arcanea/scripts/voice/voice-tray.pyw
"""

import subprocess
import sys
import os
import threading
import time
from pathlib import Path

try:
    import pystray
    from PIL import Image, ImageDraw
except ImportError:
    print("Install: pip install pystray pillow")
    sys.exit(1)

# Config
VOICE_SCRIPT = Path(r"C:\Users\frank\Arcanea\.arcanea\scripts\voice\voice.ps1")
CONTENT_DIR = Path(r"C:\Users\frank\Arcanea\content\voice")

# State
recording = False
current_process = None
current_mode = "note"

def create_icon(color="green"):
    """Create a simple colored circle icon."""
    img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    colors = {
        "green": (127, 255, 212),   # Atlantean teal (idle)
        "red": (255, 59, 48),       # Recording
        "yellow": (255, 210, 0),    # Processing
    }
    c = colors.get(color, colors["green"])
    draw.ellipse([8, 8, 56, 56], fill=c)
    if color == "red":
        # Recording dot
        draw.ellipse([24, 24, 40, 40], fill=(200, 0, 0))
    return img

def run_voice(mode, duration=None):
    """Run voice.ps1 in a subprocess."""
    global recording, current_process
    args = ["powershell", "-ExecutionPolicy", "Bypass", "-File", str(VOICE_SCRIPT), mode]
    if duration:
        args.append(str(duration))

    recording = True
    current_process = subprocess.Popen(
        args,
        creationflags=subprocess.CREATE_NEW_CONSOLE
    )
    current_process.wait()
    recording = False
    current_process = None

def on_click(icon, item):
    """Left-click: quick note."""
    if recording:
        # Stop by killing the process
        if current_process:
            current_process.terminate()
        return
    t = threading.Thread(target=run_voice, args=(current_mode,), daemon=True)
    t.start()

def make_mode_setter(mode):
    def setter(icon, item):
        global current_mode
        current_mode = mode
        icon.notify(f"Mode: {mode}", "Arcanea Voice")
    return setter

def open_folder(icon, item):
    os.startfile(str(CONTENT_DIR))

def show_list(icon, item):
    subprocess.Popen(
        ["powershell", "-ExecutionPolicy", "Bypass", "-File", str(VOICE_SCRIPT), "list"],
        creationflags=subprocess.CREATE_NEW_CONSOLE
    )

def review_last(icon, item):
    subprocess.Popen(
        ["powershell", "-ExecutionPolicy", "Bypass", "-File", str(VOICE_SCRIPT), "review"],
        creationflags=subprocess.CREATE_NEW_CONSOLE
    )

def play_last(icon, item):
    subprocess.Popen(
        ["powershell", "-ExecutionPolicy", "Bypass", "-File", str(VOICE_SCRIPT), "play"],
        creationflags=subprocess.CREATE_NEW_CONSOLE
    )

def quit_app(icon, item):
    if current_process:
        current_process.terminate()
    icon.stop()

def setup(icon):
    icon.visible = True
    icon.notify("Voice OS ready. Click to record.", "Arcanea Voice")

# Build menu
menu = pystray.Menu(
    pystray.MenuItem("Quick Note (click)", on_click, default=True),
    pystray.Menu.SEPARATOR,
    pystray.MenuItem("Mode", pystray.Menu(
        pystray.MenuItem("Note", make_mode_setter("note")),
        pystray.MenuItem("Strategy", make_mode_setter("strategy")),
        pystray.MenuItem("Agent Dispatch", make_mode_setter("agent")),
        pystray.MenuItem("Reading", make_mode_setter("reading")),
        pystray.MenuItem("Newsletter", make_mode_setter("newsletter")),
        pystray.MenuItem("Voiceover", make_mode_setter("voiceover")),
        pystray.MenuItem("Arcanea Content", make_mode_setter("arcanea")),
    )),
    pystray.Menu.SEPARATOR,
    pystray.MenuItem("Play Last", play_last),
    pystray.MenuItem("Review QC", review_last),
    pystray.MenuItem("List All", show_list),
    pystray.MenuItem("Open Folder", open_folder),
    pystray.Menu.SEPARATOR,
    pystray.MenuItem("Quit", quit_app),
)

# Run
icon = pystray.Icon(
    "arcanea-voice",
    create_icon("green"),
    "Arcanea Voice — Click to record",
    menu
)
icon.run(setup)
