export type MoneyUnit = 'rial' | 'toman';

export type MoneyInputError = 'empty' | 'invalid-format' | 'must-be-positive';

export type MoneyInputResult =
  | { ok: true; amountInRials: bigint }
  | { ok: false; error: MoneyInputError };

const persianIntegerFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 0,
});

function normalizeDigits(input: string): string {
  return input.replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0));
}

/**
 * Parse a positive whole-number amount using the explicitly selected unit.
 * The result is always an exact integer number of rials; no rounding occurs.
 * Plain digits and correctly grouped thousands (comma or Persian separator) are accepted.
 */
export function parsePositiveMoneyInput(input: string, unit: MoneyUnit): MoneyInputResult {
  const normalized = normalizeDigits(input.trim()).replace(/٬/g, ',');
  if (!normalized) return { ok: false, error: 'empty' };

  const isNegative = normalized.startsWith('-');
  const unsignedInput = isNegative ? normalized.slice(1) : normalized;
  const hasValidGrouping = /^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(unsignedInput);
  if (!hasValidGrouping) return { ok: false, error: 'invalid-format' };

  const enteredAmount = BigInt(unsignedInput.replaceAll(',', ''));
  if (isNegative || enteredAmount === 0n) return { ok: false, error: 'must-be-positive' };

  return {
    ok: true,
    amountInRials: unit === 'toman' ? enteredAmount * 10n : enteredAmount,
  };
}

/** Format non-negative rials as tomans without losing a rial remainder. */
export function formatExactRialsAsToman(amountInRials: bigint): string {
  if (amountInRials < 0n) throw new RangeError('Amount must be non-negative.');

  const tomans = amountInRials / 10n;
  const remainingRials = amountInRials % 10n;
  const formattedTomans = persianIntegerFormatter.format(tomans);

  if (remainingRials === 0n) return `${formattedTomans} تومان`;
  return `${formattedTomans} تومان و ${persianIntegerFormatter.format(remainingRials)} ریال`;
}
