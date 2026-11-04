# Hesabyar 2.0 — UI prototype

A Persian-first, right-to-left interface prototype for the Hesabyar accounting product.

> **Prototype only:** every value shown in the app is mock data. This build does not calculate or post financial transactions, persist data, connect to a backend, or use production services. The established `KarenYar` app remains a separate, unapproved source candidate; this greenfield shell is not a replacement for it.

## Run locally

Requirements: Node.js 22.12+ and npm.

```bash
npm ci
npm run dev
```

The Vite server binds to `0.0.0.0:5173` for the Arena preview. Useful checks:

```bash
npm run typecheck
npm run build
```

## Current prototype scope

- Responsive Persian RTL dashboard and navigation.
- Sample sales, customers, payments, inventory, and report views.
- Search, date-range menu, notification panel, lightweight preview dialogs, an in-memory sample-customer form, read-only customer details, and customer status filtering.
- The date selector switches between hard-coded demo chart series; it does not query or calculate real sales.
- A sample customer exists only in page memory and disappears on refresh; detail views are mock-only. Do not enter real customer information.
- No database, API, authentication, licensing, accounting rules, or real transaction actions.

The wider architecture and domain proposals remain in `docs/`; this prototype intentionally does not treat them as approved financial requirements.
