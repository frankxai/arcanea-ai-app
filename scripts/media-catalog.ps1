# Arcanea Media Catalog — PowerShell version
# Run from Windows: powershell.exe -ExecutionPolicy Bypass -File C:\Users\frank\Arcanea\scripts\media-catalog.ps1
# Run from WSL2:    powershell.exe -ExecutionPolicy Bypass -File 'C:\Users\frank\Arcanea\scripts\media-catalog.ps1'

param(
    [string]$Root    = "G:\My Drive\Arcanea",
    [string]$Output  = "G:\My Drive\Arcanea\arcanea-manifest.json",
    [switch]$Sample,
    [int]$SampleSize = 20
)

$ErrorActionPreference = "SilentlyContinue"

# ── Canon ──────────────────────────────────────────────────────────────────────
$GUARDIANS = @{
    Lyssandria = @{gate='Foundation'; hz=174;  element='Earth';  godbeast='Kaelith';   color='#8B6914'}
    Leyla      = @{gate='Flow';       hz=285;  element='Water';  godbeast='Veloura';   color='#4169E1'}
    Draconia   = @{gate='Fire';       hz=396;  element='Fire';   godbeast='Draconis';  color='#FF4500'}
    Maylinn    = @{gate='Heart';      hz=417;  element='Water';  godbeast='Laeylinn';  color='#FF69B4'}
    Alera      = @{gate='Voice';      hz=528;  element='Wind';   godbeast='Otome';     color='#87CEEB'}
    Lyria      = @{gate='Sight';      hz=639;  element='Arcane'; godbeast='Yumiko';    color='#9370DB'}
    Aiyami     = @{gate='Crown';      hz=741;  element='Arcane'; godbeast='Sol';       color='#FFD700'}
    Elara      = @{gate='Shift';      hz=852;  element='Arcane'; godbeast='Vaelith';   color='#50C878'}
    Ino        = @{gate='Unity';      hz=963;  element='Arcane'; godbeast='Kyuro';     color='#40E0D0'}
    Shinkami   = @{gate='Source';     hz=1111; element='Arcane'; godbeast='Source'; color='#C0C0C0'}
}

$GODBEAST_MAP = @{
    Kaelith='Lyssandria'; Veloura='Leyla'; Draconis='Draconia'; Laeylinn='Maylinn'
    Otome='Alera'; Yumiko='Lyria'; Sol='Aiyami'; Vaelith='Elara'; Kyuro='Ino'; Source='Shinkami'
}

$IMAGE_EXTS = @('.png','.jpg','.jpeg','.webp','.gif')
$VIDEO_EXTS = @('.mp4','.mov','.webm','.avi')

$UUID_REGEX  = [regex]'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
$GROK_V_PAT  = [regex]'^grok_video_(\d{4}-\d{2}-\d{2})'
$GROK_I_PAT  = [regex]'^grok_image_(\d+)'
$LV_PAT      = [regex]'^lv_\d+'


# ── Helper functions ──────────────────────────────────────────────────────────

function DetectGuardian($text) {
    $t = $text.ToLower()
    foreach ($g in $GUARDIANS.Keys) {
        if ($t.Contains($g.ToLower())) { return $g }
    }
    foreach ($gb in $GODBEAST_MAP.Keys) {
        if ($t.Contains($gb.ToLower())) { return $GODBEAST_MAP[$gb] }
    }
    return $null
}

function ParseFilename($name, $stem) {
    # Midjourney: frankx77_description_words_<uuid>
    if ($UUID_REGEX.IsMatch($stem) -and $stem -imatch '^frankx') {
        $s = $stem -ireplace '^frankx\d+_', ''
        $s = $UUID_REGEX.Replace($s, '').Trim('_- ')
        $desc = ($s -replace '_', ' ').Trim()
        return @{description=$desc; source='midjourney'}
    }
    # Grok video
    $m = $GROK_V_PAT.Match($name)
    if ($m.Success) { return @{description="Grok video $($m.Groups[1].Value)"; source='grok-video'} }
    # Grok image
    $m = $GROK_I_PAT.Match($name)
    if ($m.Success) { return @{description="Grok image $($m.Groups[1].Value)"; source='grok-image'} }
    # LV (TikTok/Grok)
    if ($LV_PAT.IsMatch($name)) { return @{description="Grok clip $($stem.Substring(0, [Math]::Min(20,$stem.Length)))"; source='grok-video'} }
    # Manual/descriptive name
    $desc = ($stem -replace '[_-]+', ' ').Trim()
    return @{description=$desc; source='manual'}
}

function FastHash($path) {
    try {
        $size   = (Get-Item $path).Length
        $stream = [System.IO.File]::OpenRead($path)
        $buf    = New-Object byte[] 65536
        $read   = $stream.Read($buf, 0, 65536)
        $stream.Close()
        $md5    = [System.Security.Cryptography.MD5]::Create()
        $sizeBytes = [System.Text.Encoding]::UTF8.GetBytes($size.ToString())
        $combined   = $sizeBytes + $buf[0..($read-1)]
        $hash    = $md5.ComputeHash($combined)
        return ($hash | ForEach-Object { $_.ToString('x2') }) -join '' | Select-Object -First 1
        return ([System.BitConverter]::ToString($hash) -replace '-').Substring(0,16).ToLower()
    } catch { return [System.Guid]::NewGuid().ToString('N').Substring(0,16) }
}

function Slugify($text, $maxLen=40) {
    $s = $text.ToLower() -replace '[^a-z0-9\s]', ''
    $s = ($s.Trim() -replace '\s+', '-').Substring(0, [Math]::Min($maxLen, $s.Length)).TrimEnd('-')
    return $s
}

function AutoTags($guardian, $folder, $scene, $type, $source) {
    $tags = [System.Collections.Generic.List[string]]::new()
    if ($guardian) {
        $info = $GUARDIANS[$guardian]
        $tags.Add("guardian:$($guardian.ToLower())")
        $tags.Add("gate:$($info.gate.ToLower())")
        $tags.Add("element:$($info.element.ToLower())")
        $tags.Add("hz:$($info.hz)")
        $tags.Add("godbeast:$($info.godbeast.ToLower())")
    }
    if ($source) { $tags.Add("source:$source") }
    $tags.Add("type:$type")
    $combined = "$folder $scene".ToLower()
    if ($combined -match 'portrait|face|close')        { $tags.Add('style:portrait') }
    if ($combined -match 'dragon|godbeast|beast|creature') { $tags.Add('content:godbeast') }
    if ($combined -match 'battle|armor|warrior|fight') { $tags.Add('content:action') }
    if ($combined -match 'embrace|love|tender|lovingly') { $tags.Add('content:emotional') }
    if ($combined -match 'community|group|together|crowd|roaming') { $tags.Add('content:world-building') }
    if ($combined -match 'tree|forest|earth|wooden|nature') { $tags.Add('content:nature') }
    if ($combined -match 'logo')                       { $tags.Add('category:logo') }
    if ($combined -match 'band')                       { $tags.Add('category:music') }
    if ($combined -match 'grok.*2026|2026.*grok')      { $tags.Add('campaign:2026') }
    return $tags.ToArray()
}


# ── Main ──────────────────────────────────────────────────────────────────────

Write-Host "================================================================"
Write-Host "  ARCANEA MEDIA CATALOG"
Write-Host "  Root:   $Root"
Write-Host "  Output: $Output"
Write-Host "================================================================"

if (-not (Test-Path $Root)) {
    Write-Error "Root path not found: $Root"
    exit 1
}

Write-Host "Scanning for media files..."

$allFiles = Get-ChildItem -Path $Root -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $IMAGE_EXTS + $VIDEO_EXTS -contains $_.Extension.ToLower() }

$total = $allFiles.Count
Write-Host "  Found $total media files. Processing..."

$entries  = [System.Collections.Generic.List[object]]::new()
$hashMap  = @{}
$counters = @{}
$processed = 0

foreach ($file in $allFiles) {
    $processed++
    if ($processed % 100 -eq 0) { Write-Host "  Processed $processed / $total..." -NoNewline; Write-Host "`r" -NoNewline }

    $ext    = $file.Extension.ToLower()
    $mtype  = if ($IMAGE_EXTS -contains $ext) { 'image' } else { 'video' }

    # Folder (first level under root)
    $rel    = $file.FullName.Substring($Root.Length).TrimStart('\').Split('\')
    $folder = if ($rel.Count -gt 1) { $rel[0] } else { 'root' }

    $parsed   = ParseFilename $file.Name $file.BaseName
    $guardian = DetectGuardian "$($file.BaseName) $folder"

    # Fast hash for dedup
    $fhash  = FastHash $file.FullName
    $dupOf  = $null
    if ($hashMap.ContainsKey($fhash)) {
        $dupOf = $hashMap[$fhash]
    } else {
        $hashMap[$fhash] = $file.FullName
    }

    # Suggested name
    $prefix = if ($guardian) { $guardian.ToLower() } else { 'arcanea' }
    $slug   = Slugify ($parsed.description.Substring(0, [Math]::Min(50, $parsed.description.Length)))
    $ckey   = "$prefix-$mtype"
    if (-not $counters.ContainsKey($ckey)) { $counters[$ckey] = 0 }
    $counters[$ckey]++
    $n     = $counters[$ckey].ToString().PadLeft(3,'0')
    $newExt = if ($mtype -eq 'image') { '.webp' } else { $ext }
    $suggestedName = if ($slug) { "$prefix-$slug-$n$newExt" } else { "$prefix-$mtype-$n$newExt" }

    $gInfo = if ($guardian) { $GUARDIANS[$guardian] } else { $null }
    $tags  = AutoTags $guardian $folder $parsed.description $mtype $parsed.source

    $entry = [PSCustomObject]@{
        id             = $fhash
        original_path  = $file.FullName
        original_name  = $file.Name
        suggested_name = $suggestedName
        type           = $mtype
        extension      = $ext
        size_bytes     = $file.Length
        size_mb        = [Math]::Round($file.Length / 1MB, 2)
        folder         = $folder
        guardian       = $guardian
        gate           = if ($gInfo) { $gInfo.gate }      else { $null }
        element        = if ($gInfo) { $gInfo.element }   else { $null }
        frequency_hz   = if ($gInfo) { $gInfo.hz }        else { $null }
        godbeast       = if ($gInfo) { $gInfo.godbeast }  else { $null }
        source         = $parsed.source
        scene          = $parsed.description
        status         = 'review'
        quality_tier   = $null
        duplicate_of   = $dupOf
        tags           = $tags
        notes          = ''
    }

    $entries.Add($entry)
}

Write-Host "`n  Processing complete."

# ── Stats ──────────────────────────────────────────────────────────────────────
$duplicates = $entries | Where-Object { $_.duplicate_of }
$byGuardian = $entries | Group-Object guardian | Sort-Object Count -Descending |
    ForEach-Object { @{$_.Name = $_.Count} }
$byType     = $entries | Group-Object type | ForEach-Object { @{$_.Name = $_.Count} }
$totalMB    = [Math]::Round(($entries | Measure-Object -Property size_mb -Sum).Sum, 1)

$byGuardianObj = @{}
$entries | Group-Object guardian | Sort-Object Count -Descending | ForEach-Object {
    $byGuardianObj[$_.Name] = $_.Count
}
$byTypeObj = @{}
$entries | Group-Object type | ForEach-Object { $byTypeObj[$_.Name] = $_.Count }

$manifest = [PSCustomObject]@{
    generated    = (Get-Date -Format 'o')
    root_path    = $Root
    total_files  = $entries.Count
    total_size_mb = $totalMB
    duplicates   = $duplicates.Count
    by_type      = $byTypeObj
    by_guardian  = $byGuardianObj
    media        = $entries.ToArray()
}

# ── Output ────────────────────────────────────────────────────────────────────
$json = $manifest | ConvertTo-Json -Depth 6 -Compress:$false
[System.IO.File]::WriteAllText($Output, $json, [System.Text.Encoding]::UTF8)

Write-Host ""
Write-Host "  Results:"
Write-Host "  Total files    : $($entries.Count)"
Write-Host "  Total size     : $totalMB MB"
Write-Host "  Duplicates     : $($duplicates.Count)"
Write-Host "  By type        :"
$byTypeObj.GetEnumerator() | ForEach-Object { Write-Host "    $($_.Key): $($_.Value)" }
Write-Host "  By Guardian    :"
$byGuardianObj.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    $bar = '#' * [Math]::Min($_.Value, 40)
    Write-Host "    $($_.Key.PadRight(14)) $($_.Value.ToString().PadLeft(4))  $bar"
}
Write-Host ""
Write-Host "  Manifest saved: $Output"
Write-Host "================================================================"
