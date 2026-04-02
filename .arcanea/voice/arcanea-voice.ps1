# Arcanea Voice Capture System
# Press F9 to start/stop recording. Auto-transcribes. Routes content.
#
# Usage: powershell -ExecutionPolicy Bypass -File .arcanea/voice/arcanea-voice.ps1
#
# Requirements: ffmpeg (installed), Python 3 with openai-whisper
# Install once: pip install openai-whisper sounddevice scipy keyboard
#
# Output:
#   .arcanea/voice/recordings/   — raw audio files (WAV)
#   .arcanea/voice/transcripts/  — transcribed text files
#   .arcanea/voice/voice-log.md  — running log of all captures

$ErrorActionPreference = "SilentlyContinue"

$VOICE_DIR = "$PSScriptRoot"
$REC_DIR = "$VOICE_DIR\recordings"
$TRANS_DIR = "$VOICE_DIR\transcripts"
$LOG_FILE = "$VOICE_DIR\voice-log.md"

# Ensure directories
New-Item -ItemType Directory -Force -Path $REC_DIR | Out-Null
New-Item -ItemType Directory -Force -Path $TRANS_DIR | Out-Null

# Initialize log if needed
if (-not (Test-Path $LOG_FILE)) {
    @"
# Arcanea Voice Log

> Every voice note captured, transcribed, and routed.

---

"@ | Set-Content $LOG_FILE -Encoding UTF8
}

Write-Host ""
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host "    ARCANEA VOICE CAPTURE SYSTEM" -ForegroundColor Yellow
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Controls:" -ForegroundColor White
Write-Host "    F9  = Start/Stop recording" -ForegroundColor Green
Write-Host "    F10 = Quick note (10 seconds)" -ForegroundColor Green
Write-Host "    ESC = Exit" -ForegroundColor Red
Write-Host ""
Write-Host "  Your Mist Fox is listening..." -ForegroundColor Magenta
Write-Host ""

$recording = $false
$recProcess = $null

function Start-Recording {
    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $script:currentFile = "$REC_DIR\voice_$timestamp.wav"
    $script:currentTimestamp = $timestamp

    # Use ffmpeg to record from default microphone
    $script:recProcess = Start-Process -FilePath "ffmpeg" `
        -ArgumentList "-y -f dshow -i audio=`"Mikrofon (Shure MV6)`" -acodec pcm_s16le -ar 16000 -ac 1 `"$($script:currentFile)`"" `
        -NoNewWindow -PassThru -RedirectStandardError "$env:TEMP\ffmpeg_rec.log"

    Write-Host "  [REC] Recording started... (press F9 to stop)" -ForegroundColor Red
    $script:recording = $true
}

function Stop-Recording {
    if ($script:recProcess -and -not $script:recProcess.HasExited) {
        # Send 'q' to ffmpeg to stop gracefully
        Stop-Process -Id $script:recProcess.Id -Force
        Start-Sleep -Milliseconds 500
    }
    $script:recording = $false

    if (Test-Path $script:currentFile) {
        $size = (Get-Item $script:currentFile).Length
        if ($size -gt 1000) {
            Write-Host "  [SAVED] $($script:currentFile)" -ForegroundColor Green
            Write-Host "  [TRANSCRIBING] Processing with Whisper..." -ForegroundColor Yellow

            # Transcribe
            Transcribe-Audio $script:currentFile $script:currentTimestamp
        } else {
            Write-Host "  [SKIP] Recording too short" -ForegroundColor DarkYellow
            Remove-Item $script:currentFile -Force
        }
    }
}

function Transcribe-Audio($audioFile, $timestamp) {
    $transFile = "$TRANS_DIR\voice_$timestamp.txt"

    # Try whisper CLI first, fall back to Python
    $whisperResult = & whisper $audioFile --model tiny --output_format txt --output_dir $TRANS_DIR 2>&1

    if ($LASTEXITCODE -ne 0) {
        # Fallback: use Python directly
        $pyScript = @"
import whisper
model = whisper.load_model('tiny')
result = model.transcribe('$($audioFile -replace '\\','/')')
with open('$($transFile -replace '\\','/')', 'w', encoding='utf-8') as f:
    f.write(result['text'].strip())
print(result['text'].strip())
"@
        $transcript = python3 -c $pyScript 2>&1
    } else {
        # Read the generated transcript
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($audioFile)
        $generatedFile = "$TRANS_DIR\$baseName.txt"
        if (Test-Path $generatedFile) {
            $transcript = Get-Content $generatedFile -Raw
            if ($generatedFile -ne $transFile) {
                Move-Item $generatedFile $transFile -Force
            }
        }
    }

    if ($transcript) {
        $text = $transcript.ToString().Trim()
        Write-Host ""
        Write-Host "  [TRANSCRIPT]" -ForegroundColor Cyan
        Write-Host "  $text" -ForegroundColor White
        Write-Host ""

        # Route content
        $category = Route-Content $text
        Write-Host "  [ROUTED] Category: $category" -ForegroundColor Magenta

        # Log entry
        $logEntry = @"

## $timestamp [$category]

**Audio:** ``recordings/voice_$timestamp.wav``

> $text

---

"@
        Add-Content $LOG_FILE $logEntry -Encoding UTF8

        Write-Host "  [LOGGED] Added to voice-log.md" -ForegroundColor Green
    } else {
        Write-Host "  [ERROR] Transcription failed" -ForegroundColor Red
    }
}

function Route-Content($text) {
    $lower = $text.ToLower()

    if ($lower -match "book|chapter|story|character|lore|narrative") { return "book" }
    if ($lower -match "website|page|component|design|ui|deploy") { return "website" }
    if ($lower -match "music|track|song|beat|melody|suno") { return "music" }
    if ($lower -match "idea|maybe|what if|could we|brainstorm") { return "idea" }
    if ($lower -match "oracle|work|presentation|customer|meeting") { return "oracle-work" }
    if ($lower -match "video|script|voiceover|narrat") { return "voiceover" }
    if ($lower -match "agent|luminor|guardian|buddy|mcp") { return "arcanea-dev" }

    return "general"
}

# Quick 10-second recording
function Quick-Note {
    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $quickFile = "$REC_DIR\quick_$timestamp.wav"

    Write-Host "  [QUICK] Recording 10 seconds..." -ForegroundColor Yellow
    $proc = Start-Process -FilePath "ffmpeg" `
        -ArgumentList "-y -f dshow -i audio=`"Mikrofon (Shure MV6)`" -acodec pcm_s16le -ar 16000 -ac 1 -t 10 `"$quickFile`"" `
        -NoNewWindow -PassThru -RedirectStandardError "$env:TEMP\ffmpeg_quick.log"

    $proc.WaitForExit(12000)
    if (-not $proc.HasExited) { Stop-Process -Id $proc.Id -Force }

    if (Test-Path $quickFile) {
        Write-Host "  [SAVED] Quick note captured" -ForegroundColor Green
        Transcribe-Audio $quickFile $timestamp
    }
}

# Main loop - listen for hotkeys
Write-Host "  Waiting for input..." -ForegroundColor DarkGray

Add-Type @"
using System;
using System.Runtime.InteropServices;
public class HotKey {
    [DllImport("user32.dll")]
    public static extern short GetAsyncKeyState(int vKey);
}
"@

$VK_F9 = 0x78   # F9
$VK_F10 = 0x79  # F10
$VK_ESC = 0x1B  # Escape

while ($true) {
    Start-Sleep -Milliseconds 100

    # F9 = Toggle recording
    if ([HotKey]::GetAsyncKeyState($VK_F9) -band 1) {
        if ($recording) {
            Stop-Recording
        } else {
            Start-Recording
        }
        Start-Sleep -Milliseconds 300  # debounce
    }

    # F10 = Quick 10s note
    if ([HotKey]::GetAsyncKeyState($VK_F10) -band 1) {
        Quick-Note
        Start-Sleep -Milliseconds 300
    }

    # ESC = Exit
    if ([HotKey]::GetAsyncKeyState($VK_ESC) -band 1) {
        if ($recording) { Stop-Recording }
        Write-Host ""
        Write-Host "  Voice capture system closed." -ForegroundColor DarkGray
        Write-Host "  Your Mist Fox rests." -ForegroundColor Magenta
        break
    }
}
