# Arcanea Voice — Groq Cloud Transcription (FREE, instant, no install)
# Usage: powershell .arcanea/voice/voice-groq.ps1 [seconds]
# Requires: GROQ_API_KEY env variable (free at console.groq.com)
# Falls back to local whisper if no API key

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

# Record from Shure MV6
ffmpeg -y -f dshow -i audio="Mikrofon (Shure MV6)" -acodec pcm_s16le -ar 16000 -ac 1 -t $Duration "$audioFile" 2>$null

if (-not (Test-Path $audioFile) -or (Get-Item $audioFile).Length -lt 1000) {
    Write-Host "  No audio captured." -ForegroundColor Red
    exit 1
}

$fileSize = [math]::Round((Get-Item $audioFile).Length / 1024)
Write-Host "  Captured ${fileSize}KB | Transcribing..." -ForegroundColor Yellow

$GROQ_KEY = $env:GROQ_API_KEY

if ($GROQ_KEY) {
    # Use Groq's free Whisper API (whisper-large-v3-turbo, instant)
    $boundary = [System.Guid]::NewGuid().ToString()
    $fileBytes = [System.IO.File]::ReadAllBytes($audioFile)
    $fileB64 = [Convert]::ToBase64String($fileBytes)

    # Build multipart form
    $body = @"
--$boundary
Content-Disposition: form-data; name="file"; filename="voice.wav"
Content-Type: audio/wav

$(Get-Content $audioFile -Raw -AsByteStream | ForEach-Object { [char]$_ })
--$boundary
Content-Disposition: form-data; name="model"

whisper-large-v3-turbo
--$boundary
Content-Disposition: form-data; name="response_format"

text
--$boundary--
"@

    # Simpler: use curl
    $result = & curl -s "https://api.groq.com/openai/v1/audio/transcriptions" `
        -H "Authorization: Bearer $GROQ_KEY" `
        -F "file=@$audioFile" `
        -F "model=whisper-large-v3-turbo" `
        -F "response_format=text" 2>&1

    if ($result -and $result.Length -gt 0 -and -not ($result -match "error")) {
        $text = $result.Trim()
        $text | Set-Content $transFile -Encoding UTF8
        Write-Host ""
        Write-Host "  ---" -ForegroundColor DarkGray
        Write-Host "  $text" -ForegroundColor White
        Write-Host "  ---" -ForegroundColor DarkGray
        Write-Host "  [Groq whisper-large-v3-turbo]" -ForegroundColor DarkGray

        # Log + clipboard
        "`n## $timestamp`n`n> $text`n`n---`n" | Add-Content $LOG_FILE -Encoding UTF8
        $text | Set-Clipboard
        Write-Host "  Copied to clipboard!" -ForegroundColor Green
    } else {
        Write-Host "  Groq API error: $result" -ForegroundColor Red
        Write-Host "  Audio saved at: $audioFile" -ForegroundColor Yellow
    }
} else {
    # Try local whisper
    Write-Host "  No GROQ_API_KEY. Trying local whisper..." -ForegroundColor DarkYellow

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
except ImportError:
    print('WHISPER_NOT_INSTALLED', file=sys.stderr)
    sys.exit(1)
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

        "`n## $timestamp`n`n> $text`n`n---`n" | Add-Content $LOG_FILE -Encoding UTF8
        $text | Set-Clipboard
        Write-Host "  Copied to clipboard!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "  Transcription not available yet." -ForegroundColor Red
        Write-Host "  Options:" -ForegroundColor Yellow
        Write-Host "    1. Set GROQ_API_KEY (free at console.groq.com)" -ForegroundColor White
        Write-Host "    2. Wait for: pip install openai-whisper" -ForegroundColor White
        Write-Host "  Audio saved at: $audioFile" -ForegroundColor DarkGray
    }
}
