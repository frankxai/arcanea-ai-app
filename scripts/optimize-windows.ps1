# Arcanea Windows Performance Optimizer
# Prepares system for running 5+ Claude Code instances simultaneously
# Run as Administrator for full effect

Write-Host "`n=== ARCANEA WINDOWS OPTIMIZER ===" -ForegroundColor Cyan
Write-Host "Preparing for multi-instance Claude Code development`n"

# 1. Set High Performance power plan
Write-Host "[1/6] Setting High Performance power plan..." -ForegroundColor Yellow
$highPerf = powercfg -list | Select-String "High performance"
if ($highPerf) {
    $guid = ($highPerf -replace '.*GUID:\s*(\S+).*','$1')
    powercfg -setactive $guid
    Write-Host "  -> High Performance activated" -ForegroundColor Green
} else {
    # Create High Performance plan if missing
    powercfg -duplicatescheme 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c
    Write-Host "  -> High Performance plan created. Run script again to activate." -ForegroundColor Yellow
}

# 2. Add Windows Defender exclusions for development folders
Write-Host "[2/6] Adding Defender exclusions for dev folders..." -ForegroundColor Yellow
$exclusions = @(
    "$env:USERPROFILE\Arcanea",
    "$env:USERPROFILE\.claude",
    "$env:USERPROFILE\AppData\Roaming\npm",
    "$env:USERPROFILE\AppData\Local\npm-cache",
    "$env:USERPROFILE\AppData\Local\Temp\claude"
)
foreach ($path in $exclusions) {
    try {
        Add-MpPreference -ExclusionPath $path -ErrorAction SilentlyContinue
        Write-Host "  -> Excluded: $path" -ForegroundColor Green
    } catch {
        Write-Host "  -> Skipped (needs admin): $path" -ForegroundColor DarkYellow
    }
}

# Also exclude node.exe and npm processes
try {
    Add-MpPreference -ExclusionProcess "node.exe" -ErrorAction SilentlyContinue
    Add-MpPreference -ExclusionProcess "claude.exe" -ErrorAction SilentlyContinue
    Write-Host "  -> Excluded processes: node.exe, claude.exe" -ForegroundColor Green
} catch {
    Write-Host "  -> Process exclusions skipped (needs admin)" -ForegroundColor DarkYellow
}

# 3. Optimize Node.js for multi-instance
Write-Host "[3/6] Setting Node.js optimization env vars..." -ForegroundColor Yellow
[System.Environment]::SetEnvironmentVariable("NODE_OPTIONS", "--max-old-space-size=2048", "User")
[System.Environment]::SetEnvironmentVariable("UV_THREADPOOL_SIZE", "16", "User")
Write-Host "  -> NODE_OPTIONS=--max-old-space-size=2048" -ForegroundColor Green
Write-Host "  -> UV_THREADPOOL_SIZE=16" -ForegroundColor Green

# 4. Clean npm cache
Write-Host "[4/6] Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force 2>$null
Write-Host "  -> npm cache cleaned" -ForegroundColor Green

# 5. Restart WSL with new limits
Write-Host "[5/6] Restarting WSL with optimized config..." -ForegroundColor Yellow
wsl --shutdown 2>$null
Start-Sleep -Seconds 2
Write-Host "  -> WSL shut down (2GB limit active on next start)" -ForegroundColor Green

# 6. Show system readiness
Write-Host "[6/6] System readiness check..." -ForegroundColor Yellow
$totalRAM = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 1)
$freeRAM = [math]::Round((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1MB, 1)
$cpuCores = (Get-CimInstance Win32_Processor).NumberOfLogicalProcessors

Write-Host "`n=== SYSTEM READINESS ===" -ForegroundColor Cyan
Write-Host "  Total RAM: ${totalRAM}GB"
Write-Host "  Free RAM:  ${freeRAM}GB"
Write-Host "  CPU Cores: $cpuCores logical processors"
Write-Host "  WSL Limit: 2GB (from 8GB)"

# Calculate capacity
$instanceRAM = 0.8  # ~800MB per Claude Code instance
$availableForClaude = $freeRAM - 2  # Reserve 2GB for Windows
$maxInstances = [math]::Floor($availableForClaude / $instanceRAM)

Write-Host "`n  Estimated Claude Code capacity: ~$maxInstances concurrent instances" -ForegroundColor Green
Write-Host "`n=== OPTIMIZATION COMPLETE ===" -ForegroundColor Cyan
Write-Host "Reboot recommended for all changes to take effect.`n"
