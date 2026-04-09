/**
 * Static SEO guide pages + sitemap.xml + Netlify _redirects (append block).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const guidesDir = path.join(root, "guides");
const publicDir = path.join(root, "public");
const redirectsPath = path.join(publicDir, "_redirects");

const ORIGIN = "https://styledesigner.co.in";
/** ISO date for Article / freshness signals; bump when you materially edit guides. */
const GUIDE_DATE = "2026-04-06";

/** @type {{ slug: string; title: string; description: string; h1: string; lead: string; sections: { h2: string; body?: string; paragraphs?: string[] }[]; faqs: { q: string; a: string }[]; related?: { href: string; label: string }[] }[]} */
const PAGES = [
  {
    slug: "what-to-wear-today-ai",
    title: "What to wear today with AI | Style AI",
    description:
      "Use AI to pick an outfit for today: context, your closet, and skin-flattering colors—with Style AI’s wardrobe-first workflow.",
    h1: "What to wear today with AI",
    lead: "An AI outfit suggestion is only useful if it respects your real day, your real closet, and the colors that read well on your skin. This guide explains how to get a useful “what to wear today” answer from an AI fashion recommendation app—without treating the mirror like a roulette wheel.",
    sections: [
      {
        h2: "Why “what to wear today” breaks for most people",
        paragraphs: [
          "Most morning stress is not a lack of clothes—it is decision fatigue plus mismatch between inspiration and inventory. Social feeds show idealized bodies, lighting, and pieces you do not own. Generic AI outfit ideas often repeat the same mistake: they optimize for aesthetics on a screen, not for your schedule, dress code, weather, or the rack you can actually reach.",
          "A strong AI fashion recommendation app should compress choices: fewer tabs, fewer tabs open in your head, and a short list of outfits that are feasible before you have coffee. Style AI is built around that constraint by tying suggestions to a catalog of pieces you have photographed and to color guidance tuned to your skin.",
        ],
      },
      {
        h2: "Start with context, not vibes only",
        paragraphs: [
          "Name the occasion and constraints: work vs. weekend, weather, dress code, travel, and how much time you have to change. If you skip context, any AI will guess—and guessing produces outfits that are “fine” statistically but wrong for your day.",
          "Style AI uses the context you provide to narrow outfits from pieces you have already cataloged. That keeps the session grounded: you are not starting from a random Pinterest board, you are remixing a wardrobe you have committed to digitally.",
        ],
      },
      {
        h2: "Let your closet anchor the answer",
        paragraphs: [
          "The strongest “today” recommendations come from a living wardrobe. Photograph staples once—denim, knits, shoes, outerwear—so the app can assemble head-to-toe looks from that set. The psychological win is honesty: you stay aligned with what you actually own, which is what you will wear.",
          "If your closet data is stale, AI will confidently recommend pieces you donated last season. A five-minute refresh after laundry day or a shopping trip pays off all week.",
        ],
      },
      {
        h2: "Use skin-aware color as a filter",
        paragraphs: [
          "When everything feels fine but nothing feels right, undertone-aware palettes reduce the noise. Harsh or muddy colors can read as “off” even when the silhouette is correct—especially under office fluorescents or golden-hour dinner light.",
          "Style AI steers you toward hues that tend to flatter your complexion in real light—not just what is trending this week. That does not mean a tiny allowed list; it means fewer regret tries when you are already late.",
        ],
      },
      {
        h2: "How this differs from “best AI stylist app” listicles",
        paragraphs: [
          "Roundups rarely score privacy, closet fidelity, or whether looks are head-to-toe. When you compare options, ask: Does the app need photos? Who processes them? Can I delete them? Do outfits come from my items, or from a generic catalog?",
          "If your goal is fewer returns and fewer panic buys, prioritize closet-first workflows and memory of what you liked—so the app compounds into a personal system, not a daily slot machine.",
        ],
      },
      {
        h2: "A simple morning workflow (5 minutes)",
        paragraphs: [
          "Open the app, confirm today’s context in one line (work casual, rain, dinner after), scan three proposed outfits, save one, skip two. If nothing lands, adjust one variable—shoes, outer layer, or formality—and regenerate.",
          "The point is not perfection; it is a decision you can stand behind when you walk out the door.",
        ],
      },
      {
        h2: "When AI is the wrong tool (and what to do instead)",
        paragraphs: [
          "If you need culturally specific dress guidance for a ceremony or a strict institutional code, use human hosts or written policies first—then use AI to organize pieces you already trust.",
          "If lighting in your selfies is extreme (heavy filter, nightclub dim), refresh photos in indirect daylight so color and skin signals are not fighting the model.",
        ],
      },
      {
        h2: "Internal links for deeper intent",
        paragraphs: [
          "If you are comparing tools, read our framework for choosing an AI fashion app. If you want fewer pieces overall, pair this guide with capsule wardrobe outfit ideas so your catalog stays lean but versatile.",
          "If you are dressing for Indian metros and monsoon or extreme heat, pair this page with city-season guides—Mumbai monsoon humidity, Delhi summer heat, and India wedding-guest context—so your closet answers match fabric, footwear, and venue reality.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is “what to wear today AI” accurate?",
        a: "Accuracy depends on good photos, lighting, and an up-to-date closet catalog. Treat AI as a fast stylist-style partner: refine, save what works, and skip what does not.",
      },
      {
        q: "Can I get outfits without shopping?",
        a: "Yes. Style AI is built around closet-first outfits. You can add shoppable pieces later if you want a hybrid look.",
      },
      {
        q: "Is Style AI an AI fashion recommendation app?",
        a: "Yes. Style AI recommends palettes and outfits grounded in your photos and closet catalog, with previews and saved preferences—rather than only showing unrelated trend imagery.",
      },
    ],
    related: [
      { href: "/guides/best-ai-fashion-apps", label: "How to pick an AI fashion app" },
      { href: "/guides/ai-stylist-app-india", label: "AI stylist app India" },
      { href: "/guides/capsule-wardrobe-outfit-ideas", label: "Capsule wardrobe outfit ideas" },
    ],
  },
  {
    slug: "best-ai-fashion-apps",
    title: "How to choose an AI fashion app | Style AI",
    description:
      "Criteria for comparing AI stylist apps: closet vs. generic feeds, privacy, skin-tone palettes, and try-on—without hype.",
    h1: "How to choose an AI fashion app",
    lead: "Searching “best AI stylist app” or “AI fashion recommendation app” returns hype. This page is a decision framework: the traits that actually change outcomes—fewer bad buys, faster mornings, and colors that look like you in real light. Style AI is one option; these are the criteria we want you to use.",
    sections: [
      {
        h2: "Closet-first vs. inspiration-only",
        paragraphs: [
          "Some apps show pretty outfits unrelated to your rack. They can be fun for mood boards, but they do not solve the hard problem: translating desire into something you can wear tomorrow without a shopping spree.",
          "If you want fewer wasted buys, prioritize tools that catalog what you own and assemble looks from that inventory. Head-to-toe completeness matters—shoes and outerwear included—otherwise you still assemble manually and the AI only did half the job.",
        ],
      },
      {
        h2: "Privacy and photo use",
        paragraphs: [
          "Styling apps need photos to personalize. Read how uploads are stored, who processes them, retention windows, and what you can delete. Avoid anything that cannot explain data retention clearly or buries processors in vague language.",
          "If you are comparing “AI outfit generator from my clothes” products, assume photos are part of the contract—your question is whether processing is proportionate, documented, and revocable.",
        ],
      },
      {
        h2: "Color intelligence (skin tone and undertone)",
        paragraphs: [
          "If you have been told you look washed out in certain shades, look for undertone-aware palettes—not one generic seasonal color card for everyone. The product should explain how it uses your portraits and how you can correct bad lighting assumptions.",
          "Style AI focuses on skin-aware color alongside closet data so recommendations do not ignore how fabric reads on your face in daylight and indoor light.",
        ],
      },
      {
        h2: "Memory, feedback, and taste drift",
        paragraphs: [
          "Taste changes; seasons change. The better apps remember what you saved vs. skipped and adjust fast. If every session feels like day one, you are paying an attention tax you do not owe.",
          "Look for explicit save/skip or like/dislike loops tied to outfits, not only to individual garments.",
        ],
      },
      {
        h2: "Try-on, preview, and expectation-setting",
        paragraphs: [
          "Preview features vary widely. Some are compositing; some are stylistic suggestions. Judge products on whether they help you decide faster, not on whether the render is cinematic.",
          "Ask: Does the preview reduce returns and second-guessing, or does it add steps?",
        ],
      },
      {
        h2: "Pricing and “free” claims",
        paragraphs: [
          "Free tiers can be legitimate for discovery; paid tiers should map to clear value—more catalog items, faster generations, or deeper personalization. Compare refund policies where purchases are involved.",
          "Style AI may introduce paid options over time; check in-app copy and terms for the current state.",
        ],
      },
      {
        h2: "How Style AI fits this framework (no unranked “#1” claim)",
        paragraphs: [
          "We do not claim rankings we cannot prove. Style AI emphasizes skin-aware palettes, closet-based outfits, previews, and memory of your preferences. If those dimensions match your goals, try it alongside any other finalist and compare on your own mornings—not a banner ad.",
        ],
      },
      {
        h2: "Related reading on Style AI",
        paragraphs: [
          "For daily use, read what to wear today with AI. For palette discipline tied to your rack, see color palette from your wardrobe.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Style AI the #1 AI stylist?",
        a: "We do not claim rankings we cannot prove. Style AI focuses on skin-aware palettes, closet-based outfits, previews, and memory of your preferences—try it against your own criteria.",
      },
      {
        q: "What is the best AI stylist app for a real closet?",
        a: "The best fit depends on whether you want closet-based outfits vs. generic inspiration, transparent photo handling, head-to-toe looks, and memory of your taste. Compare finalists on those axes with your own wardrobe photos and schedule.",
      },
      {
        q: "Are AI fashion apps safe for my photos?",
        a: "Safety is a policy question: who stores images, for how long, and whether you can delete them. Read each app’s privacy policy and permissions before uploading sensitive portraits.",
      },
    ],
    related: [
      { href: "/guides/what-to-wear-today-ai", label: "What to wear today with AI" },
      { href: "/guides/ai-stylist-app-india", label: "AI stylist app India" },
      { href: "/guides/color-palette-from-wardrobe", label: "Color palette from your wardrobe" },
    ],
  },
  {
    slug: "skin-tone-colors-warm-undertone",
    title: "Best colors for warm undertones | Style AI",
    description:
      "How warm undertones read in real light and how Style AI builds palettes that flatter—without rigid rules.",
    h1: "Colors that flatter warm undertones",
    lead: "Warm undertone does not mean “only earth tones.” It usually means gold-friendly warmth in your skin—so the job is to find hues that harmonize without looking muddy.",
    sections: [
      {
        h2: "What “warm undertone” tends to mean",
        body: "People often describe warmth as peachy, golden, or olive warmth in the skin. Jewelry tests and vein color are heuristics, not laws—photos in natural light matter more for apps.",
      },
      {
        h2: "How Style AI uses your photos",
        body: "We look for signals in your portraits to steer palettes—then you confirm what feels right in the mirror. The app is a partner, not a label machine.",
      },
      {
        h2: "Why rigid color rules fail",
        body: "Depth, contrast, hair color, and wardrobe context all shift what reads “clean.” Style AI keeps recommendations tied to outfits you will actually wear.",
      },
    ],
    faqs: [
      {
        q: "Are there colors warm undertones should always avoid?",
        a: "Avoid absolutes. Some shades read harsh depending on contrast and fabric. Use previews and saved likes to learn your personal avoid list.",
      },
    ],
    related: [
      { href: "/guides/color-palette-from-wardrobe", label: "Palette from wardrobe photos" },
      { href: "/", label: "Style AI home" },
    ],
  },
  {
    slug: "outfit-ideas-for-wedding",
    title: "Outfit ideas for a wedding (guest) | Style AI",
    description:
      "Dress-code-aware wedding guest outfits from your closet—palette-smart and photo-grounded with Style AI.",
    h1: "Outfit ideas for a wedding guest",
    lead: "Weddings are high-stakes for photos and dress codes. The fastest path is: decode the invite, check venue and season, then pull candidates from your own closet before you shop.",
    sections: [
      {
        h2: "Decode the dress code",
        body: "Black tie, cocktail, garden formal, and cultural ceremonies all imply different silhouettes and fabrics. Start with constraints, then filter outfits that already fit your style lane.",
      },
      {
        h2: "Build from owned pieces first",
        body: "Catalog dresses, suits, separates, and shoes in Style AI. The app can propose head-to-toe combinations that respect palette and formality—then you adjust accessories.",
      },
      {
        h2: "Photo reality check",
        body: "Indoor reception lighting changes how color reads. Preview combinations and favor shades that still look intentional under warm bulbs and flash.",
      },
    ],
    faqs: [
      {
        q: "Can AI pick a culturally appropriate outfit?",
        a: "AI should assist, not replace hosts’ expectations. Use the app to organize options you already trust, then confirm with the couple or family guidance when needed.",
      },
    ],
    related: [
      { href: "/guides/wedding-guest-outfits-india", label: "Wedding guest outfits (India)" },
      { href: "/guides/office-dress-code-outfits", label: "Office dress code outfits" },
      { href: "/guides/what-to-wear-today-ai", label: "Daily outfit help" },
    ],
  },
  {
    slug: "ai-stylist-app-india",
    title: "AI stylist app in India | Style AI",
    description:
      "What to look for in an AI stylist or outfit planner in India: closet-first looks, skin-tone palettes, humidity and heat, privacy—and how Style AI fits.",
    h1: "Choosing an AI stylist app in India",
    lead: "Search intent in India often clusters around “AI stylist app,” “outfit planner,” and “what to wear today” under real constraints: monsoon humidity, summer heat, office AC, and wedding-season dress codes. This guide maps those needs to product traits—not hype—so you pick a tool that matches your closet and your city.",
    sections: [
      {
        h2: "Closet-first beats scroll-only inspiration",
        paragraphs: [
          "If the app only shows pretty outfits you do not own, you still face the same morning problem: nothing on the rail matches the image in your head. Prioritize products that catalog what you photograph—shoes included—then assemble head-to-toe looks from that set.",
          "Style AI is built around that workflow: your pieces anchor the answer, and skin-aware color reduces the trial-and-error that cheap phone cameras exaggerate.",
        ],
      },
      {
        h2: "Heat, humidity, and fabric honesty",
        paragraphs: [
          "Mumbai monsoon and Delhi summer are different problems: one punishes fabrics that never dry; the other punishes layers that suffocate on the commute but freeze under office AC. Name weather and venue in your prompt; keep breathable staples photographed so the app can rotate them.",
          "For deeper city angles, read our Mumbai monsoon and Delhi summer guides—then return here when you compare apps.",
        ],
      },
      {
        h2: "Skin tone and undertone still matter indoors",
        paragraphs: [
          "Fluorescent office bays and warm banquet halls change how color reads. Undertone-aware palettes help you avoid shades that go muddy under mixed lighting—especially for events where photos matter.",
        ],
      },
      {
        h2: "Privacy and photos",
        paragraphs: [
          "Styling apps need portraits and closet shots. Read retention, deletion, and processors in each privacy policy before you upload sensitive images.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is there a free AI outfit planner in India?",
        a: "Many apps offer a free tier for discovery. Judge value on closet fidelity, head-to-toe completeness, and whether palettes respect your skin—not on banner claims.",
      },
      {
        q: "Does Style AI work outside India?",
        a: "Yes. The marketing site uses a .co.in domain; the product is for anyone who wants closet-first styling. Store availability follows platform regions.",
      },
    ],
    related: [
      { href: "/guides/best-ai-fashion-apps", label: "How to choose an AI fashion app" },
      { href: "/guides/what-to-wear-mumbai-monsoon", label: "What to wear in Mumbai monsoon" },
      { href: "/guides/what-to-wear-delhi-summer-heat", label: "Delhi summer heat outfits" },
    ],
  },
  {
    slug: "what-to-wear-mumbai-monsoon",
    title: "What to wear in Mumbai monsoon | Style AI",
    description:
      "Monsoon outfit planning in Mumbai: quick-dry fabrics, footwear, layers, and closet-first AI styling with Style AI.",
    h1: "What to wear in Mumbai during monsoon",
    lead: "Monsoon in Mumbai is humidity, sudden rain, and shoes that never forgive a bad choice. The goal is outfits you can dry out, move in, and still feel intentional about—without pretending you live in a lookbook.",
    sections: [
      {
        h2: "Fabrics that survive damp air",
        body: "Natural fibers that breathe and blends that release moisture beat clingy synthetics for all-day comfort. Keep monsoon-friendly staples photographed in Style AI so suggestions stay realistic.",
      },
      {
        h2: "Footwear is the bottleneck",
        body: "Train platforms and puddles punish the wrong sole. Anchor outfits around shoes you trust when it is wet; let the app propose separates that match those anchors before you buy new pairs.",
      },
      {
        h2: "A packable layer for AC and evening drizzle",
        body: "Cabs, offices, and malls run cold while streets stay muggy. A light layer you can strip avoids the shiver-and-sweat cycle.",
      },
    ],
    faqs: [
      {
        q: "Can AI know today’s rainfall?",
        a: "No—check the forecast. Use AI to remix owned pieces once you name wet vs. indoor-heavy parts of your day.",
      },
    ],
    related: [
      { href: "/guides/what-to-wear-delhi-summer-heat", label: "Delhi summer heat outfits" },
      { href: "/guides/office-wear-india-heat-ac", label: "Office wear: India heat and AC" },
      { href: "/guides/what-to-wear-today-ai", label: "What to wear today with AI" },
    ],
  },
  {
    slug: "what-to-wear-delhi-summer-heat",
    title: "What to wear in Delhi summer heat | Style AI",
    description:
      "Delhi NCR summer outfits: heat, dust, office AC swings, and closet-based planning with undertone-aware color.",
    h1: "What to wear in Delhi summer heat",
    lead: "Delhi summers punish heavy layers and reward breathable cuts—but office AC can flip you from sweltering to freezing in one elevator ride. Build looks around fabrics you will actually wear outdoors, with a layer strategy for indoors.",
    sections: [
      {
        h2: "Morning commute vs. afternoon cabin",
        body: "Plan for the hottest part of your trip first, then add a structured layer that reads professional under harsh indoor light. Photograph both sides of your wardrobe so AI suggestions stay honest.",
      },
      {
        h2: "Color that survives dust and harsh sun",
        body: "Palettes that flatter your undertone still matter when haze and glare flatten contrast. Use previews to sanity-check how reads change between daylight and cool-white office bays.",
      },
      {
        h2: "Footwear and ground heat",
        body: "Asphalt heat travels up. Prioritize pairs you can walk in; build outfits from shoes outward on brutal days.",
      },
    ],
    faqs: [
      {
        q: "How do I dress for Delhi heat and office AC?",
        a: "Layer intentionally: breathable base, one add-on for freezing conference rooms, and shoes chosen for the outdoor segment first.",
      },
    ],
    related: [
      { href: "/guides/what-to-wear-mumbai-monsoon", label: "Mumbai monsoon outfits" },
      { href: "/guides/office-wear-india-heat-ac", label: "Office wear: India heat and AC" },
      { href: "/guides/what-to-wear-today-ai", label: "What to wear today with AI" },
    ],
  },
  {
    slug: "wedding-guest-outfits-india",
    title: "Wedding guest outfit ideas (India) | Style AI",
    description:
      "Indian wedding guest dressing: venue, climate, regional formality, and closet-first outfit planning with palette-smart AI.",
    h1: "Wedding guest outfits in India",
    lead: "Indian weddings vary by region, religion, and formality—mehendi, sangeet, temple ceremonies, and receptions all imply different silhouettes and fabrics. Start with the invite and host guidance, then use Style AI to rehearse head-to-toe looks from pieces you already own before you shop.",
    sections: [
      {
        h2: "Decode the event, not only the hashtag",
        body: "Day ceremonies under sun favor breathable drapes and footwear you can stand in; evening receptions may allow richer textures and heavier jewelry. Name the segment when you ask for outfits.",
      },
      {
        h2: "Build from owned occasion wear first",
        body: "Catalog sarees, lehengas, suits, and solid separates once—then remix with blouses, dupattas, and accessories the app can see. That keeps spending intentional.",
      },
      {
        h2: "Photo and lighting reality",
        body: "Halls with warm bulbs and flash change how jewel tones read. Undertone-aware palettes reduce the washed-out effect phone galleries exaggerate.",
      },
    ],
    faqs: [
      {
        q: "Can AI replace family or host dress guidance?",
        a: "No—use AI to organize options you already trust, then confirm expectations with hosts when dress codes are strict or culturally specific.",
      },
    ],
    related: [
      { href: "/guides/outfit-ideas-for-wedding", label: "Wedding guest outfits (general)" },
      { href: "/guides/what-to-wear-today-ai", label: "Daily outfit help" },
      { href: "/guides/", label: "All guides" },
    ],
  },
  {
    slug: "office-wear-india-heat-ac",
    title: "Office wear for India heat and AC | Style AI",
    description:
      "Business casual in Indian metros: survive the commute, look polished indoors, and plan outfits from your closet with AI.",
    h1: "Office wear for India’s heat and freezing AC",
    lead: "Metro office dressing is two climates: the walk or ride in, and the conference room that feels like winter. The fix is not a heavier wardrobe—it is layering discipline and shoes chosen for the outdoor segment first.",
    sections: [
      {
        h2: "Anchor on shoes and base layers",
        body: "If feet suffer on the commute, the whole day sours. Pick footwear you can move in, then let separates and palette follow.",
      },
      {
        h2: "One polished layer for the cold zone",
        body: "A structured jacket, stole, or long-sleeve layer that reads intentional beats a random hoodie when clients appear.",
      },
      {
        h2: "Let your catalog reflect both worlds",
        body: "Photograph summer-weight workwear and the indoor layer as separate items so Style AI can propose combinations that match your actual office thermostat war.",
      },
    ],
    faqs: [
      {
        q: "Can AI know my company dress code?",
        a: "You interpret HR language; the app proposes outfits from your wardrobe within the constraints you provide.",
      },
    ],
    related: [
      { href: "/guides/office-dress-code-outfits", label: "Office dress code outfits" },
      { href: "/guides/what-to-wear-delhi-summer-heat", label: "Delhi summer heat" },
      { href: "/guides/what-to-wear-mumbai-monsoon", label: "Mumbai monsoon" },
    ],
  },
  {
    slug: "what-to-wear-in-nyc-spring",
    title: "What to wear in NYC in spring | Style AI",
    description:
      "Layering, weather swings, and walking-city footwear—spring NYC outfit planning with a closet-first AI stylist.",
    h1: "What to wear in NYC in spring",
    lead: "Spring in New York is a moving target: chilly mornings, warm afternoons, and rain without warning. The winning formula is layers you can strip or add without ruining the look.",
    sections: [
      {
        h2: "Pack layers, not bulk",
        body: "Light base layers, a mid layer with structure, and a packable shell beat one heavy coat for most April and May days. Style AI can combine owned pieces into day-to-night stacks.",
      },
      {
        h2: "Footwear for miles",
        body: "Subway stairs and sidewalk miles punish the wrong shoe. Prioritize pairs you already trust; let the app suggest outfits around them before you buy new sneakers.",
      },
      {
        h2: "Color that works indoors and out",
        body: "Cafés and galleries shift lighting fast. Skin-aware palettes help you stay vibrant in both gray daylight and warm interiors.",
      },
    ],
    faqs: [
      {
        q: "Is this weather advice guaranteed?",
        a: "Check a same-day forecast. This page describes typical spring variability; your closet and comfort come first.",
      },
    ],
    related: [
      { href: "/guides/travel-outfits-cold-weather", label: "Cold-weather travel outfits" },
      { href: "/guides/", label: "All guides" },
    ],
  },
  {
    slug: "ai-stylist-busy-parents",
    title: "AI stylist for busy parents | Style AI",
    description:
      "Faster mornings with closet-based outfits, low-friction cataloging, and colors that flatter—built for parents who are short on time.",
    h1: "AI stylist help for busy parents",
    lead: "Parents need defaults that still feel like them. The goal is fewer decisions before coffee: reliable outfits from real clothes, tuned to skin-flattering colors when you care about photos and school runs alike.",
    sections: [
      {
        h2: "Optimize for speed, not fantasy",
        body: "Skip aspirational wardrobes you do not own. Catalog the twenty pieces you actually wear; Style AI can rotate them into fresh combinations.",
      },
      {
        h2: "Low-friction updates",
        body: "Snap new purchases when you unpack them—future mornings get easier each time your digital closet matches reality.",
      },
      {
        h2: "Palette sanity for group photos",
        body: "When everyone is in the frame, feeling “put together” helps. Undertone-aware suggestions reduce the washed-out effect cheap phone cameras exaggerate.",
      },
    ],
    faqs: [
      {
        q: "Will AI understand dress codes for work and school events?",
        a: "You provide context; the app proposes owned outfits that fit. Always double-check institutional rules and invitations.",
      },
    ],
    related: [
      { href: "/guides/what-to-wear-today-ai", label: "What to wear today" },
      { href: "/guides/capsule-wardrobe-outfit-ideas", label: "Capsule wardrobe ideas" },
    ],
  },
  {
    slug: "color-palette-from-wardrobe",
    title: "Build a color palette from your wardrobe | Style AI",
    description:
      "Turn closet photos into a coherent palette—paired with skin-tone context using Style AI.",
    h1: "Color palette from your wardrobe",
    lead: "Your closet already votes for certain hues. Style AI reads those signals alongside your skin tone so new buys extend what works—not fight it.",
    sections: [
      {
        h2: "Photograph in honest light",
        body: "Fluorescent break rooms and golden hour patios both skew color. Aim for natural, indirect daylight when cataloging so the app sees fabric truth.",
      },
      {
        h2: "Cluster what repeats",
        body: "Neutrals, denim washes, and accent colors you buy again and again are your real palette. The app helps surface those clusters as guidance for the next purchase.",
      },
      {
        h2: "Cross-check with skin tone",
        body: "A favorite sweater might love you—or only work with makeup. Undertone-aware analysis helps separate emotional attachment from optical harmony.",
      },
    ],
    faqs: [
      {
        q: "Can I rebuild my palette after a closet purge?",
        a: "Yes. Refresh photos after big edits so recommendations track what is left on the rack.",
      },
    ],
    related: [
      { href: "/guides/skin-tone-colors-warm-undertone", label: "Warm undertone colors" },
      { href: "/guides/best-ai-fashion-apps", label: "Choosing an AI fashion app" },
    ],
  },
  {
    slug: "office-dress-code-outfits",
    title: "Office dress code outfits from your closet | Style AI",
    description:
      "Business casual to smart casual—head-to-toe outfits from pieces you own, with palette guidance from Style AI.",
    h1: "Office dress code outfits",
    lead: "Dress codes are really constraints: hem lengths, shoe formality, denim rules, and layer polish. Style AI works best when you name the code and pull from cataloged workwear.",
    sections: [
      {
        h2: "Translate the policy into silhouettes",
        body: "If denim is allowed only on Fridays, tag those pieces accordingly in your head—and favor structured tops when khakis are the baseline.",
      },
      {
        h2: "Anchor outfits around shoes",
        body: "Office floors are unforgiving. Build looks from footwear you can stand in; the app can propose separates that match those anchors.",
      },
      {
        h2: "Palette polish under office lighting",
        body: "Fluorescents flatten contrast. Slightly richer neutrals or undertone-friendly accents often read more expensive than pure gray-on-gray.",
      },
    ],
    faqs: [
      {
        q: "Can AI know my employer’s exact rules?",
        a: "No. You interpret HR language; Style AI proposes combinations from your wardrobe within the constraints you provide.",
      },
    ],
    related: [
      { href: "/guides/outfit-ideas-for-wedding", label: "Wedding guest outfits" },
      { href: "/guides/what-to-wear-today-ai", label: "Daily outfits" },
    ],
  },
  {
    slug: "capsule-wardrobe-outfit-ideas",
    title: "Capsule wardrobe outfit ideas with AI | Style AI",
    description:
      "More permutations from fewer pieces—capsule logic with closet cataloging and palette-aware suggestions in Style AI.",
    h1: "Capsule wardrobe outfit ideas",
    lead: "Capsules fail when pieces do not share a color story or silhouette language. Style AI helps you see combinations you are underusing before you buy another almost-right tee.",
    sections: [
      {
        h2: "Define the capsule scope",
        body: "Pick a season or a lifestyle bucket—workweek, travel, weekend parent. Smaller scopes mean better suggestions from limited items.",
      },
      {
        h2: "Force multi-use winners",
        body: "Jackets that only match one pair of pants are capsule leaks. The app surfaces high-leverage items by how often they complete viable outfits.",
      },
      {
        h2: "Let undertone guide accent colors",
        body: "Two accent hues that flatter your skin beat five trendy colors that fight your complexion.",
      },
    ],
    faqs: [
      {
        q: "How many pieces belong in a capsule?",
        a: "Common ranges are 25–40 including shoes, but the right number is what you will honestly maintain in the app with photos.",
      },
    ],
    related: [
      { href: "/guides/color-palette-from-wardrobe", label: "Palette from wardrobe" },
      { href: "/guides/", label: "All guides" },
    ],
  },
  {
    slug: "travel-outfits-cold-weather",
    title: "Cold-weather travel outfits | Style AI",
    description:
      "Pack fewer, warmer layers using closet-based outfit planning—palette-smart for photos and airports.",
    h1: "Cold-weather travel outfits",
    lead: "Cold trips reward systems: base, insulate, block wind, one statement outer layer. Style AI helps you rehearse outfits before you fold them into a carry-on.",
    sections: [
      {
        h2: "One coat, many interiors",
        body: "Pick a coat that covers most scenarios; vary scarves, knits, and trousers underneath. Catalog those inner layers so the app can remix without extra luggage.",
      },
      {
        h2: "Boots first",
        body: "Snow and slush dictate soles. Build bottom-half outfits from the boots you will actually pack.",
      },
      {
        h2: "Indoor heat vs. outdoor chill",
        body: "Restaurants overheat. Layer so you can shed without looking unfinished—open cardigans, zip fleeces, and collared shirts help.",
      },
    ],
    faqs: [
      {
        q: "Does Style AI know my destination forecast?",
        a: "You supply weather context; we propose outfits from owned items. Always verify conditions on travel day.",
      },
    ],
    related: [
      { href: "/guides/what-to-wear-in-nyc-spring", label: "NYC spring outfits" },
      { href: "/guides/capsule-wardrobe-outfit-ideas", label: "Capsule ideas" },
    ],
  },
];

function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** @param {{ h2: string; body?: string; paragraphs?: string[] }} s */
function sectionParagraphsHtml(s) {
  const parts = s.paragraphs ?? (s.body != null ? [s.body] : []);
  return parts.map((p) => `            <p>${esc(p)}</p>`).join("\n");
}

function renderGuide(page) {
  const url = `${ORIGIN}/guides/${page.slug}`;
  const faqEntities = page.faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  }));

  const graphLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${ORIGIN}/#organization`,
        name: "Style AI",
        url: `${ORIGIN}/`,
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: page.h1,
        description: page.description,
        datePublished: GUIDE_DATE,
        dateModified: GUIDE_DATE,
        author: { "@type": "Organization", name: "Style AI" },
        publisher: { "@id": `${ORIGIN}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqEntities,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${ORIGIN}/guides/` },
          { "@type": "ListItem", position: 3, name: page.h1, item: url },
        ],
      },
    ],
  };

  const sectionsHtml = page.sections
    .map(
      (s) => `          <section class="legal-doc__section">
            <h2>${esc(s.h2)}</h2>
${sectionParagraphsHtml(s)}
          </section>`
    )
    .join("\n\n");

  const breadcrumbHtml = `        <nav class="guide-doc__breadcrumbs" aria-label="Breadcrumb">
          <ol class="guide-doc__breadcrumbs-list">
            <li class="guide-doc__breadcrumbs-item"><a href="/">Home</a></li>
            <li class="guide-doc__breadcrumbs-item"><a href="/guides/">Guides</a></li>
            <li class="guide-doc__breadcrumbs-item guide-doc__breadcrumbs-item--current" aria-current="page">${esc(page.h1)}</li>
          </ol>
        </nav>`;

  const faqHtml = page.faqs
    .map(
      (f) => `          <div class="legal-doc__faq-item">
            <h2 class="legal-doc__faq-q">${esc(f.q)}</h2>
            <p>${esc(f.a)}</p>
          </div>`
    )
    .join("\n\n");

  const related = page.related || [];
  const relatedHtml =
    related.length > 0
      ? `          <nav class="legal-doc__related" aria-label="Related guides">
            <h2 class="legal-doc__related-title">Related</h2>
            <ul>
${related.map((r) => `              <li><a href="${esc(r.href)}">${esc(r.label)}</a></li>`).join("\n")}
            </ul>
          </nav>`
      : "";

  return `<!DOCTYPE html>
<html class="scroll-smooth" lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/logo-mark.svg" />
    <meta name="theme-color" content="#44182b" />
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:image" content="${ORIGIN}/og-cover.jpg" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:locale:alternate" content="en_US" />
    <meta property="og:site_name" content="Style AI" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(page.title)}" />
    <meta name="twitter:description" content="${esc(page.description)}" />
    <meta name="twitter:image" content="${ORIGIN}/og-cover.jpg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;500;700&family=Manrope:wght@300;400;500;700;800&display=swap"
      rel="stylesheet"
    />
    <script type="application/ld+json">${JSON.stringify(graphLd)}</script>
  </head>
  <body
    class="legal-page guide-page overflow-x-hidden font-body font-light antialiased selection:bg-primary selection:text-white"
  >
    <header class="legal-header">
      <div class="legal-header__inner">
        <a href="/" class="legal-header__brand">
          <img src="/logo-mark.svg" alt="" width="28" height="28" decoding="async" />
          <span>Style AI</span>
        </a>
        <a href="/guides/" class="legal-header__back">← Guides</a>
      </div>
    </header>

    <main id="main" class="legal-doc guide-doc" role="main">
      <article>
${breadcrumbHtml}
        <header class="guide-doc__hero">
          <p class="legal-doc__meta"><a href="/guides/">Guides</a></p>
          <h1>${esc(page.h1)}</h1>
          <p class="guide-doc__updated">
            <time datetime="${GUIDE_DATE}">Updated ${GUIDE_DATE}</time>
            · Editorial guide from Style AI
          </p>
          <p class="guide-doc__lead">${esc(page.lead)}</p>
        </header>

${sectionsHtml}

        <section class="legal-doc__section legal-doc__faq" aria-labelledby="faq-${page.slug}">
          <h2 id="faq-${page.slug}">FAQ</h2>
${faqHtml}
        </section>

${relatedHtml}

        <p class="legal-doc__cta-wrap">
          <a class="legal-doc__cta" href="/#download">Get the app</a>
        </p>
      </article>
    </main>

    <footer class="guide-footer">
      <a href="/privacy">Privacy</a>
      <span aria-hidden="true"> · </span>
      <a href="/terms">Terms</a>
    </footer>
    <script type="module" src="/src/guide-entry.js"></script>
  </body>
</html>
`;
}

function renderIndex() {
  const items = PAGES.map((p) => {
    const blurb =
      p.description.length > 100 ? `${esc(p.description.slice(0, 98))}…` : esc(p.description);
    return `            <li><a href="/guides/${p.slug}">${esc(p.h1)}</a><span> — ${blurb}</span></li>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html class="scroll-smooth" lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="theme-color" content="#44182b" />
    <title>Outfit &amp; style guides | Style AI</title>
    <meta
      name="description"
      content="What to wear today, AI stylist and outfit-planner ideas, skin-tone-friendly colors, and wardrobe tips from your real closet. India-focused angles (monsoon, heat, weddings) plus everyday dress codes and travel."
    />
    <link rel="canonical" href="${ORIGIN}/guides/" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${ORIGIN}/guides/" />
    <meta property="og:title" content="Outfit &amp; style guides | Style AI" />
    <meta
      property="og:description"
      content="What to wear today, AI stylist and outfit-planner ideas, skin-tone-friendly colors, and wardrobe tips from your real closet. India-focused angles plus dress codes and travel."
    />
    <meta property="og:image" content="${ORIGIN}/og-cover.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:description"
      content="What to wear today, AI stylist and outfit-planner ideas, skin-tone-friendly colors, and wardrobe tips from your real closet. India-focused angles plus dress codes and travel."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;500;700&family=Manrope:wght@300;400;500;700;800&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    class="legal-page guide-page overflow-x-hidden font-body font-light antialiased selection:bg-primary selection:text-white"
  >
    <header class="legal-header">
      <div class="legal-header__inner">
        <a href="/" class="legal-header__brand">
          <img src="/logo-mark.svg" alt="" width="28" height="28" decoding="async" />
          <span>Style AI</span>
        </a>
        <a href="/" class="legal-header__back">← Home</a>
      </div>
    </header>
    <main id="main" class="legal-doc guide-doc" role="main">
      <h1>Outfit &amp; style guides</h1>
      <p class="guide-doc__lead">
        Practical reads on what to wear, AI-powered outfit planning from clothes you own, dress codes, travel packing, and colors that flatter your skin—plus India metro seasons and occasions. Each guide links back to the Style AI app when you want to try it.
      </p>
      <ul class="guide-index-list">
${items}
      </ul>
      <p class="legal-doc__cta-wrap">
        <a class="legal-doc__cta" href="/#download">Get Style AI</a>
      </p>
    </main>
    <footer class="guide-footer">
      <a href="/privacy">Privacy</a>
      <span aria-hidden="true"> · </span>
      <a href="/terms">Terms</a>
    </footer>
    <script type="module" src="/src/guide-entry.js"></script>
  </body>
</html>
`;
}

function buildSitemap(paths) {
  const urls = [
    { loc: `${ORIGIN}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${ORIGIN}/terms`, changefreq: "yearly", priority: "0.3" },
    { loc: `${ORIGIN}/privacy`, changefreq: "yearly", priority: "0.3" },
    { loc: `${ORIGIN}/guides/`, changefreq: "weekly", priority: "0.85" },
    ...paths.map((p) => ({
      loc: `${ORIGIN}/guides/${p}`,
      changefreq: "monthly",
      priority: "0.75",
    })),
  ];
  const body = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function patchRedirects(slugs) {
  const raw = fs.readFileSync(redirectsPath, "utf8");
  const lines = raw.split("\n");
  const startIdx = lines.findIndex((l) => l.startsWith("# seo-guides"));
  const head =
    startIdx === -1
      ? lines.filter((l) => l.trim() !== "")
      : lines.slice(0, startIdx).filter((l) => l.trim() !== "");
  const block = [
    "# seo-guides (managed by scripts/generate-seo-pages.mjs)",
    "/guides /guides/index.html 200",
    "/guides/ /guides/index.html 200",
    ...slugs.map((s) => `/guides/${s} /guides/${s}.html 200`),
  ];
  fs.writeFileSync(redirectsPath, [...head, "", ...block, ""].join("\n"));
}

function main() {
  fs.mkdirSync(guidesDir, { recursive: true });
  fs.writeFileSync(path.join(guidesDir, "index.html"), renderIndex());
  const slugs = [];
  for (const page of PAGES) {
    slugs.push(page.slug);
    fs.writeFileSync(path.join(guidesDir, `${page.slug}.html`), renderGuide(page));
  }
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), buildSitemap(slugs));
  patchRedirects(slugs);
  console.log(`[generate-seo-pages] ${1 + PAGES.length} HTML files, sitemap.xml, _redirects`);
}

main();
