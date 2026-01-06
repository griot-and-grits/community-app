# Griot and Grits Community App

> Preserving Black history through family oral histories powered by AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.73+-61DAFB.svg)](https://reactnative.dev/)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)](https://github.com/shgriffi/community-app)

## About

The Griot and Grits mobile app enables users to record, preserve, and share family oral histories, creating a living archive of the Black experience. Named after the West African tradition of griots (storytellers and oral historians), this app combines modern AI technology with cultural preservation.

**Key Features:**
- 📹 **Video Recording** - Record up to 60-minute family interviews with pause/resume
- ✂️ **Video Editing** - Trim, stitch, and enhance audio quality before uploading
- 🤖 **AI Enrichment** - Automatic metadata tagging, transcription, and content discovery
- 🌳 **Family Trees** - Build interactive family trees and link stories to relatives
- 🗺️ **Map Navigation** - Explore stories by geographic location
- 💬 **Ask the Griot** - AI chatbot that answers family history questions
- 🎓 **Guided Interviews** - Real-time question suggestions during recording
- 📚 **Family Objects** - Upload photos, documents, and heirlooms with audio narration
- 🔒 **Privacy First** - Offline recording, hardware-backed encryption, granular privacy controls
- 🌐 **Discovery Feed** - Explore public stories from the broader community

## Project Status

**Current Phase:** Planning & Design Complete ✅

- [x] Feature Specification ([spec.md](specs/001-mobile-app/spec.md))
- [x] Technical Research ([research.md](specs/001-mobile-app/research.md))
- [x] Data Model Design ([data-model.md](specs/001-mobile-app/data-model.md))
- [x] API Contracts ([contracts/](specs/001-mobile-app/contracts/))
- [x] Implementation Plan ([plan.md](specs/001-mobile-app/plan.md))
- [ ] Task Generation (Next: `/speckit.tasks`)
- [ ] Implementation
- [ ] Testing & QA
- [ ] App Store Deployment

**Branch:** `001-mobile-app`

## Architecture

### Technology Stack

- **Framework:** React Native 0.73+
- **Platforms:** iOS 15+ | Android 10+ (API 29+)
- **Language:** TypeScript
- **State Management:** Zustand + React Query
- **Database:** SQLite with @op-engineering/op-sqlite (encrypted with SQLCipher)
- **Encryption:** Native OS integration (iOS Keychain, Android Keystore)
- **Backend API:** RESTful with TUS protocol for chunked uploads

### Key Libraries

```json
{
  "react-native": "^0.73.0",
  "react-native-vision-camera": "^3.0.0",
  "ffmpeg-kit-react-native": "^5.1.0",
  "@react-native-voice/voice": "^3.2.4",
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.17.0",
  "react-native-keychain": "^8.1.2",
  "react-native-quick-crypto": "^0.7.0",
  "@op-engineering/op-sqlite": "^6.0.0"
}
```

See [quickstart.md](specs/001-mobile-app/quickstart.md) for complete architecture details.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **React Native CLI** (not Expo)
- **Xcode** 14+ (for iOS development on macOS)
- **Android Studio** (for Android development)
- **CocoaPods** (for iOS dependencies)
- **Git**

### Platform-Specific Requirements

**iOS Development:**
- macOS 12.0+
- Xcode 14+
- iOS Simulator or physical device (iOS 15+)
- CocoaPods: `sudo gem install cocoapods`

**Android Development:**
- Android Studio Arctic Fox or later
- Android SDK API Level 29+
- Android Emulator or physical device (Android 10+)
- JDK 11+

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/shgriffi/community-app.git
cd community-app
```

### 2. Checkout the Mobile App Branch

```bash
git checkout 001-mobile-app
```

### 3. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# API Configuration
API_BASE_URL=https://api.griotandgrits.org/v1
USE_MOCK_API=true

# Feature Flags
ENABLE_GUIDED_MODE=true
ENABLE_LOCATION_NOTIFICATIONS=true

# Development
DEBUG_MODE=true
```

### 5. Run the App

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

**Start Metro Bundler separately (optional):**
```bash
npm start
```

## Development Workflow

### Running Tests

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests (Detox)
npm run e2e:build:ios
npm run e2e:test:ios

npm run e2e:build:android
npm run e2e:test:android
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Building for Release

**iOS:**
```bash
npm run build:ios
# Opens Xcode for archiving and distribution
```

**Android:**
```bash
npm run build:android
# Generates APK/AAB in android/app/build/outputs/
```

## Project Structure

```
community-app/
├── mobile/                    # React Native app (to be created)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── screens/          # Screen components
│   │   ├── services/         # Business logic (API, encryption, sync)
│   │   ├── store/            # State management (Zustand)
│   │   ├── database/         # SQLite schema and DAOs
│   │   ├── navigation/       # React Navigation setup
│   │   ├── hooks/            # Custom React hooks
│   │   └── types/            # TypeScript definitions
│   ├── ios/                  # iOS native code
│   ├── android/              # Android native code
│   └── __tests__/            # Test files
├── specs/                    # Feature specifications
│   └── 001-mobile-app/       # Current feature spec
│       ├── spec.md           # Requirements & user stories
│       ├── plan.md           # Implementation plan
│       ├── research.md       # Technical decisions
│       ├── data-model.md     # Database schema
│       ├── quickstart.md     # Developer guide
│       └── contracts/        # API contracts
├── .specify/                 # Specification tooling
└── README.md                 # This file
```

## Development Tools

### Mock Backend API

For development without backend dependencies:

```bash
# Start mock backend server
npm run mock-backend

# Start app with mock API enabled
USE_MOCK_API=true npm run ios
```

See [Backend Mocking](specs/001-mobile-app/research.md#8-backend-api-mocking-for-development-and-testing) for details.

### Debugging

**React Native Debugger:**
```bash
# Install standalone debugger
brew install --cask react-native-debugger

# Open debugger (macOS)
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

**Flipper:**
- Included with React Native
- Launches automatically when running debug builds
- Provides network inspection, layout debugging, and performance monitoring

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Process

1. Create a feature branch from `main`
2. Follow the SpecKit workflow:
   - `/speckit.specify` - Create feature specification
   - `/speckit.clarify` - Resolve ambiguities
   - `/speckit.plan` - Generate implementation plan
   - `/speckit.tasks` - Create task breakdown
   - `/speckit.implement` - Execute implementation
3. Write tests for new features
4. Submit a pull request

## Documentation

- **Feature Spec:** [specs/001-mobile-app/spec.md](specs/001-mobile-app/spec.md)
- **Implementation Plan:** [specs/001-mobile-app/plan.md](specs/001-mobile-app/plan.md)
- **Technical Research:** [specs/001-mobile-app/research.md](specs/001-mobile-app/research.md)
- **Data Model:** [specs/001-mobile-app/data-model.md](specs/001-mobile-app/data-model.md)
- **Quickstart Guide:** [specs/001-mobile-app/quickstart.md](specs/001-mobile-app/quickstart.md)
- **API Contracts:** [specs/001-mobile-app/contracts/](specs/001-mobile-app/contracts/)

## Troubleshooting

### Common Issues

**Metro bundler cache issues:**
```bash
npm start -- --reset-cache
```

**iOS build fails:**
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

**Android build fails:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**E2E tests failing:**
```bash
# Rebuild test app
npm run e2e:build:ios
# Run with verbose logging
npm run e2e:test:ios -- --loglevel verbose
```

## Security & Privacy

- **Encryption at Rest:** AES-256-GCM with hardware-backed keys
- **Encryption in Transit:** TLS 1.3+
- **Key Management:** iOS Keychain (Secure Enclave) | Android Keystore (StrongBox)
- **Privacy Controls:** Public, Family Only, Private settings
- **Compliance:** GDPR, CCPA, App Store/Play Store requirements

See [research.md - Encryption](specs/001-mobile-app/research.md#3-encryption-library) for technical details.

## Performance Goals

- **App Launch:** <3s on mid-range devices
- **Recording Start:** <1s latency
- **Video Playback:** <2s start time (95th percentile)
- **Discovery Feed:** <2s initial load (95th percentile)
- **Upload Success:** >95% across varying network conditions
- **Offline Support:** 100% core features (record, view cached content)

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Griot and Grits Organization** - Mission and vision for preserving Black history
- **React Native Community** - Framework and ecosystem
- **Open Source Contributors** - Libraries and tools that make this possible

## Contact & Support

- **Website:** [griotandgrits.org](https://griotandgrits.org)
- **Issues:** [GitHub Issues](https://github.com/shgriffi/community-app/issues)
- **Discussions:** [GitHub Discussions](https://github.com/shgriffi/community-app/discussions)

---

**Built with ❤️ to preserve and celebrate Black history through technology**
