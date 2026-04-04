$WshShell = New-Object -ComObject WScript.Shell
$startMenu = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs"
$voiceScript = "C:\Users\frank\Arcanea\.arcanea\scripts\voice\voice.ps1"
$workDir = "C:\Users\frank\Arcanea"

$shortcuts = @(
    @{ Name="Arcanea Voice Note";     Mode="note";      Key="Ctrl+Alt+N"; Desc="Quick Voice Note" },
    @{ Name="Arcanea Voice Strategy"; Mode="strategy";  Key="Ctrl+Alt+S"; Desc="Strategy Session" },
    @{ Name="Arcanea Voice Agent";    Mode="agent";     Key="Ctrl+Alt+A"; Desc="Agent Dispatch" },
    @{ Name="Arcanea Voice Over";     Mode="voiceover"; Key="Ctrl+Alt+V"; Desc="Voiceover Recording" }
)

foreach ($s in $shortcuts) {
    $lnk = $WshShell.CreateShortcut("$startMenu\$($s.Name).lnk")
    $lnk.TargetPath = "powershell.exe"
    $lnk.Arguments = "-ExecutionPolicy Bypass -File `"$voiceScript`" $($s.Mode)"
    $lnk.WorkingDirectory = $workDir
    $lnk.Hotkey = $s.Key
    $lnk.IconLocation = "shell32.dll,168"
    $lnk.Description = $s.Desc
    $lnk.Save()
    Write-Host "  Created: $($s.Name) [$($s.Key)]" -ForegroundColor Green
}

# Also create desktop shortcut for quick access
$desktop = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Arcanea Voice.lnk")
$desktop.TargetPath = "pythonw.exe"
$desktop.Arguments = "C:\Users\frank\Arcanea\.arcanea\scripts\voice\voice-tray.pyw"
$desktop.WorkingDirectory = $workDir
$desktop.IconLocation = "shell32.dll,168"
$desktop.Description = "Arcanea Voice System Tray"
$desktop.Save()
Write-Host "  Created: Desktop shortcut (tray app)" -ForegroundColor Green

Write-Host ""
Write-Host "  Global Hotkeys (work from ANY app):" -ForegroundColor Cyan
Write-Host "  Ctrl+Alt+N  = Quick Note" -ForegroundColor White
Write-Host "  Ctrl+Alt+S  = Strategy" -ForegroundColor White
Write-Host "  Ctrl+Alt+A  = Agent Dispatch" -ForegroundColor White
Write-Host "  Ctrl+Alt+V  = Voiceover" -ForegroundColor White
Write-Host ""
