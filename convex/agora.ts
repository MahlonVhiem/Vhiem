import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// This function generates Agora tokens for secure authentication
// Only implement this if your Agora App Builder requires server-side token generation
export const generateAgoraToken = mutation({
  args: {
    channelName: v.string(),
    uid: v.optional(v.string()),
    role: v.optional(v.string()), // "publisher" or "subscriber"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get user profile for additional context
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) {
      throw new Error("User profile not found");
    }

    // TODO: Implement actual Agora token generation here
    // This is a placeholder - you'll need to implement the actual token generation
    // using Agora's server-side SDK or their token generation algorithm
    
    // For now, return a mock response structure
    // Replace this with actual Agora token generation logic
    const mockToken = {
      token: "mock-token-" + Date.now(),
      appId: process.env.AGORA_APP_ID || "your-agora-app-id",
      channelName: args.channelName,
      uid: args.uid || profile.userId,
      role: args.role || "publisher",
      expireTime: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    };

    // Log the token generation for debugging
    console.log("Generated Agora token for user:", profile.displayName, "Channel:", args.channelName);

    return mockToken;
  },
});

// Get available voice chat rooms
export const getVoiceChatRooms = query({
  args: {},
  handler: async (ctx) => {
    // This could be extended to store room information in your database
    // For now, return some default rooms
    return [
      {
        id: "community-main",
        name: "Main Community Room",
        description: "General discussion for all community members",
        participants: 0,
        maxParticipants: 50,
        isActive: true,
      },
      {
        id: "prayer-room",
        name: "Prayer Room",
        description: "Join for prayer requests and group prayers",
        participants: 0,
        maxParticipants: 20,
        isActive: true,
      },
      {
        id: "bible-study",
        name: "Bible Study",
        description: "Weekly Bible study discussions",
        participants: 0,
        maxParticipants: 30,
        isActive: true,
      },
    ];
  },
});

// Create a new voice chat room
export const createVoiceChatRoom = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    maxParticipants: v.optional(v.number()),
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
      throw new Error("User profile not found");
    }

    // Generate a unique room ID
    const roomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // TODO: Store room information in database if needed
    // For now, just return the room configuration
    const newRoom = {
      id: roomId,
      name: args.name,
      description: args.description || "",
      createdBy: profile.displayName,
      createdAt: Date.now(),
      maxParticipants: args.maxParticipants || 20,
      participants: 0,
      isActive: true,
    };

    console.log("Created new voice chat room:", newRoom.name, "by", profile.displayName);

    return newRoom;
  },
});