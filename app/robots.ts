import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/static/", "/admin/", "/pay/"],
      },
    ],
    sitemap: "https://uxcodestudio.com/sitemap.xml",
    host: "https://uxcodestudio.com",
  };
}
