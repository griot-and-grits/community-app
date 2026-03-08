@echo off
REM Start Android Emulator from command line

echo Starting Android Emulator: Medium_Phone_API_36.1
echo.
echo This will open the emulator in a new window.
echo Keep this terminal open or the emulator will close.
echo.
echo Press Ctrl+C to stop the emulator later.
echo.

%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe -avd Medium_Phone_API_36.1
