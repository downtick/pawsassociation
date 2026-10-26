import { sendEmail } from "./smtp2go";
import { wrap, esc } from "./emails";
import { SITE } from "./siteConfig";
import { PRICE_DOLLARS, RENEWAL_REFUND_DAYS } from "./membershipPolicy";

// The member welcome series + billing reminders, sent by the daily cron
// (app/api/cron/member-emails). Plain, useful, no invented claims: every
// email points at something that exists in the member dashboard.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pawsassociation.com";
const BLUE = "#2563EB";
const ORANGE_DEEP = "#C2410C";
const MUTED = "#64748B";

export type SeriesKey = "listing" | "course" | "benefits" | "share" | "checkin";
export type BillingKey = "renewal_reminder";

const cta = (href: string, label: string) =>
  `<p style="margin:22px 0"><a href="${href}" style="display:inline-block;background:${ORANGE_DEEP};color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 22px;border-radius:9px">${label} &rarr;</a></p>`;

function footer(unsubscribeUrl?: string): string {
  return `<br/>${esc(SITE.mailingAddress)}${
    unsubscribeUrl
      ? `<br/>You're receiving this because you're a ${SITE.name} member. <a href="${unsubscribeUrl}" style="color:${MUTED}">Unsubscribe from tips emails</a> (billing notices still come).`
      : ""
  }`;
}

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", month: "long", day: "numeric", year: "numeric" });

export interface SeriesContext {
  to: string;
  firstName: string;
  unsubscribeUrl: string;
  listingSlug?: string | null;
  leadCount?: number;
}

const SERIES: Record<SeriesKey, (c: SeriesContext) => { subject: string; title: string; html: string; text: string }> = {
  listing: (c) => ({
    subject: "Finish your PAWS listing so planners can find you",
    title: "Your listing is the part that brings in work",
    html: `<p>Hi ${esc(c.firstName) || "there"},</p>
      <p>Event planners, schools, and families search the PAWS directory by attraction type and city. Your listing is how they find you, and it goes live once you've filled it in and we've given it a quick review.</p>
      <p>It takes about ten minutes: business name, attraction types, the area you serve, a short description, and any extra services in the notes box.</p>
      ${cta(`${SITE_URL}/dashboard/profile`, "Finish my listing")}`,
    text: `Finish your PAWS listing so planners can find you: ${SITE_URL}/dashboard/profile`,
  }),
  course: (c) => ({
    subject: "Lesson 1: Google Business Profile for mobile animal businesses",
    title: "Start the 11-lesson marketing course",
    html: `<p>Hi ${esc(c.firstName) || "there"},</p>
      <p>Your membership includes an 11-lesson marketing course written for animal attractions. Lesson 1 covers setting up a Google Business Profile when you don't have a storefront: service areas, categories, photos, and a ten-minute weekly routine.</p>
      <p>Your printable business tools are ready too: a rate sheet, an inquiry intake form, a site-visit checklist, an event-day run sheet, and event signs.</p>
      ${cta(`${SITE_URL}/dashboard/articles`, "Open lesson 1")}
      <p><a href="${SITE_URL}/dashboard/downloads" style="color:${BLUE}">See the printable downloads</a></p>`,
    text: `Start the PAWS marketing course: ${SITE_URL}/dashboard/articles\nPrintable downloads: ${SITE_URL}/dashboard/downloads`,
  }),
  benefits: (c) => ({
    subject: "Your PAWS member benefits",
    title: "Partner discounts in your benefits vault",
    html: `<p>Hi ${esc(c.firstName) || "there"},</p>
      <p>The member benefits vault collects partner offers in one place: travel and rentals for hauling to events, business tools like hosting, bookkeeping and virtual assistants, animal supplies, and more.</p>
      <p>Each listing shows exactly how to use the offer. Some are affiliate partnerships, which is disclosed on the page.</p>
      ${cta(`${SITE_URL}/dashboard/perks`, "Browse my benefits")}`,
    text: `Browse your PAWS member benefits: ${SITE_URL}/dashboard/perks`,
  }),
  share: (c) => {
    const profileUrl = c.listingSlug ? `${SITE_URL}/members/${c.listingSlug}` : `${SITE_URL}/dashboard/profile`;
    return {
      subject: "Put your PAWS profile to work",
      title: "Share your profile and collect reviews",
      html: `<p>Hi ${esc(c.firstName) || "there"},</p>
        <p>${c.listingSlug ? "Your public PAWS profile is a page you can share anywhere:" : "Once your listing is live, you'll have a public profile page to share:"}</p>
        <p style="word-break:break-all"><a href="${profileUrl}" style="color:${BLUE}">${profileUrl}</a></p>
        <p>Two quick wins: add the link to your website, social bios, and email signature, and send it to past clients when you ask them for a review. The course lesson on building a review engine walks through exactly what to say.</p>
        ${cta(`${SITE_URL}/dashboard/articles`, "Open the review lesson")}`,
      text: `Share your PAWS profile: ${profileUrl}\nReview lesson: ${SITE_URL}/dashboard/articles`,
    };
  },
  checkin: (c) => ({
    subject: "Two months in: how is PAWS working for you?",
    title: "A quick check-in",
    html: `<p>Hi ${esc(c.firstName) || "there"},</p>
      <p>You've been a member for about two months. ${
        typeof c.leadCount === "number"
          ? `Your listing has received <strong>${c.leadCount}</strong> inquir${c.leadCount === 1 ? "y" : "ies"} so far; you can see them all in your leads inbox.`
          : "Your leads inbox shows every inquiry your listing receives."
      }</p>
      <p>We'd love to hear how it's going. Just reply to this email: what's working, what isn't, and what you'd like PAWS to add. If you're happy with your membership and don't mind us quoting you on the site, say so in your reply. We only ever quote members with their permission.</p>
      ${cta(`${SITE_URL}/dashboard/leads`, "View my leads")}`,
    text: `How is PAWS working for you? Reply to this email and tell us. Your leads: ${SITE_URL}/dashboard/leads`,
  }),
};

export async function sendSeriesEmail(key: SeriesKey, c: SeriesContext) {
  const e = SERIES[key](c);
  return sendEmail({
    to: c.to,
    subject: e.subject,
    html: wrap(e.title, e.html, footer(c.unsubscribeUrl)),
    text: `${e.text}\n\n${SITE.mailingAddress}\nUnsubscribe from tips emails: ${c.unsubscribeUrl}`,
  });
}

// Billing notices are transactional: they go to every paying member (even if
// they unsubscribed from tips), because they're about money and renewal.
export async function sendBillingNotice(key: BillingKey, c: { to: string; firstName: string; date: Date }) {
  const date = fmtDate(c.date);
  const billing = `${SITE_URL}/dashboard/billing`;
  const e = {
    subject: `Your PAWS membership renews ${date}`,
    title: "Your membership renews soon",
    html: `<p>Hi ${esc(c.firstName) || "there"},</p>
      <p>Your ${SITE.name} membership renews automatically on <strong>${date}</strong> for <strong>$${PRICE_DOLLARS}</strong>, charged to your card on file. You don't need to do anything to keep your listing and benefits.</p>
      <p>To stop the renewal, cancel online anytime before then. And if you cancel within ${RENEWAL_REFUND_DAYS} days after the renewal charge, we'll refund it in full.</p>
      ${cta(billing, "Manage my membership")}`,
    text: `Your PAWS membership renews ${date} for $${PRICE_DOLLARS}. Manage or cancel: ${billing}. Cancel within ${RENEWAL_REFUND_DAYS} days after renewal for a full refund.`,
  };
  return sendEmail({
    to: c.to,
    subject: e.subject,
    html: wrap(e.title, e.html, footer()),
    text: `${e.text}\n\n${SITE.mailingAddress}`,
  });
}
