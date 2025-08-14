interface LandingPageProps {
  onRoleSelect: (role: "shopper" | "business" | "delivery_driver") => void;
}

export function LandingPage({ onRoleSelect }: LandingPageProps) {
  const roles = [
    {
      id: "shopper" as const,
      title: "Shopper",
      description: "Connect with Christian businesses and find faith-based products and services",
      icon: "🛍️",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: "business" as const,
      title: "Business",
      description: "Share your Christian business and connect with the community",
      icon: "🏪",
      gradient: "from-green-500 to-blue-500"
    },
    {
      id: "delivery_driver" as const,
      title: "Delivery Driver",
      description: "Serve the community by providing delivery services",
      icon: "🚗",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className="text-center animate-fade-in">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent mb-6">
        Welcome to Vhiem
      </h1>
      <p className="text-xl text-white/80 mb-12">
        A gamified Christian social platform connecting shoppers, businesses, and delivery drivers
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`bg-gradient-to-br ${role.gradient} p-8 rounded-2xl text-white cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
            onClick={() => onRoleSelect(role.id)}
          >
            <div className="text-6xl mb-6">{role.icon}</div>
            <h3 className="text-2xl font-bold mb-4">{role.title}</h3>
            <p className="text-white/90 mb-6">{role.description}</p>
            <button className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Join as {role.title}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6">Why Choose Vhiem?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-white mb-2">Gamified Experience</h3>
            <p className="text-white/80">Earn points, level up, and compete on daily leaderboards</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-white mb-2">Community Driven</h3>
            <p className="text-white/80">Connect with like-minded believers in your area</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-bold text-white mb-2">Business Growth</h3>
            <p className="text-white/80">Grow your Christian business with monthly subscriptions</p>
          </div>
        </div>
      </div>
    </div>
  );
}