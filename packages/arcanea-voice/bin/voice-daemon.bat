@echo off
REM ================================================================
REM arcanea-voice daemon — Windows launcher
REM
REM Properly quotes the device name (which contains spaces and parens)
REM so ffmpeg dshow accepts it. The startup shortcut points at this
REM file, and you can also run it manually for tonight.
REM
REM Override the device by setting ARCANEA_VOICE_DEVICE env var, e.g.:
REM   set ARCANEA_VOICE_DEVICE=audio=Microphone Array (Realtek)
REM   voice-daemon.bat
REM ================================================================

set "ARCANEA_VOICE_REPO=C:\Users\frank\Arcanea"
if not defined ARCANEA_VOICE_DEVICE set "ARCANEA_VOICE_DEVICE=audio=Mikrofon (Logitech BRIO)"
if not defined ARCANEA_VOICE_PERSONA set "ARCANEA_VOICE_PERSONA=lumina"

cd /d "%ARCANEA_VOICE_REPO%"

REM Run silently (no log spam) — uncomment the second line for diagnostic logs
node "%ARCANEA_VOICE_REPO%\packages\arcanea-voice\bin\voice-daemon.mjs" --persona %ARCANEA_VOICE_PERSONA% --device "%ARCANEA_VOICE_DEVICE%" --silent
REM node "%ARCANEA_VOICE_REPO%\packages\arcanea-voice\bin\voice-daemon.mjs" --persona %ARCANEA_VOICE_PERSONA% --device "%ARCANEA_VOICE_DEVICE%" >> "%ARCANEA_VOICE_REPO%\.arcanea\voice-daemon.log" 2>&1
