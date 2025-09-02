@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Stop Cargo os services by freeing ports 5000 (API) and 5173 (Frontend)

echo Stopping Cargo os services...

set _stopped=0

for %%P in (5000 5173) do (
  for /f "tokens=5" %%I in ('netstat -ano ^| findstr /R /C:":%%P.*LISTENING"') do (
    echo  - Killing PID %%I on :%%P
    taskkill /F /PID %%I >nul 2>&1
    set _stopped=1
  )
)

if not !_stopped! == 1 (
  echo  - No listeners found on :5000 or :5173
)

echo Done.
exit /b 0

