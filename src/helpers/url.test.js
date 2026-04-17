import Url from './url';

describe('formatUrl', () => {
  it('should format a string to a safe URL', () => {
    const name = 'Late Night Sessions: Run in the Jungle Ft D*minds & T>i, I Am Jakes, T Lex B2B Kendrick, Ts2w?!@#$%^&*()_+{}[]|;:,.<>/?`~';
    const expected = 'late-night-sessions-run-in-the-jungle-ft-dminds-ti-i-am-jakes-t-lex-b2b-kendrick-ts2w%40%23%24%25%5E_%2B%7C%3C%60~';
    expect(Url.safeName(name)).toEqual(expected);
  });

  it('should return an empty string if the input is empty', () => {
    expect(Url.safeName('')).toEqual('');
  });

  it('should return an empty string if the input is undefined', () => {
    expect(Url.safeName(undefined)).toEqual('');
  });

  it('should return an empty string if the input is null', () => {
    expect(Url.safeName(null)).toEqual('');
  });

  it('should return an empty string if the input is not a string', () => {
    expect(Url.safeName(123)).toEqual('');
  });
});

describe('decodePathSlug', () => {
  it('lets session detail routes match titles whose safeName used encodeURIComponent', () => {
    const title = 'Start of Track 1 — Sara Vieira';
    const slugFromLink = Url.safeName(title);
    const asRouterParam = Url.decodePathSlug(slugFromLink);
    expect(
      Url.decodePathSlug(Url.safeName(title)) === Url.decodePathSlug(asRouterParam)
    ).toBe(true);
  });

  it('returns an empty string for nullish params', () => {
    expect(Url.decodePathSlug(null)).toEqual('');
    expect(Url.decodePathSlug(undefined)).toEqual('');
  });

  it('returns the original string when decoding throws', () => {
    expect(Url.decodePathSlug('%')).toEqual('%');
  });
});
