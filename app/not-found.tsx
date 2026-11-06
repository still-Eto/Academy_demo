import Link from "next/link";

import { ArrowRight } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyActionBar } from "@/components/sticky-action-bar";
import { headerRooms } from "@/content/programs";
import { site } from "@/content/site.config";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** Short, human and useful. Not a cartoon. */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader rooms={headerRooms} />
      <main id="main" className="has-action-bar flex-1">
        <div className="shell section">
          <p className="eyebrow mb-3">404</p>
          <h1 className="measure-tight text-[2rem] leading-[1.1] lg:text-[3rem]">
            Sorry, that page has moved or never existed.
          </h1>
          <p className="measure mt-5 text-[1.0625rem] leading-relaxed text-muted lg:text-[1.1875rem]">
            Here are the three pages people are usually looking for. Or call{" "}
            <a href={site.phone.href} className="font-semibold text-brand underline underline-offset-4">
              {site.phone.display}
            </a>{" "}
            and ask {site.director.firstName} directly.
          </p>

          <ul className="mt-9 space-y-3">
            {[
              { href: "/programs", label: "The six rooms", detail: "Ages, ratios, hours and weekly rates" },
              { href: "/tuition", label: "Tuition", detail: "Every rate and both fees, on one page" },
              { href: "/book-a-tour", label: "Book a tour", detail: "45 minutes, and you meet the teacher" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="card flex items-center gap-4 p-5">
                  <span className="flex-1">
                    <span className="block font-serif text-[1.125rem] font-semibold">
                      {link.label}
                    </span>
                    <span className="mt-0.5 block text-[0.9375rem] text-muted">{link.detail}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 text-brand" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
      <StickyActionBar />
    </div>
  );
}
