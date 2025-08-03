import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface VoiceChatRoomPageProps {
  onNavigateBack: () => void;
  userProfile: any;
}

interface Room {
  id: string;
  name: string;
  description: string;
  participants: number;
  maxParticipants: number;
  isActive: boolean;
  createdBy?: string;
  createdAt?: number;
}

export function VoiceChatRoomPage({ onNavigateBack, userProfile }: VoiceChatRoomPageProps) {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [newRoomMaxParticipants, setNewRoomMaxParticipants] = useState(20);
  const [agoraConfig, setAgoraConfig] = useState<any>(null);

  const rooms = useQuery(api.agora.getVoiceChatRooms);
  const generateToken = useMutation(api.agora.generateAgoraToken);
  const createRoom = useMutation(api.agora.createVoiceChatRoom);

  const handleJoinRoom = async (roomId: string) => {
    try {
      // Generate Agora token for the room
      const tokenData = await generateToken({
        channelName: roomId,
        uid: userProfile.userId,
        role: "publisher",
      });

      setAgoraConfig(tokenData);
      setActiveRoom(roomId);
      toast.success(`Joined ${rooms?.find(r => r.id === roomId)?.name}! 🎤`);
    } catch (error) {
      console.error("Failed to join room:", error);
      toast.error("Failed to join room. Please try again.");
    }
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
    setAgoraConfig(null);
    toast.success("Left the voice room");
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      const room = await createRoom({
        name: newRoomName.trim(),
        description: newRoomDescription.trim() || undefined,
        maxParticipants: newRoomMaxParticipants,
      });

      setNewRoomName("");
      setNewRoomDescription("");
      setNewRoomMaxParticipants(20);
      setShowCreateRoom(false);
      
      toast.success(`Room "${room.name}" created! 🎉`);
      
      // Automatically join the newly created room
      await handleJoinRoom(room.id);
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("Failed to create room. Please try again.");
    }
  };

  // If user is in a room, show the Agora interface
  if (activeRoom && agoraConfig) {
    const currentRoom = rooms?.find(r => r.id === activeRoom);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-orange-500">
        <div className="min-h-screen bg-black/20 backdrop-blur-sm">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLeaveRoom}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Leave Room
                </button>
                <div>
                  <h1 className="text-xl font-bold text-white">{currentRoom?.name}</h1>
                  <p className="text-white/60 text-sm">{currentRoom?.description}</p>
                </div>
              </div>
              <button
                onClick={onNavigateBack}
                className="px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </header>

          {/* Agora Voice Chat Interface */}
          <main className="container mx-auto px-4 py-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎤</div>
                <h2 className="text-2xl font-bold text-white mb-2">Voice Chat Active</h2>
                <p className="text-white/80">You're connected to: {currentRoom?.name}</p>
              </div>

              {/* Agora Integration Placeholder */}
              <div className="bg-white/5 rounded-xl p-8 border-2 border-dashed border-white/20 text-center">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-bold text-white mb-4">Agora Integration Placeholder</h3>
                <div className="text-white/80 space-y-2 max-w-2xl mx-auto">
                  <p><strong>Integration Method:</strong> Replace this section with your Agora App Builder integration</p>
                  <p><strong>Option 1 (iframe):</strong> If Agora provides an embeddable URL, replace this div with an iframe</p>
                  <p><strong>Option 2 (SDK):</strong> If using Agora SDK, initialize the client here with the token data</p>
                  <div className="mt-4 p-4 bg-white/10 rounded text-left text-sm">
                    <p><strong>Current Config:</strong></p>
                    <pre className="text-xs text-white/60 mt-2">
                      {JSON.stringify(agoraConfig, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Voice Controls Placeholder */}
              <div className="flex justify-center space-x-4 mt-8">
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  🎤 Unmute
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  🔊 Speaker
                </button>
                <button className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                  ✋ Raise Hand
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Show room list and creation interface
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Voice Chat Rooms
          </h2>
          <p className="text-white/80 text-lg">
            Join a voice chat room to connect with the community
          </p>
        </div>
        <button
          onClick={onNavigateBack}
          className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Create Room Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowCreateRoom(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
        >
          + Create New Room
        </button>
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Create Voice Room</h3>
              <button
                onClick={() => setShowCreateRoom(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Room Name *</label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter room name"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <textarea
                  value={newRoomDescription}
                  onChange={(e) => setNewRoomDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                  placeholder="Describe your room..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Max Participants</label>
                <input
                  type="number"
                  value={newRoomMaxParticipants}
                  onChange={(e) => setNewRoomMaxParticipants(parseInt(e.target.value) || 20)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  min="2"
                  max="100"
                />
              </div>

              <button
                type="submit"
                disabled={!newRoomName.trim()}
                className="w-full py-3 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Room
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Room List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms?.map((room) => (
          <div
            key={room.id}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{room.name}</h3>
                <p className="text-white/80 text-sm mb-3">{room.description}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${room.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="text-white/60 text-sm">
                {room.participants}/{room.maxParticipants} participants
              </div>
              {room.createdBy && (
                <div className="text-white/60 text-xs">
                  by {room.createdBy}
                </div>
              )}
            </div>

            <button
              onClick={() => handleJoinRoom(room.id)}
              disabled={room.participants >= room.maxParticipants}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {room.participants >= room.maxParticipants ? "Room Full" : "Join Room"}
            </button>
          </div>
        ))}
      </div>

      {rooms?.length === 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <div className="text-4xl mb-4">🎤</div>
          <h3 className="text-xl font-bold text-white mb-2">No voice rooms available</h3>
          <p className="text-white/80">Create the first voice chat room for the community!</p>
        </div>
      )}
    </div>
  );
}