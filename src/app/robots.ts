import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || "https://example.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/*", "/login"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
