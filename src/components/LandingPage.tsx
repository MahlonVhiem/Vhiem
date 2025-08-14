import { useAuth } from "@clerk/clerk-react";

interface LandingPageProps {
  onRoleSelect: (role: "shopper" | "business" | "delivery_driver") => void;
}

export function LandingPage({ onRoleSelect }: LandingPageProps) {
  const { isSignedIn } = useAuth();

  const handleRoleSelect = (role: "shopper" | "business" | "delivery_driver") => {
    localStorage.setItem('vhiem-preselected-role', role);
    onRoleSelect(role);
  };

  return (
    <div className="text-center animate-fade-in">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent mb-6">
        Welcome to Vhiem
      </h1>
      <p className="text-xl text-white/80 mb-12">
        A gamified Christian social platform connecting shoppers, businesses, and delivery drivers
      </p>

      {!isSignedIn && (
        <div className="space-y-4">
          <p className="text-white/60">Sign in to get started</p>
        </div>
      )}
    </div>
  );
}