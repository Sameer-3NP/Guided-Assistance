import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { SectionProvider } from "./store/SectionStore.tsx";

import "./index.css";
import "./App.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <SectionProvider>
      <App />
    </SectionProvider>
  </StrictMode>,
);
