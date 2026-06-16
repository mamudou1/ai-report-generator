// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  reports: defineTable({
    title:      v.string(),
    topic:      v.string(),
    content:    v.string(),
    format:     v.string(),          // "pdf" | "docx"
    reportType: v.string(),
    createdAt:  v.number(),          // Unix ms
    wordCount:  v.optional(v.number()),
  }),
});
