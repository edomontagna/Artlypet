import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", {
    reason: event.reason,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  });
});

createRoot(document.getElementById("root")!).render(<App />);
