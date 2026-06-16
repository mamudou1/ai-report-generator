// lib/generateDocx.ts
import {
  Document, Packer, Paragraph, TextRun,
  HeadingLevel, AlignmentType, BorderStyle,
} from "docx";
import { companyConfig } from "./config";

export interface DocxInput {
  title:      string;
  content:    string;
  reportType: string;
}

// ── Markdown → docx Paragraphs ─────────────────────────────────────────────
function parseToParagraphs(md: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const { primary, muted, text } = companyConfig.colors;

  for (const line of md.split("\n")) {
    if (line.startsWith("## ")) {
      paragraphs.push(new Paragraph({
        text:    line.slice(3),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 480, after: 160 },
        border:  { bottom: { color: primary, style: BorderStyle.SINGLE, size: 4 } },
      }));
    } else if (line.startsWith("### ")) {
      paragraphs.push(new Paragraph({
        text:    line.slice(4),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 320, after: 120 },
      }));
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      paragraphs.push(new Paragraph({
        text:   line.slice(2),
        bullet: { level: 0 },
        spacing: { after: 80 },
      }));
    } else if (line.trim() === "") {
      paragraphs.push(new Paragraph({ text: "" }));
    } else {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: line, size: 22, font: "Calibri", color: text })],
        spacing:  { after: 160 },
      }));
    }
  }
  return paragraphs;
}

// ── Main export ────────────────────────────────────────────────────────────
export async function generateDocx({ title, content, reportType }: DocxInput): Promise<Buffer> {
  const { name, address, email, phone } = companyConfig;
  const { primary, muted, subtle } = companyConfig.colors;

  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 22 } },
        heading2: { run: { color: primary, bold: true, size: 28, font: "Calibri" } },
        heading3: { run: { color: "1d4ed8", bold: true, size: 24, font: "Calibri" } },
      },
    },
    sections: [{
      properties: {
        page: { margin: { top: 1440, right: 1260, bottom: 1440, left: 1260 } },
      },
      children: [
        // ── Company name ──
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({ text: name, bold: true, size: 40, color: primary, font: "Calibri" })],
        }),
        // ── Address ──
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: address, size: 18, color: muted, font: "Calibri" })],
        }),
        // ── Contact ──
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [new TextRun({ text: `${email}  |  ${phone}`, size: 18, color: muted, font: "Calibri" })],
        }),
        // ── Divider ──
        new Paragraph({
          border: { bottom: { color: primary, style: BorderStyle.SINGLE, size: 12 } },
          spacing: { after: 480 },
        }),
        // ── Report title ──
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 160 },
          children: [new TextRun({ text: title, bold: true, size: 52, color: primary, font: "Calibri" })],
        }),
        // ── Report type & date ──
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 720 },
          children: [
            new TextRun({ text: `${reportType}  ·  ${dateStr}`, size: 20, color: muted, italics: true, font: "Calibri" }),
          ],
        }),
        // ── Body content ──
        ...parseToParagraphs(content),
        // ── Footer divider ──
        new Paragraph({
          border: { top: { color: primary, style: BorderStyle.SINGLE, size: 4 } },
          spacing: { before: 720, after: 160 },
        }),
        // ── Footer text ──
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `${name}  |  Confidential  |  Generated on ${dateStr}`,
              size: 16, color: subtle, font: "Calibri",
            }),
          ],
        }),
      ],
    }],
  });

  return Packer.toBuffer(doc);
}
