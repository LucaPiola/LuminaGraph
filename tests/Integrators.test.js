const { describe, it, assertClose, assertLess } = require('./runner');
const { Integrators } = require('../src/core/Integrators');

// ── Exact solution for comparison ─────────────────────────────────────────────
// dy/dt = y, y(0) = 1  →  y(t) = e^t
const expGrowth = (y, _t) => [y[0]];  // derivative: dy/dt = y
const exact = t => Math.exp(t);

/** Simulate from t=0 to t=tEnd with given method and dt. Returns y(tEnd). */
function simulate(method, dt, tEnd = 1) {
  let y = [1];
  let t = 0;
  const steps = Math.round(tEnd / dt);
  const integrator = Integrators[method];
  for (let i = 0; i < steps; i++) {
    y = integrator(y, expGrowth, t, dt);
    t += dt;
  }
  return y[0];
}

describe('Integrators — Euler correctness', () => {
  it('dy/dt=y: y(1) ≈ e with dt=0.001 (error < 0.002)', () => {
    const result = simulate('euler', 0.001);
    assertClose(result, exact(1), 0.002, `Euler y(1)=${result}`);
  });

  it('error decreases as dt halves (O(dt) convergence)', () => {
    const err1 = Math.abs(simulate('euler', 0.1)   - exact(1));
    const err2 = Math.abs(simulate('euler', 0.05)  - exact(1));
    assertLess(err2, err1, `Halving dt should reduce error: ${err1} → ${err2}`);
  });

  it('constant function: y(t) = 1 stays exactly 1 forever', () => {
    const result = Integrators.euler([1], () => [0], 0, 0.5);
    assertClose(result[0], 1);
  });

  it('multi-dim system: [dx, dy] = [y, -x] (circular motion)', () => {
    // Exact: x(t)=cos(t), y(t)=sin(t) from x(0)=1, y(0)=0
    let state = [1, 0];
    const deriv = ([x, y]) => [y, -x];
    const dt = 0.001, T = Math.PI * 2;
    const steps = Math.round(T / dt);
    for (let i = 0; i < steps; i++) {
      state = Integrators.euler(state, deriv, i * dt, dt);
    }
    // After 2π the system should be back near (1, 0) — Euler drifts but small dt helps
    assertClose(state[0], 1, 0.05, `x after 2π = ${state[0]}`);
    assertClose(state[1], 0, 0.05, `y after 2π = ${state[1]}`);
  });
});

describe('Integrators — RK4 correctness', () => {
  it('dy/dt=y: y(1) ≈ e with dt=0.1 (error < 5e-6)', () => {
    // RK4 global error is O(dt⁴); with dt=0.1 expect ~2e-6
    const result = simulate('rk4', 0.1);
    assertClose(result, exact(1), 5e-6, `RK4 y(1)=${result}`);
  });

  it('dy/dt=y: y(1) ≈ e with dt=0.5 (error < 2e-3)', () => {
    // Large dt=0.5 → larger error, but still far better than Euler
    const result = simulate('rk4', 0.5);
    assertClose(result, exact(1), 2e-3, `RK4 y(1)=${result} (dt=0.5)`);
  });

  it('constant function: y(t) = 1 stays exactly 1', () => {
    const result = Integrators.rk4([1], () => [0], 0, 0.5);
    assertClose(result[0], 1);
  });

  it('y_{n+1} vector length equals y_n length', () => {
    const y0 = [1, 2, 3];
    const y1 = Integrators.rk4(y0, y => y.map(v => -v), 0, 0.1);
    if (y1.length !== 3) throw new Error(`Expected length 3, got ${y1.length}`);
  });
});

describe('Integrators — RK4 is more accurate than Euler (same dt)', () => {
  it('dt=0.1: RK4 error < Euler error for dy/dt=y', () => {
    const dt = 0.1;
    const eulerErr = Math.abs(simulate('euler', dt) - exact(1));
    const rk4Err   = Math.abs(simulate('rk4',   dt) - exact(1));
    assertLess(rk4Err, eulerErr,
      `RK4 err (${rk4Err.toExponential(3)}) should < Euler err (${eulerErr.toExponential(3)})`);
  });

  it('dt=0.2: RK4 error < Euler error for dy/dt=y', () => {
    const dt = 0.2;
    const eulerErr = Math.abs(simulate('euler', dt) - exact(1));
    const rk4Err   = Math.abs(simulate('rk4',   dt) - exact(1));
    assertLess(rk4Err, eulerErr,
      `RK4 err (${rk4Err.toExponential(3)}) should < Euler err (${eulerErr.toExponential(3)})`);
  });

  it('RK4 error rate is O(dt⁴): halving dt reduces error by ~16×', () => {
    const e1 = Math.abs(simulate('rk4', 0.2) - exact(1));
    const e2 = Math.abs(simulate('rk4', 0.1) - exact(1));
    const ratio = e1 / e2;
    // Expect ratio ≈ 16; allow generous tolerance (8–40) for floating-point variance
    assertLess(8, ratio,  `Expected ratio > 8,  got ${ratio.toFixed(2)}`);
    assertLess(ratio, 40, `Expected ratio < 40, got ${ratio.toFixed(2)}`);
  });
});
