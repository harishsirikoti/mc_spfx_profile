/**
 * Returns a safe link for the given text, or undefined if the text is not a safe link.
 *
 * Allowed values:
 *  - absolute https URLs, e.g. "https://contoso.com/page"
 *  - site-relative paths, e.g. "/sites/hr/SitePages/Nominate.aspx"
 *
 * Everything else (javascript:, data:, http:, "//host" and so on) is rejected,
 * so a bad value in the property pane can never become a clickable script link.
 */
export function getSafeUrl(value: string | undefined): string | undefined {
  const text: string = (value || '').trim();
  if (!text) {
    return undefined;
  }

  // Site-relative path. "//host/path" is excluded because browsers treat it as an external host.
  if (text.charAt(0) === '/' && text.charAt(1) !== '/' && text.charAt(1) !== '\\') {
    return text;
  }

  try {
    const url: URL = new URL(text);
    return url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Property pane validator. An empty value is allowed (the button is simply disabled).
 * Returns an error message for a non-empty value that is not a safe link.
 */
export function validateUrlField(value: string, errorMessage: string): string {
  return !value || !value.trim() || getSafeUrl(value) ? '' : errorMessage;
}
