@echo off
title Saj Al-Arab POS - Setup and Run
color 0A

echo ==========================================
echo      Saj Al-Arab POS System Setup
echo ==========================================
echo.

:: Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo and try again.
    pause
    exit /b
)

echo [1/5] Installing dependencies (this may take a few minutes)...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies. Please check your internet connection.
    pause
    exit /b
)

echo.
echo [2/5] Setting up environment files...
copy /Y apps\frontend\.env.example apps\frontend\.env >nul
copy /Y apps\backend\.env.example apps\backend\.env >nul

echo.
echo [3/5] Setting up Database (Migration & Seed)...
cd apps\backend
call npm run db:migrate
call npm run db:seed
cd ..\..

echo.
echo [4/5] Starting System...
echo.
echo DO NOT CLOSE THIS WINDOW.
echo The system will open in your browser automatically at http://localhost:5173
echo.

start "" "http://localhost:5173"
call npm run dev
