# Evidentum Pro

**A self-contained systematic review search & appraisal workbench.**
Search across major biomedical databases, screen and de-duplicate results, run AI-assisted critical appraisal, and assemble PRISMA-ready records — all from a single HTML file that runs in your browser. Installable as an app, offline-capable, and your data never leaves your machine.

> **Status:** Beta. Features and interfaces are still changing between builds.

🔗 **Live:** https://ankianaesthesia.github.io/evidentum/

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21159986.svg)](https://doi.org/10.5281/zenodo.21159986)

---

## What it does

Evidentum walks a review through the full early workflow — *search → screen → appraise* — without a backend, an account, or a build step. Everything is one `index.html`.

### Multi-database search
A two-stream search builder lets you compose a query once and fan it out across sources:

- **Primary stream** — structured search against PubMed, Europe PMC, and Cochrane, with MeSH and Boolean syntax.
- **Keyword stream** — an auto-derived natural-language query for the broader engines: Scopus, OpenAlex, Semantic Scholar, Crossref, and ClinicalTrials.gov.

Each database is queried in its own native advanced syntax (PubMed field tags and MeSH, Europe PMC `TITLE_ABS`/`MESH`, Scopus `TITLE-ABS-KEY`, ClinicalTrials.gov `AREA[]` expert queries, and per-concept search for OpenAlex and Semantic Scholar), translated deterministically from a single set of concept blocks so the same PICO produces the same, reproducible queries every time.

Includes a concept-block builder, a **live count preview** before you commit, **set history** with Boolean nesting (combine prior sets into a pool), per-source result counts, and **deep pagination** (Europe PMC `cursorMark`, Semantic Scholar token paging) so large searches aren't silently capped at the first page. Optional, clearly-labelled recall levers — Europe PMC synonym expansion and cross-engine phrase proximity — are off by default for precise, reproducible searching.

Study-design limits (e.g. RCTs only) are applied with each engine's native filter where one exists, and with a Cochrane-style sensitivity **hedge** on the keyword engines that lack one — so the restriction actually holds across every source, not just PubMed. For the paywalled databases the app can't call, the builder emits **copy-and-paste strategies for Ovid Embase and Cochrane CENTRAL** in their native line-numbered syntax, translated from the same concept blocks.

### Screening & records
- De-duplication across sources.
- **Keyboard-driven screening** — Rayyan-style shortcuts in a project: `J`/`K` move through records, `I`/`M`/`X` record include/maybe/exclude (auto-advancing to the next undecided), number keys `1`–`0` set the PRISMA exclusion reason, `N` jumps to the next unscreened record. A live tally shows progress at a glance.
- **Dual-reviewer screening** — two reviewers screen independently under blinded A/B lenses; agreements auto-fill the final decision, disagreements surface in a **Conflicts** filter for adjudication, and inter-rater agreement is reported live as **Cohen's κ** (with the Landis–Koch label). Reviewer votes travel in the CSV export.
- **Two-computer dual review** — no shared account needed: the host exports a **reviewer packet** file (blinded — the host's votes and final decisions are stripped from the file itself), Reviewer B imports it into Evidentum on their own machine, screens under a locked Reviewer B lens, and sends back a votes file that merges with conflict detection and a live κ update. Merges are newest-wins per record, so a stale file can never roll back fresher work.
- A **decision filter** (To Screen / Included / Maybe / Excluded / Conflicts) that turns the record list into a shrinking screening queue.
- A **PRISMA-style identification panel** with per-source counts and a **"Copy for methods"** export (structured and prose) that you can paste straight into a manuscript — now including any active search options (synonym expansion, phrase proximity, field limits) so the documented strategy is reproducible.
- A complete **PRISMA 2020 flow diagram** with screening stages, plus structured exclusion reasons.
- **Projects** — group searches and saved records into named projects.
- **Retraction sweep** — scan your reference set against retraction data.
- Citation tooling: *cited-by* and *related articles* lookups, copy citation, reference-manager export (**RIS / BibTeX**), and **CSV export**.

### AI-assisted appraisal
An optional AI agent reads full text (PMC XML, PDF, or fetched HTML) and drafts structured critical appraisals against standard instruments:

- **Risk of bias** — RoB 2 and ROBINS-I V2 (with **traffic-light plots** you can download as a robvis-style export), plus the Newcastle-Ottawa Scale and the Jadad scale.
- **Reporting quality** — CONSORT 2025, PRISMA 2020, STROBE, CARE 2013, and AGREE II.
- **Certainty of evidence** — GRADE, with a **Summary of Findings** export.

The agent is **bring-your-own-key** with a provider toggle for **OpenAI**, **Anthropic / Claude**, **Google Gemini**, and **xAI Grok**:

- **OpenAI** (Responses API) and **Anthropic** (Messages API) — strong, well-calibrated appraisal judgements and reliable structured output.
- **Google Gemini** (generativelanguage API) — large context windows and low cost, a good fit for high-volume abstract screening.
- **xAI Grok** (OpenAI-compatible API) — an additional low-cost option.

Pick a model per provider in Settings (or enter a custom model ID). The active model is recorded alongside your search provenance.

### Full text & library access
- **PDF Scanner** — drop in a local PDF (plus supplementary files), run any of the appraisal checklists against it, and **add the result straight to a project** — checklist metadata and any detected DOI / full-text links carry across exactly as for a database result.
- **Reference Scanner** — extract a paper's bibliography, locate each reference online, and bulk-add the located set to a project.
- **LibKey** integration for institutional library access.
- Optional **Scopus**, **NCBI/PubMed**, and **Semantic Scholar** API keys for expanded access and higher rate limits.

---

## Quick start

No install needed — just open the live link. To run it yourself:

```bash
git clone https://github.com/AnkiAnaesthesia/evidentum.git
cd evidentum
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

- Enter keys under **⚙ Settings → AI Agent — API Keys** (OpenAI, Anthropic, and Google Gemini), along with Scopus, NCBI, and Semantic Scholar credentials.
- Keys and your saved data stay in your own browser storage — nothing is transmitted to or stored by this project.
- Because there's no backend, **clearing site data clears your projects**, so export anything you want to keep.

---

## Technical notes

- **Single file.** The shipped app is one `index.html` — markup, styles, and logic. No bundler, no dependencies to install at runtime.
- **Built from modular source.** The development build concatenates partials (`src/01-head.html`, `02-styles.css`, `03-body.html`, `04-app.js`, `05-foot.html`) into the single file with `npm run build`; `npm test` exercises the pure logic against the shipped file, and `npm run verify` checks the two are in sync.
- **PWA assets** in the repo root:
  - `manifest.webmanifest` — app metadata.
  - `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` — app icons.
  - `sw.js` — service worker. Uses a **network-first** strategy for the page so a new deploy is always served fresh, and cache-first only for static icons. Bump the `CACHE` version string in `sw.js` on release if you want to force clients to refresh cached assets.
- External runtime dependencies are limited to `pdf.js` (CDN) and Google Fonts.

---

## Disclaimer

Evidentum is a research aid, not a substitute for methodological judgement. AI-generated appraisals and extracted data **must be verified by a human reviewer** before use in any review or publication. Database coverage and API behaviour change over time; always confirm counts and records against the source.

Appraisal instruments are reproduced for use within the app with attribution to their authors; tools under a NonCommercial-NoDerivatives licence are reproduced verbatim and used only because this tool is non-commercial. See the in-app **Settings → References & licences** panel for full citations and licence terms, and always consult the original source for full guidance.

---

## How to cite

If you use Evidentum in a review, please cite it (or use GitHub's *Cite this repository* button):

> McNally A. *Evidentum: a self-contained systematic review search and appraisal workbench* (v1.0.0-beta). Zenodo. https://doi.org/10.5281/zenodo.21159986

## Acknowledgements

Built and maintained by [AnkiAnaesthesia](https://ankianaesthesia.com.au). Successor to the PubMed Lab Assistant.

## License

Released under the **MIT License** — see [`LICENSE`](LICENSE). © 2026 Angus McNally.
