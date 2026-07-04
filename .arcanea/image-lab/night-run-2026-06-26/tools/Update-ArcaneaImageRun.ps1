param(
  [string]$RunRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [string]$BatchId = 'batch-001',
  [int]$CopyLatest = 4,
  [string]$SourceRoot = (Join-Path $env:USERPROFILE '.codex\generated_images'),
  [switch]$SkipCopy
)

$ErrorActionPreference = 'Stop'

function ConvertTo-HtmlText {
  param([AllowNull()][string]$Value)
  if ($null -eq $Value) { return '' }
  return [System.Net.WebUtility]::HtmlEncode($Value)
}

function ConvertTo-RelativeWebPath {
  param(
    [string]$Root,
    [string]$Path
  )
  $rootFull = [System.IO.Path]::GetFullPath($Root)
  $pathFull = [System.IO.Path]::GetFullPath($Path)
  $uriRoot = [System.Uri]::new(($rootFull.TrimEnd('\') + '\'))
  $uriPath = [System.Uri]::new($pathFull)
  return $uriRoot.MakeRelativeUri($uriPath).ToString()
}

$ledgerPath = Join-Path $RunRoot 'ledger.csv'
$promptsPath = Join-Path $RunRoot 'prompts.jsonl'
$galleryPath = Join-Path $RunRoot 'gallery.html'
$oversightPath = Join-Path $RunRoot 'oversight.md'
$imageBatchDir = Join-Path (Join-Path $RunRoot 'images') $BatchId

if (!(Test-Path -LiteralPath $ledgerPath)) { throw "Missing ledger: $ledgerPath" }
if (!(Test-Path -LiteralPath $promptsPath)) { throw "Missing prompt queue: $promptsPath" }
New-Item -ItemType Directory -Force -Path $imageBatchDir | Out-Null

$columns = @(
  'batch_id',
  'asset_id',
  'status',
  'lane',
  'use_case',
  'asset_type',
  'quality_score',
  'canon_score',
  'design_score',
  'photography_score',
  'text_score',
  'gate_30_score',
  'gate_verdict',
  'ship_status',
  'recalibrated_at',
  'failure_modes',
  'quality_bar',
  'overall_grade',
  'generated_at',
  'workspace_path',
  'source_path',
  'prompt_ref',
  'prompt_summary',
  'recap',
  'critic_notes',
  'next_improvement',
  'next_prompt_delta',
  'skill_mode'
)

$prompts = Get-Content -LiteralPath $promptsPath |
  Where-Object { $_.Trim().Length -gt 0 } |
  ForEach-Object { $_ | ConvertFrom-Json }

$batchPrompts = @($prompts | Where-Object { $_.batch_id -eq $BatchId } | Sort-Object asset_id)
if ($batchPrompts.Count -eq 0) {
  throw "No prompts found for batch id '$BatchId'."
}

$rows = @()
if ((Get-Item -LiteralPath $ledgerPath).Length -gt 0) {
  $rows = @(Import-Csv -LiteralPath $ledgerPath)
}

$rows = @($rows | ForEach-Object {
  $normalized = [ordered]@{}
  foreach ($column in $columns) {
    $property = $_.PSObject.Properties[$column]
    if ($null -ne $property) {
      $normalized[$column] = [string]$property.Value
    } else {
      $normalized[$column] = ''
    }
  }
  [pscustomobject]$normalized
})

foreach ($prompt in $batchPrompts) {
  $existing = $rows | Where-Object { $_.asset_id -eq $prompt.asset_id } | Select-Object -First 1
  if ($null -eq $existing) {
    $row = [ordered]@{}
    foreach ($column in $columns) { $row[$column] = '' }
    $row.batch_id = $prompt.batch_id
    $row.asset_id = $prompt.asset_id
    $row.status = 'queued'
    $row.lane = $prompt.lane
    $row.use_case = $prompt.use_case
    $row.asset_type = $prompt.asset_type
    $row.prompt_ref = "prompts.jsonl#$($prompt.asset_id)"
    $row.prompt_summary = $prompt.prompt_summary
    $row.skill_mode = 'built-in image_gen'
    $rows += [pscustomobject]$row
  } else {
    $existing.batch_id = $prompt.batch_id
    $existing.lane = $prompt.lane
    $existing.use_case = $prompt.use_case
    $existing.asset_type = $prompt.asset_type
    $existing.prompt_ref = "prompts.jsonl#$($prompt.asset_id)"
    $existing.prompt_summary = $prompt.prompt_summary
    if ([string]::IsNullOrWhiteSpace($existing.skill_mode)) { $existing.skill_mode = 'built-in image_gen' }
  }
}

foreach ($prompt in $prompts) {
  $existing = $rows | Where-Object { $_.asset_id -eq $prompt.asset_id } | Select-Object -First 1
  if ($null -ne $existing) {
    $existing.batch_id = $prompt.batch_id
    $existing.lane = $prompt.lane
    $existing.use_case = $prompt.use_case
    $existing.asset_type = $prompt.asset_type
    $existing.prompt_ref = "prompts.jsonl#$($prompt.asset_id)"
    $existing.prompt_summary = $prompt.prompt_summary
    if ([string]::IsNullOrWhiteSpace($existing.skill_mode)) { $existing.skill_mode = 'built-in image_gen' }
  }
}

if (!$SkipCopy) {
  if (!(Test-Path -LiteralPath $SourceRoot)) { throw "Missing Codex generated image folder: $SourceRoot" }

  $latestImages = @(Get-ChildItem -LiteralPath $SourceRoot -Recurse -File -Filter '*.png' |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First $CopyLatest |
    Sort-Object LastWriteTime)

  if ($latestImages.Count -eq 0) { throw "No generated PNG images found under $SourceRoot" }

  $count = [Math]::Min($batchPrompts.Count, $latestImages.Count)
  for ($index = 0; $index -lt $count; $index++) {
    $prompt = $batchPrompts[$index]
    $source = $latestImages[$index]
    $extension = $source.Extension.ToLowerInvariant()
    $dest = Join-Path $imageBatchDir ("{0}{1}" -f $prompt.asset_id, $extension)

    Copy-Item -LiteralPath $source.FullName -Destination $dest -Force

    $row = $rows | Where-Object { $_.asset_id -eq $prompt.asset_id } | Select-Object -First 1
    $row.status = 'generated'
    $row.generated_at = (Get-Date).ToString('s')
    $row.workspace_path = ConvertTo-RelativeWebPath -Root $RunRoot -Path $dest
    $row.source_path = $source.FullName
    if ([string]::IsNullOrWhiteSpace($row.quality_score)) { $row.quality_score = 'pending-review' }
    if ([string]::IsNullOrWhiteSpace($row.overall_grade)) { $row.overall_grade = 'pending' }
    if ([string]::IsNullOrWhiteSpace($row.recap)) { $row.recap = 'Ingested from Codex generated image output.' }
    if ([string]::IsNullOrWhiteSpace($row.next_improvement)) { $row.next_improvement = 'Review visual output, then write one targeted improvement for the next pass.' }
    if ([string]::IsNullOrWhiteSpace($row.skill_mode)) { $row.skill_mode = 'built-in image_gen' }
  }
}

$rows |
  Sort-Object batch_id, asset_id |
  Select-Object $columns |
  Export-Csv -LiteralPath $ledgerPath -NoTypeInformation

$generatedRows = @($rows | Where-Object { $_.status -eq 'generated' -and ![string]::IsNullOrWhiteSpace($_.workspace_path) } | Sort-Object batch_id, asset_id)

$cards = foreach ($row in $generatedRows) {
  $src = ConvertTo-HtmlText $row.workspace_path
  $summary = ConvertTo-HtmlText $row.prompt_summary
  $asset = ConvertTo-HtmlText $row.asset_id
  $lane = ConvertTo-HtmlText $row.lane
  $useCase = ConvertTo-HtmlText $row.use_case
  $score = ConvertTo-HtmlText $row.quality_score
  $gate = ConvertTo-HtmlText $row.gate_30_score
  $verdict = ConvertTo-HtmlText $row.gate_verdict
  $shipStatus = ConvertTo-HtmlText $row.ship_status
  $grade = ConvertTo-HtmlText $row.overall_grade
  $recap = ConvertTo-HtmlText $row.recap
  $critic = ConvertTo-HtmlText $row.critic_notes
  $failureModes = ConvertTo-HtmlText $row.failure_modes
  $improvement = ConvertTo-HtmlText $row.next_improvement
@"
      <article class="card">
        <a class="thumb" href="$src"><img src="$src" alt="$summary"></a>
        <div class="body">
          <div class="row"><span class="pill">$asset</span><span class="pill">$lane</span><span class="pill">$useCase</span><span class="pill">legacy $score</span><span class="pill">gate $gate</span><span class="pill">$verdict</span><span class="pill">$grade</span></div>
          <h2>$summary</h2>
          <div class="small"><strong>Ship status:</strong> $shipStatus</div>
          <div class="small"><strong>Recap:</strong> $recap</div>
          <div class="small"><strong>Critic:</strong> $critic</div>
          <div class="small"><strong>Failure modes:</strong> $failureModes</div>
          <div class="small"><strong>Next:</strong> $improvement</div>
        </div>
      </article>
"@
}

if ($cards.Count -eq 0) {
  $cards = @'
      <article class="card">
        <div class="thumb">No ingested workspace images yet</div>
        <div class="body">
          <div class="row"><span class="pill">queued</span><span class="pill">batch-controlled</span></div>
          <h2>Run updater after generation</h2>
          <div class="small">The script reads ledger.csv, copies the latest Codex PNGs, and rebuilds this file with image cards.</div>
        </div>
      </article>
'@
}

$html = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Arcanea Image Night Run Gallery</title>
  <style>
    :root { color-scheme: dark; --bg: #05070f; --panel: rgba(255,255,255,.045); --line: rgba(255,255,255,.095); --text: #e6eefc; --muted: #9bb1d0; --teal: #2aebd3; --gold: #ffd700; }
    * { box-sizing: border-box; }
    body { margin: 0; background: radial-gradient(circle at top left, rgba(42,235,211,.1), transparent 34rem), var(--bg); color: var(--text); font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    main { max-width: 1320px; margin: 0 auto; padding: 48px 24px; }
    header { display: flex; justify-content: space-between; gap: 24px; align-items: end; margin-bottom: 28px; }
    h1 { font-size: clamp(32px, 5vw, 68px); line-height: .95; margin: 0; letter-spacing: 0; }
    p { color: var(--muted); line-height: 1.6; max-width: 760px; }
    .meta { color: var(--gold); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
    .card { border: 1px solid var(--line); background: var(--panel); border-radius: 8px; overflow: hidden; min-height: 260px; }
    .thumb { aspect-ratio: 16 / 10; background: linear-gradient(135deg, rgba(42,235,211,.14), rgba(255,215,0,.08)); display: grid; place-items: center; color: var(--muted); font-size: 13px; }
    .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .body { padding: 16px; }
    .row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
    .pill { border: 1px solid var(--line); border-radius: 999px; padding: 4px 8px; color: var(--muted); font-size: 12px; }
    h2 { font-size: 16px; margin: 0 0 8px; }
    .small { font-size: 13px; color: var(--muted); margin-top: 8px; }
    a { color: var(--teal); text-decoration: none; }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <div class="meta">Arcanea Image Lab</div>
        <h1>Night Run Gallery</h1>
        <p>Generated asset board for the 2026-06-26 Arcanea image loop. CSV ledger: <a href="ledger.csv">ledger.csv</a>. Prompt queue: <a href="prompts.jsonl">prompts.jsonl</a>.</p>
      </div>
    </header>
    <section class="grid">
$($cards -join "`n")
    </section>
  </main>
</body>
</html>
"@

Set-Content -LiteralPath $galleryPath -Value $html -Encoding UTF8

$generatedForBatch = @($rows | Where-Object { $_.batch_id -eq $BatchId -and $_.status -eq 'generated' })
$note = @"

## Batch Update - $((Get-Date).ToString('s')) - $BatchId

Generated rows now tracked: $($generatedForBatch.Count) / $($batchPrompts.Count)

"@
Add-Content -LiteralPath $oversightPath -Value $note -Encoding UTF8

Write-Host "Updated run root: $RunRoot"
Write-Host "Batch: $BatchId"
Write-Host "Generated rows in batch: $($generatedForBatch.Count) / $($batchPrompts.Count)"
Write-Host "Gallery: $galleryPath"
Write-Host "Ledger: $ledgerPath"
