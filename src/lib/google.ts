import { GOOGLE_FORM_ACTION_URL, GOOGLE_FORM_ENTRIES, GOOGLE_SHEET_CSV_URL } from '../google-config'
import type { Blessing, Child } from '../types'

const CHILD_LABELS: Record<Child, string> = {
  itai: 'איתי',
  agam: 'אגם',
}

const CHILD_LABEL_TO_ID: Record<string, Child> = {
  [CHILD_LABELS.itai]: 'itai',
  [CHILD_LABELS.agam]: 'agam',
}

// Google Forms' /formResponse endpoint doesn't send CORS headers, so the response is opaque
// under mode: 'no-cors' — we can't verify the submission was accepted, only that the request
// went out. This matches the no-server design: there is nothing else to check against.
export async function submitToGoogleForm(input: { child: Child; guestName: string; message: string }): Promise<void> {
  const body = new URLSearchParams({
    [GOOGLE_FORM_ENTRIES.child]: CHILD_LABELS[input.child],
    [GOOGLE_FORM_ENTRIES.guestName]: input.guestName,
    [GOOGLE_FORM_ENTRIES.message]: input.message,
  })

  await fetch(GOOGLE_FORM_ACTION_URL, {
    method: 'POST',
    mode: 'no-cors',
    body,
  })
}

export async function fetchBlessingsFromSheet(): Promise<Blessing[]> {
  const response = await fetch(GOOGLE_SHEET_CSV_URL, { cache: 'no-store' })
  if (!response.ok) throw new Error('Unable to load blessings sheet')

  const rows = parseCsv(await response.text())
  const [, ...dataRows] = rows // drop header row: Timestamp, Child, GuestName, Message

  return dataRows
    .filter((row) => row.some((cell) => cell.trim() !== ''))
    .map((row, index) => {
      const [timestamp, childLabel, guestName, message] = row
      return {
        id: index,
        child: CHILD_LABEL_TO_ID[(childLabel ?? '').trim()] ?? 'itai',
        guestName: (guestName ?? '').trim(),
        message: (message ?? '').trim(),
        createdAt: (timestamp ?? '').trim(),
      } satisfies Blessing
    })
    .reverse() // newest first, matching the previous server-side desc(createdAt) ordering
}

// Minimal CSV parser: handles quoted fields, escaped quotes ("") inside them,
// and commas/newlines embedded within quoted fields.
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (char === '\r') {
      continue
    } else {
      field += char
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}
