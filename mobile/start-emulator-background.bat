@echo off
REM Start Android Emulator in background

echo Starting Android Emulator in background...
echo.

start "Android Emulator" %LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe -avd Medium_Phone_API_36.1

echo.
echo Emulator is starting in a separate window.
echo Wait 30-60 seconds for it to fully boot.
echo.
echo To check if it's online, run: check-devices.bat
echo.
