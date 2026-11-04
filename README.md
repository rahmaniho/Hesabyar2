# Hesabyar 2.0 — UI prototype and WP-1 helper

A Persian-first RTL interface prototype with a standalone exact money-input helper. The helper is not connected to sales or transaction posting.

> **Build status:** every value shown in the app is mock data. The user selected `Hesabyar2` as the greenfield development source with a Shared Core target; the app is still a UI prototype. A standalone WP-1 money-input helper preserves explicitly unit-tagged whole-number Rial/Toman values exactly, but it is not connected to sales, a ledger, persistence, a backend, or production services. `KarenYar` has not been imported or modified.

## Run locally

Requirements: Node.js 22.12+ and npm.

```bash
npm ci
npm run dev
```

The Vite server binds to `0.0.0.0:5173` for the Arena preview. Useful checks:

```bash
npm run test
npm run typecheck
npm run build
```

GitHub Actions runs these checks plus a low-threshold dependency audit for pull requests and pushes to `main` and `arena/**`. The workflow is read-only and does not deploy, sign, publish artifacts, or release.

## Current prototype scope

- Responsive Persian RTL dashboard and navigation.
- Sample sales, customers, payments, inventory, and report views.
- Search, date-range menu, notification panel, lightweight preview dialogs, an in-memory sample-customer form, read-only customer/invoice/inventory details, and mock status filters for invoice, activity, customer, and inventory lists.
- The date selector switches between hard-coded demo chart series; it does not query or calculate real sales. Invoice item names/counts and inventory values are fixed mock data; displayed totals/prices are copied from sample rows, not calculated, and cannot be paid, edited, or posted.
- A separate pure helper in `src/domain/money.ts` accepts explicitly selected whole-number Rial/Toman input, converts it to exact integer Rials with `BigInt`, and formats Rial remainders without rounding. It is not connected to the sale UI, ledger, or persistence.
- A sample customer exists only in page memory and disappears on refresh; detail views are mock-only. Do not enter real customer or invoice information.
- No database, API, authentication, licensing, ledger/posting rules, or real transaction actions. The standalone money helper does exact input parsing only; it is not a transaction or accounting engine.

The wider architecture and domain proposals remain in `docs/`; this prototype intentionally does not treat them as approved financial requirements.
