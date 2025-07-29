import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { ClickableProfilePicture } from "./ClickableProfilePicture";

interface PostFeedProps {
  onProfileClick?: (userId: string) => void;
}

export function PostFeed({ onProfileClick }: PostFeedProps) {
  const posts = useQuery(api.posts.getPosts);
  const likePost = useMutation(api.posts.likePost);
  const addComment = useMutation(api.posts.addComment);
  const followUser = useMutation(api.users.followUser);
  const unfollowUser = useMutation(api.users.unfollowUser);
  
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  const handleLike = async (postId: string) => {
    try {
      const liked = await likePost({ postId: postId as any });
      toast.success(liked ? "Post liked! ❤️" : "Like removed");
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const handleComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    try {
      await addComment({ postId: postId as any, content });
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      toast.success("Comment added! +5 points! 💬");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleFollow = async (userId: string, isCurrentlyFollowing: boolean) => {
    try {
      if (isCurrentlyFollowing) {
        const result = await unfollowUser({ userId: userId as any });
        if (result) {
          setFollowingStates(prev => ({ ...prev, [userId]: false }));
          toast.success("Unfollowed user");
        }
      } else {
        const result = await followUser({ userId: userId as any });
        if (result) {
          setFollowingStates(prev => ({ ...prev, [userId]: true }));
          toast.success("Following user! 🎉");
        }
      }
    } catch (error: any) {
      console.error("Follow error:", error);
      if (error.message?.includes("Cannot follow yourself")) {
        toast.error("You cannot follow yourself");
      } else {
        toast.error("Failed to update follow status");
      }
    }
  };

  const getPostTypeStyle = (type: string) => {
    switch (type) {
      case "verse": return "from-blue-500 to-purple-600";
      case "prayer": return "from-purple-500 to-pink-600";
      case "testimony": return "from-green-500 to-blue-500";
      default: return "from-yellow-500 to-orange-500";
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "verse": return "📖";
      case "prayer": return "🙏";
      case "testimony": return "✨";
      default: return "💬";
    }
  };

  if (!posts) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
          <p className="text-white/80">Be the first to share something with the community!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-slide-up">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <ClickableProfilePicture
                  userId={post.authorProfile?.userId}
                  profilePhotoUrl={post.authorProfile?.profilePhotoUrl}
                  displayName={post.author}
                  size="md"
                  onClick={onProfileClick}
                />
                <div>
                  <button 
                    onClick={() => post.authorProfile?.userId && onProfileClick?.(post.authorProfile.userId)}
                    className="font-bold text-white hover:text-yellow-400 transition-colors text-left"
                  >
                    {post.author}
                  </button>
                  <div className="text-white/60 text-sm">
                    Level {post.authorProfile?.level || 1} • {post.authorProfile?.points || 0} points • {post.authorFollowerCount || 0} followers
                  </div>
                </div>
                {post.authorProfile && post.authorProfile.userId && !post.isOwnPost && (
                  <button
                    onClick={() => handleFollow(post.authorProfile!.userId, followingStates[post.authorProfile!.userId] ?? false)}
                    className="px-3 py-1 rounded bg-blue-600/20 text-blue-400 text-xs font-medium hover:bg-blue-600/30 transition-colors border border-blue-400/30"
                  >
                    {followingStates[post.authorProfile.userId] ?? false ? "Following" : "Follow"}
                  </button>
                )}
              </div>
              <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getPostTypeStyle(post.type)} text-white text-sm font-medium flex items-center space-x-1`}>
                <span>{getPostTypeIcon(post.type)}</span>
                <span className="capitalize">{post.type}</span>
              </div>
            </div>

            {/* Post Content */}
            <div className="text-white mb-4 leading-relaxed">
              {post.content}
            </div>

            {/* Post Photo */}
            {post.postPhotoUrl && (
              <div className="mb-4">
                <img
                  src={post.postPhotoUrl}
                  alt="Post image"
                  className="w-full max-h-96 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/20 rounded-full text-white/80 text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between border-t border-white/20 pt-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center space-x-2 text-white/80 hover:text-red-400 transition-colors"
                >
                  <span>❤️</span>
                  <span>{post.likes}</span>
                </button>
                
                <button
                  onClick={() => setShowComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))}
                  className="flex items-center space-x-2 text-white/80 hover:text-blue-400 transition-colors"
                >
                  <span>💬</span>
                  <span>{post.comments}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-white/80 hover:text-green-400 transition-colors">
                  <span>🔄</span>
                  <span>{post.shares}</span>
                </button>
              </div>
              
              <div className="text-white/60 text-sm">
                {new Date(post._creationTime).toLocaleDateString()}
              </div>
            </div>

            {/* Comment Section */}
            {showComments[post._id] && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={commentInputs[post._id] || ""}
                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Add a comment..."
                    onKeyPress={(e) => e.key === "Enter" && handleComment(post._id)}
                  />
                  <button
                    onClick={() => handleComment(post._id)}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-medium rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
