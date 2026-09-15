param(
  [string]$RunRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [int]$TargetImages = 100
)

$ErrorActionPreference = 'Stop'

function ConvertTo-Rate {
  param(
    [int]$Count,
    [double]$Minutes
  )
  if ($Minutes -le 0) { return $null }
  return [Math]::Round(($Count / $Minutes) * 60, 1)
}

function ConvertTo-Percent {
  param(
    [int]$Numerator,
    [int]$Denominator
  )
  if ($Denominator -le 0) { return 0 }
  return [Math]::Round(($Numerator / $Denominator) * 100, 1)
}

$runRootFull = [System.IO.Path]::GetFullPath($RunRoot)
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $runRootFull '..\..\..'))
$loopProofs = Join-Path $repoRoot '.loop\arcanea-image-lab\proofs'
$ledgerPath = Join-Path $runRootFull 'ledger.csv'
$throughputPath = Join-Path $runRootFull 'THROUGHPUT.md'
$proofPath = Join-Path $loopProofs 'latest-throughput.json'

if (!(Test-Path -LiteralPath $ledgerPath)) { throw "Missing ledger: $ledgerPath" }
New-Item -ItemType Directory -Force -Path $loopProofs | Out-Null

$rows = @(Import-Csv -LiteralPath $ledgerPath)
$generated = @($rows | Where-Object { $_.status -eq 'generated' })

$generatedWithFiles = foreach ($row in $generated) {
  if ([string]::IsNullOrWhiteSpace($row.source_path)) { continue }
  if (!(Test-Path -LiteralPath $row.source_path)) { continue }
  $item = Get-Item -LiteralPath $row.source_path
  [pscustomobject]@{
    batch_id = $row.batch_id
    asset_id = $row.asset_id
    gate_30_score = $row.gate_30_score
    gate_verdict = $row.gate_verdict
    ship_status = $row.ship_status
    source_path = $row.source_path
    workspace_path = $row.workspace_path
    source_last_write = $item.LastWriteTime
  }
}

$batches = @($generatedWithFiles |
  Group-Object batch_id |
  Sort-Object Name |
  ForEach-Object {
    $items = @($_.Group | Sort-Object source_last_write)
    $first = $items[0].source_last_write
    $last = $items[-1].source_last_write
    $minutes = [Math]::Round([Math]::Max(0, ($last - $first).TotalMinutes), 2)
    [pscustomobject]@{
      batch_id = $_.Name
      images = $items.Count
      first = $first
      last = $last
      active_minutes = $minutes
      images_per_hour = ConvertTo-Rate -Count $items.Count -Minutes $minutes
      approved_with_notes = @($items | Where-Object { $_.gate_verdict -eq 'approved with notes' }).Count
      iterate = @($items | Where-Object { $_.gate_verdict -eq 'iterate' }).Count
      restart = @($items | Where-Object { $_.gate_verdict -eq 'restart' }).Count
    }
  })

$activeMinutes = [Math]::Round((($batches | Measure-Object -Property active_minutes -Sum).Sum), 2)
$activeRate = ConvertTo-Rate -Count $generatedWithFiles.Count -Minutes $activeMinutes
$approvedCount = @($generated | Where-Object { $_.gate_verdict -eq 'approved with notes' }).Count
$iterateCount = @($generated | Where-Object { $_.gate_verdict -eq 'iterate' }).Count
$restartCount = @($generated | Where-Object { $_.gate_verdict -eq 'restart' }).Count
$remaining = [Math]::Max(0, $TargetImages - $generated.Count)
$estimatedActiveMinutesRemaining = if ($activeRate -and $activeRate -gt 0) { [Math]::Round(($remaining / $activeRate) * 60, 1) } else { $null }

$summary = [ordered]@{
  checked_at = (Get-Date).ToString('s')
  target_images = $TargetImages
  tracked_prompts = $rows.Count
  generated_images = $generated.Count
  generated_with_source_files = $generatedWithFiles.Count
  remaining_to_target = $remaining
  active_minutes_observed = $activeMinutes
  observed_active_images_per_hour = $activeRate
  estimated_active_minutes_to_target = $estimatedActiveMinutesRemaining
  approved_with_notes = $approvedCount
  iterate = $iterateCount
  restart = $restartCount
  approval_rate_percent = ConvertTo-Percent -Numerator $approvedCount -Denominator $generated.Count
  near_or_approved_percent = ConvertTo-Percent -Numerator ($approvedCount + @($generated | Where-Object { $_.ship_status -like 'near approval*' }).Count) -Denominator $generated.Count
  batches = @($batches)
}

($summary | ConvertTo-Json -Depth 8) | Set-Content -LiteralPath $proofPath -Encoding UTF8

$batchLines = foreach ($batch in $batches) {
  $rate = if ($null -eq $batch.images_per_hour) { 'n/a' } else { "$($batch.images_per_hour)/hr" }
  "| $($batch.batch_id) | $($batch.images) | $($batch.first.ToString('HH:mm:ss'))-$($batch.last.ToString('HH:mm:ss')) | $($batch.active_minutes) | $rate | $($batch.approved_with_notes) | $($batch.iterate) | $($batch.restart) |"
}

$estimatedLine = if ($null -eq $estimatedActiveMinutesRemaining) {
  "Not enough timestamp evidence yet to estimate active time remaining."
} else {
  "At the observed active rate, $remaining more images would take about $estimatedActiveMinutesRemaining active generation minutes. Review/scoring time is additional."
}

$markdownLines = @(
  '# Arcanea Image Throughput',
  '',
  "Updated: $($summary.checked_at)",
  '',
  '## Summary',
  '',
  "- Target images: $TargetImages",
  "- Generated images tracked: $($generated.Count)",
  "- Remaining to target: $remaining",
  "- Observed active generation time: $activeMinutes minutes",
  "- Observed active rate: $activeRate images/hour",
  "- Approved with notes: $approvedCount ($($summary.approval_rate_percent)%)",
  "- Iterate: $iterateCount",
  "- Restart: $restartCount",
  "- Near-or-approved signal: $($summary.near_or_approved_percent)%",
  '',
  $estimatedLine,
  '',
  'This is throughput evidence, not quota evidence. Official Codex docs checked earlier do not publish a stable fixed images/hour quota for this built-in image tool.',
  '',
  '## Batch Windows',
  '',
  '| Batch | Images | Source timestamp window | Active min | Rate | Approved | Iterate | Restart |',
  '| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |'
)

$markdownLines += $batchLines
$markdownLines += @(
  '',
  '## Operating Policy',
  '',
  '- Keep batches at 4 images.',
  '- Do not generate a new batch until the previous batch is ingested, inspected, scored, and included in this report.',
  '- Prioritize approved-with-notes rate over raw image volume.',
  '- If visible usage warnings, failed generations, or quality collapse appear, stop and record it in `oversight.md`.',
  '',
  'Proof JSON: `.loop/arcanea-image-lab/proofs/latest-throughput.json`'
)

$markdown = $markdownLines -join "`n"

Set-Content -LiteralPath $throughputPath -Value $markdown -Encoding UTF8

Write-Host "Arcanea image throughput measured."
Write-Host "Generated: $($generated.Count) / $TargetImages"
Write-Host "Observed active rate: $activeRate images/hour"
Write-Host "Approved with notes: $approvedCount"
Write-Host "Proof: $proofPath"
Write-Host "Report: $throughputPath"
