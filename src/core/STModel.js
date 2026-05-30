/**
 * STModel
 *
 * Container for a node graph and simulation engine.
 *
 * Responsibilities:
 *   - CRUD for nodes and edges
 *   - Expression compilation (delegates to STNode)
 *   - Topological sort (delegates to topoSort)
 *   - Single-step and full-run simulation
 *   - JSON serialization / deserialization
 *
 * Integration strategy:
 *   State nodes with derivMode=true → the chosen integrator (Euler/RK4) is applied.
 *   State nodes with derivMode=false (legacy) → expression gives x_{n+1} directly;
 *     always treated as Euler regardless of the selected integrator.
 *
 * Dependencies (injected as globals in the browser, required in Node tests):
 *   STNode, topoSort, Integrators, ExpressionScope
 */

class STModel {
  /**
   * @param {object} [scope] – ExpressionScope; defaults to the global ExpressionScope
   */
  constructor(scope) {
    /** @type {Map<number, STNode>} */
    this.nodes  = new Map();
    /** @type {Array<{from: number, to: number}>} */
    this.edges  = [];
    this._nextId = 1;

    // Integrator key: 'euler' | 'rk4'
    this.integrationMethod = 'euler';

    // Model metadata (Task 8)
    this.metadata = { title: '', description: '', author: '', version: '', tags: '' };

    // Gauge overlays (Task 9)
    this.gauges = [];

    // Resolved at runtime
    this._scope = scope ?? (typeof ExpressionScope !== 'undefined' ? ExpressionScope : {});
    this._order = []; // cached topo order (node ids)
    this._t     = 0;
  }

  // ── Node / edge CRUD ────────────────────────────────────────────────────────

  /**
   * @param {string}  name
   * @param {string}  type
   * @param {string}  expr
   * @param {number}  [initVal]
   * @param {string}  [unit]
   * @param {string}  [desc]
   * @param {boolean} [derivMode]
   * @returns {STNode}
   */
  addNode(name, type, expr, initVal = 0, unit = '', desc = '', derivMode = false) {
    const id   = this._nextId++;
    const node = new STNode(id, name, type, expr, initVal, unit, desc, derivMode);
    this.nodes.set(id, node);
    return node;
  }

  /** @param {number} id */
  removeNode(id) {
    this.nodes.delete(id);
    this.edges = this.edges.filter(e => e.from !== id && e.to !== id);
  }

  /**
   * @param {number} fromId
   * @param {number} toId
   * @returns {boolean} true if edge was added
   */
  addEdge(fromId, toId) {
    if (fromId === toId) return false;
    if (this.edges.some(e => e.from === fromId && e.to === toId)) return false;
    this.edges.push({ from: fromId, to: toId });
    return true;
  }

  removeEdge(fromId, toId) {
    this.edges = this.edges.filter(e => !(e.from === fromId && e.to === toId));
  }

  // ── Compilation ─────────────────────────────────────────────────────────────

  /**
   * Compile all node expressions. Must be called before reset/step/run.
   * @returns {string[]} Array of error messages (empty = success)
   */
  compile() {
    const nodeNames = [...this.nodes.values()].map(n => n.name);
    const errors = [];
    for (const n of this.nodes.values()) {
      const err = n.compile(nodeNames, this._scope);
      if (err) errors.push(`${n.name}: ${err}`);
    }
    return errors;
  }

  // ── Simulation ──────────────────────────────────────────────────────────────

  /** Reset all state to initVal and rebuild topo order. */
  reset(t0 = 0) {
    for (const n of this.nodes.values()) n.value = n.initVal;
    this._t     = t0;
    this._order = topoSort([...this.nodes.values()], this.edges);
  }

  /**
   * Build the environment snapshot used by node expressions.
   * @param {number} t
   * @param {number} dt
   * @param {Map<number,number>} [overrides] – id→value, used by RK4 sub-steps
   */
  _buildEnv(t, dt, overrides) {
    const env = { __t__: t, __dt__: dt, __names__: [] };
    const names = [];
    for (const id of this._order) {
      const n = this.nodes.get(id);
      if (!n) continue;
      const val = overrides ? (overrides.has(id) ? overrides.get(id) : n.value) : n.value;
      env[n.name] = val;
      names.push(n.name);
    }
    env.__names__ = names;
    return env;
  }

  /**
   * Advance simulation by one timestep using the selected integration method.
   * @param {number} dt
   */
  step(dt) {
    const t = this._t;

    // Separate state nodes into deriv-mode and legacy-mode
    const derivStateIds  = this._order.filter(id => {
      const n = this.nodes.get(id);
      return n && n.type === 'state' && n.derivMode;
    });
    const legacyStateIds = this._order.filter(id => {
      const n = this.nodes.get(id);
      return n && n.type === 'state' && !n.derivMode;
    });

    const newVals = new Map();

    if (derivStateIds.length > 0) {
      // ── Integrator path for derivMode state nodes ──────────────────────────
      const y0 = derivStateIds.map(id => this.nodes.get(id).value);

      /**
       * Derivative function: given a candidate state vector, evaluate all
       * algebraic nodes with those state values and return derivatives.
       * @param {number[]} y  – candidate state values (aligned with derivStateIds)
       * @param {number}   ti – candidate time
       * @returns {number[]}
       */
      const dyFn = (y, ti) => {
        // Build value overrides for the candidate state
        const overrides = new Map();
        derivStateIds.forEach((id, i) => overrides.set(id, y[i]));

        const env = this._buildEnv(ti, dt, overrides);

        // Re-evaluate algebraic/output nodes with overridden state
        for (const id of this._order) {
          const n = this.nodes.get(id);
          if (!n) continue;
          if (n.type === 'algebraic' || n.type === 'output') {
            const val = n.evaluate(env);
            env[n.name] = val;
          }
        }

        return derivStateIds.map(id => this.nodes.get(id).evaluate(env));
      };

      const integrator = Integrators[this.integrationMethod] ?? Integrators.euler;
      const y1 = integrator(y0, dyFn, t, dt);
      derivStateIds.forEach((id, i) => newVals.set(id, y1[i]));
    }

    // ── Legacy Euler path for non-derivMode state nodes ─────────────────────
    const env = this._buildEnv(t, dt);
    for (const id of this._order) {
      const n = this.nodes.get(id);
      if (!n) continue;
      if (n.type === 'input') {
        newVals.set(id, n.initVal);
      } else if (n.type === 'state' && !n.derivMode) {
        newVals.set(id, n.evaluate(env));
      } else if (n.type === 'algebraic' || n.type === 'output') {
        const val = n.evaluate(env);
        newVals.set(id, val);
        env[n.name] = val; // update env for downstream nodes
      }
      // derivMode states already handled above
    }

    // Commit
    for (const [id, val] of newVals) {
      this.nodes.get(id).value = val;
    }
    this._t += dt;
  }

  /**
   * Step-by-step mode: advance one timestep and call cb(node, value) for each
   * node as it is evaluated. Returns a Promise that resolves when done.
   * @param {number}   dt
   * @param {Function} cb  – (node: STNode, value: number) => void
   */
  async stepWithCallback(dt, cb) {
    const t = this._t;

    const derivStateIds = this._order.filter(id => {
      const n = this.nodes.get(id);
      return n && n.type === 'state' && n.derivMode;
    });
    const newVals = new Map();

    // For the callback version we just use Euler for simplicity (matches legacy path for display)
    const env = this._buildEnv(t, dt);
    for (const id of this._order) {
      const n = this.nodes.get(id);
      if (!n) continue;
      let val;
      if (n.type === 'input') {
        val = n.initVal;
      } else if (n.type === 'state' && !n.derivMode) {
        val = n.evaluate(env);
      } else if (n.type === 'algebraic' || n.type === 'output') {
        val = n.evaluate(env);
        env[n.name] = val;
      } else {
        // derivMode state — use regular evaluate for display
        val = n.evaluate(env);
      }
      newVals.set(id, val !== undefined ? val : n.value);
      if (cb) cb(n, newVals.get(id));
      // Allow microtask/frame yield
      await new Promise(r => setTimeout(r, 0));
    }

    // Actually advance using the real step
    this.step(dt);
  }

  /**
   * Run the full simulation from t0 to t1 in steps of dt.
   * Compiles expressions first; returns errors without running if any fail.
   *
   * @param {number} t0
   * @param {number} t1
   * @param {number} dt
   * @returns {{ times: number[], series: Object.<string,number[]>, errors: string[] }}
   */
  run(t0, t1, dt) {
    const errors = this.compile();
    if (errors.length) return { times: [], series: {}, errors };

    this.reset(t0);
    const times  = [];
    const series = {};
    for (const n of this.nodes.values()) series[n.name] = [];

    const steps = Math.round((t1 - t0) / dt);
    for (let i = 0; i <= steps; i++) {
      times.push(this._t);
      for (const n of this.nodes.values()) series[n.name].push(n.value);
      if (i < steps) this.step(dt);
    }
    return { times, series, errors: [] };
  }

  // ── Serialisation ────────────────────────────────────────────────────────────

  toJSON() {
    return {
      nodes:             [...this.nodes.values()].map(n => n.toJSON()),
      edges:             this.edges,
      _nextId:           this._nextId,
      integrationMethod: this.integrationMethod,
      metadata:          this.metadata,
      gauges:            this.gauges,
    };
  }

  fromJSON(data) {
    this.nodes.clear();
    this.edges             = [];
    this._nextId           = data._nextId ?? 1;
    this.integrationMethod = data.integrationMethod ?? 'euler';
    this.metadata          = data.metadata ?? { title: '', description: '', author: '', version: '', tags: '' };
    this.gauges            = data.gauges ?? [];

    for (const d of data.nodes) {
      this.nodes.set(d.id, STNode.fromJSON(d));
    }
    this.edges = data.edges ?? [];
  }
}

// ── Dual-environment export ───────────────────────────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
  // Pull in peer dependencies when running under Node
  const { STNode }         = require('./STNode');
  const { topoSort }       = require('./Topology');
  const { Integrators }    = require('./Integrators');
  const { ExpressionScope } = require('./ExpressionScope');
  module.exports = { STModel, STNode, topoSort, Integrators, ExpressionScope };
}
