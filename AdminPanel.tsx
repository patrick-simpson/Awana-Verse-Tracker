import React, { useState } from "react";

const AdminPanel = ({ currentCount, onUpdateCount, isOffline }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customVal, setCustomVal] = useState("");

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(255,255,255,0.2)",
          cursor: "pointer",
          zIndex: 100,
          transition: "all 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          color: "rgba(255,255,255,0.7)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)";
          e.currentTarget.style.color = "white";
          e.currentTarget.style.transform = "rotate(90deg) scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.3)";
          e.currentTarget.style.color = "rgba(255,255,255,0.7)";
          e.currentTarget.style.transform = "rotate(0deg) scale(1)";
        }}
        title="Admin Controls"
      >
        ⚙️
      </button>
    );
  }

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(20px)",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.5)",
    zIndex: 101,
    color: "#333",
    width: "300px",
    animation: "slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  };

  const adminButtonStyle: React.CSSProperties = {
    padding: "12px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#f0f2f5",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    transition: "all 0.2s",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", letterSpacing: "-0.5px" }}>Control Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{ 
              border: "none", 
              background: "#eee", 
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              cursor: "pointer", 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#555'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
        <button
          onClick={() => onUpdateCount(currentCount + 1)}
          style={{...adminButtonStyle, backgroundColor: "#E3F2FD", color: "#1565C0"}}
        >
          +1 Verse
        </button>
        <button
          onClick={() => onUpdateCount(currentCount + 5)}
          style={{...adminButtonStyle, backgroundColor: "#E3F2FD", color: "#1565C0"}}
        >
          +5 Verses
        </button>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Value..."
          value={customVal}
          onChange={(e) => setCustomVal(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            border: "2px solid #eee",
            borderRadius: "12px",
            fontSize: "16px",
            outline: "none",
            backgroundColor: "#f9f9f9",
            fontWeight: "600"
          }}
        />
        <button
          onClick={() => {
             const val = parseInt(customVal);
             if(!isNaN(val)) onUpdateCount(currentCount + val);
             setCustomVal("");
          }}
          style={{...adminButtonStyle, backgroundColor: "#333", color: "white"}}
        >
          Add
        </button>
      </div>

      <button
        onClick={() => {
          if (confirm("Are you sure you want to RESET the count to 0?")) {
            onUpdateCount(0);
          }
        }}
        style={{ ...adminButtonStyle, width: "100%", backgroundColor: "#FFEBEE", color: "#D32F2F" }}
      >
        Reset Counter
      </button>

      <div style={{ marginTop: "20px", fontSize: "11px", color: "#888", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: "600" }}>
        <span style={{ 
            width: "8px", 
            height: "8px", 
            borderRadius: "50%", 
            backgroundColor: isOffline ? "#FF5252" : "#4CAF50",
            boxShadow: `0 0 6px ${isOffline ? "#FF5252" : "#4CAF50"}`
        }}></span>
        {isOffline ? "LOCAL MODE (OFFLINE)" : "LIVE DATABASE"}
      </div>
    </div>
  );
};

export default AdminPanel;