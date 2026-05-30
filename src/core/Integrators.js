/**
 * Integrators
 *
 * Numerical ODE integration strategies, implemented as pure functions.
 * Each integrator takes the current state vector, a derivative function, the
 * current time, and the timestep; returns the next state vector.
 *
 * Interface:
 *   integrate(y: number[], dyFn: (y: number[], t: number) => number[], t: number, dt: number)
 *   → number[]   (new state vector, same length as y)
 *
 * The derivative function `dyFn(y, t)` must be a pure function: it receives a
 * candidate state vector and time, evaluates all algebraic nodes at those
 * values, and returns an array of dy/dt for each state node.
 *
 * Integrators are selected by name via the `Integrators` map.
 */

const Integrators = Object.freeze({

  /**
   * Forward Euler — O(dt) accuracy per step.
   * Fast but accumulates error; adequate for slowly-varying or non-stiff systems.
   *
   * y_{n+1} = y_n + dt * f(y_n, t_n)
   */
  euler(y, dyFn, t, dt) {
    const k = dyFn(y, t);
    return y.map((yi, i) => yi + dt * k[i]);
  },

  /**
   * Classic Runge-Kutta 4 — O(dt⁴) accuracy per step.
   * Four derivative evaluations per step; significantly more accurate than
   * Euler for the same dt. Preferred for smooth, non-stiff systems.
   *
   * k1 = f(y,          t)
   * k2 = f(y + dt/2·k1, t + dt/2)
   * k3 = f(y + dt/2·k2, t + dt/2)
   * k4 = f(y + dt·k3,   t + dt)
   * y_{n+1} = y_n + dt/6·(k1 + 2k2 + 2k3 + k4)
   */
  rk4(y, dyFn, t, dt) {
    const h = dt;
    const h2 = h / 2;

    const k1 = dyFn(y, t);
    const y2 = y.map((yi, i) => yi + h2 * k1[i]);

    const k2 = dyFn(y2, t + h2);
    const y3 = y.map((yi, i) => yi + h2 * k2[i]);

    const k3 = dyFn(y3, t + h2);
    const y4 = y.map((yi, i) => yi + h  * k3[i]);

    const k4 = dyFn(y4, t + h);

    return y.map((yi, i) =>
      yi + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])
    );
  },

});

/** Human-readable labels for the UI dropdown */
const IntegratorLabels = Object.freeze({
  euler: 'Euler (fast, O(dt))',
  rk4:   'Runge-Kutta 4 (accurate, O(dt⁴))',
});

// ── Dual-environment export ───────────────────────────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Integrators, IntegratorLabels };
}
