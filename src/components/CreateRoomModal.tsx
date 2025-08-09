import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface CreateRoomModalProps {
  onClose: () => void;
}

export function CreateRoomModal({ onClose }: CreateRoomModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [listenerLimit, setListenerLimit] = useState<5 | 10 | "unlimited">("unlimited");
  const createRoom = useMutation(api.agora.createVoiceChatRoom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const promise = createRoom({
      name,
      description,
      listenerLimit,
    });

    toast.promise(promise, {
      loading: "Creating room...",
      success: () => {
        onClose();
        return "Room created successfully! Cost 100 points.";
      },
      error: (err) => `Failed to create room: ${err.message}`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800 border border-white/20 p-8 rounded-2xl w-full max-w-md m-4">
        <form onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold text-white mb-6">Create a Voice Room</h2>
          
          {/* Room Name */}
          <div className="mb-4">
            <label htmlFor="room-name" className="block text-white/80 text-sm font-medium mb-2">Room Name</label>
            <input
              id="room-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g., Evening Prayer, Bible Study..."
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-white/80 text-sm font-medium mb-2">Description (Optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will this room be about?"
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Listener Limit */}
          <div className="mb-8">
            <label className="block text-white/80 text-sm font-medium mb-3">Listener Limit</label>
            <div className="flex justify-between gap-2">
              {( [5, 10, 'unlimited'] as const ).map((limit) => (
                <button
                  key={limit}
                  type="button"
                  onClick={() => setListenerLimit(limit)}
                  className={`flex-1 py-3 px-2 rounded-lg text-center font-medium transition-all duration-200 ${ 
                    listenerLimit === limit 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}>
                  {limit === 'unlimited' ? 'Unlimited' : `${limit} Listeners`}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create (100 pts)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
