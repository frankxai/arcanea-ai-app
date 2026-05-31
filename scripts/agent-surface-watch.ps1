param(
  [switch]$Watch,
  [int]$IntervalSeconds = 5
)

$ErrorActionPreference = 'Stop'

$OutputDir = Join-Path $HOME '.arcanea\machine'
$JsonPath = Join-Path $OutputDir 'agent-surface-status.json'
$TextPath = Join-Path $OutputDir 'agent-surface-status.txt'

function Normalize-Whitespace([string]$Text) {
  return ($Text -replace '\s+', ' ').Trim()
}

function Truncate([string]$Text, [int]$Max = 180) {
  if ($Text.Length -le $Max) { return $Text }
  return $Text.Substring(0, $Max - 1).TrimEnd() + '…'
}

function Get-TranscriptSummary([string]$Path) {
  try {
    $lines = Get-Content -LiteralPath $Path -Tail 18 -ErrorAction Stop
    for ($i = $lines.Count - 1; $i -ge 0; $i--) {
      $line = $lines[$i].Trim()
      if (-not $line) { continue }
      try {
        $record = $line | ConvertFrom-Json -ErrorAction Stop
        foreach ($field in @('content', 'message', 'prompt', 'text')) {
          if ($record.PSObject.Properties.Name -contains $field) {
            $value = [string]$record.$field
            if ($value) {
              $clean = Normalize-Whitespace $value
              if ($clean) { return (Truncate $clean) }
            }
          }
        }
      } catch {
        $clean = Normalize-Whitespace $line
        if ($clean) { return (Truncate $clean) }
      }
    }
  } catch {
    return $null
  }
  return $null
}

function Get-LatestFiles([string]$Root, [string]$Filter, [int]$Limit = 5) {
  if (-not (Test-Path -LiteralPath $Root)) { return @() }
  return Get-ChildItem -LiteralPath $Root -Recurse -File -Filter $Filter -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First $Limit
}

function Get-Processes {
  $targets = @('Antigravity.exe', 'claude.exe', 'agy.exe')
  $items = Get-CimInstance Win32_Process |
    Where-Object { $targets -contains $_.Name } |
    Select-Object Name,ProcessId,ParentProcessId,ExecutablePath,CommandLine

  foreach ($item in $items) {
    $runtime = 'claude'
    $exe = [string]$item.ExecutablePath
    if ($item.Name -eq 'Antigravity.exe' -or $item.Name -eq 'agy.exe' -or ($exe -match 'antigravity')) {
      $runtime = 'antigravity'
    }
    [pscustomobject]@{
      runtime = $runtime
      name = $item.Name
      pid = [int]$item.ProcessId
      parentPid = [int]$item.ParentProcessId
      executablePath = $item.ExecutablePath
      commandLine = $item.CommandLine
    }
  }
}

function Get-Worktrees([string]$RepoRoot) {
  if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot '.git'))) { return @() }
  $raw = git -C $RepoRoot worktree list --porcelain 2>$null
  if (-not $raw) { return @() }

  $blocks = ($raw -join "`n") -split "`n`n"
  $entries = foreach ($block in $blocks) {
    if (-not $block.Trim()) { continue }
    $lines = $block -split "`n"
    $path = ($lines | Where-Object { $_ -like 'worktree *' } | Select-Object -First 1)
    $branch = ($lines | Where-Object { $_ -like 'branch *' } | Select-Object -First 1)
    if (-not $path) { continue }
    [pscustomobject]@{
      path = $path.Substring(9)
      branch = if ($branch) { $branch.Substring(7) } else { '(detached)' }
    }
  }

  $entries = $entries | Where-Object { ($_.path -replace '\\', '/').ToLower().Contains('/.claude/worktrees/') }

  foreach ($entry in $entries) {
    $head = $null
    $status = $null
    $prevErrorAction = $ErrorActionPreference
    $ErrorActionPreference = 'SilentlyContinue'
    $head = & git -C $entry.path rev-parse --short HEAD 2>$null
    $headExit = $LASTEXITCODE
    $status = & git -C $entry.path status --short --branch --untracked-files=normal 2>$null
    $statusExit = $LASTEXITCODE
    $ErrorActionPreference = $prevErrorAction
    if ($headExit -ne 0) { $head = $null }
    if ($statusExit -ne 0) { $status = $null }
    $stat = Get-Item -LiteralPath $entry.path -ErrorAction SilentlyContinue
    [pscustomobject]@{
      path = $entry.path
      branch = $entry.branch
      head = if ($head) { $head.Trim() } else { $null }
      status = if ($status) { ($status -join "`n") } else { $null }
      updatedAt = if ($stat) { $stat.LastWriteTime.ToString('o') } else { $null }
    }
  }
}

function Build-Snapshot([string]$RepoRoot) {
  $claudeRoot = Join-Path $HOME 'AppData\Roaming\Claude\local-agent-mode-sessions'
  $antigravityRoot = Join-Path $HOME '.gemini\antigravity'

  $processes = @(Get-Processes)
  $worktrees = @(Get-Worktrees $RepoRoot)
  $claudeSessions = foreach ($file in Get-LatestFiles $claudeRoot 'transcript.jsonl') {
    [pscustomobject]@{
      path = $file.FullName
      updatedAt = $file.LastWriteTime.ToString('o')
      summary = Get-TranscriptSummary $file.FullName
    }
  }
  $antigravityConversations = foreach ($file in Get-LatestFiles (Join-Path $antigravityRoot 'conversations') '*.pb') {
    [pscustomobject]@{
      path = $file.FullName
      updatedAt = $file.LastWriteTime.ToString('o')
      summary = $null
    }
  }
  $antigravityBrains = foreach ($file in Get-LatestFiles (Join-Path $antigravityRoot 'brain') 'transcript.jsonl') {
    [pscustomobject]@{
      path = $file.FullName
      updatedAt = $file.LastWriteTime.ToString('o')
      summary = Get-TranscriptSummary $file.FullName
    }
  }

  [pscustomobject]@{
    timestamp = (Get-Date).ToString('o')
    host = if ($env:COMPUTERNAME) { $env:COMPUTERNAME } elseif ($env:HOSTNAME) { $env:HOSTNAME } else { 'unknown-host' }
    repoRoot = (Resolve-Path $RepoRoot).Path
    processes = $processes
    claude = [pscustomobject]@{
      worktrees = $worktrees
      sessions = $claudeSessions
    }
    antigravity = [pscustomobject]@{
      conversations = $antigravityConversations
      brains = $antigravityBrains
    }
  }
}

function Summarize-Snapshot($Snapshot) {
  $claudeParts = New-Object System.Collections.Generic.List[string]
  $antigravityParts = New-Object System.Collections.Generic.List[string]

  $claudeProcs = @($Snapshot.processes | Where-Object { $_.runtime -eq 'claude' })
  $agProcs = @($Snapshot.processes | Where-Object { $_.runtime -eq 'antigravity' })

  if ($claudeProcs.Count -gt 0) { $claudeParts.Add("$($claudeProcs.Count) process$($(if ($claudeProcs.Count -eq 1) { '' } else { 'es' })) alive") }
  if ($Snapshot.claude.worktrees.Count -gt 0) {
    $top = $Snapshot.claude.worktrees[0]
    $claudeParts.Add("worktree $($top.branch) @ $($top.path)")
  }
  $claudeTask = $Snapshot.claude.sessions | Where-Object { $_.summary } | Select-Object -First 1
  if ($claudeTask) { $claudeParts.Add("latest session: $($claudeTask.summary)") }

  if ($agProcs.Count -gt 0) { $antigravityParts.Add("$($agProcs.Count) process$($(if ($agProcs.Count -eq 1) { '' } else { 'es' })) alive") }
  $agTask = ($Snapshot.antigravity.brains | Where-Object { $_.summary } | Select-Object -First 1)
  if (-not $agTask) { $agTask = ($Snapshot.antigravity.conversations | Where-Object { $_.summary } | Select-Object -First 1) }
  if ($agTask) { $antigravityParts.Add("latest activity: $($agTask.summary)") }
  if ($Snapshot.antigravity.conversations.Count -gt 0) { $antigravityParts.Add("conversations: $($Snapshot.antigravity.conversations.Count)") }

  [pscustomobject]@{
    claude = $claudeParts
    antigravity = $antigravityParts
  }
}

function Write-Snapshot([string]$RepoRoot) {
  $snapshot = Build-Snapshot $RepoRoot
  $summary = Summarize-Snapshot $snapshot

  if (-not (Test-Path -LiteralPath $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
  }

  $snapshot | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $JsonPath -Encoding UTF8
  @(
    "timestamp: $($snapshot.timestamp)"
    "claude: $($summary.claude -join ' | ')"
    "antigravity: $($summary.antigravity -join ' | ')"
    "processes: $($snapshot.processes.Count)"
  ) | Set-Content -LiteralPath $TextPath -Encoding UTF8

  Write-Host "[agent-surface] wrote $JsonPath"
  Write-Host ("claude: " + ($summary.claude -join ' | '))
  Write-Host ("antigravity: " + ($summary.antigravity -join ' | '))
}

$repoRoot = (Get-Location).Path

if ($Watch) {
  while ($true) {
    try {
      Write-Snapshot $repoRoot
    } catch {
      Write-Host "[agent-surface] $($_.Exception.Message)"
    }
    Start-Sleep -Seconds $IntervalSeconds
  }
} else {
  Write-Snapshot $repoRoot
}
