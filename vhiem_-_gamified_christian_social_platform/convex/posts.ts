import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createPost = mutation({
  args: {
    content: v.string(),
    type: v.union(v.literal("verse"), v.literal("prayer"), v.literal("testimony"), v.literal("general")),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const postId = await ctx.db.insert("posts", {
      authorId: userId,
      content: args.content,
      type: args.type,
      tags: args.tags,
      likes: 0,
      comments: 0,
      shares: 0,
    });

    // Award points for posting
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (profile) {
      const pointsToAward = args.type === "verse" ? 20 : args.type === "prayer" ? 15 : 10;
      await ctx.db.patch(profile._id, {
        points: profile.points + pointsToAward,
      });

      await ctx.db.insert("pointTransactions", {
        userId,
        points: pointsToAward,
        action: "post",
        description: `Posted a ${args.type} 📝`,
      });
    }

    return postId;
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .order("desc")
      .take(20);

    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", post.authorId))
          .unique();

        return {
          ...post,
          author: author?.name || "Unknown",
          authorProfile: profile,
        };
      })
    );

    return postsWithAuthors;
  },
});

export const likePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if already liked
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_user_post", (q) => q.eq("userId", userId).eq("postId", args.postId))
      .unique();

    if (existingLike) {
      // Unlike
      await ctx.db.delete(existingLike._id);
      
      const post = await ctx.db.get(args.postId);
      if (post) {
        await ctx.db.patch(args.postId, {
          likes: Math.max(0, post.likes - 1),
        });
      }
      return false;
    } else {
      // Like
      await ctx.db.insert("likes", {
        userId,
        postId: args.postId,
        type: "post",
      });

      const post = await ctx.db.get(args.postId);
      if (post) {
        await ctx.db.patch(args.postId, {
          likes: post.likes + 1,
        });

        // Award points to post author
        const authorProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", post.authorId))
          .unique();

        if (authorProfile) {
          await ctx.db.patch(authorProfile._id, {
            points: authorProfile.points + 5,
          });

          await ctx.db.insert("pointTransactions", {
            userId: post.authorId,
            points: 5,
            action: "like_received",
            description: "Someone liked your post! ❤️",
          });
        }
      }
      return true;
    }
  },
});

export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const commentId = await ctx.db.insert("comments", {
      postId: args.postId,
      authorId: userId,
      content: args.content,
      likes: 0,
    });

    // Update post comment count
    const post = await ctx.db.get(args.postId);
    if (post) {
      await ctx.db.patch(args.postId, {
        comments: post.comments + 1,
      });
    }

    // Award points for commenting
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (profile) {
      await ctx.db.patch(profile._id, {
        points: profile.points + 5,
      });

      await ctx.db.insert("pointTransactions", {
        userId,
        points: 5,
        action: "comment",
        description: "Added a comment 💬",
      });
    }

    return commentId;
  },
});
