import type { MetadataRoute } from "next";

const BASE = "https://uxcodestudio.com";

const languages = {
  "en-US": BASE,
  es: `${BASE}/es`,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${BASE}/es`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${BASE}/#services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: { "en-US": `${BASE}/#services`, es: `${BASE}/es#services` } },
    },
    {
      url: `${BASE}/es#services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/#process`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
      alternates: { languages: { "en-US": `${BASE}/#process`, es: `${BASE}/es#process` } },
    },
    {
      url: `${BASE}/es#process`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${BASE}/#pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages: { "en-US": `${BASE}/#pricing`, es: `${BASE}/es#pricing` } },
    },
    {
      url: `${BASE}/es#pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/#contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
      alternates: { languages: { "en-US": `${BASE}/#contact`, es: `${BASE}/es#contact` } },
    },
    {
      url: `${BASE}/es#contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${BASE}/#faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: { languages: { "en-US": `${BASE}/#faq`, es: `${BASE}/es#faq` } },
    },
    {
      url: `${BASE}/es#faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
