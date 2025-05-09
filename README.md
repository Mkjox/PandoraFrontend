# Pandora Vault App

A cross‑platform (iOS & Android) React Native application for securely managing passwords, personal vault entries, and categories. Built with TypeScript, Redux Toolkit, React Navigation, and a custom dark/light theme.

---

## 🚀 Features

- 📦 **Authentication**: Register, login, logout with JWT stored in AsyncStorage.
- 🔐 **Password Vault**: Create, read, update, delete (CRUD) passwords.
- 🔏 **Secured Notes (Personal Vault)**: Store arbitrary secure entries with optional media, tags, expiration, locking.
- 🗂️ **Categories**: CRUD categories and assign entries.
- 🌗 **Dark & Light themes** with toggle.
- 🔍 **Search** & **filter** by text, category, type (password vs. notes).
- 🛠️ **Security tools**: Password generator, emergency access, security dashboard, etc.
- 📱 **Responsive UI**: Custom tab bar, section lists, spinners, error handling.

---

## 📦 Tech Stack

| Layer             | Technology                                |
| ----------------- | ----------------------------------------- |
| Framework         | React Native (TypeScript)                 |
| Navigation        | React Navigation (Stack & Bottom Tabs)    |
| State Management  | Redux Toolkit                             |
| API / HTTP client | Axios                                     |
| Storage           | @react-native-async-storage/async-storage |
| Authentication    | JWT (jwt-decode)                          |
| UI Components     | react-native-paper, @expo/vector-icons    |
| Picker            | @react-native-picker/picker               |
| Theming           | Custom Context + StyleSheet               |
| Platform          | Expo / React Native CLI                   |

---

## 🛠 Prerequisites

- Node.js ≥ 14
- Yarn or npm
- Expo CLI (`npm install -g expo-cli`) **or** React Native CLI
- Android Studio / Xcode (for device emulators)

---

## ⚙️ Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/your‑username/pandora‑vault.git
   cd pandora‑vault

   ```

2. **Install Dependencies**

```bash
yarn install
# or
npm install
```

3. **Configure Environment**

```bash
   Create a file ./.env in the project root with:

# Pandora API URL is not included in the project

API_URL=https://api.yourdomain.com
```

4. **Run Metro bundler / Expo**

```bash
# with Expo
expo start

# or with React Native CLI (iOS)
npx react-native run-ios

# or (Android)
npx react-native run-android
```

5. **Open on device / emulator**

- For Expo: scan QR code in Expo Go

- For CLI: simulator/emulator will launch automatically
