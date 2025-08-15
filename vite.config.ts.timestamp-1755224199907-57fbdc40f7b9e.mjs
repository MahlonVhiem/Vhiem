// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => ({
  define: {
    // Use production URLs when building for production
    "import.meta.env.VITE_CONVEX_URL": mode === "production" ? JSON.stringify(process.env.VITE_CONVEX_URL_PROD || process.env.VITE_CONVEX_URL) : JSON.stringify(process.env.VITE_CONVEX_URL)
  },
  plugins: [
    react(),
    // The code below enables dev tools like taking screenshots of your site
    // while it is being developed on chef.convex.dev.
    // Feel free to remove this code if you're no longer developing your app with Chef.
    mode === "development" ? {
      name: "inject-chef-dev",
      transform(code, id) {
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
            map: null
          };
        }
        return null;
      }
    } : null
    // End of code for taking screenshots on chef.convex.dev.
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBkZWZpbmU6IHtcbiAgICAvLyBVc2UgcHJvZHVjdGlvbiBVUkxzIHdoZW4gYnVpbGRpbmcgZm9yIHByb2R1Y3Rpb25cbiAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfQ09OVkVYX1VSTCc6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyBcbiAgICAgID8gSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuVklURV9DT05WRVhfVVJMX1BST0QgfHwgcHJvY2Vzcy5lbnYuVklURV9DT05WRVhfVVJMKVxuICAgICAgOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5WSVRFX0NPTlZFWF9VUkwpLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICAvLyBUaGUgY29kZSBiZWxvdyBlbmFibGVzIGRldiB0b29scyBsaWtlIHRha2luZyBzY3JlZW5zaG90cyBvZiB5b3VyIHNpdGVcbiAgICAvLyB3aGlsZSBpdCBpcyBiZWluZyBkZXZlbG9wZWQgb24gY2hlZi5jb252ZXguZGV2LlxuICAgIC8vIEZlZWwgZnJlZSB0byByZW1vdmUgdGhpcyBjb2RlIGlmIHlvdSdyZSBubyBsb25nZXIgZGV2ZWxvcGluZyB5b3VyIGFwcCB3aXRoIENoZWYuXG4gICAgbW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiXG4gICAgICA/IHtcbiAgICAgICAgICBuYW1lOiBcImluamVjdC1jaGVmLWRldlwiLFxuICAgICAgICAgIHRyYW5zZm9ybShjb2RlOiBzdHJpbmcsIGlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIm1haW4udHN4XCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29kZTogYCR7Y29kZX1cblxuLyogQWRkZWQgYnkgVml0ZSBwbHVnaW4gaW5qZWN0LWNoZWYtZGV2ICovXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGFzeW5jIChtZXNzYWdlKSA9PiB7XG4gIGlmIChtZXNzYWdlLnNvdXJjZSAhPT0gd2luZG93LnBhcmVudCkgcmV0dXJuO1xuICBpZiAobWVzc2FnZS5kYXRhLnR5cGUgIT09ICdjaGVmUHJldmlld1JlcXVlc3QnKSByZXR1cm47XG5cbiAgY29uc3Qgd29ya2VyID0gYXdhaXQgaW1wb3J0KCdodHRwczovL2NoZWYuY29udmV4LmRldi9zY3JpcHRzL3dvcmtlci5idW5kbGVkLm1qcycpO1xuICBhd2FpdCB3b3JrZXIucmVzcG9uZFRvTWVzc2FnZShtZXNzYWdlKTtcbn0pO1xuICAgICAgICAgICAgYCxcbiAgICAgICAgICAgICAgICBtYXA6IG51bGwsXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICA6IG51bGwsXG4gICAgLy8gRW5kIG9mIGNvZGUgZm9yIHRha2luZyBzY3JlZW5zaG90cyBvbiBjaGVmLmNvbnZleC5kZXYuXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG59KSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBO0FBQUEsSUFFTixtQ0FBbUMsU0FBUyxlQUN4QyxLQUFLLFVBQVUsUUFBUSxJQUFJLHdCQUF3QixRQUFRLElBQUksZUFBZSxJQUM5RSxLQUFLLFVBQVUsUUFBUSxJQUFJLGVBQWU7QUFBQSxFQUNoRDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSU4sU0FBUyxnQkFDTDtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sVUFBVSxNQUFjLElBQVk7QUFDbEMsWUFBSSxHQUFHLFNBQVMsVUFBVSxHQUFHO0FBQzNCLGlCQUFPO0FBQUEsWUFDTCxNQUFNLEdBQUcsSUFBSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFXYixLQUFLO0FBQUEsVUFDUDtBQUFBLFFBQ0Y7QUFDQSxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0YsSUFDQTtBQUFBO0FBQUEsRUFFTixFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
