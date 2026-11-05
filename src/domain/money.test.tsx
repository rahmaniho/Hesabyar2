import { describe, expect, it } from 'vitest';
import { formatExactRialsAsToman, parsePositiveMoneyInput } from './money';

describe('exact mock-safe money input helper', () => {
  it('requires an explicit unit and converts whole toman to exact rials', () => {
    expect(parsePositiveMoneyInput('11', 'rial')).toEqual({ ok: true, amountInRials: 11n });
    expect(parsePositiveMoneyInput('11', 'toman')).toEqual({ ok: true, amountInRials: 110n });
  });

  it('preserves every small positive rial amount and exact 10/11-rial boundaries', () => {
    for (let amountInRials = 1n; amountInRials <= 11n; amountInRials += 1n) {
      expect(parsePositiveMoneyInput(amountInRials.toString(), 'rial')).toEqual({ ok: true, amountInRials });
    }
  });

  it('uses BigInt to preserve large values without floating-point loss', () => {
    const input = '123456789012345678901234567890';
    expect(parsePositiveMoneyInput(input, 'rial')).toEqual({ ok: true, amountInRials: BigInt(input) });
  });

  it('accepts Persian and Latin digits, including correctly grouped thousands', () => {
    expect(parsePositiveMoneyInput('۱۲۳', 'rial')).toEqual({ ok: true, amountInRials: 123n });
    expect(parsePositiveMoneyInput('123', 'rial')).toEqual({ ok: true, amountInRials: 123n });
    expect(parsePositiveMoneyInput('۱٬۲۳۴', 'rial')).toEqual({ ok: true, amountInRials: 1234n });
    expect(parsePositiveMoneyInput('1,234', 'rial')).toEqual({ ok: true, amountInRials: 1234n });
  });

  it('preserves a rial remainder when formatting tomans', () => {
    expect(formatExactRialsAsToman(10n)).toBe('۱ تومان');
    expect(formatExactRialsAsToman(11n)).toBe('۱ تومان و ۱ ریال');
    expect(formatExactRialsAsToman(19n)).toBe('۱ تومان و ۹ ریال');
  });

  it('rejects empty, zero, and negative sale inputs', () => {
    expect(parsePositiveMoneyInput('  ', 'rial')).toEqual({ ok: false, error: 'empty' });
    expect(parsePositiveMoneyInput('۰', 'rial')).toEqual({ ok: false, error: 'must-be-positive' });
    expect(parsePositiveMoneyInput('-11', 'rial')).toEqual({ ok: false, error: 'must-be-positive' });
    expect(parsePositiveMoneyInput('−11', 'rial')).toEqual({ ok: false, error: 'invalid-format' });
  });

  it('rejects decimal amounts and malformed grouping rather than rounding', () => {
    expect(parsePositiveMoneyInput('1.1', 'toman')).toEqual({ ok: false, error: 'invalid-format' });
    expect(parsePositiveMoneyInput('۱٫۱', 'toman')).toEqual({ ok: false, error: 'invalid-format' });
    expect(parsePositiveMoneyInput('1,00', 'rial')).toEqual({ ok: false, error: 'invalid-format' });
    expect(parsePositiveMoneyInput('۱۲۳ تومان', 'toman')).toEqual({ ok: false, error: 'invalid-format' });
  });

  it('does not format negative amounts as sales', () => {
    expect(() => formatExactRialsAsToman(-1n)).toThrow(RangeError);
  });
});
