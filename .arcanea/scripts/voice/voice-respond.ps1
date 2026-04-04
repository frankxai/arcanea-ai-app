# Arcanea Voice Respond - AI speaks back to you
# Uses: ElevenLabs (best) > OpenAI TTS (good) > Edge TTS (free)
#
# Usage: voice-respond "Your coaching text here"
# Or pipe: echo "text" | voice-respond

param(
    [Parameter(Position=0, ValueFromPipeline=$true)] [string] $Text = "",
    [string] $Voice = "auto"
)

$ErrorActionPreference = "SilentlyContinue"
$ELEVEN_KEY = $env:ELEVENLABS_API_KEY
if (-not $ELEVEN_KEY) { $ELEVEN_KEY = [System.Environment]::GetEnvironmentVariable("ELEVENLABS_API_KEY", "User") }
$OPENAI_KEY = $env:OPENAI_API_KEY
if (-not $OPENAI_KEY) { $OPENAI_KEY = [System.Environment]::GetEnvironmentVariable("OPENAI_API_KEY", "User") }

$outFile = "$env:TEMP\arcanea_voice_response.mp3"

if (-not $Text) {
    Write-Host "  Usage: voice-respond 'Your text here'" -ForegroundColor DarkYellow
    exit 1
}

# ─── TTS Backends (best first) ───────────────────────────────────────────

$backend = "none"

# 1. ElevenLabs (best quality)
if ($ELEVEN_KEY -and $backend -eq "none") {
    $voiceId = "pNInz6obpgDQGcFmaJgB"  # Adam - deep, warm, authoritative
    if ($Voice -eq "female") { $voiceId = "21m00Tcm4TlvDq8ikWAM" } # Rachel
    if ($Voice -eq "british") { $voiceId = "29vD33N1CtxCmqQRPOHJ" } # Drew

    $body = @{ text = $Text; model_id = "eleven_turbo_v2_5" } | ConvertTo-Json
    try {
        Invoke-WebRequest -Uri "https://api.elevenlabs.io/v1/text-to-speech/$voiceId" `
            -Method POST -Headers @{ "xi-api-key" = $ELEVEN_KEY; "Content-Type" = "application/json" } `
            -Body $body -OutFile $outFile -ErrorAction Stop
        if ((Test-Path $outFile) -and (Get-Item $outFile).Length -gt 1000) {
            $backend = "elevenlabs"
        }
    } catch {}
}

# 2. OpenAI TTS (good quality)
if ($OPENAI_KEY -and $backend -eq "none") {
    $oaiVoice = "onyx"  # Deep, warm, authoritative
    if ($Voice -eq "female") { $oaiVoice = "nova" }
    if ($Voice -eq "soft") { $oaiVoice = "shimmer" }

    $body = @{ model = "tts-1-hd"; input = $Text; voice = $oaiVoice } | ConvertTo-Json
    try {
        Invoke-WebRequest -Uri "https://api.openai.com/v1/audio/speech" `
            -Method POST -Headers @{ "Authorization" = "Bearer $OPENAI_KEY"; "Content-Type" = "application/json" } `
            -Body $body -OutFile $outFile -ErrorAction Stop
        if ((Test-Path $outFile) -and (Get-Item $outFile).Length -gt 1000) {
            $backend = "openai"
        }
    } catch {}
}

# 3. Edge TTS (free, always works)
if ($backend -eq "none") {
    $edgeVoice = "en-US-AndrewMultilingualNeural"
    if ($Voice -eq "female") { $edgeVoice = "en-US-AvaMultilingualNeural" }
    if ($Voice -eq "british") { $edgeVoice = "en-GB-RyanNeural" }

    & edge-tts --voice $edgeVoice --text $Text --write-media $outFile 2>$null
    if ((Test-Path $outFile) -and (Get-Item $outFile).Length -gt 500) {
        $backend = "edge-tts"
    }
}

if ($backend -eq "none") {
    Write-Host "  No TTS backend available." -ForegroundColor Red
    exit 1
}

# Play the response
Write-Host "  [$backend] Speaking..." -ForegroundColor Cyan
Start-Process -FilePath $outFile -Wait
Write-Host "  Done." -ForegroundColor DarkGray
