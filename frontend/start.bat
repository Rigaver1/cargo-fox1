@echo off
setlocal EnableDelayedExpansion

REM Allow direct call to run dev logic in this script
if /I "%~1"=="dev" goto run_dev

REM Start Vite frontend dev server on port 5173

cd /d "%~dp0"

echo [1/4] Checking prerequisites...
where npm >nul 2>&1 || (echo ERROR: npm not found. Install Node.js 18+ and retry.& exit /b 1)

echo [2/4] Freeing port 5173 if occupied...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":5173.*LISTENING"') do (
  echo   Killing PID %%P on :5173
  taskkill /F /PID %%P >nul 2>&1
)

echo [3/4] Installing dependencies (if needed)...
set "npm_config_legacy_peer_deps=true"
npm install --loglevel=error
if errorlevel 1 (
  echo ERROR: npm install failed. Try removing node_modules and package-lock.json.
  pause
  exit /b 1
)

echo [4/4] Starting frontend at http://localhost:5173 ...
REM Start a new console that calls this same script with the 'dev' action
start "Frontend Dev" cmd /k "\"%~f0\" dev"

echo.
echo Frontend launch complete.
echo  - Open: http://localhost:5173
echo.
exit /b 0

:run_dev
echo Running: npm run dev
call npm run dev
set "_code=%errorlevel%"
if not "%_code%"=="0" (
  echo ERROR: npm run dev exited with code %_code%.
  pause
)
exit /b %_code%
