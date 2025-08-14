import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { LandingPage } from "./components/LandingPage";
import { RoleSelection } from "./components/RoleSelection";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const { isLoading: isConvexAuthLoading, isAuthenticated: isConvexAuthenticated } = useConvexAuth();
  const userProfile = useQuery(api.users.getUserProfile);
  const createProfile = useMutation(api.users.createProfile);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"shopper" | "business" | "delivery_driver" | null>(null);

  // Auto-create profile when user is authenticated but has no profile
  useEffect(() => {
    const autoCreateProfile = async () => {
      if (isConvexAuthenticated && userProfile === null && !isCreatingProfile) {
        setIsCreatingProfile(true);
        try {
          await createProfile({
            role: "shopper",
            displayName: "Unknown",
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
          <p className="text-white/80">
            {isCreatingProfile ? "Setting up your profile..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!isConvexAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-12">
          <LandingPage onRoleSelect={setSelectedRole} />
        </div>
        <Toaster position="top-center" />
      </div>
    );
  }

  // Show role selection if authenticated but no profile
  if (!userProfile) {
    const preSelectedRole = localStorage.getItem('vhiem-preselected-role') as "shopper" | "business" | "delivery_driver" | null;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-12">
          <RoleSelection preSelectedRole={preSelectedRole || selectedRole} />
        </div>
        <Toaster position="top-center" />
      </div>
    );
  }

  // Show dashboard if authenticated and has profile
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <Dashboard />
      </div>
      <Toaster position="top-center" />
    </div>
  );
}