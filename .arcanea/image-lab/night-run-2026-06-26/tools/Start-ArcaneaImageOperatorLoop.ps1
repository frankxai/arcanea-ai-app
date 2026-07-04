param(
  [string]$RunRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [double]$RunHours = 10,
  [int]$IntervalMinutes = 2,
  [int]$ImagesPerBatch = 4,
  [string]$SourceRoot = (Join-Path $env:USERPROFILE '.codex\generated_images'),
  [switch]$Once
)

$ErrorActionPreference = 'Stop'

function Get-NextQueuedBatch {
  param([string]$LedgerPath)
  $rows = @(Import-Csv -LiteralPath $LedgerPath)
  $next = $rows |
    Where-Object { $_.status -eq 'queued' } |
    Group-Object batch_id |
    Sort-Object Name |
    Select-Object -First 1
  if ($null -eq $next) { return $null }
  return $next.Name
}

function Write-BatchBrief {
  param(
    [string]$RunRoot,
    [string]$BatchId
  )

  $promptsPath = Join-Path $RunRoot 'prompts.jsonl'
  $briefPath = Join-Path $RunRoot 'operator-current-batch.md'

  if ([string]::IsNullOrWhiteSpace($BatchId)) {
    Set-Content -LiteralPath $briefPath -Value "# Arcanea Image Operator Brief`n`nNo queued batches remain." -Encoding UTF8
    return
  }

  $prompts = Get-Content -LiteralPath $promptsPath |
    Where-Object { $_.Trim().Length -gt 0 } |
    ForEach-Object { $_ | ConvertFrom-Json } |
    Where-Object { $_.batch_id -eq $BatchId } |
    Sort-Object asset_id

  $lines = @(
    "# Arcanea Image Operator Brief",
    "",
    "Current queued batch: $BatchId",
    "",
    "Before generating, read QUALITY_RECALIBRATION.md and PROMPT_DOCTRINE_L99.md. Treat first-pass images as concept plates until the 30 point gate is recorded.",
    "",
    "Generate these prompts with the built-in Codex image_gen tool, then run:",
    "",
    '```powershell',
    ".\tools\Update-ArcaneaImageRun.ps1 -BatchId $BatchId -CopyLatest 4",
    '```',
    "",
    "After inspection, run:",
    "",
    '```powershell',
    ".\tools\Apply-QualityRecalibration.ps1",
    '```',
    ""
  )

  foreach ($prompt in $prompts) {
    $lines += "## $($prompt.asset_id) - $($prompt.asset_type)"
    $lines += ""
    $lines += "Lane: $($prompt.lane)"
    $lines += ""
    $lines += "Use case: $($prompt.use_case)"
    $lines += ""
    $lines += "Prompt:"
    $lines += ""
    $lines += '```text'
    $lines += $prompt.prompt
    $lines += ""
    $lines += "Avoid: $($prompt.avoid)"
    $lines += '```'
    $lines += ""
  }

  Set-Content -LiteralPath $briefPath -Value ($lines -join "`n") -Encoding UTF8
}

$ledgerPath = Join-Path $RunRoot 'ledger.csv'
$stateDir = Join-Path $RunRoot '.state'
$knownPath = Join-Path $stateDir 'known-source-images.txt'
$updateScript = Join-Path $PSScriptRoot 'Update-ArcaneaImageRun.ps1'

if (!(Test-Path -LiteralPath $ledgerPath)) { throw "Missing ledger: $ledgerPath" }
if (!(Test-Path -LiteralPath $updateScript)) { throw "Missing updater: $updateScript" }
if (!(Test-Path -LiteralPath $SourceRoot)) { throw "Missing Codex generated image folder: $SourceRoot" }

New-Item -ItemType Directory -Force -Path $stateDir | Out-Null

if (!(Test-Path -LiteralPath $knownPath)) {
  Get-ChildItem -LiteralPath $SourceRoot -Recurse -File -Filter '*.png' |
    Select-Object -ExpandProperty FullName |
    Set-Content -LiteralPath $knownPath -Encoding UTF8
}

$endAt = (Get-Date).AddHours($RunHours)

do {
  $nextBatch = Get-NextQueuedBatch -LedgerPath $ledgerPath
  Write-BatchBrief -RunRoot $RunRoot -BatchId $nextBatch

  $known = @()
  if (Test-Path -LiteralPath $knownPath) {
    $known = @(Get-Content -LiteralPath $knownPath)
  }

  $ledgerKnown = @(Import-Csv -LiteralPath $ledgerPath |
    Where-Object { ![string]::IsNullOrWhiteSpace($_.source_path) } |
    Select-Object -ExpandProperty source_path)

  $known = @($known + $ledgerKnown | Sort-Object -Unique)

  $allImages = @(Get-ChildItem -LiteralPath $SourceRoot -Recurse -File -Filter '*.png' | Sort-Object LastWriteTime)
  $newImages = @($allImages | Where-Object { $known -notcontains $_.FullName })

  if ($newImages.Count -ge $ImagesPerBatch -and ![string]::IsNullOrWhiteSpace($nextBatch)) {
    & $updateScript -RunRoot $RunRoot -BatchId $nextBatch -CopyLatest $ImagesPerBatch -SourceRoot $SourceRoot
    $allImages |
      Select-Object -ExpandProperty FullName |
      Set-Content -LiteralPath $knownPath -Encoding UTF8
    Write-Host "Ingested $ImagesPerBatch new images into $nextBatch."
  } elseif (![string]::IsNullOrWhiteSpace($nextBatch)) {
    & $updateScript -RunRoot $RunRoot -BatchId $nextBatch -SkipCopy
    Write-Host "No complete new image batch detected. Current queued batch brief refreshed: $nextBatch."
  } else {
    Write-Host "No queued batches remain."
  }

  if ($Once) { break }
  if ((Get-Date) -ge $endAt) { break }
  Start-Sleep -Seconds ([Math]::Max(30, $IntervalMinutes * 60))
} while ((Get-Date) -lt $endAt)

Write-Host "Operator loop finished."
