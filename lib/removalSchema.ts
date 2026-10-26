import { z } from "zod";
import { cleanText } from "./sanitize";

// "Please remove my business from the directory" — public form.
export const RELATIONSHIPS = ["Owner", "Employee or authorized representative", "Other"] as const;

export const RemovalSchema = z.object({
  company_website: z.string().max(0, "Bot check failed").optional().or(z.literal("")), // honeypot
  listingSlug: z.string().regex(/^[a-z0-9-]{1,80}$/).optional().or(z.literal("")),
  businessName: z.string().min(1, "Business name is required").max(120).transform(cleanText),
  cityState: z.string().max(120).transform(cleanText).optional().or(z.literal("")),
  requesterName: z.string().min(1, "Your name is required").max(100).transform(cleanText),
  email: z.string().email("A valid email is required").max(255).trim().toLowerCase(),
  phone: z.string().max(20).regex(/^[\d\s\-().+]*$/, "Invalid phone number").trim().optional().or(z.literal("")),
  relationship: z.enum(RELATIONSHIPS, { message: "Tell us how you're connected to the business" }),
  reason: z.string().max(1000).transform(cleanText).optional().or(z.literal("")),
  confirm: z.literal(true, { message: "Please confirm you're authorized to request this" }),
  referrer: z.string().max(500).optional().or(z.literal("")),
  pageUrl: z.string().max(500).optional().or(z.literal("")),
});

export type RemovalData = z.infer<typeof RemovalSchema>;
