# reconcilegst

Browser-based GST reconciliation for Indian businesses and CAs. Upload your GSTR-2A (JSON) and Purchase Register (Excel), and get a reconciliation report — matched, mismatched, and missing invoices — in seconds.

**Live:** https://www.reconcilegst.in

## Why this exists

Most GST reconciliation tools ask you to upload sensitive financial data to their servers. This one doesn't. Parsing, matching, and the export all run locally in your browser — your GSTR-2A and Purchase Register never touch our infrastructure. You can verify this by reading the code (see `src/hooks/useReconciliation.ts` and `src/lib/`).

## What it does

- Parses GSTR-2A JSON (handles B2B, CDN/CDNR, and the camt/csamt, samt/ssamt field variants).
- Parses Purchase Register Excel/CSV with flexible column-name detection.
- Matches invoices by GSTIN + invoice number + amount + date, with fuzzy tolerance for common mismatches (date drift, rounding, invoice-number formatting like `BILL/104` vs `BILL104`).
- Produces a report with three buckets: matched, mismatched (amount/date differs), and missing on either side.
- Exports the full report as Excel.

## Stack

- Next.js 14 (App Router) on Vercel
- TypeScript
- Supabase (auth only — no data is stored there from the reconciliation flow)
- `xlsx` for Excel read/write, all client-side

## Running locally

```bash
npm install
npm run dev
```

Create a `.env.local` with your own Supabase project if you want auth to work locally:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

The core reconciliation flow at `/reconcile` works without any env setup.

## Author

Built by [Ishwar Iyer](https://www.linkedin.com/in/ishwar-iyer-a33b9a1b4/).
