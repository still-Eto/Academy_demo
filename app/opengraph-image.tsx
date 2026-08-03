import { ImageResponse } from "next/og";

import { site } from "@/content/site.config";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time by next/og — no external image host, and it re-skins
 * with content/site.config.ts like everything else. Inherited by every route
 * that does not define its own.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: site.brand.bg,
          padding: 72,
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: site.brand.primary,
              display: "flex",
            }}
          />
          <div style={{ fontSize: 36, color: site.brand.ink, fontWeight: 600, display: "flex" }}>
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 68,
              lineHeight: 1.1,
              color: site.brand.ink,
              fontWeight: 600,
              display: "flex",
              maxWidth: 940,
            }}
          >
            Elmhurst early learning, three infants to one teacher.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              color: site.brand.inkMuted,
              display: "flex",
            }}
          >
            Six weeks to kindergarten · Openings listed by room
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 24,
            color: site.brand.inkMuted,
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: site.brand.accent,
              color: site.brand.onAccent,
              padding: "12px 22px",
              borderRadius: 10,
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            Book a Tour
          </div>
          <div style={{ display: "flex" }}>
            Licensed #{site.license.number} · NAEYC accredited · {site.hours.short}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
