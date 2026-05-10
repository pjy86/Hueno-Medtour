/** HTML fragment escaping for plaintext CMS fallback (admin-trusted markup passes through unchanged). */
function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Heuristic: CMS string looks like deliberate HTML/markup (<strong>, <h5>, <br>, …).
 * Otherwise plaintext: escape and turn newlines into <br>.
 */
function looksLikeCmsMarkup(s: string): boolean {
  return /<\/?[a-z][a-z0-9-]*(?:\s|>|\/|$)/i.test(s) || /<\/?br\s*\/?>/i.test(s)
}

/** Safe fragment for innerHTML inside admin-controlled CMS bodies. */
export function cmsFieldToHtmlFragment(input: string | null | undefined): string {
  if (input == null) return ''
  const s = input.replace(/\r\n/g, '\n')
  const t = s.trim()
  if (!t) return ''
  if (looksLikeCmsMarkup(s)) return s
  return escapeHtml(s).replace(/\n/g, '<br />')
}
