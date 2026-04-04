# Arcanea Secret Manager - Secure API Key Setup
# All keys stored in Windows User Environment (encrypted by Windows, never in files)
#
# Usage: powershell .arcanea/scripts/secrets/setup-keys.ps1
# Or set individual: powershell .arcanea/scripts/secrets/setup-keys.ps1 GROQ_API_KEY gsk_xxx

param(
    [Parameter(Position=0)] [string] $KeyName = "",
    [Parameter(Position=1)] [string] $KeyValue = ""
)

$KEYS = @(
    @{ Name="GROQ_API_KEY";       Desc="Groq - Free voice transcription (2h/day)"; Url="console.groq.com" }
    @{ Name="ELEVENLABS_API_KEY"; Desc="ElevenLabs - Premium TTS voice ($5/mo)";   Url="elevenlabs.io/app/settings/api-keys" }
    @{ Name="HEYGEN_API_KEY";     Desc="HeyGen - Talking avatar API ($24/mo)";     Url="app.heygen.com/settings/api" }
    @{ Name="OPENAI_API_KEY";     Desc="OpenAI - GPT + TTS + Whisper";             Url="platform.openai.com/api-keys" }
    @{ Name="SUPABASE_URL";       Desc="Supabase - Database URL";                  Url="supabase.com/dashboard" }
    @{ Name="SUPABASE_ANON_KEY";  Desc="Supabase - Public anon key";               Url="supabase.com/dashboard" }
    @{ Name="SENTRY_DSN";        Desc="Sentry - Error tracking";                   Url="sentry.io" }
    @{ Name="POSTHOG_KEY";       Desc="PostHog - Analytics";                       Url="posthog.com" }
)

function Show-Status {
    Write-Host ""
    Write-Host "  Arcanea Secret Manager" -ForegroundColor Cyan
    Write-Host "  Storage: Windows User Environment (encrypted)" -ForegroundColor DarkGray
    Write-Host "  Never stored in files, git, or repos" -ForegroundColor DarkGray
    Write-Host "  ---" -ForegroundColor DarkGray
    Write-Host ""

    foreach ($k in $KEYS) {
        $val = [System.Environment]::GetEnvironmentVariable($k.Name, "User")
        if ($val) {
            $masked = $val.Substring(0, [math]::Min(8, $val.Length)) + "..." + $val.Substring([math]::Max(0, $val.Length - 4))
            Write-Host "  [SET]   $($k.Name.PadRight(22)) $masked" -ForegroundColor Green
        } else {
            Write-Host "  [EMPTY] $($k.Name.PadRight(22)) $($k.Desc)" -ForegroundColor DarkYellow
            Write-Host "          Get at: $($k.Url)" -ForegroundColor DarkGray
        }
    }
    Write-Host ""
    Write-Host "  Set a key: voice-keys <KEY_NAME> <value>" -ForegroundColor DarkGray
    Write-Host "  Or: [System.Environment]::SetEnvironmentVariable('KEY','val','User')" -ForegroundColor DarkGray
    Write-Host ""
}

function Set-Key($name, $value) {
    [System.Environment]::SetEnvironmentVariable($name, $value, "User")
    $masked = $value.Substring(0, [math]::Min(8, $value.Length)) + "..."
    Write-Host "  Set $name = $masked" -ForegroundColor Green
    Write-Host "  Restart terminal for scripts to pick it up." -ForegroundColor DarkGray
}

# Main
if ($KeyName -and $KeyValue) {
    Set-Key $KeyName $KeyValue
} elseif ($KeyName -eq "audit") {
    # Check for leaked keys in repo
    Write-Host ""
    Write-Host "  Scanning repo for leaked secrets..." -ForegroundColor Yellow
    $leaks = & git -C "C:\Users\frank\Arcanea" grep -rn -E "(sk-[a-zA-Z0-9]{20,}|gsk_[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36}|eyJ[a-zA-Z0-9])" -- "*.ts" "*.tsx" "*.js" "*.mjs" "*.ps1" "*.json" 2>$null | Select-String -NotMatch "node_modules|dist|.git|pattern|regex|grep|example"
    if ($leaks) {
        Write-Host "  FOUND POTENTIAL LEAKS:" -ForegroundColor Red
        $leaks | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    } else {
        Write-Host "  No leaked secrets found." -ForegroundColor Green
    }
    Write-Host ""
} else {
    Show-Status
}
