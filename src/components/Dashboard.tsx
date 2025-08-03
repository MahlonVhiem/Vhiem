@@ .. @@
import { ClickableProfilePicture } from "./ClickableProfilePicture";

-export function Dashboard() {
+interface DashboardProps {
+  onNavigateToVoiceChat: () => void;
+}
+
+export function Dashboard({ onNavigateToVoiceChat }: DashboardProps) {
   const [activeTab, setActiveTab] = useState<"feed" | "create" | "stats" | "leaderboard" | "people">("feed");
@@ .. @@
           <div className="text-right">
             <div className="flex items-center space-x-3">
+              <button
+                onClick={onNavigateToVoiceChat}
+                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm rounded hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
+              >
+                <span>🎤</span>
+                <span>Voice Chat</span>
+              </button>
               <button
                 onClick={() => setShowProfileEdit(true)}
                 className="px-3 py-1 bg-white/20 text-white text-sm rounded hover:bg-white/30 transition-colors"