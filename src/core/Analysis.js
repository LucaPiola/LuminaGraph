/**
 * Analysis.js — Equilibrium finder, stability analysis, bifurcation, Monte Carlo
 * Browser-only, loaded as a global. No ES modules.
 */
(function () {

  // ── Matrix helpers ────────────────────────────────────────────────────────────

  function matCopy(A, n) {
    return A.map(row => row.slice());
  }

  function matMul(A, B, n) {
    const C = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++)
      for (let k = 0; k < n; k++) {
        if (A[i][k] === 0) continue;
        for (let j = 0; j < n; j++)
          C[i][j] += A[i][k] * B[k][j];
      }
    return C;
  }

  /** Gram-Schmidt QR decomposition */
  function qrGramSchmidt(A, n) {
    const Q = Array.from({ length: n }, () => new Array(n).fill(0));
    const R = Array.from({ length: n }, () => new Array(n).fill(0));

    for (let j = 0; j < n; j++) {
      // Column j of A
      let v = A.map(row => row[j]);

      for (let i = 0; i < j; i++) {
        const dot = Q.reduce((s, row, k) => s + row[i] * v[k], 0);
        R[i][j] = dot;
        for (let k = 0; k < n; k++) v[k] -= dot * Q[k][i];
      }

      const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
      R[j][j] = norm;
      if (norm > 1e-14) {
        for (let k = 0; k < n; k++) Q[k][j] = v[k] / norm;
      } else {
        Q[j][j] = 1; // degenerate column
      }
    }
    return { Q, R };
  }

  /**
   * QR eigenvalue algorithm with Wilkinson shift.
   * Returns approximate real parts of eigenvalues (diagonal of the Schur form).
   * @param {number[][]} Ain  n×n matrix
   * @param {number}     n
   * @param {number}     iters
   * @returns {number[]}
   */
  function eigenvalues(Ain, n, iters = 200) {
    let M = matCopy(Ain, n);
    for (let k = 0; k < iters; k++) {
      const mu = M[n - 1][n - 1];
      for (let i = 0; i < n; i++) M[i][i] -= mu;
      const { Q, R } = qrGramSchmidt(M, n);
      M = matMul(R, Q, n);
      for (let i = 0; i < n; i++) M[i][i] += mu;
    }
    return M.map((row, i) => row[i]);
  }

  // ── Save / restore model state ────────────────────────────────────────────────

  function saveState(model) {
    const state = {};
    for (const [id, n] of model.nodes) {
      state[id] = { value: n.value, initVal: n.initVal };
    }
    return state;
  }

  function restoreState(model, state) {
    for (const [id, n] of model.nodes) {
      if (state[id] !== undefined) {
        n.value   = state[id].value;
        n.initVal = state[id].initVal;
      }
    }
    model._t = 0;
  }

  // ── Equilibrium finder ────────────────────────────────────────────────────────

  /**
   * Run model until max |Δx| < tol across all state nodes.
   * @returns {{ rows: Array<{name, value, converged}>, converged: boolean }}
   */
  function findEquilibrium(model, dt, maxSteps = 10000, tol = 1e-8) {
    const errors = model.compile();
    if (errors.length) return { rows: [], errors };

    const savedState = saveState(model);
    const t0 = model._t;

    model.reset(0);

    const stateNodes = [...model.nodes.values()].filter(
      n => n.type === 'state'
    );

    let converged = false;
    for (let step = 0; step < maxSteps; step++) {
      const prev = stateNodes.map(n => n.value);
      model.step(dt);
      const next = stateNodes.map(n => n.value);
      const maxDelta = prev.reduce((m, v, i) => Math.max(m, Math.abs(next[i] - v)), 0);
      if (maxDelta < tol) { converged = true; break; }
    }

    const rows = stateNodes.map(n => ({
      name: n.name,
      value: n.value,
      converged,
    }));

    // Save the equilibrium values before restoring
    const eqValues = {};
    for (const n of stateNodes) eqValues[n.id] = n.value;

    restoreState(model, savedState);

    return { rows, converged, eqValues, errors: [] };
  }

  // ── Stability analysis (numerical Jacobian + eigenvalues) ─────────────────────

  /**
   * @param {STModel} model
   * @param {Object}  eqValues  – id → equilibrium value from findEquilibrium
   * @param {number}  dt
   * @returns {{ eigenvalues: number[], stable: boolean, jacobian: number[][] }}
   */
  function stabilityAnalysis(model, eqValues, dt) {
    const errors = model.compile();
    if (errors.length) return { eigenvalues: [], stable: false, errors };

    const stateNodes = [...model.nodes.values()].filter(
      n => n.type === 'state' && n.derivMode
    );
    const n = stateNodes.length;
    if (n === 0) return { eigenvalues: [], stable: null, errors: [], message: 'No derivMode state nodes' };

    const savedState = saveState(model);

    // Set model to equilibrium
    model.reset(0);
    for (const node of stateNodes) {
      if (eqValues[node.id] !== undefined) node.value = eqValues[node.id];
    }

    const h = 1e-5;
    const jacobian = Array.from({ length: n }, () => new Array(n).fill(0));

    // x_eq values
    const xEq = stateNodes.map(nd => nd.value);

    for (let j = 0; j < n; j++) {
      // Perturb node j
      for (let i = 0; i < n; i++) stateNodes[i].value = xEq[i];
      stateNodes[j].value = xEq[j] + h;

      const before = stateNodes.map(nd => nd.value);
      model.step(dt);
      const after = stateNodes.map(nd => nd.value);

      for (let i = 0; i < n; i++) {
        // Jacobian_continuous[i][j] ≈ (x_new[i] - x_eq[i]) / (dt * h)
        jacobian[i][j] = (after[i] - xEq[i]) / (dt * h);
      }
    }

    const eigs = eigenvalues(jacobian, n);
    const stable = eigs.every(lambda => lambda < 0);

    restoreState(model, savedState);

    return { eigenvalues: eigs, stable, jacobian, errors: [] };
  }

  // ── Bifurcation diagram ───────────────────────────────────────────────────────

  /**
   * @param {STModel} model
   * @param {number}  inputNodeId – the input node to sweep
   * @param {number}  pMin
   * @param {number}  pMax
   * @param {number}  steps
   * @param {number}  t0
   * @param {number}  t1
   * @param {number}  dt
   * @returns {{ paramVals: number[], dots: Object.<nodeName, {p,v}[]> }}
   */
  function bifurcationDiagram(model, inputNodeId, pMin, pMax, steps, t0, t1, dt) {
    const errors = model.compile();
    if (errors.length) return { paramVals: [], dots: {}, errors };

    const inputNode = model.nodes.get(inputNodeId);
    if (!inputNode) return { paramVals: [], dots: {}, errors: ['Input node not found'] };

    const savedState = saveState(model);
    const savedInitVal = inputNode.initVal;

    const stateNodes = [...model.nodes.values()].filter(n => n.type === 'state');
    const dots = {};
    for (const n of stateNodes) dots[n.name] = [];

    const paramVals = [];
    for (let s = 0; s <= steps; s++) {
      const p = pMin + (pMax - pMin) * (s / steps);
      paramVals.push(p);

      inputNode.initVal = p;
      inputNode.value   = p;

      model.reset(t0);
      // Also restore input node to p after reset
      inputNode.value = p;

      const totalSteps = Math.round((t1 - t0) / dt);
      for (let i = 0; i < totalSteps; i++) model.step(dt);

      // Collect last 20% of time points — approximate by running from 80% mark
      const captureSteps = Math.max(1, Math.round(totalSteps * 0.2));
      // We already ran to t1; need to back-track — instead, re-run and capture last 20%
      model.reset(t0);
      inputNode.value = p;
      const startCapture = totalSteps - captureSteps;
      for (let i = 0; i < totalSteps; i++) {
        model.step(dt);
        if (i >= startCapture) {
          for (const n of stateNodes) {
            dots[n.name].push({ p, v: n.value });
          }
        }
      }
    }

    // Restore
    inputNode.initVal = savedInitVal;
    restoreState(model, savedState);

    return { paramVals, dots, errors: [] };
  }

  // ── Monte Carlo simulation ────────────────────────────────────────────────────

  function _gauss() {
    return Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
  }

  /**
   * @param {STModel} model
   * @param {number}  nRuns
   * @param {number}  noisePct  – percent noise (e.g. 5 = ±5%)
   * @param {number}  t0
   * @param {number}  t1
   * @param {number}  dt
   * @returns {{ times, bandsMap }} where bandsMap[nodeName] = { mean, lo, hi }
   */
  function monteCarlo(model, nRuns, noisePct, t0, t1, dt) {
    const errors = model.compile();
    if (errors.length) return { times: [], bandsMap: {}, errors };

    const savedState = saveState(model);

    const inputNodes = [...model.nodes.values()].filter(n => n.type === 'input');
    const stateNodes = [...model.nodes.values()].filter(n => n.type !== 'input');

    const noiseFrac = noisePct / 100;
    const totalSteps = Math.round((t1 - t0) / dt) + 1;

    // all runs × nodes × time steps
    const allSeries = {};
    for (const n of stateNodes) allSeries[n.name] = [];

    let timesArr = null;

    for (let run = 0; run < nRuns; run++) {
      // Perturb input nodes
      for (const n of inputNodes) {
        n.value   = n.initVal * (1 + noiseFrac * _gauss());
        n.initVal = n.value;
      }

      model.reset(t0);
      // Re-apply perturbed inputs (reset overrides initVal)
      for (const n of inputNodes) n.value = n.initVal;

      const runSeries = {};
      for (const n of stateNodes) runSeries[n.name] = [n.value];

      const runTimes = [t0];
      const steps = Math.round((t1 - t0) / dt);
      for (let i = 0; i < steps; i++) {
        model.step(dt);
        runTimes.push(model._t);
        for (const n of stateNodes) runSeries[n.name].push(n.value);
      }

      if (!timesArr) timesArr = runTimes;
      for (const n of stateNodes) allSeries[n.name].push(runSeries[n.name]);
    }

    // Compute mean / 5th / 95th percentile at each time step
    const bandsMap = {};
    for (const n of stateNodes) {
      const runs = allSeries[n.name]; // nRuns × totalSteps
      const mean = [], lo = [], hi = [];
      for (let t = 0; t < totalSteps; t++) {
        const vals = runs.map(r => r[t] ?? NaN).filter(isFinite).sort((a, b) => a - b);
        if (vals.length === 0) { mean.push(NaN); lo.push(NaN); hi.push(NaN); continue; }
        const m = vals.reduce((s, v) => s + v, 0) / vals.length;
        mean.push(m);
        const p5  = vals[Math.floor(0.05 * (vals.length - 1))];
        const p95 = vals[Math.ceil(0.95  * (vals.length - 1))];
        lo.push(p5);
        hi.push(p95);
      }
      bandsMap[n.name] = { mean, lo, hi };
    }

    restoreState(model, savedState);

    return { times: timesArr || [], bandsMap, errors: [] };
  }

  // ── Sensitivity analysis ──────────────────────────────────────────────────────
  /**
   * For each input node, perturb its value by ±δ% and measure the total
   * change in all non-input variables' final values. Returns a ranked list.
   *
   * @param {STModel} model
   * @param {object}  params  – { t0, t1, dt } from getParams()
   * @param {number}  [pct=10] – perturbation percentage
   * @returns {{ rankings: Array<{name,score,unit,desc}>, errors: string[] }}
   */
  function sensitivityAnalysis(model, params, pct = 10) {
    const { t0, t1, dt } = params;
    const errors = [];

    // Baseline run
    const errs = model.compile();
    if (errs.length) return { rankings: [], errors: errs.map(e => e.message || e) };

    const baseline = model.run(t0, t1, dt);
    if (baseline.errors.length) return { rankings: [], errors: baseline.errors };

    const inputNodes = [...model.nodes.values()].filter(n => n.type === 'input');
    if (!inputNodes.length) return { rankings: [], errors: ['No input nodes found.'] };

    // Output nodes to measure (state + algebraic + output)
    const outputNodes = [...model.nodes.values()].filter(n =>
      n.type !== 'input' && n.type !== 'text'
    );

    const savedState = {};
    for (const n of model.nodes.values()) savedState[n.id] = { initVal: n.initVal, value: n.value };

    const rankings = [];

    for (const inp of inputNodes) {
      const base = inp.initVal;
      const delta = Math.abs(base) > 1e-10 ? base * pct / 100 : pct / 100;
      if (Math.abs(delta) < 1e-14) continue;

      let score = 0;

      for (const sign of [1, -1]) {
        inp.initVal = base + sign * delta;
        model.compile();
        const result = model.run(t0, t1, dt);
        if (!result.errors.length) {
          for (const out of outputNodes) {
            const bVals = baseline.series[out.name];
            const pVals = result.series[out.name];
            if (!bVals || !pVals) continue;
            const N = Math.min(bVals.length, pVals.length);
            for (let i = 0; i < N; i++) {
              const diff = (pVals[i] - bVals[i]) / (Math.abs(bVals[i]) + 1e-10);
              score += diff * diff;
            }
          }
        }
        // Restore
        inp.initVal = base;
        for (const [id, s] of Object.entries(savedState)) {
          const n = model.nodes.get(Number(id));
          if (n) { n.initVal = s.initVal; n.value = s.initVal; }
        }
      }

      rankings.push({ name: inp.name, desc: inp.desc || '', unit: inp.unit || '', score });
    }

    // Restore model fully and recompile
    for (const [id, s] of Object.entries(savedState)) {
      const n = model.nodes.get(Number(id));
      if (n) { n.initVal = s.initVal; n.value = s.initVal; }
    }
    model.compile();

    rankings.sort((a, b) => b.score - a.score);
    return { rankings, errors };
  }

  // ── Exports ───────────────────────────────────────────────────────────────────

  window.Analysis = {
    findEquilibrium,
    stabilityAnalysis,
    bifurcationDiagram,
    monteCarlo,
    sensitivityAnalysis,
    eigenvalues,
  };

})();
