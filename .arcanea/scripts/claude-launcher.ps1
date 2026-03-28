param(
    [switch]$Diag,
    [switch]$Bare,
    [switch]$Wsl,
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$ClaudeArgs
)

$ErrorActionPreference = "Stop"

$RepoWindowsPath = "C:\Users\frank\Arcanea"
$RepoWslPath = "/mnt/c/Users/frank/Arcanea"
$Distro = "Ubuntu"
$WindowsClaudePath = "C:\Users\frank\.local\bin\claude.exe"

function Write-LauncherLine {
    param(
        [string]$Message,
        [string]$Color = "Gray"
    )

    Write-Host "   $Message" -ForegroundColor $Color
}

function Invoke-WslChecked {
    param(
        [string]$Command,
        [int]$TimeoutSeconds = 20
    )

    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "wsl.exe"
    $psi.Arguments = "-d $Distro -e bash --noprofile --norc -lc ""$Command"""
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $psi
    [void]$process.Start()

    if (-not $process.WaitForExit($TimeoutSeconds * 1000)) {
        try { $process.Kill() } catch {}
        return [pscustomobject]@{
            Success  = $false
            ExitCode = 124
            StdOut   = ""
            StdErr   = "Timed out after $TimeoutSeconds seconds"
        }
    }

    $stdout = ($process.StandardOutput.ReadToEnd() -replace "`0", "").Trim()
    $stderr = ($process.StandardError.ReadToEnd() -replace "`0", "").Trim()

    return [pscustomobject]@{
        Success  = ($process.ExitCode -eq 0)
        ExitCode = $process.ExitCode
        StdOut   = $stdout
        StdErr   = $stderr
    }
}

function Get-WslStatus {
    $status = @{
        WslInstalled   = $false
        DistroPresent  = $false
        DistroState    = "unverified"
        ProbeOk        = $false
        ClaudeFound    = $false
        ClaudeVersion  = ""
        ProbeStdErr    = ""
        ProbeStdOut    = ""
    }

    $wslCommand = Get-Command wsl.exe -ErrorAction SilentlyContinue
    if (-not $wslCommand) {
        return $status
    }

    $status.WslInstalled = $true

    $probe = Invoke-WslChecked -Command "echo OK; whoami; pwd"
    $status.ProbeOk = $probe.Success
    $status.ProbeStdOut = $probe.StdOut
    $status.ProbeStdErr = $probe.StdErr

    if ($probe.Success) {
        $status.DistroPresent = $true
        $status.DistroState = "running"
    } elseif ($probe.StdErr -match "There is no distribution|distribution.*not found|WSL_E_DISTRO_NOT_FOUND") {
        $status.DistroPresent = $false
        $status.DistroState = "missing"
        return $status
    } else {
        $status.DistroPresent = $true
        $status.DistroState = "probe-failed"
        return $status
    }

    $claudeCheck = Invoke-WslChecked -Command "command -v claude >/dev/null 2>&1 && { command -v claude; claude --version; }"
    if ($claudeCheck.Success) {
        $claudeLines = @($claudeCheck.StdOut -split "`r?`n" | Where-Object { $_.Trim() -ne "" })
        if ($claudeLines.Count -ge 1) {
            $status.ClaudeFound = $true
            if ($claudeLines.Count -ge 2) {
                $status.ClaudeVersion = $claudeLines[1]
            }
        }
    } elseif ($claudeCheck.StdErr) {
        $status.ProbeStdErr = (($status.ProbeStdErr, $claudeCheck.StdErr) -join "`n").Trim()
    }

    return $status
}

function Get-WindowsClaudeStatus {
    $status = @{
        ClaudeFound   = $false
        ClaudeVersion = ""
        ProbeStdErr   = ""
    }

    if (-not (Test-Path $WindowsClaudePath)) {
        return $status
    }

    try {
        $version = & $WindowsClaudePath --version 2>$null
        if ($LASTEXITCODE -eq 0 -and $version) {
            $status.ClaudeFound = $true
            $status.ClaudeVersion = ($version | Select-Object -First 1).ToString().Trim()
        }
    } catch {
        $status.ProbeStdErr = $_.Exception.Message
    }

    return $status
}

function Start-WindowsClaude {
    Write-Host ""
    Write-LauncherLine "Launching Claude Code natively on Windows..." "Cyan"
    Write-LauncherLine "Path: $RepoWindowsPath" "DarkGray"
    if ($Bare) {
        Write-LauncherLine "Mode: bare flag ignored on Windows launcher" "Yellow"
    }
    Write-Host ""

    Set-Location $RepoWindowsPath
    & $WindowsClaudePath --dangerously-skip-permissions @ClaudeArgs
    exit $LASTEXITCODE
}

function Show-Diagnostics {
    $status = Get-WslStatus
    $winStatus = Get-WindowsClaudeStatus

    Write-Host ""
    Write-LauncherLine "Arcanea Claude Diagnostics" "Cyan"
    Write-LauncherLine "Repo (Windows): $RepoWindowsPath"
    Write-LauncherLine "Repo (WSL): $RepoWslPath"
    Write-LauncherLine "Native Claude: $($winStatus.ClaudeFound)"
    if ($winStatus.ClaudeVersion) {
        Write-LauncherLine "Native version: $($winStatus.ClaudeVersion)"
    }
    Write-LauncherLine "WSL installed: $($status.WslInstalled)"
    Write-LauncherLine "Distro present: $($status.DistroPresent)"
    Write-LauncherLine "Distro state: $($status.DistroState)"
    Write-LauncherLine "WSL probe OK: $($status.ProbeOk)"
    Write-LauncherLine "Claude in WSL: $($status.ClaudeFound)"
    if ($status.ClaudeVersion) {
        Write-LauncherLine "Claude version: $($status.ClaudeVersion)"
    }
    if ($status.ProbeStdOut) {
        Write-LauncherLine ("Probe output: " + ($status.ProbeStdOut -replace "`r?`n", " | "))
    }
    if ($status.ProbeStdErr) {
        Write-LauncherLine ("Probe error: " + ($status.ProbeStdErr -replace "`r?`n", " | ")) "Yellow"
    }
    Write-LauncherLine "Bare mode: $Bare"
    Write-Host ""

    if (-not $winStatus.ClaudeFound -and -not $status.WslInstalled) { exit 1 }
    if (-not $winStatus.ClaudeFound -and -not $status.DistroPresent) { exit 2 }
    if (-not $winStatus.ClaudeFound -and -not $status.ProbeOk) { exit 3 }
    if (-not $winStatus.ClaudeFound -and -not $status.ClaudeFound) { exit 4 }
}

if ($Diag) {
    Show-Diagnostics
    exit 0
}

if (-not $Wsl) {
    $winStatus = Get-WindowsClaudeStatus
    if ($winStatus.ClaudeFound) {
        Start-WindowsClaude
    }
}

Write-Host ""
Write-LauncherLine "Launching Claude Code in WSL..." "Cyan"
Write-LauncherLine "Path: $RepoWslPath" "DarkGray"
if ($Bare) {
    Write-LauncherLine "Mode: bare (no Arcanea project config)" "Yellow"
}
Write-Host ""

$status = Get-WslStatus

if (-not $status.WslInstalled) {
    Write-LauncherLine "WSL is not available on this machine." "Red"
    exit 1
}

if (-not $status.DistroPresent) {
    Write-LauncherLine "WSL distro '$Distro' was not found." "Red"
    exit 2
}

if (-not $status.ProbeOk) {
    Write-LauncherLine "WSL probe failed before Claude could start." "Red"
    if ($status.ProbeStdErr) {
        Write-LauncherLine $status.ProbeStdErr "Yellow"
    }
    Write-LauncherLine "Run 'cla -Diag' for a focused diagnosis." "Yellow"
    exit 3
}

if (-not $status.ClaudeFound) {
    $winStatus = Get-WindowsClaudeStatus
    if ($winStatus.ClaudeFound) {
        Write-LauncherLine "WSL Claude probe failed. Falling back to native Windows Claude." "Yellow"
        Start-WindowsClaude
    }
    Write-LauncherLine "Claude is not available inside WSL." "Red"
    Write-LauncherLine "Run 'cla -Diag' to inspect the WSL environment." "Yellow"
    exit 4
}

$barePrefix = ""
if ($Bare) {
    $barePrefix = "export HOME=/tmp/claude-bare-home; export CLAUDE_CONFIG_DIR=/tmp/claude-bare-home/.claude; mkdir -p `"$CLAUDE_CONFIG_DIR`"; "
}

$escapedArgs = @()
foreach ($arg in $ClaudeArgs) {
    $escapedArgs += "'" + ($arg -replace "'", "'\''") + "'"
}
$argString = $escapedArgs -join " "

$claudeCommand = $barePrefix + "cd $RepoWslPath && claude --dangerously-skip-permissions"
if ($argString) {
    $claudeCommand += " $argString"
}

& wsl.exe -d $Distro -e bash --noprofile --norc -lc $claudeCommand
exit $LASTEXITCODE
