export interface BirthNumberParseResult {
  valid: boolean;
  birthDate?: string;
  gender?: 'male' | 'female';
}

export function parseBirthNumber(input: string): BirthNumberParseResult {
  if (!input) return { valid: false };

  const digits = input.replace(/\D/g, '');
  if (digits.length !== 9 && digits.length !== 10) return { valid: false };

  const yy = parseInt(digits.slice(0, 2), 10);
  let mm = parseInt(digits.slice(2, 4), 10);
  const dd = parseInt(digits.slice(4, 6), 10);

  let gender: 'male' | 'female';
  if (mm >= 1 && mm <= 12) {
    gender = 'male';
  } else if (mm >= 21 && mm <= 32) {
    gender = 'male';
    mm -= 20;
  } else if (mm >= 51 && mm <= 62) {
    gender = 'female';
    mm -= 50;
  } else if (mm >= 71 && mm <= 82) {
    gender = 'female';
    mm -= 70;
  } else {
    return { valid: false };
  }

  let year: number;
  if (digits.length === 10) {
    year = yy < 54 ? 2000 + yy : 1900 + yy;
  } else {
    year = 1900 + yy;
  }

  const date = new Date(Date.UTC(year, mm - 1, dd));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== mm - 1 ||
    date.getUTCDate() !== dd
  ) {
    return { valid: false };
  }

  if (digits.length === 10) {
    const first9 = parseInt(digits.slice(0, 9), 10);
    const last = parseInt(digits.slice(9), 10);
    const mod = first9 % 11;
    // Standard: last digit = first9 mod 11. Pre-1985 edge: if mod === 10, last digit was 0.
    const expected = mod === 10 ? 0 : mod;
    if (last !== expected) return { valid: false };
  }

  const iso = `${year.toString().padStart(4, '0')}-${mm.toString().padStart(2, '0')}-${dd.toString().padStart(2, '0')}`;
  return { valid: true, birthDate: iso, gender };
}
