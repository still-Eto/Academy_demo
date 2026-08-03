import type { MetadataRoute } from "next";

import { noIndex, site } from "@/content/site.config";

export default function robots(): MetadataRoute.Robots {
  /* A demo deployment stays out of the index entirely — see site.config.ts. */
  if (noIndex) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
