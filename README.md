# Evidentum Pro

**A self-contained systematic review search & appraisal workbench.**
Search across major biomedical databases, screen and de-duplicate results, run AI-assisted critical appraisal, and assemble PRISMA-ready records — all from a single HTML file that runs in your browser. Installable as an app, offline-capable, and your data never leaves your machine.

> **Status:** Beta. Features and interfaces are still changing between builds.

🔗 **Live:** https://ankianaesthesia.github.io/pubmedsearch/

---

## What it does

Evidentum walks a review through the full early workflow — *search → screen → appraise* — without a backend, an account, or a build step. Everything is one `index.html`.

### Multi-database search
A two-stream search builder lets you compose a query once and fan it out across sources:

- **Primary stream** — structured search against PubMed, Europe PMC, and Cochrane, with MeSH and Boolean syntax.
- **Keyword stream** — an auto-derived natural-language query for the broader engines: Scopus, OpenAlex, Semantic Scholar, Crossref, and ClinicalTrials.gov.

Includes a concept-block builder, a **live count preview** before you commit, **set history** with Boolean nesting (combine prior sets into a pool), and per-source result counts.

### Screening & records
- De-duplication across sources.
- A **PRISMA-style identification panel** with per-source counts and a **"Copy for methods"** button that produces text you can paste straight into a manuscript.
- **Projects** — group searches and saved records into named projects.
- **Retraction sweep** — scan your reference set against retraction data.
- Citation tooling: *cited-by* and *related articles* lookups, copy citation, and **CSV export**.

### AI-assisted appraisal
An optional AI agent reads full text (PMC XML, PDF, or fetched HTML) and drafts structured critical appraisals against standard instruments:

- **RoB 2** and **ROBINS-2** (risk of bias), with **traffic-light plots** you can download as PNG.
- **CONSORT**, **STROBE**, **PRISMA**, and **GRADE** checklists.

The agent is **bring-your-own-key**. Default model is OpenAI **GPT-5** via the Responses API, with an **Anthropic / Claude** provider toggle.

### Full text & library access
- **PDF Scanner** for local documents.
- **LibKey** integration for institutional library access.
- Optional **Scopus** API credentials for Scopus search and citation data.

---

## Quick start

No install needed — just open the live link. To run it yourself:

```bash
git clone https://github.com/AnkiAnaesthesia/pubmedsearch.git
cd pubmedsearch
# open index.html in a browser, or serve locally:
python3 -m http.server 8000
# then visit http://localhost:8000
```

> A local server (rather than opening the file directly) is recommended so the service worker and PWA install work, and to avoid `file://` CORS limits on some API calls.

### Install as an app
In Chrome/Edge, open the live site and use the install icon in the address bar (or browser menu → *Install Evidentum*). On iOS Safari, use *Share → Add to Home Screen*. Once installed it launches in its own window and works offline for the parts that don't need network access.

---

## API keys & privacy

Evidentum has **no server**. Searches go directly from your browser to each database's public API, and any AI keys you enter are used only for direct calls to that provider.

- Enter keys under **⚙ Settings → AI Agent — API Keys** (and Scopus credentials there too).
- Keys and your saved data stay in your own browser storage — nothing is transmitted to or stored by this project.
- Because there's no backend, **clearing site data clears your projects**, so export anything you want to keep.

---

## Technical notes

- **Single file.** The entire app is `index.html` — markup, styles, and logic. No bundler, no dependencies to install.
- **PWA assets** in the repo root:
  - `manifest.webmanifest` — app metadata.
  - `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` — app icons.
  - `sw.js` — service worker. Uses a **network-first** strategy for the page so a new deploy is always served fresh, and cache-first only for static icons. Bump the `CACHE` version string in `sw.js` on release if you want to force clients to refresh cached assets.
- External runtime dependencies are limited to `pdf.js` (CDN) and Google Fonts.

---

## Disclaimer

Evidentum is a research aid, not a substitute for methodological judgement. AI-generated appraisals and extracted data **must be verified by a human reviewer** before use in any review or publication. Database coverage and API behaviour change over time; always confirm counts and records against the source.

---

## Acknowledgements

Built and maintained by [AnkiAnaesthesia](https://ankianaesthesia.com.au). Successor to the PubMed Lab Assistant.

## License

_Set your preferred license here (e.g. MIT). No license file is included by default — without one, the work is "all rights reserved."_
