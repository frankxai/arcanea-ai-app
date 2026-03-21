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
    if ($lower.Contains("devora")) { return "draconia" }
    if ($lower.Contains("mirillia")) { return "leyla" }
    return "misc"
}

function Get-MimeType($Ext) {
    switch ($Ext.ToLower()) {
        ".webp" { "image/webp" }; ".png" { "image/png" }
        ".jpg" { "image/jpeg" }; ".jpeg" { "image/jpeg" }
        default { "application/octet-stream" }
    }
}

$ok = 0; $fail = 0; $total = 0

$folders = @(
    "G:\My Drive\Arcanea\Alera",
    "G:\My Drive\Arcanea"
)

foreach ($folder in $folders) {
    Write-Host "--- $folder ---"
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
            Invoke-WebRequest -Uri $url -Method POST -Headers $headers -Body $bytes -ErrorAction Stop | Out-Null
            Write-Host "OK [$guardian] $($file.Name)"
            $ok++
        } catch {
            $code = $_.Exception.Response.StatusCode.value__
            if ($code -eq 409) { $ok++ } else { $fail++; Write-Host "FAIL($code) $($file.Name)" }
        }
    }
}
Write-Host "=== BATCH 2 COMPLETE: Total=$total OK=$ok Fail=$fail ==="
