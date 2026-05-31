import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/practice",
        "/review",
        "/progress",
        "/about",
        "/login",
        "/auth/",
      ],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
