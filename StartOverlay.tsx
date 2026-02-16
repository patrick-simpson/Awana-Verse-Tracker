
import React from "react";
import { APP_VERSION, LAST_MODIFIED } from "./constants";

const StartOverlay = ({ onStart }) => {
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
      <h1 style={{ marginBottom: "30px", textAlign: "center", fontFamily: 'Poppins, sans-serif' }}>
        Awana Africa<br />Verse Counter
      </h1>
      <button
        onClick={onStart}
        style={{
          padding: "20px 50px",
          fontSize: "24px",
          backgroundColor: "#FFD700",
          color: "#333",
          border: "none",
          borderRadius: "50px",
          cursor: "pointer",
          fontWeight: "900",
          boxShadow: "0 0 30px rgba(255, 215, 0, 0.6)",
          transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        🚀 Launch Display
      </button>
      <p style={{ marginTop: "20px", opacity: 0.6, fontSize: "0.9rem" }}>Click to enable audio & animations</p>

      {/* Version Info */}
      <div style={{
          position: "absolute",
          bottom: "20px",
          textAlign: "center",
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.75rem",
          fontFamily: "monospace"
      }}>
        v{APP_VERSION} &bull; {LAST_MODIFIED}
      </div>
    </div>
  );
};

export default StartOverlay;
