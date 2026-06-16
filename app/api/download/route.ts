// app/api/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateDocx } from "@/lib/generateDocx";
import { generatePdf }  from "@/lib/generatePdf";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, format, reportType } = body as {
      title:      string;
      content:    string;
      format:     string;
      reportType: string;
    };

    if (!title || !content || !format) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const safeTitle = title.replace(/[^a-z0-9_\- ]/gi, "").replace(/\s+/g, "_");

    if (format === "docx") {
      const buffer = await generateDocx({ title, content, reportType });
      // ✅ Convert Buffer → Uint8Array (required by Next.js 15)
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type":        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${safeTitle}.docx"`,
        },
      });
    }

    const buffer = await generatePdf({ title, content, reportType });
    // ✅ Convert Buffer → Uint8Array (required by Next.js 15)
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `attachment; filename="${safeTitle}.pdf"`,
      },
    });

  } catch (err) {
    console.error("[/api/download]", err);
    return NextResponse.json({ error: "Failed to generate file" }, { status: 500 });
  }
}