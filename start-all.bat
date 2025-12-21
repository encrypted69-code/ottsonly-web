@echo off
echo Starting OTTSONLY Backend, Frontend, and Admin Panel...
echo.

echo [1/3] Starting Backend on http://localhost:8000
start "OTTSONLY Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend on http://localhost:4028
start "OTTSONLY Frontend" cmd /k "cd /d %~dp0frontend-main && npm start"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Admin Panel on http://localhost:3001
start "OTTSONLY Admin Panel" cmd /k "cd /d %~dp0frontend-admin && npm start"

echo.
echo ========================================
echo  OTTSONLY All Servers Started!
echo ========================================
echo  Backend:     http://localhost:8000
echo  API Docs:    http://localhost:8000/docs
echo  Frontend:    http://localhost:4028
echo  Admin Panel: http://localhost:3001
echo ========================================
echo.
echo Press any key to close this window...
pause >nul
