import { z } from "zod";

const optStr = (max: number) => z.string().max(max).trim().optional().or(z.literal(""));

export const ContactSchema = z
  .object({
    company_website: z.string().max(0, "Bot check failed").optional().or(z.literal("")),
    firstName: z.string().min(1, "First name is required").max(50).trim(),
    lastName: z.string().min(1, "Last name is required").max(50).trim(),
    email: z.string().email("A valid email is required").max(255).trim().toLowerCase(),
    phone: z
      .string()
      .min(10, "A valid phone number is required")
      .max(20)
      .regex(/^[\d\s\-().+]+$/, "Invalid phone number")
      .trim(),
    state: optStr(2),
    message: z.string().min(1, "Please tell us how we can help").max(2000).trim(),
    referrer: z.string().max(500).optional().or(z.literal("")),
    pageUrl: z.string().max(500).optional().or(z.literal("")),
  })
  .refine((d) => !d.company_website, { message: "Bot check failed.", path: ["company_website"] });

export type ContactFormData = z.infer<typeof ContactSchema>;

export const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
] as const;

// Lead form on public member-profile pages ("Request availability").
// Honeypot + tracking metadata follow the portfolio conventions: metadata
// renders LAST in the notification email.
export const LeadSchema = z
  .object({
    company_website: z.string().max(0, "Bot check failed").optional().or(z.literal("")),
    listingId: z.string().uuid("Missing listing"),
    name: z.string().min(1, "Your name is required").max(100).trim(),
    email: z.string().email("A valid email is required").max(255).trim().toLowerCase(),
    phone: optStr(20),
    eventDate: optStr(20),
    message: z.string().min(1, "Tell them a little about your event").max(2000).trim(),
    referrer: z.string().max(500).optional().or(z.literal("")),
    pageUrl: z.string().max(500).optional().or(z.literal("")),
  })
  .refine((d) => !d.company_website, { message: "Bot check failed.", path: ["company_website"] });

export type LeadFormData = z.infer<typeof LeadSchema>;

// Member listing editor (/dashboard/profile).
export const ListingSchema = z.object({
  businessName: z.string().min(1, "Business name is required").max(120).trim(),
  contactName: optStr(100),
  categorySlug: z.string().min(1, "Check at least one attraction type you offer").max(60),
  /** Every other attraction type the business offers. */
  alsoOffer: z.array(z.string().max(60)).max(20).default([]),
  bio: z.string().max(2000).trim().optional().or(z.literal("")),
  services: z.array(z.string().max(60)).max(12).default([]),
  city: z.string().min(1, "City is required").max(80).trim(),
  state: z.string().min(2, "State is required").max(2),
  zip: z
    .string()
    .regex(/^\d{5}$/, "Enter a 5-digit ZIP code")
    .trim(),
  serviceArea: optStr(160),
  phone: optStr(20),
  website: optStr(200),
});

export type ListingFormData = z.infer<typeof ListingSchema>;
