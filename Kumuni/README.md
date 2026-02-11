# Kumuni Shell

Kumuni Shell is a powerful, server-driven React Native application designed for high-performance, dynamic user experiences. It features a sophisticated **Server-Driven UI (SDUI)** architecture that allows for instant updates and a premium, native feel.

## 🚀 Key Features

### 1. Advanced SDUI Architecture
- **Dynamic Rendering**: UI is entirely controlled via JSON payloads from the server.
- **Micro-Frontend Support**: Seamlessly integrate and load miniapps and micro-tools dynamically.
- **Standardized Bridge**: Secure communication between the shell and micro-apps using `KernelBridge`.

### 2. Premium Navigation & Transitions
- **Dual-View Parallel Transitions**: A custom transition engine that renders the previous and current screens simultaneously for a seamless "push" effect.
- **Direction-Aware Animations**: Intelligent slide transitions (Right-to-Left for forward, Left-to-Right for back).
- **Smooth Spring Physics**: Optimized spring animations with high-end bounciness for a snappy, premium feel.

### 3. High-Performance Caching
- **Stale-While-Revalidate (SWR)**: Implements instant page loads by showing cached content immediately while silently refreshing data in the background.
- **Zero-Latency Feel**: Eliminates white flashes and wait times between screen navigations for returning users.
- **Intelligent Updating**: Silently updates the UI in place if the background fetch detects server-side changes.

### 4. Dynamic Icon System
- **Multi-Source Support**: Renders icons from remote URLs (PNG/SVG), local SVG assets, and Unicode characters using a unified `SDUIIcon` component.
- **Smart Mapping**: Centralized mapping system for local brand assets.

## 🛠 Tech Stack
- **Framework**: React Native
- **Styling**: Theme-aware CSS-in-JS
- **Navigation**: Custom gesture-ready Animated Navigation
- **Architecture**: Microkernel-based Shell

---

## 🚀 Getting Started

### Step 1: Start Metro
Run the Metro dev server from the `Kumuni` directory:
```sh
npm start
```

### Step 2: Run the App
Open a new terminal and run for your target platform:

#### Android
```sh
npm run android
```

#### iOS
```sh
cd ios && pod install && cd ..
npm run ios
```

---

## 📂 Project Structure
- `src/kernel`: Core shell components and logic.
- `src/kernel/components/sdui`: SDUI rendering engine and standard components.
- `src/shared`: Shared utilities, API clients, and the Microkernel bridge.
- `src/theme`: Centralized design system and tokens.
