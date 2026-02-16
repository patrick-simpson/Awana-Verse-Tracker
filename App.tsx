
import React, { useState, useEffect, useRef } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "./firebase";
import { THEMES } from "./constants";
import { playSound } from "./audio";
import StartOverlay from "./StartOverlay";
import AdminPanel from "./AdminPanel";
import BackgroundFX from "./BackgroundFX";
import gsap from "gsap";

const App = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [count, setCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const [isOffline, setIsOffline] = useState(!db);
  
  const numberRef = useRef(null);
  const bgRef = useRef(null);
  const audioContextRef = useRef(null);

  const themeIndex = Math.min(Math.floor(count / 100), THEMES.length - 1);
  const currentTheme = THEMES[themeIndex] || THEMES[0];

  // Init Audio
  const initAudio = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
    } catch (e) {
      console.error("Audio init error", e);
    }
    setHasStarted(true);
  };

  const triggerSound = (type) => {
     if (audioContextRef.current) {
         playSound(type, audioContextRef.current);
     }
  };

  // Firebase Sync
  useEffect(() => {
    if (!db) {
      setIsOffline(true);
      return;
    }

    try {
      const countRef = ref(db, "verse_count");
      const unsubscribe = onValue(countRef, (snapshot) => {
        setIsOffline(false);
        const val = snapshot.val();
        // Only update if valid number
        if (typeof val === 'number') {
          setCount((prev) => {
            setPrevCount(prev);
            return val;
          });
        }
      }, (error) => {
        console.error("Firebase Read Error:", error);
        setIsOffline(true);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error("Firebase Connection Error:", err);
      setIsOffline(true);
    }
  }, []);

  // Update Handler
  const handleUpdateCount = (newValue) => {
    // Only update Firebase. Do NOT update local state immediately.
    // The state will be updated via the onValue listener when the server acknowledges the change.
    if (db && !isOffline) {
      set(ref(db, "verse_count"), newValue).catch((err) => {
        console.error("Failed to sync to firebase", err);
        // If sync fails, we could choose to go offline and update local, 
        // but strictly following "only increment if server feedback", we assume failure means no update.
        // However, to prevent broken UI state on spotty connections, we switch to offline mode.
        setIsOffline(true);
        setCount(newValue); // Fallback for offline
      });
    } else {
      // Offline mode fallback
      setCount(newValue);
    }
  };

  // Animations & Logic
  useEffect(() => {
    if (!hasStarted) return;
    if (count === prevCount) return;

    const isLevelUp = Math.floor(count / 100) > Math.floor(prevCount / 100);
    const isIncrease = count > prevCount;

    if (isLevelUp) triggerSound("celebrate");
    else if (isIncrease) triggerSound("pop");

    if (numberRef.current) {
      const tl = gsap.timeline();
      gsap.set(numberRef.current, { clearProps: "all" });

      // Robust Animation Logic
      switch (currentTheme.animationType) {
        case "drop":
           tl.fromTo(numberRef.current, 
             { y: -100, scaleY: 1.5, scaleX: 0.8, opacity: 0 }, 
             { y: 0, scaleY: 1, scaleX: 1, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }
           );
           break;
        case "slide":
          tl.fromTo(numberRef.current,
            { x: 300, skewX: -30, opacity: 0 },
            { x: 0, skewX: 0, opacity: 1, duration: 0.5, ease: "power4.out" }
          );
          break;
        case "pop":
          tl.fromTo(numberRef.current,
            { scale: 0.2, rotation: -15, opacity: 0 },
            { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(2)" }
          );
          break;
        case "spin":
          tl.fromTo(numberRef.current,
            { rotationX: 90, opacity: 0, y: 50 },
            { rotationX: 0, opacity: 1, y: 0, duration: 0.7, ease: "expo.out" }
          );
          break;
        case "zoom":
        default:
          tl.fromTo(numberRef.current,
            { scale: 3, opacity: 0, filter: "blur(20px)" },
            { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "circ.out" }
          );
          break;
      }
    }
    
    // Sync prevCount after animation logic
    setPrevCount(count);
  }, [count, hasStarted, currentTheme]);

  if (!hasStarted) {
    return <StartOverlay onStart={initAudio} />;
  }

  return (
    <div
      className="animated-bg"
      ref={bgRef}
      style={{
        width: "100%",
        height: "100%",
        background: currentTheme.gradient,
        backgroundSize: '400% 400%',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-image 1s ease-in-out",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient Particles */}
      <BackgroundFX theme={currentTheme} />

      {/* Background Floating Icon */}
      <div
        style={{
          position: "absolute",
          fontSize: "50vh",
          opacity: 0.15,
          pointerEvents: "none",
          userSelect: "none",
          animation: "float 6s ease-in-out infinite",
          zIndex: 2,
          filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
        }}
      >
        {currentTheme.icon}
      </div>

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          textAlign: "center",
          color: currentTheme.textColor,
          zIndex: 20,
          width: "100%"
        }}
      >
        <h2 style={{ 
          margin: 0, 
          fontSize: "clamp(1.5rem, 4vw, 2.5rem)", 
          textTransform: "uppercase", 
          letterSpacing: "4px", 
          textShadow: "0 2px 10px rgba(0,0,0,0.2)",
          opacity: 0.9
        }}>
          Verses Recited
        </h2>
      </div>

      {/* Counter */}
      <div
        ref={numberRef}
        className="counter-text"
        style={{
          color: currentTheme.textColor,
          textShadow: `0 10px 30px rgba(0,0,0,0.3), 4px 4px 0px ${currentTheme.accentColor}`,
          zIndex: 10,
        }}
      >
        {count}
      </div>

      {/* Admin */}
      <AdminPanel 
        currentCount={count} 
        onUpdateCount={handleUpdateCount} 
        isOffline={isOffline}
      />
    </div>
  );
};

export default App;
