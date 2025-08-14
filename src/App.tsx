import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const { isLoading: isConvexAuthLoading, isAuthenticated: isConvexAuthenticated } = useConvexAuth();
  const userProfile = useQuery(api.users.getUserProfile);
  const createProfile = useMutation(api.users.createProfile);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  // Auto-create profile when user is authenticated but has no profile
  useEffect(() => {
    const autoCreateProfile = async () => {
      if (isConvexAuthenticated && userProfile === null && !isCreatingProfile) {
        setIsCreatingProfile(true);
        try {
          await createProfile({
            role: "shopper",
            displayName: "Demo User",
            bio: undefined,
          });
        } catch (error) {
          console.error("Failed to auto-create profile:", error);
        } finally {
          setIsCreatingProfile(false);
        }
      }
    };

    autoCreateProfile();
  }, [isConvexAuthenticated, userProfile, createProfile, isCreatingProfile]);

  // Show loading while Convex auth is initializing
  if (isConvexAuthLoading || isCreatingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  // Show dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <Dashboard />
      </div>
      <Toaster position="top-center" />
    </div>
  );
}