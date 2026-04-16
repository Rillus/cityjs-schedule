const schedule = require('../../public/cityjs-london.json');

describe('cityjs-london.json', () => {
  it('lists the four Day 3 tracks from the official programme', () => {
    const names = schedule.locations.map((l) => l.name);
    expect(names).toEqual(
      expect.arrayContaining([
        'Great Hall - Ground Floor',
        'Small Hall - Level 1',
        'Session Room 1 - Level -1',
        'Session Room 2 - Level -1',
      ])
    );
  });

  it('includes Douglas Crockford closing the Great Hall track', () => {
    const gh = schedule.locations.find((l) => l.name === 'Great Hall - Ground Floor');
    expect(gh).toBeDefined();
    const crockford = gh.events.find((e) => e.name.includes('Douglas Crockford'));
    expect(crockford).toBeDefined();
    expect(crockford.start).toBe('2026-04-17 16:45');
  });

  it('normalises pasted typos to 2026-04-17 for Small Hall Ali Spivak slot', () => {
    const sh = schedule.locations.find((l) => l.name === 'Small Hall - Level 1');
    const ali = sh.events.find((e) => e.name.includes('Ali Spivak'));
    expect(ali.start).toMatch(/^2026-04-17 /);
  });

  it('gives every event a unique short id for lineup sharing', () => {
    const shorts = schedule.locations.flatMap((l) => l.events.map((e) => e.short));
    expect(new Set(shorts).size).toBe(shorts.length);
  });
});
