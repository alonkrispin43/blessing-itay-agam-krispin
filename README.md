# Itai & Agam Blessings

A polished Hebrew RTL celebration site for collecting messages for Itai and Agam's Bar and Bat Mitzvah. Guests can choose whom they are writing to, submit a blessing, and see a confirmation. A protected parent dashboard collects every message in one place and includes filtering, printable layouts, sharing tools, and a QR sign for the event.

This is a fully static site — no server, no database. Guest submissions go straight to a Google Form, and the parent dashboard reads responses from the linked Google Sheet, published as CSV.

## Key Technologies

- Vite with React 19 and TypeScript (plain SPA, no server-side rendering)
- Google Forms for collecting guest submissions
- A published-to-web Google Sheet (CSV) as the read model for the parent dashboard
- Lucide icons and QR code generation
- Responsive custom CSS with RTL and print support
- GitHub Pages for hosting, GitHub Actions for deployment

## Project Structure

- `src/App.tsx` — guest experience and parent dashboard (all screens and logic)
- `src/main.tsx` — mounts `App` into `#root`
- `src/styles.css` — responsive design and print styles
- `src/google-config.ts` — Google Form/Sheet constants you need to fill in (see below)
- `src/lib/google.ts` — `submitToGoogleForm`, `fetchBlessingsFromSheet`, and the CSV parser
- `.github/workflows/deploy.yml` — builds and deploys `dist/` to GitHub Pages on every push to `main`

## Setup

### 1. Create the Google Form

Create a new Google Form with exactly these three questions, in this order:

1. **child** — Multiple choice, with these exact options: `איתי` and `אגם`
2. **guestName** — Short answer
3. **message** — Paragraph

The question titles don't matter functionally (the code doesn't read them), but the **order** and the **exact multiple-choice option text** (`איתי` / `אגם`) matter — the app submits and matches on that Hebrew text.

### 2. Get the form's entry IDs and action URL

1. In the form editor, click the **⋮** (more) menu → **Get pre-filled link**.
2. Fill in any placeholder answers (pick a child, type anything for name/message) and click **Get link**.
3. Copy the generated link. It looks like:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSf.../viewform?usp=pp_url&entry.111111111=...&entry.222222222=...&entry.333333333=...
   ```
4. Match each `entry.NNNNNNNNN=value` pair to the answer you typed, to figure out which entry ID belongs to `child`, `guestName`, and `message`.
5. Build the form's submission URL by taking everything before `?` and swapping `viewform` for `formResponse`:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSf.../formResponse
   ```

### 3. Publish the responses Sheet as CSV

1. In the form editor, go to the **Responses** tab and click the Sheets icon to create/open the linked spreadsheet.
2. In the Sheet, go to **File → Share → Publish to web**.
3. Choose the response sheet/tab, set the format to **Comma-separated values (.csv)**, and click **Publish**.
4. Copy the resulting URL — it looks like `https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv`.

⚠️ Anyone with this URL can read all submitted blessings. This is a deliberate tradeoff for a fully static, serverless setup — don't publish this URL anywhere public. The admin PIN below is a UI convenience, not real access control.

### 4. Fill in `src/google-config.ts`

Open `src/google-config.ts` and replace the placeholders with the values gathered above:

```ts
export const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/.../formResponse'
export const GOOGLE_FORM_ENTRIES = {
  child: 'entry.111111111',
  guestName: 'entry.222222222',
  message: 'entry.333333333',
}
export const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/.../pub?output=csv'
export const ADMIN_PIN = 'your-pin-here'
```

### 5. Enable GitHub Pages

1. Push this repository to GitHub (if not already).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main` — the `deploy.yml` workflow builds the site and publishes `dist/` automatically. The site will be served at `https://<your-username>.github.io/blessing-itay-agam-krispin/`.

If you use a custom domain (or a `<username>.github.io` root site) instead of the `/blessing-itay-agam-krispin/` project path, update `base` in `vite.config.ts` to `'/'`.

## Local Development

1. Install dependencies with `npm install`.
2. Fill in `src/google-config.ts` as described above (submissions/dashboard won't work with placeholder values).
3. Run `npm run dev` and open the printed local URL.

## Build

```
npm install
npm run build
```

Output is written to `dist/`.
