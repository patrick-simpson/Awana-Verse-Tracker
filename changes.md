
# Project: Awana Africa Verse Counter

## Design Considerations & Philosophy

Instructions:
Act as a Senior Creative Developer. Create a single-file, high-performance web application for a live broadcast "Verse Tracker" for the Awana Africa Schools Project.

### OVERVIEW
The app tracks a "Verse Count" (0 to 1000) in real-time. It must have a "Display Mode" (beautiful, animated) and an "Admin Mode" (a hidden control panel). 

### TECHNICAL REQUIREMENTS (STRICT)
2. BACKEND: Use Firebase Realtime Database (via CDN) for syncing. No other servers.
3. ANIMATION: Use GSAP (GreenSock) for high-end broadcast motion.
4. AUDIO: Use the Web Audio API or standard HTML5 Audio. Include a "Click to Enable Audio" overlay for the broadcast computer.
5. RESPONSIVE: Must look perfect on a 1920x1080 broadcast screen and a tablet.

### THE VISUAL "VIBE" (GROUNDING)
- Use the Awana Africa Schools Project aesthetic: Earthy oranges, vibrant yellows, savannah greens, and "Flint" grey (#686158).
- FONT: Use 'Poppins' or 'Nunito' from Google Fonts.
- THEME STAGES: Every 100 verses, the background and animation style MUST change:
    - 0-100: Sunrise/Acacia Tree silhouettes. Numbers "float" up.
    - 101-200: Vibrant Map patterns. Numbers "pop" in.
    - 201-500: Building a school metaphor (bricks/blocks). Numbers "drop" with physics.
    - 501-800: Growth/Nature (leaves/vines). Numbers "grow" from center.
    - 801-1000: Celebration/Grand Finale. Golden particles and high-energy motion.

### FEATURES
- DISPLAY: A massive, centered number that animates beautifully when it changes. 
- AUDIO LOGIC: 
    - Short, pleasant "blip" on every +1.
    - Unique "level up" sound at every 100 milestone.
    - Use royalty-free placeholder URLs from Mixkit or similar.
- ADMIN PANEL: 
    - A tiny gear icon in the bottom-right (opacity: 0.1).
    - Clicking it opens an overlay with: [+1] [+5] [+10] [Custom Amount Input] and a [Reset] button.
    - Real-time sync: When a number is added on the tablet, it must reflect on the screen in <1s.

### BOOTSTRAP STEPS (Instruction for the AI)
1. First, provide a clear 4-step instruction list on how the user can set up a FREE Firebase project to get their API keys (ApiKey, AuthDomain, ProjectID, etc.).
2. Then, write the full HTML/CSS/JS code. 
3. Include a robust 'reconnection' logic so if the broadcast internet drops, it automatically catches up once back online.

### HOSTING INSTRUCTION
Explain how to host this for free on GitHub Pages by simply creating a repository and uploading this one 'index.html' file.

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

### v1.4.3 - Feb 24, 2025 (02:40 PM)
- **FULL REBUILD:** Restored all core files (`App.tsx`, `styles.css`) following user deletion.
- **Critical Fix:** Cleaned `importmap` to remove conflicting React 19 wildcard references.
- **Safety:** Added null check in `index.tsx` to prevent crashes if DOM is not ready.

### v1.4.2 - Feb 24, 2025 (02:30 PM)
- **CRITICAL FIX:** Resolved `Error #299` ("Target container is not a DOM element") by restoring missing HTML boilerplate (`<html>`, `<body>`, `<div id="root">`) in `index.html`.
- **Dependency Management:** Reverted `react` and `react-dom` to v18.2.0 in `importmap` to ensure stability and compatibility with current code.

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
