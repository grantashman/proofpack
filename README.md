# ProofPack

Client-ready proof-of-service reports for Australian commercial cleaners.

**Repository status:** private validation build. The landing page and assets are complete and tested; the product backend, public domain, submission endpoint, operator details and privacy policy are intentionally not invented or deployed.

## Offer under test

- **14-day founding cleaner pilot**
- **A$39/month including GST** after the pilot
- No automatic conversion and no lock-in
- Five active client sites
- Unlimited branded reports

The price and feature boundary live in [`src/data/offer.mjs`](src/data/offer.mjs), so page copy and structured data consume one source of truth.

## Product hypothesis

A small commercial-cleaning business should be able to complete a site checklist, attach before/after and exception evidence, and send a consistent client report before leaving the building—without adopting a full scheduling, payroll or invoicing platform.

### Founding feature set

- Reusable client-site checklists
- Before, after and issue photo evidence
- Timestamped issue and follow-up notes
- Branded PDF and client share link
- Australian spelling, dates, addresses and GST wording
- Straightforward report export and deletion contract

All company names, sites, report identifiers and evidence counts shown in the demo are explicitly fictional. The page contains no invented testimonials, customer logos or outcome claims.

## Included deliverables

| Deliverable | Path |
|---|---|
| Responsive landing page | `src/pages/index.astro` |
| Browser/print sample report | `src/pages/sample-report.astro` |
| Downloadable sample PDF | `public/assets/proofpack-sample-report.pdf` |
| Mark and lockup | `public/brand/*.svg` |
| 180px and 512px app icons | `public/brand/proofpack-icon-*.png` |
| 1200×630 social card | `public/brand/proofpack-og.png` |
| Portable design tokens | `tokens.css` |
| Asset generators | `scripts/` |
| Contract and browser tests | `tests/` |

## Local development

Requires Node.js 22.12 or newer.

```bash
npm ci
npx playwright install chromium
npm run dev
```

Open `http://localhost:4321`.

### Verification

```bash
npm run verify
npm audit --audit-level=high
```

`npm run verify` executes source/asset contracts, Astro checks and static build, Playwright tests at 320/375/414/768px, a 1280×800 fold check, Axe serious/critical accessibility analysis, form-state tests and sample-report verification.

### Regenerate assets

```bash
npm run assets
```

This renders the raster brand assets with Sharp and generates the A4 sample PDF from the actual report route in headless Chromium.

## Pilot-form configuration

The form intentionally fails closed until a destination is configured.

```env
PUBLIC_SITE_URL=https://your-domain.example
PUBLIC_PILOT_ENDPOINT=https://your-form-endpoint.example
PUBLIC_PILOT_EMAIL=
```

`PUBLIC_PILOT_ENDPOINT` is preferred. It receives JSON with `businessName`, `email`, `siteCount`, and `source`. `PUBLIC_PILOT_EMAIL` is an optional mail-client fallback; because it is compiled into the public bundle, only use an address intended for publication.

## Public-launch gates

Before deployment:

1. Choose the public ProofPack domain and set `PUBLIC_SITE_URL`.
2. Identify the operating person/entity and public contact route.
3. Publish a privacy policy that matches the selected form endpoint, hosting and retention.
4. Connect and test `PUBLIC_PILOT_ENDPOINT`; keep the no-endpoint failure closed.
5. Confirm data hosting, access control, link expiry, photo retention, export and deletion behaviour before accepting client data.
6. Replace synthetic photo slots only with staged/owned images or real pilot images used with permission.
7. Validate the A$39/month GST treatment and billing process before collecting payment.
8. Run the full verification suite against the deployment.

## Technology

- Astro 7 static output
- Self-hosted Fontsource typography
- CSS/HTML product demonstrations—no fake browser or phone chrome
- Playwright and Axe browser QA
- GitHub Actions CI

No licence is granted while this repository remains a private product-validation project.
