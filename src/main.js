// Style.ai marketing site — runtime.
//
// Editorial site runtime. Four concerns: analytics + consent, desktop-only
// smooth scroll, scroll-reveal choreography, and two section-specific helpers
// (sticky CTA visibility + hero verdict rotation).
//
// Anti-pattern audit: the prior runtime (937 lines) had initNav, carousel,
// download modal, feature-reveal, count-up, and a nav bar built around the
// maroon palette. All deleted — the new editorial IA has none of those
// surfaces. Scroll-reveal + store-click tracking are the only primitives
// carried over verbatim.

import "./style.css";
import "lenis/dist/lenis.css";
import Lenis from "lenis";

const MD = 768;

// ── Hero A/B/C variant tag ───────────────────────────────────────────
// Read once at module scope. Source of truth is the `data-variant`
// attribute stamped onto <html> by scripts/build-variants.mjs at build
// time (`a`, `b`, or `c`). Falls back to the `sa_v` cookie set by the
// edge middleware. Returns `null` when neither is present — e.g., on
// ad-lander pages or local dev runs that bypass the middleware. A null
// variant means "do not tag" — GA4 and Meta Pixel receive no variant
// dimension, keeping reporting clean.

/** @type {"a" | "b" | "c" | null} */
const HERO_VARIANT = (() => {
  const fromDom = document.documentElement.getAttribute("data-variant");
  if (fromDom === "a" || fromDom === "b" || fromDom === "c") return fromDom;
  const match = document.cookie.match(/(?:^|;\s*)sa_v=([abc])\b/);
  return match ? /** @type {"a" | "b" | "c"} */ (match[1]) : null;
})();

// ── Store links ──────────────────────────────────────────────────────

const IOS_FALLBACK =
  "https://apps.apple.com/in/search?term=Style%20AI%20stylist%20outfit%20planner&media=software";
const ANDROID_FALLBACK =
  "https://play.google.com/store/search?q=Style+AI+stylist+outfit+planner&c=apps&hl=en&gl=in";

function initStoreLinks() {
  const ios = import.meta.env.VITE_APP_STORE_IOS_URL;
  const android = import.meta.env.VITE_APP_STORE_ANDROID_URL;
  document.querySelectorAll("a[data-store-link]").forEach((a) => {
    const k = a.getAttribute("data-store-link");
    if (k === "ios") {
      if (ios) a.href = ios;
      else if (/^https:\/\/apps\.apple\.com\/?$/i.test(a.href.trim())) a.href = IOS_FALLBACK;
    }
    if (k === "android") {
      if (android) a.href = android;
      else if (/^https:\/\/play\.google\.com\/store\/?$/i.test(a.href.trim())) {
        a.href = ANDROID_FALLBACK;
      }
    }
  });
}

// ── Analytics + consent gate ─────────────────────────────────────────
// GA4 only loads after explicit consent (stored in localStorage). The
// consent bar markup is built inline here so it stays decoupled from the
// editorial stylesheet — neutral utility classes, ink-on-paper.

/** @param {string} name @param {Record<string, unknown>} [params] */
function gaEvent(name, params) {
  if (typeof window.gtag !== "function") return;
  // Tag every event with the hero variant so GA4 reports can split by
  // `variant` (registered as a custom dimension in the GA4 property).
  // `gtag('set', ...)` after config also propagates this globally — we
  // stamp per-event as belt-and-braces so standalone calls are safe.
  const merged = HERO_VARIANT
    ? { ...(params || {}), variant: HERO_VARIANT }
    : params || {};
  window.gtag("event", name, merged);
}

const ANALYTICS_CONSENT_KEY = "style_ai_analytics_consent_v1";

function analyticsConsentStored() {
  try {
    return localStorage.getItem(ANALYTICS_CONSENT_KEY);
  } catch {
    return null;
  }
}

function setAnalyticsConsent(value) {
  try {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  } catch {
    /* private mode / blocked storage */
  }
}

function ensureGtagStub() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
}

function gtagConsentDefaultDenied() {
  ensureGtagStub();
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    personalization_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500,
  });
}

/** @param {string} measurementId */
function loadGtagAfterConsent(measurementId) {
  const id = measurementId.trim();
  gtagConsentDefaultDenied();
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  s.onload = () => {
    window.gtag("js", new Date());
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    // Register the hero variant as a user-scoped property so every event
    // inherits it in GA4 reporting, independent of per-event params.
    if (HERO_VARIANT) {
      window.gtag("set", "user_properties", { variant: HERO_VARIANT });
    }
    window.gtag("config", id, { send_page_view: true });
    void initWebVitals();
  };
  document.head.appendChild(s);
}

function removeCookieConsentBar() {
  document.getElementById("cookie-consent-bar")?.remove();
}

/**
 * Minimal paper-on-ink consent strip. Bottom of screen, mono caps, single
 * line of prose + two actions. No modal, no scrim — editorial touches,
 * not legal chrome.
 */
function mountCookieConsentBar(onAccept, onReject) {
  if (document.getElementById("cookie-consent-bar")) return;
  const bar = document.createElement("div");
  bar.id = "cookie-consent-bar";
  bar.setAttribute("role", "dialog");
  bar.setAttribute("aria-live", "polite");
  bar.setAttribute("aria-label", "Analytics consent");
  bar.className =
    "fixed inset-x-3 bottom-3 z-50 flex flex-col gap-3 rounded-sm bg-ink/95 px-5 py-4 text-paper shadow-2xl backdrop-blur sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-md sm:flex-row sm:items-center sm:gap-5";
  bar.innerHTML = `
    <p class="font-display text-[13px] italic leading-snug" style="color: rgba(245, 241, 234, 0.82)">
      Optional analytics help us measure how the issue is read.
      <a class="underline decoration-[rgba(245,241,234,0.35)] underline-offset-2 hover:decoration-paper" href="/privacy">Privacy.</a>
    </p>
    <div class="flex items-center gap-3 sm:ml-auto">
      <button type="button" class="font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-70" style="color: rgba(245, 241, 234, 0.55)" data-cookie-reject>Decline</button>
      <button type="button" class="cta-pill cta-pill--paper !px-4 !py-2 text-[10px]" data-cookie-accept>Accept</button>
    </div>
  `;
  document.body.appendChild(bar);
  bar.querySelector("[data-cookie-accept]")?.addEventListener("click", onAccept);
  bar.querySelector("[data-cookie-reject]")?.addEventListener("click", onReject);
}

// ── Meta Pixel ────────────────────────────────────────────────────────
// Client-side Facebook/Instagram pixel. Loads AFTER consent alongside
// GA4. Wired for paid-funnel attribution — PageView on load, ViewContent
// on section reveals, InitiateCheckout on App Store tap. Conversions API
// (server-side CAPI) is deferred until the backend adds a /events/meta
// webhook; events here can be mirrored to CAPI with matching event_ids.

/** @param {string} eventName @param {Record<string, unknown>} [params] */
function fbqEvent(eventName, params) {
  if (typeof window.fbq !== "function") return;
  // Meta Pixel has no global-set equivalent for custom params, so we stamp
  // `variant` on every event. Custom Conversions in Meta Events Manager
  // can then filter on this param to produce per-variant CPA columns in
  // Ads Manager.
  const merged = HERO_VARIANT
    ? { ...(params || {}), variant: HERO_VARIANT }
    : params || {};
  window.fbq("track", eventName, merged);
}

/** @param {string} pixelId */
function loadMetaPixelAfterConsent(pixelId) {
  const id = pixelId.trim();
  if (!id) return;
  // Stub + async loader, adapted from Meta's official snippet. We include
  // it only after the consent gate has granted analytics — no mysterious
  // network calls before the user has said yes.
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", id);
  // Tag the first PageView with the variant so Meta attribution is correct
  // from the first event in the session, not just from the second onward.
  window.fbq("track", "PageView", HERO_VARIANT ? { variant: HERO_VARIANT } : {});
}

function initConsentGateAndAnalytics() {
  const gaId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  const pixelId = import.meta.env.VITE_META_PIXEL_ID;
  const hasAnyId = (gaId && gaId.trim()) || (pixelId && pixelId.trim());
  if (!hasAnyId) return;

  function grant() {
    if (gaId) loadGtagAfterConsent(gaId);
    if (pixelId) loadMetaPixelAfterConsent(pixelId);
  }

  const prior = analyticsConsentStored();
  if (prior === "rejected") return;

  if (prior === "accepted") {
    grant();
    return;
  }

  mountCookieConsentBar(
    () => {
      setAnalyticsConsent("accepted");
      removeCookieConsentBar();
      grant();
    },
    () => {
      setAnalyticsConsent("rejected");
      removeCookieConsentBar();
    },
  );
}

function initStoreClickTracking() {
  document.querySelectorAll("a[data-store-link]").forEach((a) => {
    a.addEventListener("click", () => {
      const platform = a.getAttribute("data-store-link");
      gaEvent(platform === "ios" ? "store_click_ios" : "store_click_android", {
        link_url: a.href,
      });
      // Meta's equivalent: InitiateCheckout is the canonical "user left for
      // the app store" signal. content_category disambiguates iOS vs
      // Android in Ads Manager.
      fbqEvent("InitiateCheckout", {
        content_category: platform || "store",
        content_name: "style_ai_app",
      });
    });
  });
  // Any hero / sticky CTA that scrolls to #your-turn is a soft conversion
  // signal — track it so we can A/B test copy against scroll-to-ask rate.
  document.querySelectorAll('a[data-cta-kind="scroll"]').forEach((a) => {
    a.addEventListener("click", () => {
      const source =
        a.hasAttribute("data-cta-hero") ? "hero"
        : a.hasAttribute("data-sticky-cta") ? "sticky"
        : "other";
      gaEvent("cta_scroll_to_ask", { source });
      fbqEvent("ViewContent", { content_name: "your_turn", source });
    });
  });
}

function initScrollDepth() {
  const marks = new Set();
  function check() {
    const doc = document.documentElement;
    const h = doc.scrollHeight - window.innerHeight;
    if (h < 1) return;
    const p = window.scrollY / h;
    if (p >= 0.5 && !marks.has(50)) {
      marks.add(50);
      gaEvent("scroll_50", {});
      // Meta: ViewContent when the user has engaged past halfway —
      // clearer paid-funnel signal than PageView alone.
      fbqEvent("ViewContent", { content_name: "issue_halfway" });
    }
    if (p >= 0.9 && !marks.has(90)) {
      marks.add(90);
      gaEvent("scroll_90", {});
      fbqEvent("ViewContent", { content_name: "issue_deep_scroll" });
    }
  }
  window.addEventListener("scroll", check, { passive: true });
  check();
}

async function initWebVitals() {
  if (!import.meta.env.VITE_GA4_MEASUREMENT_ID) return;
  try {
    const { onCLS, onINP, onLCP } = await import("web-vitals");
    const send = (metric) => {
      gaEvent("web_vitals", {
        metric_id: metric.id,
        metric_name: metric.name,
        metric_value:
          metric.name === "CLS" ? Math.round(metric.value * 1000) : Math.round(metric.value),
        metric_delta:
          metric.name === "CLS" ? Math.round(metric.delta * 1000) : Math.round(metric.delta),
      });
    };
    onLCP(send);
    onINP(send);
    onCLS(send);
  } catch {
    /* optional / blocked */
  }
}

// ── Lenis smooth scroll — DESKTOP ONLY ───────────────────────────────
// Mobile uses native iOS/Android momentum. Our motion strategy assumes no
// Lenis on touch. Gated at >=768px AND no prefers-reduced-motion.

/** @type {Lenis | null} */
let globalLenis = null;

function initLenis() {
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mqDesktop = window.matchMedia(`(min-width: ${MD}px)`);

  function allowLenis() {
    return !mqReduce.matches && mqDesktop.matches;
  }

  function mount() {
    if (globalLenis || !allowLenis()) return;
    globalLenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      anchors: { duration: 1.25 },
    });
  }

  function unmount() {
    if (!globalLenis) return;
    globalLenis.destroy();
    globalLenis = null;
  }

  function sync() {
    if (allowLenis()) mount();
    else unmount();
  }

  sync();
  mqReduce.addEventListener("change", sync);
  mqDesktop.addEventListener("change", sync);
}

// ── Scroll-reveal choreography ───────────────────────────────────────
// Section-opener reveals use a single signature: 600ms bottom-to-top fade
// (see .site-sr-item transition in style.css). Hero items auto-reveal
// after first paint with a short stagger; non-hero sections reveal on
// intersection.

function initSiteScrollReveal() {
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sections = document.querySelectorAll("main .site-sr-section");

  function revealAllItems(section) {
    section.querySelectorAll(".site-sr-item").forEach((el) => {
      el.setAttribute("data-site-sr-revealed", "1");
    });
  }

  sections.forEach((section) => {
    const items = section.querySelectorAll(".site-sr-item");
    if (!items.length) return;

    if (mqReduce.matches) {
      revealAllItems(section);
      return;
    }

    section.setAttribute("data-site-sr-animate", "1");

    // Hero reveals immediately on load with a per-item stagger so the
    // masthead, verdict, and CTA arrive in order — 80ms + 120ms per index
    // matches the app's "unhurried" motion register.
    if (section.id === "hero") {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          items.forEach((el, idx) => {
            window.setTimeout(() => {
              el.setAttribute("data-site-sr-revealed", "1");
            }, 80 + idx * 120);
          });
        });
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-site-sr-revealed", "1");
          obs.unobserve(e.target);
        }
      },
      { rootMargin: "-7% 0px -5% 0px", threshold: 0.08 },
    );

    items.forEach((el) => io.observe(el));
  });

  mqReduce.addEventListener("change", () => {
    if (!mqReduce.matches) return;
    sections.forEach((section) => {
      revealAllItems(section);
      section.removeAttribute("data-site-sr-animate");
    });
  });
}

// ── Sticky CTA visibility ────────────────────────────────────────────
// Shows the bottom-right pill only after the user has scrolled past the
// hero (so it never competes with the primary hero CTA). Hidden again if
// the user returns to the top.

function initStickyCta() {
  const cta = document.querySelector("[data-sticky-cta]");
  if (!cta) return;
  const hero = document.getElementById("hero");
  if (!hero) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        // Show sticky once the hero is at least 60% out of view upward —
        // that's when the next section is dominant and the sticky CTA
        // stops competing with the hero's own "Pull your first look" pill.
        const past = !e.isIntersecting || e.intersectionRatio < 0.4;
        cta.setAttribute("data-visible", past ? "1" : "0");
      }
    },
    { threshold: [0, 0.4, 1] },
  );
  io.observe(hero);
}

// ── Verdict rotation ─────────────────────────────────────────────────
// The hero's verdict stamp holds static on first load ("Today. Quiet
// confidence.") — that first string teaches the format. One rotation per
// session is triggered when the user scrolls past the mirror and returns
// to top; that's a discovery moment, not a timer. Never rotates more than
// once per page load to avoid the slot-machine feel.

const VERDICTS = [
  "Sharpened Monday.",
  "Soft authority.",
  "Warm, unhurried.",
  "Bundled, composed.",
  "Not trying.",
];

function initVerdictRotation() {
  const el = document.getElementById("hero-verdict");
  if (!el || el.getAttribute("data-verdict-rotates") !== "1") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const mirror = document.getElementById("mirror");
  if (!mirror) return;

  let userScrolledPastMirror = false;
  let rotated = false;

  // First we need to confirm the user actually passed the mirror.
  const passObs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting || e.intersectionRatio > 0) {
          userScrolledPastMirror = true;
          passObs.disconnect();
          return;
        }
      }
    },
    { threshold: [0, 0.1] },
  );
  passObs.observe(mirror);

  // Then — and only then — watch for the hero coming back into view to
  // rotate once. Crossfade via opacity for 320ms either side of the swap.
  const backObs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting || !userScrolledPastMirror || rotated) continue;
        rotated = true;
        const next = VERDICTS[Math.floor(Math.random() * VERDICTS.length)];
        el.style.transition = "opacity 320ms ease";
        el.style.opacity = "0";
        window.setTimeout(() => {
          el.textContent = next;
          el.style.opacity = "1";
          backObs.disconnect();
        }, 340);
      }
    },
    { threshold: [0.5] },
  );
  backObs.observe(document.getElementById("hero"));
}

// ── Bootstrap ────────────────────────────────────────────────────────

initStoreLinks();
initConsentGateAndAnalytics();
initStoreClickTracking();
initScrollDepth();
initLenis();
initSiteScrollReveal();
initStickyCta();
initVerdictRotation();
