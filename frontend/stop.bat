@echo off
setlocal EnableDelayedExpansion

REM Stop Vite frontend dev server on port 5173

echo Stopping frontend dev server...

set _stopped=0
for /f "tokens=5" %%I in ('netstat -ano ^| findstr /R /C:":5173.*LISTENING"') do (
  echo  - Killing PID %%I on :5173
  taskkill /F /PID %%I >nul 2>&1
  set _stopped=1
)

if not !_stopped! == 1 (
  echo  - No listener found on :5173
)

echo Done.
exit /b 0

