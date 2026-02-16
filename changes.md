
# Project: Awana Africa Verse Counter

## Design Considerations & Philosophy

### 1. Visual Identity
- **Theme:** The application uses a dynamic theming engine based on the number of verses counted. It progresses through "African-inspired" biomes: Savanna, River, Jungle, Village, and Celebration.
- **Typography:** Uses 'Nunito' for the massive counter numbers (rounded, friendly, legible) and 'Poppins' for UI elements (clean, modern).
- **Animations:** Powered by GSAP. Animations are designed to be "TV Production Quality"—smooth, physics-based (elastic, bounce), and synchronized with state changes.
- **Particles:** A `BackgroundFX` component generates ambient particles specific to the current theme (e.g., dust for Savanna, fireflies for Jungle) to add depth without distracting from the core number.
- **Video Backgrounds:** Subtle, looping video layers provide texture and immersion. They are blended with the theme gradients to ensure the text remains the focal point.

### 2. User Experience (UX)
- **Zero-Config Start:** The app launches into a "Start Overlay" to handle browser Autoplay policies. This ensures audio contexts are resumed only after user interaction.
- **Resilience:** The app is "Offline-First". It attempts to connect to Firebase. If it fails (or if the internet drops), it seamlessly falls back to local state management, indicated by a status light in the Admin Panel.
- **Admin Control:** A discrete gear icon allows access to the control panel. This panel provides bulk increments (+1, +5) and manual entry, crucial for live event management.

### 3. Technical Architecture
- **Framework:** React 18 (via ESM imports, no build step required).
- **State Management:** React `useState` synced with Firebase Realtime Database.
- **Audio:** Web Audio API (Oscillators) rather than static MP3 files.
- **Performance:** `will-change` properties are used on heavy animated elements.

---

## Changelog

### v1.4.1 - Feb 24, 2025 (02:15 PM)
- **CRITICAL BUGFIX:** Fixed "Black Screen" issue caused by conflicting React versions (18 vs 19) in the import map. Pinned strictly to React 18.2.0.
- **CRITICAL BUGFIX:** Removed TypeScript syntax (e.g., `: React.CSSProperties`, `as any`) from `.tsx` files. The Babel Standalone compiler in the browser does not support full TypeScript syntax by default, which was causing syntax errors.
- **Style:** Enhanced Admin Panel visual style for better legibility and aesthetics.

### v1.4.0 - Feb 24, 2025 (02:00 PM)
- **Feature:** Added royalty-free placeholder video backgrounds for all themes.
- **UX:** Updated `BackgroundFX` to render a subtle, looping video layer beneath the particle effects.

### v1.3.1 - Feb 24, 2025 (01:45 PM)
- **CRITICAL FIX:** Removed conflicting React 19 wildcard entries.

### v1.3.0 - Feb 24, 2025 (01:35 PM)
- **Documentation:** Added `changes.md`.

### v1.2.0 - Feb 24, 2025 (01:25 PM)
- **Critical Fix:** Resolved "Minified React error #31".
- **Bugfix:** Fixed `AudioContext` initialization for WebKit browsers (Safari).

### v1.1.0 - Feb 24, 2025 (01:10 PM)
- **Feature:** Added `StartOverlay`.

### v1.0.0 - Initial Release
- Basic counter functionality.
- Firebase integration.
- GSAP animations and theme engine.
