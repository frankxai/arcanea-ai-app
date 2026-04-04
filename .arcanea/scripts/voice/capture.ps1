#!/usr/bin/env pwsh
# Arcanea Capture - Screenshot, Screen Recording, GIF, Voice+Screen combo
#
# Usage:
#   capture ss                  Screenshot (PNG)
#   capture ss [name]           Named screenshot
#   capture rec [sec]           Screen recording with voice (default 60s)
#   capture gif [sec]           GIF capture (default 10s)
#   capture clip [sec]          Quick clip - screen+voice, auto-transcribe (30s)
#   capture l                   List recent captures
#   capture open                Open captures folder

param(
    [Parameter(Position=0)] [string] $Mode = "ss",
    [Parameter(Position=1)] [string] $Arg = ""
)

$MIC = "Mikrofon (Shure MV6)"
$CAPTURE_DIR = "C:\Users\frank\Arcanea\content\captures"
$VOICE_SCRIPT = "C:\Users\frank\Arcanea\.arcanea\scripts\voice\voice.ps1"

# Smart mic detection (reuse from voice.ps1)
$tf = "$env:TEMP\ffmpeg_mic_cap.txt"
& cmd /c "ffmpeg -list_devices true -f dshow -i dummy 2>$tf" 2>$null
$raw = Get-Content $tf -Raw -ErrorAction SilentlyContinue
Remove-Item $tf -Force -ErrorAction SilentlyContinue
if ($raw) {
    $mics = [regex]::Matches($raw, '"([^"]+)"\s*\(audio\)') | ForEach-Object { $_.Groups[1].Value }
    $shure = $mics | Where-Object { $_ -match "Shure" -and $_ -notmatch "Virtual|MOTIV" }
    if ($shure) { $MIC = [string]@($shure)[0] }
    else {
        $fallback = $mics | Where-Object { $_ -notmatch "Virtual|MOTIV|Oculus" } | Select-Object -First 1
        if ($fallback) { $MIC = [string]$fallback }
    }
}

# Ensure directories
$dirs = @("screenshots", "recordings", "gifs", "clips")
foreach ($d in $dirs) { New-Item -ItemType Directory -Force -Path "$CAPTURE_DIR\$d" | Out-Null }

$ts = Get-Date -Format "yyyy-MM-dd_HHmmss"

switch ($Mode) {
    { $_ -in "ss", "screenshot" } {
        $name = if ($Arg) { $Arg } else { "screen_$ts" }
        $file = "$CAPTURE_DIR\screenshots\${name}.png"
        & ffmpeg -y -f gdigrab -framerate 1 -t 1 -i desktop -frames:v 1 -update 1 "$file" 2>$null
        if (Test-Path $file) {
            $kb = [math]::Round((Get-Item $file).Length / 1024)
            Write-Host "  Screenshot: ${name}.png (${kb}KB)" -ForegroundColor Green
            $file | Set-Clipboard
            Write-Host "  Path copied to clipboard" -ForegroundColor DarkGray
        } else {
            Write-Host "  Screenshot failed" -ForegroundColor Red
        }
    }

    { $_ -in "rec", "record" } {
        $dur = if ($Arg -match '^\d+$') { [int]$Arg } else { 60 }
        $file = "$CAPTURE_DIR\recordings\rec_${ts}.mp4"
        Write-Host ""
        Write-Host "  Screen + Voice Recording | ${dur}s | $MIC" -ForegroundColor Cyan
        Write-Host "  Ctrl+C to stop" -ForegroundColor DarkGray
        Write-Host ""
        & ffmpeg -y -f gdigrab -framerate 24 -i desktop -f dshow -i audio="$MIC" `
            -c:v libx264 -preset ultrafast -crf 23 `
            -c:a aac -b:a 128k `
            -t $dur "$file" 2>$null
        if ((Test-Path $file) -and (Get-Item $file).Length -gt 10000) {
            $mb = [math]::Round((Get-Item $file).Length / 1048576, 1)
            Write-Host "  Recorded: rec_${ts}.mp4 (${mb}MB)" -ForegroundColor Green
        } else {
            Write-Host "  Recording failed or too short" -ForegroundColor Red
        }
    }

    { $_ -in "gif" } {
        $dur = if ($Arg -match '^\d+$') { [int]$Arg } else { 10 }
        $palette = "$env:TEMP\palette_$ts.png"
        $raw_file = "$env:TEMP\gif_raw_$ts.mp4"
        $file = "$CAPTURE_DIR\gifs\gif_${ts}.gif"
        Write-Host ""
        Write-Host "  GIF Capture | ${dur}s" -ForegroundColor Cyan
        Write-Host "  Ctrl+C to stop" -ForegroundColor DarkGray
        Write-Host ""
        # Capture raw video first
        & ffmpeg -y -f gdigrab -framerate 15 -t $dur -i desktop -c:v libx264 -preset ultrafast "$raw_file" 2>$null
        if ((Test-Path $raw_file) -and (Get-Item $raw_file).Length -gt 5000) {
            # Generate palette for quality
            & ffmpeg -y -i "$raw_file" -vf "fps=10,scale=800:-1:flags=lanczos,palettegen" "$palette" 2>$null
            # Create GIF with palette
            & ffmpeg -y -i "$raw_file" -i "$palette" -lavfi "fps=10,scale=800:-1:flags=lanczos [x]; [x][1:v] paletteuse" "$file" 2>$null
            Remove-Item $raw_file, $palette -Force -ErrorAction SilentlyContinue
            if (Test-Path $file) {
                $mb = [math]::Round((Get-Item $file).Length / 1048576, 1)
                Write-Host "  GIF: gif_${ts}.gif (${mb}MB)" -ForegroundColor Green
            }
        } else {
            Write-Host "  GIF capture failed" -ForegroundColor Red
        }
    }

    { $_ -in "clip" } {
        $dur = if ($Arg -match '^\d+$') { [int]$Arg } else { 30 }
        $videoFile = "$CAPTURE_DIR\clips\clip_${ts}.mp4"
        Write-Host ""
        Write-Host "  Quick Clip | Screen + Voice | ${dur}s | $MIC" -ForegroundColor Cyan
        Write-Host "  Speak while recording. Ctrl+C to stop." -ForegroundColor DarkGray
        Write-Host ""
        & ffmpeg -y -f gdigrab -framerate 24 -i desktop -f dshow -i audio="$MIC" `
            -c:v libx264 -preset ultrafast -crf 23 `
            -c:a aac -b:a 128k `
            -t $dur "$videoFile" 2>$null
        if ((Test-Path $videoFile) -and (Get-Item $videoFile).Length -gt 10000) {
            $mb = [math]::Round((Get-Item $videoFile).Length / 1048576, 1)
            Write-Host "  Clip: clip_${ts}.mp4 (${mb}MB)" -ForegroundColor Green

            # Extract audio and transcribe
            $audioFile = "$env:TEMP\clip_audio_$ts.wav"
            & ffmpeg -y -i $videoFile -vn -acodec pcm_s16le -ar 16000 -ac 1 "$audioFile" 2>$null
            if (Test-Path $audioFile) {
                Write-Host "  Transcribing voice..." -ForegroundColor Yellow -NoNewline
                $GROQ_KEY = $env:GROQ_API_KEY
                if (-not $GROQ_KEY) { $GROQ_KEY = [System.Environment]::GetEnvironmentVariable("GROQ_API_KEY", "User") }
                if ($GROQ_KEY) {
                    $r = & curl -s "https://api.groq.com/openai/v1/audio/transcriptions" `
                        -H "Authorization: Bearer $GROQ_KEY" -F "file=@$audioFile" `
                        -F "model=whisper-large-v3-turbo" -F "response_format=text" 2>&1
                    if ($r -and $r.Length -gt 5 -and -not ($r -match '"error"')) {
                        $text = if ($r -is [array]) { ($r | Where-Object { $_ -is [string] }) -join ' ' } else { $r.ToString() }
                        $text = $text.Trim()
                        Write-Host " [groq]" -ForegroundColor Green
                        $display = if ($text.Length -gt 200) { $text.Substring(0,200) + "..." } else { $text }
                        Write-Host "  $display" -ForegroundColor White
                        $text | Set-Clipboard
                        Write-Host "  Transcript on clipboard" -ForegroundColor DarkGray
                        # Save transcript
                        "# Clip - $ts`n`n$text" | Set-Content "$CAPTURE_DIR\clips\clip_${ts}.md" -Encoding UTF8
                    } else { Write-Host " failed" -ForegroundColor DarkYellow }
                } else { Write-Host " no Groq key" -ForegroundColor DarkYellow }
                Remove-Item $audioFile -Force -ErrorAction SilentlyContinue
            }
        } else {
            Write-Host "  Clip failed" -ForegroundColor Red
        }
    }

    { $_ -in "l", "list" } {
        Write-Host ""
        Write-Host "  Recent Captures" -ForegroundColor Cyan
        Write-Host "  ---" -ForegroundColor DarkGray
        $files = Get-ChildItem "$CAPTURE_DIR\*\*" -ErrorAction SilentlyContinue |
            Sort-Object LastWriteTime -Descending | Select-Object -First 15
        foreach ($f in $files) {
            $kb = [math]::Round($f.Length / 1024)
            $unit = if ($kb -gt 1024) { "$([math]::Round($kb/1024,1))MB" } else { "${kb}KB" }
            Write-Host "  $($f.LastWriteTime.ToString('MM-dd HH:mm'))  $($f.Directory.Name)/$($f.Name)  $unit" -ForegroundColor White
        }
        Write-Host ""
    }

    { $_ -in "open" } {
        Start-Process "C:\Users\frank\Arcanea\content\captures"
    }

    default {
        Write-Host ""
        Write-Host "  Arcanea Capture" -ForegroundColor Cyan
        Write-Host "  ---" -ForegroundColor DarkGray
        Write-Host "  capture ss [name]      Screenshot (PNG)" -ForegroundColor White
        Write-Host "  capture rec [sec]      Screen + voice recording (60s)" -ForegroundColor White
        Write-Host "  capture gif [sec]      GIF capture (10s)" -ForegroundColor White
        Write-Host "  capture clip [sec]     Quick clip + transcribe (30s)" -ForegroundColor White
        Write-Host "  capture l              List recent" -ForegroundColor White
        Write-Host "  capture open           Open captures folder" -ForegroundColor White
        Write-Host ""
    }
}
