# Quick Start Guide - Griot & Grits Mobile App

## 🚀 Fastest Way to Run the App

### Method 1: One Command (From VS Code Terminal)

```bash
cd mobile
npm run android:emulator     # Start emulator (wait 60 seconds)
npm run android:devices      # Verify it's online
cd android
gradlew.bat app:installDebug # Install app
cd ..
npm start                    # Start Metro
```

### Method 2: Using VS Code Tasks (Even Easier!)

1. Press `Ctrl+Shift+P` (Command Palette)
2. Type "Tasks: Run Task"
3. Select these tasks in order:
   - **"Start Android Emulator"** (wait 60 seconds for boot)
   - **"Install Android App"** (builds and installs)
   - **"Start Metro Bundler"** (starts the JavaScript bundler)

### Method 3: Complete Automation

```bash
cd mobile
run-app.bat
```

This single script does everything: starts emulator, builds app, installs it, and starts Metro!

---

## 📱 Available Commands

### From VS Code Terminal:

```bash
# Emulator
npm run android:emulator   # Start emulator
npm run android:devices    # Check what's connected

# Build & Run
npm run android:build      # Build APK only
npm run android:clean      # Clean build
npm start                  # Start Metro bundler

# Or use batch files
start-emulator-background.bat  # Start emulator
check-devices.bat              # Check devices
run-app.bat                    # Complete workflow
```

### From VS Code Command Palette:

Press `Ctrl+Shift+P`, then type "Tasks: Run Task" and choose:
- Start Android Emulator
- Check Android Devices
- Start Metro Bundler
- Build Android App
- Install Android App
- Clean Android Build
- Run Complete App (All Steps)

---

## ⚡ Development Workflow

**First time each day:**
1. Start emulator: `npm run android:emulator` (or use VS Code Task)
2. Wait 60 seconds for boot
3. Install app: `cd android && gradlew.bat app:installDebug`
4. Start Metro: `npm start`

**After making code changes:**
- Just press `R` twice in the app to reload
- No need to rebuild unless you changed native code

**Troubleshooting:**
- Check devices: `npm run android:devices`
- Clean build: `npm run android:clean`
- See full guide: [RUN_APP.md](RUN_APP.md)

---

## 🎯 Quick Tips

- **Emulator takes 30-60 seconds to boot** - be patient!
- **Keep Metro running** in a separate terminal
- **Press R twice** in the app to reload after code changes
- **Press Ctrl+M** in emulator to open developer menu
- **Unplug physical devices** to avoid confusion

---

**Need more help?** See [RUN_APP.md](RUN_APP.md) for detailed troubleshooting.
