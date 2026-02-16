
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
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(255,255,255,0.2)",
          cursor: "pointer",
          zIndex: 100,
          transition: "all 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          color: "white",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)";
          e.currentTarget.style.transform = "rotate(90deg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)";
          e.currentTarget.style.transform = "rotate(0deg)";
        }}
      >
        ⚙️
      </button>
    );
  }

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    zIndex: 101,
    color: "#333",
    width: "320px",
    animation: "slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  };

  const adminButtonStyle = {
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
        <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Control Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{ 
              border: "none", 
              background: "#eee", 
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              cursor: "pointer", 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold'
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
            outline: "none"
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
        style={{ ...adminButtonStyle, width: "100%", backgroundColor: "#ffebee", color: "#c62828" }}
      >
        Reset Counter
      </button>

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#888", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
        <span style={{ 
            width: "10px", 
            height: "10px", 
            borderRadius: "50%", 
            backgroundColor: isOffline ? "#ff4444" : "#00C851",
            boxShadow: `0 0 10px ${isOffline ? "#ff4444" : "#00C851"}`
        }}></span>
        {isOffline ? "Offline Mode (Local Only)" : "Live Database Connection"}
      </div>
    </div>
  );
};

export default AdminPanel;
