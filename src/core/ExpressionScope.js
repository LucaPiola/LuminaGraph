/**
 * ExpressionScope
 *
 * A frozen dictionary of helper symbols injected into every node expression.
 * Node names and the special tokens `t` / `dt` are added on top of this scope
 * at compile time, and can shadow any symbol here (node names take priority).
 *
 * Design: plain object, frozen at module load so no expression can mutate it.
 */

/** @returns {number} Gaussian sample via Box-Muller transform */
function _normalSample(mu = 0, sigma = 1) {
  let u, v;
  do { u = Math.random(); } while (u === 0); // exclude 0
  do { v = Math.random(); } while (v === 0);
  return mu + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const ExpressionScope = Object.freeze({
  // ── Trig ────────────────────────────────────────────────────────────────────
  sin:   Math.sin,
  cos:   Math.cos,
  tan:   Math.tan,
  asin:  Math.asin,
  acos:  Math.acos,
  atan:  Math.atan,
  atan2: Math.atan2,

  // ── Exponential / logarithm ──────────────────────────────────────────────────
  exp:   Math.exp,
  log:   Math.log,    // natural log
  log2:  Math.log2,
  log10: Math.log10,
  sqrt:  Math.sqrt,
  pow:   Math.pow,
  hypot: Math.hypot,

  // ── Rounding ─────────────────────────────────────────────────────────────────
  abs:   Math.abs,
  floor: Math.floor,
  ceil:  Math.ceil,
  round: Math.round,
  sign:  Math.sign,
  trunc: Math.trunc,

  // ── Min / max / clamp ────────────────────────────────────────────────────────
  min:   Math.min,
  max:   Math.max,
  /** clamp(v, lo, hi) – constrain v to [lo, hi] */
  clamp: (v, lo, hi) => Math.min(Math.max(v, lo), hi),
  /** lerp(a, b, t) – linear interpolation */
  lerp:  (a, b, t) => a + (b - a) * t,

  // ── Constants ────────────────────────────────────────────────────────────────
  pi:  Math.PI,
  e:   Math.E,
  Inf: Infinity,

  // ── Conditionals ─────────────────────────────────────────────────────────────
  /**
   * iff(cond, thenVal, elseVal) – conditional helper.
   * Named `iff` (not `if`) because `if` is a JS reserved word and cannot be
   * used as a function parameter name. Expressions that contain `if(` are
   * automatically rewritten to `iff(` at compile time for backward compat.
   */
  iff: (cond, thenVal, elseVal) => (cond ? thenVal : elseVal),

  // ── Random ───────────────────────────────────────────────────────────────────
  /** rand() → uniform [0, 1) */
  rand:    () => Math.random(),
  /** randint(a, b) → integer in [a, b] inclusive */
  randint: (a, b) => Math.floor(Math.random() * (b - a + 1)) + a,
  /** normal(mu, sigma) → Gaussian sample */
  normal:  _normalSample,
  /** uniform(a, b) → uniform sample in [a, b) */
  uniform: (a, b) => a + Math.random() * (b - a),

  // ── Step / pulse ─────────────────────────────────────────────────────────────
  /** step(t0) → 0 before t0, 1 from t0 onward (uses the expression's `t`) */
  // Note: this version is a higher-order helper; users write: step(t0)(t)
  // Simpler: Heaviside directly in expression: t >= t0 ? 1 : 0
});

// ── Dual-environment export ───────────────────────────────────────────────────
// Browser: ExpressionScope is a global.
// Node.js (tests): exported as a CommonJS module.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ExpressionScope };
}
