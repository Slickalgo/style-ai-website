/**
 * Runtime config — populated at launch, placeholder before.
 *
 * Listed as `window.UKTI_CONFIG` so any inline script or module can read it
 * without importing. Every consumer MUST treat each field as possibly empty.
 *
 * See docs/launch/pre-production-blockers.md for the swap-in procedure.
 */
window.UKTI_CONFIG = {
  /**
   * Meta Pixel ID (15-digit numeric string from Meta Business Manager).
   * Leave empty until provisioned. Empty = no Pixel script loads, no events fire.
   * Once set, the loader in src/tracking.js fires PageView + ViewContent + Lead automatically.
   */
  metaPixelId: "",

  /**
   * Canonical short URL that the QR code encodes + desktop "→ INSTALL" text-link.
   * Set once ukti.io custom domain is attached; until then, /get still works on
   * the Amplify default domain but the QR code is harder to hand out.
   */
  shortUrl: "https://ukti.io/get",

  /**
   * Store URLs — source of truth for the device-detection redirect at /get.
   * The HTML pills in index.html + how-it-works.html currently duplicate these
   * strings; when real App Store / Play Store URLs are issued, update all
   * three locations (the two HTML files + here) per the runbook.
   */
  appStoreUrl: "https://apps.apple.com/app/ukti/id000000000",
  playStoreUrl: "https://play.google.com/store/apps/details?id=io.ukti.app",
};
