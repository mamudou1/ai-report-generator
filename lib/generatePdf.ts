// lib/generatePdf.ts
import PDFDocument from "pdfkit";
import { companyConfig } from "./config";

export interface PdfInput {
  title:      string;
  content:    string;
  reportType: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function hex(h: string) { return `#${h}`; }

// ── Main export ────────────────────────────────────────────────────────────
export async function generatePdf({ title, content, reportType }: PdfInput): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const { name, address, email, phone } = companyConfig;
    const { primary, muted, subtle, text } = companyConfig.colors;

    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

    const doc = new PDFDocument({
      size:    "A4",
      margins: { top: 72, bottom: 72, left: 72, right: 72 },
      info:    { Title: title, Author: name },
    });

    const chunks: Buffer[] = [];
    doc.on("data",  (c) => chunks.push(c));
    doc.on("end",   ()  => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const W = doc.page.width - 144; // usable width

    // ── Company header ─────────────────────────────────────────────────────
    doc.fontSize(22).fillColor(hex(primary)).font("Helvetica-Bold")
       .text(name, { align: "center" });

    doc.moveDown(0.4)
       .fontSize(9).fillColor(hex(muted)).font("Helvetica")
       .text(address, { align: "center" });

    doc.moveDown(0.2)
       .text(`${email}  ·  ${phone}`, { align: "center" });

    // ── Header divider ─────────────────────────────────────────────────────
    doc.moveDown(1);
    const lineY = doc.y;
    doc.save()
       .strokeColor(hex(primary)).lineWidth(2.5)
       .moveTo(72, lineY).lineTo(doc.page.width - 72, lineY)
       .stroke()
       .restore();

    doc.moveDown(1.8);

    // ── Report title ───────────────────────────────────────────────────────
    doc.fontSize(26).fillColor(hex(primary)).font("Helvetica-Bold")
       .text(title, { align: "center" });

    doc.moveDown(0.5)
       .fontSize(10).fillColor(hex(muted)).font("Helvetica-Oblique")
       .text(`${reportType}  ·  ${dateStr}`, { align: "center" });

    doc.moveDown(2);

    // ── Body: parse markdown ───────────────────────────────────────────────
    for (const line of content.split("\n")) {
      if (line.startsWith("## ")) {
        doc.moveDown(0.8);
        // Section heading with underline accent
        doc.fontSize(13).fillColor(hex(primary)).font("Helvetica-Bold")
           .text(line.slice(3));
        const hY = doc.y + 2;
        doc.save().strokeColor(hex(primary)).lineWidth(0.8)
           .moveTo(72, hY).lineTo(doc.page.width - 72, hY)
           .stroke().restore();
        doc.moveDown(0.5);
        doc.fontSize(10.5).fillColor(hex(text)).font("Helvetica");

      } else if (line.startsWith("### ")) {
        doc.moveDown(0.5)
           .fontSize(11.5).fillColor("#1d4ed8").font("Helvetica-Bold")
           .text(line.slice(4));
        doc.moveDown(0.3);
        doc.fontSize(10.5).fillColor(hex(text)).font("Helvetica");

      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        doc.fontSize(10.5).fillColor(hex(text)).font("Helvetica")
           .text(`•  ${line.slice(2)}`, { indent: 12, lineGap: 2 });
        doc.moveDown(0.2);

      } else if (line.trim() === "") {
        doc.moveDown(0.4);

      } else {
        doc.fontSize(10.5).fillColor(hex(text)).font("Helvetica")
           .text(line, { lineGap: 3, width: W });
        doc.moveDown(0.3);
      }
    }

    // ── Footer ─────────────────────────────────────────────────────────────
    const footerTop = doc.page.height - 60;
    doc.save()
       .strokeColor(hex(primary)).lineWidth(1)
       .moveTo(72, footerTop).lineTo(doc.page.width - 72, footerTop)
       .stroke()
       .restore();

    doc.fontSize(8).fillColor(hex(subtle)).font("Helvetica")
       .text(
         `${name}  |  Confidential  |  Generated on ${dateStr}`,
         72, footerTop + 8,
         { align: "center", width: W },
       );

    doc.end();
  });
}
