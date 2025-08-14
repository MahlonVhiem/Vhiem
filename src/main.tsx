import { createRoot } from "react-dom/client";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import "./index.css";
import App from "./App";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  console.error("Missing VITE_CONVEX_URL environment variable. Please run 'npm run setup' first.");
}

const convex = new ConvexReactClient(convexUrl || "");

createRoot(document.getElementById("root")!).render(
  <ConvexAuthProvider client={convex}>
    <App />
  </ConvexAuthProvider>,
);