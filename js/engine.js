// STGraph simulation engine
// Node types: state, algebraic, input, output

class STNode {
  constructor(id, name, type, expr, initVal = 0, unit = '', desc = '') {
    this.id = id;
    this.name = name;
    this.type = type;       // 'state' | 'algebraic' | 'input' | 'output'
    this.expr = expr;
    this.initVal = Number(initVal);
    this.unit = unit;
    this.desc = desc;
    this.value = this.initVal;
    this._fn = null;
  }

  compile(nodeNames) {
    // Build a function from expression string
    // Nodes referenced by name, plus: t, dt, pi, e, and all Math functions
    const args = [...nodeNames, 't', 'dt'];
    const body = `"use strict"; return (${this.expr});`;
    try {
      this._fn = new Function(...args, body);
      return null; // no error
    } catch (e) {
      return e.message;
    }
  }

  evaluate(env) {
    if (!this._fn) return this.value;
    try {
      const args = env.__order__.map(n => env[n]);
      args.push(env.__t__, env.__dt__);
      return this._fn(...args);
    } catch (e) {
      return NaN;
    }
  }
}

class STModel {
  constructor() {
    this.nodes = new Map();   // id -> STNode
    this.edges = [];          // {from: id, to: id}
    this._nextId = 1;
  }

  addNode(name, type, expr, initVal, unit, desc) {
    const id = this._nextId++;
    const node = new STNode(id, name, type, expr, initVal, unit, desc);
    this.nodes.set(id, node);
    return node;
  }

  removeNode(id) {
    this.nodes.delete(id);
    this.edges = this.edges.filter(e => e.from !== id && e.to !== id);
  }

  addEdge(fromId, toId) {
    if (fromId === toId) return false;
    if (this.edges.some(e => e.from === fromId && e.to === toId)) return false;
    this.edges.push({ from: fromId, to: toId });
    return true;
  }

  removeEdge(fromId, toId) {
    this.edges = this.edges.filter(e => !(e.from === fromId && e.to === toId));
  }

  // Topological sort of non-state nodes (state nodes provide their prev value)
  _topoOrder() {
    const nodeArr = [...this.nodes.values()];
    const ids = nodeArr.map(n => n.id);
    // Build adjacency for algebraic/output nodes only
    const deps = new Map(); // id -> Set of dependency ids
    for (const n of nodeArr) {
      deps.set(n.id, new Set());
    }
    for (const e of this.edges) {
      const src = this.nodes.get(e.from);
      const dst = this.nodes.get(e.to);
      if (!src || !dst) continue;
      // dst depends on src (algebraic/output depends on src value)
      if (dst.type === 'algebraic' || dst.type === 'output') {
        if (src.type !== 'state') deps.get(dst.id).add(src.id);
      }
    }
    // Kahn's algorithm
    const inDeg = new Map(ids.map(id => [id, 0]));
    for (const [id, d] of deps) {
      for (const dep of d) {
        inDeg.set(id, (inDeg.get(id) || 0) + 1);
      }
    }
    const queue = ids.filter(id => {
      const n = this.nodes.get(id);
      return (n.type === 'algebraic' || n.type === 'output') && inDeg.get(id) === 0;
    });
    const order = [];
    const stateAndInput = ids.filter(id => {
      const n = this.nodes.get(id);
      return n.type === 'state' || n.type === 'input';
    });
    // States and inputs evaluate first (trivial)
    order.push(...stateAndInput);

    const visited = new Set(stateAndInput);
    const q = [...queue];
    while (q.length) {
      const cur = q.shift();
      if (visited.has(cur)) continue;
      visited.add(cur);
      order.push(cur);
      // find nodes that depend on cur
      for (const [id, d] of deps) {
        if (d.has(cur) && !visited.has(id)) {
          d.delete(cur);
          if (d.size === 0) q.push(id);
        }
      }
    }
    // any remaining (cycles) just append
    for (const id of ids) {
      if (!visited.has(id)) order.push(id);
    }
    return order;
  }

  compile() {
    const nodeNames = [...this.nodes.values()].map(n => n.name);
    const errors = [];
    for (const n of this.nodes.values()) {
      if (n.type === 'input') { n._fn = null; continue; }
      const err = n.compile(nodeNames);
      if (err) errors.push(`${n.name}: ${err}`);
    }
    return errors;
  }

  reset(t0) {
    for (const n of this.nodes.values()) {
      n.value = n.initVal;
    }
    this._t = t0;
    this._order = this._topoOrder();
  }

  _buildEnv(t, dt) {
    const env = { __t__: t, __dt__: dt, __order__: [] };
    const nameArr = [];
    for (const id of this._order) {
      const n = this.nodes.get(id);
      if (n) { env[n.name] = n.value; nameArr.push(n.name); }
    }
    env.__order__ = nameArr;
    return env;
  }

  step(dt) {
    const t = this._t;
    const env = this._buildEnv(t, dt);

    // Evaluate all nodes in order
    const newVals = new Map();
    for (const id of this._order) {
      const n = this.nodes.get(id);
      if (!n) continue;
      if (n.type === 'input') {
        newVals.set(id, n.initVal);
      } else {
        newVals.set(id, n.evaluate(env));
        // update env so downstream algebraic nodes see updated value
        env[n.name] = newVals.get(id);
      }
    }

    // Commit new values
    for (const [id, val] of newVals) {
      this.nodes.get(id).value = val;
    }
    this._t += dt;
    return t;
  }

  // Run full simulation from t0 to t1 with step dt
  // Returns { times: [], series: {nodeName: []} }
  run(t0, t1, dt) {
    const errors = this.compile();
    if (errors.length) return { errors };

    this.reset(t0);
    const times = [];
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

  toJSON() {
    return {
      nodes: [...this.nodes.values()].map(n => ({
        id: n.id, name: n.name, type: n.type,
        expr: n.expr, initVal: n.initVal, unit: n.unit, desc: n.desc,
        x: n.x, y: n.y
      })),
      edges: this.edges,
      _nextId: this._nextId
    };
  }

  fromJSON(data) {
    this.nodes.clear();
    this.edges = [];
    this._nextId = data._nextId || 1;
    for (const d of data.nodes) {
      const n = new STNode(d.id, d.name, d.type, d.expr, d.initVal, d.unit, d.desc);
      n.x = d.x; n.y = d.y;
      this.nodes.set(n.id, n);
    }
    this.edges = data.edges || [];
  }
}

// ---- Example models ----
const EXAMPLES = {
  exponential: {
    nodes: [
      { id:1, name:'x', type:'state',     expr:'x + x*r*dt',        initVal:1,    unit:'', desc:'Population', x:300, y:200 },
      { id:2, name:'r', type:'input',     expr:'0.3',               initVal:0.3,  unit:'1/t', desc:'Growth rate', x:150, y:200 },
      { id:3, name:'growth', type:'output', expr:'x*r',             initVal:0,    unit:'', desc:'Instantaneous growth', x:460, y:200 },
    ],
    edges: [{from:2,to:1},{from:1,to:3},{from:2,to:3}],
    _nextId: 4
  },
  logistic: {
    nodes: [
      { id:1, name:'x',  type:'state',   expr:'x + x*r*(1-x/K)*dt', initVal:10,  unit:'', desc:'Population', x:300, y:200 },
      { id:2, name:'r',  type:'input',   expr:'',                   initVal:0.5, unit:'1/t', desc:'Growth rate', x:150, y:150 },
      { id:3, name:'K',  type:'input',   expr:'',                   initVal:500, unit:'', desc:'Carrying capacity', x:150, y:250 },
      { id:4, name:'net',type:'output',  expr:'x*r*(1-x/K)',        initVal:0,   unit:'', desc:'Net growth', x:460, y:200 },
    ],
    edges: [{from:2,to:1},{from:3,to:1},{from:1,to:4},{from:2,to:4},{from:3,to:4}],
    _nextId: 5
  },
  predprey: {
    nodes: [
      { id:1, name:'prey',     type:'state',  expr:'prey + (a*prey - b*prey*pred)*dt',       initVal:40,  unit:'', desc:'Prey population', x:200, y:180 },
      { id:2, name:'pred',     type:'state',  expr:'pred + (c*prey*pred - d*pred)*dt',        initVal:9,   unit:'', desc:'Predator population', x:420, y:180 },
      { id:3, name:'a',        type:'input',  expr:'', initVal:0.1,  unit:'', desc:'Prey growth rate', x:80,  y:100 },
      { id:4, name:'b',        type:'input',  expr:'', initVal:0.01, unit:'', desc:'Predation rate',   x:80,  y:200 },
      { id:5, name:'c',        type:'input',  expr:'', initVal:0.01, unit:'', desc:'Pred growth rate', x:80,  y:300 },
      { id:6, name:'d',        type:'input',  expr:'', initVal:0.1,  unit:'', desc:'Pred death rate',  x:80,  y:400 },
    ],
    edges: [{from:3,to:1},{from:4,to:1},{from:2,to:1},{from:1,to:2},{from:4,to:2},{from:5,to:2},{from:6,to:2}],
    _nextId: 7
  },
  sir: {
    nodes: [
      { id:1, name:'S',  type:'state',  expr:'S - beta*S*I/N*dt',          initVal:990, unit:'', desc:'Susceptible', x:150, y:200 },
      { id:2, name:'I',  type:'state',  expr:'I + (beta*S*I/N - gamma*I)*dt', initVal:10, unit:'', desc:'Infected', x:320, y:200 },
      { id:3, name:'R',  type:'state',  expr:'R + gamma*I*dt',              initVal:0,   unit:'', desc:'Recovered', x:490, y:200 },
      { id:4, name:'N',  type:'input',  expr:'', initVal:1000, unit:'', desc:'Total population', x:320, y:80 },
      { id:5, name:'beta', type:'input',expr:'', initVal:0.3,  unit:'', desc:'Transmission rate', x:150, y:80 },
      { id:6, name:'gamma',type:'input',expr:'', initVal:0.05, unit:'', desc:'Recovery rate', x:490, y:80 },
    ],
    edges: [{from:4,to:1},{from:5,to:1},{from:2,to:1},{from:1,to:2},{from:4,to:2},{from:5,to:2},{from:6,to:2},{from:2,to:3},{from:6,to:3}],
    _nextId: 7
  },
  rc: {
    nodes: [
      { id:1, name:'Vc', type:'state',  expr:'Vc + (Vin - Vc)/(R*C)*dt', initVal:0,    unit:'V', desc:'Capacitor voltage', x:320, y:200 },
      { id:2, name:'Vin',type:'input',  expr:'', initVal:5,    unit:'V', desc:'Input voltage', x:150, y:200 },
      { id:3, name:'R',  type:'input',  expr:'', initVal:1000, unit:'Ω', desc:'Resistance', x:150, y:300 },
      { id:4, name:'C',  type:'input',  expr:'', initVal:0.001,unit:'F', desc:'Capacitance', x:320, y:320 },
      { id:5, name:'I',  type:'output', expr:'(Vin-Vc)/R',               initVal:0, unit:'A', desc:'Current', x:490, y:200 },
    ],
    edges: [{from:2,to:1},{from:3,to:1},{from:4,to:1},{from:2,to:5},{from:1,to:5},{from:3,to:5}],
    _nextId: 6
  }
};
