import type { MetadataRoute } from "next";
import { SITE } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/api", "/post-login", "/auth", "/unsubscribed", "/go"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
