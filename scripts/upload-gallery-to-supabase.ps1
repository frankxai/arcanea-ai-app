# ─── Arcanea Gallery → Supabase Storage Uploader ─────────────────────────────
# Run from Windows PowerShell (NOT WSL — needs G: drive access)
#
# SETUP:
#   $env:SUPABASE_URL = "https://xxxx.supabase.co"
#   $env:SUPABASE_SERVICE_ROLE_KEY = "eyJ..."
#
# USAGE:
#   .\upload-gallery-to-supabase.ps1
#   .\upload-gallery-to-supabase.ps1 -SourceDir "G:\My Drive\Arcanea\Images" -DryRun
#   .\upload-gallery-to-supabase.ps1 -Guardian "draconia" -MaxFiles 50

param(
    [string]$SourceDir  = "G:\My Drive\Arcanea",
    [string]$Bucket     = "arcanea-gallery",
    [string]$Guardian   = "",       # Filter to single guardian (optional)
    [int]   $MaxFiles   = 0,        # 0 = no limit
    [switch]$DryRun,                # Preview without uploading
    [switch]$SkipExisting           # Skip files already in Supabase
)

# ─── Config ──────────────────────────────────────────────────────────────────
$SupabaseUrl     = $env:SUPABASE_URL
$ServiceRoleKey  = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $SupabaseUrl -or -not $ServiceRoleKey) {
    Write-Error @"
Missing environment variables. Set them first:
  `$env:SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co'
  `$env:SUPABASE_SERVICE_ROLE_KEY = 'eyJ...'

Find your keys at: https://supabase.com/dashboard/project/_/settings/api
"@
    exit 1
}

$BaseUrl = "$SupabaseUrl/storage/v1/object/$Bucket"
$Headers = @{
    "Authorization" = "Bearer $ServiceRoleKey"
    "apikey"        = $ServiceRoleKey
}

# Guardian name patterns for auto-detection
$GuardianNames = @("aiyami","alera","draconia","elara","ino","leyla","lyria","lyssandria","maylinn","shinkami")

# ─── Helpers ─────────────────────────────────────────────────────────────────
function Get-GuardianFromName([string]$Name) {
    $lower = $Name.ToLower()
    foreach ($g in $GuardianNames) {
        if ($lower.StartsWith($g)) { return $g }
    }
    # Try folder name
    return $null
}

function Get-MimeType([string]$Ext) {
    switch ($Ext.ToLower()) {
        ".webp" { "image/webp" }
        ".jpg"  { "image/jpeg" }
        ".jpeg" { "image/jpeg" }
        ".png"  { "image/png" }
        ".mp4"  { "video/mp4" }
        ".mov"  { "video/quicktime" }
        default { "application/octet-stream" }
    }
}

function Test-FileExistsInSupabase([string]$StoragePath) {
    $checkUrl = "$SupabaseUrl/storage/v1/object/info/public/$Bucket/$StoragePath"
    try {
        $r = Invoke-WebRequest -Uri $checkUrl -Headers $Headers -Method GET -ErrorAction Stop
        return $r.StatusCode -eq 200
    } catch { return $false }
}

function Upload-File([string]$LocalPath, [string]$StoragePath, [string]$MimeType) {
    $uploadUrl = "$BaseUrl/$StoragePath"
    try {
        $bytes = [System.IO.File]::ReadAllBytes($LocalPath)
        $uploadHeaders = $Headers.Clone()
        $uploadHeaders["Content-Type"] = $MimeType
        $uploadHeaders["x-upsert"] = "false"

        $resp = Invoke-WebRequest `
            -Uri $uploadUrl `
            -Method POST `
            -Headers $uploadHeaders `
            -Body $bytes `
            -ErrorAction Stop

        return $resp.StatusCode -in 200, 201
    } catch {
        $msg = $_.Exception.Message
        if ($msg -match "409" -or $msg -match "Duplicate") {
            Write-Host "  ⇢ already exists, skipping" -ForegroundColor DarkGray
            return $true
        }
        Write-Host "  ✗ upload failed: $msg" -ForegroundColor Red
        return $false
    }
}

# ─── Scan source directory ───────────────────────────────────────────────────
Write-Host ""
Write-Host "Arcanea Gallery → Supabase Storage" -ForegroundColor Cyan
Write-Host "Source : $SourceDir" -ForegroundColor DarkGray
Write-Host "Bucket : $Bucket" -ForegroundColor DarkGray
if ($DryRun) { Write-Host "(DRY RUN — no files will be uploaded)" -ForegroundColor Yellow }
Write-Host ""

if (-not (Test-Path $SourceDir)) {
    Write-Error "Source directory not found: $SourceDir"
    exit 1
}

$extensions = @("*.webp","*.jpg","*.jpeg","*.png","*.mp4","*.mov")
$allFiles = @()
foreach ($ext in $extensions) {
    $allFiles += Get-ChildItem -Path $SourceDir -Filter $ext -Recurse -ErrorAction SilentlyContinue
}

Write-Host "Found $($allFiles.Count) media files in source directory." -ForegroundColor White

# Filter by guardian if specified
if ($Guardian) {
    $allFiles = $allFiles | Where-Object { $_.Name.ToLower().StartsWith($Guardian.ToLower()) }
    Write-Host "Filtered to $($allFiles.Count) files matching guardian: $Guardian" -ForegroundColor DarkGray
}

# Limit
if ($MaxFiles -gt 0 -and $allFiles.Count -gt $MaxFiles) {
    $allFiles = $allFiles | Select-Object -First $MaxFiles
    Write-Host "Limited to first $MaxFiles files." -ForegroundColor DarkGray
}

Write-Host ""

$uploaded = 0
$skipped  = 0
$failed   = 0

foreach ($file in $allFiles) {
    $guardianSlug = Get-GuardianFromName($file.Name)

    # Try parent folder name if filename doesn't match
    if (-not $guardianSlug) {
        $guardianSlug = Get-GuardianFromName($file.Directory.Name)
    }

    if (-not $guardianSlug) {
        Write-Host "SKIP  $($file.Name) — cannot determine guardian" -ForegroundColor DarkGray
        $skipped++
        continue
    }

    # Determine tier from filename
    $isHero    = $file.Name -match "hero"
    $isVideo   = $file.Extension -in @(".mp4", ".mov")
    $subPath   = if ($isHero) { "" } else { "gallery/" }
    $storagePath = "guardians/$subPath$($file.Name)"

    $mimeType = Get-MimeType($file.Extension)

    Write-Host "UP    $($file.Name)" -ForegroundColor White -NoNewline
    Write-Host " → $storagePath" -ForegroundColor DarkGray -NoNewline

    if ($DryRun) {
        Write-Host "  [dry-run]" -ForegroundColor Yellow
        $uploaded++
        continue
    }

    if ($SkipExisting -and (Test-FileExistsInSupabase $storagePath)) {
        Write-Host "  [exists]" -ForegroundColor DarkGray
        $skipped++
        continue
    }

    Write-Host ""
    $ok = Upload-File -LocalPath $file.FullName -StoragePath $storagePath -MimeType $mimeType
    if ($ok) { $uploaded++ } else { $failed++ }
}

Write-Host ""
Write-Host "─────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host "Uploaded : $uploaded" -ForegroundColor Green
Write-Host "Skipped  : $skipped"  -ForegroundColor DarkGray
Write-Host "Failed   : $failed"   -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "DarkGray" })
Write-Host ""

if ($uploaded -gt 0 -and -not $DryRun) {
    Write-Host "Gallery will auto-refresh at arcanea.ai/gallery within 5 minutes." -ForegroundColor Cyan
}
