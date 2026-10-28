import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { PawsDoc, COLOR, SITE_LINE, clean, wrap } from "./builder";
import { SIGN_QR_PNG_BASE64, FLYER_QR_PNG_BASE64 } from "./findQr";

export interface BuildContext {
  /** Member's business name (or name), stamped on every page. */
  preparedFor?: string;
}

type Builder = (ctx: BuildContext) => Promise<Uint8Array>;

// ── Signs ───────────────────────────────────────────────────────────────────
// Public-facing: no member header band. Big type, the operator's business
// name as "courtesy of", and pawsassociation.com small at the bottom.
async function sign(headline: string, line2: string, ctx: BuildContext, docTitle: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(docTitle);
  pdf.setAuthor("PAWS — Professional Association of Wildlife & Sports");
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const [W, H] = [792, 612];
  const page = pdf.addPage([W, H]);

  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: COLOR.white });
  page.drawRectangle({ x: 24, y: 24, width: W - 48, height: H - 48, borderColor: COLOR.blue, borderWidth: 6 });
  page.drawRectangle({ x: 24, y: H - 84, width: W - 48, height: 60, color: COLOR.blue });
  page.drawRectangle({ x: 24, y: H - 90, width: W - 48, height: 6, color: COLOR.orange });
  const band = "THANKS FOR HELPING KEEP OUR ANIMALS AND GUESTS HEALTHY";
  page.drawText(band, { x: (W - bold.widthOfTextAtSize(band, 15)) / 2, y: H - 60, size: 15, font: bold, color: COLOR.white });

  // Headline: fit up to two lines, largest size that fits
  const maxW = W - 120;
  let size = 96;
  let lines = wrap(headline, bold, size, maxW);
  while ((lines.length > 2 || lines.some((l) => bold.widthOfTextAtSize(l, size) > maxW)) && size > 40) {
    size -= 4;
    lines = wrap(headline, bold, size, maxW);
  }
  const blockH = lines.length * size * 1.05;
  let y = H / 2 + blockH / 2 - size * 0.75 + 20;
  for (const l of lines) {
    page.drawText(l, { x: (W - bold.widthOfTextAtSize(l, size)) / 2, y, size, font: bold, color: COLOR.ink });
    y -= size * 1.05;
  }
  const sub = wrap(line2, font, 26, maxW);
  y -= 12;
  for (const l of sub) {
    page.drawText(l, { x: (W - font.widthOfTextAtSize(l, 26)) / 2, y, size: 26, font, color: COLOR.ink2 });
    y -= 32;
  }

  const foot = ctx.preparedFor ? clean(`Courtesy of ${ctx.preparedFor}`) : "";
  if (foot) {
    page.drawText(foot, { x: (W - bold.widthOfTextAtSize(foot, 16)) / 2, y: 70, size: 16, font: bold, color: COLOR.blue });
  }
  page.drawText(SITE_LINE, { x: (W - font.widthOfTextAtSize(SITE_LINE, 10)) / 2, y: 44, size: 10, font, color: COLOR.muted });

  // Bottom-right: "find animal attractions" QR → /go/sign → the directory.
  const qrImg = await pdf.embedPng(Buffer.from(SIGN_QR_PNG_BASE64, "base64"));
  const qr = 78;
  const qrX = W - 24 - 18 - qr;
  page.drawImage(qrImg, { x: qrX, y: 42, width: qr, height: qr });
  const cap = "Find animal attractions";
  page.drawText(cap, { x: qrX + qr / 2 - bold.widthOfTextAtSize(cap, 8) / 2, y: 32, size: 8, font: bold, color: COLOR.blue });
  return pdf.save();
}

// ── Forms & tables ──────────────────────────────────────────────────────────

const rateSheet: Builder = async (ctx) => {
  const d = await PawsDoc.create("Rate Sheet", ctx);
  d.title("Rate Sheet", "Fill this in once, then send it with every quote. Prices on paper end most haggling before it starts.");
  d.fields(["Business name", "Phone", "Website or PAWS listing", "Email"], 2);
  d.h2("Base packages");
  d.table(["Package name", "What's included (animals, handlers)", "Duration", "Price"], [0.24, 0.46, 0.14, 0.16], 4, 36);
  d.h2("Travel");
  d.fields(["Free travel within (miles)", "Fee beyond that (per mile or per zone)"], 2);
  d.h2("Add-ons");
  d.table(["Add-on", "Price"], [0.75, 0.25], [
    ["Extra half hour", ""], ["Extra handler", ""], ["Pony rides added to petting zoo", ""],
    ["Decorated or floral saddlebags", ""], ["", ""],
  ], 24);
  d.h2("Deposits & policies");
  d.fields(["Deposit to hold a date", "Balance due", "Weather / reschedule policy", "Cancellation policy", "Peak date (weekend/holiday) premium", "Minimum booking"], 2);
  d.tip("Price the first hour to cover your whole event day — loading, driving, setup, and cleanup — not just time on site. The pricing lesson in the PAWS course walks through the math.");
  return d.save();
};

const intakeForm: Builder = async (ctx) => {
  const d = await PawsDoc.create("Event Inquiry Intake Form", ctx);
  d.title("Event Inquiry Intake Form", "Ask every question on the first call. The ones you skip become event-day problems.");
  d.h2("Contact");
  d.fields(["Date of inquiry", "How did they hear about you?", "Name", "Phone", "Email", "Best way to reach them"], 2);
  d.h2("Event");
  d.fields(["Event date", "Start time – end time"], 2);
  d.options("Event type", ["Birthday", "School / daycare", "Library", "Church", "Wedding", "Corporate", "Fair / festival", "Other"]);
  d.fields(["Number of guests", "Number of kids and their ages"], 2);
  d.h2("Venue");
  d.fields(["Venue name and address"]);
  d.options("Setup surface", ["Grass", "Pavement", "Dirt", "Indoor", "Unknown — site visit needed"]);
  d.fields(["Gate / access width", "Shade available?"], 2);
  d.options("Does the venue require a certificate of insurance?", ["Yes", "No", "Ask the venue"]);
  d.fields(["Name and address to list as additional insured"]);
  d.h2("Quote");
  d.fields(["Package quoted", "Price quoted", "Travel fee", "Deposit amount", "Deposit received (date)", "Follow-up date"], 2);
  d.lines(3);
  return d.save();
};

const siteVisit: Builder = async (ctx) => {
  const d = await PawsDoc.create("Venue Site Visit Checklist", ctx);
  d.title("Venue Site Visit Checklist", "Ten minutes at a new venue before event day. Walk it with the venue contact if you can.");
  d.fields(["Venue", "Venue contact (name and phone)"], 2);
  d.h2("Arrival & access");
  d.checklist([
    "Trailer can reach the setup spot (check turns, slopes, and soft ground)",
    "Gate and path widths measured: ______",
    "Load-in window confirmed: ______",
    "Parking spot for truck and trailer during the event",
  ]);
  d.h2("Setup area");
  d.checklist([
    "Ground is level; surface noted (grass, pavement, dirt)",
    "Shade: natural, or bring canopy",
    "Water source within reach of the pen",
    "Distance from food service and from vehicle traffic",
    "Room for the line to form outside the pen",
  ]);
  d.h2("Guest flow");
  d.checklist([
    "Pen entry and exit points",
    "Hand-washing or sanitizer station placed at the exit",
    "Restrooms nearby for guest hand washing",
    "Where strollers and wheelchairs approach",
  ]);
  d.h2("Venue rules & paperwork");
  d.checklist([
    "Certificate of insurance: required limits and exact additional-insured wording",
    "Animal or noise restrictions on the property",
    "Cleanup expectations (bag and haul, hose down, etc.)",
    "Day-of contact name and phone",
  ]);
  d.lines(3);
  return d.save();
};

const careLog: Builder = async (ctx) => {
  const d = await PawsDoc.create("Animal Care & Transport Log", { ...ctx, landscape: true });
  d.title("Animal Care & Transport Log", "One row per animal per event. Keep completed pages with your vet and event records.");
  d.table(
    ["Date", "Animal(s)", "Event / location", "Depart", "Return", "Water & feed", "Rest breaks", "Health notes", "Initials"],
    [0.08, 0.13, 0.17, 0.07, 0.07, 0.12, 0.1, 0.19, 0.07],
    14,
    26,
  );
  return d.save();
};

const runSheet: Builder = async (ctx) => {
  const d = await PawsDoc.create("Event-Day Run Sheet", ctx);
  d.title("Event-Day Run Sheet", "One sheet per event. Fill the header before you pull out; initial each block as it happens.");
  d.fields(["Client name and phone", "Venue address", "Start time", "Off-site by", "Insurance certificate sent (date)", "Balance collected (method)"], 2);
  d.h2("Load-out (night before)");
  d.checklist([
    "Animals selected and checked: eyes, gait, appetite",
    "Fencing panels, ground cover, shade canopy",
    "Water buckets, feed, and hay for the day",
    "Hand-wash station, refill jug, sanitizer",
    "First-aid kit (people) and animal kit",
    "Event signs: hand washing, ask before petting, don't feed the animals",
    "Waiver clipboard or QR sign, business cards, flyers",
  ]);
  d.h2("On site");
  d.checklist([
    "Pen up, gates latched, shade over water",
    "Wash station at the pen exit with the sign posted",
    "Walk the client through the rules before guests arrive",
    "Rotation plan: rest each animal ____ minutes per hour",
  ]);
  d.h2("Teardown");
  d.checklist([
    "Headcount every animal before the trailer closes",
    "Ground cover bagged and hauled — leave nothing",
    "Photos of the clean site",
    "Thank the client in person; mention the review text they'll get tomorrow",
  ]);
  return d.save();
};

const CALENDAR: string[][] = [
  ["January", "Indoor events, winter festivals", "Spring birthdays, school field trips", "Schools and daycares; fair boards as vendor applications open"],
  ["February", "Indoor events, Valentine's parties", "Easter and spring events, summer programs", "Libraries (summer reading), day camps"],
  ["March", "Spring birthdays begin", "Easter, Mother's Day, field trips", "PTA/PTO chairs, churches, preschools"],
  ["April", "Birthdays, Easter, field trips", "Summer camps, Fourth of July", "Day camps, HOAs, parks and recreation"],
  ["May", "Field trips peak, graduations", "Summer fairs and library programs", "County fairs (confirm), libraries"],
  ["June", "Summer camps, libraries, birthdays", "Fall festivals, pumpkin patches", "Pumpkin patches, harvest festival organizers"],
  ["July", "Fairs, Fourth of July, camps", "Back-to-school and fall events", "Churches, schools (fall festivals)"],
  ["August", "Fairs, back-to-school events", "Halloween and harvest events", "Corporate fall picnics, HR teams"],
  ["September", "Fall festivals, pumpkin patches", "Holiday events, living nativities", "Churches, tree lots, holiday markets"],
  ["October", "Pumpkin patches, Halloween", "Holiday and corporate parties", "Corporate event planners, venues"],
  ["November", "Harvest, Thanksgiving, nativities", "Holiday parties; next spring", "Last year's clients (rebooking)"],
  ["December", "Holiday events, nativities", "Next year: prices, fair applications", "Ask the year's clients for reviews"],
];

const marketingCalendar: Builder = async (ctx) => {
  const d = await PawsDoc.create("12-Month Marketing Calendar", { ...ctx, landscape: true });
  d.title("12-Month Marketing Calendar", "Market each season six to eight weeks before it arrives. Check this on the first of every month.");
  d.table(["Month", "Booking focus this month", "Market now for", "Contact this month", "Your notes"], [0.12, 0.22, 0.22, 0.26, 0.18], CALENDAR.map((r) => [...r, ""]), 26);
  d.tip("These are typical patterns. Adjust for your climate and region — a Florida winter and a Minnesota winter book very differently.");
  return d.save();
};

// ── Fillable flyer ──────────────────────────────────────────────────────────
const flyer: Builder = async () => {
  const pdf = await PDFDocument.create();
  pdf.setTitle("Business Flyer");
  pdf.setAuthor("PAWS — Professional Association of Wildlife & Sports");
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const [W, H] = [612, 792];
  const page = pdf.addPage([W, H]);
  const form = pdf.getForm();
  const M = 44;

  const label = (text: string, x: number, y: number) =>
    page.drawText(text, { x, y, size: 8.5, font: bold, color: COLOR.muted });
  const field = (name: string, x: number, y: number, w: number, h: number, fontSize: number, multiline = false) => {
    const f = form.createTextField(name);
    if (multiline) f.enableMultiline();
    f.addToPage(page, { x, y, width: w, height: h, borderColor: COLOR.rule, borderWidth: 0.8, backgroundColor: rgb(0.98, 0.99, 1), font });
    f.setFontSize(fontSize);
    return f;
  };

  page.drawRectangle({ x: 0, y: H - 150, width: W, height: 150, color: COLOR.blue });
  page.drawRectangle({ x: 0, y: H - 156, width: W, height: 6, color: COLOR.orange });
  page.drawText("BUSINESS NAME", { x: M, y: H - 40, size: 8.5, font: bold, color: rgb(0.86, 0.92, 1) });
  field("business_name", M, H - 92, W - M * 2, 44, 28);
  page.drawText("TAGLINE", { x: M, y: H - 108, size: 8.5, font: bold, color: rgb(0.86, 0.92, 1) });
  field("tagline", M, H - 140, W - M * 2, 26, 14);

  // Photo box
  const photoTop = H - 180;
  const PH = 250;
  page.drawRectangle({ x: M, y: photoTop - PH, width: 250, height: PH, borderColor: COLOR.rule, borderWidth: 1.2, borderDashArray: [5, 4] });
  const ph = "Print or tape a photo here";
  page.drawText(ph, { x: M + 125 - font.widthOfTextAtSize(ph, 10) / 2, y: photoTop - PH / 2, size: 10, font, color: COLOR.muted });

  const rx = M + 270;
  const rw = W - M - rx;
  label("WHAT WE BRING", rx, photoTop - 10);
  field("services", rx, photoTop - PH, rw, PH - 18, 11, true);

  // Events served
  let y = photoTop - PH - 30;
  page.drawText("PERFECT FOR", { x: M, y, size: 10, font: bold, color: COLOR.blue });
  const events = ["Birthday parties", "Schools & daycares", "Libraries", "Churches", "Weddings", "Corporate events", "Fairs & festivals", "Community events"];
  y -= 22;
  events.forEach((e, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = M + col * 131;
    const yy = y - row * 22;
    const cb = form.createCheckBox(`event_${i}`);
    cb.addToPage(page, { x, y: yy - 2, width: 12, height: 12, borderColor: COLOR.ink2, borderWidth: 0.8 });
    page.drawText(e, { x: x + 17, y: yy, size: 10, font, color: COLOR.ink });
  });

  // Contact
  y -= 74;
  page.drawText("BOOK US", { x: M, y, size: 10, font: bold, color: COLOR.blue });
  y -= 14;
  const half = (W - M * 2 - 16) / 2;
  label("PHONE", M, y - 2); label("EMAIL", M + half + 16, y - 2);
  field("phone", M, y - 34, half, 26, 13);
  field("email", M + half + 16, y - 34, half, 26, 13);
  y -= 52;
  label("WEBSITE", M, y - 2); label("SERVICE AREA", M + half + 16, y - 2);
  field("website", M, y - 34, half, 26, 13);
  field("service_area", M + half + 16, y - 34, half, 26, 13);
  y -= 52;
  label("PRICES START AT", M, y - 2); label("FOLLOW US", M + half + 16, y - 2);
  field("prices_from", M, y - 34, half, 26, 13);
  field("social", M + half + 16, y - 34, half, 26, 13);

  // Member band
  page.drawRectangle({ x: 0, y: 0, width: W, height: 52, color: COLOR.wash });
  const m1 = "Find us in the PAWS member directory";
  page.drawText(m1, { x: (W - bold.widthOfTextAtSize(m1, 12)) / 2, y: 28, size: 12, font: bold, color: COLOR.blueDeep });
  page.drawText(SITE_LINE, { x: (W - font.widthOfTextAtSize(SITE_LINE, 10)) / 2, y: 13, size: 10, font, color: COLOR.blue });
  // QR in the band → /go/flyer → the directory, where the member's listing lives.
  const qrImg = await pdf.embedPng(Buffer.from(FLYER_QR_PNG_BASE64, "base64"));
  page.drawImage(qrImg, { x: W - M - 46, y: 3, width: 46, height: 46 });

  form.updateFieldAppearances(font);
  return pdf.save();
};

// ── More business forms ─────────────────────────────────────────────────────

const depositReceipt: Builder = async (ctx) => {
  const d = await PawsDoc.create("Deposit Receipt & Invoice", ctx);
  d.title("Deposit Receipt & Invoice", "Fill one in when the deposit comes in, give the client a copy, and keep yours with the event file.");
  d.fields(["Invoice / receipt number", "Date issued", "Client name", "Client phone and email", "Event date and time", "Venue address"], 2);
  d.h2("Booking");
  d.table(["Item", "Description", "Qty", "Amount"], [0.26, 0.48, 0.1, 0.16], [
    ["Package", "", "", ""], ["Travel fee", "", "", ""], ["Add-ons", "", "", ""], ["", "", "", ""],
  ], 26);
  d.fields(["Event total", "Deposit received", "Balance due", "Balance due by (date)"], 2);
  d.options("Deposit paid by", ["Cash", "Check #____", "Card", "Online / app", "Other"]);
  d.h2("Terms the client agreed to");
  d.fields(["Reschedule / weather policy", "Cancellation and deposit refund policy"]);
  d.fields(["Received by (signature)", "Date"], 2);
  d.tip("Write your deposit and weather terms the same way on the receipt, the rate sheet, and the agreement. Matching wording is what settles a dispute fast.");
  return d.save();
};

const eventAgreement: Builder = async (ctx) => {
  const d = await PawsDoc.create("Event Booking Agreement", ctx);
  d.title("Event Booking Agreement", "A plain-language starting point for your booking terms. Have an attorney in your state review it before you use it.");
  d.h2("Parties & event");
  d.fields(["Business (provider)", "Client name", "Client phone", "Client email", "Event date", "Arrival / start / end times", "Venue name and address", "Guest count and ages"], 2);
  d.h2("Services & price");
  d.fields(["Animals and services provided", "Number of handlers"], 2);
  d.fields(["Total price", "Deposit to hold the date", "Balance due (amount and date)", "Payment methods accepted"], 2);
  d.h2("Weather, rescheduling & cancellation");
  d.fields(["Weather call made by (who, and how many hours before)", "Reschedule terms (deposit transfers to a new date within ___ days)", "Client cancellation terms", "If the provider must cancel"]);
  d.h2("Site & safety");
  d.checklist([
    "Client provides a level setup area of about ____ x ____ ft with vehicle access",
    "Client tells the provider about surface, shade, and access before event day",
    "Guests follow handler instructions; children are supervised by an adult",
    "Hand-washing or sanitizer station is available at the animal area exit",
    "Venue certificate-of-insurance requirements shared with the provider by: ______",
  ]);
  d.fields(["Provider signature", "Date", "Client signature", "Date"], 2);
  d.tip("Template only, not legal advice. Contract and liability rules differ by state; an attorney can tailor this agreement to your business.");
  return d.save();
};

const animalHealthRecord: Builder = async (ctx) => {
  const d = await PawsDoc.create("Animal Health & Vaccination Record", ctx);
  d.title("Animal Health & Vaccination Record", "One page per animal. Bring copies to fairs and events that ask for health paperwork; requirements vary by state and event, so check with the event and your vet each season.");
  d.fields(["Animal name", "Species / breed / sex", "Date of birth or age / markings", "ID (tag, tattoo, microchip)", "Veterinarian", "Vet phone"], 2);
  d.h2("Vaccinations");
  d.table(["Vaccine", "Date given", "Next due", "Given by", "Lot # / notes"], [0.28, 0.14, 0.14, 0.18, 0.26], 5, 24);
  d.h2("Deworming, exams & tests");
  d.table(["Date", "Treatment, exam, or test", "Result / product", "Next due"], [0.14, 0.4, 0.3, 0.16], 4, 24);
  d.h2("Health certificates (CVI) for travel");
  d.table(["Issued", "Expires", "Destination / event", "Vet"], [0.15, 0.15, 0.42, 0.28], 2, 24);
  return d.save();
};

const incidentReport: Builder = async (ctx) => {
  const d = await PawsDoc.create("Incident Report Form", ctx);
  d.title("Incident Report Form", "Fill this out the same day for any injury, bite, scratch, escape, or property damage, even a minor one.");
  d.fields(["Date of incident", "Time", "Event / venue", "Report completed by"], 2);
  d.options("Type of incident", ["Guest injury", "Bite / scratch / kick", "Handler injury", "Animal injury or illness", "Animal escape", "Property damage", "Other"]);
  d.h2("People involved");
  d.fields(["Name", "Phone", "Parent / guardian (if a minor)", "Age (if a minor)"], 2);
  d.h2("Animal involved");
  d.fields(["Animal name and species", "Handler on duty"], 2);
  d.h2("What happened");
  d.lines(4, "Describe what happened, in order, without guessing at fault");
  d.fields(["First aid given (by whom)", "Medical care sought or refused", "Witness name and phone", "Witness name and phone", "Photos taken? (yes / no, by whom)", "Insurance agent notified (date)"], 2);
  d.lines(2, "Follow-up actions");
  return d.save();
};

const participationWaiver: Builder = async (ctx) => {
  const d = await PawsDoc.create("Guest Participation Waiver Template", ctx);
  d.title("Guest Participation Waiver Template", "A starting point for guest acknowledgments. Have an attorney in your state review it before use; waiver rules vary widely.");
  d.fields(["Business name", "Event date and location"], 2);
  d.h2("Acknowledgment");
  d.para("I understand that animals can behave unpredictably and that activities such as petting, feeding, and riding involve some risk, including bites, scratches, kicks, falls, and allergic reactions. I agree to follow the handlers' instructions, to supervise any children in my care at all times, and to wash or sanitize hands after contact with the animals.");
  d.para("I confirm that I and the participants listed below are able to take part, and I will tell a handler about any allergies or conditions before participating.");
  d.para("[Release / assumption-of-risk language as reviewed by your attorney]", 10, COLOR.muted);
  d.h2("Participants");
  d.table(["Participant name", "Age", "Allergies or notes"], [0.45, 0.12, 0.43], 5, 24);
  d.options("Photo permission", ["Yes, photos may be used", "No photos, please"]);
  d.fields(["Parent / guardian name", "Phone", "Signature", "Date"], 2);
  d.tip("Template only, not legal advice. Whether a waiver is enforceable depends on your state and its wording. Ask your attorney, and keep signed copies.");
  return d.save();
};

const mileageLog: Builder = async (ctx) => {
  const d = await PawsDoc.create("Mileage & Expense Log", { ...ctx, landscape: true });
  d.title("Mileage & Expense Log", "Log every business trip and expense as it happens. Hand completed pages to whoever does your taxes.");
  d.table(
    ["Date", "Event / purpose", "From", "To", "Start odo.", "End odo.", "Miles", "Expense type", "Amount", "Receipt?"],
    [0.08, 0.18, 0.11, 0.11, 0.09, 0.09, 0.07, 0.12, 0.08, 0.07],
    13,
    26,
  );
  d.tip("Expense types to track: fuel, tolls, parking, feed and bedding, vet, supplies, event fees. Ask your tax professional which records they need.");
  return d.save();
};

const bookingTracker: Builder = async (ctx) => {
  const d = await PawsDoc.create("Booking & Follow-Up Tracker", { ...ctx, landscape: true });
  d.title("Booking & Follow-Up Tracker", "One row per booked event. The follow-up columns turn this year's clients into next year's bookings.");
  d.table(
    ["Event date", "Client", "Event type", "How they found you", "Total", "Paid in full", "Thank-you sent", "Review asked", "Rebook date"],
    [0.1, 0.17, 0.12, 0.14, 0.09, 0.09, 0.1, 0.09, 0.1],
    13,
    26,
  );
  d.tip("Birthdays and annual events come back around. Set the rebook date about six weeks before next year's event and reach out then.");
  return d.save();
};

export const BUILDERS: Record<string, Builder> = {
  "hand-washing-sign": (ctx) => sign("Please wash your hands", "after visiting the animals. Soap and water or sanitizer, every time.", ctx, "Hand Washing Sign"),
  "ask-before-petting-sign": (ctx) => sign("Ask before petting", "Our animals are friendly — please check with a handler first.", ctx, "Ask Before Petting Sign"),
  "dont-feed-the-animals-sign": (ctx) => sign("Please don't feed the animals", "They're on a set diet. Ask a handler about feeding time.", ctx, "Don't Feed the Animals Sign"),
  "supervise-children-sign": (ctx) => sign("Please supervise your children", "An adult stays with every child inside the animal area.", ctx, "Supervise Children Sign"),
  "gentle-and-quiet-sign": (ctx) => sign("Gentle hands, quiet voices", "Please walk near the animals. Quick moves and loud noises can startle them.", ctx, "Gentle Hands Quiet Voices Sign"),
  "no-food-or-strollers-sign": (ctx) => sign("No food or strollers in the pen", "Please leave snacks, drinks, and strollers outside the gate.", ctx, "No Food or Strollers Sign"),
  "rate-sheet-template": rateSheet,
  "inquiry-intake-form": intakeForm,
  "venue-site-visit-checklist": siteVisit,
  "animal-care-transport-log": careLog,
  "event-day-run-sheet": runSheet,
  "deposit-receipt-invoice": depositReceipt,
  "event-booking-agreement": eventAgreement,
  "animal-health-record": animalHealthRecord,
  "incident-report-form": incidentReport,
  "guest-participation-waiver": participationWaiver,
  "mileage-expense-log": mileageLog,
  "booking-follow-up-tracker": bookingTracker,
  "marketing-calendar": marketingCalendar,
  "flyer-template": flyer,
};

export async function buildDownload(slug: string, ctx: BuildContext): Promise<Uint8Array | null> {
  const b = BUILDERS[slug];
  return b ? b(ctx) : null;
}
