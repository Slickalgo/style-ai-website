import { defineConfig, loadEnv } from "vite";
import fs from "node:fs";
import path from "node:path";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function guideHtmlInputs() {
  const dir = resolve(__dirname, "guides");
  if (!fs.existsSync(dir)) return {};
  /** @type Record<string, string> */
  const out = {};
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".html")) continue;
    const base = f.replace(/\.html$/, "");
    const key = base === "index" ? "guide-index" : `guide-${base.replace(/[^a-z0-9-]/gi, "_")}`;
    out[key] = resolve(dir, f);
  }
  return out;
}

function cleanUrlMiddleware(req, _res, next) {
  const raw = req.url ?? "";
  const q = raw.includes("?") ? "?" + raw.split("?")[1] : "";
  const url = raw.split("?")[0] ?? "";

  if (url === "/terms" || url === "/terms/") {
    req.url = "/terms.html" + q;
    return next();
  }
  if (url === "/privacy" || url === "/privacy/") {
    req.url = "/privacy.html" + q;
    return next();
  }
  // Editorial ad-lander pages. Not in nav; served on clean slugs so Meta
  // ad creatives can deep-link to /how-she-works or /the-looks.
  if (url === "/how-she-works" || url === "/how-she-works/") {
    req.url = "/how-she-works.html" + q;
    return next();
  }
  if (url === "/the-looks" || url === "/the-looks/") {
    req.url = "/the-looks.html" + q;
    return next();
  }
  if (url === "/guides" || url === "/guides/") {
    req.url = "/guides/index.html" + q;
    return next();
  }
  const m = url.match(/^\/guides\/([^/]+)\/?$/);
  if (m && m[1] && !m[1].endsWith(".html")) {
    const slug = m[1];
    const htmlPath = path.join(__dirname, "guides", `${slug}.html`);
    if (fs.existsSync(htmlPath)) {
      req.url = `/guides/${slug}.html` + q;
      return next();
    }
  }
  next();
}

function escMetaContent(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const gscVerification = (env.VITE_GOOGLE_SITE_VERIFICATION || "").trim();

  return {
    root: ".",
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: false,
      allowedHosts: true,
    },
    preview: {
      host: "0.0.0.0",
      port: 4173,
      strictPort: false,
      allowedHosts: true,
    },
    plugins: [
      {
      name: "style-ai-clean-urls",
      configureServer(server) {
        server.middlewares.use(cleanUrlMiddleware);
      },
      configurePreviewServer(server) {
        server.middlewares.use(cleanUrlMiddleware);
      },
      },
      {
        name: "style-ai-head-inject",
      transformIndexHtml(html) {
        if (html.includes('hreflang="en-IN"')) return html;
        const m = html.match(/<link rel="canonical" href="([^"]+)"\s*\/>/);
        if (!m) return html;
        const canonicalUrl = m[1];
        const hreflang = `\n    <link rel="alternate" hreflang="en-IN" href="${canonicalUrl}" />\n    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`;
        let out = html.replace(
          /(<link rel="canonical" href="[^"]+"\s*\/>)/,
          `$1${hreflang}`
        );
        if (gscVerification) {
          const tag = `    <meta name="google-site-verification" content="${escMetaContent(gscVerification)}" />\n`;
          out = out.replace(/<\/head>/i, `${tag}  </head>`);
        }
        return out;
      },
      },
    ],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          terms: resolve(__dirname, "terms.html"),
          privacy: resolve(__dirname, "privacy.html"),
          "how-she-works": resolve(__dirname, "how-she-works.html"),
          "the-looks": resolve(__dirname, "the-looks.html"),
          ...guideHtmlInputs(),
        },
      },
    },
  };
});
