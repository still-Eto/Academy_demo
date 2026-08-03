import Link from "next/link";

import { Logomark, Phone } from "@/components/icons";
import { DevOverflowProbe } from "@/components/client-bits";
import { JsonLd, organizationLd } from "@/components/json-ld";
import { fullAddress, mapsHref, site } from "@/content/site.config";

/**
 * The booking page is a purpose-built landing page, not a page with a form on
 * it. The header carries the logo and a phone number and nothing else, there
 * is no sticky action bar competing with the form, and the footer is reduced
 * to the credentials — no navigation to click away to.
 */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd data={organizationLd} />

      <header className="border-b border-line bg-bg">
        <div className="shell flex h-[60px] items-center justify-between gap-3 lg:h-[76px]">
          <Link href="/" className="flex items-center gap-2.5 py-2 text-brand" aria-label={`${site.name} home`}>
            <Logomark className="h-8 w-8 lg:h-9 lg:w-9" />
            <span className="font-serif text-[1.0625rem] leading-tight font-semibold text-ink lg:text-xl">
              {site.name}
            </span>
          </Link>

          <a
            href={site.phone.href}
            className="flex min-h-[48px] items-center gap-2 font-semibold text-brand underline underline-offset-4"
          >
            <Phone className="h-5 w-5" />
            <span className="hidden sm:inline">{site.phone.display}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="on-dark bg-brand text-bg">
        <div className="shell py-9">
          <p className="text-[0.9375rem] leading-relaxed text-bg/85">{site.name}</p>
          <address className="mt-2 flex flex-col gap-2 not-italic text-[0.9375rem] text-bg/85">
            <a href={mapsHref} className="flex min-h-[48px] items-center underline underline-offset-4">
              {fullAddress}
            </a>
            <a
              href={site.phone.href}
              className="flex min-h-[48px] items-center font-semibold underline underline-offset-4"
            >
              {site.phone.display}
            </a>
          </address>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-bg/70">
            Licensed #{site.license.number}, {site.license.agency}. {site.accreditations[0].label}.{" "}
            {site.hours.display}.
          </p>
          <p className="mt-4 text-[0.8125rem] text-bg/60">
            © {new Date().getFullYear()} {site.name}.
          </p>
        </div>
      </footer>

      <DevOverflowProbe />
    </div>
  );
}
