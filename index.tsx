import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Create a fallback UI in case React fails
const loadingFallback = document.createElement("div");
loadingFallback.id = "loading-fallback";
loadingFallback.style.cssText = `
  position: fixed;
  inset: 0;
  background: linear-gradient(45deg, #ff00ff, #00ffff);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  z-index: 99999;
`;
loadingFallback.textContent = "Loading Awana Verse Tracker...";

const root = document.getElementById("root");
if (root) {
  root.appendChild(loadingFallback);
}

// Try to mount React
try {
  const reactRoot = createRoot(root!);
  reactRoot.render(<App />);
  // Remove fallback when React renders
  setTimeout(() => {
    loadingFallback.remove();
  }, 100);
} catch (error) {
  loadingFallback.style.background = "red";
  loadingFallback.textContent = `ERROR: ${error.message}`;
  console.error("Fatal error:", error);
}




