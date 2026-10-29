import { faqs } from "@/content/faq";
import { programs } from "@/content/programs";
import { fullAddress, site } from "@/content/site.config";

/**
 * Structured data. Rendered as a script tag with JSON.stringify output, so it
 * is always syntactically valid — invalid JSON-LD is worse than none.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: site.address.street,
  addressLocality: site.address.city,
  addressRegion: site.address.state,
  postalCode: site.address.zip,
  addressCountry: "US",
};

const openingHours = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: site.hours.days.map((d) => `https://schema.org/${d}`),
  opens: site.hours.opens,
  closes: site.hours.closes,
};

/** ChildCare + Preschool + LocalBusiness, with geo, hours, phone and address. */
export const organizationLd = {
  "@context": "https://schema.org",
  "@type": ["ChildCare", "Preschool", "LocalBusiness"],
  "@id": `${site.url}/#organization`,
  name: site.name,
  description: `${site.name} is a licensed early learning center in ${site.address.city}, ${site.address.state}, taking children from six weeks through kindergarten plus after-school care to age 10. 1:3 infant ratio against an Illinois minimum of 1:4.`,
  url: site.url,
  telephone: site.phone.display,
  email: site.email,
  address: postalAddress,
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.address.lat,
    longitude: site.address.lng,
  },
  openingHoursSpecification: [openingHours],
  foundingDate: String(site.founded),
  areaServed: {
    "@type": "City",
    name: `${site.address.city}, ${site.address.state}`,
  },
  hasCredential: site.accreditations.map((a) => a.label),
  identifier: {
    "@type": "PropertyValue",
    name: `${site.license.agency} license`,
    value: site.license.number,
  },
  employee: {
    "@type": "Person",
    name: site.director.name,
    jobTitle: site.director.role,
  },
  makesOffer: programs.map((p) => ({
    "@type": "Offer",
    name: `${p.label} — ${p.ages}`,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: p.rate5,
      priceCurrency: "USD",
      unitText: "week",
    },
    availability:
      p.availability.kind === "waitlist"
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
    url: `${site.url}/programs/${p.slug}`,
  })),
};

/** A function, so the answers with dates are read on the day the page is rendered. */
export const faqLd = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a.join(" "),
    },
  })),
});

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export const addressForLd = fullAddress;
