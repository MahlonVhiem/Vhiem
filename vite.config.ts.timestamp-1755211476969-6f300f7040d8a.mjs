// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import { loadEnv } from "file:///home/project/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const convexUrl = mode === "production" ? env.VITE_CONVEX_URL_PROD : env.VITE_CONVEX_URL;
  const convexDeployUrl = mode === "production" ? env.VITE_CONVEX_DEPLOY_URL_PROD : env.VITE_CONVEX_DEPLOY_URL;
  const convexHttpUrl = mode === "production" ? env.VITE_CONVEX_HTTP_URL_PROD : env.VITE_CONVEX_HTTP_URL;
  return {
    define: {
      "import.meta.env.VITE_CONVEX_URL": JSON.stringify(convexUrl),
      "import.meta.env.VITE_CONVEX_DEPLOY_URL": JSON.stringify(convexDeployUrl),
      "import.meta.env.VITE_CONVEX_HTTP_URL": JSON.stringify(convexHttpUrl)
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
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG4gIFxuICAvLyBVc2UgcHJvZHVjdGlvbiBVUkxzIGZvciBwcm9kdWN0aW9uIGJ1aWxkcywgZGV2ZWxvcG1lbnQgVVJMcyBvdGhlcndpc2VcbiAgY29uc3QgY29udmV4VXJsID0gbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nIFxuICAgID8gZW52LlZJVEVfQ09OVkVYX1VSTF9QUk9EIFxuICAgIDogZW52LlZJVEVfQ09OVkVYX1VSTDtcbiAgXG4gIGNvbnN0IGNvbnZleERlcGxveVVybCA9IG1vZGUgPT09ICdwcm9kdWN0aW9uJ1xuICAgID8gZW52LlZJVEVfQ09OVkVYX0RFUExPWV9VUkxfUFJPRFxuICAgIDogZW52LlZJVEVfQ09OVkVYX0RFUExPWV9VUkw7XG4gICAgXG4gIGNvbnN0IGNvbnZleEh0dHBVcmwgPSBtb2RlID09PSAncHJvZHVjdGlvbidcbiAgICA/IGVudi5WSVRFX0NPTlZFWF9IVFRQX1VSTF9QUk9EXG4gICAgOiBlbnYuVklURV9DT05WRVhfSFRUUF9VUkw7XG5cbiAgcmV0dXJuIHtcbiAgICBkZWZpbmU6IHtcbiAgICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9DT05WRVhfVVJMJzogSlNPTi5zdHJpbmdpZnkoY29udmV4VXJsKSxcbiAgICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9DT05WRVhfREVQTE9ZX1VSTCc6IEpTT04uc3RyaW5naWZ5KGNvbnZleERlcGxveVVybCksXG4gICAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfQ09OVkVYX0hUVFBfVVJMJzogSlNPTi5zdHJpbmdpZnkoY29udmV4SHR0cFVybCksXG4gICAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgLy8gVGhlIGNvZGUgYmVsb3cgZW5hYmxlcyBkZXYgdG9vbHMgbGlrZSB0YWtpbmcgc2NyZWVuc2hvdHMgb2YgeW91ciBzaXRlXG4gICAgLy8gd2hpbGUgaXQgaXMgYmVpbmcgZGV2ZWxvcGVkIG9uIGNoZWYuY29udmV4LmRldi5cbiAgICAvLyBGZWVsIGZyZWUgdG8gcmVtb3ZlIHRoaXMgY29kZSBpZiB5b3UncmUgbm8gbG9uZ2VyIGRldmVsb3BpbmcgeW91ciBhcHAgd2l0aCBDaGVmLlxuICAgIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIlxuICAgICAgPyB7XG4gICAgICAgICAgbmFtZTogXCJpbmplY3QtY2hlZi1kZXZcIixcbiAgICAgICAgICB0cmFuc2Zvcm0oY29kZTogc3RyaW5nLCBpZDogc3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJtYWluLnRzeFwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvZGU6IGAke2NvZGV9XG5cbi8qIEFkZGVkIGJ5IFZpdGUgcGx1Z2luIGluamVjdC1jaGVmLWRldiAqL1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBhc3luYyAobWVzc2FnZSkgPT4ge1xuICBpZiAobWVzc2FnZS5zb3VyY2UgIT09IHdpbmRvdy5wYXJlbnQpIHJldHVybjtcbiAgaWYgKG1lc3NhZ2UuZGF0YS50eXBlICE9PSAnY2hlZlByZXZpZXdSZXF1ZXN0JykgcmV0dXJuO1xuXG4gIGNvbnN0IHdvcmtlciA9IGF3YWl0IGltcG9ydCgnaHR0cHM6Ly9jaGVmLmNvbnZleC5kZXYvc2NyaXB0cy93b3JrZXIuYnVuZGxlZC5tanMnKTtcbiAgYXdhaXQgd29ya2VyLnJlc3BvbmRUb01lc3NhZ2UobWVzc2FnZSk7XG59KTtcbiAgICAgICAgICAgIGAsXG4gICAgICAgICAgICAgICAgbWFwOiBudWxsLFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgOiBudWxsLFxuICAgIC8vIEVuZCBvZiBjb2RlIGZvciB0YWtpbmcgc2NyZWVuc2hvdHMgb24gY2hlZi5jb252ZXguZGV2LlxuICBdLmZpbHRlcihCb29sZWFuKSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICB9O1xufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZUFBZTtBQUh4QixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFHM0MsUUFBTSxZQUFZLFNBQVMsZUFDdkIsSUFBSSx1QkFDSixJQUFJO0FBRVIsUUFBTSxrQkFBa0IsU0FBUyxlQUM3QixJQUFJLDhCQUNKLElBQUk7QUFFUixRQUFNLGdCQUFnQixTQUFTLGVBQzNCLElBQUksNEJBQ0osSUFBSTtBQUVSLFNBQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxNQUNOLG1DQUFtQyxLQUFLLFVBQVUsU0FBUztBQUFBLE1BQzNELDBDQUEwQyxLQUFLLFVBQVUsZUFBZTtBQUFBLE1BQ3hFLHdDQUF3QyxLQUFLLFVBQVUsYUFBYTtBQUFBLElBQ3RFO0FBQUEsSUFDRixTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFJTixTQUFTLGdCQUNMO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixVQUFVLE1BQWMsSUFBWTtBQUNsQyxjQUFJLEdBQUcsU0FBUyxVQUFVLEdBQUc7QUFDM0IsbUJBQU87QUFBQSxjQUNMLE1BQU0sR0FBRyxJQUFJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxjQVdiLEtBQUs7QUFBQSxZQUNQO0FBQUEsVUFDRjtBQUNBLGlCQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0YsSUFDQTtBQUFBO0FBQUEsSUFFTixFQUFFLE9BQU8sT0FBTztBQUFBLElBQ2hCLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxFQUNBO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
