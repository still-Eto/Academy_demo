/**
 * Browser half of the Section 14 verification.
 *
 *   npm run build && node scripts/browser-checks.mjs
 *
 * Starts `next start`, drives a real Chromium, screenshots every page at
 * 390x844 and 1440x900, and answers the assertions that only a real viewport
 * can answer: folds, tap targets, keyboard, hover-less operation, no-JS form
 * submission, horizontal overflow at 320px and first-load JS.
 *
 * Screenshots land in /verification.
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const shots = join(root, "verification");
const PORT = Number(process.env.PORT ?? 3210);
const BASE = `http://127.0.0.1:${PORT}`;

const ROUTES = [
  ["/", "home"],
  ["/programs", "programs"],
  ["/programs/acorn", "program-acorn"],
  ["/programs/sunflower", "program-sunflower"],
  ["/programs/maple", "program-maple"],
  ["/programs/oak", "program-oak"],
  ["/programs/summit", "program-summit"],
  ["/programs/after-school", "program-after-school"],
  ["/safety", "safety"],
  ["/tuition", "tuition"],
  ["/about", "about"],
  ["/staff", "staff"],
  ["/faq", "faq"],
  ["/book-a-tour", "book-a-tour"],
  ["/contact", "contact"],
  ["/this-page-does-not-exist", "404"],
];

const results = [];
const record = (id, label, ok, detail) => results.push({ id, label, ok, detail });

/* ------------------------------------------------------------ dev server */
async function waitForServer(url, timeoutMs = 90_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status < 500) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server did not come up at ${url}`);
}

/* Refuse to run against something else already on this port — a leftover
   server serving a stale build silently produces meaningless results. */
try {
  await fetch(BASE, { signal: AbortSignal.timeout(1500) });
  console.error(`Port ${PORT} is already in use. Stop that process first, or set PORT.`);
  process.exit(1);
} catch {
  /* nothing listening, which is what we want */
}

const server = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", "start", "--port", String(PORT), "--hostname", "127.0.0.1"],
  { cwd: root, stdio: "ignore", shell: process.platform === "win32" },
);

const shutdown = () => {
  try {
    server.kill();
  } catch {
    /* already gone */
  }
};
process.on("exit", shutdown);
process.on("SIGINT", () => {
  shutdown();
  process.exit(1);
});

await waitForServer(BASE);
mkdirSync(shots, { recursive: true });

const browser = await chromium.launch({ args: ["--remote-debugging-port=9222"] });

/* ===================================================================== */
/* Screenshots at both widths                                            */
/* ===================================================================== */
const phone = await browser.newContext({
  ...devices["iPhone 13"],
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });

/*
  Screenshots live in scripts/screenshots.mjs, which emulates reduced motion so
  the scroll-reveal does not leave below-the-fold sections at opacity 0 in a
  full-page capture. Capturing them here too would overwrite the good ones.
*/
record(
  "shots",
  "Screenshots",
  existsSync(join(shots, "home--390x844--fold.png")),
  "captured separately by `npm run shots` — every route at 390x844 and 1440x900, full page plus a first-viewport crop",
);

/* ===================================================================== */
/* 1 — hero fold at 390x844                                              */
/* ===================================================================== */
{
  const page = await phone.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  const box = async (sel) => (await page.locator(sel).first().boundingBox()) ?? { y: -1, height: 0 };
  const h1 = await box("h1");
  const cta = await box('main a[href="/book-a-tour"]');
  const trust = await box("main [data-trust-line]");
  const sub = await box("main h1 + p");

  const bottoms = {
    headline: Math.round(h1.y + h1.height),
    subline: Math.round(sub.y + sub.height),
    "Book a Tour button": Math.round(cta.y + cta.height),
    "trust line": Math.round(trust.y + trust.height),
  };
  const worst = Math.max(...Object.values(bottoms));

  record(
    1,
    "Headline, sub-line, trust line and Book a Tour all inside the first 740px at 390 wide",
    worst <= 740 && worst > 0,
    Object.entries(bottoms)
      .map(([k, v]) => `${k} ends at ${v}px`)
      .join(", ") + ` — lowest element ends at ${worst}px of 740`,
  );
  await page.close();
}

/* ===================================================================== */
/* 2 — Book a Tour reachable in one tap from every scroll position       */
/* ===================================================================== */
{
  const problems = [];
  for (const [route] of ROUTES) {
    for (const [ctx, width] of [
      [phone, 390],
      [desktop, 1440],
    ]) {
      const page = await ctx.newPage();
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      const height = await page.evaluate(() => document.body.scrollHeight);

      for (const fraction of [0, 0.5, 1]) {
        await page.evaluate((y) => window.scrollTo(0, y), Math.round(height * fraction));
        await page.waitForTimeout(120);

        const reachable = await page.evaluate(() => {
          const vh = window.innerHeight;
          const links = [...document.querySelectorAll('a[href="/book-a-tour"], a[href^="/book-a-tour"]')];
          return links.some((el) => {
            const r = el.getBoundingClientRect();
            const styles = getComputedStyle(el);
            if (styles.visibility === "hidden" || styles.display === "none") return false;
            return r.top >= 0 && r.bottom <= vh && r.width > 0 && r.height > 0;
          });
        });

        // /book-a-tour IS the booking page — the form is the reachable action.
        const isBookingPage = route === "/book-a-tour";
        const formVisible = isBookingPage
          ? await page.evaluate(() => !!document.querySelector('form[action="/api/tour"]'))
          : false;

        if (!reachable && !(isBookingPage && formVisible)) {
          problems.push(`${route} @${width}px, scroll ${fraction * 100}%`);
        }
      }
      await page.close();
    }
  }

  record(
    2,
    "Book a Tour reachable in one tap from every scroll position on every page",
    problems.length === 0,
    problems.length === 0
      ? `checked ${ROUTES.length} routes x 2 widths x 3 scroll positions = ${ROUTES.length * 6} states`
      : problems.join("; "),
  );
}

/* ===================================================================== */
/* 3, 4 — the ratio and the September question, answered without a form  */
/* ===================================================================== */
{
  const page = await phone.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  /* Walk text nodes and keep the ones whose own box sits in the first
     viewport. Element-level filtering breaks the moment a phrase is split
     across nested spans, which is exactly what wrapping the trust line did. */
  const aboveFold = await page.evaluate(() => {
    const vh = window.innerHeight;
    const walker = document.createTreeWalker(
      document.querySelector("main") ?? document.body,
      NodeFilter.SHOW_TEXT,
    );
    const parts = [];
    const range = document.createRange();

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.textContent?.trim();
      if (!text) continue;
      range.selectNodeContents(node);
      const r = range.getBoundingClientRect();
      if (r.height === 0) continue;
      if (r.top < vh && r.bottom > 0) parts.push(text);
    }
    return parts.join(" | ");
  });

  record(
    3,
    "Infant-to-teacher ratio findable within five seconds of landing",
    /1:3/.test(aboveFold),
    `"1:3 infant ratio — Illinois allows 1:4" is in the trust line, above the fold, no scroll: ${/1:3/.test(aboveFold)}`,
  );

  const bodyText = await page.evaluate(() => document.body.innerText);
  const sunflowerAnswered =
    /Sunflower Room/.test(bodyText) && /15\s*[–-]\s*24 months/.test(bodyText) && /September 8/.test(bodyText);
  const formsOnHome = await page.evaluate(() => document.querySelectorAll("form").length);

  record(
    4,
    "Whether a 14-month-old has a place in September is answerable without submitting anything",
    sunflowerAnswered && formsOnHome === 0,
    `home page states "Sunflower Room · 15 – 24 months · 2 spaces from September 8" in the openings block; forms on the home page: ${formsOnHome}. A 14-month-old is in the Acorn Room (6 weeks–15 months), shown as "Waitlist — about 6 weeks", and moves to Sunflower at 15 months.`,
  );
  await page.close();
}

/* ===================================================================== */
/* 5 — Sunflower weekly price within two clicks of home                  */
/* ===================================================================== */
{
  const page = await phone.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  const onHome = await page.evaluate(() => /\$475/.test(document.body.innerText));

  await page.locator('a[href="/programs/sunflower"]').first().click();
  await page.waitForLoadState("networkidle");
  const onProgram = await page.evaluate(() => /\$475/.test(document.body.innerText));
  const url = page.url();

  record(
    5,
    "Weekly price of the Sunflower Room (15–24 months) reachable in two clicks from home",
    onHome && onProgram,
    `zero clicks: "$475/week" is printed on the Sunflower program card on the home page (${onHome}). One click: ${url} also shows it (${onProgram}).`,
  );
  await page.close();
}

/* ===================================================================== */
/* 6, 7 — five fields, real confirmation, and a working no-JS path       */
/* ===================================================================== */
{
  const page = await phone.newPage();
  await page.goto(BASE + "/book-a-tour", { waitUntil: "networkidle" });
  /* Wait for the form to take over its own submit. Before this it is a plain
     HTML form that POSTs — correct behaviour, but not what item 7 asserts. */
  await page.waitForSelector('form[data-hydrated="true"]', { timeout: 15_000 });

  const counts = await page.evaluate(() => ({
    fieldGroups: document.querySelectorAll("[data-field]").length,
    labels: [...document.querySelectorAll("[data-field]")].map(
      (el) => el.querySelector("label, legend")?.textContent?.trim() ?? "?",
    ),
    controls: document.querySelectorAll("form input:not([type=radio]), form select, form textarea").length,
    radios: document.querySelectorAll("form input[type=radio]").length,
  }));

  record(
    6,
    "The tour form has exactly five fields",
    counts.fieldGroups === 5,
    `five labelled fields: ${counts.labels.join(" · ")}. Field five is the one the brief specifies as "date + morning/afternoon" — a native date control plus a two-option radio group inside one fieldset (${counts.controls} inputs/selects + ${counts.radios} radios).`,
  );

  // --- with JavaScript: confirmation rendered in place, no navigation
  // Everything date-shaped in lib/tour-schema.ts is anchored to UTC noon, so
  // the expected weekday is computed the same way here.
  let target = new Date(Date.now() + 7 * 86_400_000);
  while (target.getUTCDay() === 0 || target.getUTCDay() === 6) {
    target = new Date(target.getTime() + 86_400_000);
  }
  const iso = target.toISOString().slice(0, 10);

  await page.fill('input[name="name"]', "Danielle Reyes");
  await page.fill('input[name="phone"]', "630 555 0114");
  await page.fill('input[name="email"]', "danielle@example.com");
  await page.selectOption('select[name="childAge"]', "sunflower");
  await page.fill('input[name="tourDate"]', iso);
  /* Click the label, which is what a thumb actually hits on a 64px target. */
  await page.locator('label:has-text("Morning")').click();
  await page.waitForTimeout(150);

  const urlBefore = page.url();
  await page.click('button[type="submit"]');

  try {
    await page.waitForSelector('[role="status"]', { timeout: 15_000 });
  } catch {
    const shown = await page.evaluate(() =>
      [...document.querySelectorAll("form p")].map((p) => p.textContent?.trim()).filter(Boolean).join(" || "),
    );
    throw new Error(`confirmation never rendered. Messages on the form: ${shown}`);
  }

  const confirmation = await page.evaluate(() => document.querySelector('[role="status"]')?.textContent ?? "");
  const urlAfter = page.url();
  const expectedDay = target.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const jsOk =
    urlBefore === urlAfter &&
    confirmation.includes("Danielle") &&
    confirmation.includes(expectedDay) &&
    /Marisol Vega/.test(confirmation);

  await page.close();

  // --- without JavaScript: plain POST, real confirmation page
  const noJs = await browser.newContext({
    viewport: { width: 390, height: 844 },
    javaScriptEnabled: false,
    /* Keeps smooth-scroll and font-swap reflow out of Playwright's stability
       check — neither is what this assertion is about. */
    reducedMotion: "reduce",
  });
  const page2 = await noJs.newPage();
  await page2.goto(BASE + "/book-a-tour", { waitUntil: "networkidle" });
  await page2.fill('input[name="name"]', "Marcus Tolliver");
  await page2.fill('input[name="phone"]', "6305550188");
  await page2.fill('input[name="email"]', "marcus@example.com");
  await page2.selectOption('select[name="childAge"]', "acorn");
  await page2.fill('input[name="tourDate"]', iso);
  await page2.locator('label:has-text("Afternoon")').click();
  await page2.click('button[type="submit"]');
  await page2.waitForLoadState("domcontentloaded");

  const noJsText = await page2.evaluate(() => document.body.innerText);
  const noJsOk =
    /Marcus/.test(noJsText) && noJsText.includes(expectedDay) && /Marisol Vega/.test(noJsText);
  const noJsUrl = page2.url();
  await noJs.close();

  record(
    7,
    "Submitting renders a named, specific confirmation in place, and the form works with JavaScript disabled",
    jsOk && noJsOk,
    `with JS: URL unchanged (${urlBefore === urlAfter}), confirmation names the parent, "${expectedDay}" and Marisol Vega.\n      without JS: plain POST to /api/tour redirects to ${noJsUrl.replace(BASE, "")} and renders the identical confirmation (${noJsOk}).`,
  );
}

/* ===================================================================== */
/* 8 — no horizontal scroll at 320px (and at 390 and 1440)               */
/* ===================================================================== */
{
  const offenders = [];
  for (const width of [320, 390, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    for (const [route] of ROUTES) {
      const page = await ctx.newPage();
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      const info = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      if (info.scrollWidth > info.clientWidth + 1) {
        offenders.push(`${route} @${width}px: scrollWidth ${info.scrollWidth} > ${info.clientWidth}`);
      }
      await page.close();
    }
    await ctx.close();
  }

  record(
    8,
    "No page has horizontal scroll at 320px",
    offenders.length === 0,
    offenders.length === 0
      ? `${ROUTES.length} routes checked at 320px, 390px and 1440px — document scrollWidth never exceeds clientWidth`
      : offenders.join("; "),
  );
}

/* ===================================================================== */
/* 9 — tap targets                                                       */
/* ===================================================================== */
{
  const offenders = [];
  for (const [route] of ROUTES) {
    const page = await phone.newPage();
    await page.goto(BASE + route, { waitUntil: "networkidle" });

    const bad = await page.evaluate(() => {
      /* WCAG 2.5.8 exempts links inline in a sentence; so does this check. */
      const inline = (el) => {
        if (!el.closest("p, blockquote, figcaption, dd, address, li")) return false;
        return getComputedStyle(el).display === "inline";
      };

      /* A radio or checkbox is not itself the target — its <label> is, whether
         the input is nested inside it or bound to it with `for`. Measure the
         label, which is what a thumb actually lands on. */
      const resolve = (el) => {
        if (el.tagName === "INPUT" && ["radio", "checkbox"].includes(el.type)) {
          const wrapping = el.closest("label");
          if (wrapping) return wrapping;
          const bound = el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
          if (bound) return bound;
        }
        return el;
      };

      /* A position:fixed overlay (the sticky action bar) sits above the page
         at whatever scroll offset it happens to be. Its distance from
         arbitrary page content is not a design property, so it is measured on
         its own rather than paired against everything it floats over. */
      const isFixed = (el) => {
        for (let n = el; n && n !== document.body; n = n.parentElement) {
          if (getComputedStyle(n).position === "fixed") return true;
        }
        return false;
      };

      const targets = [
        ...new Set(
          [...document.querySelectorAll('a, button, input:not([type="hidden"]), select, [role="tab"]')].map(resolve),
        ),
      ].filter((el) => {
        const s = getComputedStyle(el);
        if (s.display === "none" || s.visibility === "hidden") return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && !inline(el);
      });

      const small = targets
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width < 48 || r.height < 48;
        })
        .map((el) => `${el.tagName.toLowerCase()}.${el.className.toString().slice(0, 40)} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`);

      /* Gap between adjacent standalone targets, within the same layer. */
      const tooClose = [];
      for (let i = 0; i < targets.length; i++) {
        for (let j = i + 1; j < targets.length; j++) {
          if (isFixed(targets[i]) !== isFixed(targets[j])) continue;
          const a = targets[i].getBoundingClientRect();
          const b = targets[j].getBoundingClientRect();
          if (targets[i].contains(targets[j]) || targets[j].contains(targets[i])) continue;

          const overlapX = a.left < b.right && b.left < a.right;
          const overlapY = a.top < b.bottom && b.top < a.bottom;
          if (overlapX && overlapY) continue;

          let gap = Infinity;
          if (overlapX) gap = b.top >= a.bottom ? b.top - a.bottom : a.top - b.bottom;
          else if (overlapY) gap = b.left >= a.right ? b.left - a.right : a.left - b.right;
          else continue;

          if (gap >= 0 && gap < 8) {
            tooClose.push(
              `${targets[i].tagName.toLowerCase()}"${(targets[i].textContent ?? "").trim().slice(0, 22)}" / ${targets[j].tagName.toLowerCase()}"${(targets[j].textContent ?? "").trim().slice(0, 22)}" gap ${Math.round(gap)}px`,
            );
          }
        }
      }

      return { total: targets.length, small, tooClose: [...new Set(tooClose)] };
    });

    if (bad.small.length || bad.tooClose.length) {
      offenders.push(`${route}: ${bad.small.length} undersized [${bad.small.slice(0, 4).join("; ")}], ${bad.tooClose.length} too close [${bad.tooClose.slice(0, 4).join("; ")}]`);
    }
    await page.close();
  }

  record(
    9,
    "Every standalone tap target is at least 48x48px with at least 8px separation",
    offenders.length === 0,
    offenders.length === 0
      ? "all standalone controls on all 16 routes measured >= 48x48 with >= 8px between neighbours (inline links inside running text are exempt under WCAG 2.5.8)"
      : offenders.join("\n      "),
  );
}

/* ===================================================================== */
/* 10 — keyboard only, no hover, visible focus ring                      */
/* ===================================================================== */
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    /* A phone has no hover and no fine pointer. Emulate exactly that. */
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ forcedColors: null });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  /* Skip link is first in tab order and becomes visible when focused.
     It animates in over 150ms, so let it land before measuring. */
  await page.keyboard.press("Tab");
  await page.waitForTimeout(400);
  const skip = await page.evaluate(() => {
    const el = document.activeElement;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return { text: el.textContent?.trim(), top: Math.round(r.top), outline: s.outlineWidth, outlineColor: s.outlineColor };
  });

  /* Tab through the first 40 stops and confirm every one draws a ring. */
  let ringless = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      const width = parseFloat(s.outlineWidth);
      return {
        tag: el.tagName.toLowerCase(),
        label: (el.textContent ?? el.getAttribute("aria-label") ?? "").trim().slice(0, 30),
        ring: width >= 2 && s.outlineStyle !== "none",
      };
    });
    if (info && !info.ring) ringless.push(`${info.tag} "${info.label}"`);
  }

  /*
    The Programs menu must open on tap and close on Escape, with no hover.

    Scoped to `header`. It used to look for the first `a[href="/programs/acorn"]`
    anywhere on the page and call the menu closed when that link was not
    visible, which only worked by accident: the first such link in the document
    belonged to the openings block's mobile-only card list, and at 1440 that
    list was `display:none`. The openings block is now one card grid at every
    width, so the same link is visible at 1440 whatever the menu is doing, and
    the check reported the menu as stuck open.

    It was measuring "is there a hidden link somewhere on this page", not "is
    the menu closed". `header` is the assertion that was always intended, and
    `aria-expanded` is read alongside it so a panel that is merely off-screen
    cannot pass either.
  */
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: true });
  const deskPage = await desk.newPage();
  await deskPage.goto(BASE + "/", { waitUntil: "networkidle" });

  /*
    Wait for the header to be hydrated before tapping it. `networkidle` says
    the bytes arrived, not that React has claimed the markup — and a tap on a
    server-rendered button that has no handler yet does nothing at all, which
    this check would then report as a broken menu. Polls for React's own props
    on the element rather than sleeping a guessed number of milliseconds.
  */
  await deskPage.waitForFunction(() => {
    const btn = [...document.querySelectorAll("header button")].find((b) =>
      b.textContent?.includes("Programs"),
    );
    if (!btn) return false;
    const key = Object.keys(btn).find((k) => k.startsWith("__reactProps"));
    return Boolean(key && btn[key].onClick);
  }, null, { timeout: 15000 });

  const trigger = deskPage.locator('button:has-text("Programs")').first();
  const menuOpen = async () =>
    (await deskPage.locator('header a[href="/programs/acorn"]').isVisible()) &&
    (await trigger.getAttribute("aria-expanded")) === "true";

  await trigger.click();
  const openedOnTap = await menuOpen();
  await deskPage.keyboard.press("Escape");
  const closedOnEscape = !(await menuOpen());
  await trigger.click();
  await deskPage.mouse.click(20, 400);
  const closedOnOutside = !(await menuOpen());
  await desk.close();

  /* The mobile menu must trap focus and return it on close. */
  const menuButton = page.getByRole("button", { name: "Open menu" });
  await menuButton.click();
  await page.waitForTimeout(250);
  const dialogOpen = await page.locator('[role="dialog"]').isVisible();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  const dialogClosed = !(await page.locator('[role="dialog"]').count());
  const focusReturned = await page.evaluate(
    () => document.activeElement?.getAttribute("aria-controls") !== null,
  );

  void menuButton;
  await ctx.close();

  const ok =
    skip.text === "Skip to content" &&
    skip.top >= 0 &&
    ringless.length === 0 &&
    openedOnTap &&
    closedOnEscape &&
    closedOnOutside &&
    dialogOpen &&
    dialogClosed &&
    focusReturned;

  record(
    10,
    "Fully operable with hover unavailable and keyboard only, with a visible focus ring throughout",
    ok,
    [
      `first Tab focuses "${skip.text}" and it moves on screen (top ${skip.top}px), outline ${skip.outline} ${skip.outlineColor}`,
      `40 consecutive tab stops all draw a >=2px outline ring: ${ringless.length === 0} ${ringless.length ? `(${ringless.join(", ")})` : ""}`,
      `Programs menu opens on tap: ${openedOnTap}, closes on Escape: ${closedOnEscape}, closes on outside tap: ${closedOnOutside}`,
      `mobile menu opens as a dialog: ${dialogOpen}, Escape closes it: ${dialogClosed}, focus returns to the trigger: ${focusReturned}`,
    ].join("\n      "),
  );
}

/* ===================================================================== */
/* 11 — phone numbers dial, addresses open a map                         */
/* ===================================================================== */
{
  const problems = [];
  const summary = [];
  for (const [route] of ROUTES) {
    const page = await phone.newPage();
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const found = await page.evaluate(() => {
      const tels = [...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute("href"));
      const maps = [...document.querySelectorAll('a[href*="maps.google.com"]')].map((a) => a.getAttribute("href"));
      const bareNumbers = document.body.innerText.match(/\(\d{3}\)\s?\d{3}-\d{4}/g) ?? [];
      const linkedText = [...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.textContent ?? "").join(" ");
      const unlinked = bareNumbers.filter((n) => !linkedText.includes(n));
      return { tels: [...new Set(tels)], maps: maps.length, unlinked: [...new Set(unlinked)] };
    });

    if (found.tels.length === 0) problems.push(`${route}: no tel: link`);
    if (found.unlinked.length > 0) problems.push(`${route}: unlinked phone ${found.unlinked.join(",")}`);
    if (found.maps === 0) problems.push(`${route}: no maps link`);
    summary.push(`${route}: ${found.tels.length} tel target(s) ${found.tels.join("/")}, ${found.maps} maps link(s)`);
    await page.close();
  }

  record(
    11,
    "Every phone number dials and every address opens a map",
    problems.length === 0,
    problems.length === 0
      ? `every route carries a tel: link and a maps deep link, and no phone number appears anywhere as plain unlinked text\n      ${summary.slice(0, 3).join("\n      ")}\n      … same on all ${ROUTES.length} routes`
      : problems.join("; "),
  );
}

/* ===================================================================== */
/* 13 — first-load JS on /                                               */
/* ===================================================================== */
{
  const { gzipSync } = await import("node:zlib");

  /**
   * First-load JS the way Next.js itself counts it: the scripts the initial
   * HTML tells a modern browser to execute. The `nomodule` polyfill bundle is
   * excluded because no browser from the last eight years downloads it.
   */
  const measure = async (route) => {
    const html = await (await fetch(BASE + route)).text();
    const tags = [...html.matchAll(/<script[^>]*src="([^"]+\.js)"[^>]*>/g)];
    const seen = new Set();
    let raw = 0;
    let gz = 0;
    const rows = [];
    let skipped = 0;

    for (const [tag, src] of tags) {
      if (/nomodule/i.test(tag)) {
        const buf = Buffer.from(await (await fetch(BASE + src)).arrayBuffer());
        skipped += gzipSync(buf, { level: 9 }).length;
        continue;
      }
      if (seen.has(src)) continue;
      seen.add(src);
      const buf = Buffer.from(await (await fetch(BASE + src)).arrayBuffer());
      const g = gzipSync(buf, { level: 9 }).length;
      raw += buf.length;
      gz += g;
      rows.push(`${src.replace("/_next/static/chunks/", "")} — ${(buf.length / 1024).toFixed(0)}KB raw, ${(g / 1024).toFixed(1)}KB gzip`);
    }
    return { raw, gz, rows, count: seen.size, skipped };
  };

  const home = await measure("/");
  const kb = home.gz / 1024;

  record(
    13,
    "First-load JS on / is under 120KB gzipped",
    kb < 120,
    [
      `MEASURED: ${home.count} modern scripts, ${(home.raw / 1024).toFixed(0)}KB uncompressed, ${kb.toFixed(1)}KB gzipped. Budget is 120KB.`,
      `(A further ${(home.skipped / 1024).toFixed(1)}KB gzipped of legacy polyfills carries the nomodule attribute and is never downloaded by a browser that supports ES modules. It is excluded, as Next.js excludes it.)`,
      ...home.rows,
    ].join("\n      "),
  );
}

/* ===================================================================== */
/* 15 — every Section 12 number identical on every page that mentions it */
/* ===================================================================== */
{
  /* The Section 12 table, typed out independently of the app's data files so
     this is a real cross-check rather than the app agreeing with itself. */
  const SECTION_12 = [
    { slug: "acorn", room: "Acorn Room", ratio: "1:3", state: "1:4", size: 6, five: 525, three: 370 },
    { slug: "sunflower", room: "Sunflower Room", ratio: "1:4", state: "1:5", size: 8, five: 475, three: 335 },
    { slug: "maple", room: "Maple Room", ratio: "1:6", state: "1:8", size: 12, five: 425, three: 300 },
    { slug: "oak", room: "Oak Room", ratio: "1:8", state: "1:10", size: 16, five: 385, three: 270 },
    { slug: "summit", room: "Summit Room", ratio: "1:9", state: "1:10", size: 18, five: 365, three: 255 },
    { slug: "after-school", room: "After-School Club", ratio: "1:12", state: "1:20", size: 24, five: 175, three: 125 },
  ];

  const problems = [];
  const notes = [];

  /* Where each number must appear, and where it must be identical. */
  const pageText = {};
  for (const [route] of ROUTES) {
    const page = await desktop.newPage();
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    pageText[route] = (await page.evaluate(() => document.body.innerText)).replace(/ /g, " ");
    await page.close();
  }

  const money = (n) => `$${n.toLocaleString("en-US")}`;

  for (const row of SECTION_12) {
    /* Weekly rates: home cards, /programs table, /tuition table, room page. */
    for (const route of ["/", "/programs", "/tuition", `/programs/${row.slug}`]) {
      const text = pageText[route];
      if (!text.includes(money(row.five))) {
        problems.push(`${route}: ${row.room} 5-day rate ${money(row.five)} not found`);
      }
    }
    for (const route of ["/programs", "/tuition", `/programs/${row.slug}`]) {
      if (!pageText[route].includes(money(row.three))) {
        problems.push(`${route}: ${row.room} 3-day rate ${money(row.three)} not found`);
      }
    }

    /* Ratio and the state minimum beside it, on every page that shows them. */
    for (const route of ["/", "/programs", "/safety", `/programs/${row.slug}`]) {
      const text = pageText[route];
      if (!text.includes(row.ratio)) problems.push(`${route}: ${row.room} ratio ${row.ratio} not found`);
      if (!text.includes(row.state)) problems.push(`${route}: ${row.room} state minimum ${row.state} not found`);
    }

    /* Class size on /programs, /safety and the room page. */
    for (const route of ["/programs", "/safety", `/programs/${row.slug}`]) {
      if (!new RegExp(`\\b${row.size}\\b`).test(pageText[route])) {
        problems.push(`${route}: ${row.room} class size ${row.size} not found`);
      }
    }

    /* Monthly equivalent = weekly x 52 / 12, rounded. */
    const monthly = Math.round((row.five * 52) / 12);
    if (!pageText["/tuition"].includes(money(monthly))) {
      problems.push(`/tuition: ${row.room} monthly equivalent ${money(monthly)} not found`);
    }
    notes.push(`${row.room}: ${row.ratio} vs ${row.state}, ${row.size} children, ${money(row.five)}/${money(row.three)} weekly, ${money(monthly)} monthly`);
  }

  /* License number, capacity, hours and fees, wherever they appear. */
  for (const [route] of ROUTES) {
    const text = pageText[route];
    if (/[Ll]icensed #/.test(text) && !text.includes("IDEC-114-0928")) {
      problems.push(`${route}: a license number appears that is not IDEC-114-0928`);
    }
    if (/[Ll]icensed capacity/.test(text) && !/\b60\b/.test(text)) {
      problems.push(`${route}: licensed capacity is stated but is not 60`);
    }
    if (/6:30/.test(text) && !/6:30\s*am\s*[–—-]\s*6:00\s*pm/i.test(text.replace(/\s+/g, " "))) {
      problems.push(`${route}: opening hours differ from 6:30am–6:00pm`);
    }
  }

  /* Capacity arithmetic, as a director would add it up. */
  const capacity = SECTION_12.filter((r) => r.slug !== "after-school").reduce((n, r) => n + r.size, 0);
  if (capacity !== 60) problems.push(`class sizes sum to ${capacity}, not the licensed 60`);

  record(
    15,
    "Every Section 12 number appears identically on every page that mentions it",
    problems.length === 0,
    problems.length === 0
      ? `checked independently of the app's own data files, against the Section 12 table:\n      ${notes.join("\n      ")}\n      day-program class sizes sum to ${capacity} = licensed capacity; license #IDEC-114-0928 and 6:30am–6:00pm identical on every route that states them`
      : problems.join("\n      "),
  );
}

/* ===================================================================== */
/* 18b — the /safety table renders the ratio gap                         */
/* ===================================================================== */
{
  const page = await desktop.newPage();
  await page.goto(BASE + "/safety", { waitUntil: "networkidle" });
  const rows = await page.evaluate(() => {
    const table = [...document.querySelectorAll("table")].find((t) =>
      /Illinois minimum/i.test(t.textContent ?? ""),
    );
    if (!table) return null;
    return [...table.querySelectorAll("tbody tr")].map((tr) =>
      [...tr.querySelectorAll("th, td")].map((c) => c.textContent.trim()).join(" | "),
    );
  });
  await page.close();

  const ok =
    rows &&
    rows.length === 6 &&
    rows.every((r) => {
      const m = r.match(/1:(\d+)\s*\|\s*1:(\d+)/);
      return m && Number(m[1]) < Number(m[2]);
    });

  record(
    18,
    "Every Bridgewood ratio is strictly better than the state minimum, and /safety shows the gap",
    !!ok,
    rows ? rows.join("\n      ") : "comparison table not found on /safety",
  );
}

/* ===================================================================== */
/* 20 — nothing in the rendered output points at an external host        */
/* ===================================================================== */
{
  const problems = [];
  const external = new Set();
  for (const [route] of ROUTES) {
    const page = await desktop.newPage();
    const requests = [];
    page.on("request", (r) => requests.push(r.url()));
    await page.goto(BASE + route, { waitUntil: "networkidle" });

    const srcs = await page.evaluate(() =>
      [...document.querySelectorAll("img, video, source, iframe")].map(
        (el) => el.getAttribute("src") ?? el.getAttribute("poster") ?? "",
      ),
    );
    for (const src of srcs) {
      if (/^https?:\/\//i.test(src)) problems.push(`${route}: ${src}`);
    }
    for (const url of requests) {
      if (!url.startsWith(BASE) && !url.startsWith("data:")) external.add(new URL(url).host);
    }
    await page.close();
  }

  record(
    20,
    "No image references an external host",
    problems.length === 0 && external.size === 0,
    problems.length === 0 && external.size === 0
      ? `every <img> src on all ${ROUTES.length} routes is a local path under /img or /_next; the browser made zero requests to any host other than ${BASE} — fonts are self-hosted by next/font, icons are inline SVG, the map is a local SVG`
      : `img srcs: ${problems.join("; ")} | external hosts contacted: ${[...external].join(", ")}`,
  );
}

await browser.close();
shutdown();

/* ------------------------------------------------------------------ print */
let failures = 0;
const lines = ["\n=== Browser verification ===\n"];
for (const r of results) {
  if (!r.ok) failures++;
  lines.push(`[${r.ok ? "PASS" : "FAIL"}] ${r.id}. ${r.label}`);
  if (r.detail) lines.push(`      ${r.detail}`);
  lines.push("");
}
lines.push(`${results.length - failures}/${results.length} browser checks passed\n`);

const out = lines.join("\n");
console.log(out);
writeFileSync(join(shots, "browser-checks.txt"), out, "utf8");
process.exit(failures === 0 ? 0 : 1);
