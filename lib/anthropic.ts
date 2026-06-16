// lib/anthropic.ts  (now uses Eden AI)

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

Be specific, data-aware, and authoritative.`;

  // ── Eden AI unified chat endpoint ────────────────────────────────────────
  const response = await fetch("https://api.edenai.run/v2/text/chat", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${process.env.EDENAI_API_KEY}`,
    },
    body: JSON.stringify({
      providers:   `anthropic/${process.env.EDENAI_MODEL ?? "claude-haiku-4-5"}`,
      text:        userPrompt,
      chatbot_global_action: systemPrompt,   // Eden AI's system prompt field
      previous_history:      [],             // no prior turns
      temperature:           0.7,
      max_tokens:            2000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Eden AI error ${response.status}: ${err}`);
  }

  const data = await response.json();

  // ── Parse Eden AI response structure ─────────────────────────────────────
  // Shape: { "anthropic/claude-haiku-4-5": { generated_text: "..." } }
  const providerKey = Object.keys(data).find((k) => k.startsWith("anthropic"));
  if (!providerKey || !data[providerKey]?.generated_text) {
    throw new Error("Unexpected Eden AI response shape");
  }

  return data[providerKey].generated_text as string;
}