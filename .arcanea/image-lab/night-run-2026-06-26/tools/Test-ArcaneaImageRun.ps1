param(
  [string]$RunRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [int]$MinGenerated = 1
)

$ErrorActionPreference = 'Stop'

$failures = New-Object System.Collections.Generic.List[string]

function Add-Failure {
  param([string]$Message)
  $failures.Add($Message) | Out-Null
}

function Test-RequiredPath {
  param(
    [string]$Path,
    [string]$Label
  )
  if (!(Test-Path -LiteralPath $Path)) {
    Add-Failure "Missing ${Label}: $Path"
    return $false
  }
  return $true
}

function ConvertTo-FullWorkspacePath {
  param(
    [string]$Root,
    [string]$RelativePath
  )
  if ([string]::IsNullOrWhiteSpace($RelativePath)) { return '' }
  return [System.IO.Path]::GetFullPath((Join-Path $Root ($RelativePath -replace '/', '\')))
}

$runRootFull = [System.IO.Path]::GetFullPath($RunRoot)
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $runRootFull '..\..\..'))
$estateRoot = Split-Path -Parent $repoRoot
$loopProofs = Join-Path $repoRoot '.loop\arcanea-image-lab\proofs'

$ledgerPath = Join-Path $runRootFull 'ledger.csv'
$promptsPath = Join-Path $runRootFull 'prompts.jsonl'
$galleryPath = Join-Path $runRootFull 'gallery.html'
$oversightPath = Join-Path $runRootFull 'oversight.md'
$evidencePath = Join-Path $runRootFull 'design-loop-evidence.json'

Test-RequiredPath -Path $ledgerPath -Label 'ledger' | Out-Null
Test-RequiredPath -Path $promptsPath -Label 'prompt queue' | Out-Null
Test-RequiredPath -Path $galleryPath -Label 'gallery' | Out-Null
Test-RequiredPath -Path $oversightPath -Label 'oversight log' | Out-Null
Test-RequiredPath -Path $evidencePath -Label 'design evidence manifest' | Out-Null

$prompts = @()
if (Test-Path -LiteralPath $promptsPath) {
  $lineNumber = 0
  foreach ($line in (Get-Content -LiteralPath $promptsPath)) {
    $lineNumber += 1
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    try {
      $prompts += ($line | ConvertFrom-Json)
    } catch {
      Add-Failure "prompts.jsonl line $lineNumber is not valid JSON: $($_.Exception.Message)"
    }
  }
}

$ledgerRows = @()
if (Test-Path -LiteralPath $ledgerPath) {
  $ledgerRows = @(Import-Csv -LiteralPath $ledgerPath)
}

$requiredColumns = @(
  'batch_id',
  'asset_id',
  'status',
  'lane',
  'use_case',
  'asset_type',
  'quality_score',
  'gate_30_score',
  'gate_verdict',
  'ship_status',
  'workspace_path',
  'source_path',
  'prompt_ref',
  'prompt_summary',
  'recap',
  'critic_notes',
  'next_improvement',
  'skill_mode'
)

if ($ledgerRows.Count -gt 0) {
  foreach ($column in $requiredColumns) {
    if ($null -eq $ledgerRows[0].PSObject.Properties[$column]) {
      Add-Failure "ledger.csv missing required column: $column"
    }
  }
}

if ($prompts.Count -eq 0) { Add-Failure 'No prompt rows found.' }
if ($ledgerRows.Count -eq 0) { Add-Failure 'No ledger rows found.' }

$promptIds = @($prompts | ForEach-Object { [string]$_.asset_id })
$duplicatePromptIds = @($promptIds | Group-Object | Where-Object { $_.Count -gt 1 } | Select-Object -ExpandProperty Name)
foreach ($assetId in $duplicatePromptIds) {
  Add-Failure "Duplicate prompt asset_id: $assetId"
}

$ledgerIds = @($ledgerRows | ForEach-Object { [string]$_.asset_id })
$duplicateLedgerIds = @($ledgerIds | Group-Object | Where-Object { $_.Count -gt 1 } | Select-Object -ExpandProperty Name)
foreach ($assetId in $duplicateLedgerIds) {
  Add-Failure "Duplicate ledger asset_id: $assetId"
}

foreach ($prompt in $prompts) {
  $assetId = [string]$prompt.asset_id
  $row = $ledgerRows | Where-Object { $_.asset_id -eq $assetId } | Select-Object -First 1
  if ($null -eq $row) {
    Add-Failure "Prompt has no ledger row: $assetId"
  }
}

$allowedStatuses = @('queued', 'generated', 'reviewed', 'rejected')
$allowedVerdicts = @('approved with notes', 'iterate', 'restart')
$generatedRows = @($ledgerRows | Where-Object { $_.status -eq 'generated' })
$approvedRows = @($generatedRows | Where-Object { $_.gate_verdict -eq 'approved with notes' })
$iterateRows = @($generatedRows | Where-Object { $_.gate_verdict -eq 'iterate' })
$restartRows = @($generatedRows | Where-Object { $_.gate_verdict -eq 'restart' })

foreach ($row in $ledgerRows) {
  if ($allowedStatuses -notcontains $row.status) {
    Add-Failure "Invalid status for $($row.asset_id): $($row.status)"
  }

  if ($row.status -ne 'generated') { continue }

  if ([string]::IsNullOrWhiteSpace($row.workspace_path)) {
    Add-Failure "Generated row missing workspace_path: $($row.asset_id)"
  } else {
    $workspaceFullPath = ConvertTo-FullWorkspacePath -Root $runRootFull -RelativePath $row.workspace_path
    if (!(Test-Path -LiteralPath $workspaceFullPath)) {
      Add-Failure "Generated workspace image missing for $($row.asset_id): $workspaceFullPath"
    }
  }

  if ([string]::IsNullOrWhiteSpace($row.source_path) -or !(Test-Path -LiteralPath $row.source_path)) {
    Add-Failure "Generated row missing valid source_path: $($row.asset_id)"
  }

  if ([string]::IsNullOrWhiteSpace($row.quality_score) -or $row.quality_score -eq 'pending-review') {
    Add-Failure "Generated row is still pending visual review: $($row.asset_id)"
  }

  if ([string]::IsNullOrWhiteSpace($row.gate_30_score)) {
    Add-Failure "Generated row missing gate_30_score: $($row.asset_id)"
  } else {
    $gateScore = 0
    if (![int]::TryParse($row.gate_30_score, [ref]$gateScore)) {
      Add-Failure "gate_30_score is not an integer for $($row.asset_id): $($row.gate_30_score)"
    } elseif ($gateScore -lt 0 -or $gateScore -gt 30) {
      Add-Failure "gate_30_score out of range for $($row.asset_id): $gateScore"
    } elseif ($row.gate_verdict -eq 'approved with notes' -and $gateScore -lt 26) {
      Add-Failure "Approved row below 26/30: $($row.asset_id) scored $gateScore"
    } elseif ($row.gate_verdict -eq 'iterate' -and ($gateScore -lt 22 -or $gateScore -gt 25)) {
      Add-Failure "Iterate row outside 22-25 range: $($row.asset_id) scored $gateScore"
    } elseif ($row.gate_verdict -eq 'restart' -and $gateScore -gt 21) {
      Add-Failure "Restart row above 21/30: $($row.asset_id) scored $gateScore"
    }
  }

  if ($allowedVerdicts -notcontains $row.gate_verdict) {
    Add-Failure "Generated row missing valid gate_verdict: $($row.asset_id)"
  }

  foreach ($field in @('ship_status', 'recap', 'critic_notes', 'next_improvement', 'skill_mode')) {
    if ([string]::IsNullOrWhiteSpace($row.$field)) {
      Add-Failure "Generated row missing $field`: $($row.asset_id)"
    }
  }
}

if ($generatedRows.Count -lt $MinGenerated) {
  Add-Failure "Generated row count below minimum: $($generatedRows.Count) < $MinGenerated"
}

if (Test-Path -LiteralPath $galleryPath) {
  $galleryHtml = Get-Content -LiteralPath $galleryPath -Raw
  foreach ($row in $generatedRows) {
    if (![string]::IsNullOrWhiteSpace($row.workspace_path) -and $galleryHtml -notlike "*$($row.workspace_path)*") {
      Add-Failure "Gallery does not reference generated image: $($row.asset_id)"
    }
  }
}

if (Test-Path -LiteralPath $evidencePath) {
  try {
    Get-Content -LiteralPath $evidencePath -Raw | ConvertFrom-Json | Out-Null
  } catch {
    Add-Failure "design-loop-evidence.json is invalid JSON: $($_.Exception.Message)"
  }

  $validator = Join-Path $estateRoot 'design-agent-standards\scripts\validate_design_evidence.py'
  if (Test-Path -LiteralPath $validator) {
    & python $validator $evidencePath | Out-Host
    if ($LASTEXITCODE -ne 0) {
      Add-Failure "Design evidence validator failed with exit code $LASTEXITCODE."
    }
  } else {
    Add-Failure "Missing design evidence validator: $validator"
  }
}

New-Item -ItemType Directory -Force -Path $loopProofs | Out-Null

$summary = [ordered]@{
  checked_at = (Get-Date).ToString('s')
  run_root = $runRootFull
  prompts = $prompts.Count
  ledger_rows = $ledgerRows.Count
  generated = $generatedRows.Count
  approved_with_notes = $approvedRows.Count
  iterate = $iterateRows.Count
  restart = $restartRows.Count
  failures = @($failures)
}

$summaryPath = Join-Path $loopProofs 'latest-image-run-gate.json'
($summary | ConvertTo-Json -Depth 6) | Set-Content -LiteralPath $summaryPath -Encoding UTF8

if ($failures.Count -gt 0) {
  Write-Host "Arcanea image run gate: FAIL"
  foreach ($failure in $failures) {
    Write-Host "- $failure"
  }
  Write-Host "Proof: $summaryPath"
  exit 1
}

Write-Host "Arcanea image run gate: PASS"
Write-Host "Prompts: $($prompts.Count)"
Write-Host "Generated: $($generatedRows.Count)"
Write-Host "Approved with notes: $($approvedRows.Count)"
Write-Host "Iterate: $($iterateRows.Count)"
Write-Host "Restart: $($restartRows.Count)"
Write-Host "Proof: $summaryPath"
