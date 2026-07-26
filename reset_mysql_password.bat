@echo off
title Smart Waste - MySQL Password Reset
echo =================================================
echo   AI Smart Waste Management - MySQL Password Reset
echo   RIGHT-CLICK this file and "Run as Administrator"
echo =================================================
echo.

REM Stop MySQL service
echo [1/4] Stopping MySQL service...
net stop MySQL80
if errorlevel 1 (
    echo.
    echo [ERROR] Could not stop MySQL80.
    echo Please right-click this file and select "Run as Administrator"
    pause
    exit /b 1
)
timeout /t 3 /nobreak >nul

REM Write the password reset SQL
echo [2/4] Writing reset SQL file...
echo ALTER USER 'root'@'localhost' IDENTIFIED BY 'smartwaste123'; FLUSH PRIVILEGES; > "%TEMP%\reset_mysql.sql"

REM Start mysqld with init-file to apply the new password
echo [3/4] Applying new password (wait ~12 seconds)...
start /wait "" "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" ^
    --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.0\my.ini" ^
    --init-file="%TEMP%\reset_mysql.sql" ^
    --user=root ^
    --console
timeout /t 12 /nobreak >nul
taskkill /F /IM mysqld.exe >nul 2>&1
timeout /t 3 /nobreak >nul

REM Restart MySQL normally
echo [4/4] Starting MySQL service normally...
net start MySQL80
timeout /t 4 /nobreak >nul

echo.
echo =================================================
echo   SUCCESS!
echo   MySQL root password is now: smartwaste123
echo   Now double-click "start_app.bat" to launch the app
echo =================================================
pause
