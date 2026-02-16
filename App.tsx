import React, { useEffect, useState, useRef, useMemo } from "react";
import { db } from "./firebase";
import { ref, onValue, set, get } from "firebase/database";
import gsap from "gsap";

// --- Types & Constants ---
type Theme = "savanna" | "river" | "village" | "jungle" | "celebration";

const BUILD_ID = "v1.4.3";

const getTheme = (count: number): Theme => {
  if (count <= 100) return "savanna";
  if (count <= 200) return "river";
  if (count <= 500) return "village";
  if (count <= 800) return "jungle";
  return "celebration";
};

// --- Audio Engine (Web Audio API) ---
class AudioEngine {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.5; // Master volume
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playPop() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  playMilestone() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    // C Major Chord (C4, E4, G4)
    const freqs = [261.63, 329.63, 392.00];
    
    freqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = "triangle";
      osc.frequency.value = f;
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 2);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start(t);
      osc.stop(t + 2);
    });
  }
}

const audioEngine = new AudioEngine();

// --- Main Component ---
export default function App() {
  const [count, setCount] = useState<number>(0);
  const [audioReady, setAudioReady] = useState<boolean>(false);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [customInput, setCustomInput] = useState<string>("");

  const numberRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastCount = useRef<number>(0);

  const theme = useMemo(() => getTheme(count), [count]);

  // --- 1. Firebase Sync ---
  useEffect(() => {
    // Verse Count Listener
    const countRef = ref(db, "verseCount");
    const unsubCount = onValue(countRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null) {
        setCount(val);
      }
    }, (error) => {
      console.error("Firebase Read Error:", error);
    });

    // Connection Status Listener
    const connectedRef = ref(db, ".info/connected");
    const unsubConnected = onValue(connectedRef, (snap) => {
      setIsConnected(!!snap.val());
    });

    return () => {
      unsubCount();
      unsubConnected();
    };
  }, []);

  // --- 2. Animations & Audio Logic ---
  useEffect(() => {
    // Skip initial render or no change
    if (count === lastCount.current) return;

    const diff = count - lastCount.current;
    const isMilestone = count % 100 === 0 && count > 0;
    
    // Audio
    if (audioReady && diff > 0) {
      if (isMilestone) {
        audioEngine.playMilestone();
      } else {
        audioEngine.playPop();
      }
    }

    // Animation
    if (numberRef.current) {
      // Kill existing tweens to prevent conflict
      gsap.killTweensOf(numberRef.current);

      // Milestone Animation: Big Zoom
      if (isMilestone) {
         gsap.fromTo(numberRef.current, 
           { scale: 0.5, opacity: 0, rotation: -10 },
           { scale: 1.2, opacity: 1, rotation: 0, duration: 1.2, ease: "elastic.out(1, 0.3)" }
         );
         gsap.to(numberRef.current, { scale: 1, duration: 0.5, delay: 1.2 });
         
         // Flash background
         gsap.to(containerRef.current, { 
           filter: "brightness(2)", duration: 0.1, yoyo: true, repeat: 1 
         });
      } 
      // Standard Pop
      else {
        gsap.fromTo(numberRef.current,
          { scale: 0.8, opacity: 0.5 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
        );
      }
    }

    lastCount.current = count;
  }, [count, audioReady]);

  // --- 3. Background FX ---
  // Simple particle system using GSAP context
  const fxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!fxRef.current) return;
    
    const ctx = gsap.context(() => {
      // Clear old particles
      fxRef.current!.innerHTML = "";
      
      // Determine particle config based on theme
      let count = 20;
      let type = "circle"; // circle, square
      let moveY = -100;
      
      if (theme === "savanna") { count = 30; moveY = -50; } // Dust motes
      if (theme === "river") { count = 20; moveY = 50; } // Flowing down
      if (theme === "celebration") { count = 50; moveY = -200; } // Fast sparks

      for (let i = 0; i < count; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.left = Math.random() * 100 + "%";
        p.style.top = Math.random() * 100 + "%";
        
        // Size variation
        const size = Math.random() * 10 + 2;
        p.style.width = size + "px";
        p.style.height = size + "px";
        
        if (theme === "village") p.style.borderRadius = "2px"; // Square-ish for bricks
        
        fxRef.current!.appendChild(p);

        gsap.to(p, {
          y: Math.random() * moveY,
          x: (Math.random() - 0.5) * 50,
          opacity: Math.random(),
          duration: 2 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    }, fxRef);

    return () => ctx.revert();
  }, [theme]);


  // --- Handlers ---
  const handleStart = () => {
    audioEngine.init();
    setAudioReady(true);
  };

  const updateCount = (newVal: number) => {
    // Optimistic update
    setCount(newVal);
    // Persist
    set(ref(db, "verseCount"), newVal).catch(e => {
       console.error("Failed to write to Firebase", e);
       // Alert handled by offline status UI
    });
  };

  const increment = (amount: number) => {
    const next = count + amount;
    if (next <= 1000) updateCount(next);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInput);
    if (!isNaN(val) && val >= 0 && val <= 1000) {
      updateCount(val);
      setCustomInput("");
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to RESET the counter to 0?")) {
      updateCount(0);
    }
  };

  return (
    <div className={`app-container theme-${theme}`} ref={containerRef}>
      
      {/* 1. Background Layer */}
      <div className="layer background-fx" ref={fxRef}></div>

      {/* 2. Content Layer */}
      <div className="content-layer">
        <div className="counter-wrapper">
          <h1 className="verse-count" ref={numberRef}>{count}</h1>
        </div>
        <div className="verse-label">Verses Sponsored</div>
      </div>

      {/* 3. Overlays */}
      {!audioReady && (
        <div className="start-overlay" onClick={handleStart}>
          <button className="start-btn">Click to Start Broadcast</button>
        </div>
      )}

      {/* 4. Admin Panel */}
      <div 
        className="admin-trigger" 
        onClick={() => setAdminOpen(!adminOpen)}
        title="Admin Settings"
      >
        ⚙️
      </div>

      {adminOpen && (
        <div className="admin-panel">
          <div className="admin-header">
            <span>ADMIN CONTROL</span>
            <div 
              className={`status-light ${isConnected ? "" : "offline"}`} 
              title={isConnected ? "Online" : "Offline"}
            />
          </div>
          
          <div className="btn-grid">
            <button className="admin-btn" onClick={() => increment(1)}>+1</button>
            <button className="admin-btn" onClick={() => increment(5)}>+5</button>
            <button className="admin-btn" onClick={() => increment(10)}>+10</button>
          </div>

          <form onSubmit={handleCustomSubmit} className="custom-input-row">
            <input 
              className="admin-input" 
              type="number" 
              placeholder="Set Value"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
            />
            <button className="admin-btn" type="submit">Set</button>
          </form>

          <div className="btn-grid">
             <button className="admin-btn reset" onClick={handleReset}>RESET COUNTER</button>
          </div>
        </div>
      )}

      {/* Build Info */}
      <div className="build-info">Build: {BUILD_ID}</div>

    </div>
  );
}