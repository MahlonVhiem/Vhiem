@@ .. @@
import { RoleSelection } from "./components/RoleSelection";
import { Dashboard } from "./components/Dashboard";
import { LandingPage } from "./components/LandingPage";
+import { VoiceChatRoomPage } from "./components/VoiceChatRoomPage";
import { useState, useEffect } from "react";

export default function App() {
@@ .. @@
function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const userProfile = useQuery(api.users.getUserProfile);
  const [preSelectedRole, setPreSelectedRole] = useState<"shopper" | "business" | "delivery_driver" | null>(null);
+  const [activePage, setActivePage] = useState<"dashboard" | "voiceChat">("dashboard");

  // Get pre-selected role from localStorage when component mounts
@@ .. @@
      <Authenticated>
        {!userProfile ? (
          <RoleSelection preSelectedRole={preSelectedRole || undefined} />
        ) : (
-          <Dashboard />
+          <>
+            {activePage === "dashboard" && (
+              <Dashboard onNavigateToVoiceChat={() => setActivePage("voiceChat")} />
+            )}
+            {activePage === "voiceChat" && (
+              <VoiceChatRoomPage 
+                onNavigateBack={() => setActivePage("dashboard")}
+                userProfile={userProfile}
+              />
+            )}
+          </>
        )}
      </Authenticated>
    </div>