import "./style.css";

const MD = 768;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isElementFocusable(el) {
  if (!(el instanceof HTMLElement)) return false;
  if (el.getAttribute("aria-hidden") === "true") return false;
  if (el.closest('[aria-hidden="true"]')) return false;
  if (el.closest("[inert]")) return false;
  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return false;
  return true;
}

function getFocusablesIn(root) {
  if (!root) return [];
  return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isElementFocusable);
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

  function onScroll() {
    if (window.innerWidth < MD) {
      lastY = window.scrollY;
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
}

function initSiteCtaBar() {
  const bar = document.getElementById("site-cta-bar");
  const hero = document.getElementById("hero");
  const download = document.getElementById("download");
  if (!bar || !hero) return;

  function updateCtaBar() {
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

initNav();
initSiteCtaBar();
initWhatWeDoReveal();
initFeaturesReveal();
initSiteScrollReveal();
initFeaturesCountUp();
