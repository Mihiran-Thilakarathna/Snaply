# Snaply - Local Run Script
# Run this from: e:\my_projects\Snaply\
# Memurai service is started ONLY when this script runs, and stopped when done.

$rootDir     = $PSScriptRoot
$backendDir  = Join-Path $rootDir "backend"
$frontendDir = Join-Path $rootDir "frontend"
$venvPython  = Join-Path $backendDir "venv\Scripts\python.exe"
$venvActivate = Join-Path $backendDir "venv\Scripts\Activate.ps1"

# Track whether WE started Redis (so we only stop it if we started it)
$weStartedRedis = $false

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Snaply - Starting Local Dev Server   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# --- Check venv ---
if (-not (Test-Path $venvPython)) {
    Write-Host "[ERROR] venv not found!" -ForegroundColor Red
    Write-Host "        Run this first:" -ForegroundColor Yellow
    Write-Host "        cd backend" -ForegroundColor Yellow
    Write-Host "        python -m venv venv" -ForegroundColor Yellow
    Write-Host "        venv\Scripts\pip install -r requirements.txt" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# --- Start Memurai/Redis only if not already running ---
$redisRunning = (Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue).TcpTestSucceeded

if ($redisRunning) {
    Write-Host "[OK] Redis already running" -ForegroundColor Green
} else {
    # Try to start Memurai Windows Service
    $memuraiService = Get-Service -Name "Memurai" -ErrorAction SilentlyContinue
    if ($memuraiService) {
        Write-Host "[Redis] Starting Memurai service..." -ForegroundColor Cyan
        Start-Service -Name "Memurai"
        Start-Sleep -Seconds 2
        $weStartedRedis = $true
        Write-Host "[OK] Memurai started" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Redis not running and Memurai not installed!" -ForegroundColor Red
        Write-Host "        Install from: https://www.memurai.com/get-memurai" -ForegroundColor Yellow
        Write-Host "        After install, run this script again." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# --- Start Backend (FastAPI) ---
Write-Host "[1/3] Starting FastAPI Backend..." -ForegroundColor Cyan
$backend = Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "cd '$backendDir'; & '$venvActivate'; `$host.UI.RawUI.WindowTitle = 'Snaply - Backend'; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" `
    -PassThru

Start-Sleep -Seconds 2

# --- Start Celery Worker ---
Write-Host "[2/3] Starting Celery Worker..." -ForegroundColor Cyan
$worker = Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "cd '$backendDir'; & '$venvActivate'; `$host.UI.RawUI.WindowTitle = 'Snaply - Celery Worker'; celery -A app.celery_app worker --loglevel=info --pool=solo" `
    -PassThru

Start-Sleep -Seconds 2

# --- Start Frontend ---
Write-Host "[3/3] Starting Frontend (Vite)..." -ForegroundColor Cyan
$frontend = Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "cd '$frontendDir'; `$host.UI.RawUI.WindowTitle = 'Snaply - Frontend'; npm run dev" `
    -PassThru

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " All services started!" -ForegroundColor Green
Write-Host ""
Write-Host " Frontend  -> http://localhost:5173" -ForegroundColor White
Write-Host " Backend   -> http://localhost:8000" -ForegroundColor White
Write-Host " API Docs  -> http://localhost:8000/docs" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Start-Sleep -Seconds 1
Start-Process "http://localhost:5173"

# --- Wait here — when user presses Enter, stop everything ---
Write-Host "Press Enter to STOP all Snaply services and free up RAM..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "Stopping all services..." -ForegroundColor Cyan

# Close the terminal windows
@($backend, $worker, $frontend) | ForEach-Object {
    if ($_ -and -not $_.HasExited) {
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
}

# Stop Redis only if we started it
if ($weStartedRedis) {
    Write-Host "Stopping Memurai (Redis)..." -ForegroundColor Cyan
    Stop-Service -Name "Memurai" -Force -ErrorAction SilentlyContinue
    Write-Host "[OK] Memurai stopped - RAM freed!" -ForegroundColor Green
}

Write-Host ""
Write-Host "All Snaply services stopped. Laptop is free!" -ForegroundColor Green
Write-Host ""
