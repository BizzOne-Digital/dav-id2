import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export type CompletionCertificateInput = {
  teamName: string;
  huntTitle: string;
  completionNumber: string;
  completedAt: Date;
  playerCount?: number;
};

const GOLD = rgb(0.949, 0.714, 0.196);
const CHARCOAL = rgb(0.063, 0.071, 0.086);
const CREAM = rgb(0.965, 0.91, 0.796);

/**
 * Generates a printable completion certificate PDF (for email download or admin use).
 */
export async function generateCompletionCertificate(
  input: CompletionCertificateInput
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();

  page.drawRectangle({
    x: 36,
    y: 36,
    width: width - 72,
    height: height - 72,
    borderColor: GOLD,
    borderWidth: 3,
    color: CHARCOAL,
  });

  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const scriptFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  page.drawText("NASHVILLE SCAVENGER HUNT", {
    x: 72,
    y: height - 120,
    size: 14,
    font: bodyFont,
    color: GOLD,
  });

  page.drawText("Certificate of Completion", {
    x: 72,
    y: height - 160,
    size: 28,
    font: titleFont,
    color: CREAM,
  });

  page.drawText("This certifies that", {
    x: 72,
    y: height - 220,
    size: 14,
    font: bodyFont,
    color: CREAM,
  });

  page.drawText(input.teamName, {
    x: 72,
    y: height - 260,
    size: 32,
    font: scriptFont,
    color: GOLD,
  });

  const huntLine = `completed the ${input.huntTitle} adventure`;
  page.drawText(huntLine, {
    x: 72,
    y: height - 310,
    size: 14,
    font: bodyFont,
    color: CREAM,
  });

  const dateStr = input.completedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  page.drawText(`Music City · ${dateStr}`, {
    x: 72,
    y: height - 350,
    size: 12,
    font: bodyFont,
    color: CREAM,
  });

  if (input.playerCount) {
    page.drawText(`${input.playerCount} players`, {
      x: 72,
      y: height - 375,
      size: 11,
      font: bodyFont,
      color: CREAM,
    });
  }

  page.drawText(`Completion #${input.completionNumber}`, {
    x: 72,
    y: 80,
    size: 10,
    font: bodyFont,
    color: GOLD,
  });

  return pdfDoc.save();
}
