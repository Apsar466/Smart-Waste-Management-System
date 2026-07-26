@echo off
title Smart Waste - Start Frontend
echo =================================================
echo   AI Smart Waste Management System - Frontend
echo =================================================
echo.
echo Starting Vite dev server...
echo Once started, open: http://localhost:3000
echo.

set PATH=%PATH%;C:\Program Files\nodejs;%APPDATA%\npm

cd frontend
call npm.cmd run dev

pause
