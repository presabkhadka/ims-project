import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider 
  clientId={import.meta.env.VITE_CLIENT_ID || "your-default-client-id"}>
    <App />
  </GoogleOAuthProvider>
);
