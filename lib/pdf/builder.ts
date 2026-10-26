import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import { JOIN_QR_PNG_BASE64 } from "./joinQr";

// Small layout engine for the member downloads. Every page gets the PAWS
// header band and a footer carrying pawsassociation.com plus the member's
// "Prepared for" stamp. Standard fonts only (WinAnsi), so text passes
// through clean() first.

export const COLOR = {
  blue: rgb(0x25 / 255, 0x63 / 255, 0xeb / 255),
  blueDeep: rgb(0x1d / 255, 0x4e / 255, 0xd8 / 255),
  orange: rgb(0xf9 / 255, 0x73 / 255, 0x16 / 255),
  ink: rgb(0x0f / 255, 0x17 / 255, 0x2a / 255),
  ink2: rgb(0x33 / 255, 0x41 / 255, 0x55 / 255),
  muted: rgb(0x64 / 255, 0x74 / 255, 0x8b / 255),
  rule: rgb(0xcb / 255, 0xd5 / 255, 0xe1 / 255),
  wash: rgb(0xef / 255, 0xf6 / 255, 0xff / 255),
  white: rgb(1, 1, 1),
};

export const SITE_LINE = "pawsassociation.com";

const LETTER: [number, number] = [612, 792];

export function clean(s: string): string {
  return s
    .replace(/[→←]/g, "-")
    .replace(/✓/g, "x")
    .replace(/ /g, " ")
    .replace(/[^\x00-\x7f -ÿ–—‘’“”•…]/g, "");
}

export function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = clean(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) <= maxWidth || !line) {
      line = test;
    } else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

export interface DocOptions {
  landscape?: boolean;
  preparedFor?: string;
}

export class PawsDoc {
  pdf!: PDFDocument;
  font!: PDFFont;
  bold!: PDFFont;
  joinQr!: PDFImage;
  page!: PDFPage;
  y = 0;
  readonly margin = 48;
  readonly bottom = 64;
  private size: [number, number] = LETTER;
  private preparedFor?: string;
  private docTitle = "";

  static async create(docTitle: string, opts: DocOptions = {}): Promise<PawsDoc> {
    const d = new PawsDoc();
    d.pdf = await PDFDocument.create();
    d.pdf.setTitle(clean(docTitle));
    d.pdf.setAuthor("PAWS — Professional Association of Wildlife & Sports");
    d.pdf.setSubject(`Member resource — ${SITE_LINE}`);
    d.font = await d.pdf.embedFont(StandardFonts.Helvetica);
    d.bold = await d.pdf.embedFont(StandardFonts.HelveticaBold);
    d.joinQr = await d.pdf.embedPng(Buffer.from(JOIN_QR_PNG_BASE64, "base64"));
    d.size = opts.landscape ? [LETTER[1], LETTER[0]] : LETTER;
    d.preparedFor = opts.preparedFor;
    d.docTitle = docTitle;
    d.newPage();
    return d;
  }

  get width() { return this.size[0]; }
  get height() { return this.size[1]; }
  get contentWidth() { return this.width - this.margin * 2; }

  newPage() {
    this.page = this.pdf.addPage(this.size);
    const { width, height } = this;
    // Header band
    this.page.drawRectangle({ x: 0, y: height - 44, width, height: 44, color: COLOR.blue });
    this.page.drawRectangle({ x: 0, y: height - 47, width, height: 3, color: COLOR.orange });
    this.page.drawText("PAWS", { x: this.margin, y: height - 29, size: 15, font: this.bold, color: COLOR.white });
    this.page.drawText("Professional Association of Wildlife & Sports", {
      x: this.margin + 50, y: height - 27, size: 8.5, font: this.font, color: rgb(0.86, 0.92, 1),
    });
    const tag = "Member resource";
    this.page.drawText(tag, {
      x: width - this.margin - this.font.widthOfTextAtSize(tag, 8.5), y: height - 27,
      size: 8.5, font: this.font, color: rgb(0.86, 0.92, 1),
    });
    // Footer: site line left; "Join the Association" QR bottom-right (to
    // /go/pdf), with the prepared-for stamp and a scan caption beside it.
    // Everything stays below `bottom`, so body content never overlaps it.
    const qr = 46;
    const qrX = width - this.margin - qr;
    const textRight = qrX - 8;
    this.page.drawLine({ start: { x: this.margin, y: 44 }, end: { x: textRight, y: 44 }, thickness: 0.6, color: COLOR.rule });
    this.page.drawText(SITE_LINE, { x: this.margin, y: 30, size: 9, font: this.bold, color: COLOR.blue });
    this.page.drawImage(this.joinQr, { x: qrX, y: 8, width: qr, height: qr });
    const right = clean(this.preparedFor ? `Prepared for ${this.preparedFor}` : this.docTitle);
    this.page.drawText(right, {
      x: textRight - this.font.widthOfTextAtSize(right, 8.5), y: 30, size: 8.5, font: this.font, color: COLOR.muted,
    });
    const scan = "Join the Association - scan to visit pawsassociation.com";
    this.page.drawText(scan, {
      x: textRight - this.bold.widthOfTextAtSize(scan, 7.5), y: 17, size: 7.5, font: this.bold, color: COLOR.orange,
    });
    this.y = height - 76;
  }

  ensure(space: number) {
    if (this.y - space < this.bottom) this.newPage();
  }

  title(text: string, subtitle?: string) {
    this.ensure(60);
    this.page.drawText(clean(text), { x: this.margin, y: this.y - 20, size: 22, font: this.bold, color: COLOR.ink });
    this.y -= 30;
    if (subtitle) {
      for (const line of wrap(subtitle, this.font, 10.5, this.contentWidth)) {
        this.page.drawText(line, { x: this.margin, y: this.y - 12, size: 10.5, font: this.font, color: COLOR.ink2 });
        this.y -= 15;
      }
    }
    this.y -= 10;
  }

  h2(text: string) {
    this.ensure(46);
    this.y -= 8;
    this.page.drawText(clean(text).toUpperCase(), { x: this.margin, y: this.y - 11, size: 10, font: this.bold, color: COLOR.blue });
    this.page.drawLine({ start: { x: this.margin, y: this.y - 16 }, end: { x: this.width - this.margin, y: this.y - 16 }, thickness: 1, color: COLOR.blue });
    this.y -= 26;
  }

  para(text: string, size = 10, color = COLOR.ink2) {
    for (const line of wrap(text, this.font, size, this.contentWidth)) {
      this.ensure(size + 6);
      this.page.drawText(line, { x: this.margin, y: this.y - size, size, font: this.font, color });
      this.y -= size + 4;
    }
    this.y -= 6;
  }

  /** Label + fill-in line. cols=2 lays fields side by side. */
  fields(labels: string[], cols: 1 | 2 = 1) {
    const gap = 18;
    const colW = (this.contentWidth - gap * (cols - 1)) / cols;
    for (let i = 0; i < labels.length; i += cols) {
      this.ensure(30);
      for (let c = 0; c < cols && i + c < labels.length; c++) {
        const x = this.margin + c * (colW + gap);
        this.page.drawText(clean(labels[i + c]), { x, y: this.y - 9, size: 8.5, font: this.bold, color: COLOR.muted });
        this.page.drawLine({ start: { x, y: this.y - 26 }, end: { x: x + colW, y: this.y - 26 }, thickness: 0.7, color: COLOR.rule });
      }
      this.y -= 34;
    }
  }

  /** Label followed by a row of checkbox options. */
  options(label: string, opts: string[]) {
    this.ensure(30);
    this.page.drawText(clean(label), { x: this.margin, y: this.y - 9, size: 8.5, font: this.bold, color: COLOR.muted });
    let x = this.margin;
    let y = this.y - 26;
    for (const o of opts) {
      const w = this.font.widthOfTextAtSize(clean(o), 9.5) + 28;
      if (x + w > this.width - this.margin) { x = this.margin; y -= 16; }
      this.page.drawRectangle({ x, y: y - 1, width: 9, height: 9, borderColor: COLOR.ink2, borderWidth: 0.8 });
      this.page.drawText(clean(o), { x: x + 14, y, size: 9.5, font: this.font, color: COLOR.ink });
      x += w;
    }
    this.y = y - 14;
  }

  checklist(items: string[]) {
    for (const item of items) {
      const lines = wrap(item, this.font, 10, this.contentWidth - 20);
      this.ensure(lines.length * 14 + 6);
      this.page.drawRectangle({ x: this.margin, y: this.y - 10, width: 10, height: 10, borderColor: COLOR.ink2, borderWidth: 0.9 });
      lines.forEach((line, i) => {
        this.page.drawText(line, { x: this.margin + 18, y: this.y - 9 - i * 13, size: 10, font: this.font, color: COLOR.ink });
      });
      this.y -= lines.length * 13 + 7;
    }
    this.y -= 4;
  }

  /** Blank writing lines for notes. */
  lines(count: number, label = "Notes") {
    this.ensure(24);
    this.page.drawText(clean(label), { x: this.margin, y: this.y - 9, size: 8.5, font: this.bold, color: COLOR.muted });
    this.y -= 14;
    for (let i = 0; i < count; i++) {
      this.ensure(22);
      this.page.drawLine({ start: { x: this.margin, y: this.y - 16 }, end: { x: this.width - this.margin, y: this.y - 16 }, thickness: 0.6, color: COLOR.rule });
      this.y -= 22;
    }
    this.y -= 4;
  }

  /**
   * Grid table. `widths` are fractions summing to 1. `rows` is either filled
   * content (wrapped per cell) or a count of blank writing rows.
   */
  table(headers: string[], widths: number[], rows: string[][] | number, minRowHeight = 24) {
    const total = this.contentWidth;
    const colX: number[] = [];
    let acc = this.margin;
    for (const w of widths) { colX.push(acc); acc += w * total; }
    const colW = widths.map((w) => w * total);
    const pad = 5;

    const drawHeader = () => {
      const hh = 20;
      this.ensure(hh + minRowHeight);
      this.page.drawRectangle({ x: this.margin, y: this.y - hh, width: total, height: hh, color: COLOR.wash });
      headers.forEach((h, i) => {
        const t = wrap(h, this.bold, 8, colW[i] - pad * 2)[0];
        this.page.drawText(t, { x: colX[i] + pad, y: this.y - 13, size: 8, font: this.bold, color: COLOR.blueDeep });
      });
      this.drawRowBorders(colX, colW, this.y, hh);
      this.y -= hh;
    };

    drawHeader();
    const data: string[][] = typeof rows === "number"
      ? Array.from({ length: rows }, () => headers.map(() => ""))
      : rows;

    for (const row of data) {
      const cellLines = row.map((cell, i) => wrap(cell, this.font, 8.5, colW[i] - pad * 2));
      const h = Math.max(minRowHeight, Math.max(...cellLines.map((l) => l.length)) * 11 + pad * 2);
      if (this.y - h < this.bottom) { this.newPage(); drawHeader(); }
      cellLines.forEach((ls, i) => {
        ls.forEach((line, j) => {
          this.page.drawText(line, {
            x: colX[i] + pad, y: this.y - pad - 8 - j * 11, size: 8.5,
            font: i === 0 && typeof rows !== "number" ? this.bold : this.font, color: COLOR.ink,
          });
        });
      });
      this.drawRowBorders(colX, colW, this.y, h);
      this.y -= h;
    }
    this.y -= 12;
  }

  private drawRowBorders(colX: number[], colW: number[], top: number, h: number) {
    colX.forEach((x, i) => {
      this.page.drawRectangle({ x, y: top - h, width: colW[i], height: h, borderColor: COLOR.rule, borderWidth: 0.6 });
    });
  }

  tip(text: string) {
    const lines = wrap(text, this.font, 9.5, this.contentWidth - 24);
    const h = lines.length * 13 + 16;
    this.ensure(h + 6);
    this.page.drawRectangle({ x: this.margin, y: this.y - h, width: this.contentWidth, height: h, color: COLOR.wash });
    this.page.drawRectangle({ x: this.margin, y: this.y - h, width: 3, height: h, color: COLOR.orange });
    lines.forEach((line, i) => {
      this.page.drawText(line, { x: this.margin + 14, y: this.y - 17 - i * 13, size: 9.5, font: this.font, color: COLOR.ink2 });
    });
    this.y -= h + 12;
  }

  async save(): Promise<Uint8Array> {
    return this.pdf.save();
  }
}
