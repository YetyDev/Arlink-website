@echo off
title Push ARLinks Project to GitHub
echo ===================================================
echo   Pushing ARLinks 28 Project to GitHub Repository
echo ===================================================
echo.

REM Initialize Git if not already done
if not exist .git (
    echo [1/5] Initializing local Git repository...
    git init
    echo.
) else (
    echo [1/5] Local Git repository already initialized.
    echo.
)

REM Add remote URL
echo [2/5] Setting up remote origin...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/YetyDev/Arlink-websit.git
echo Remote set to: https://github.com/YetyDev/Arlink-websit.git
echo.

REM Add all files
echo [3/5] Staging files...
git add .
echo.

REM Commit files
echo [4/5] Creating commit...
git commit -m "Update ARlink website - Implement Career Carousel and rename to ARLinks"
echo.

REM Rename branch to main
echo [5/5] Renaming default branch to main and pushing...
git branch -M main
echo.
echo Pushing to GitHub...
echo (A browser window or credential prompt may appear for authentication)
echo.
git push -u origin main --force

echo.
echo ===================================================
echo   Done! Your code is now live on GitHub.
echo ===================================================
echo.
pause
