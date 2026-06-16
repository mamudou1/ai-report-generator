// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateReportContent } from "@/lib/anthropic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, topic, reportType } = body as {
      title:      string;
      topic:      string;
      reportType: string;
    };

    if (!title || !topic || !reportType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const content = await generateReportContent({ title, topic, reportType });
    return NextResponse.json({ content });

  } catch (err) {
    console.error("[/api/generate]", err);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
