// lib/anthropic.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface GenerateReportInput {
  title:      string;
  topic:      string;
  reportType: string;
}

export async function generateReportContent(input: GenerateReportInput): Promise<string> {
  const { title, topic, reportType } = input;

  const systemPrompt = `You are a senior business analyst who writes clear, structured, and professional reports.
Always use Markdown formatting:
- Use ## for main section headings
- Use ### for sub-headings
- Use bullet lists where appropriate
- Write concisely but comprehensively
- Do NOT include a top-level title (the system adds it separately)`;

  const userPrompt = `Write a complete and professional ${reportType} titled "${title}".

Topic / Brief: ${topic}

Structure the report with these sections:
1. ## Executive Summary
2. ## Introduction
3. ## Background & Context
4. ## Key Findings / Analysis
5. ## Recommendations
6. ## Conclusion

Be specific, data-aware, and authoritative. Each section should be substantive (at least 2–4 sentences or a well-formed list).`;

  const message = await client.messages.create({
    model:      "claude-sonnet-4-6",
    max_tokens: 2000,
    system:     systemPrompt,
    messages:   [{ role: "user", content: userPrompt }],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type from Claude");
  return block.text;
}
