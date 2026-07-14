# Security policy & deployment notes

Evidentum Pro is a single, self-contained `index.html`: no backend, no accounts,
and — by design — your projects, screening decisions, notes and any API keys stay
in **your** browser (localStorage / IndexedDB). Nothing is uploaded by the app. Data
leaves the browser only when you act (running a search, an AI appraisal, fetching a
full text), and then only to the provider you chose.

## Reporting a vulnerability

Email **ankianaesthesia@gmail.com** with details and a reproduction. Please do not
open a public issue for an unfixed security problem.

## Security model at a glance

- **Strict Content-Security-Policy** (delivered via `<meta http-equiv>`, since GitHub
  Pages cannot set response headers). `script-src` allows only same-origin scripts
  plus the two inline blocks pinned by build-time SHA-256 hashes — no
  `'unsafe-inline'`. `connect-src` is an explicit allowlist of the scholarly-database
  and AI-provider hosts (the real key-exfiltration boundary). `object-src` and
  `base-uri` are `'none'`.
- **No third-party script or CDN at runtime.** pdf.js is vendored and served
  same-origin; there is no CDN fallback (see below).
- **Event handling** is delegated through a fixed, null-prototype callable allowlist —
  a DOM-provided handler name can never resolve to an arbitrary global.
- **Untrusted input is bounded and escaped.** Imported metadata, API errors and file
  contents are rendered as text or through safe DOM construction; file / PDF / RIS /
  CSV / JSON imports have central size, page, record, field-length and nesting limits
  and are validated before any persisted state is changed.
- **CSV exports** neutralise spreadsheet formula injection (a leading `= + - @`, even
  behind whitespace or control characters, is quoted to literal text).

## API keys and credentials

Persisting API keys in the browser **by default** is a deliberate product choice for a
local-first research tool. You control it:

- A default-on **"Remember keys on this device"** toggle. Turn it off to keep keys for
  the current tab only (cleared when you close it).
- **"Remove all saved credentials"** wipes every AI/database key *and* the experimental
  OpenAI account sign-in token from both localStorage and sessionStorage.
- Backups **exclude** keys unless you explicitly opt in at export time.

Because keys can be stored, the deployment origin matters — see below.

## Deployment: use a dedicated origin

Browser storage (localStorage, IndexedDB) is scoped to the **origin**
(`scheme://host:port`), **not** to the URL path and **not** to the service-worker
scope. The public build is served from:

```
https://ankianaesthesia.github.io/evidentum/
```

Every other GitHub Pages project under `ankianaesthesia.github.io` therefore shares
the **same storage origin** as Evidentum. A vulnerable or differently maintained
sibling app at `…github.io/another-project/` could, in principle, read Evidentum's
persisted keys and project data.

**Recommendation:** for any deployment where credentials are stored, serve Evidentum
on a **dedicated hostname used for no unrelated application**, e.g.
`https://app.<your-evidentum-domain>/`. Do **not** rely on path separation or
service-worker scope as isolation — they are not storage boundaries.

### Migration between origins

Browser-local data does **not** move to a new origin automatically. If you change the
hostname (or move from a shared Pages origin to a dedicated one):

1. On the old origin: **Settings → Backup & Restore → Export** a full backup (opt in
   to include keys only if you understand the backup file then contains them in plain
   text, and transport it safely).
2. On the new origin: **Import** that backup.
3. Verify your projects, screening and settings, then clear data on the old origin.

Users should be warned before a domain change, since an un-exported project would
otherwise appear "lost" at the new address.

## Clickjacking / framing

GitHub Pages supplies HSTS but does not let the app set `X-Frame-Options` or a
`frame-ancestors` **response header**, and browsers ignore `frame-ancestors` when it
is delivered via a `<meta>` CSP. A JavaScript frame-buster is only a partial defence.
If framing/clickjacking protection is a requirement for your deployment, host behind
infrastructure (a custom domain / CDN / reverse proxy) that can set
`Content-Security-Policy: frame-ancestors 'none'` (or `X-Frame-Options: DENY`) as an
HTTP response header.

## pdf.js provenance

- Vendored version: **pdf.js 3.11.174** (`pdf.min.js`, `pdf.worker.min.js`), served
  same-origin.
- SHA-256 of the vendored files:
  - `pdf.min.js` — `5b5799e6f8c680663207ac5b42ee14eed2a406fa7af48f50c154f0c0b1566946`
  - `pdf.worker.min.js` — `feabdf309770ed24bba31a5467836cdc8cf639c705af27d52b585b041bb8527b`
- Every `getDocument()` call sets `isEvalSupported: false` as defence in depth against
  CVE-2024-4367.
- There is **no CDN fallback**: if the local pdf.js cannot load, PDF text extraction
  fails closed (appraisal falls back to the title/abstract) rather than fetching an
  unpinned third-party script.
