// Fill these in after creating the Google Form and publishing its linked Sheet as CSV.
// See README.md for step-by-step instructions on getting each value below.

// The Google Form's "formResponse" submission endpoint.
// Take the form's "Get pre-filled link" URL, drop everything after "viewform",
// then replace "viewform" with "formResponse".
// Example: https://docs.google.com/forms/d/e/1FAIpQLSf.../formResponse
export const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfrnbanK8roQkmXLKLNiLxUNQSnP1dfQ2nMZQBnNucjymVcOA/formResponse'

// The entry.NNNNNNNNN field name for each question, read off the "Get pre-filled link" URL.
export const GOOGLE_FORM_ENTRIES = {
  child: 'entry.933029908',
  guestName: 'entry.1160594916',
  message: 'entry.1075355366',
}

// The CSV export URL of the Sheet linked to the form, published to the web.
// File > Share > Publish to web > select the responses sheet > CSV.
export const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSJdHVO_MZgizN9kJB_oCNfsRlmHVqRe_vDHCrF7TP-T6CnfFVmXFDG4hXXdj34rvWQdq9397LwJeFM/pub?output=csv'

// Soft client-side gate for the parent dashboard. This is NOT real security:
// the published CSV above is link-accessible to anyone who has (or guesses) the URL,
// so this PIN only hides the dashboard from casual visitors, it does not protect the data.
export const ADMIN_PIN = '3296'
