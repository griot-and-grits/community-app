@echo off
REM Check which Android devices are connected

echo Checking connected Android devices...
echo.

%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe devices

echo.
echo =====================================================
echo If you see a physical device, unplug it or run:
echo   adb disconnect
echo.
echo If you see "offline" emulators, restart them:
echo   1. Close the emulator window
echo   2. Open Android Studio
echo   3. Device Manager ^> Start emulator
echo.
echo If no devices are listed, start an emulator:
echo   1. Open Android Studio
echo   2. Click Device Manager
echo   3. Click the Play button on an emulator
echo =====================================================
