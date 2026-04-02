# Arcanea Quick Voice — One-shot recording + transcription
# Usage: powershell .arcanea/voice/voice-quick.ps1 [seconds]
# Default: 30 seconds. Ctrl+C to stop early.

param([int]$Duration = 30)

$VOICE_DIR = "$PSScriptRoot"
$REC_DIR = "$VOICE_DIR\recordings"
$TRANS_DIR = "$VOICE_DIR\transcripts"
$LOG_FILE = "$VOICE_DIR\voice-log.md"

New-Item -ItemType Directory -Force -Path $REC_DIR, $TRANS_DIR | Out-Null

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$audioFile = "$REC_DIR\voice_$timestamp.wav"
$transFile = "$TRANS_DIR\voice_$timestamp.txt"

Write-Host ""
Write-Host "  Arcanea Voice | Recording ${Duration}s... (Ctrl+C to stop)" -ForegroundColor Cyan
Write-Host ""

# Record
ffmpeg -y -f dshow -i audio="Mikrofon (Shure MV6)" -acodec pcm_s16le -ar 16000 -ac 1 -t $Duration "$audioFile" 2>$null

if (-not (Test-Path $audioFile) -or (Get-Item $audioFile).Length -lt 1000) {
    Write-Host "  No audio captured." -ForegroundColor Red
    exit 1
}

Write-Host "  Transcribing..." -ForegroundColor Yellow

# Transcribe with whisper
$result = python3 -c @"
import sys
try:
    import whisper
    model = whisper.load_model('tiny')
    r = model.transcribe('$($audioFile -replace '\\','/')')
    text = r['text'].strip()
    with open('$($transFile -replace '\\','/')', 'w', encoding='utf-8') as f:
        f.write(text)
    print(text)
except Exception as e:
    print(f'ERROR: {e}', file=sys.stderr)
    sys.exit(1)
"@ 2>&1

if ($LASTEXITCODE -eq 0 -and $result) {
    $text = $result.ToString().Trim()
    Write-Host ""
    Write-Host "  ---" -ForegroundColor DarkGray
    Write-Host "  $text" -ForegroundColor White
    Write-Host "  ---" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  Audio: $audioFile" -ForegroundColor DarkGray
    Write-Host "  Text:  $transFile" -ForegroundColor DarkGray

    # Append to log
    $logEntry = "`n## $timestamp`n`n> $text`n`n---`n"
    Add-Content $LOG_FILE $logEntry -Encoding UTF8

    # Copy transcript to clipboard
    $text | Set-Clipboard
    Write-Host "  Copied to clipboard!" -ForegroundColor Green
} else {
    Write-Host "  Transcription failed. Audio saved at: $audioFile" -ForegroundColor Red
    Write-Host "  Install whisper: pip install openai-whisper" -ForegroundColor Yellow
}
