const eleventyImage = require("@11ty/eleventy-img");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const sharp = require("sharp");

// Vorschaubilder fuer soziale Netzwerke (og:image). Eigener Cache, gleiche
// Logik wie beim Bild-Cache: einmal erzeugt, bei folgenden Builds nur kopiert.
const OG_CACHE_DIR = "_og-cache";
// Fallback fuer Seiten ohne eigenes Hero-Bild: die typografische Karte mit
// dem Kernsatz. Besser als ein beliebiges Motiv — sie sagt wenigstens etwas.
const OG_FALLBACK = "img/og-startseite.jpg";
const SITE_URL = "https://luenstroth-werbeagentur.de";
// Laufende og-Bild-Auftraege je Dateiname (verhindert doppelte Arbeit und
// halbfertig kopierte Dateien beim parallelen Rendern).
const ogLaufend = new Map();

// Bild-Cache liegt bewusst AUSSERHALB von _site, damit ein "sauberer" Build
// (rm -rf _site) den Bild-Cache nicht mitlöscht. eleventy-img erkennt anhand
// eines Hashes aus Originaldatei + Einstellungen, ob eine Variante schon
// existiert, und überspringt sie dann — spart bei jedem erneuten Build Zeit,
// solange dieser Ordner erhalten bleibt.
const IMG_CACHE_DIR = "_image-cache";

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg", "src/favicon.ico": "favicon.ico", "src/favicon-96x96.png": "favicon-96x96.png", "src/apple-touch-icon.png": "apple-touch-icon.png", "src/web-app-manifest-192x192.png": "web-app-manifest-192x192.png", "src/web-app-manifest-512x512.png": "web-app-manifest-512x512.png", "src/site.webmanifest": "site.webmanifest" });
  // Weiterleitungen alte WordPress-URLs -> neue Struktur (Apache/netcup)
  eleventyConfig.addPassthroughCopy("src/.htaccess");
  eleventyConfig.addPassthroughCopy("src/fonts");
  // Ganzer css-Ordner (main.css + fonts/) — vorher fehlte main.css hier,
  // wodurch eine veraltete, einmalig kopierte Version im _site-Ordner
  // liegen blieb und Änderungen nie ankamen.
  eleventyConfig.addPassthroughCopy("src/css");
  // Bereits erzeugte, komprimierte Varianten aus dem dauerhaften Cache
  // unverändert in den Build-Ordner kopieren (kein erneutes Komprimieren nötig)
  eleventyConfig.addPassthroughCopy({ [IMG_CACHE_DIR]: "img/optimized" });
  eleventyConfig.addPassthroughCopy({ [OG_CACHE_DIR]: "img/og" });

  // ogImage: schneidet das Hero-Bild der Seite auf 1200 x 630 zu — das Format,
  // das LinkedIn, Facebook, WhatsApp und Slack fuer Linkvorschauen erwarten.
  // Ohne das teilt sich die ganze Website ein einziges Vorschaubild, und zwar
  // die unbearbeitete Originaldatei mit mehreren Megabyte, die viele
  // Plattformen wegen ihrer Groesse gar nicht erst laden.
  eleventyConfig.addAsyncShortcode("ogImage", async function (src) {
    let rel = String(src || OG_FALLBACK).replace(/^\/?img\//, "img/");
    let inputPath = path.join("src", rel);
    if (!fs.existsSync(inputPath)) inputPath = path.join("src", OG_FALLBACK);

    const st = fs.statSync(inputPath);
    const hash = crypto.createHash("sha1")
      .update(inputPath + "|" + st.size + "|" + st.mtimeMs + "|1200x630")
      .digest("hex").slice(0, 10);
    const name = "og-" + hash + ".jpg";
    const outPath = path.join(OG_CACHE_DIR, name);

    // Eleventy rendert Seiten parallel. Teilen sich mehrere Seiten dasselbe
    // Hero-Bild, laufen mehrere Aufrufe gleichzeitig auf dieselbe Zieldatei.
    // Ohne Absicherung sieht der zweite Aufrufer die Datei schon "existieren",
    // waehrend sharp noch schreibt, und kopiert sie halbfertig (0 KB) in den
    // Build. Deshalb: pro Dateiname genau ein Vorgang, und atomar schreiben.
    if (!ogLaufend.has(name)) {
      ogLaufend.set(name, (async () => {
        if (!fs.existsSync(outPath)) {
          fs.mkdirSync(OG_CACHE_DIR, { recursive: true });
          const tmp = outPath + "." + process.pid + ".tmp";
          await sharp(inputPath)
            .resize(1200, 630, { fit: "cover", position: "centre" })
            .flatten({ background: "#f5f2ee" })  // Transparenz -> Papierton statt Schwarz
            .jpeg({ quality: 82, mozjpeg: true })
            .toFile(tmp);
          fs.renameSync(tmp, outPath);          // erst jetzt ist sie sichtbar
        }
        // Direkt in den Build-Ordner kopieren: Der Passthrough des Cache-Ordners
        // laeuft VOR dem Rendern und wuerde eine in diesem Lauf neu erzeugte
        // Datei nicht mehr mitnehmen. So genuegt ein einziger Build.
        const zielOrdner = path.join("_site", "img", "og");
        const ziel = path.join(zielOrdner, name);
        fs.mkdirSync(zielOrdner, { recursive: true });
        if (!fs.existsSync(ziel) || fs.statSync(ziel).size !== fs.statSync(outPath).size) {
          fs.copyFileSync(outPath, ziel);
        }
      })());
    }
    await ogLaufend.get(name);

    return SITE_URL + "/img/og/" + name;
  });

  // ── ZWEISPRACHIGKEIT ──────────────────────────────────────
  // Jede englische Seite liegt unter /en/ und trägt im Front Matter
  // "key: <deutsche URL>". Daraus entsteht die Paar-Tabelle. Der
  // Sprachumschalter führt damit immer auf die gespiegelte Seite.
  // Fehlt ein Gegenstück, bricht der Produktions-Build ab (siehe unten),
  // damit nie ein EN-Klick auf einer falschen Seite landet.
  const I18N = require("./src/_data/i18n.json");
  const ohneGegenstueck = new Set();

  eleventyConfig.addCollection("sprachpaare", (api) => {
    const paare = {};                              // url -> { de, en }
    const alle = api.getAll().filter((p) => p.url && !p.data.eleventyExcludeFromCollections);
    for (const p of alle) {
      if (!p.url.startsWith("/en/")) continue;
      const de = p.data.key;
      if (!de) throw new Error(`EN-Seite ohne "key" (deutsche URL): ${p.inputPath}`);
      if (!alle.some((d) => d.url === de)) throw new Error(`"key" ${de} in ${p.inputPath} zeigt auf keine deutsche Seite`);
      if (paare[de]) throw new Error(`Doppelte EN-Seite für ${de}: ${paare[de].en} und ${p.url}`);
      paare[de] = paare[p.url] = { de, en: p.url };
    }
    return paare;
  });

  // Statement in Buchstaben zerlegen (für .stmt-Animationen). Streuwerte sind deterministisch, damit jeder Build gleich aussieht.
  eleventyConfig.addFilter("statementLetters", (text = "") => {
    let i = 0;
    const words = String(text).trim().split(/\s+/).map((w) => [...w].map((c) => {
      const k = i++;
      return { c, i: k, dy: (((k * 37) % 11) - 5) * 0.14, dx: (((k * 23) % 7) - 3) * 0.05, rot: (((k * 53) % 9) - 4) * 3 };
    }));
    return { words, n: i, mid: (i - 1) / 2 };
  });
  eleventyConfig.addFilter("plaintext", (html = "") => String(html)
    .replace(/<(script|style|svg|noscript)[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/(p|h[1-6]|li|div|section|figcaption|blockquote|tr|header)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim());
  eleventyConfig.addFilter("sprachpaar", (url, paare) => (paare && paare[url]) || null);
  eleventyConfig.addFilter("gegenstueck", (url, paare) => {
    const p = paare && paare[url];
    if (p) return url.startsWith("/en/") ? p.de : p.en;
    ohneGegenstueck.add(url);
    return url.startsWith("/en/") ? "/" : "/en/";  // nur Entwicklungsstand
  });

  eleventyConfig.on("eleventy.after", () => {
    if (!ohneGegenstueck.size) return;
    const liste = [...ohneGegenstueck].sort().join("\n  ");
    ohneGegenstueck.clear();
    const meldung = `Seiten ohne Sprach-Gegenstück:\n  ${liste}`;
    // "npx @11ty/eleventy" (Produktions-Build) bricht ab; --serve warnt nur.
    // Für Zwischenstände: I18N_LAX=1 setzen.
    if (process.env.ELEVENTY_RUN_MODE === "build" && !process.env.I18N_LAX) throw new Error(meldung);
    console.warn("\n[i18n] WARNUNG — " + meldung + "\n");
  });

  // breadcrumbSchema: BreadcrumbList aus der URL. Zentral im Layout, damit
  // keine Seite sie einzeln pflegen muss. Google zeigt damit im Suchergebnis
  // den Pfad statt der nackten URL.
  eleventyConfig.addShortcode("breadcrumbSchema", function (url, titel, kurzname) {
    const en = String(url || "").startsWith("/en/");
    const sprache = I18N[en ? "en" : "de"];
    const CRUMB_NAMEN = sprache.crumbs;
    const teile = String(url || "/").split("/").filter(Boolean);
    if (en) teile.shift();                         // "en" ist keine eigene Ebene
    if (teile.length === 0) return "";           // Startseite braucht keine Spur

    const items = [{ name: sprache.homeLabel, url: SITE_URL + sprache.home }];
    let pfad = en ? "/en" : "";
    teile.forEach((seg, i) => {
      pfad += "/" + seg;
      const letzte = i === teile.length - 1;
      let name;
      if (letzte) {
        // langer SEO-Titel taugt nicht als Krume: vor dem ersten Doppelpunkt
        // oder Gedankenstrich abschneiden
        name = kurzname || String(titel || seg).split(/[:–—|]/)[0].trim();
      } else {
        name = CRUMB_NAMEN[seg] || seg.replace(/-/g, " ");
      }
      items.push({ name, url: SITE_URL + pfad + "/" });
    });

    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: it.url,
      })),
    });
  });

  // respImage: erzeugt responsive, komprimierte WebP/JPEG-Varianten mit srcset
  eleventyConfig.addShortcode("respImage", async function (src, alt, sizes, opts = {}) {
    if (!alt && alt !== "") {
      throw new Error(`Fehlendes alt-Attribut für Bild: ${src}`);
    }
    let inputPath = path.join("src", src.replace(/^\/?img\//, "img/"));
    let metadata = await eleventyImage(inputPath, {
      // 2560 = Breite der gelieferten Hero-Originale. Breiten über der
      // Originalbreite lässt eleventy-img weg, 3200 greift nur bei größeren.
      widths: [480, 900, 1400, 2200, 2560, 3200],
      formats: ["webp", "jpeg"],
      outputDir: IMG_CACHE_DIR,
      urlPath: "/img/optimized/",
    });
    // Gleiches Problem wie beim og-Cache: Der Passthrough des Cache-Ordners
    // läuft VOR dem Rendern. In diesem Lauf neu erzeugte Varianten kämen erst
    // beim nächsten Build an — nach einem sauberen Build fehlten sie.
    // Deshalb jede Variante direkt nach _site kopieren (nur wenn nötig).
    const zielOrdner = path.join("_site", "img", "optimized");
    fs.mkdirSync(zielOrdner, { recursive: true });
    for (const format of Object.values(metadata)) {
      for (const v of format) {
        const ziel = path.join(zielOrdner, v.filename);
        if (!fs.existsSync(ziel) || fs.statSync(ziel).size !== v.size) {
          fs.copyFileSync(v.outputPath, ziel);
        }
      }
    }
    let imageAttributes = {
      alt,
      sizes: sizes || "100vw",
      decoding: "async",
    };
    if (opts.eager) {
      imageAttributes.loading = "eager";
      imageAttributes.fetchpriority = "high";
    } else {
      imageAttributes.loading = "lazy";
    }
    if (opts.class) imageAttributes.class = opts.class;
    return eleventyImage.generateHTML(metadata, imageAttributes);
  });

  return {
    dir: { input: "src", output: "_site", layouts: "_layouts" },
  };
};
