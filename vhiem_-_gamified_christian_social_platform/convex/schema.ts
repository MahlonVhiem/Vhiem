import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  userProfiles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("shopper"), v.literal("business"), v.literal("delivery_driver")),
    displayName: v.string(),
    bio: v.optional(v.string()),
    points: v.number(),
    level: v.number(),
    badges: v.array(v.string()),
    joinedAt: v.number(),
  }).index("by_user", ["userId"]),

  posts: defineTable({
    authorId: v.id("users"),
    content: v.string(),
    type: v.union(v.literal("verse"), v.literal("prayer"), v.literal("testimony"), v.literal("general")),
    likes: v.number(),
    comments: v.number(),
    shares: v.number(),
    tags: v.array(v.string()),
  }).index("by_author", ["authorId"]),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.id("users"),
    content: v.string(),
    likes: v.number(),
  }).index("by_post", ["postId"]),

  likes: defineTable({
    userId: v.id("users"),
    postId: v.optional(v.id("posts")),
    commentId: v.optional(v.id("comments")),
    type: v.union(v.literal("post"), v.literal("comment")),
  }).index("by_user_post", ["userId", "postId"])
    .index("by_user_comment", ["userId", "commentId"]),

  pointTransactions: defineTable({
    userId: v.id("users"),
    points: v.number(),
    action: v.string(),
    description: v.string(),
  }).index("by_user", ["userId"]),

  businesses: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    description: v.string(),
    category: v.string(),
    location: v.optional(v.string()),
    verified: v.boolean(),
  }).index("by_owner", ["ownerId"]),

  deliveryRequests: defineTable({
    businessId: v.id("businesses"),
    driverId: v.optional(v.id("users")),
    shopperId: v.id("users"),
    description: v.string(),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("completed"), v.literal("cancelled")),
    points: v.number(),
  }).index("by_business", ["businessId"])
    .index("by_driver", ["driverId"])
    .index("by_shopper", ["shopperId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
