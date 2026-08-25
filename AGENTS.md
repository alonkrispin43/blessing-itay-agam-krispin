# Project Guide

## Overview

This project is a Hebrew, right-to-left celebration site for collecting Bar and Bat Mitzvah blessings for Itai and Agam. Guests choose a child, submit a signed message, and receive a confirmation. Parents can open a protected dashboard to review, filter, print, and share the collection through a generated QR code.

## Architecture

- `src/routes/index.tsx` contains the single-page guest flow, parent dashboard, QR generation, and print interactions.
- `src/routes/__root.tsx` defines the Hebrew RTL document shell and page metadata.
- `src/styles.css` contains the complete responsive visual system and print layouts.
- `netlify/functions/blessings.mts` exposes the public submission and protected parent-list API at `/api/blessings`.
- `db/schema.ts` defines the Drizzle schema for persisted blessings.
- `db/index.ts` initializes the Netlify Database adapter.
- `netlify/database/migrations/` contains deploy-time database migrations.

## Technology

- TanStack Start and React 19
- TypeScript and Vite
- Netlify Functions
- Netlify Database with Drizzle ORM
- Lucide icons and client-side QR generation

## Conventions

- Keep user-facing copy in Hebrew and preserve RTL layout behavior.
- Use `Child` values `itai` and `agam` consistently across the UI, API, and database.
- Validate all public API input with Zod before writing to the database.
- Keep parent-only data behind the server-side `ADMIN_PIN` environment variable.
- Add every schema change to `db/schema.ts` and generate a matching migration in `netlify/database/migrations/`.
- Prefer semantic HTML, accessible labels, keyboard focus states, and reduced-motion support.
- Preserve the dedicated `print-admin` and `print-sign` body modes when changing layouts.

## Local Development

- Install dependencies with `pnpm install`.
- Configure `ADMIN_PIN` in the local Netlify environment before testing the parent dashboard.
- Use Netlify Dev when exercising Functions and Database behavior.
