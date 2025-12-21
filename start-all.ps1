# OTTSONLY - Start All Servers
Write-Host "Starting OTTSONLY Backend, Frontend, and Admin Panel..." -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "[1/3] Starting Backend on http://localhost:8000" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\projects\ottsonly web\backend'; python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "[2/3] Starting Frontend on http://localhost:4028" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\projects\ottsonly web\frontend-main'; npm start"

Start-Sleep -Seconds 2

# Start Admin Panel
Write-Host "[3/3] Starting Admin Panel on http://localhost:3001" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\projects\ottsonly web\frontend-admin'; npm start"

Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host " OTTSONLY All Servers Started!" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Green
Write-Host " Backend:     http://localhost:8000" -ForegroundColor White
Write-Host " API Docs:    http://localhost:8000/docs" -ForegroundColor White
Write-Host " Frontend:    http://localhost:4028" -ForegroundColor White
Write-Host " Admin Panel: http://localhost:3001" -ForegroundColor White
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
