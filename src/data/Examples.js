/**
 * Examples
 *
 * Built-in example models. All state nodes use derivMode=true so the
 * expression gives dx/dt and the chosen integrator (Euler or RK4) handles
 * the stepping. This makes a visible accuracy difference when switching to RK4.
 *
 * Input nodes include slider metadata (sliderMin, sliderMax, sliderStep) so
 * the SliderPanel can render interactive parameter controls out of the box.
 */

const EXAMPLES = Object.freeze({

  lorenz: {
    simParams: { t0: 0, t1: 100, dt: 0.03125 },
    integrationMethod: 'rk4',
    metadata: { title: 'Lorenz Attractor', description: 'Chaotic three-variable system — butterfly attractor. Try varying r near 13 to see the transition from chaos to a stable spiral.', author: '', version: '', tags: 'chaos,nonlinear' },
    nodes: [
      // ── State variables ───────────────────────────────────────────────────
      { id:1, name:'x', type:'state', expr:'s*(y-x)',     derivMode:true, initVal:0,   unit:'', desc:'X coordinate', x:360, y:200 },
      { id:2, name:'y', type:'state', expr:'-x*z+r*x-y', derivMode:true, initVal:1,   unit:'', desc:'Y coordinate', x:360, y:320 },
      { id:3, name:'z', type:'state', expr:'-b*z+x*y',   derivMode:true, initVal:1,   unit:'', desc:'Z coordinate', x:360, y:440 },
      // ── Parameters ────────────────────────────────────────────────────────
      { id:4, name:'s', type:'input', expr:'', derivMode:false, initVal:5,  unit:'', desc:'Sigma — rotation rate', x:140, y:200, sliderMin:1,   sliderMax:20, sliderStep:0.5 },
      { id:5, name:'r', type:'input', expr:'', derivMode:false, initVal:15, unit:'', desc:'Rho — Rayleigh number',  x:140, y:320, sliderMin:1,   sliderMax:30, sliderStep:0.5 },
      { id:6, name:'b', type:'input', expr:'', derivMode:false, initVal:1,  unit:'', desc:'Beta — geometry factor', x:140, y:440, sliderMin:0.1, sliderMax:5,  sliderStep:0.1 },
      // ── Outputs ───────────────────────────────────────────────────────────
      { id:7, name:'energy', type:'output', expr:'x*x+y*y+z*z',         derivMode:false, initVal:0, unit:'', desc:'Energy (x²+y²+z²)', x:570, y:260 },
      { id:8, name:'r_xy',   type:'output', expr:'sqrt(x*x+y*y)',        derivMode:false, initVal:0, unit:'', desc:'XY plane radius',   x:570, y:380 },
    ],
    edges: [
      {from:4,to:1},{from:2,to:1},
      {from:5,to:2},{from:1,to:2},{from:3,to:2},
      {from:6,to:3},{from:1,to:3},{from:2,to:3},
      {from:1,to:7},{from:2,to:7},{from:3,to:7},
      {from:1,to:8},{from:2,to:8},
    ],
    _nextId: 9,
  },

  climate: {
    nodes: [
      // ── State variables ──────────────────────────────────────────────────
      { id:1,  name:'T',        type:'state',     expr:'(forcing - lambda*T) / C',          derivMode:true,  initVal:0,    unit:'°C',    desc:'Temperature anomaly',           x:400, y:240 },
      { id:2,  name:'CO2',      type:'state',     expr:'emissions - uptake',                 derivMode:true,  initVal:415,  unit:'ppm',   desc:'Atmospheric CO₂',               x:400, y:100 },
      { id:3,  name:'ice',      type:'state',     expr:'-melt_rate * max(0, T)',             derivMode:true,  initVal:100,  unit:'%',     desc:'Arctic ice cover',               x:220, y:380 },
      // ── Algebraic intermediates ───────────────────────────────────────────
      { id:4,  name:'forcing',  type:'algebraic', expr:'5.35 * log(CO2 / 280)',              derivMode:false, initVal:0,    unit:'W/m²',  desc:'Radiative forcing',              x:220, y:170 },
      { id:5,  name:'uptake',   type:'algebraic', expr:'ocean_k * (CO2 - 280)',              derivMode:false, initVal:0,    unit:'ppm/t', desc:'Ocean+land CO₂ uptake',          x:580, y:100 },
      { id:6,  name:'albedo',   type:'algebraic', expr:'0.30 + 0.15 * (1 - ice/100)',       derivMode:false, initVal:0,    unit:'',      desc:'Surface albedo',                 x:220, y:300 },
      { id:7,  name:'lambda',   type:'algebraic', expr:'base_lambda - 0.4 * (1 - ice/100)',  derivMode:false, initVal:0,    unit:'W/m²/°C', desc:'Climate feedback (with ice)',  x:580, y:240 },
      // ── Inputs ────────────────────────────────────────────────────────────
      { id:8,  name:'emissions', type:'input',    expr:'', derivMode:false, initVal:4.5,  unit:'ppm/t',   desc:'Annual CO₂ emissions',   x:580, y:40,  sliderMin:0,   sliderMax:12,  sliderStep:0.1  },
      { id:9,  name:'C',         type:'input',    expr:'', derivMode:false, initVal:8,    unit:'W·yr/m²', desc:'Ocean heat capacity',     x:400, y:380, sliderMin:2,   sliderMax:20,  sliderStep:0.5  },
      { id:10, name:'base_lambda',type:'input',   expr:'', derivMode:false, initVal:1.5,  unit:'W/m²/°C', desc:'Base climate sensitivity',x:580, y:330, sliderMin:0.5, sliderMax:3,   sliderStep:0.05 },
      { id:11, name:'ocean_k',   type:'input',    expr:'', derivMode:false, initVal:0.08, unit:'1/t',     desc:'Ocean uptake rate',       x:580, y:160, sliderMin:0.01,sliderMax:0.3,  sliderStep:0.01 },
      { id:12, name:'melt_rate', type:'input',    expr:'', derivMode:false, initVal:1.2,  unit:'%/°C/t',  desc:'Ice melt rate per °C',    x:80,  y:380, sliderMin:0.1, sliderMax:4,   sliderStep:0.1  },
      // ── Outputs ───────────────────────────────────────────────────────────
      { id:13, name:'sea_rise',  type:'output',   expr:'0.003 * max(0, T) + 0.0005 * max(0, T*T)', derivMode:false, initVal:0, unit:'m/t', desc:'Sea level rise rate', x:80, y:240 },
    ],
    edges: [
      {from:2,to:4},{from:4,to:1},{from:9,to:1},{from:7,to:1},
      {from:8,to:2},{from:5,to:2},{from:11,to:5},{from:2,to:5},
      {from:1,to:3},{from:12,to:3},
      {from:3,to:6},{from:3,to:7},{from:10,to:7},
      {from:1,to:13},
    ],
    _nextId: 14,
  },

  exponential: {
    nodes: [
      { id:1, name:'x',      type:'state',   expr:'x * r',   derivMode:true,  initVal:1,   unit:'',    desc:'Population',           x:300, y:200 },
      { id:2, name:'r',      type:'input',   expr:'',        derivMode:false, initVal:0.3, unit:'1/t', desc:'Growth rate',           x:150, y:200, sliderMin:0.01, sliderMax:1,   sliderStep:0.01 },
      { id:3, name:'growth', type:'output',  expr:'x * r',   derivMode:false, initVal:0,   unit:'',    desc:'Instantaneous growth',  x:460, y:200 },
    ],
    edges: [{from:2,to:1},{from:1,to:3},{from:2,to:3}],
    _nextId: 4,
  },

  logistic: {
    nodes: [
      { id:1, name:'x',   type:'state',   expr:'x * r * (1 - x/K)', derivMode:true,  initVal:10,  unit:'',    desc:'Population',        x:300, y:200 },
      { id:2, name:'r',   type:'input',   expr:'',                   derivMode:false, initVal:0.5, unit:'1/t', desc:'Growth rate',        x:150, y:150, sliderMin:0.01, sliderMax:2,   sliderStep:0.01 },
      { id:3, name:'K',   type:'input',   expr:'',                   derivMode:false, initVal:500, unit:'',    desc:'Carrying capacity',  x:150, y:250, sliderMin:50,   sliderMax:2000, sliderStep:10  },
      { id:4, name:'net', type:'output',  expr:'x * r * (1 - x/K)', derivMode:false, initVal:0,   unit:'',    desc:'Net growth rate',    x:460, y:200 },
    ],
    edges: [{from:2,to:1},{from:3,to:1},{from:1,to:4},{from:2,to:4},{from:3,to:4}],
    _nextId: 5,
  },

  predprey: {
    nodes: [
      { id:1, name:'prey', type:'state',  expr:'a*prey - b*prey*pred',   derivMode:true,  initVal:40,   unit:'',    desc:'Prey population',    x:200, y:200 },
      { id:2, name:'pred', type:'state',  expr:'c*prey*pred - d*pred',   derivMode:true,  initVal:9,    unit:'',    desc:'Predator population', x:420, y:200 },
      { id:3, name:'a',    type:'input',  expr:'', derivMode:false,       initVal:0.1,  unit:'1/t', desc:'Prey growth rate',    x:80,  y:100, sliderMin:0.01, sliderMax:0.5,  sliderStep:0.01 },
      { id:4, name:'b',    type:'input',  expr:'', derivMode:false,       initVal:0.01, unit:'1/t', desc:'Predation rate',      x:80,  y:200, sliderMin:0.001,sliderMax:0.05, sliderStep:0.001},
      { id:5, name:'c',    type:'input',  expr:'', derivMode:false,       initVal:0.01, unit:'1/t', desc:'Pred growth rate',    x:80,  y:300, sliderMin:0.001,sliderMax:0.05, sliderStep:0.001},
      { id:6, name:'d',    type:'input',  expr:'', derivMode:false,       initVal:0.1,  unit:'1/t', desc:'Pred death rate',     x:80,  y:400, sliderMin:0.01, sliderMax:0.5,  sliderStep:0.01 },
    ],
    edges: [{from:3,to:1},{from:4,to:1},{from:2,to:1},{from:1,to:2},{from:4,to:2},{from:5,to:2},{from:6,to:2}],
    _nextId: 7,
  },

  sir: {
    nodes: [
      { id:1, name:'S',     type:'state',  expr:'-beta*S*I/N',            derivMode:true,  initVal:990,  unit:'',    desc:'Susceptible',        x:150, y:200 },
      { id:2, name:'I',     type:'state',  expr:'beta*S*I/N - gamma*I',   derivMode:true,  initVal:10,   unit:'',    desc:'Infected',            x:320, y:200 },
      { id:3, name:'R',     type:'state',  expr:'gamma*I',                derivMode:true,  initVal:0,    unit:'',    desc:'Recovered',           x:490, y:200 },
      { id:4, name:'N',     type:'input',  expr:'', derivMode:false,       initVal:1000, unit:'',    desc:'Total population',    x:320, y:80  },
      { id:5, name:'beta',  type:'input',  expr:'', derivMode:false,       initVal:0.3,  unit:'1/t', desc:'Transmission rate',   x:150, y:80,  sliderMin:0.01, sliderMax:1,   sliderStep:0.01 },
      { id:6, name:'gamma', type:'input',  expr:'', derivMode:false,       initVal:0.05, unit:'1/t', desc:'Recovery rate',       x:490, y:80,  sliderMin:0.01, sliderMax:0.5, sliderStep:0.01 },
    ],
    edges: [{from:4,to:1},{from:5,to:1},{from:2,to:1},{from:1,to:2},{from:4,to:2},{from:5,to:2},{from:6,to:2},{from:2,to:3},{from:6,to:3}],
    _nextId: 7,
  },

  rc: {
    nodes: [
      { id:1, name:'Vc',  type:'state',   expr:'(Vin - Vc) / (R*C)',  derivMode:true,  initVal:0,    unit:'V', desc:'Capacitor voltage', x:320, y:200 },
      { id:2, name:'Vin', type:'input',   expr:'', derivMode:false,    initVal:5,    unit:'V', desc:'Input voltage',     x:150, y:200, sliderMin:0, sliderMax:24, sliderStep:0.5 },
      { id:3, name:'R',   type:'input',   expr:'', derivMode:false,    initVal:1000, unit:'Ω', desc:'Resistance',        x:150, y:300, sliderMin:100, sliderMax:10000, sliderStep:100 },
      { id:4, name:'C',   type:'input',   expr:'', derivMode:false,    initVal:0.001,unit:'F', desc:'Capacitance',       x:320, y:320, sliderMin:0.0001, sliderMax:0.01, sliderStep:0.0001 },
      { id:5, name:'I',   type:'output',  expr:'(Vin - Vc) / R',      derivMode:false, initVal:0, unit:'A', desc:'Current',          x:490, y:200 },
    ],
    edges: [{from:2,to:1},{from:3,to:1},{from:4,to:1},{from:2,to:5},{from:1,to:5},{from:3,to:5}],
    _nextId: 6,
  },

});

// ── Dual-environment export ───────────────────────────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EXAMPLES };
}
