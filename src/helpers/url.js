const Url = {
  isUrlSafe: function(name) {
    return /[^A-Za-z0-9]/.test(name);
  },
  safeName: function(name): string {
    // Note: doesn't work for:
    // "Late Night Sessions: Run in the Jungle Ft D*minds & T&gt;i, I Am Jakes, T Lex B2B Kendrick, Ts2w"

    if (!name || typeof name !== 'string') {
      return '';
    }

    return encodeURIComponent(
      name.trim()
        .toLowerCase()
        // .replace(/[^A-Za-z0-9]/, '');
        .replace(/[:/,()[\]{}&;!?*>.]/g, '')
        .replace(/\s/g, '-')
        .replace(/^-+|-+(?=-|$)/g, '')
    );

  },

  /**
   * Normalise a path segment for comparison. `safeName` percent-encodes non-ASCII
   * characters, but React Router's `useParams()` returns decoded values, so direct
   * equality with `safeName(...)` fails for titles containing em dashes and similar.
   */
  decodePathSlug: function(param) {
    if (param == null || param === '') {
      return '';
    }
    const s = String(param);
    try {
      return decodeURIComponent(s);
    } catch (e) {
      return s;
    }
  }
}

export default Url;
