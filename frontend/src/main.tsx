// main.tsx — entry point of the React app
// This is the first file that runs in the browser
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";   // Tailwind CSS + CSS variables

// ReactDOM.createRoot() mounts the React app into the <div id="root"> in index.html
// React.StrictMode runs extra checks in development to catch common mistakes
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
