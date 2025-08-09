import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { CreateRoomModal } from "./CreateRoomModal"; 
import { VoiceRoom } from "./VoiceRoom";
import { Id } from "../../convex/_generated/dataModel";

export function VoiceChatRoomPage() {
  const rooms = useQuery(api.agora.getVoiceChatRooms);
  const joinRoom = useMutation(api.agora.joinVoiceChatRoom);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<Id<"voiceChatRooms"> | null>(null);

  const handleJoinRoom = async (roomId: Id<"voiceChatRooms">) => {
    const promise = joinRoom({ roomId: roomId });
    toast.promise(promise, {
      loading: "Joining room...",
      success: () => {
        setSelectedRoomId(roomId);
        return "Joined room successfully! Paid 50 points.";
      },
      error: (err) => `Failed to join room: ${err.message}`,
    });
  };

  if (selectedRoomId) {
    return <VoiceRoom roomId={selectedRoomId} onLeave={() => setSelectedRoomId(null)} />;
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Live Voice Rooms</h1>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
        >
          + Create Room
        </button>
      </div>

      {/* Room List */}
      {rooms === undefined && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent"></div>
        </div>
      )}

      {rooms && rooms.length === 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <div className="text-4xl mb-4">🎙️</div>
          <h3 className="text-xl font-bold text-white mb-2">No Live Rooms</h3>
          <p className="text-white/80">Be the first to start a conversation!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms?.map((room) => (
          <div key={room._id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col justify-between animate-slide-up">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 truncate">{room.name}</h3>
              <p className="text-white/60 text-sm mb-1">Host: {room.creatorName}</p>
              <p className="text-white/80 mb-4 h-10 overflow-hidden">{room.description}</p>
            </div>
            <div className="flex justify-between items-center">
              <div className="px-3 py-1 bg-black/20 rounded-full text-white/80 text-sm">
                👥 {room.participantCount} / {room.listenerLimit}
              </div>
              <button 
                onClick={() => handleJoinRoom(room._id)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Join (50 pts)
              </button>
            </div>
          </div>
        ))}
      </div>

      {isCreateModalOpen && <CreateRoomModal onClose={() => setCreateModalOpen(false)} />}
    </div>
  );
}
