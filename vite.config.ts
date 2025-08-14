import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Use production URLs for production builds, development URLs otherwise
  const convexUrl = mode === 'production' 
    ? env.VITE_CONVEX_URL_PROD 
    : env.VITE_CONVEX_URL;
  
  const convexDeployUrl = mode === 'production'
    ? env.VITE_CONVEX_DEPLOY_URL_PROD
    : env.VITE_CONVEX_DEPLOY_URL;
    
  const convexHttpUrl = mode === 'production'
    ? env.VITE_CONVEX_HTTP_URL_PROD
    : env.VITE_CONVEX_HTTP_URL;

  return {
    define: {
      'import.meta.env.VITE_CONVEX_URL': JSON.stringify(convexUrl),
      'import.meta.env.VITE_CONVEX_DEPLOY_URL': JSON.stringify(convexDeployUrl),
      'import.meta.env.VITE_CONVEX_HTTP_URL': JSON.stringify(convexHttpUrl),
    },
  plugins: [
    react(),
    // The code below enables dev tools like taking screenshots of your site
    // while it is being developed on chef.convex.dev.
    // Feel free to remove this code if you're no longer developing your app with Chef.
    mode === "development"
      ? {
          name: "inject-chef-dev",
          transform(code: string, id: string) {
            if (id.includes("main.tsx")) {
              return {
                code: `${code}

/* Added by Vite plugin inject-chef-dev */
window.addEventListener('message', async (message) => {
  if (message.source !== window.parent) return;
  if (message.data.type !== 'chefPreviewRequest') return;

  const worker = await import('https://chef.convex.dev/scripts/worker.bundled.mjs');
  await worker.respondToMessage(message);
});
            `,
                map: null,
              };
            }
            return null;
          },
        }
      : null,
    // End of code for taking screenshots on chef.convex.dev.
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  };
});