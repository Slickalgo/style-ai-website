import { getFocusablesIn } from "./a11y-utils.js";

const MD = 768;

/** @typedef {{ getLenis?: () => unknown; trackEvent?: (name: string, params?: Record<string, unknown>) => void }} DownloadModalOptions */

/**
 * @param {DownloadModalOptions} [options]
 */
export function initDownloadModal(options = {}) {
  const { getLenis, trackEvent = () => {} } = options;

  const modal = document.getElementById("download-app-modal");
  const panel = modal?.querySelector(".download-app-modal__panel");
  const storesRoot = modal?.querySelector("[data-download-modal-stores]");
  const qrWrap = modal?.querySelector("[data-download-modal-qr-wrap]");
  const iosLink = modal?.querySelector('a[data-modal-store="ios"]');
  const androidLink = modal?.querySelector('a[data-modal-store="android"]');
  const mainEl = document.querySelector("main");
  const footerEl = document.querySelector("footer");
  const navEl = document.getElementById("site-nav");
  const ctaBarEl = document.getElementById("site-cta-bar");

  if (!modal || !panel || !storesRoot || !iosLink || !androidLink) return;

  let open = false;
  /** @type {HTMLElement | null} */
  let previousFocus = null;
  let qrGenerated = false;
  let bodyOverflowPrev = "";

  const mqDesktop = window.matchMedia(`(min-width: ${MD}px)`);
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function deviceTier() {
    if (mqDesktop.matches) return "desktop";
    const ua = navigator.userAgent || "";
    if (/android/i.test(ua)) return "android";
    if (/iPad|iPhone|iPod/i.test(ua)) return "ios";
    if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return "ios";
    return "unknown";
  }

  function closeMobileNavIfOpen() {
    const nav = document.getElementById("site-nav");
    if (nav?.dataset.mobileMenu === "open") {
      document.getElementById("site-nav-mobile-toggle")?.click();
    }
  }

  function stripStoreEmphasis() {
    for (const el of storesRoot.querySelectorAll("a[data-modal-store]")) {
      el.classList.remove(
        "download-app-modal__store--emph",
        "download-app-modal__store--sub"
      );
      el.removeAttribute("data-focus-primary");
    }
  }

  /** @param {boolean} androidFirst DOM / tab order: Google Play before App Store */
  function orderStoreLinks(androidFirst) {
    if (androidFirst) {
      storesRoot.appendChild(androidLink);
      storesRoot.appendChild(iosLink);
    } else {
      storesRoot.appendChild(iosLink);
      storesRoot.appendChild(androidLink);
    }
  }

  function applyDeviceTier() {
    const tier = deviceTier();
    modal.dataset.deviceTier = tier;
    stripStoreEmphasis();

    if (tier === "desktop") {
      orderStoreLinks(true);
      iosLink.classList.add("download-app-modal__store--sub");
      androidLink.classList.add("download-app-modal__store--sub");
      if (qrWrap) {
        const showQr = !mqReduce.matches;
        qrWrap.classList.toggle("download-app-modal__qr-block--visible", showQr);
        qrWrap.setAttribute("aria-hidden", showQr ? "false" : "true");
      }
      return;
    }

    if (qrWrap) {
      qrWrap.classList.remove("download-app-modal__qr-block--visible");
      qrWrap.setAttribute("aria-hidden", "true");
    }

    if (tier === "ios") {
      orderStoreLinks(false);
      iosLink.classList.add("download-app-modal__store--emph");
      androidLink.classList.add("download-app-modal__store--sub");
      iosLink.setAttribute("data-focus-primary", "true");
      return;
    }

    if (tier === "android") {
      orderStoreLinks(true);
      androidLink.classList.add("download-app-modal__store--emph");
      iosLink.classList.add("download-app-modal__store--sub");
      androidLink.setAttribute("data-focus-primary", "true");
      return;
    }

    orderStoreLinks(false);
    iosLink.classList.add("download-app-modal__store--sub");
    androidLink.classList.add("download-app-modal__store--sub");
    iosLink.setAttribute("data-focus-primary", "true");
  }

  async function ensureQrImages() {
    if (qrGenerated || !qrWrap || !mqDesktop.matches || mqReduce.matches) return;
    if (!qrWrap.classList.contains("download-app-modal__qr-block--visible")) return;
    const androidUrl = androidLink.href?.trim();
    const iosUrl = iosLink.href?.trim();
    if (!androidUrl || !iosUrl || androidUrl === "#" || iosUrl === "#") return;

    try {
      const QRMod = await import("qrcode");
      const QRCode = QRMod.default;
      const opts = {
        width: 132,
        margin: 1,
        color: { dark: "#44182bFF", light: "#FFFFFFFF" },
        errorCorrectionLevel: "M",
      };
      const [droidData, iosData] = await Promise.all([
        QRCode.toDataURL(androidUrl, opts),
        QRCode.toDataURL(iosUrl, opts),
      ]);
      const imgDroid = modal.querySelector('[data-download-modal-qr="android"]');
      const imgIos = modal.querySelector('[data-download-modal-qr="ios"]');
      if (imgDroid instanceof HTMLImageElement) imgDroid.src = droidData;
      if (imgIos instanceof HTMLImageElement) imgIos.src = iosData;
      qrGenerated = true;
    } catch {
      /* optional */
    }
  }

  function applyInert(on) {
    const method = on ? "setAttribute" : "removeAttribute";
    mainEl?.[method]("inert", "");
    footerEl?.[method]("inert", "");
    navEl?.[method]("inert", "");
    ctaBarEl?.[method]("inert", "");
  }

  function onDocumentKeydown(e) {
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = getFocusablesIn(panel);
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

  /** @param {{ source?: string }} [ctx] */
  function openModal(ctx = {}) {
    if (open) return;
    closeMobileNavIfOpen();
    previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    applyDeviceTier();
    open = true;
    modal.dataset.open = "true";
    modal.setAttribute("aria-hidden", "false");
    bodyOverflowPrev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis?.()?.stop();
    applyInert(true);
    document.addEventListener("keydown", onDocumentKeydown, true);

    void ensureQrImages();

    const source = ctx.source || "unknown";
    trackEvent("download_modal_open", { source });

    queueMicrotask(() => {
      if (!open) return;
      const primary = panel.querySelector("a[data-focus-primary]");
      const pick =
        primary instanceof HTMLElement ? primary : getFocusablesIn(panel)[0];
      pick?.focus();
    });
  }

  function closeModal() {
    if (!open) return;
    open = false;
    modal.dataset.open = "false";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = bodyOverflowPrev;
    getLenis?.()?.start();
    applyInert(false);
    document.removeEventListener("keydown", onDocumentKeydown, true);
    const prev = previousFocus;
    previousFocus = null;
    if (prev instanceof HTMLElement && prev.isConnected) {
      prev.focus();
    }
  }

  document.querySelectorAll("[data-open-download-modal]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const source =
        el instanceof HTMLElement ? el.dataset.downloadSource || "unknown" : "unknown";
      openModal({ source });
    });
  });

  modal.querySelectorAll("[data-download-modal-dismiss]").forEach((el) => {
    el.addEventListener("click", () => closeModal());
  });

  function onViewportChange() {
    if (open) applyDeviceTier();
  }
  mqDesktop.addEventListener("change", onViewportChange);
  mqReduce.addEventListener("change", onViewportChange);

  function tryOpenFromHash() {
    if (window.location.hash !== "#get-app") return;
    openModal({ source: "hash" });
    const path = window.location.pathname + window.location.search;
    history.replaceState(null, "", path);
  }
  window.addEventListener("hashchange", tryOpenFromHash);
  queueMicrotask(tryOpenFromHash);
}
