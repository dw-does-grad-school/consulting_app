import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
    args: {
        user: v.string(), 
        body: v.string(),
        messageType: v.optional(v.union(v.literal("user"), v.literal("agent")))
    }, 
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", {
            user: args.user, 
            body: args.body, 
            timestamp: new Date(),
            messageType: args.messageType || "user"
        });
    } 
});

export const getMessages = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("messages")
            .order("desc")
            .take(50);
    }
});

export const sendAgentResponse = mutation({
    args: {
        body: v.string(),
        inResponseTo: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        // Simulate agent processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await ctx.db.insert("messages", {
            user: "Business Consultant Agent",
            body: args.body,
            timestamp: new Date(),
            messageType: "agent"
        });
    }
});