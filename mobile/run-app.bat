@echo off
REM Complete workflow to run the app

echo ========================================
echo Griot ^& Grits - Complete App Launcher
echo ========================================
echo.

echo Step 1: Checking for running emulators...
%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe devices | findstr "device" | findstr -v "List"
if %errorlevel% neq 0 (
    echo No emulator running. Starting emulator...
    start "Android Emulator" %LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe -avd Medium_Phone_API_36.1
    echo.
    echo Waiting for emulator to boot (60 seconds)...
    timeout /t 60 /nobreak
) else (
    echo Emulator is already running!
)

echo.
echo Step 2: Building and installing app...
cd android
call gradlew.bat app:installDebug
cd ..

echo.
echo Step 3: App installed! Starting Metro bundler...
echo Press Ctrl+C to stop Metro when you're done.
echo.
call npm start
