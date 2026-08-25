# Project Guide

## Overview

This project is a Hebrew, right-to-left celebration site for collecting Bar and Bat Mitzvah blessings for Itai and Agam. Guests choose a child, submit a signed message, and receive a confirmation. Parents can open a protected dashboard to review, filter, print, and share the collection through a generated QR code.

## Architecture

- `index.html` + `src/main.tsx` bootstrap the plain Vite SPA (no server, no SSR).
- `src/App.tsx` contains the single-page guest flow, parent dashboard, QR generation, and print interactions.
- `src/styles.css` contains the complete responsive visual system and print layouts.
- `src/google-config.ts` holds the Google Form/Sheet constants (form action URL, entry IDs, sheet CSV URL, admin PIN).
- `src/lib/google.ts` exposes `submitToGoogleForm` (guest submissions) and `fetchBlessingsFromSheet` (parent dashboard reads), plus the CSV parser.

## Technology

- Vite and React 19, TypeScript
- Google Forms for submissions, a published-to-web Google Sheet (CSV) as the read model
- Lucide icons and client-side QR generation
- GitHub Pages + GitHub Actions for hosting/deployment

## Conventions

- Keep user-facing copy in Hebrew and preserve RTL layout behavior.
- Use `Child` values `itai` and `agam` consistently across the UI and Google Form/Sheet mapping.
- The admin PIN in `src/google-config.ts` is a soft client-side UI gate only — the published Sheet CSV is link-accessible to anyone, so treat that URL as the real secret.
- Prefer semantic HTML, accessible labels, keyboard focus states, and reduced-motion support.
- Preserve the dedicated `print-admin` and `print-sign` body modes when changing layouts.

## Local Development

- Install dependencies with `npm install`.
- Fill in `src/google-config.ts` with real Google Form/Sheet values before testing submissions or the parent dashboard (see `README.md`).
- Run `npm run dev` and open the printed local URL.
