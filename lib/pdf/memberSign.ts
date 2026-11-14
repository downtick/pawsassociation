import { PDFDocument, StandardFonts, type PDFPage } from "pdf-lib";
import QRCode from "qrcode";
import { COLOR, SITE_LINE, clean, wrap } from "./builder";

// "Proud PAWS member" booth sign: landscape letter, the member's business
// name, and a QR code to their own directory listing. Generated per member
// by /api/badge/sign. Wording stays factual (membership only): no
// "verified", "vetted" or standards claims.

function paw(page: PDFPage, cx: number, cy: number, s: number) {
  // Same five-ellipse mark as public/brand/paw.svg (24-unit box, y flipped).
  const pts: [number, number, number, number][] = [
    [12, 16.5, 5.2, 4.6], [5.2, 10.5, 2.1, 2.7], [9.3, 6.2, 2.1, 2.8], [14.7, 6.2, 2.1, 2.8], [18.8, 10.5, 2.1, 2.7],
  ];
  for (const [x, y, rx, ry] of pts) {
    page.drawEllipse({ x: cx + (x - 12) * s, y: cy - (y - 12) * s, xScale: rx * s, yScale: ry * s, color: COLOR.white });
  }
}

export async function buildMemberSign(opts: { businessName: string; listingUrl: string }): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle("PAWS Member Sign");
  pdf.setAuthor("PAWS — Professional Association of Wildlife & Sports");
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const [W, H] = [792, 612];
  const page = pdf.addPage([W, H]);

  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: COLOR.white });
  page.drawRectangle({ x: 24, y: 24, width: W - 48, height: H - 48, borderColor: COLOR.blue, borderWidth: 6 });
  page.drawRectangle({ x: 24, y: H - 84, width: W - 48, height: 60, color: COLOR.blue });
  page.drawRectangle({ x: 24, y: H - 90, width: W - 48, height: 6, color: COLOR.orange });
  const band = "PROUD MEMBER OF PAWS";
  page.drawText(band, { x: (W - bold.widthOfTextAtSize(band, 22)) / 2, y: H - 63, size: 22, font: bold, color: COLOR.white });

  // Paw medallion
  const cy = H - 160;
  page.drawCircle({ x: W / 2, y: cy, size: 44, color: COLOR.blue });
  paw(page, W / 2, cy + 2, 2.6);

  // Business name: up to two lines, largest size that fits
  const name = clean(opts.businessName);
  const maxW = W - 140;
  let size = 64;
  let lines = wrap(name, bold, size, maxW);
  while ((lines.length > 2 || lines.some((l) => bold.widthOfTextAtSize(l, size) > maxW)) && size > 28) {
    size -= 4;
    lines = wrap(name, bold, size, maxW);
  }
  let y = cy - 80 - size * 0.4;
  for (const l of lines) {
    page.drawText(l, { x: (W - bold.widthOfTextAtSize(l, size)) / 2, y, size, font: bold, color: COLOR.ink });
    y -= size * 1.08;
  }
  const sub = "is a member of the Professional Association of Wildlife & Sports";
  for (const l of wrap(sub, font, 20, maxW)) {
    page.drawText(l, { x: (W - font.widthOfTextAtSize(l, 20)) / 2, y: y - 6, size: 20, font, color: COLOR.ink2 });
    y -= 26;
  }

  // QR → the member's own listing (UTM-tagged so GA4 credits the sign)
  const qrPng = await QRCode.toBuffer(opts.listingUrl, { errorCorrectionLevel: "M", margin: 1, width: 600 });
  const qrImg = await pdf.embedPng(qrPng);
  const qr = 120;
  const qrX = W - 48 - qr - 16;
  const qrY = 48;
  page.drawImage(qrImg, { x: qrX, y: qrY, width: qr, height: qr });
  const capRight = qrX - 16;
  const cap1 = "Scan to see our PAWS listing";
  const cap2 = "and request a date for your event";
  page.drawText(cap1, { x: capRight - bold.widthOfTextAtSize(cap1, 16), y: qrY + 70, size: 16, font: bold, color: COLOR.blue });
  page.drawText(cap2, { x: capRight - font.widthOfTextAtSize(cap2, 14), y: qrY + 48, size: 14, font, color: COLOR.ink2 });
  page.drawText(SITE_LINE, { x: 64, y: qrY + 6, size: 11, font, color: COLOR.muted });

  return pdf.save();
}
