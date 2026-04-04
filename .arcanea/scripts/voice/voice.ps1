#!/usr/bin/env pwsh
# Arcanea Voice v3 - Premium Voice Production System
#
# Usage: voice [mode] [duration]
#   voice / n [sec]    Quick note (1m default, Ctrl+C stops)
#   voice s [sec]      Strategy session (5m)
#   voice a [sec]      Agent dispatch (2m)
#   voice r [sec]      Reading capture 24kHz (10m)
#   voice nl [sec]     Newsletter 48kHz (5m)
#   voice v [sec]      Voiceover 48kHz/24bit (3m)
#   voice c [sec]      Arcanea content 48kHz/24bit (5m)
#   voice rev          QC last recording
#   voice play         Play last recording
#   voice l            List recent
#   voice clean        Disk audit
#   voice mic          Show/test microphones

param(
    [Parameter(Position=0)] [string] $Mode = "note",
    [Parameter(Position=1)] [int] $Duration = 0,
    [switch] $Eph
)

$ErrorActionPreference = "SilentlyContinue"

# ─── Paths ───────────────────────────────────────────────────────────────
$BASE = "C:\Users\frank\Arcanea"
$CONTENT = "$BASE\content\voice"
$REPORTS = "$BASE\.arcanea\reports\voice"
$LOG = "$CONTENT\voice-log.md"

# ─── API Keys (Windows User Environment - encrypted, never in files) ─────
$GROQ_KEY = $env:GROQ_API_KEY
if (-not $GROQ_KEY) { $GROQ_KEY = [System.Environment]::GetEnvironmentVariable("GROQ_API_KEY", "User") }
$ELEVEN_KEY = $env:ELEVENLABS_API_KEY
if (-not $ELEVEN_KEY) { $ELEVEN_KEY = [System.Environment]::GetEnvironmentVariable("ELEVENLABS_API_KEY", "User") }

# ─── Smart Mic Detection ─────────────────────────────────────────────────
# Priority: Shure MV6 > Bluetooth headset > Laptop mic > Any
function Find-BestMic {
    # ffmpeg outputs device list to stderr
    $tempFile = "$env:TEMP\ffmpeg_devices.txt"
    & cmd /c "ffmpeg -list_devices true -f dshow -i dummy 2>$tempFile" 2>$null
    $raw = Get-Content $tempFile -Raw -ErrorAction SilentlyContinue
    if (-not $raw) { $raw = "" }
    Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
    $devices = [regex]::Matches($raw, '"([^"]+)"\s*\(audio\)') | ForEach-Object { $_.Groups[1].Value }

    # Priority order
    $priority = @(
        @{ Pattern="Shure";    Tier="BROADCAST";  Quality=5 },
        @{ Pattern="Blue";     Tier="STUDIO";     Quality=4 },
        @{ Pattern="Rode";     Tier="STUDIO";     Quality=4 },
        @{ Pattern="Audio-Technica"; Tier="STUDIO"; Quality=4 },
        @{ Pattern="Yeti";     Tier="STUDIO";     Quality=4 },
        @{ Pattern="HyperX";   Tier="GAMING";     Quality=3 },
        @{ Pattern="Jabra";    Tier="HEADSET";    Quality=3 },
        @{ Pattern="AirPods";  Tier="BLUETOOTH";  Quality=2 },
        @{ Pattern="Headset";  Tier="HEADSET";    Quality=2 },
        @{ Pattern="Realtek";  Tier="LAPTOP";     Quality=1 },
        @{ Pattern="Intel";    Tier="LAPTOP";     Quality=1 }
    )

    foreach ($p in $priority) {
        $matched = @($devices | Where-Object { $_ -match $p.Pattern -and $_ -notmatch "Virtual|MOTIV Mix" })
        if ($matched.Count -gt 0) {
            $micName = [string]$matched[0]
            return @{ Name=$micName; Tier=$p.Tier; Quality=$p.Quality }
        }
    }

    # Fallback: first non-virtual device
    $fallbacks = @($devices | Where-Object { $_ -notmatch "Virtual|MOTIV|Oculus" })
    if ($fallbacks.Count -gt 0) { return @{ Name=[string]$fallbacks[0]; Tier="UNKNOWN"; Quality=1 } }

    return $null
}

$MIC_INFO = Find-BestMic
if (-not $MIC_INFO) {
    Write-Host "  No microphone detected." -ForegroundColor Red
    exit 1
}
$MIC = $MIC_INFO.Name

# ─── Mode Config ─────────────────────────────────────────────────────────
$MODES = @{
    note        = @{ Name="Voice Note";      Rate=16000; Ch=1; Bit=16; Dir="notes";       Dur=60;   Max=300;  Family="thinking" }
    strategy    = @{ Name="Strategy";        Rate=16000; Ch=1; Bit=16; Dir="strategy";    Dur=300;  Max=900;  Family="thinking" }
    agent       = @{ Name="Agent Dispatch";  Rate=16000; Ch=1; Bit=16; Dir="agents";      Dur=120;  Max=300;  Family="thinking" }
    reading     = @{ Name="Reading";         Rate=24000; Ch=1; Bit=16; Dir="readings";    Dur=600;  Max=1800; Family="thinking" }
    newsletter  = @{ Name="Newsletter";      Rate=48000; Ch=1; Bit=16; Dir="newsletter";  Dur=300;  Max=600;  Family="publishing" }
    voiceover   = @{ Name="Voiceover";       Rate=48000; Ch=2; Bit=24; Dir="voiceover";   Dur=180;  Max=600;  Family="publishing" }
    arcanea     = @{ Name="Arcanea Content"; Rate=48000; Ch=2; Bit=24; Dir="arcanea";     Dur=300;  Max=600;  Family="publishing" }
    issue       = @{ Name="Linear Issue";    Rate=16000; Ch=1; Bit=16; Dir="issues";      Dur=120;  Max=300;  Family="workflow" }
    task        = @{ Name="Linear Task";     Rate=16000; Ch=1; Bit=16; Dir="tasks";       Dur=60;   Max=180;  Family="workflow" }
    idea        = @{ Name="Idea Capture";    Rate=16000; Ch=1; Bit=16; Dir="ideas";       Dur=120;  Max=300;  Family="workflow" }
    standup     = @{ Name="Daily Standup";   Rate=16000; Ch=1; Bit=16; Dir="standups";    Dur=180;  Max=600;  Family="workflow" }
    commit      = @{ Name="Commit Message";  Rate=16000; Ch=1; Bit=16; Dir="commits";     Dur=30;   Max=60;   Family="workflow" }
}

# ─── Aliases ──────────────────────────────────────────────────────────────
$ALIASES = @{
    "n"="note"; "s"="strategy"; "a"="agent"; "r"="reading"
    "nl"="newsletter"; "v"="voiceover"; "c"="arcanea"; "ar"="arcanea"
    "i"="issue"; "t"="task"; "id"="idea"; "su"="standup"; "cm"="commit"
    "rev"="review"; "l"="list"; "h"="help"; "?"="help"
}
if ($ALIASES.ContainsKey($Mode)) { $Mode = $ALIASES[$Mode] }

# ─── Functions ────────────────────────────────────────────────────────────

function Do-Review {
    $latest = Get-ChildItem "$CONTENT\*\*.wav" -Recurse -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $latest) { Write-Host "  No recordings found." -ForegroundColor DarkYellow; return }
    Write-Host ""
    Write-Host "  Reviewing: $($latest.Name)" -ForegroundColor Cyan
    $vol = & ffmpeg -i $latest.FullName -af "volumedetect" -f null NUL 2>&1 | Out-String
    $pk = if ($vol -match 'max_volume:\s*([-\d.]+)') { [float]$Matches[1] } else { -99 }
    $mn = if ($vol -match 'mean_volume:\s*([-\d.]+)') { [float]$Matches[1] } else { -99 }
    $d = & ffprobe -i $latest.FullName -show_entries format=duration -v quiet -of csv="p=0" 2>&1
    Write-Host "  Duration: ${d}s | Peak: ${pk}dB | Mean: ${mn}dB" -ForegroundColor White
    $issues = @()
    if ($pk -gt -1) { $issues += "CLIPPING" }
    if ($pk -lt -12) { $issues += "TOO QUIET" }
    if ($mn -lt -30) { $issues += "LOW ENERGY" }
    $color = if ($issues.Count -eq 0) { "Green" } else { "Yellow" }
    $verdict = if ($issues.Count -eq 0) { "PUBLISH-READY" } else { $issues -join ", " }
    Write-Host "  Verdict: $verdict" -ForegroundColor $color
    Write-Host ""
}

function Do-Open {
    $latest = Get-ChildItem "$CONTENT\*\*.wav" -Recurse -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $latest) { Write-Host "  No recordings." -ForegroundColor DarkYellow; return }
    Write-Host "  Playing: $($latest.Name)" -ForegroundColor Cyan
    Start-Process $latest.FullName
}

function Do-List {
    Write-Host ""
    Write-Host "  Recent Recordings" -ForegroundColor Cyan
    Write-Host "  ---" -ForegroundColor DarkGray
    $files = Get-ChildItem "$CONTENT\*\*.wav" -Recurse -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending | Select-Object -First 10
    if (-not $files) { Write-Host "  No recordings yet." -ForegroundColor DarkYellow; return }
    foreach ($f in $files) {
        $kb = [math]::Round($f.Length / 1024)
        $md = $f.Directory.Name
        Write-Host "  $($f.LastWriteTime.ToString('MM-dd HH:mm'))  ${md}/$($f.Name)  ${kb}KB" -ForegroundColor White
    }
    Write-Host ""
}

function Do-Clean {
    Write-Host ""
    Write-Host "  Voice Storage Audit" -ForegroundColor Cyan
    Write-Host "  ---" -ForegroundColor DarkGray
    $all = Get-ChildItem "$CONTENT\*\*.wav" -Recurse -ErrorAction SilentlyContinue | Sort-Object LastWriteTime
    if (-not $all) { Write-Host "  No recordings." -ForegroundColor DarkYellow; return }
    $totalKB = 0
    foreach ($f in $all) {
        $kb = [math]::Round($f.Length / 1024)
        $totalKB += $kb
        $age = [math]::Round(((Get-Date) - $f.LastWriteTime).TotalHours, 1)
        Write-Host "  ${age}h ago  $($f.Directory.Name)/$($f.Name)  ${kb}KB" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "  Total: $($all.Count) files, $([math]::Round($totalKB/1024,1))MB" -ForegroundColor Yellow
    # Check archive
    $archived = Get-ChildItem "$CONTENT\archive\*.wav" -ErrorAction SilentlyContinue
    if ($archived) {
        $archKB = ($archived | Measure-Object -Property Length -Sum).Sum / 1024
        Write-Host "  Archive: $($archived.Count) files, $([math]::Round($archKB/1024,1))MB" -ForegroundColor DarkGray
    }
    Write-Host ""
}

function Do-Mic {
    Write-Host ""
    Write-Host "  Available Microphones" -ForegroundColor Cyan
    Write-Host "  ---" -ForegroundColor DarkGray
    $tf = "$env:TEMP\ffmpeg_mic.txt"
    & cmd /c "ffmpeg -list_devices true -f dshow -i dummy 2>$tf" 2>$null
    $raw = Get-Content $tf -Raw -ErrorAction SilentlyContinue
    Remove-Item $tf -Force -ErrorAction SilentlyContinue
    $devices = [regex]::Matches($raw, '"([^"]+)"\s*\(audio\)') | ForEach-Object { $_.Groups[1].Value }
    foreach ($d in $devices) {
        $isActive = $d -eq $MIC
        $marker = if ($isActive) { " [ACTIVE]" } else { "" }
        $color = if ($isActive) { "Green" } elseif ($d -match "Virtual|MOTIV") { "DarkGray" } else { "White" }
        Write-Host "  $d$marker" -ForegroundColor $color
    }
    Write-Host ""
    Write-Host "  Selected: $MIC ($($MIC_INFO.Tier))" -ForegroundColor Green
    Write-Host ""
}

function Do-Help {
    Write-Host ""
    Write-Host "  Arcanea Voice v3" -ForegroundColor Cyan
    Write-Host "  Mic: $MIC ($($MIC_INFO.Tier))" -ForegroundColor DarkGray
    Write-Host "  ---" -ForegroundColor DarkGray
    Write-Host "  THINKING (Ctrl+C to stop anytime)" -ForegroundColor DarkCyan
    Write-Host "    voice / n [sec]    Quick note (1m, max 5m)" -ForegroundColor White
    Write-Host "    voice s [sec]      Strategy (5m, max 15m)" -ForegroundColor White
    Write-Host "    voice a [sec]      Agent dispatch (2m, max 5m)" -ForegroundColor White
    Write-Host "    voice r [sec]      Reading 24kHz (10m, max 30m)" -ForegroundColor White
    Write-Host ""
    Write-Host "  PUBLISHING (broadcast quality)" -ForegroundColor Green
    Write-Host "    voice nl [sec]     Newsletter 48kHz (5m, max 10m)" -ForegroundColor White
    Write-Host "    voice v [sec]      Voiceover 48kHz/24bit (3m, max 10m)" -ForegroundColor White
    Write-Host "    voice c [sec]      Arcanea content 48kHz/24bit (5m, max 10m)" -ForegroundColor White
    Write-Host ""
    Write-Host "  WORKFLOW (auto-routes to Linear/Git/Notion)" -ForegroundColor Yellow
    Write-Host "    voice i            Create Linear issue from voice" -ForegroundColor White
    Write-Host "    voice t            Create task (backlog)" -ForegroundColor White
    Write-Host "    voice id           Capture idea to ideas log" -ForegroundColor White
    Write-Host "    voice su           Daily standup log" -ForegroundColor White
    Write-Host "    voice cm           Describe changes -> commit message" -ForegroundColor White
    Write-Host ""
    Write-Host "  MANAGE" -ForegroundColor DarkGray
    Write-Host "    voice rev          QC last recording" -ForegroundColor White
    Write-Host "    voice play         Play last recording" -ForegroundColor White
    Write-Host "    voice l            List recent" -ForegroundColor White
    Write-Host "    voice clean        Disk audit" -ForegroundColor White
    Write-Host "    voice mic          Show microphones" -ForegroundColor White
    Write-Host "    -Eph               Delete audio after transcription" -ForegroundColor White
    Write-Host ""
    Write-Host "  GLOBAL (from any app)" -ForegroundColor Yellow
    Write-Host "    Ctrl+Alt+N         Quick Note" -ForegroundColor White
    Write-Host "    Ctrl+Alt+S         Strategy" -ForegroundColor White
    Write-Host "    Ctrl+Alt+A         Agent Dispatch" -ForegroundColor White
    Write-Host "    Ctrl+Alt+V         Voiceover" -ForegroundColor White
    Write-Host ""
    $groqStatus = if ($GROQ_KEY) { "connected (2h/day free)" } else { "not set" }
    $elevenStatus = if ($ELEVEN_KEY) { "connected" } else { "not set" }
    Write-Host "  Groq: $groqStatus | ElevenLabs: $elevenStatus" -ForegroundColor $(if($GROQ_KEY){"Green"}else{"DarkYellow"})
    Write-Host ""
}

# ─── Route Commands ───────────────────────────────────────────────────────
if ($Mode -eq "review") { Do-Review; exit 0 }
if ($Mode -eq "list")   { Do-List; exit 0 }
if ($Mode -eq "help")   { Do-Help; exit 0 }
if ($Mode -eq "clean")  { Do-Clean; exit 0 }
if ($Mode -eq "open" -or $Mode -eq "play") { Do-Open; exit 0 }
if ($Mode -eq "mic")    { Do-Mic; exit 0 }

if (-not $MODES.ContainsKey($Mode)) {
    Write-Host "  Unknown: $Mode" -ForegroundColor Red; Do-Help; exit 1
}

# ─── Record ───────────────────────────────────────────────────────────────
$m = $MODES[$Mode]
$dur = if ($Duration -gt 0) { [math]::Min($Duration, $m.Max) } else { $m.Dur }
$ts = Get-Date -Format "yyyy-MM-dd_HHmmss"
$dir = "$CONTENT\$($m.Dir)"
$transDir = "$CONTENT\transcripts\$($m.Dir)"
$file = "$dir\${Mode}_${ts}.wav"

New-Item -ItemType Directory -Force -Path $dir, $transDir, $REPORTS | Out-Null
if (-not (Test-Path $LOG)) { "# Arcanea Voice Log`n`n---`n" | Set-Content $LOG -Encoding UTF8 }

$codec = if ($m.Bit -eq 24) { "pcm_s24le" } else { "pcm_s16le" }
$localOnly = @("reading")
$useGroq = $GROQ_KEY -and ($localOnly -notcontains $Mode)
$src = if ($useGroq) { "groq" } else { "whisper" }

$durMin = [math]::Floor($dur / 60); $durSec = $dur % 60
$durDisp = if ($durMin -gt 0) { "${durMin}m" + $(if($durSec){"${durSec}s"}else{""}) } else { "${dur}s" }

Write-Host ""
Write-Host "  $($m.Name) | $durDisp | $($m.Rate/1000)kHz | $($MIC_INFO.Tier) | $src" -ForegroundColor Cyan
Write-Host "  Ctrl+C to stop | $MIC" -ForegroundColor DarkGray

# Warn if using laptop mic for publishing
if ($m.Family -eq "publishing" -and $MIC_INFO.Quality -lt 3) {
    Write-Host "  [WARN] Using $($MIC_INFO.Tier) mic for publishing. Connect Shure MV6 for best quality." -ForegroundColor Yellow
}
Write-Host ""

ffmpeg -y -f dshow -i audio="$MIC" -acodec $codec -ar $($m.Rate) -ac $($m.Ch) -t $dur "$file" 2>$null

if (-not (Test-Path $file) -or (Get-Item $file).Length -lt 2000) {
    Write-Host "  No audio captured." -ForegroundColor Red; exit 1
}

$kb = [math]::Round((Get-Item $file).Length / 1024)
Write-Host "  Captured ${kb}KB" -ForegroundColor Green

# ─── Transcribe ───────────────────────────────────────────────────────────
Write-Host "  Transcribing..." -ForegroundColor Yellow -NoNewline
$text = $null; $transFile = "$transDir\${Mode}_${ts}.md"; $backend = "none"

if ($useGroq) {
    $r = & curl -s "https://api.groq.com/openai/v1/audio/transcriptions" `
        -H "Authorization: Bearer $GROQ_KEY" -F "file=@$file" `
        -F "model=whisper-large-v3-turbo" -F "response_format=text" 2>&1
    if ($r -and $r.Length -gt 5 -and -not ($r -match '"error"')) {
        $text = if ($r -is [array]) { ($r | Where-Object { $_ -is [string] }) -join ' ' } else { $r.ToString() }
        $text = $text.Trim(); $backend = "groq"
    }
}

if (-not $text) {
    $r = python3 -c @"
import sys, warnings; warnings.filterwarnings('ignore')
try:
    import whisper; model = whisper.load_model('tiny')
    r = model.transcribe('$($file -replace '\\','/')'); print(r['text'].strip())
except: sys.exit(1)
"@ 2>$null
    if ($LASTEXITCODE -eq 0 -and $r) {
        $text = if ($r -is [array]) { ($r | Where-Object { $_ -is [string] }) -join ' ' } else { $r.ToString() }
        $text = $text.Trim(); $backend = "whisper"
    }
}

if (-not $text) { Write-Host " failed. Audio: $file" -ForegroundColor DarkYellow; exit 1 }
Write-Host " [$backend]" -ForegroundColor Green

# Display
$display = if ($text.Length -gt 300) { $text.Substring(0,300) + "..." } else { $text }
Write-Host "  ---" -ForegroundColor DarkGray
Write-Host "  $display" -ForegroundColor White
Write-Host "  ---" -ForegroundColor DarkGray

# Save transcript
"# $($m.Name) - $ts`n`n$text" | Set-Content $transFile -Encoding UTF8

# ─── QC (publishing modes) ───────────────────────────────────────────────
$qc = ""
if ($m.Family -eq "publishing") {
    $vol = & ffmpeg -i $file -af "volumedetect" -f null NUL 2>&1 | Out-String
    $pk = if ($vol -match 'max_volume:\s*([-\d.]+)') { [float]$Matches[1] } else { -99 }
    $mn = if ($vol -match 'mean_volume:\s*([-\d.]+)') { [float]$Matches[1] } else { -99 }
    $issues = @()
    if ($pk -gt -1)  { $issues += "CLIPPING" }
    if ($pk -lt -12) { $issues += "QUIET" }
    $verdict = if ($issues.Count -eq 0) { "PUBLISH-READY" } else { "REVIEW: $($issues -join ', ')" }
    Write-Host "  [QC] Peak:${pk}dB Mean:${mn}dB | $verdict" -ForegroundColor $(if($issues.Count -eq 0){"Green"}else{"Yellow"})
    $qc = "QC: Peak ${pk}dB, Mean ${mn}dB - $verdict"
}

# ─── Coach ────────────────────────────────────────────────────────────────
$words = @($text -split '\s+' | Where-Object { $_ }); $wc = $words.Count
$sents = @(($text -split '[.!?]+' | Where-Object { $_.Trim() })).Count
if ($sents -eq 0) { $sents = 1 }
$fillers = @("um","uh","like","you know","basically","actually","literally")
$fc = 0; foreach ($f in $fillers) { $fc += ([regex]::Matches($text.ToLower(), "\b$f\b")).Count }
Write-Host "  [COACH] ${wc}w ${sents}s ${fc} fillers" -ForegroundColor DarkCyan

# ─── Log ──────────────────────────────────────────────────────────────────
$entry = "`n## $ts [$($m.Name)]`nMode: $Mode | $($m.Rate/1000)kHz | $($MIC_INFO.Tier) | $backend`n"
if ($qc) { $entry += "$qc`n" }
$entry += "Coach: ${wc}w ${sents}s ${fc}f`n`n> $text`n`n---`n"
Add-Content $LOG $entry -Encoding UTF8

# ─── Clipboard ────────────────────────────────────────────────────────────
$text | Set-Clipboard
Write-Host "  Copied to clipboard" -ForegroundColor Green

# ─── Voice Coach Response ─────────────────────────────────────────────────
$coachText = "${wc} words. ${sents} sentences."
if ($fc -gt 3) { $coachText += " ${fc} fillers, try reducing." }
elseif ($fc -eq 0) { $coachText += " Zero fillers. Clean." }
if ($qc -match "PUBLISH-READY") { $coachText += " Publish ready." }
elseif ($qc -match "CLIPPING") { $coachText += " Clipping detected. Step back from mic." }

$coachFile = "$env:TEMP\arcanea_coach"
$coachBackend = "none"
$isPremiumMode = @("strategy", "newsletter", "voiceover", "arcanea") -contains $Mode

# 1. ElevenLabs Lily (premium modes only — preserve 30min/mo budget)
if ($ELEVEN_KEY -and $isPremiumMode -and $coachBackend -eq "none") {
    $voiceId = "pFZP5JQG7iQj"  # Lily - velvety British actress = Lumina voice
    $body = "{`"text`":`"$coachText`",`"model_id`":`"eleven_turbo_v2_5`"}"
    try {
        Invoke-WebRequest -Uri "https://api.elevenlabs.io/v1/text-to-speech/$voiceId" `
            -Method POST -Headers @{ "xi-api-key" = $ELEVEN_KEY; "Content-Type" = "application/json" } `
            -Body $body -OutFile "$coachFile.mp3" -ErrorAction Stop
        if ((Test-Path "$coachFile.mp3") -and (Get-Item "$coachFile.mp3").Length -gt 1000) {
            $coachFile = "$coachFile.mp3"; $coachBackend = "elevenlabs/lily"
        }
    } catch {}
}

# 2. Groq Orpheus Autumn (free, unlimited — daily coaching)
if ($GROQ_KEY -and $coachBackend -eq "none") {
    $body = "{`"model`":`"canopylabs/orpheus-v1-english`",`"input`":`"$coachText`",`"voice`":`"hannah`",`"response_format`":`"wav`"}"
    try {
        Invoke-WebRequest -Uri "https://api.groq.com/openai/v1/audio/speech" `
            -Method POST -Headers @{ "Authorization" = "Bearer $GROQ_KEY"; "Content-Type" = "application/json" } `
            -Body $body -OutFile "$coachFile.wav" -ErrorAction Stop
        if ((Test-Path "$coachFile.wav") -and (Get-Item "$coachFile.wav").Length -gt 5000) {
            $coachFile = "$coachFile.wav"; $coachBackend = "groq/autumn"
        }
    } catch {}
}

# 3. Edge TTS (always free fallback)
if ($coachBackend -eq "none") {
    & edge-tts --voice "en-GB-SoniaNeural" --text $coachText --write-media "$coachFile.mp3" 2>$null
    if ((Test-Path "$coachFile.mp3") -and (Get-Item "$coachFile.mp3").Length -gt 500) {
        $coachFile = "$coachFile.mp3"; $coachBackend = "edge/ava"
    }
}

if ($coachBackend -ne "none") {
    Start-Process -FilePath $coachFile
    Write-Host "  [VOICE] $coachText [$coachBackend]" -ForegroundColor DarkCyan
}

# ─── Route ────────────────────────────────────────────────────────────────
$actionsScript = "$BASE\.arcanea\scripts\voice\voice-actions.mjs"
switch ($Mode) {
    "agent"      { Write-Host "  Paste as prompt into Claude Code." -ForegroundColor Magenta }
    "newsletter" { Write-Host "  Staged for newsletter." -ForegroundColor Green }
    "voiceover"  { Write-Host "  Production saved. 'voice rev' to check." -ForegroundColor Red }
    "issue"      { node $actionsScript issue $text 2>$null; Write-Host "  Linear issue created from voice." -ForegroundColor Yellow }
    "task"       { node $actionsScript task $text 2>$null; Write-Host "  Task saved." -ForegroundColor Yellow }
    "idea"       { node $actionsScript idea $text 2>$null; Write-Host "  Idea captured." -ForegroundColor Magenta }
    "standup"    { node $actionsScript standup $text 2>$null; Write-Host "  Standup logged." -ForegroundColor Cyan }
    "commit"     { node $actionsScript commit $text 2>$null; Write-Host "  Commit message on clipboard." -ForegroundColor Green }
    "strategy"   { node $actionsScript extract-actions $text 2>$null }
}

# ─── Ephemeral ────────────────────────────────────────────────────────────
if ($Eph) {
    Remove-Item $file -Force
    Write-Host "  [EPH] Audio deleted. Transcript kept." -ForegroundColor DarkGray
}
Write-Host ""
