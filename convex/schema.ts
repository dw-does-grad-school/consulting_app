import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    user: v.string(),
    body: v.string(),
    timestamp: v.any(),
    isAgent: v.optional(v.boolean()),
    messageType: v.optional(v.union(v.literal("user"), v.literal("agent"))),
  }),
});