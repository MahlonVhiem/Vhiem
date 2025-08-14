import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const createProfile = mutation({
  args: {
    role: v.union(v.literal("shopper"), v.literal("business"), v.literal("delivery_driver")),
    displayName: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const clerkUserId = await getAuthUserId(ctx);
    if (!clerkUserId) {
      throw new Error("Not authenticated");
    }

    // First, create or get the user document
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();

    if (!user) {
      // Create user document if it doesn't exist
      const userId = await ctx.db.insert("users", {
        clerkId: clerkUserId,
      });
      user = await ctx.db.get(userId);
      if (!user) {
        throw new Error("Failed to create user");
      }
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (existingProfile) {
      throw new Error("Profile already exists");
    }

    const profileId = await ctx.db.insert("userProfiles", {
      userId: user._id,
      role: args.role,
      displayName: args.displayName,
      bio: args.bio,
      points: 100, // Welcome bonus
      level: 1,
      badges: ["newcomer"],
      joinedAt: Date.now(),
    });

    // Award welcome points
    await ctx.db.insert("pointTransactions", {
      userId: user._id,
      points: 100,
      action: "welcome",
      description: "Welcome to Vhiem! 🙏",
    });

    return profileId;
  },
});

export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const clerkUserId = await getAuthUserId(ctx);
    if (!clerkUserId) {
      return null;
    }

    // Get the user document first
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();

    if (!user) {
      return null;
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!profile) {
      return null;
    }

    // Get profile photo URL if it exists
    let profilePhotoUrl = null;
    if (profile.profilePhotoId) {
      profilePhotoUrl = await ctx.storage.getUrl(profile.profilePhotoId);
    }

    return {
      ...profile,
      profilePhotoUrl,
    };
  },
});

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db
      .query("userProfiles")
      .order("desc")
      .take(10);

    // Sort by points and add profile photos
    const sortedProfiles = profiles.sort((a, b) => b.points - a.points);
    
    const profilesWithPhotos = await Promise.all(
      sortedProfiles.map(async (profile) => {
        let profilePhotoUrl = null;
        if (profile.profilePhotoId) {
          profilePhotoUrl = await ctx.storage.getUrl(profile.profilePhotoId);
        }
        return {
          ...profile,
          profilePhotoUrl,
        };
      })
    );

    return profilesWithPhotos;
  },
});

export const awardPoints = mutation({
  args: {
    points: v.number(),
    action: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Update points
    const newPoints = profile.points + args.points;
    const newLevel = Math.floor(newPoints / 1000) + 1;

    await ctx.db.patch(profile._id, {
      points: newPoints,
      level: newLevel,
    });

    // Record transaction
    await ctx.db.insert("pointTransactions", {
      userId: userId,
      points: args.points,
      action: args.action,
      description: args.description,
    });

    return { newPoints, newLevel };
  },
});

export const followUser = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    if (currentUserId === args.userId) {
      throw new Error("Cannot follow yourself");
    }

    // Check if already following
    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("by_follower_following", (q) => 
        q.eq("followerId", currentUserId).eq("followingId", args.userId)
      )
      .unique();

    if (existingFollow) {
      return false; // Already following, return false instead of throwing
    }

    await ctx.db.insert("follows", {
      followerId: currentUserId,
      followingId: args.userId,
    });

    return true;
  },
});

export const unfollowUser = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("by_follower_following", (q) => 
        q.eq("followerId", currentUserId).eq("followingId", args.userId)
      )
      .unique();

    if (!existingFollow) {
      return false; // Not following, return false instead of throwing
    }

    await ctx.db.delete(existingFollow._id);
    return true;
  },
});

export const isFollowing = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      return false;
    }

    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("by_follower_following", (q) => 
        q.eq("followerId", currentUserId).eq("followingId", args.userId)
      )
      .unique();

    return !!existingFollow;
  },
});

export const getFollowCounts = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const followers = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.userId))
      .collect();

    const following = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .collect();

    return {
      followers: followers.length,
      following: following.length,
    };
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const clerkUserId = await getAuthUserId(ctx);
    let currentUser = null;
    if (clerkUserId) {
      currentUser = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
        .unique();
    }

    const profiles = await ctx.db
      .query("userProfiles")
      .order("desc")
      .take(50);

    const usersWithFollowStatus = await Promise.all(
      profiles.map(async (profile) => {
        let isFollowing = false;
        if (currentUser && currentUser._id !== profile.userId) {
          const followRecord = await ctx.db
            .query("follows")
            .withIndex("by_follower_following", (q) =>
              q.eq("followerId", currentUser._id).eq("followingId", profile.userId)
            )
            .unique();
          isFollowing = !!followRecord;
        }

        // Get profile photo URL if it exists
        let profilePhotoUrl = null;
        if (profile.profilePhotoId) {
          profilePhotoUrl = await ctx.storage.getUrl(profile.profilePhotoId);
        }

        return {
          ...profile,
          profilePhotoUrl,
          isFollowing,
          canFollow: currentUser && currentUser._id !== profile.userId,
        };
      })
    );

    return usersWithFollowStatus;
  },
});