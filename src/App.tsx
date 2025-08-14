import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { api } from "../convex/_generated/api";
import { Dashboard } from "./components/Dashboard";
import { RoleSelection } from "./components/RoleSelection";
import { LandingPage } from "./components/LandingPage";
import { Toaster } from "sonner";

function App() {
  const { signIn, signOut } = useAuthActions();
  const [selectedRole, setSelectedRole] = useState<"shopper" | "business" | "delivery_driver" | null>(null);
  const userProfile = useQuery(api.users.getUserProfile);

  useEffect(() => {
    const preSelectedRole = localStorage.getItem('vhiem-preselected-role') as "shopper" | "business" | "delivery_driver" | null;
    if (preSelectedRole) {
      setSelectedRole(preSelectedRole);
    }
  }, []);

  const handleRoleSelect = (role: "shopper" | "business" | "delivery_driver") => {
    setSelectedRole(role);
    localStorage.setItem('vhiem-preselected-role', role);
    signIn("anonymous");
  };

  const handleSignOut = () => {
    localStorage.removeItem('vhiem-preselected-role');
    setSelectedRole(null);
    signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <AuthLoading>
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
          </div>
        </AuthLoading>

        <Unauthenticated>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              Vhiem
            </h1>
            <button
              onClick={() => signIn("anonymous")}
              className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
            >
              Sign In
            </button>
          </div>
          <LandingPage onRoleSelect={handleRoleSelect} />
        </Unauthenticated>

        <Authenticated>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              Vhiem
            </h1>
            <button
              onClick={handleSignOut}
              className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-300"
            >
              Sign Out
            </button>
          </div>

          {!userProfile ? (
            <RoleSelection preSelectedRole={selectedRole} />
          ) : (
            <Dashboard />
          )}
        </Authenticated>
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
          },
        }}
      />
    </div>
  );
}

export default App;