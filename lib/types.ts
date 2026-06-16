// lib/types.ts
import { Id } from "@/convex/_generated/dataModel";

export interface Report {
  _id:        Id<"reports">;
  title:      string;
  topic:      string;
  reportType: string;
  format:     string;
  content:    string;
  createdAt:  number;
  wordCount?: number;
}

export interface PendingReport {
  title:      string;
  topic:      string;
  reportType: string;
  format:     string;
  content:    string;
}

export type ActiveReport = Report | PendingReport;

export function isSavedReport(r: ActiveReport): r is Report {
  return "_id" in r;
}