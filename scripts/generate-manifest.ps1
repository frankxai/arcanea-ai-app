<#
.SYNOPSIS
    Generates an Arcanea media manifest JSON from G:\My Drive\Arcanea

.DESCRIPTION
    Run this on the Windows machine with access to G: drive.
    Outputs manifest.json conforming to media-manifest-spec.json.

    If ffprobe is available, extracts video/image dimensions and duration.

.USAGE
    .\generate-manifest.ps1
    .\generate-manifest.ps1 -SourceRoot "G:\My Drive\Arcanea" -OutputPath "manifest.json"
    .\generate-manifest.ps1 -IncludeMediaMeta  # requires ffprobe in PATH
#>

param(
    [string]$SourceRoot = "G:\My Drive\Arcanea",
    [string]$OutputPath = "arcanea-manifest.json",
    [switch]$IncludeMediaMeta
)

$ErrorActionPreference = "Stop"

# Check ffprobe availability
$ffprobeAvailable = $false
if ($IncludeMediaMeta) {
    try {
        $null = Get-Command ffprobe -ErrorAction Stop
        $ffprobeAvailable = $true
        Write-Host "ffprobe found - will extract media metadata" -ForegroundColor Green
    } catch {
        Write-Warning "ffprobe not found. Install ffmpeg to extract video/image metadata. Continuing without."
    }
}

Write-Host "Scanning: $SourceRoot" -ForegroundColor Cyan

$mediaExtensions = @(
    ".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v",
    ".mp3", ".wav", ".flac", ".ogg", ".m4a", ".aac",
    ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".bmp", ".tiff", ".avif",
    ".pdf"
)

$allFiles = Get-ChildItem -Path $SourceRoot -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $mediaExtensions -contains $_.Extension.ToLower() }

Write-Host "Found $($allFiles.Count) media files" -ForegroundColor Yellow

$byType = @{}
$byFolder = @{}
$totalBytes = 0
$fileEntries = @()

$i = 0
foreach ($file in $allFiles) {
    $i++
    if ($i % 100 -eq 0) { Write-Host "  Processing $i / $($allFiles.Count)..." }

    $relativePath = $file.FullName.Substring($SourceRoot.Length + 1).Replace('\', '/')
    $folder = if ($file.Directory.FullName -eq $SourceRoot) { "__root__" } else { $file.Directory.Name }
    $ext = $file.Extension.ToLower()

    # SHA256 of relative path for deterministic ID
    $sha = [System.Security.Cryptography.SHA256]::Create()
    $hashBytes = $sha.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($relativePath))
    $id = [BitConverter]::ToString($hashBytes).Replace('-', '').Substring(0, 16).ToLower()

    # MIME type mapping
    $mimeMap = @{
        ".mp4" = "video/mp4"; ".webm" = "video/webm"; ".mov" = "video/quicktime";
        ".avi" = "video/x-msvideo"; ".mkv" = "video/x-matroska"; ".m4v" = "video/x-m4v";
        ".mp3" = "audio/mpeg"; ".wav" = "audio/wav"; ".flac" = "audio/flac";
        ".ogg" = "audio/ogg"; ".m4a" = "audio/mp4"; ".aac" = "audio/aac";
        ".png" = "image/png"; ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg";
        ".webp" = "image/webp"; ".gif" = "image/gif"; ".svg" = "image/svg+xml";
        ".bmp" = "image/bmp"; ".tiff" = "image/tiff"; ".avif" = "image/avif";
        ".pdf" = "application/pdf"
    }
    $mime = $mimeMap[$ext]
    if (-not $mime) { $mime = "application/octet-stream" }

    $entry = [ordered]@{
        id            = $id
        relative_path = $relativePath
        filename      = $file.Name
        extension     = $ext
        size_bytes    = [long]$file.Length
        mime_type     = $mime
        created_at    = $file.CreationTimeUtc.ToString("yyyy-MM-ddTHH:mm:ssZ")
        modified_at   = $file.LastWriteTimeUtc.ToString("yyyy-MM-ddTHH:mm:ssZ")
        folder        = $folder
    }

    # Optional: extract media metadata via ffprobe
    if ($ffprobeAvailable -and $ext -in @(".mp4",".webm",".mov",".avi",".mkv",".m4v",".png",".jpg",".jpeg",".webp",".gif")) {
        try {
            $probe = ffprobe -v quiet -print_format json -show_format -show_streams $file.FullName 2>$null | ConvertFrom-Json
            $videoStream = $probe.streams | Where-Object { $_.codec_type -eq "video" } | Select-Object -First 1
            $meta = [ordered]@{}
            if ($videoStream) {
                $meta.width = [int]$videoStream.width
                $meta.height = [int]$videoStream.height
                if ($videoStream.codec_name) { $meta.codec = $videoStream.codec_name }
                if ($videoStream.r_frame_rate -and $videoStream.r_frame_rate -ne "0/0") {
                    $parts = $videoStream.r_frame_rate -split "/"
                    if ($parts.Count -eq 2 -and [int]$parts[1] -ne 0) {
                        $meta.fps = [math]::Round([double]$parts[0] / [double]$parts[1], 2)
                    }
                }
            }
            if ($probe.format.duration) {
                $meta.duration_seconds = [math]::Round([double]$probe.format.duration, 2)
            }
            if ($probe.format.bit_rate) {
                $meta.bitrate_kbps = [int]([double]$probe.format.bit_rate / 1000)
            }
            $audioStream = $probe.streams | Where-Object { $_.codec_type -eq "audio" } | Select-Object -First 1
            $meta.has_audio = $null -ne $audioStream

            if ($meta.Count -gt 0) {
                $entry.media_meta = $meta
            }
        } catch {
            # Skip metadata for this file
        }
    }

    $fileEntries += $entry
    $totalBytes += $file.Length

    # Aggregates
    if (-not $byType.ContainsKey($ext)) { $byType[$ext] = 0 }
    $byType[$ext]++

    if (-not $byFolder.ContainsKey($folder)) { $byFolder[$folder] = @{ count = 0; bytes = 0 } }
    $byFolder[$folder].count++
    $byFolder[$folder].bytes += $file.Length
}

$manifest = [ordered]@{
    version      = "1.0"
    generated_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    source_root  = $SourceRoot
    summary      = [ordered]@{
        total_files = $allFiles.Count
        total_bytes = [long]$totalBytes
        by_type     = $byType
        by_folder   = $byFolder
    }
    files        = $fileEntries
}

$json = $manifest | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText((Resolve-Path $OutputPath -ErrorAction SilentlyContinue ?? $OutputPath), $json, [System.Text.Encoding]::UTF8)

Write-Host "`nManifest written to: $OutputPath" -ForegroundColor Green
Write-Host "  Files: $($allFiles.Count)" -ForegroundColor Cyan
Write-Host "  Size:  $([math]::Round($totalBytes / 1MB, 1)) MB" -ForegroundColor Cyan
Write-Host "  Types: $($byType.Keys -join ', ')" -ForegroundColor Cyan
Write-Host "`nNext: Run categorize-media.py on this manifest to label everything against Arcanea canon." -ForegroundColor Yellow
