/**
 * STNode
 *
 * Represents a single node in an STGraph model.
 *
 * Node types:
 *   'state'     – Accumulates value across timesteps. Has an initial value.
 *                 Two expression modes:
 *                   derivMode=false (legacy) → expr gives x_{n+1} directly (Euler baked in)
 *                   derivMode=true           → expr gives dx/dt; integrator handles stepping
 *   'algebraic' – Recomputed every step from current state/input values. No memory.
 *   'input'     – Constant parameter. Can have an interactive slider (sliderMin/Max/Step).
 *   'output'    – Alias for algebraic; semantically marks a "result" the user cares about.
 *
 * Compilation:
 *   compile(nodeNames, scope) builds a JS function from the expression string.
 *   The function signature is: (scopeKey0, …, nodeN, …, t, dt) → value
 *   Scope keys are injected first so node names can shadow them if needed.
 */

class STNode {
  /**
   * @param {number}  id
   * @param {string}  name      – Identifier used in other nodes' expressions
   * @param {string}  type      – 'state' | 'algebraic' | 'input' | 'output'
   * @param {string}  expr      – Expression string
   * @param {number}  [initVal] – Initial / constant value
   * @param {string}  [unit]    – Display unit (e.g. 'kg', 'm/s')
   * @param {string}  [desc]    – Human-readable description
   * @param {boolean} [derivMode] – State nodes only: treat expr as dx/dt
   */
  constructor(id, name, type, expr, initVal = 0, unit = '', desc = '', derivMode = false) {
    this.id       = id;
    this.name     = name;
    this.type     = type;
    this.expr     = expr;
    this.initVal  = Number(initVal);
    this.unit     = unit;
    this.desc     = desc;
    this.derivMode = Boolean(derivMode); // only meaningful for type === 'state'

    // Runtime state — reset by STModel.reset()
    this.value = this.initVal;

    // Slider metadata for input nodes (optional)
    this.sliderMin  = undefined;
    this.sliderMax  = undefined;
    this.sliderStep = undefined;

    // Canvas layout — position and half-dimensions (rx=ry=24 → circle)
    this.x  = 0;
    this.y  = 0;
    this.rx = 24; // horizontal half-width
    this.ry = 24; // vertical half-height

    // Compiled function — set by compile()
    this._fn        = null;
    this._scopeKeys = [];
    this._scope     = null;
  }

  /**
   * Compile the expression string into an evaluable function.
   *
   * @param {string[]} nodeNames – Names of all nodes in the model (for argument list)
   * @param {object}   scope     – ExpressionScope (math helpers, rand, if …)
   * @returns {string|null} Error message, or null on success
   */
  compile(nodeNames, scope = {}) {
    if (this.type === 'input') {
      this._fn = null;
      return null;
    }

    // Rewrite `if(` → `iff(` so users can type either form.
    // `if` is a JS reserved word and cannot be a function parameter name,
    // but `iff` (the actual ExpressionScope key) is fine.
    const processedExpr = this.expr.replace(/\bif\s*\(/g, 'iff(');

    // Merge user-defined functions (from FunctionLibrary) into scope at compile time
    const userFns = (typeof FunctionLibrary !== 'undefined' && FunctionLibrary._userFns) || {};
    const mergedScope = Object.keys(userFns).length ? Object.assign({}, scope, userFns) : scope;

    const scopeKeys = Object.keys(mergedScope);
    const args = [...scopeKeys, ...nodeNames, 't', 'dt'];
    const body = `"use strict"; return (${processedExpr});`;

    try {
      this._fn        = new Function(...args, body);
      this._scopeKeys = scopeKeys;
      this._nodeNames = nodeNames; // compile-time order — must match arg positions
      this._scope     = mergedScope;
      return null;
    } catch (err) {
      this._fn = null;
      return err.message;
    }
  }

  /**
   * Evaluate the compiled function against a snapshot environment.
   *
   * @param {object} env – { [nodeName]: value, __t__: number, __dt__: number, __names__: string[] }
   * @returns {number}
   */
  evaluate(env) {
    if (!this._fn) return this.value;
    try {
      const scopeVals = this._scopeKeys.map(k => this._scope[k]);
      const nodeVals  = this._nodeNames.map(name => env[name]);
      return this._fn(...scopeVals, ...nodeVals, env.__t__, env.__dt__);
    } catch {
      return NaN;
    }
  }

  /** Serialize to a plain object for JSON persistence */
  toJSON() {
    return {
      id:        this.id,
      name:      this.name,
      type:      this.type,
      expr:      this.expr,
      initVal:   this.initVal,
      unit:      this.unit,
      desc:      this.desc,
      derivMode: this.derivMode,
      sliderMin:  this.sliderMin,
      sliderMax:  this.sliderMax,
      sliderStep: this.sliderStep,
      x: this.x,
      y: this.y,
      rx: this.rx,
      ry: this.ry,
    };
  }

  /** Restore from a plain object produced by toJSON() */
  static fromJSON(data) {
    const n = new STNode(
      data.id, data.name, data.type, data.expr,
      data.initVal, data.unit, data.desc, data.derivMode
    );
    n.sliderMin  = data.sliderMin;
    n.sliderMax  = data.sliderMax;
    n.sliderStep = data.sliderStep;
    n.x  = data.x  ?? 0;
    n.y  = data.y  ?? 0;
    n.rx = data.rx ?? 24;
    n.ry = data.ry ?? 24;
    return n;
  }
}

// ── Dual-environment export ───────────────────────────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STNode };
}
