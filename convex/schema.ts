import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  userProfiles: defineTable({
    userId: v.string(),
    role: v.union(v.literal("shopper"), v.literal("business"), v.literal("delivery_driver")),
    displayName: v.string(),
    bio: v.optional(v.string()),
    points: v.number(),
    level: v.number(),
    badges: v.array(v.string()),
    joinedAt: v.number(),
    profilePhotoId: v.optional(v.id("_storage")),
    // Common fields
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    // Business specific fields
    businessName: v.optional(v.string()),
    businessCategory: v.optional(v.string()),
    businessHours: v.optional(v.string()),
    businessServices: v.optional(v.array(v.string())),
    // Delivery driver specific fields
    vehicleType: v.optional(v.string()),
    deliveryRadius: v.optional(v.number()),
    availability: v.optional(v.string()),
    // Shopper specific fields
    interests: v.optional(v.array(v.string())),
    favoriteVerses: v.optional(v.array(v.string())),
  }).index("by_user", ["userId"]),

  posts: defineTable({
    authorId: v.string(),
    content: v.string(),
    type: v.union(v.literal("verse"), v.literal("prayer"), v.literal("testimony"), v.literal("general")),
    likes: v.number(),
    comments: v.number(),
    shares: v.number(),
    tags: v.array(v.string()),
    photoId: v.optional(v.id("_storage")),
  }).index("by_author", ["authorId"]),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.string(),
    content: v.string(),
    likes: v.number(),
    mentionedUsers: v.optional(v.array(v.string())),
  }).index("by_post", ["postId"]),

  commentReplies: defineTable({
    commentId: v.id("comments"),
    authorId: v.string(),
    content: v.string(),
    mentionedUsers: v.optional(v.array(v.string())),
  }).index("by_comment", ["commentId"]),

  likes: defineTable({
    userId: v.string(),
    postId: v.optional(v.id("posts")),
    commentId: v.optional(v.id("comments")),
    type: v.union(v.literal("post"), v.literal("comment")),
  }).index("by_user_post", ["userId", "postId"])
    .index("by_user_comment", ["userId", "commentId"]),

  pointTransactions: defineTable({
    userId: v.string(),
    points: v.number(),
    action: v.string(),
    description: v.string(),
  }).index("by_user", ["userId"]),

  businesses: defineTable({
    ownerId: v.string(),
    name: v.string(),
    description: v.string(),
    category: v.string(),
    location: v.optional(v.string()),
    verified: v.boolean(),
  }).index("by_owner", ["ownerId"]),

  deliveryRequests: defineTable({
    businessId: v.id("businesses"),
    driverId: v.optional(v.string()),
    shopperId: v.string(),
    description: v.string(),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("completed"), v.literal("cancelled")),
    points: v.number(),
  }).index("by_business", ["businessId"])
    .index("by_driver", ["driverId"])
    .index("by_shopper", ["shopperId"]),

  follows: defineTable({
    followerId: v.string(),
    followingId: v.string(),
  }).index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_follower_following", ["followerId", "followingId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});