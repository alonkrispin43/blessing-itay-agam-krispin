// Fill these in after creating the Google Form and publishing its linked Sheet as CSV.
// See README.md for step-by-step instructions on getting each value below.

// The Google Form's "formResponse" submission endpoint.
// Take the form's "Get pre-filled link" URL, drop everything after "viewform",
// then replace "viewform" with "formResponse".
// Example: https://docs.google.com/forms/d/e/1FAIpQLSf.../formResponse
export const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/REPLACE_WITH_FORM_ID/formResponse'

// The entry.NNNNNNNNN field name for each question, read off the "Get pre-filled link" URL.
export const GOOGLE_FORM_ENTRIES = {
  child: 'entry.REPLACE_WITH_CHILD_ENTRY_ID',
  guestName: 'entry.REPLACE_WITH_GUEST_NAME_ENTRY_ID',
  message: 'entry.REPLACE_WITH_MESSAGE_ENTRY_ID',
}

// The CSV export URL of the Sheet linked to the form, published to the web.
// File > Share > Publish to web > select the responses sheet > CSV.
export const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/REPLACE_WITH_SHEET_ID/pub?output=csv'

// Soft client-side gate for the parent dashboard. This is NOT real security:
// the published CSV above is link-accessible to anyone who has (or guesses) the URL,
// so this PIN only hides the dashboard from casual visitors, it does not protect the data.
export const ADMIN_PIN = '0000'
