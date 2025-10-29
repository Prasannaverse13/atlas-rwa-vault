import { createRoot } from "react-dom/client";
import { Buffer } from "buffer";
import App from "./App.tsx";
import "./index.css";

// Polyfill Buffer for Solana web3.js
window.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(<App />);
