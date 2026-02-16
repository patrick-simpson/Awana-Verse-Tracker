import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";

// --- TYPES & INTERFACES ---
declare global {
  interface Window {
    gsap: any;
    firebase: any;
  }
}

interface Theme {
  name: string;
  gradient: string;
  textColor: string;
  accentColor: string;
  icon: string;
  animationType: "drop" | "slide" | "pop" | "spin" | "zoom";
}

// --- CONFIGURATION ---

// 1. AUDIO ASSETS (Placeholders)
const AUDIO_URLS = {
  pop: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", // Short click/pop
  celebrate: "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3", // Success chime
};

// 2. THEMES (The Journey)
// Changes every 100 verses
const THEMES: Theme[] = [
  {
    // 0 - 99
    name: "Sunrise Savanna",
    gradient: "linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)", // Orange/Red
    textColor: "#FFFFFF",
    accentColor: "#FFD700", // Gold
    icon: "🌅",
    animationType: "drop",
  },
  {
    // 100 - 199
    name: "River Crossing",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", // Blue/Cyan
    textColor: "#FFFFFF",
    accentColor: "#003366",
    icon: "🌊",
    animationType: "slide",
  },
  {
    // 200 - 299
    name: "Jungle Trek",
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", // Green
    textColor: "#FFFFFF",
    accentColor: "#0b4d0b",
    icon: "🌴",
    animationType: "pop",
  },
  {
    // 300 - 399
    name: "Village Build",
    gradient: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)", // Earthy/Pastel
    textColor: "#5D4037",
    accentColor: "#8D6E63",
    icon: "🏘️",
    animationType: "spin",
  },
  {
    // 400+
    name: "Celebration Night",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Purple
    textColor: "#FFD700",
    accentColor: "#E1BEE7",
    icon: "✨",
    animationType: "zoom",
  },
];

// --- FIREBASE INITIALIZATION ---
// !!! IMPORTANT: PASTE YOUR FIREBASE CONFIG HERE !!!
const firebaseConfig = {
  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCk0TR4SUFUvsdpIDGmH-0CzbZQQcZBL30",
  authDomain: "awana-africa-tracker.firebaseapp.com",
  databaseURL: "https://awana-africa-tracker-default-rtdb.firebaseio.com",
  projectId: "awana-africa-tracker",
  storageBucket: "awana-africa-tracker.firebasestorage.app",
  messagingSenderId: "825987576771",
  appId: "1:825987576771:web:f293d618dad3ded2c70376",
  measurementId: "G-1SMFYMQMNW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
  // Example config - REPLACE THESE VALUES with yours from Firebase Console
  apiKey: "AIzaSyDummyKey-12345",
  authDomain: "dummy-project.firebaseapp.com",
  databaseURL: "https://awana-africa-default-rtdb.firebaseio.com", // Ensure this is correct
  projectId: "dummy-project",
  storageBucket: "dummy-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:dummy",
};

// Initialize Firebase safely
let db: any = null;
try {
  if (window.firebase) {
    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(firebaseConfig);
    }
    db = window.firebase.database();
  } else {
    console.error("Firebase SDK not loaded");
  }
} catch (e) {
  console.error("Firebase Init Error:", e);
}

// --- COMPONENTS ---

// 1. Start Overlay (Audio Context)
const StartOverlay = ({ onStart }: { onStart: () => void }) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.9)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        backdropFilter: "blur(10px)",
      }}
    >
      <h1 style={{ marginBottom: "20px", textAlign: "center" }}>
        Awana Africa<br />Verse Counter
      </h1>
      <button
        onClick={onStart}
        style={{
          padding: "15px 40px",
          fontSize: "24px",
          backgroundColor: "#FFD700",
          color: "#333",
          border: "none",
          borderRadius: "50px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 4px 15px rgba(255, 215, 0, 0.4)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        Start Broadcast
      </button>
      <p style={{ marginTop: "20px", opacity: 0.6 }}>Initializes Audio & Sync</p>
    </div>
  );
};

// 2. Admin Panel
const AdminPanel = ({
  currentCount,
  setCount,
}: {
  currentCount: number;
  setCount: (n: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customVal, setCustomVal] = useState("");

  const handleUpdate = (newValue: number) => {
    if (db) {
      db.ref("verse_count").set(newValue);
    }
    // Optimistic update happens via listener
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.2)",
          border: "none",
          cursor: "pointer",
          zIndex: 100,
          opacity: 0.1, // Hidden by default
          transition: "opacity 0.3s, background-color 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.8)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "0.1";
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
        }}
      >
        ⚙️
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        zIndex: 101,
        color: "#333",
        width: "300px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <h3 style={{ margin: 0 }}>Admin Control</h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{ border: "none", background: "none", cursor: "pointer", fontSize: "16px" }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
        <button
          onClick={() => handleUpdate(currentCount + 1)}
          style={adminButtonStyle}
        >
          +1 Verse
        </button>
        <button
          onClick={() => handleUpdate(currentCount + 5)}
          style={adminButtonStyle}
        >
          +5 Verses
        </button>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          type="number"
          placeholder="Custom Amount"
          value={customVal}
          onChange={(e) => setCustomVal(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={() => {
             const val = parseInt(customVal);
             if(!isNaN(val)) handleUpdate(currentCount + val);
             setCustomVal("");
          }}
          style={adminButtonStyle}
        >
          Add
        </button>
      </div>

      <button
        onClick={() => {
          if (confirm("Are you sure you want to RESET the count to 0?")) {
            handleUpdate(0);
          }
        }}
        style={{ ...adminButtonStyle, backgroundColor: "#ff4444", color: "white" }}
      >
        Reset Counter
      </button>

      <div style={{ marginTop: "10px", fontSize: "12px", color: "#888", textAlign: "center" }}>
        Current: {currentCount} | Status: {db ? "Online" : "Offline (Demo)"}
      </div>
    </div>
  );
};

const adminButtonStyle = {
  padding: "10px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#eee",
  cursor: "pointer",
  fontWeight: "600",
  transition: "background 0.2s",
};

// 3. Main Application
const App = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [count, setCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  
  // Refs
  const numberRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const popBufferRef = useRef<AudioBuffer | null>(null);
  const celebrateBufferRef = useRef<AudioBuffer | null>(null);

  // Derived State
  const themeIndex = Math.min(Math.floor(count / 100), THEMES.length - 1);
  const currentTheme = THEMES[themeIndex] || THEMES[0];

  // 1. Audio System
  const initAudio = async () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContext();

    const loadSound = async (url: string) => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await audioContextRef.current?.decodeAudioData(arrayBuffer);
      } catch (e) {
        console.warn("Audio load failed", e);
        return null;
      }
    };

    popBufferRef.current = await loadSound(AUDIO_URLS.pop);
    celebrateBufferRef.current = await loadSound(AUDIO_URLS.celebrate);
    
    setHasStarted(true);
  };

  const playSound = (type: "pop" | "celebrate") => {
    if (!audioContextRef.current) return;
    
    // Resume context if suspended (browser policy)
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    const buffer = type === "pop" ? popBufferRef.current : celebrateBufferRef.current;
    if (buffer) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    }
  };

  // 2. Firebase Sync
  useEffect(() => {
    if (!db) return;

    const countRef = db.ref("verse_count");
    countRef.on("value", (snapshot: any) => {
      const val = snapshot.val();
      if (val !== null) {
        setCount((prev) => {
          setPrevCount(prev);
          return val;
        });
      }
    });

    return () => countRef.off();
  }, []);

  // 3. Animations & Effects
  useEffect(() => {
    if (!hasStarted) return;
    if (count === prevCount) return;

    // Determine event type
    const isLevelUp = Math.floor(count / 100) > Math.floor(prevCount / 100);
    const isIncrease = count > prevCount;

    // Audio
    if (isLevelUp) {
      playSound("celebrate");
    } else if (isIncrease) {
      playSound("pop");
    }

    // Animation Logic via GSAP
    if (numberRef.current && window.gsap) {
      const tl = window.gsap.timeline();
      
      // Reset
      window.gsap.set(numberRef.current, { clearProps: "all" });

      switch (currentTheme.animationType) {
        case "drop":
           tl.fromTo(numberRef.current, 
             { y: -100, opacity: 0, scale: 1.5 }, 
             { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "bounce.out" }
           );
           break;
        case "slide":
          tl.fromTo(numberRef.current,
            { x: 200, opacity: 0, skewX: -20 },
            { x: 0, opacity: 1, skewX: 0, duration: 0.6, ease: "power2.out" }
          );
          break;
        case "pop":
          tl.fromTo(numberRef.current,
            { scale: 0, rotation: -45 },
            { scale: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }
          );
          break;
        case "spin":
          tl.fromTo(numberRef.current,
            { rotationY: 90, opacity: 0 },
            { rotationY: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
          );
          break;
        case "zoom":
        default:
          tl.fromTo(numberRef.current,
            { scale: 3, opacity: 0, filter: "blur(10px)" },
            { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1, ease: "expo.out" }
          );
          break;
      }
    }

    // Update prevCount ref after effect
    setPrevCount(count);
  }, [count, hasStarted, currentTheme]);


  if (!hasStarted) {
    return <StartOverlay onStart={initAudio} />;
  }

  return (
    <div
      ref={bgRef}
      style={{
        width: "100%",
        height: "100%",
        background: currentTheme.gradient,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 1s ease-in-out",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Icon Watermark */}
      <div
        style={{
          position: "absolute",
          fontSize: "50vh",
          opacity: 0.1,
          pointerEvents: "none",
          userSelect: "none",
          animation: "float 6s ease-in-out infinite",
        }}
      >
        {currentTheme.icon}
      </div>

      {/* Header Info */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          textAlign: "center",
          color: currentTheme.textColor,
          opacity: 0.9,
        }}
      >
        <h2 style={{ 
          margin: 0, 
          fontSize: "2rem", 
          textTransform: "uppercase", 
          letterSpacing: "4px",
          textShadow: "0 2px 10px rgba(0,0,0,0.2)"
        }}>
          Verses Recited
        </h2>
        <div style={{ marginTop: "10px", fontSize: "1.2rem", fontWeight: "600" }}>
           {currentTheme.name} Era
        </div>
      </div>

      {/* The Big Number */}
      <div
        ref={numberRef}
        style={{
          fontSize: "15rem",
          fontWeight: "900",
          fontFamily: "'Nunito', sans-serif",
          color: currentTheme.textColor,
          textShadow: `0 10px 30px rgba(0,0,0,0.3), 4px 4px 0px ${currentTheme.accentColor}`,
          zIndex: 10,
          lineHeight: 1,
        }}
      >
        {count}
      </div>

      {/* Admin Interface */}
      <AdminPanel currentCount={count} setCount={setCount} />
      
      {/* Global Styles for Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
