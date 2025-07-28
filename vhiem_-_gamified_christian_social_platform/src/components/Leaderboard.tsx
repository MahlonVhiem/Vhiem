import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Leaderboard() {
  const leaderboard = useQuery(api.users.getLeaderboard);

  if (!leaderboard) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return "🏅";
    }
  };

  const getRankGradient = (index: number) => {
    switch (index) {
      case 0: return "from-yellow-400 to-orange-500";
      case 1: return "from-gray-300 to-gray-500";
      case 2: return "from-orange-400 to-red-500";
      default: return "from-blue-400 to-purple-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          🏆 Community Leaders
        </h3>
        
        <div className="space-y-4">
          {leaderboard.map((user, index) => (
            <div
              key={user._id}
              className={`relative overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-105 ${
                index < 3 ? "ring-2 ring-yellow-400/50" : ""
              }`}
            >
              <div className={`bg-gradient-to-r ${getRankGradient(index)} p-4`}>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getRankIcon(index)}</div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="font-bold text-lg">
                        {user.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-lg">{user.displayName}</div>
                      <div className="text-white/80 text-sm capitalize">
                        {user.role.replace('_', ' ')} • Level {user.level}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold">{user.points}</div>
                    <div className="text-white/80 text-sm">points</div>
                  </div>
                </div>
              </div>
              
              {index < 3 && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-black px-3 py-1 rounded-bl-lg font-bold text-sm">
                  #{index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {leaderboard.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🏆</div>
            <h4 className="text-xl font-bold text-white mb-2">No leaders yet</h4>
            <p className="text-white/80">Start earning points to appear on the leaderboard!</p>
          </div>
        )}
      </div>
      
      {/* Achievement Goals */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Achievement Goals</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl text-white">
            <div className="text-lg font-bold mb-2">🌟 Rising Star</div>
            <div className="text-sm text-white/80">Reach 500 points</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-xl text-white">
            <div className="text-lg font-bold mb-2">⭐ Community Champion</div>
            <div className="text-sm text-white/80">Reach 1,000 points</div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-xl text-white">
            <div className="text-lg font-bold mb-2">🏆 Faith Leader</div>
            <div className="text-sm text-white/80">Reach 2,500 points</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-xl text-white">
            <div className="text-lg font-bold mb-2">👑 Vhiem Legend</div>
            <div className="text-sm text-white/80">Reach 5,000 points</div>
          </div>
        </div>
      </div>
    </div>
  );
}
