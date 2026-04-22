// Ukti marketing site — runtime.
//
// Scope per spec §10–§11:
// - Scroll-fade + staggered reveals via IntersectionObserver.
// - Desktop-only Lenis smooth scroll.
// - Vercel Speed Insights (operational telemetry only; no behavioral analytics).

import "./style.css";
import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { injectSpeedInsights } from "@vercel/speed-insights";

const MD = 768;

// ── Scroll-reveal ─────────────────────────────────────────────────────
//
// Each element tagged with [data-reveal] fades/translates in once it
// enters the viewport. Elements inside a [data-stagger-group] read the
// group's stagger interval from `data-stagger-ms` and inherit an index
// via `data-stagger-index` so the CSS delay chain is deterministic.

function applyStaggerDelays() {
  document.querySelectorAll("[data-stagger-group]").forEach((group) => {
    const raw = group.getAttribute("data-stagger-ms");
    const step = raw ? Math.max(0, parseInt(raw, 10) || 0) : 140;
    const items = group.querySelectorAll("[data-reveal]");
    items.forEach((el, idx) => {
      if (!el.style.getPropertyValue("--reveal-delay")) {
        el.style.setProperty("--reveal-delay", `${idx * step}ms`);
      }
      el.setAttribute("data-stagger-index", String(idx));
    });
  });
}

function initScrollReveal() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  if (reduce.matches) {
    targets.forEach((el) => el.setAttribute("data-revealed", "1"));
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "1");
        obs.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
  );

  targets.forEach((el) => io.observe(el));
}

// ── Lenis smooth scroll — desktop only, not under reduced-motion ──────

function initLenis() {
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mqDesktop = window.matchMedia(`(min-width: ${MD}px)`);

  let lenis = null;

  function mount() {
    if (lenis || mqReduce.matches || !mqDesktop.matches) return;
    lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      anchors: { duration: 1.25 },
    });
  }

  function unmount() {
    if (!lenis) return;
    lenis.destroy();
    lenis = null;
  }

  function sync() {
    if (!mqReduce.matches && mqDesktop.matches) mount();
    else unmount();
  }

  sync();
  mqReduce.addEventListener("change", sync);
  mqDesktop.addEventListener("change", sync);
}

// ── Bootstrap ──────────────────────────────────────────────────────────

applyStaggerDelays();
initScrollReveal();
initLenis();
injectSpeedInsights();
