import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import "./index.css";
import App from "./App";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
console.log('VITE_CONVEX_URL:', convexUrl);

if (!convexUrl) {
  throw new Error(
    "Missing VITE_CONVEX_URL environment variable.\n" +
    "Run 'npm run dev' to start the Convex development server, or\n" +
    "add VITE_CONVEX_URL to your .env.local file."
  );
}

const convex = new ConvexReactClient(convexUrl);

createRoot(document.getElementById("root")!).render(
  <ConvexAuthProvider client={convex}>
    <App />
  </ConvexAuthProvider>,
);