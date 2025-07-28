import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function PostCreator() {
  const [content, setContent] = useState("");
  const [type, setType] = useState<"verse" | "prayer" | "testimony" | "general">("general");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const createPost = useMutation(api.posts.createPost);

  const postTypes = [
    { id: "verse" as const, label: "Bible Verse", icon: "📖", points: 20, gradient: "from-blue-500 to-purple-600" },
    { id: "prayer" as const, label: "Prayer Request", icon: "🙏", points: 15, gradient: "from-purple-500 to-pink-600" },
    { id: "testimony" as const, label: "Testimony", icon: "✨", points: 15, gradient: "from-green-500 to-blue-500" },
    { id: "general" as const, label: "General", icon: "💬", points: 10, gradient: "from-yellow-500 to-orange-500" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      await createPost({
        content: content.trim(),
        type,
        tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
      });
      
      const selectedType = postTypes.find(t => t.id === type);
      toast.success(`Post created! You earned ${selectedType?.points} points! 🎉`);
      
      setContent("");
      setTags("");
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-2xl font-bold text-white mb-6">Share with the Community</h3>
        
        {/* Post Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {postTypes.map((postType) => (
            <button
              key={postType.id}
              onClick={() => setType(postType.id)}
              className={`relative p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                type === postType.id
                  ? "ring-4 ring-yellow-400 scale-105"
                  : "hover:ring-2 hover:ring-white/30"
              }`}
            >
              <div className={`bg-gradient-to-br ${postType.gradient} p-4 rounded-xl text-white text-center`}>
                <div className="text-2xl mb-2">{postType.icon}</div>
                <div className="font-bold text-sm">{postType.label}</div>
                <div className="text-xs text-white/80">+{postType.points} pts</div>
              </div>
              {type === postType.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-black text-sm">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              placeholder={
                type === "verse" ? "Share a meaningful Bible verse..." :
                type === "prayer" ? "Share your prayer request..." :
                type === "testimony" ? "Share your testimony..." :
                "What's on your heart?"
              }
              rows={4}
              required
            />
          </div>
          
          <div>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Tags (comma separated, e.g., faith, hope, love)"
            />
          </div>

          <button
            type="submit"
            disabled={!content.trim() || isLoading}
            className="w-full py-3 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isLoading ? "Posting..." : `Share ${postTypes.find(t => t.id === type)?.label}`}
          </button>
        </form>
      </div>
    </div>
  );
}
