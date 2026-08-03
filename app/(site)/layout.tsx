import { DevOverflowProbe, RevealObserver } from "@/components/client-bits";
import { JsonLd, organizationLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyActionBar } from "@/components/sticky-action-bar";
import { headerRooms } from "@/content/programs";

/**
 * Every page except /book-a-tour, which is a distraction-free landing page and
 * has its own layout.
 *
 * `has-action-bar` adds bottom padding to <main> so the sticky bar can never
 * cover the last line of content.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    /* `relative` is the anchor for the overlay header. On the home page the
       header is absolutely positioned at the top of this box before JavaScript
       lifts it to `fixed` — see the note in components/site-header.tsx. */
    <div className="relative flex min-h-dvh flex-col">
      <JsonLd data={organizationLd} />
      <SiteHeader rooms={headerRooms} />
      <main id="main" className="has-action-bar flex-1">
        {children}
      </main>
      <SiteFooter />
      <StickyActionBar />
      <RevealObserver />
      <DevOverflowProbe />
    </div>
  );
}
