# How to Run the Griot & Grits Mobile App

## Quick Start

### Step 0: Ensure Only Virtual Emulator is Active

**IMPORTANT**: If you have a physical Android device plugged in:
- Either unplug it completely
- Or run: `%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe disconnect`

**Check connected devices:**
```bash
# Run this batch file to see what's connected
check-devices.bat
```

### Step 1: Start an Android Emulator

**Option A: From VS Code Terminal (Easiest!)**
```bash
# Start emulator in background
npm run android:emulator

# Wait 30-60 seconds, then check if it's online
npm run android:devices
```

**Option B: Using Batch Files**
```bash
# Start emulator
start-emulator-background.bat

# Or run in foreground (blocks terminal)
start-emulator.bat
```

**Option C: Direct Command**
```bash
%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe -avd Medium_Phone_API_36.1
```

**Option D: Using Android Studio**
1. Open Android Studio
2. Click on "More Actions" or "Three dots menu" → "Virtual Device Manager"
3. Click the green "Play" button next to any emulator (e.g., Medium Phone API 36.1)
4. Wait for the emulator to fully boot (you'll see the Android home screen)

### Step 2: Start Metro Bundler

Open a terminal in the `mobile` directory and run:

```bash
cd c:\dev\griot_grits\community-app\mobile
npm start
```

Keep this terminal open - it's the JavaScript bundler.

### Step 3: Install and Run the App

**Open a NEW terminal** (keep Metro running in the first one) and run:

```bash
cd c:\dev\griot_grits\community-app\mobile
cd android
gradlew.bat app:installDebug
```

The app should automatically launch on your emulator!

## Alternative: One-Command Run

If you have an emulator already running:

```bash
cd c:\dev\griot_grits\community-app\mobile
npm run android
```

## Troubleshooting

### "No online devices found" or "No connected devices"

**Check what's connected:**
```bash
check-devices.bat
```

**Common causes:**
1. **Physical device is connected** - Unplug it or run `adb disconnect`
2. **Emulator shows as "offline"** - Close it completely and restart:
   - Close the emulator window
   - Open Android Studio → Device Manager
   - Click Play on your emulator again
   - Wait for full boot
3. **No emulator running** - Start one from Android Studio Device Manager
4. **ADB issues** - Restart ADB:
   ```bash
   %LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe kill-server
   %LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe start-server
   ```

### "gradlew.bat is not recognized"
Run the command from the `mobile/android` directory:
```bash
cd c:\dev\griot_grits\community-app\mobile\android
gradlew.bat app:installDebug
```

### Build Fails
Clean and rebuild:
```bash
cd c:\dev\griot_grits\community-app\mobile
npm run android:clean
npm run android:build
```

### Metro Bundler Issues
Reset the cache:
```bash
npm start -- --reset-cache
```

### App Crashes on Launch
Check the logs:
```bash
# View Android logs
cd android
adb logcat | findstr GriotGrits
```

## Development Tips

### Reload the App
- Press `R` twice in the app to reload
- Or shake the emulator (Ctrl+Shift+R in Android Emulator)

### Open Developer Menu
- Press `Ctrl+M` in the emulator
- Or shake the emulator

### Enable Live Reload
1. Open Developer Menu (Ctrl+M)
2. Select "Enable Live Reload"
3. Your app will reload automatically when you save files

### Enable Hot Reload
1. Open Developer Menu (Ctrl+M)
2. Select "Enable Hot Reloading"
3. Components update without full reload

## Build Scripts Reference

```bash
# Emulator Management
npm run android:emulator    # Start emulator in background
npm run android:devices     # Check connected devices

# Metro bundler
npm start                   # Start Metro bundler

# Build & Install
npm run android:build       # Build Android APK
npm run android:clean       # Clean Android build
npm run android             # Install app (requires running emulator)

# Code Quality
npm run lint                # Run linter
npm test                    # Run tests
```

## Current Build Status

✅ Build compiles successfully
✅ APK generated at: `android/app/build/outputs/apk/debug/app-debug.apk`
⚠️ Emulator must be running manually before installation

---

**Last Updated**: 2026-02-14
**Branch**: 003-phase3-recording
