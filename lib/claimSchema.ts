import { z } from "zod";
import { cleanText } from "./sanitize";

// "This listing is mine" — public form on /claim.
export const ClaimSchema = z.object({
  company_website: z.string().max(0, "Bot check failed").optional().or(z.literal("")), // honeypot
  listingSlug: z.string().regex(/^[a-z0-9-]{1,80}$/, "Missing listing"),
  name: z.string().min(1, "Your name is required").max(100).transform(cleanText),
  email: z.string().email("A valid email is required").max(255).trim().toLowerCase(),
  phone: z
    .string()
    .min(10, "A valid phone number is required")
    .max(20)
    .regex(/^[\d\s\-().+]+$/, "Invalid phone number")
    .trim(),
  confirm: z.literal(true, { message: "Please confirm this is your business" }),
  referrer: z.string().max(500).optional().or(z.literal("")),
  pageUrl: z.string().max(500).optional().or(z.literal("")),
});
