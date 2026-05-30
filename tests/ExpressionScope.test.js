const { describe, it, assert, assertEqual, assertClose } = require('./runner');
const { ExpressionScope: S } = require('../src/core/ExpressionScope');

describe('ExpressionScope — math aliases', () => {
  it('sin(pi/2) ≈ 1', () => assertClose(S.sin(S.pi / 2), 1));
  it('cos(0) === 1',   () => assertClose(S.cos(0), 1));
  it('sqrt(4) === 2',  () => assertClose(S.sqrt(4), 2));
  it('exp(1) ≈ e',     () => assertClose(S.exp(1), S.e));
  it('log(e) ≈ 1',     () => assertClose(S.log(S.e), 1));
  it('abs(-5) === 5',  () => assertEqual(S.abs(-5), 5));
  it('min(3,1,2) === 1', () => assertEqual(S.min(3, 1, 2), 1));
  it('max(3,1,2) === 3', () => assertEqual(S.max(3, 1, 2), 3));
  it('floor(2.9) === 2', () => assertEqual(S.floor(2.9), 2));
  it('ceil(2.1)  === 3', () => assertEqual(S.ceil(2.1),  3));
});

describe('ExpressionScope — clamp / lerp', () => {
  it('clamp(5, 0, 3) === 3',   () => assertEqual(S.clamp(5, 0, 3),   3));
  it('clamp(-1, 0, 3) === 0',  () => assertEqual(S.clamp(-1, 0, 3),  0));
  it('clamp(2, 0, 3) === 2',   () => assertEqual(S.clamp(2, 0, 3),   2));
  it('lerp(0, 10, 0.5) === 5', () => assertEqual(S.lerp(0, 10, 0.5), 5));
  it('lerp(0, 10, 0) === 0',   () => assertEqual(S.lerp(0, 10, 0),   0));
  it('lerp(0, 10, 1) === 10',  () => assertEqual(S.lerp(0, 10, 1),  10));
});

describe('ExpressionScope — conditional iff() (renamed from if to avoid reserved word)', () => {
  it('iff(true,  1, 2) → 1', () => assertEqual(S.iff(true,  1, 2), 1));
  it('iff(false, 1, 2) → 2', () => assertEqual(S.iff(false, 1, 2), 2));
  it('iff(1 > 0, "yes", "no") → "yes"', () => assertEqual(S.iff(1 > 0, 'yes', 'no'), 'yes'));
  it('if is no longer a scope key (reserved word conflict)', () => {
    assertEqual(S.if, undefined);
  });
});

describe('ExpressionScope — random functions', () => {
  it('rand() in [0, 1)',    () => { const r = S.rand(); assert(r >= 0 && r < 1, `rand()=${r}`); });
  it('uniform(2,5) in [2,5)', () => { const r = S.uniform(2, 5); assert(r >= 2 && r < 5); });
  it('randint(1,6) in {1..6}', () => {
    const r = S.randint(1, 6);
    assert(Number.isInteger(r) && r >= 1 && r <= 6, `randint=${r}`);
  });
  it('normal(0,1) is a finite number', () => {
    for (let i = 0; i < 20; i++) {
      const r = S.normal(0, 1);
      assert(isFinite(r), `normal()=${r}`);
    }
  });
  it('normal mean ≈ mu over many samples', () => {
    let sum = 0;
    const N = 10000;
    for (let i = 0; i < N; i++) sum += S.normal(5, 1);
    assertClose(sum / N, 5, 0.1, 'Normal mean deviated by > 0.1');
  });
});

describe('ExpressionScope — is frozen (immutable)', () => {
  it('cannot add new property', () => {
    try { S.hack = 1; } catch {}
    assert(S.hack === undefined, 'ExpressionScope should be frozen');
  });
  it('cannot overwrite existing property', () => {
    const original = S.sin;
    try { S.sin = () => 999; } catch {}
    assertEqual(S.sin, original, 'ExpressionScope.sin was mutated');
  });
});
