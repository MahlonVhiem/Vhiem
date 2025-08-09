import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
// import * as AgoraToken from "agora-token"; // Remove this line

const CREATE_ROOM_COST = 100;
const JOIN_ROOM_COST = 50;
const HOST_JOIN_REWARD = 25;
const MAX_HOSTS = 7;

// --- Queries ---

/**
 * Gets all active voice chat rooms.
 * Returns a list of rooms with their details, including participant count.
 */
export const getVoiceChatRooms = query({
  args: {},
  handler: async (ctx) => {
    const rooms = await ctx.db
      .query("voiceChatRooms")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    return Promise.all(
      rooms.map(async (room) => {
        const creatorProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", room.creatorId))
          .unique();
        
        return {
          ...room,
          creatorName: creatorProfile?.displayName ?? "Unknown",
          participantCount: room.participants.length,
        };
      })
    );
  },
});

// --- Mutations ---

/**
 * Creates a new voice chat room.
 * Costs the creator 100 points.
 */
export const createVoiceChatRoom = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    listenerLimit: v.union(v.literal(5), v.literal(10), v.literal("unlimited")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("User profile not found");
    if (profile.points < CREATE_ROOM_COST) {
      throw new Error(`You need ${CREATE_ROOM_COST} points to create a room.`);
    }

    // Deduct points for creating the room
    await ctx.db.patch(profile._id, { points: profile.points - CREATE_ROOM_COST });

    const roomId = await ctx.db.insert("voiceChatRooms", {
      creatorId: userId,
      hosts: [userId],
      name: args.name,
      description: args.description,
      listenerLimit: args.listenerLimit,
      participants: [userId], // Creator starts in the room
      status: "active",
    });

    return roomId;
  },
});

/**
 * Allows a user to join a voice chat room.
 * Costs the user 50 points, with 25 going to the host.
 */
export const joinVoiceChatRoom = mutation({
    args: { roomId: v.id("voiceChatRooms") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const room = await ctx.db.get(args.roomId);
        if (!room) throw new Error("Room not found");
        if (room.status !== "active") throw new Error("Room is not active");

        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();
        
        if (!profile) throw new Error("User profile not found");

        // If user is already a participant, do nothing
        if (room.participants.includes(userId)) {
            return;
        }

        if (profile.points < JOIN_ROOM_COST) {
            throw new Error(`You need ${JOIN_ROOM_COST} points to join.`);
        }

        // Deduct points from joiner
        await ctx.db.patch(profile._id, { points: profile.points - JOIN_ROOM_COST });

        // Reward the host
        const hostProfile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", room.creatorId))
            .unique();
        
        if (hostProfile) {
            await ctx.db.patch(hostProfile._id, { points: hostProfile.points + HOST_JOIN_REWARD });
        }

        // Add user to participants list
        await ctx.db.patch(room._id, {
            participants: [...room.participants, userId],
        });
    },
});

/**
 * Promotes a listener to a co-host.
 * Only the main host can do this.
 */
export const promoteToCoHost = mutation({
  args: {
    roomId: v.id("voiceChatRooms"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId) throw new Error("Not authenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    // Only the original creator can promote
    if (room.creatorId !== callerId) {
      throw new Error("Only the main host can promote co-hosts.");
    }

    if (room.hosts.length >= MAX_HOSTS) {
      throw new Error("Maximum number of hosts reached.");
    }

    if (!room.hosts.includes(args.userId)) {
      await ctx.db.patch(room._id, { hosts: [...room.hosts, args.userId] });
    }
  },
});

/**
 * Generates a secure Agora token for a user to join a specific channel.
 */
export const generateAgoraToken = mutation({
  args: {
    roomId: v.id("voiceChatRooms"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    // Ensure the user is a participant before generating a token
    if (!room.participants.includes(userId)) {
        throw new Error("You must join the room before getting a token.");
    }

    const channelName = room._id; // Use Convex room ID as the Agora channel name
    const uid = userId; // Use Convex user ID string as the Agora account
    const role = room.hosts.includes(userId) ? "publisher" : "audience"; // "publisher" or "audience"
    const expireTime = 3600; // 1 hour in seconds

    try {
      // Change the fetch URL to the Netlify Function endpoint
      const response = await fetch("/api/generate-agora-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelName,
          uid,
          role,
          expireTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to get Agora token: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Error fetching Agora token:", error);
      throw new Error("Failed to generate Agora token. Please try again later.");
    }
  },
});
