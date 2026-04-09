import "./style.css";
import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { getFocusablesIn } from "./a11y-utils.js";
import { initDownloadModal } from "./download-modal.js";

const MD = 768;

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

/** @param {string} name @param {Record<string, unknown>} [params] */
function gaEvent(name, params) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params || {});
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
    window.gtag("config", id, { send_page_view: true });
    void initWebVitals();
  };
  document.head.appendChild(s);
}

function removeCookieConsentBar() {
  document.getElementById("cookie-consent-bar")?.remove();
}

function mountCookieConsentBar(onAccept, onReject) {
  if (document.getElementById("cookie-consent-bar")) return;
  const bar = document.createElement("div");
  bar.id = "cookie-consent-bar";
  bar.className = "cookie-consent-bar";
  bar.setAttribute("role", "dialog");
  bar.setAttribute("aria-live", "polite");
  bar.setAttribute("aria-label", "Analytics cookies");
  bar.innerHTML = `
    <div class="cookie-consent-bar__inner">
      <p class="cookie-consent-bar__text">
        Optional analytics cookies (Google Analytics 4) help us measure traffic and site performance.
        <a class="cookie-consent-bar__link" href="/privacy">Privacy Policy</a>
      </p>
      <div class="cookie-consent-bar__actions">
        <button type="button" class="cookie-consent-bar__btn cookie-consent-bar__btn--ghost" data-cookie-reject>Decline</button>
        <button type="button" class="cookie-consent-bar__btn cookie-consent-bar__btn--primary" data-cookie-accept>Accept analytics</button>
      </div>
    </div>
  `;
  document.body.appendChild(bar);
  bar.querySelector("[data-cookie-accept]")?.addEventListener("click", onAccept);
  bar.querySelector("[data-cookie-reject]")?.addEventListener("click", onReject);
}

function initConsentGateAndAnalytics() {
  const id = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  if (!id || typeof id !== "string" || !id.trim()) return;

  const prior = analyticsConsentStored();
  if (prior === "rejected") return;

  if (prior === "accepted") {
    loadGtagAfterConsent(id);
    return;
  }

  mountCookieConsentBar(
    () => {
      setAnalyticsConsent("accepted");
      removeCookieConsentBar();
      loadGtagAfterConsent(id);
    },
    () => {
      setAnalyticsConsent("rejected");
      removeCookieConsentBar();
    }
  );
}

function initStoreClickTracking() {
  document.querySelectorAll("a[data-store-link]").forEach((a) => {
    a.addEventListener("click", () => {
      const platform = a.getAttribute("data-store-link");
      const inModal = Boolean(a.closest("#download-app-modal"));
      gaEvent(platform === "ios" ? "store_click_ios" : "store_click_android", {
        link_url: a.href,
        ...(inModal ? { surface: "modal" } : {}),
      });
    });
  });
  const stickyDl = document.querySelector(
    '#site-cta-bar a[data-download-source="sticky"]'
  );
  if (stickyDl) {
    stickyDl.addEventListener("click", () => {
      gaEvent("cta_sticky_download", { method: "sticky_bar" });
    });
  }
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
    }
    if (p >= 0.9 && !marks.has(90)) {
      marks.add(90);
      gaEvent("scroll_90", {});
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
      syncTouchLerp: 0.085,
      touchMultiplier: 1.12,
      wheelMultiplier: 1,
      anchors: {
        duration: 1.25,
      },
      stopInertiaOnNavigate: true,
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

function initNav() {
  const nav = document.getElementById("site-nav");
  if (!nav) return;

  const mobileToggle = document.getElementById("site-nav-mobile-toggle");
  const mobilePanel = document.getElementById("site-nav-mobile-panel");
  const mobileBar = nav.querySelector(".site-nav-mobile-bar");
  const mobileLinks = nav.querySelectorAll(".site-nav-mobile-overlay__link");
  const mobileCta = nav.querySelector(".site-nav-mobile-overlay__cta");
  const mainEl = document.querySelector("main");
  const footerEl = document.querySelector("footer");
  const ctaBarEl = document.getElementById("site-cta-bar");
  const heroEl = document.getElementById("hero");
  const downloadSectionEl = document.getElementById("download");

  let lastY = window.scrollY;
  let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let mobileMenuPreviousFocus = null;

  window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .addEventListener("change", (e) => {
      reduceMotion = e.matches;
      if (reduceMotion) nav.dataset.navExpanded = "true";
    });

  function setNavExpanded(expanded) {
    nav.dataset.navExpanded = expanded ? "true" : "false";
  }

  function getMobileMenuTabOrder() {
    const list = [];
    if (mobileBar) list.push(...getFocusablesIn(mobileBar));
    if (mobilePanel) list.push(...getFocusablesIn(mobilePanel));
    return list;
  }

  function focusMobileMenuInitial() {
    if (!mobilePanel || nav.dataset.mobileMenu !== "open") return;
    const inPanel = getFocusablesIn(mobilePanel);
    if (inPanel.length) {
      inPanel[0].focus();
    } else {
      mobilePanel.focus();
    }
  }

  function onMobileMenuKeydown(e) {
    if (nav.dataset.mobileMenu !== "open") return;
    if (e.key === "Escape") {
      e.preventDefault();
      setMobileMenu(false);
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = getMobileMenuTabOrder();
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey) {
      if (active === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function applyMobileMenuInert(on) {
    const method = on ? "setAttribute" : "removeAttribute";
    mainEl?.[method]("inert", "");
    footerEl?.[method]("inert", "");
    ctaBarEl?.[method]("inert", "");
  }

  function teardownMobileMenuIfOpen() {
    if (nav.dataset.mobileMenu !== "open") return;
    nav.dataset.mobileMenu = "closed";
    mobileToggle?.setAttribute("aria-expanded", "false");
    mobileToggle?.setAttribute("aria-label", "Open menu");
    mobilePanel?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    globalLenis?.start();
    applyMobileMenuInert(false);
    document.removeEventListener("keydown", onMobileMenuKeydown, true);
    const prev = mobileMenuPreviousFocus;
    mobileMenuPreviousFocus = null;
    if (prev instanceof HTMLElement && prev.isConnected) {
      prev.focus();
    } else {
      mobileToggle?.focus();
    }
  }

  function setMobileMenu(open) {
    const isMobile = window.innerWidth < MD;
    if (!isMobile) {
      teardownMobileMenuIfOpen();
      return;
    }

    const wasOpen = nav.dataset.mobileMenu === "open";

    if (open) {
      if (!wasOpen) {
        mobileMenuPreviousFocus =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
      }
      nav.dataset.mobileMenu = "open";
      mobileToggle?.setAttribute("aria-expanded", "true");
      mobileToggle?.setAttribute("aria-label", "Close menu");
      mobilePanel?.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      globalLenis?.stop();
      applyMobileMenuInert(true);
      if (!wasOpen) {
        document.addEventListener("keydown", onMobileMenuKeydown, true);
        queueMicrotask(() => {
          if (nav.dataset.mobileMenu === "open") focusMobileMenuInitial();
        });
      }
      return;
    }

    if (wasOpen) {
      teardownMobileMenuIfOpen();
    } else {
      nav.dataset.mobileMenu = "closed";
      mobileToggle?.setAttribute("aria-expanded", "false");
      mobileToggle?.setAttribute("aria-label", "Open menu");
      mobilePanel?.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  function updateMobileNavSurface() {
    if (window.innerWidth >= MD || !mobileBar) return;

    const barRect = mobileBar.getBoundingClientRect();

    /** True if this element occupies any of the vertical band behind the mobile pill */
    function overlapsNavBand(el) {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.bottom > barRect.top && r.top < barRect.bottom;
    }

    const overDarkBand =
      overlapsNavBand(heroEl) || overlapsNavBand(downloadSectionEl);

    nav.dataset.mobileNavBg = overDarkBand ? "dark" : "light";
  }

  function onScroll() {
    if (window.innerWidth < MD) {
      lastY = window.scrollY;
      updateMobileNavSurface();
      return;
    }

    if (reduceMotion) {
      setNavExpanded(true);
      lastY = window.scrollY;
      return;
    }

    const y = window.scrollY;
    if (y < 56) {
      setNavExpanded(true);
      lastY = y;
      return;
    }

    const diff = y - lastY;
    if (Math.abs(diff) < 0.5) return;

    setNavExpanded(diff < 0);
    lastY = y;
  }

  mobileToggle?.addEventListener("click", () => {
    const open = nav.dataset.mobileMenu === "open";
    setMobileMenu(!open);
  });

  mobileLinks.forEach((a) => {
    a.addEventListener("click", () => setMobileMenu(false));
  });

  mobileCta?.addEventListener("click", () => setMobileMenu(false));

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    lastY = window.scrollY;
    if (window.innerWidth >= MD) {
      setMobileMenu(false);
    }
    onScroll();
  });

  onScroll();
  updateMobileNavSurface();
}

function initSiteCtaBar() {
  const bar = document.getElementById("site-cta-bar");
  const hero = document.getElementById("hero");
  const download = document.getElementById("download");
  if (!bar || !hero) return;

  function updateCtaBar() {
    if (window.innerWidth >= MD) {
      bar.dataset.visible = "false";
      bar.setAttribute("aria-hidden", "true");
      return;
    }
    const heroRect = hero.getBoundingClientRect();
    const pastHero = heroRect.bottom < 32;

    let inDownloadZone = false;
    if (download) {
      const d = download.getBoundingClientRect();
      const vh = window.innerHeight;
      inDownloadZone = d.top < vh - 56 && d.bottom > 72;
    }

    const show = pastHero && !inDownloadZone;
    bar.dataset.visible = show ? "true" : "false";
    bar.setAttribute("aria-hidden", show ? "false" : "true");
  }

  window.addEventListener("scroll", updateCtaBar, { passive: true });
  window.addEventListener("resize", updateCtaBar);
  updateCtaBar();
}

function initWhatWeDoReveal() {
  const section = document.getElementById("what-we-do");
  if (!section) return;

  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const items = section.querySelectorAll(".wwd-reveal-item");

  function revealEverything() {
    section.setAttribute("data-wwd-inview", "1");
    items.forEach((el) => el.setAttribute("data-wwd-revealed", "1"));
  }

  if (mqReduce.matches) {
    revealEverything();
    return;
  }

  section.setAttribute("data-wwd-animate", "1");

  const ioSection = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          section.setAttribute("data-wwd-inview", "1");
          obs.disconnect();
        }
      }
    },
    { rootMargin: "12% 0px 8% 0px", threshold: 0 }
  );
  ioSection.observe(section);

  const ioItem = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.setAttribute("data-wwd-revealed", "1");
        ioItem.unobserve(e.target);
      }
    },
    { rootMargin: "-10% 0px -6% 0px", threshold: 0.08 }
  );

  items.forEach((el) => ioItem.observe(el));

  mqReduce.addEventListener("change", () => {
    if (mqReduce.matches) {
      revealEverything();
      section.removeAttribute("data-wwd-animate");
    }
  });
}

function initFeaturesReveal() {
  const section = document.getElementById("features");
  if (!section) return;

  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const items = section.querySelectorAll(".fe-reveal-item");

  function revealAll() {
    section.setAttribute("data-fe-ambient", "1");
    items.forEach((el) => el.setAttribute("data-fe-revealed", "1"));
  }

  if (mqReduce.matches) {
    revealAll();
    return;
  }

  section.setAttribute("data-fe-animate", "1");

  const ioAmbient = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          section.setAttribute("data-fe-ambient", "1");
          obs.disconnect();
        }
      }
    },
    { rootMargin: "10% 0px 6% 0px", threshold: 0 }
  );
  ioAmbient.observe(section);

  const ioItem = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.setAttribute("data-fe-revealed", "1");
        ioItem.unobserve(e.target);
      }
    },
    { rootMargin: "-8% 0px -5% 0px", threshold: 0.1 }
  );

  items.forEach((el) => ioItem.observe(el));

  mqReduce.addEventListener("change", () => {
    if (mqReduce.matches) {
      revealAll();
      section.removeAttribute("data-fe-animate");
    }
  });
}

function easeOutExpo(t) {
  return t >= 1 ? 1 : 1 - 2 ** (-10 * t);
}

function initSiteScrollReveal() {
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sections = document.querySelectorAll("main .site-sr-section");

  function revealAllItems(section) {
    section.querySelectorAll(".site-sr-item").forEach((el) => {
      el.setAttribute("data-site-sr-revealed", "1");
    });
  }

  function clearAnimate(section) {
    section.removeAttribute("data-site-sr-animate");
  }

  sections.forEach((section) => {
    const items = section.querySelectorAll(".site-sr-item");
    if (!items.length) return;

    if (mqReduce.matches) {
      revealAllItems(section);
      return;
    }

    section.setAttribute("data-site-sr-animate", "1");

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
      { rootMargin: "-7% 0px -5% 0px", threshold: 0.08 }
    );

    items.forEach((el) => io.observe(el));
  });

  mqReduce.addEventListener("change", () => {
    if (!mqReduce.matches) return;
    sections.forEach((section) => {
      revealAllItems(section);
      clearAnimate(section);
    });
  });
}

function initHeroPhoneCarousel() {
  const track = document.querySelector("[data-hero-phone-carousel]");
  if (!track) return;

  const shell = track.parentElement;
  if (!shell) return;

  const originals = track.querySelectorAll(".hero-phone-mock__slide");
  const realSlideCount = originals.length;
  if (realSlideCount < 2) return;

  const firstSlide = originals[0];
  const cloneSlide = firstSlide.cloneNode(true);
  cloneSlide.classList.add("hero-phone-mock__slide--clone");
  cloneSlide.removeAttribute("data-hero-slide");
  cloneSlide.setAttribute("aria-hidden", "true");
  cloneSlide.querySelectorAll("img[loading]").forEach((img) => {
    img.removeAttribute("loading");
  });
  track.appendChild(cloneSlide);

  const slides = track.querySelectorAll(".hero-phone-mock__slide");
  const totalSlides = slides.length;
  const cloneIndex = realSlideCount;

  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const HOLD_MS = 2000;
  const TRANSITION_FALLBACK_MS = 1350;

  let index = 0;
  /** @type {ReturnType<typeof setTimeout> | null} */
  let holdTimer = null;
  /** @type {ReturnType<typeof setTimeout> | null} */
  let transitionFallbackTimer = null;
  /** @type {((e: Event) => void) | null} */
  let boundTransitionEnd = null;

  function applyA11y() {
    slides.forEach((slide, i) => {
      slide.setAttribute("aria-hidden", i === index ? "false" : "true");
    });
  }

  function measureAndApplyWidths() {
    const w = Math.max(0, Math.round(shell.clientWidth));
    if (w < 1) return 0;
    track.style.width = `${totalSlides * w}px`;
    slides.forEach((s) => {
      s.style.flexShrink = "0";
      s.style.flexBasis = `${w}px`;
      s.style.width = `${w}px`;
    });
    return w;
  }

  function setTransformPx() {
    const w = Math.max(0, Math.round(shell.clientWidth));
    if (w < 1) return;
    track.style.transform = `translate3d(${-index * w}px, 0, 0)`;
  }

  function clearCycle() {
    if (holdTimer != null) {
      window.clearTimeout(holdTimer);
      holdTimer = null;
    }
    if (transitionFallbackTimer != null) {
      window.clearTimeout(transitionFallbackTimer);
      transitionFallbackTimer = null;
    }
    if (boundTransitionEnd) {
      track.removeEventListener("transitionend", boundTransitionEnd);
      boundTransitionEnd = null;
    }
  }

  function goToIndex(next, instant = false) {
    if (next < 0 || next >= totalSlides) return;
    index = next;
    applyA11y();
    if (instant) {
      track.classList.add("hero-phone-mock__track--reduced");
      measureAndApplyWidths();
      setTransformPx();
      track.offsetHeight;
      track.classList.remove("hero-phone-mock__track--reduced");
      return;
    }
    setTransformPx();
  }

  function onTransitionFinished() {
    if (boundTransitionEnd === null && transitionFallbackTimer === null) return;
    if (transitionFallbackTimer != null) {
      window.clearTimeout(transitionFallbackTimer);
      transitionFallbackTimer = null;
    }
    if (boundTransitionEnd) {
      track.removeEventListener("transitionend", boundTransitionEnd);
      boundTransitionEnd = null;
    }

    if (index === cloneIndex) {
      goToIndex(0, true);
    }

    if (mqReduce.matches || document.visibilityState !== "visible") return;
    holdTimer = window.setTimeout(tickAdvance, HOLD_MS);
  }

  function tickAdvance() {
    holdTimer = null;
    if (mqReduce.matches || document.visibilityState !== "visible") return;
    if (shell.clientWidth < 2) {
      holdTimer = window.setTimeout(tickAdvance, 64);
      return;
    }

    clearCycle();

    if (index < realSlideCount - 1) {
      goToIndex(index + 1, false);
    } else if (index === realSlideCount - 1) {
      goToIndex(cloneIndex, false);
    } else {
      goToIndex(0, true);
      if (!mqReduce.matches && document.visibilityState === "visible") {
        holdTimer = window.setTimeout(tickAdvance, HOLD_MS);
      }
      return;
    }

    if (mqReduce.matches) return;

    boundTransitionEnd = (e) => {
      if (e.target !== track || e.propertyName !== "transform") return;
      onTransitionFinished();
    };
    track.addEventListener("transitionend", boundTransitionEnd);
    transitionFallbackTimer = window.setTimeout(
      onTransitionFinished,
      TRANSITION_FALLBACK_MS
    );
  }

  function start() {
    if (mqReduce.matches) return;
    clearCycle();
    measureAndApplyWidths();
    setTransformPx();
    holdTimer = window.setTimeout(tickAdvance, HOLD_MS);
  }

  function stop() {
    clearCycle();
  }

  function syncReduce() {
    if (mqReduce.matches) {
      track.classList.add("hero-phone-mock__track--reduced");
      stop();
      goToIndex(0, true);
    } else {
      track.classList.remove("hero-phone-mock__track--reduced");
      measureAndApplyWidths();
      setTransformPx();
      if (document.visibilityState === "visible") start();
    }
  }

  const ro = new ResizeObserver(() => {
    const keepReduced =
      mqReduce.matches || track.classList.contains("hero-phone-mock__track--reduced");
    track.classList.add("hero-phone-mock__track--reduced");
    measureAndApplyWidths();
    setTransformPx();
    window.requestAnimationFrame(() => {
      if (!keepReduced) track.classList.remove("hero-phone-mock__track--reduced");
    });
  });
  ro.observe(shell);

  mqReduce.addEventListener("change", syncReduce);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") stop();
    else if (!mqReduce.matches) start();
  });

  goToIndex(0, true);
  syncReduce();
}

function initFeaturesCountUp() {
  const section = document.getElementById("features");
  if (!section) return;

  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function setFinal(el) {
    const target = parseFloat(el.dataset.countTarget || "0");
    const decimals = parseInt(el.dataset.countDecimals || "0", 10);
    const prefix = el.dataset.countPrefix || "";
    const suffix = el.dataset.countSuffix || "";
    const num =
      decimals > 0 ? target.toFixed(decimals) : String(Math.round(target));
    el.textContent = prefix + num + suffix;
  }

  function run(el) {
    if (el.dataset.countDone === "1") return;
    el.dataset.countDone = "1";
    if (mqReduce.matches) {
      setFinal(el);
      return;
    }
    const target = parseFloat(el.dataset.countTarget || "0");
    const decimals = parseInt(el.dataset.countDecimals || "0", 10);
    const prefix = el.dataset.countPrefix || "";
    const suffix = el.dataset.countSuffix || "";
    const duration = 1500;
    const start = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutExpo(t);
      const val = target * eased;
      const num =
        decimals > 0 ? val.toFixed(decimals) : String(Math.round(val));
      el.textContent = prefix + num + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const nodes = section.querySelectorAll("[data-count-up]");
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          run(e.target);
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "-5% 0px -10% 0px", threshold: 0.25 }
  );

  nodes.forEach((n) => io.observe(n));
}

initStoreLinks();
initConsentGateAndAnalytics();
initStoreClickTracking();
initScrollDepth();

initLenis();
initNav();
initDownloadModal({
  getLenis: () => globalLenis,
  trackEvent: gaEvent,
});
initHeroPhoneCarousel();
initSiteCtaBar();
initWhatWeDoReveal();
initFeaturesReveal();
initSiteScrollReveal();
initFeaturesCountUp();
