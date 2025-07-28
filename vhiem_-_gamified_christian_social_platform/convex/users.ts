import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createProfile = mutation({
  args: {
    role: v.union(v.literal("shopper"), v.literal("business"), v.literal("delivery_driver")),
    displayName: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existingProfile) {
      throw new Error("Profile already exists");
    }

    const profileId = await ctx.db.insert("userProfiles", {
      userId,
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
      userId,
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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    return profile;
  },
});

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db
      .query("userProfiles")
      .order("desc")
      .take(10);

    // Sort by points
    return profiles.sort((a, b) => b.points - a.points);
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
      userId,
      points: args.points,
      action: args.action,
      description: args.description,
    });

    return { newPoints, newLevel };
  },
});
