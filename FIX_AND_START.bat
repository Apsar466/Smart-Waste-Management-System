@echo off
:: ============================================================
::  Smart Waste Management - Full Fix & Start Script
::  Run this file as Administrator (Right-click -> Run as administrator)
:: ============================================================
NET SESSION >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Please RIGHT-CLICK this file and select "Run as administrator"
    pause
    exit /b 1
)

title Smart Waste - Fix and Start

echo ============================================================
echo   Smart Waste Management System - Fix and Start
echo ============================================================
echo.

:: Step 1: Set MySQL root password to smartwaste123
echo [1/5] Resetting MySQL root password...
net stop MySQL80 >nul 2>&1
timeout /t 3 /nobreak >nul

echo ALTER USER 'root'@'localhost' IDENTIFIED BY 'smartwaste123'; FLUSH PRIVILEGES; > "%TEMP%\reset_pw.sql"

start /wait "" "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" ^
    --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.0\my.ini" ^
    --init-file="%TEMP%\reset_pw.sql" ^
    --console

timeout /t 5 /nobreak >nul
taskkill /F /IM mysqld.exe >nul 2>&1
timeout /t 3 /nobreak >nul

net start MySQL80
timeout /t 5 /nobreak >nul
echo      Done - MySQL root password set to: smartwaste123
echo.

:: Step 2: Create the database
echo [2/5] Creating smart_waste database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -psmartwaste123 -e "CREATE DATABASE IF NOT EXISTS smart_waste CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
echo      Done.
echo.

:: Step 3: Start frontend in a new window
echo [3/5] Starting frontend (Vite dev server on port 3000)...
start "Smart Waste - Frontend" cmd /k "cd /d ""S:\Waste Management System\frontend"" && npm run dev"
timeout /t 5 /nobreak >nul
echo      Done.
echo.

:: Step 4: Start backend in a new window
echo [4/5] Starting Spring Boot backend on port 8080...
start "Smart Waste - Backend" cmd /k "cd /d ""S:\Waste Management System"" && set DB_PORT=3306 && set DB_USER=root && set DB_PASSWORD=smartwaste123 && set DB_NAME=smart_waste && set GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE && mvnw.cmd spring-boot:run"
echo      Done.
echo.

echo [5/5] All services launched!
echo.
echo ============================================================
echo   Frontend  : http://localhost:3000
echo   Backend   : http://localhost:8080/api
echo   Swagger   : http://localhost:8080/api/swagger-ui.html
echo ============================================================
echo.
echo Wait ~30-60 seconds for the backend (Spring Boot) to fully start.
echo.
pause

