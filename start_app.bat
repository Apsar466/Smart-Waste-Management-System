@echo off
title Smart Waste - Start Backend
echo =================================================
echo   AI Smart Waste Management System - Backend
echo =================================================
echo.
echo Loading environment variables from .env...
if exist .env (
    for /f "usebackq tokens=1,2 delims==" %%i in (".env") do (
        set %%i=%%j
        echo Loaded %%i
    )
) else (
    echo [WARNING] .env file not found. Make sure to define GEMINI_API_KEY.
)
echo.
echo Starting Spring Boot backend...
echo Once started, open: http://localhost:8080/swagger-ui.html
echo Press Ctrl+C to stop the server.
echo.

REM Database credentials default fallback if not in .env
if "%DB_PORT%"=="" set DB_PORT=3307
if "%DB_USER%"=="" set DB_USER=root

"S:\Waste Management System\mvnw.cmd" spring-boot:run

pause
