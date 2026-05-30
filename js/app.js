// Application controller
(function () {
  const model = new STModel();
  const statusMsg  = document.getElementById('status-msg');
  const statusTime = document.getElementById('status-time');

  // ── Right-panel overlay resize ──────────────────────────────────────────────
  const rightPanel   = document.getElementById('right-panel');
  const resizeHandle = document.getElementById('right-resize-handle');
  let rpResizing = false, rpStartX = 0, rpStartW = 0;
  let userPanelWidth = 320; // remembered across float/dock cycles

  resizeHandle.addEventListener('mousedown', e => {
    rpResizing = true;
    rpStartX = e.clientX;
    rpStartW = rightPanel.offsetWidth;
    resizeHandle.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!rpResizing) return;
    const delta = rpStartX - e.clientX;
    const newW = Math.min(Math.max(rpStartW + delta, 240), window.innerWidth * 0.7);
    rightPanel.style.width = newW + 'px';
    userPanelWidth = newW;
    if (!chartFloating) chart.draw();
  });
  document.addEventListener('mouseup', () => {
    if (!rpResizing) return;
    rpResizing = false;
    resizeHandle.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    if (!chartFloating) chart.draw();
  });

  // ── Graph canvas ────────────────────────────────────────────────────────────
  const graphCanvas = document.getElementById('graph-canvas');
  const gc = new GraphCanvas(graphCanvas, model, onNodeSelect);

  // ── Chart ───────────────────────────────────────────────────────────────────
  const chartPanel  = document.getElementById('chart-panel');
  const chartCanvas = document.getElementById('chart-canvas');
  const chartLegend = document.getElementById('chart-legend');
  const chart = new STChart(chartCanvas, chartLegend);

  // ── Chart float / dock ──────────────────────────────────────────────────────
  let chartFloating = false;
  let floatDragActive = false, floatDragOX = 0, floatDragOY = 0;
  let floatResizeActive = false, floatResizeStartX = 0, floatResizeStartY = 0,
      floatResizeStartW = 0, floatResizeStartH = 0;

  const btnFloat = document.getElementById('btn-chart-float');
  const header   = chartPanel.querySelector('.panel-header');
  const corner   = document.getElementById('chart-resize-corner');

  // Width of node-editor when chart is floating (compact)
  const COMPACT_W = 280;

  btnFloat.addEventListener('click', () => chartFloating ? dockChart() : floatChart());

  function floatChart() {
    chartFloating = true;
    userPanelWidth = rightPanel.offsetWidth; // save before shrinking

    document.body.appendChild(chartPanel);
    chartPanel.classList.add('floating');

    const W = 480, H = 340;
    chartPanel.style.left   = Math.max(0, (window.innerWidth  - W) / 2) + 'px';
    chartPanel.style.top    = Math.max(0, (window.innerHeight - H) / 2) + 'px';
    chartPanel.style.width  = W + 'px';
    chartPanel.style.height = H + 'px';
    chartPanel.style.right  = '';
    chartPanel.style.bottom = '';

    // Collapse right panel to just the node editor
    rightPanel.style.width = COMPACT_W + 'px';

    btnFloat.textContent = '⊞';
    btnFloat.title = 'Dock chart back to panel';
    chart.draw();
  }

  function dockChart() {
    chartFloating = false;
    chartPanel.classList.remove('floating');
    chartPanel.style.cssText = '';
    rightPanel.appendChild(chartPanel);

    // Restore user's last chosen panel width
    rightPanel.style.width = userPanelWidth + 'px';

    btnFloat.textContent = '⤢';
    btnFloat.title = 'Pop out to floating window';
    chart.draw();
  }

  // Drag floating window by header
  header.addEventListener('mousedown', e => {
    if (!chartFloating || e.target === btnFloat) return;
    floatDragActive = true;
    floatDragOX = e.clientX - chartPanel.offsetLeft;
    floatDragOY = e.clientY - chartPanel.offsetTop;
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  // Resize floating window by corner grip
  corner.addEventListener('mousedown', e => {
    if (!chartFloating) return;
    floatResizeActive = true;
    floatResizeStartX = e.clientX; floatResizeStartY = e.clientY;
    floatResizeStartW = chartPanel.offsetWidth; floatResizeStartH = chartPanel.offsetHeight;
    document.body.style.userSelect = 'none';
    e.preventDefault(); e.stopPropagation();
  });

  document.addEventListener('mousemove', e => {
    if (floatDragActive) {
      chartPanel.style.left = Math.max(0, e.clientX - floatDragOX) + 'px';
      chartPanel.style.top  = Math.max(0, e.clientY - floatDragOY) + 'px';
    }
    if (floatResizeActive) {
      chartPanel.style.width  = Math.max(280, floatResizeStartW + (e.clientX - floatResizeStartX)) + 'px';
      chartPanel.style.height = Math.max(200, floatResizeStartH + (e.clientY - floatResizeStartY)) + 'px';
      chart.draw();
    }
  });

  document.addEventListener('mouseup', () => {
    if (floatDragActive || floatResizeActive) {
      floatDragActive = floatResizeActive = false;
      document.body.style.userSelect = '';
      chart.draw();
    }
  });

  // ── Tool buttons ─────────────────────────────────────────────────────────────
  document.getElementById('tool-select') .addEventListener('click', () => setTool('select'));
  document.getElementById('tool-connect').addEventListener('click', () => setTool('connect'));
  document.getElementById('tool-delete') .addEventListener('click', () => setTool('delete'));

  function setTool(t) {
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    const ids = { select: 'tool-select', connect: 'tool-connect', delete: 'tool-delete' };
    document.getElementById(ids[t]).classList.add('active');
    gc.setTool(t);
    setStatus(t === 'connect' ? 'Click a source node, drag to target node.' :
              t === 'delete'  ? 'Click a node or edge to delete it.' :
              'Select / drag nodes. Double-click canvas to add a node.');
  }

  // ── Simulation controls ──────────────────────────────────────────────────────
  document.getElementById('btn-run')    .addEventListener('click', runAll);
  document.getElementById('btn-animate').addEventListener('click', toggleAnimate);
  document.getElementById('btn-step')  .addEventListener('click', stepOnce);
  document.getElementById('btn-reset') .addEventListener('click', resetSim);

  function getParams() {
    return {
      t0: parseFloat(document.getElementById('t0').value) || 0,
      t1: parseFloat(document.getElementById('t1').value) || 10,
      dt: parseFloat(document.getElementById('dt').value) || 0.1,
    };
  }

  // Accumulated incremental series (used by Step and Animate)
  let incTimes  = null; // null = not started
  let incSeries = null;
  let animRafId = null; // requestAnimationFrame handle when animating

  function ensureCompiled() {
    const errors = model.compile();
    if (errors.length) { setStatus('Compile errors: ' + errors.join('; '), true); return false; }
    return true;
  }

  // Initialise incremental state at t0 (call before first step)
  function initIncremental(t0) {
    model.reset(t0);
    incTimes  = [t0];
    incSeries = {};
    for (const n of model.nodes.values()) incSeries[n.name] = [n.value];
  }

  // Advance one dt, record values, update chart + graph
  function doStep(dt) {
    const { t1 } = getParams();
    if (model._t >= t1 - dt * 0.5) return false; // reached end
    model.step(dt);
    incTimes.push(model._t);
    for (const n of model.nodes.values()) {
      if (!incSeries[n.name]) incSeries[n.name] = [];
      incSeries[n.name].push(n.value);
    }
    chart.setData({ times: incTimes, series: incSeries }, model);
    gc.draw();
    statusTime.textContent = `t = ${model._t.toFixed(3)}`;
    return true;
  }

  // ── Run all (batch, instant) ─────────────────────────────────────────────────
  function runAll() {
    stopAnimate();
    const { t0, t1, dt } = getParams();
    if (!ensureCompiled()) return;
    const result = model.run(t0, t1, dt);
    if (result.errors && result.errors.length) { setStatus(result.errors.join('; '), true); return; }

    // Sync incremental state to end so Step/Animate can continue
    incTimes  = result.times;
    incSeries = result.series;

    chart.setData(result, model);
    gc.draw();
    setStatus(`Run complete — ${result.times.length} steps`);
    statusTime.textContent = `t = ${result.times[result.times.length - 1].toFixed(3)}`;
  }

  // ── Step once ────────────────────────────────────────────────────────────────
  function stepOnce() {
    stopAnimate();
    const { t0, dt, t1 } = getParams();
    if (!ensureCompiled()) return;
    if (incTimes === null) initIncremental(t0);
    const more = doStep(dt);
    if (!more) setStatus(`Reached t₁ = ${t1} — press Reset to restart.`);
    else setStatus(`Step → t = ${model._t.toFixed(3)}`);
  }

  // ── Animate (step-by-step with rAF) ──────────────────────────────────────────
  let animating = false;
  const btnAnimate = document.getElementById('btn-animate');

  function toggleAnimate() {
    animating ? stopAnimate() : startAnimate();
  }

  function startAnimate() {
    const { t0, dt } = getParams();
    if (!ensureCompiled()) return;
    if (incTimes === null) initIncremental(t0);
    animating = true;
    btnAnimate.textContent = '⏸ Pause';
    btnAnimate.style.background = 'var(--orange)';
    btnAnimate.style.color = '#fff';
    btnAnimate.style.borderColor = 'var(--orange)';

    // Aim for ~30 steps/sec regardless of dt
    const MS_PER_STEP = 33;
    let lastTime = null;

    function tick(now) {
      if (!animating) return;
      if (lastTime === null || now - lastTime >= MS_PER_STEP) {
        lastTime = now;
        const more = doStep(dt);
        if (!more) { stopAnimate(); setStatus('Animation complete.'); return; }
        setStatus(`Animating… t = ${model._t.toFixed(3)}`);
      }
      animRafId = requestAnimationFrame(tick);
    }
    animRafId = requestAnimationFrame(tick);
  }

  function stopAnimate() {
    animating = false;
    if (animRafId) { cancelAnimationFrame(animRafId); animRafId = null; }
    btnAnimate.textContent = '▶ Animate';
    btnAnimate.style.background = '';
    btnAnimate.style.color = '';
    btnAnimate.style.borderColor = '';
  }

  // ── Reset ────────────────────────────────────────────────────────────────────
  function resetSim() {
    stopAnimate();
    const { t0 } = getParams();
    model.reset(t0);
    incTimes = null; incSeries = null;
    chart.clear();
    gc.draw();
    statusTime.textContent = '';
    setStatus('Reset. Press Animate to play, Step to advance one tick, or Run all for instant result.');
  }

  // ── Node editor ──────────────────────────────────────────────────────────────
  const nfName    = document.getElementById('nf-name');
  const nfType    = document.getElementById('nf-type');
  const nfExpr    = document.getElementById('nf-expr');
  const nfInit    = document.getElementById('nf-init');
  const nfUnit    = document.getElementById('nf-unit');
  const nfDesc    = document.getElementById('nf-desc');
  const nfInitRow = document.getElementById('nf-init-row');
  const nfError   = document.getElementById('nf-error');
  let selectedNodeId = null;

  nfType.addEventListener('change', () => {
    nfExpr.parentElement.style.display = nfType.value === 'input' ? 'none' : 'flex';
  });

  function onNodeSelect(node) {
    selectedNodeId = node ? node.id : null;
    const form  = document.getElementById('node-form');
    const noSel = document.getElementById('no-selection');
    if (!node) { form.style.display = 'none'; noSel.style.display = ''; return; }
    form.style.display = 'flex';
    noSel.style.display = 'none';
    nfName.value = node.name; nfType.value = node.type; nfExpr.value = node.expr;
    nfInit.value = node.initVal; nfUnit.value = node.unit; nfDesc.value = node.desc;
    nfError.textContent = '';
    nfExpr.parentElement.style.display = node.type === 'input' ? 'none' : 'flex';
  }

  document.getElementById('nf-apply').addEventListener('click', () => {
    if (selectedNodeId === null) return;
    const node = model.nodes.get(selectedNodeId);
    if (!node) return;
    const newName = nfName.value.trim();
    if (!newName) { nfError.textContent = 'Name required'; return; }
    for (const n of model.nodes.values()) {
      if (n.id !== selectedNodeId && n.name === newName) { nfError.textContent = 'Name already used'; return; }
    }
    node.name = newName; node.type = nfType.value; node.expr = nfExpr.value.trim();
    node.initVal = parseFloat(nfInit.value) || 0; node.value = node.initVal;
    node.unit = nfUnit.value.trim(); node.desc = nfDesc.value.trim();
    nfError.textContent = '';
    const nodeNames = [...model.nodes.values()].map(n => n.name);
    if (node.type !== 'input') {
      const err = node.compile(nodeNames);
      if (err) { nfError.textContent = 'Expression error: ' + err; }
    }
    gc.draw();
    setStatus(`Node "${node.name}" updated`);
  });

  // ── Examples ─────────────────────────────────────────────────────────────────
  document.getElementById('example-select').addEventListener('change', function () {
    const key = this.value;
    if (!key || !EXAMPLES[key]) return;
    stopAnimate();
    model.fromJSON(EXAMPLES[key]);
    onNodeSelect(null);
    chart.clear();
    incTimes = null; incSeries = null;
    statusTime.textContent = '';
    gc.draw();
    setStatus(`Loaded: ${this.options[this.selectedIndex].text}. Press Animate or Run all.`);
    this.value = '';
  });

  // ── Save / Load ──────────────────────────────────────────────────────────────
  document.getElementById('btn-save').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(model.toJSON(), null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'stgraph-model.json' });
    a.click(); URL.revokeObjectURL(a.href);
  });
  document.getElementById('btn-load').addEventListener('click', () => document.getElementById('file-input').click());
  document.getElementById('file-input').addEventListener('change', function () {
    if (!this.files[0]) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        stopAnimate();
        model.fromJSON(JSON.parse(ev.target.result));
        onNodeSelect(null); chart.clear(); incTimes = null; incSeries = null; gc.draw();
        setStatus('Model loaded.');
      } catch (e) { setStatus('Failed to load: ' + e.message, true); }
    };
    reader.readAsText(this.files[0]);
    this.value = '';
  });

  function setStatus(msg, isError = false) {
    statusMsg.textContent = msg;
    statusMsg.style.color = isError ? '#f7604f' : '';
  }

  // ── Init ─────────────────────────────────────────────────────────────────────
  model.fromJSON(EXAMPLES.logistic);
  gc.draw();
  setStatus('Ready — press ▶ Animate to watch the simulation unfold step by step.');
})();
