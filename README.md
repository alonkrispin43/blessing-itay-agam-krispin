# Itai & Agam Blessings

A polished Hebrew RTL celebration site for collecting messages for Itai and Agam's Bar and Bat Mitzvah. Guests can choose whom they are writing to, submit a blessing, and see a confirmation. A protected parent dashboard collects every message in one place and includes filtering, printable layouts, sharing tools, and a QR sign for the event.

## Key Technologies

- TanStack Start with React 19 and TypeScript
- Netlify Functions for the blessings API
- Netlify Database with Drizzle ORM for persistent guest messages
- Zod for server-side input validation
- Lucide icons and QR code generation
- Responsive custom CSS with RTL and print support

## Local Setup

1. Install dependencies with `pnpm install`.
2. Configure an `ADMIN_PIN` environment variable for access to the parent dashboard.
3. Start the Netlify development environment with `netlify dev --port 8889`.
4. Open the local URL shown by Netlify Dev.

Netlify applies the migration in `netlify/database/migrations/` automatically during deployment. A managed database is provisioned on first connection.

## Project Structure

- `src/routes/index.tsx` — guest experience and parent dashboard
- `src/styles.css` — responsive design and print styles
- `netlify/functions/blessings.mts` — submission and parent-list API
- `db/schema.ts` — blessings table schema
- `netlify/database/migrations/` — generated database migration
