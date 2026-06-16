// convex/reports.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Create ─────────────────────────────────────────────────────────────────
export const createReport = mutation({
  args: {
    title:      v.string(),
    topic:      v.string(),
    content:    v.string(),
    format:     v.string(),
    reportType: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("reports", {
      ...args,
      createdAt: Date.now(),
      wordCount: args.content.split(/\s+/).length,
    });
  },
});

// ── List all (newest first) ────────────────────────────────────────────────
export const listReports = query({
  handler: async (ctx) =>
    ctx.db.query("reports").order("desc").collect(),
});

// ── Get single ────────────────────────────────────────────────────────────
export const getReport = query({
  args: { id: v.id("reports") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

// ── Delete ─────────────────────────────────────────────────────────────────
export const deleteReport = mutation({
  args: { id: v.id("reports") },
  handler: async (ctx, args) => ctx.db.delete(args.id),
});
