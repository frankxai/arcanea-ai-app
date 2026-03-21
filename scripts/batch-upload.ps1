$ErrorActionPreference = "Continue"
$SUPABASE_URL = "https://hcfhyssdzphudaqatxbk.supabase.co"
$BUCKET = "arcanea-gallery"
$ANON_KEY = $env:SUPABASE_ANON_KEY

$GuardianNames = @("aiyami","alera","draconia","elara","ino","leyla","lyria","lyssandria","maylinn","shinkami")

function Get-Guardian($Name) {
    $lower = $Name.ToLower()
    foreach ($g in $GuardianNames) { if ($lower.Contains($g)) { return $g } }
    if ($lower.Contains("tree_goddess") -or $lower.Contains("earth")) { return "lyssandria" }
    if ($lower.Contains("dragon") -or $lower.Contains("fire")) { return "draconia" }
    if ($lower.Contains("water") -or $lower.Contains("ocean")) { return "leyla" }
    if ($lower.Contains("community") -or $lower.Contains("wizard")) { return "community" }
    return "misc"
}

function Get-MimeType($Ext) {
    switch ($Ext.ToLower()) {
        ".webp" { "image/webp" }; ".png" { "image/png" }
        ".jpg" { "image/jpeg" }; ".jpeg" { "image/jpeg" }
        default { "application/octet-stream" }
    }
}

$folders = @(
    "G:\My Drive\Arcanea\Draconia",
    "G:\My Drive\Arcanea\Alera",
    "G:\My Drive\Arcanea"
)

$ok = 0; $fail = 0; $total = 0

foreach ($folder in $folders) {
    Write-Host "`n--- $folder ---" -ForegroundColor Cyan
    $files = Get-ChildItem $folder -File -ErrorAction SilentlyContinue | Where-Object { $_.Extension -in @(".webp",".png",".jpg",".jpeg") }
    foreach ($file in $files) {
        $total++
        $guardian = Get-Guardian $file.Name
        $safeName = "$guardian-$($file.Name -replace ' ','_')"
        if ($safeName.Length -gt 120) { $safeName = $safeName.Substring(0, 120) }
        $storagePath = "guardians/gallery/$safeName"
        $mime = Get-MimeType $file.Extension
        $url = "$SUPABASE_URL/storage/v1/object/$BUCKET/$storagePath"

        try {
            $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
            $headers = @{
                "Authorization" = "Bearer $ANON_KEY"
                "apikey" = $ANON_KEY
                "Content-Type" = $mime
                "x-upsert" = "true"
            }
            $resp = Invoke-WebRequest -Uri $url -Method POST -Headers $headers -Body $bytes -ErrorAction Stop
            Write-Host "  OK [$guardian] $($file.Name)" -ForegroundColor Green
            $ok++
        } catch {
            $code = $_.Exception.Response.StatusCode.value__
            if ($code -eq 409) {
                Write-Host "  SKIP [$guardian] $($file.Name)" -ForegroundColor DarkGray
                $ok++
            } else {
                Write-Host "  FAIL($code) [$guardian] $($file.Name)" -ForegroundColor Red
                $fail++
            }
        }
    }
}

Write-Host "`n=== COMPLETE ===" -ForegroundColor Yellow
Write-Host "Total: $total | OK: $ok | Failed: $fail"
