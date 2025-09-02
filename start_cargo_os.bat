@echo off
setlocal EnableDelayedExpansion

REM Cargo os launcher (Windows)
REM Starts Flask backend (port 5000) and Vite frontend (port 5173)

cd /d "%~dp0"

echo [1/6] Checking prerequisites...
where python >nul 2>&1 || (echo ERROR: Python not found. Install Python 3.10+ and retry.& exit /b 1)
where npm >nul 2>&1 || (echo ERROR: npm not found. Install Node.js 18+ and retry.& exit /b 1)

echo [2/6] Ensuring database exists...
python -c "from backend.database import bootstrap_database; bootstrap_database()" 1>nul 2>nul

echo [3/6] Installing backend dependencies (if needed)...
python -m pip install -r backend\requirements.txt >nul

echo [4/6] Freeing ports 5000 and 5173 if occupied...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":5000.*LISTENING"') do (
  echo   Killing PID %%P on :5000
  taskkill /F /PID %%P >nul 2>&1
)
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":5173.*LISTENING"') do (
  echo   Killing PID %%P on :5173
  taskkill /F /PID %%P >nul 2>&1
)

echo [5/6] Starting backend at http://localhost:5000 ...
start "Cargo os API" cmd /c "cd /d backend && python main.py"

echo [6/6] Starting frontend at http://localhost:5173 ...
start "Cargo os Frontend (Frontend)" cmd /k "cd /d frontend && npm install --loglevel=error || (echo ОШИБКА: Установка зависимостей не удалась (код: !errorlevel!) && pause && exit /b 1) && npm run dev || (echo ОШИБКА: Запуск фронтенда не удался (код: !errorlevel!) && pause && exit /b 1)"

echo.
echo Launch complete.
echo  - Backend health:  http://localhost:5000/api/health
echo  - Frontend:        http://localhost:5173
echo.
exit /b 0
