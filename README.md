# Evidentum Pro

**A self-contained systematic review search & appraisal workbench.**
Search across major biomedical databases, screen and de-duplicate results, run AI-assisted critical appraisal, and assemble PRISMA-ready records — all from a single HTML file that runs in your browser. Installable as an app, offline-capable, light or dark theme, and with **no project-operated backend** — your projects stay in your browser (see [Privacy & data flow](#privacy--data-flow) for what does travel to external services).

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
- **Review protocol** — a structured, pre-registration-style protocol per project (background, PICO, outcomes, eligible designs, information sources, risk-of-bias plan, synthesis plan, registration), with a completeness counter and a standalone **protocol export** formatted to **PRISMA-P**. Define the method before you search, then let the search trail and reports document what you actually did.
- De-duplication across sources.
- **Keyboard-driven screening** — Rayyan-style shortcuts in a project: `J`/`K` move through records, `I`/`M`/`X` record include/maybe/exclude (auto-advancing to the next undecided), number keys `1`–`0` set the PRISMA exclusion reason, `N` jumps to the next unscreened record. A live tally shows progress at a glance.
- **Dual-reviewer screening** — two reviewers screen independently under blinded A/B lenses; agreements auto-fill the final decision, disagreements surface in a **Conflicts** filter for adjudication, and inter-rater agreement is reported live as **Cohen's κ** (with the Landis–Koch label). Reviewer votes travel in the CSV export.
- **Two-computer dual review** — no shared account needed: the host exports a **reviewer packet** file (blinded — the host's votes and final decisions are stripped from the file itself), Reviewer B imports it into Evidentum on their own machine, screens under a locked Reviewer B lens, and sends back a votes file that merges with conflict detection and a live κ update. Merges are newest-wins per record, so a stale file can never roll back fresher work.
- A **decision filter** (To Screen / Included / Maybe / Excluded / Conflicts) that turns the record list into a shrinking screening queue.
- A **screening burndown** — a progress bar with coverage (screened / total / %) and, from your decision timestamps, an honest **pace and time-to-finish estimate** taken from active screening bursts so breaks between sittings don't skew it. Lens-aware, so each reviewer sees their own progress.
- **Send all to project** — push a whole result set into a project for screening in one step (no more adding records one at a time).
- **Update searches (Cochrane MECIR C37)** — re-running a saved strategy later and sending again adds *only new records* to the screening queue (existing ones are skipped); update arrivals are badged **✨ NEW**. The project records each search date and yield, and shows an **amber/red reminder** when the search is ageing past ~6–12 months.
- A **PRISMA-style identification panel** with per-source counts and a **"Copy for methods"** export (structured and prose) that you can paste straight into a manuscript — now including any active search options (synonym expansion, phrase proximity, field limits) so the documented strategy is reproducible.
- A **PRISMA-S search report** export — a submission-ready supplement with the full per-database strategies *as executed*, limits, search dates, update-search yields, and the deduplication method, keyed to the PRISMA-S reporting items.
- A complete **PRISMA 2020 flow diagram** with screening stages, plus structured exclusion reasons.
- **Projects** — group searches and saved records into named projects.
- **Retraction sweep** — scan your reference set against retraction data.
- Citation tooling: *cited-by* and *related articles* lookups, copy citation, reference-manager export (**RIS / BibTeX**), and **CSV export**.

### Data extraction
- A **structured extraction table** per project — define your own columns once (seeded with a standard set: design, population, N, intervention, comparator, outcomes, results, funding), fill them per study, and export the whole thing as a **wide evidence matrix** (one row per study, one column per field) for your appendix.
- **AI first-draft** — when the appraisal agent runs, it pre-fills the fields it can already answer (design, population, sample size, key result) and flags them with a 🤖 **VERIFY** badge until a human confirms them; reviewer edits are never overwritten.

### AI-assisted appraisal
An optional AI agent reads full text (PMC XML, PDF, or fetched HTML) and drafts structured critical appraisals against standard instruments:

- **Risk of bias** — RoB 2 (randomized trials) and ROBINS-I V2 (non-randomized studies of interventions), with **traffic-light plots** you can download as a robvis-style export; **QUADAS-2** for diagnostic-test-accuracy studies (four bias domains plus the three applicability judgements); and the Newcastle-Ottawa Scale and Jadad scale.
- **Appraising included reviews** — **AMSTAR 2**, for overviews/umbrella reviews that include other systematic reviews, with its proper **overall confidence rating** (High / Moderate / Low / Critically low) derived from the seven critical domains rather than a raw item score.
- **Reporting quality** — CONSORT 2025, PRISMA 2020, STROBE, CARE 2013, and AGREE II.
- **Certainty of evidence** — GRADE, with a **Summary of Findings** export.
- **Validation harness** — compare the AI's RoB 2 / ROBINS-I V2 judgements for a project against a reference standard (e.g. a published review's consensus judgements): export a reference-template CSV, fill it in, import it back, and read per-domain agreement (raw %, Cohen's κ, linearly weighted κ) with a disagreement list, results CSV, and a copy-ready methods paragraph — the measurement instrument for a formal validation study.

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

## Privacy & data flow

Evidentum has **no project-operated backend** — no server run by this project ever receives your data. Your projects, screening decisions, appraisals and API keys live only in your browser's local storage. Because the app talks *directly* to external services, though, some data does leave your device while you use it:

- **Search queries** go directly from your browser to whichever scholarly databases you tick — PubMed, Europe PMC, Cochrane, Scopus, OpenAlex, Semantic Scholar, Crossref and ClinicalTrials.gov.
- **AI appraisal** sends the selected abstract, full text or supplementary text to the **AI provider you configure** (OpenAI / Anthropic / Google / xAI), authenticated with your key. Nothing is sent to any AI provider until you enter a key and start an analysis.
- **Full-text and metadata lookups** (DOI resolution, open-access PDF discovery) contact services such as Crossref and Unpaywall.
- **Semantic Scholar** can fall back through a **public CORS proxy** (AllOrigins / CodeTabs / ThingProxy) when a direct request is blocked — which would route that one query, including its search terms, through a third-party service. This fallback is **opt-in and off by default**: enable it under **⚙ Settings → Semantic Scholar** if you want it. With it off, a blocked Semantic Scholar request simply fails and is reported, with no third party in the path. No other database ever uses a proxy.

Keys and saved data are never sent to or stored by *this project* — but note that browser extensions and other same-origin scripts running in your browser can read local storage, including any saved keys. Enter keys under **⚙ Settings → AI Agent — API Keys** (OpenAI, Anthropic, Google Gemini, xAI), along with Scopus, NCBI and Semantic Scholar credentials. By default keys persist in this browser; untick **“Remember keys on this device”** to keep them for the current tab only (cleared when you close it). Because there's no backend, **clearing site data clears your projects**, so export anything you want to keep.

---

## Technical notes

- **Single file.** The shipped app is one `index.html` — markup, styles, and logic. No bundler, no dependencies to install at runtime.
- **Generated, not hand-edited.** The single `index.html` is generated from a modular source (HTML/CSS/JS partials) and validated by an automated build and test suite maintained in a separate development workspace. This repository ships the built, self-contained file rather than the build tooling — so there is nothing to install or compile to run it.
- **PWA assets** in the repo root:
  - `manifest.webmanifest` — app metadata.
  - `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` — app icons.
  - `sw.js` — service worker. Uses a **network-first** strategy for the page so a new deploy is always served fresh, and cache-first only for static icons. Bump the `CACHE` version string in `sw.js` on release if you want to force clients to refresh cached assets.
- **Fonts are embedded** (WOFF2 data URIs) — no font-CDN requests, so typography survives offline and on `file://`. The only external runtime dependency is `pdf.js` (CDN, with a graceful fallback).

---

## Disclaimer

Evidentum is a research aid, not a substitute for methodological judgement. AI-generated appraisals and extracted data **must be verified by a human reviewer** before use in any review or publication. Database coverage and API behaviour change over time; always confirm counts and records against the source.

See **Licensing** below and the in-app **Settings → References & licences** panel for the appraisal-instrument citations and their licence terms, and always consult the original source for full guidance.

---

## How to cite

If you use Evidentum in a review, please cite it (or use GitHub's *Cite this repository* button):

> McNally A. *Evidentum: a self-contained systematic review search and appraisal workbench* (v1.0.0-beta). Zenodo. https://doi.org/10.5281/zenodo.21159986

## Acknowledgements

Built and maintained by [AnkiAnaesthesia](https://ankianaesthesia.com.au). Successor to the PubMed Lab Assistant.

## Licensing

The **application code** is released under the **MIT License** — see [`LICENSE`](LICENSE). © 2026 Angus McNally.

The embedded **appraisal instruments and reporting guidelines** — including RoB 2, ROBINS-I V2, QUADAS-2, AMSTAR 2, the Newcastle–Ottawa Scale, the Jadad scale, PRISMA 2020 / PRISMA-S / PRISMA-P, CONSORT 2025, STROBE, CARE, AGREE II and GRADE — are **not** covered by that MIT licence. Each remains the copyright of its respective authors and is reproduced here, with attribution, solely for **non-commercial** research use under the terms each instrument's licence permits; those under CC BY-NC-ND (e.g. RoB 2, ROBINS-I V2) are reproduced verbatim, without modification. Evidentum is a non-commercial academic instrument — it is not sold and has no paid tier. Full per-instrument citations and licence terms are listed in the app under **Settings → References & licences**. If you reuse or host Evidentum, keep that non-commercial scope and the instrument attributions intact.
