import { sendEmail, adminNotifyAddress } from "./smtp2go";
import { SITE } from "./siteConfig";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pawsassociation.com";
// Literal hex only — email clients do not resolve CSS custom properties.
// Arena theme: electric blue + sunburst orange.
const BLUE = "#2563EB";
const BLUE_DEEP = "#1D4ED8";
const ORANGE = "#F97316";
const INK = "#0F172A";
const MUTED = "#64748B";
const HAIR = "#E2E8F0";

export function wrap(title: string, bodyHtml: string, footerHtml = ""): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${title}</title></head>
<body style="font-family:Arial,sans-serif;background:#F8FAFC;margin:0;padding:20px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.10)">
    <!-- Solid bgcolor first: Outlook ignores CSS gradients, which left the
         white title invisible on a white band. -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr>
      <td bgcolor="${BLUE}" style="background-color:${BLUE};background-image:linear-gradient(135deg,${BLUE},${BLUE_DEEP});padding:28px 32px;border-bottom:3px solid ${ORANGE}">
        <p style="color:#FDBA74;margin:0;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;font-weight:700">${SITE.name} &mdash; Professional Association of Wildlife &amp; Sports</p>
        <h1 style="color:#ffffff;margin:8px 0 0;font-size:21px">${title}</h1>
      </td>
    </tr></table>
    <div style="padding:28px 32px;color:#334155;font-size:15px;line-height:1.6">
      ${bodyHtml}
    </div>
    <div style="background:#F8FAFC;padding:16px 32px;font-size:12px;color:${MUTED};border-top:1px solid ${HAIR}">
      ${SITE.domain}${footerHtml}
    </div>
  </div>
</body>
</html>`;
}

export function esc(v: string): string {
  return (v || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

// ── 1. New-member welcome (temp password OR set-password link) ────────────
export async function sendWelcomeEmail(opts: {
  to: string;
  firstName: string;
  memberNumber: string;
  tempPassword?: string;
  setPasswordLink?: string;
  /** Set for a first-time member — the email then says when the 7-day money-back guarantee ends. */
  guaranteeUntil?: string;
}) {
  const { to, firstName, memberNumber, tempPassword, setPasswordLink, guaranteeUntil } = opts;
  const guaranteeEnd = guaranteeUntil
    ? new Date(guaranteeUntil).toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", month: "long", day: "numeric", year: "numeric" })
    : "";
  const guaranteeHtml = guaranteeEnd
    ? `<p style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:12px 14px"><strong>7-day money-back guarantee:</strong> if PAWS isn't right for you, cancel by ${guaranteeEnd} from your <a href="${SITE_URL}/dashboard/billing" style="color:${BLUE}">Billing page</a> and your $149 is refunded in full.</p>`
    : "";
  // Members never see the internal PAWS- prefix in the number itself.
  const memberDigits = (memberNumber || "").replace(/^PAWS-/i, "");

  // Three cases. The third is load-bearing: with neither a password nor a
  // link, a two-branch version would emit href="undefined" and the member
  // would have no way in at all. Fall back to the self-serve sign-in link.
  const credentialsHtml = tempPassword
    ? `<p>Your login is <strong>${to}</strong> and your temporary password is <strong>${tempPassword}</strong>. Please change it after you sign in.</p>
       <p><a href="${SITE_URL}/login" style="color:${BLUE};font-weight:700">Log in to your account &rarr;</a></p>`
    : setPasswordLink
      ? `<p>Click below to set your password and activate your account:</p>
         <p><a href="${setPasswordLink}" style="color:${BLUE};font-weight:700">Set your password &rarr;</a></p>
         <p style="color:${MUTED};font-size:13px">This link expires in 24 hours. After that, use <a href="${SITE_URL}/login?reset=1" style="color:${BLUE}">Forgot your password?</a> on the login page.</p>`
      : `<p>To get in, go to the login page and choose <strong>Email me a sign-in link</strong>. Your login is <strong>${to}</strong> &mdash; no password needed.</p>
         <p><a href="${SITE_URL}/login" style="color:${BLUE};font-weight:700">Go to the login page &rarr;</a></p>`;

  const html = wrap(
    `Welcome to ${SITE.name}`,
    `<p>Hi ${esc(firstName) || "there"},</p>
     <p>Your membership is active. Your member number is <strong>Member no. ${memberDigits}</strong>.</p>
     ${guaranteeHtml}
     ${credentialsHtml}
     <h3 style="color:${INK};font-size:16px;margin-top:24px">Get the most from your membership</h3>
     <ul style="padding-left:20px;color:#334155">
       <li><strong>Your directory listing</strong> — complete your public profile so event planners and families can find you (this is where your leads come from)</li>
       <li><strong>Member benefits</strong> — partner discounts and business tools you can start using today</li>
       <li><strong>Member guides</strong> — marketing playbooks, pricing templates, and printable event-day checklists</li>
     </ul>
     <p><a href="${SITE_URL}/dashboard/profile" style="display:inline-block;background:${ORANGE};color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 22px;border-radius:9px">Complete your listing &rarr;</a></p>
     <p>Questions? Just reply to this email or visit our <a href="${SITE_URL}/contact" style="color:${BLUE}">contact page</a>.</p>`
  );
  const text = `Welcome to ${SITE.name}\n\nYour member number is ${memberDigits}.\n${
    guaranteeEnd ? `7-day money-back guarantee: cancel by ${guaranteeEnd} at ${SITE_URL}/dashboard/billing for a full refund.\n` : ""
  }${
    tempPassword
      ? `Login: ${to} / Temp password: ${tempPassword} — please change it after signing in.`
      : setPasswordLink
        ? `Set your password: ${setPasswordLink}`
        : `Sign in at ${SITE_URL}/login and choose "Email me a sign-in link".`
  }\n\nComplete your listing so planners can find you: ${SITE_URL}/dashboard/profile`;

  return sendEmail({ to, subject: `Welcome to ${SITE.name}`, html, text });
}

// ── 2. Lead notification — to the MEMBER (the retention email) ────────────
// Sent the moment someone submits the "Request availability" form on their
// public listing. Reply-To is the inquirer so the member can answer directly.
export async function sendLeadNotification(opts: {
  to: string;
  memberFirstName: string;
  businessName: string;
  lead: {
    name: string;
    email: string;
    phone?: string | null;
    eventDate?: string | null;
    message: string;
  };
}) {
  const { to, memberFirstName, businessName, lead } = opts;
  const html = wrap(
    "You have a new lead",
    `<p>Hi ${esc(memberFirstName) || "there"},</p>
     <p>Someone just asked about <strong>${esc(businessName)}</strong> through your ${SITE.name} listing. Fast replies win bookings — reply to this email and it goes straight to them.</p>
     <table style="width:100%;border-collapse:collapse;margin:18px 0;font-size:14px">
       <tr><td style="padding:8px 0;color:${MUTED};width:120px">Name</td><td style="padding:8px 0;color:${INK};font-weight:600">${esc(lead.name)}</td></tr>
       <tr><td style="padding:8px 0;color:${MUTED}">Email</td><td style="padding:8px 0;color:${INK}">${esc(lead.email)}</td></tr>
       <tr><td style="padding:8px 0;color:${MUTED}">Phone</td><td style="padding:8px 0;color:${INK}">${esc(lead.phone || "—")}</td></tr>
       <tr><td style="padding:8px 0;color:${MUTED}">Event date</td><td style="padding:8px 0;color:${INK}">${esc(lead.eventDate || "Not specified")}</td></tr>
     </table>
     <h3 style="color:${INK};font-size:15px;margin:6px 0">Their message</h3>
     <p style="white-space:pre-wrap;background:#F8FAFC;border:1px solid ${HAIR};border-radius:8px;padding:14px">${esc(lead.message)}</p>
     <p><a href="${SITE_URL}/dashboard/leads" style="color:${BLUE};font-weight:700">See all your leads &rarr;</a></p>`
  );
  const text = `New lead for ${businessName}\n\nName: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone || "—"}\nEvent date: ${lead.eventDate || "Not specified"}\n\nMessage:\n${lead.message}\n\nReply directly to this email to answer them.\nAll your leads: ${SITE_URL}/dashboard/leads`;

  return sendEmail({ to, subject: `New lead: ${lead.name} asked about ${businessName}`, html, text, replyTo: lead.email });
}

// ── 3. Contact-form notification ──────────────────────────────────────────
export async function sendContactNotice(opts: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  message: string;
  referrer?: string;
  pageUrl?: string;
}) {
  const { firstName, lastName, email, phone, state, message, referrer, pageUrl } = opts;
  const html = wrap(
    "New Contact Form Submission",
    `<table style="width:100%;border-collapse:collapse;font-size:14px">
       <tr><td style="padding:6px 0;font-weight:700;width:120px">Name</td><td>${esc(firstName)} ${esc(lastName)}</td></tr>
       <tr><td style="padding:6px 0;font-weight:700">Email</td><td>${esc(email)}</td></tr>
       <tr><td style="padding:6px 0;font-weight:700">Phone</td><td>${esc(phone)}</td></tr>
       <tr><td style="padding:6px 0;font-weight:700">State</td><td>${esc(state)}</td></tr>
     </table>
     <h3 style="color:${INK};font-size:15px;margin-top:20px">Message</h3>
     <p style="white-space:pre-wrap">${esc(message)}</p>
     <hr style="border:none;border-top:1px solid ${HAIR};margin:20px 0" />
     <p style="font-size:12px;color:${MUTED}">Referring URL: ${esc(referrer || "(direct)")}<br/>Page: ${esc(pageUrl || "(unknown)")}</p>`
  );
  const text = `New contact form submission\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nState: ${state}\n\nMessage:\n${message}\n\nReferring URL: ${referrer || "(direct)"}\nPage: ${pageUrl || "(unknown)"}`;

  return sendEmail({ to: adminNotifyAddress(), subject: `Contact form: ${firstName} ${lastName}`, html, text, replyTo: email });
}

// ── Admin notices in the sectioned ("Stratum") format ─────────────────────
// Built ONCE as {title, rows} sections and rendered to both HTML and text so
// the two can never drift. Tracking metadata always goes in the LAST section
// so it can be deleted in one selection before a notice is forwarded.
type Section = { title: string; rows: [string, string][] };

function digits(memberNumber?: string | null): string {
  return (memberNumber || "").replace(/^PAWS-/i, "") || "—";
}

function nowPT(d: Date = new Date()): string {
  return d.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles", month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  }) + " PT";
}

function datePT(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles", month: "long", day: "numeric", year: "numeric",
  });
}

function trackingSection(referrer?: string, pageUrl?: string): Section {
  return { title: "Tracking", rows: [
    ["Referring URL", referrer || "(direct / none)"],
    ["Page", pageUrl || "—"],
  ]};
}

function sectionsHtml(sections: Section[]): string {
  return sections.map((sec) => `
    <h2 style="margin:22px 0 8px;padding:0 0 6px;border-bottom:2px solid ${BLUE};font-size:15px;color:${BLUE};text-transform:uppercase;letter-spacing:.06em">${esc(sec.title)}</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse">
      ${sec.rows.map(([k, v]) => `<tr>
        <td style="padding:6px 12px 6px 0;width:150px;vertical-align:top;font-weight:700;color:${INK}">${esc(k)}</td>
        <td style="padding:6px 0;vertical-align:top;color:#334155;word-break:break-word">${esc(v)}</td></tr>`).join("")}
    </table>`).join("");
}

function sectionsText(sections: Section[]): string {
  return sections.map((sec) =>
    `== ${sec.title.toUpperCase()} ==\n` + sec.rows.map(([k, v]) => `${k}: ${v}`).join("\n")
  ).join("\n\n");
}

async function sendAdminNotice(subject: string, heading: string, sections: Section[]) {
  return sendEmail({
    to: adminNotifyAddress(),
    subject,
    html: wrap(heading, sectionsHtml(sections)),
    text: `${heading}\n\n${sectionsText(sections)}`,
  });
}

// New member (retail Stripe signup or admin-created comp) — to admin.
export async function sendMemberAdminNotice(opts: {
  event: "retail" | "comp" | "renewed";
  member: {
    firstName?: string | null; lastName?: string | null; email: string;
    phone?: string | null; state?: string | null; memberNumber?: string | null;
  };
  expiresAt?: string | null;
  payment?: { amountCents?: number | null; reference?: string | null } | null;
}) {
  const m = opts.member;
  const name = [m.firstName, m.lastName].filter(Boolean).join(" ") || "(not provided)";
  const label = opts.event === "retail" ? "New member ($149/yr)"
    : opts.event === "comp" ? "New comp member (admin-created)"
    : "Membership renewed";

  const sections: Section[] = [
    { title: "Member", rows: [
      ["Member no.", digits(m.memberNumber)],
      ["Name", name],
      ["Email", m.email],
      ["Phone", m.phone || "—"],
      ["State", m.state || "—"],
    ]},
    { title: "Membership", rows: [
      ["Type", label],
      [opts.event === "comp" ? "Comp ends" : "Renews", datePT(opts.expiresAt)],
      ["Recorded", nowPT()],
    ]},
  ];
  if (opts.payment) {
    sections.push({ title: "Payment", rows: [
      ["Amount", opts.payment.amountCents != null ? `$${(opts.payment.amountCents / 100).toFixed(2)}` : "—"],
      ["Stripe reference", opts.payment.reference || "—"],
    ]});
  }
  sections.push({ title: "Admin", rows: [["Members", `${SITE_URL}/admin/members`]] });

  return sendAdminNotice(`${label}: ${name} (${digits(m.memberNumber)})`, label, sections);
}

// New directory lead — silent admin copy so the association can see lead
// volume (the value story members renew for). Tracking metadata LAST.
export async function sendLeadAdminNotice(opts: {
  businessName: string;
  categoryName?: string | null;
  memberEmail?: string | null;
  lead: { name: string; email: string; phone?: string | null; eventDate?: string | null; message: string };
  referrer?: string;
  pageUrl?: string;
}) {
  const o = opts;
  const sections: Section[] = [
    { title: "Listing", rows: [
      ["Business", o.businessName],
      ["Category", o.categoryName || "—"],
      ["Member email", o.memberEmail || "(unclaimed listing — no member yet)"],
    ]},
    { title: "Lead", rows: [
      ["Name", o.lead.name],
      ["Email", o.lead.email],
      ["Phone", o.lead.phone || "—"],
      ["Event date", o.lead.eventDate || "—"],
      ["Message", o.lead.message],
      ["Received", nowPT()],
    ]},
    trackingSection(o.referrer, o.pageUrl),
  ];
  return sendAdminNotice(`Directory lead: ${o.lead.name} → ${o.businessName}`, "New directory lead", sections);
}

// ── Listing removal request — to admin (public form, /request-removal) ────
export async function sendRemovalRequest(opts: {
  listingSlug?: string;
  businessName: string;
  cityState?: string;
  requesterName: string;
  email: string;
  phone?: string;
  relationship: string;
  reason?: string;
  referrer?: string;
  pageUrl?: string;
  listing: { business_name: string; city: string | null; state: string | null; claimed: boolean } | null;
}) {
  const l = opts.listing;
  const sections: Section[] = [
    { title: "Listing", rows: [
      ["Business (as entered)", opts.businessName],
      ["City / state (as entered)", opts.cityState || "—"],
      ["Matched listing", l ? `${l.business_name} — ${[l.city, l.state].filter(Boolean).join(", ")}` : "Not matched — find it in the directory"],
      ["Listing URL", opts.listingSlug ? `${SITE_URL}/members/${opts.listingSlug}` : "—"],
      ["Claimed by a member?", l ? (l.claimed ? "YES — a paying member owns this listing; talk to them first" : "No (pre-listed)") : "—"],
      ["Remove it here", `${SITE_URL}/admin/listings`],
    ]},
    { title: "Requested by", rows: [
      ["Name", opts.requesterName],
      ["Email", opts.email],
      ["Phone", opts.phone || "—"],
      ["Relationship", opts.relationship],
    ]},
    { title: "Reason", rows: [["Reason", opts.reason || "(none given)"]] },
    { title: "Received", rows: [["When", nowPT()]] },
    trackingSection(opts.referrer, opts.pageUrl),
  ];
  return sendEmail({
    to: adminNotifyAddress(),
    subject: `Removal request: ${opts.businessName}`,
    html: wrap("Listing removal request", sectionsHtml(sections)),
    text: `Listing removal request\n\n${sectionsText(sections)}`,
    replyTo: opts.email,
  });
}

// ── Cancelled + refunded (member self-service: 7-day guarantee or 30-day renewal rule)
export async function sendRefundEmails(opts: {
  kind: "guarantee" | "renewal";
  to: string;
  firstName: string;
  lastName: string;
  memberNumber: string;
  amountCents: number;
  refundId: string;
}) {
  const amount = `$${(opts.amountCents / 100).toFixed(2)}`;
  const what = opts.kind === "guarantee" ? "membership payment" : "renewal payment";
  const html = wrap(
    "Your membership is cancelled and refunded",
    `<p>Hi ${esc(opts.firstName) || "there"},</p>
     <p>As requested, your ${SITE.name} membership has been cancelled and your ${what} of <strong>${amount}</strong> has been refunded in full.</p>
     <p>Refunds usually reach your card within 5&ndash;10 business days, depending on your bank. Your directory listing is now hidden; you can rejoin anytime at <a href="${SITE_URL}/join" style="color:${BLUE}">${SITE.domain}/join</a>.</p>
     <p>Thanks for giving ${SITE.name} a try.</p>`
  );
  const text = `Your ${SITE.name} membership has been cancelled and your ${what} of ${amount} has been refunded in full. Refunds usually reach your card within 5-10 business days. Rejoin anytime: ${SITE_URL}/join`;
  await sendEmail({ to: opts.to, subject: `Your ${SITE.name} membership is cancelled and refunded`, html, text });

  const label = opts.kind === "guarantee" ? "New member cancelled within 7 days (money-back guarantee)" : "Member cancelled within 30 days of renewal";
  await sendAdminNotice(`${opts.kind === "guarantee" ? "7-day refund" : "Renewal refunded"}: ${opts.firstName} ${opts.lastName}`.trim(), label, [
    { title: "Member", rows: [
      ["Name", `${opts.firstName} ${opts.lastName}`.trim() || "—"],
      ["Email", opts.to],
      ["Member no.", digits(opts.memberNumber)],
    ]},
    { title: "Refund", rows: [
      ["Amount", amount],
      ["Stripe refund", opts.refundId],
      ["Membership", "Cancelled immediately; listing hidden"],
      ["When", nowPT()],
    ]},
  ]);
}

