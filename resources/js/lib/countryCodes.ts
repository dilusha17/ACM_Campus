export interface CountryCode {
  id: number;
  name: string;
  dial_code: string;
}

// Options keyed by country id (one entry per country).
export const countryIdOptions = (countryCodes: CountryCode[]) =>
  countryCodes.map((c) => ({ value: String(c.id), label: `${c.name} (${c.dial_code})` }));

// Options keyed by dial code, for fields that store the dial code itself.
// Countries sharing a code (e.g. +1, +7) are merged so every value is unique.
export const dialCodeOptions = (countryCodes: CountryCode[]) =>
  Object.values(
    countryCodes.reduce<Record<string, { value: string; names: string[] }>>((acc, c) => {
      (acc[c.dial_code] ??= { value: c.dial_code, names: [] }).names.push(c.name);
      return acc;
    }, {}),
  ).map(({ value, names }) => ({ value, label: `${names.join(" / ")} (${value})` }));
