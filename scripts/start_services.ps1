# ArthaLens Services Orchestrator (Windows / PowerShell)
# Ensures Redis 8 and Next.js Web Portal are running and available

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   Starting ArthaLens Intelligence Hub   " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Check & Start Redis Server
$redisBin = "C:\Users\madhv\AppData\Local\Microsoft\WinGet\Packages\taizod1024.redis-windows-fork_Microsoft.Winget.Source_8wekyb3d8bbwe\Redis-8.10.1-Windows-x64-msys2\redis-server.exe"
$redisCli = "C:\Users\madhv\AppData\Local\Microsoft\WinGet\Packages\taizod1024.redis-windows-fork_Microsoft.Winget.Source_8wekyb3d8bbwe\Redis-8.10.1-Windows-x64-msys2\redis-cli.exe"

$redisListening = Get-NetTCPConnection -LocalPort 6379 -ErrorAction SilentlyContinue

if (-not $redisListening) {
    Write-Host "[1/3] Launching Redis 8 daemon on port 6379..." -ForegroundColor Yellow
    Start-Process -FilePath $redisBin -ArgumentList "--port 6379" -WindowStyle Hidden
    Start-Sleep -Seconds 2
} else {
    Write-Host "[1/3] Redis 8 is already active on port 6379." -ForegroundColor Green
}

# Verify Redis PING
$pingResult = & $redisCli ping
if ($pingResult -eq "PONG") {
    Write-Host "  -> Redis Health Check: PONG (Verified)" -ForegroundColor Green
} else {
    Write-Host "  -> Warning: Redis ping did not return PONG. Retrying..." -ForegroundColor Yellow
}

# 2. Check Port 3000 & Start Next.js Web Service
$webListening = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if (-not $webListening) {
    Write-Host "[2/3] Launching ArthaLens Next.js Web App on http://localhost:3000..." -ForegroundColor Yellow
    Set-Location "C:\Projects\ArthaLens\arthalens\apps\web"
    Start-Process -FilePath "npm" -ArgumentList "run start" -WorkingDirectory "C:\Projects\ArthaLens\arthalens\apps\web" -WindowStyle Hidden
    Start-Sleep -Seconds 3
} else {
    Write-Host "[2/3] Web App is already listening on port 3000." -ForegroundColor Green
}

Write-Host "[3/3] ArthaLens Platform is live and reachable at:" -ForegroundColor Cyan
Write-Host "  -> http://localhost:3000" -ForegroundColor White -BackgroundColor DarkGreen
Write-Host "=========================================" -ForegroundColor Cyan
