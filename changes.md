
# Project: Awana Africa Verse Counter

## Design Considerations & Philosophy

### 1. Visual Identity
- **Theme:** The application uses a dynamic theming engine based on the number of verses counted. It progresses through "African-inspired" biomes: Savanna, River, Jungle, Village, and Celebration.
- **Typography:** Uses 'Nunito' for the massive counter numbers (rounded, friendly, legible) and 'Poppins' for UI elements (clean, modern).
- **Animations:** Powered by GSAP. Animations are designed to be "TV Production Quality"—smooth, physics-based (elastic, bounce), and synchronized with state changes.
- **Particles:** A `BackgroundFX` component generates ambient particles specific to the current theme (e.g., dust for Savanna, fireflies for Jungle) to add depth without distracting from the core number.
- **Video Backgrounds:** (New in v1.4.0) Subtle, looping video layers provide texture and immersion. They are blended with the theme gradients to ensure the text remains the focal point.

### 2. User Experience (UX)
- **Zero-Config Start:** The app launches into a "Start Overlay" to handle browser Autoplay policies. This ensures audio contexts are resumed only after user interaction.
- **Resilience:** The app is "Offline-First". It attempts to connect to Firebase. If it fails (or if the internet drops), it seamlessly falls back to local state management, indicated by a status light in the Admin Panel.
- **Admin Control:** A discrete gear icon allows access to the control panel. This panel provides bulk increments (+1, +5) and manual entry, crucial for live event management.

### 3. Technical Architecture
- **Framework:** React 18 (via ESM imports, no build step required).
- **State Management:** React `useState` synced with Firebase Realtime Database.
- **Audio:** Web Audio API (Oscillators) rather than static MP3 files. This reduces network requests and allows for procedural sound generation (random pitch modulation to prevent listener fatigue).
- **Performance:** `will-change` properties are used on heavy animated elements. React `useRef` is used for animation targets to avoid re-renders during GSAP tweens.

---

## Changelog

### v1.4.0 - Feb 24, 2025 (02:00 PM)
- **Feature:** Added royalty-free placeholder video backgrounds for all themes.
- **UX:** Updated `BackgroundFX` to render a subtle, looping video layer beneath the particle effects.
- **Design:** Implemented opacity and blend modes on videos to ensure they complement the theme gradients rather than overpowering them.

### v1.3.1 - Feb 24, 2025 (01:45 PM)
- **CRITICAL FIX:** Removed TypeScript syntax (e.g., `as any`, `: React.CSSProperties`) from `.tsx` files. Since the browser uses Babel Standalone without the TypeScript preset, these were causing syntax errors and white screen of death.
- **CRITICAL FIX:** Removed conflicting React 19 wildcard entries from `index.html` import map. This prevents the "Minified React error #31" caused by loading two different versions of React simultaneously.
- **Update:** Added specific timestamps to the changelog.

### v1.3.0 - Feb 24, 2025 (01:35 PM)
- **Documentation:** Added `changes.md` for version control and design documentation.
- **UI Polish:** improved visibility of version number on the start screen.

### v1.2.0 - Feb 24, 2025 (01:25 PM)
- **Critical Fix:** Resolved "Minified React error #31" by pinning dependencies to React 18.2.0 in `importmap` and removing conflicting React 19 wildcard entries.
- **Compatibility:** Removed TypeScript-specific syntax (type casting) from `.tsx` files to ensure compatibility with the in-browser Babel transpiler.
- **Bugfix:** Fixed `AudioContext` initialization for WebKit browsers (Safari).
- **Bugfix:** Fixed `CSSProperties` type error in AdminPanel.

### v1.1.0 - Feb 24, 2025 (01:10 PM)
- **Feature:** Added `StartOverlay` to handle "Click to Start" flow.
- **Feature:** Implemented `APP_VERSION` and `LAST_MODIFIED` display on the start screen.

### v1.0.0 - Initial Release
- Basic counter functionality.
- Firebase integration.
- GSAP animations and theme engine.
