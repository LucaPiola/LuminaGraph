/**
 * App.js — Application controller
 *
 * Tasks implemented:
 *   Task 1  – btn-diff active class toggle
 *   Task 2  – File ▾ / Tools ▾ dropdown menus replacing toolbar buttons
 *   Task 3  – Console, Fns, Analysis open as floating windows
 *   Task 4  – Copy / Cut / Paste nodes (Ctrl+C/X/V)
 *   Task 5  – Right-click context menu wired to gc.onContextMenu
 *   Task 6  – Dependency analysis + feedback loop detection
 *   Task 7  – Text node type in node editor (canvas handles drawing)
 *   Task 8  – Model metadata dialog, document.title updates
 *   Task 9  – "Add Gauge" from context menu → gc.model.gauges
 */
(function () {

  // ── Model ──────────────────────────────────────────────────────────────────
  const model = new STModel();

  // ── Status helpers ─────────────────────────────────────────────────────────
  const statusMsg  = document.getElementById('status-msg');
  const statusTime = document.getElementById('status-time');

  function setStatus(msg, isError = false) {
    statusMsg.textContent = msg;
    statusMsg.style.color = isError ? 'var(--red)' : '';
  }

  // ── Error logger ───────────────────────────────────────────────────────────
  const errorLogger = new ErrorLogger(model);
  const errorBadge  = document.getElementById('error-badge');
  const errorCount  = document.getElementById('error-count');

  errorLogger.onChange(count => {
    errorCount.textContent = count;
    errorBadge.classList.toggle('visible', count > 0);
  });
  errorCount.textContent = errorLogger.count;
  errorBadge.classList.toggle('visible', errorLogger.count > 0);

  // Left-click → download log; Right-click → clear all errors
  errorBadge.addEventListener('click', () => errorLogger.download());
  errorBadge.addEventListener('contextmenu', e => {
    e.preventDefault();
    errorLogger.clear();
    setStatus('Error log cleared.');
  });
  errorBadge.title = 'Click to download error log · Right-click to clear';

  function reportError(type, messages) {
    errorLogger.log(type, messages);
    setStatus(messages.join(' | '), true);
  }

  // ── Theme toggle ───────────────────────────────────────────────────────────
  // Dark mode always on
  document.documentElement.dataset.theme = 'dark';

  // ── Right-panel overlay resize ─────────────────────────────────────────────
  const rightPanel   = document.getElementById('right-panel');
  const resizeHandle = document.getElementById('right-resize-handle');
  let rpResizing = false, rpStartX = 0, rpStartW = 0;
  let userPanelWidth = 240;

  resizeHandle.addEventListener('mousedown', e => {
    rpResizing = true;
    rpStartX   = e.clientX;
    rpStartW   = rightPanel.offsetWidth;
    resizeHandle.classList.add('dragging');
    document.body.style.cursor     = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!rpResizing) return;
    const newW = Math.min(Math.max(rpStartW + (rpStartX - e.clientX), 200), window.innerWidth * 0.7);
    rightPanel.style.width = newW + 'px';
    document.documentElement.style.setProperty('--right-w', newW + 'px');
    userPanelWidth = newW;
    if (!chartFloating) chart.draw();
  });
  document.addEventListener('mouseup', () => {
    if (!rpResizing) return;
    rpResizing = false;
    resizeHandle.classList.remove('dragging');
    document.body.style.cursor = document.body.style.userSelect = '';
    if (!chartFloating) chart.draw();
  });

  // ── Graph canvas ───────────────────────────────────────────────────────────
  const gc = new GraphCanvas(
    document.getElementById('graph-canvas'),
    model,
    onNodeSelect,
  );

  // ── Undo / redo ────────────────────────────────────────────────────────────
  const MAX_HISTORY = 50;
  let undoStack = [];
  let redoStack = [];

  function pushUndoSnapshot() {
    undoStack.push(model.toJSON());
    if (undoStack.length > MAX_HISTORY) undoStack.shift();
    redoStack = [];
  }

  function undo() {
    if (undoStack.length === 0) return;
    redoStack.push(model.toJSON());
    model.fromJSON(undoStack.pop());
    _afterUndoRedo();
  }

  function redo() {
    if (redoStack.length === 0) return;
    undoStack.push(model.toJSON());
    model.fromJSON(redoStack.pop());
    _afterUndoRedo();
  }

  function _afterUndoRedo() {
    onNodeSelect(null);
    sliderPanel.refresh();
    chart.clear();
    updateDataTable(null, null);
    incTimes = incSeries = null;
    statusTime.textContent = '';
    gc.draw();
    setStatus('');
    if (analysisPanel) analysisPanel.refresh();
  }

  gc.onMutation = pushUndoSnapshot;

  // ── Chart ──────────────────────────────────────────────────────────────────
  const chart = new STChart(
    document.getElementById('chart-canvas'),
    document.getElementById('chart-legend'),
  );

  // ── Slider panel ───────────────────────────────────────────────────────────
  const sliderPanel = new SliderPanel(
    document.getElementById('slider-container'),
    model,
    onParamChange,
  );

  function onParamChange(_nodeId, _value) {
    if (!animating && incTimes !== null) runAll();
  }

  // ── Generic floatable helper (for existing dockable panels) ────────────────
  function makeFloatable(panelId, btnId, defaultW, defaultH) {
    const panel  = document.getElementById(panelId);
    const btn    = document.getElementById(btnId);
    if (!panel || !btn) return { isFloating: () => false };
    const header = panel.querySelector('.panel-header');
    let floating   = false;
    let dragActive = false, dragOX = 0, dragOY = 0;
    let anchor = panel.nextSibling;

    btn.addEventListener('click', () => floating ? dock() : float());

    function float() {
      floating = true;
      anchor   = panel.nextSibling;
      document.body.appendChild(panel);
      panel.classList.add('floating');
      panel.style.width  = defaultW + 'px';
      panel.style.height = defaultH + 'px';
      panel.style.left   = Math.max(0, (window.innerWidth  - defaultW) / 2) + 'px';
      panel.style.top    = Math.max(0, (window.innerHeight - defaultH) / 2) + 'px';
      btn.textContent = '⊞';
      btn.title       = 'Dock back to panel';
    }

    function dock() {
      floating = false;
      panel.classList.remove('floating');
      panel.style.cssText = '';
      if (anchor && anchor.parentNode === rightPanel) {
        rightPanel.insertBefore(panel, anchor);
      } else {
        rightPanel.appendChild(panel);
      }
      btn.textContent = '⤢';
      btn.title       = 'Pop out to floating window';
    }

    header.addEventListener('mousedown', e => {
      if (!floating || e.target === btn) return;
      dragActive = true;
      dragOX = e.clientX - panel.offsetLeft;
      dragOY = e.clientY - panel.offsetTop;
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!dragActive) return;
      panel.style.left = Math.max(0, e.clientX - dragOX) + 'px';
      panel.style.top  = Math.max(0, e.clientY - dragOY) + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (dragActive) { dragActive = false; document.body.style.userSelect = ''; }
    });

    return { isFloating: () => floating };
  }

  // Floatable panels (right-panel dockable)
  makeFloatable('node-editor',      'btn-nodeed-float',    300, 420);
  makeFloatable('slider-panel',     'btn-params-float',    300, 320);
  makeFloatable('data-table-panel', 'btn-datatable-float', 560, 400);
  makeFloatable('modeldiff-panel',  'btn-diff-float',      640, 460);

  // ── Task 3: Floating-only panels (Console, Fns, Analysis) ─────────────────
  // These panels live at body level with class floating. We wire drag + close.

  function wireBodyFloatingPanel(panelId, closeBtnId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    const header  = panel.querySelector('.panel-header');
    const closeBtn = closeBtnId ? document.getElementById(closeBtnId) : null;
    let dragActive = false, dragOX = 0, dragOY = 0;

    header.addEventListener('mousedown', e => {
      if (e.target.classList.contains('mac-dot')) return;
      if (closeBtn && e.target === closeBtn) return;
      dragActive = true;
      dragOX = e.clientX - panel.offsetLeft;
      dragOY = e.clientY - panel.offsetTop;
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!dragActive) return;
      panel.style.left = Math.max(0, e.clientX - dragOX) + 'px';
      panel.style.top  = Math.max(0, e.clientY - dragOY) + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (dragActive) { dragActive = false; document.body.style.userSelect = ''; }
    });
    if (closeBtn) {
      closeBtn.addEventListener('click', () => { panel.style.display = 'none'; });
    }
  }

  wireBodyFloatingPanel('console-panel',  'btn-console-close');
  wireBodyFloatingPanel('fnlib-panel',    'btn-fnlib-close');
  wireBodyFloatingPanel('analysis-panel', 'btn-analysis-close');
  wireBodyFloatingPanel('model-info-dialog', 'btn-model-info-close');

  // ── Chart float / dock ─────────────────────────────────────────────────────
  let chartFloating = false;
  let floatDragActive = false,   floatDragOX = 0, floatDragOY = 0;
  let floatResizeActive = false, floatResizeStartX = 0, floatResizeStartY = 0,
      floatResizeStartW = 0,     floatResizeStartH = 0;

  const chartPanel = document.getElementById('chart-panel');
  const btnFloat   = document.getElementById('btn-chart-float');
  const header     = chartPanel.querySelector('.panel-header');
  const corner     = document.getElementById('chart-resize-corner');
  const COMPACT_W  = 280;

  if (btnFloat) btnFloat.addEventListener('click', () => chartFloating ? dockChart() : floatChart());

  function floatChart() {
    chartFloating  = true;
    userPanelWidth = rightPanel.offsetWidth;
    document.body.appendChild(chartPanel);
    chartPanel.classList.add('floating');
    const W = 500, H = 360;
    chartPanel.style.left   = Math.max(0, (window.innerWidth  - W) / 2) + 'px';
    chartPanel.style.top    = Math.max(0, (window.innerHeight - H) / 2) + 'px';
    chartPanel.style.width  = W + 'px';
    chartPanel.style.height = H + 'px';
    chartPanel.style.right  = chartPanel.style.bottom = '';
    rightPanel.style.width  = COMPACT_W + 'px';
    btnFloat.textContent    = '⊞';
    btnFloat.title          = 'Dock chart back to panel';
    chart.draw();
  }

  function dockChart() {
    chartFloating = false;
    chartPanel.classList.remove('floating');
    chartPanel.style.cssText = '';
    const dataTablePanel = document.getElementById('data-table-panel');
    if (dataTablePanel && dataTablePanel.parentNode === rightPanel) {
      rightPanel.insertBefore(chartPanel, dataTablePanel);
    } else {
      rightPanel.appendChild(chartPanel);
    }
    rightPanel.style.width = userPanelWidth + 'px';
    btnFloat.textContent   = '⤢';
    btnFloat.title         = 'Pop out to floating window';
    chart.draw();
  }

  header.addEventListener('mousedown', e => {
    if (!chartFloating || e.target === btnFloat || e.target.closest('#chart-settings-menu')) return;
    floatDragActive = true;
    floatDragOX = e.clientX - chartPanel.offsetLeft;
    floatDragOY = e.clientY - chartPanel.offsetTop;
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });
  corner.addEventListener('mousedown', e => {
    if (!chartFloating) return;
    floatResizeActive = true;
    floatResizeStartX = e.clientX; floatResizeStartY = e.clientY;
    floatResizeStartW = chartPanel.offsetWidth;
    floatResizeStartH = chartPanel.offsetHeight;
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

  // ── Chart visualization settings menu ─────────────────────────────────────
  const btnChartSettings  = document.getElementById('btn-chart-settings');
  const chartSettingsMenu = document.getElementById('chart-settings-menu');
  const csLinewidth  = document.getElementById('cs-linewidth');
  const csShowlabels = document.getElementById('cs-showlabels');
  const csDecimals   = document.getElementById('cs-decimals');
  const csLabelevery = document.getElementById('cs-labelevery');
  const csShowdots   = document.getElementById('cs-showdots');

  btnChartSettings.addEventListener('click', e => {
    const open = chartSettingsMenu.style.display !== 'none';
    chartSettingsMenu.style.display = open ? 'none' : 'flex';
    e.stopPropagation();
  });

  document.addEventListener('click', e => {
    if (!chartSettingsMenu.contains(e.target) && e.target !== btnChartSettings) {
      chartSettingsMenu.style.display = 'none';
    }
  });

  function syncViz() {
    const d = parseInt(csDecimals.value, 10);
    chart.updateViz({
      lineWidth:  parseFloat(csLinewidth.value) || 2,
      showLabels: csShowlabels.checked,
      decimals:   isNaN(d) ? 3 : d,
      labelEvery: parseInt(csLabelevery.value, 10) || 10,
      showDots:   csShowdots.checked,
    });
  }

  [csLinewidth, csDecimals, csLabelevery].forEach(el => el.addEventListener('input', syncViz));
  [csShowlabels, csShowdots].forEach(el => el.addEventListener('change', syncViz));

  // ── Chart tab switching ────────────────────────────────────────────────────
  const tabTimeseries   = document.getElementById('tab-timeseries');
  const tabPhasespace   = document.getElementById('tab-phasespace');
  const tabPhasespace3d = document.getElementById('tab-phasespace3d');
  const phaseControls   = document.getElementById('phase-space-controls');
  const phase3dControls = document.getElementById('phase-space-3d-controls');
  const chart3dContainer = document.getElementById('chart-3d-container');
  const chartCanvasEl   = document.getElementById('chart-canvas');
  const chartLegendEl   = document.getElementById('chart-legend');

  // ── 3D chart instance ──────────────────────────────────────────────────────
  const chart3d = (typeof Chart3D !== 'undefined') ? new Chart3D(chart3dContainer) : null;

  function setChartTab(tab) {
    [tabTimeseries, tabPhasespace, tabPhasespace3d].forEach(t => t && t.classList.remove('active'));
    tab.classList.add('active');

    const is3d = tab === tabPhasespace3d;
    const is2d = tab === tabPhasespace;

    phaseControls.style.display   = is2d  ? 'flex' : 'none';
    phase3dControls.style.display = is3d  ? 'flex' : 'none';
    chart3dContainer.style.display = is3d ? 'flex' : 'none';
    chartCanvasEl.style.display    = is3d ? 'none' : 'block';
    chartLegendEl.style.display    = is3d ? 'none' : '';

    if (is3d) {
      if (chart3d) {
        chart3d.init();
        chart3d.resume();
        // Always populate selectors from model immediately, even with no data yet
        if (!chart3d._model) chart3d._model = model;
        chart3d._updateSelectors();
        // Feed existing simulation data if available
        if (incTimes && incSeries && !chart3d._data) {
          chart3d.setData({ times: incTimes, series: incSeries }, model);
        }
        setTimeout(() => { chart3d.resize(); chart3d.draw(); }, 50);
      }
    } else {
      if (chart3d) chart3d.pause();
      chart.setMode(is2d ? 'phasespace' : 'timeseries');
    }
  }

  tabTimeseries.addEventListener('click',   () => setChartTab(tabTimeseries));
  tabPhasespace.addEventListener('click',   () => setChartTab(tabPhasespace));
  if (tabPhasespace3d) tabPhasespace3d.addEventListener('click', () => setChartTab(tabPhasespace3d));

  // Reset 3D camera
  const btn3dReset = document.getElementById('btn-3d-reset');
  if (btn3dReset) btn3dReset.addEventListener('click', () => chart3d && chart3d.resetCamera());

  // Auto-resize 3D renderer whenever the container changes size (drag resize, window resize, etc.)
  if (chart3d && chart3dContainer && typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => {
      if (chart3d._ready) chart3d.resize();
    }).observe(chart3dContainer);
  }

  // Feed 3D chart whenever data is set
  const _origChartSetData = chart.setData.bind(chart);
  chart.setData = function(result, model_arg) {
    _origChartSetData(result, model_arg);
    if (chart3d && result) chart3d.setData(result, model_arg || model);
  };

  // Keep 3D selectors in sync whenever model changes
  function _sync3dModel() {
    if (chart3d) {
      chart3d._model = model;
      chart3d._updateSelectors();
    }
  }

  // ── CSV / PNG export ───────────────────────────────────────────────────────
  document.getElementById('btn-export-csv').addEventListener('click', () => {
    chart.downloadCSV(model);
  });
  document.getElementById('btn-export-png').addEventListener('click', () => {
    chart.downloadPNG();
  });

  // ── Zoom indicator ─────────────────────────────────────────────────────────
  gc.onZoomChange = scale => {
    document.getElementById('status-zoom').textContent = Math.round(scale * 100) + '%';
  };

  // ── Data table ─────────────────────────────────────────────────────────────
  const dataTableEmpty = document.getElementById('data-table-empty');
  const dataTableEl    = document.getElementById('data-table');
  const dataTableHead  = document.getElementById('data-table-head');
  const dataTableBody  = document.getElementById('data-table-body');

  function updateDataTable(times, series) {
    if (!times || times.length === 0) {
      dataTableEmpty.style.display = '';
      dataTableEl.style.display    = 'none';
      return;
    }
    const nodeArr   = [...model.nodes.values()];
    const plotNodes = nodeArr.filter(n => n.type !== 'input');

    dataTableEmpty.style.display = 'none';
    dataTableEl.style.display    = '';

    dataTableHead.innerHTML = '<tr>' +
      ['t', ...plotNodes.map(n => n.name)].map(h => `<th>${h}</th>`).join('') +
      '</tr>';

    const MAX_ROWS = 500;
    const stride   = times.length > MAX_ROWS ? Math.ceil(times.length / MAX_ROWS) : 1;
    let rows = '';
    for (let i = 0; i < times.length; i += stride) {
      rows += '<tr><td>' + times[i].toFixed(4) + '</td>' +
        plotNodes.map(n => {
          const v = series[n.name]?.[i];
          return `<td>${v !== undefined && isFinite(v) ? Number(v).toPrecision(5) : '—'}</td>`;
        }).join('') +
        '</tr>';
    }
    dataTableBody.innerHTML = rows;
  }

  // ── Animation speed split-button ──────────────────────────────────────────
  let animSpeed = 1;

  const btnAnimSpeed   = document.getElementById('btn-animate-speed');
  const animSpeedMenu  = document.getElementById('animate-speed-menu');
  const animSpeedInput = document.getElementById('anim-speed');

  btnAnimSpeed.addEventListener('click', e => {
    const open = animSpeedMenu.style.display !== 'none';
    animSpeedMenu.style.display = open ? 'none' : 'flex';
    e.stopPropagation();
  });

  document.addEventListener('click', e => {
    if (!animSpeedMenu.contains(e.target) && e.target !== btnAnimSpeed) {
      animSpeedMenu.style.display = 'none';
    }
  });

  animSpeedInput.addEventListener('input', () => {
    const v = parseFloat(animSpeedInput.value);
    if (isFinite(v) && v > 0) animSpeed = v;
  });

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = parseFloat(btn.dataset.v);
      if (!isFinite(v)) return;
      animSpeed = v;
      animSpeedInput.value = v;
      animSpeedMenu.style.display = 'none';
    });
  });

  // ── Integrator selector ────────────────────────────────────────────────────
  const integratorSelect = document.getElementById('integrator-select');
  integratorSelect.addEventListener('change', () => {
    model.integrationMethod = integratorSelect.value;
    setStatus(`Integrator: ${integratorSelect.options[integratorSelect.selectedIndex].text}`);
  });

  // ── Tool buttons ───────────────────────────────────────────────────────────
  document.getElementById('tool-select') .addEventListener('click', () => setTool('select'));
  document.getElementById('tool-connect').addEventListener('click', () => setTool('connect'));
  document.getElementById('tool-delete') .addEventListener('click', () => setTool('delete'));
  document.getElementById('tool-draw')   .addEventListener('click', () => setTool('draw'));
  document.getElementById('tool-text')   .addEventListener('click', () => setTool('text'));

  function setTool(t) {
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    const ids = { select:'tool-select', connect:'tool-connect', delete:'tool-delete', draw:'tool-draw', text:'tool-text' };
    if (ids[t]) document.getElementById(ids[t]).classList.add('active');
    gc.setTool(t === 'draw' || t === 'text' ? 'select' : t);

    const annotationControls = document.getElementById('annotation-controls');
    if (t === 'draw' || t === 'text') {
      annotationTool = t;
      document.body.classList.toggle('draw-mode', t === 'draw');
      document.body.classList.toggle('text-mode', t === 'text');
      annotationControls.style.display = 'flex';
    } else {
      annotationTool = null;
      document.body.classList.remove('draw-mode', 'text-mode');
      annotationControls.style.display = 'none';
    }

    setStatus(
      t === 'connect' ? 'Click a source node, drag to a target node.' :
      t === 'delete'  ? 'Click a node or edge to delete it.' :
      t === 'draw'    ? 'Draw freely on the canvas.' :
      t === 'text'    ? 'Click to place a text annotation.' :
      'Select / drag nodes. Double-click canvas to add a node.'
    );
  }

  // ── Simulation state ───────────────────────────────────────────────────────
  let incTimes  = null;
  let incSeries = null;
  let animating = false;
  let animRafId = null;
  let lastSimAction = null;

  function getParams() {
    return {
      t0: parseFloat(document.getElementById('t0').value) || 0,
      t1: parseFloat(document.getElementById('t1').value) || 10,
      dt: parseFloat(document.getElementById('dt').value) || 0.1,
    };
  }

  function ensureCompiled() {
    model.integrationMethod = integratorSelect.value;
    const errors = model.compile();
    if (errors.length) {
      reportError('compile', errors);
      return false;
    }
    return true;
  }

  function initIncremental(t0) {
    model.reset(t0);
    incTimes  = [t0];
    incSeries = {};
    for (const n of model.nodes.values()) incSeries[n.name] = [n.value];
  }

  function doStep(dt) {
    const { t1 } = getParams();
    if (model._t >= t1 - dt * 0.5) return false;
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

  // ── Run all ────────────────────────────────────────────────────────────────
  function runAll() {
    if (quizMode) { _runQuiz(); return; }
    stopAnimate();
    lastSimAction = 'run';
    const { t0, t1, dt } = getParams();
    if (!ensureCompiled()) return;
    const result = model.run(t0, t1, dt);
    if (result.errors.length) { reportError('runtime', result.errors); return; }
    incTimes  = result.times;
    incSeries = result.series;
    chart.setData(result, model);
    updateDataTable(result.times, result.series);
    gc.draw();
    setStatus(`Run complete — ${result.times.length} steps [${integratorSelect.value.toUpperCase()}]`);
    statusTime.textContent = `t = ${result.times.at(-1).toFixed(3)}`;
  }

  // ── Step once ──────────────────────────────────────────────────────────────
  async function stepOnce() {
    if (stepMode) { await stepByStep(); return; }
    stopAnimate();
    const { t0, dt, t1 } = getParams();
    if (!ensureCompiled()) return;

    if (lastSimAction !== 'step' || incTimes === null) {
      initIncremental(t0);
      chart.clear();
      updateDataTable(null, null);
    }

    lastSimAction = 'step';
    const more = doStep(dt);
    updateDataTable(incTimes, incSeries);

    if (!more) {
      lastSimAction = null;
      setStatus(`Reached t₁ = ${t1} — click Step or Animate to restart.`);
    } else {
      setStatus(`Step → t = ${model._t.toFixed(3)}`);
    }
  }

  // ── Animate ────────────────────────────────────────────────────────────────
  const btnAnimate = document.getElementById('btn-animate');

  function toggleAnimate() { animating ? stopAnimate() : startAnimate(); }

  function _animButtonProgress(pct) {
    // 0% → blue-purple (#6366f1), 50% → amber (#f59e0b), 100% → emerald (#10b981)
    // Interpolate hue: 245° → 38° → 158° using two-segment HSL
    let h, s, l;
    if (pct <= 0.5) {
      const p = pct * 2;            // 0→1 over first half
      h = 245 + (38 - 245) * p;    // 245° → 38°
      s = 80 + (95 - 80) * p;
      l = 58 + (52 - 58) * p;
    } else {
      const p = (pct - 0.5) * 2;   // 0→1 over second half
      h = 38 + (158 - 38) * p;     // 38° → 158°
      s = 95 + (72 - 95) * p;
      l = 52 + (46 - 52) * p;
    }
    const bg = `hsl(${h.toFixed(0)},${s.toFixed(0)}%,${l.toFixed(0)}%)`;
    btnAnimate.style.cssText = `background:${bg};color:#fff;border-color:${bg};transition:background 0.4s ease,border-color 0.4s ease`;
    btnAnimate.textContent = `⏸ ${Math.round(pct * 100)}%`;
  }

  function startAnimate() {
    const { t0, dt } = getParams();
    if (!ensureCompiled()) return;

    initIncremental(t0);
    chart.clear();
    updateDataTable(null, null);

    lastSimAction = 'animate';
    animating = true;
    _animButtonProgress(0);

    const { t1 } = getParams();
    const MAX_STEPS_PER_FRAME = 2000;
    let debt = 0, lastTs = null;

    function tick(now) {
      if (!animating) return;
      const realElapsed = lastTs === null ? 0 : (now - lastTs) / 1000;
      lastTs = now;
      debt += realElapsed * animSpeed;

      let stepsThisFrame = 0;
      while (debt >= dt && animating && stepsThisFrame < MAX_STEPS_PER_FRAME) {
        const more = doStep(dt);
        debt -= dt;
        stepsThisFrame++;
        if (!more) {
          stopAnimate();
          updateDataTable(incTimes, incSeries);
          setStatus('Animation complete.');
          lastSimAction = null;
          return;
        }
      }
      if (stepsThisFrame > 0) {
        const pct = Math.min(1, (model._t - t0) / (t1 - t0));
        _animButtonProgress(pct);
        setStatus(`Animating… t = ${model._t.toFixed(3)}`);
        // Feed sparklines and phase trail
        gc.pushSparklineSample();
        _updateTrail();
      }
      animRafId = requestAnimationFrame(tick);
    }
    animRafId = requestAnimationFrame(tick);
  }

  function stopAnimate() {
    animating = false;
    if (animRafId) { cancelAnimationFrame(animRafId); animRafId = null; }
    btnAnimate.textContent   = '▶ Animate';
    btnAnimate.style.cssText = 'transition:background 0.5s ease,border-color 0.5s ease';
    setTimeout(() => { if (!animating) btnAnimate.style.cssText = ''; }, 520);
    if (incTimes !== null) updateDataTable(incTimes, incSeries);
  }

  // ── Trail / sparkline helpers ──────────────────────────────────────────────
  const chkTrail = document.getElementById('chk-trail'); // off by default

  function _updateTrail() {
    if (!incSeries) return;
    if (!chkTrail || !chkTrail.checked) { gc.clearTrail(); return; }
    // Pick first two state nodes for the trail X/Y
    const stateNodes = [...model.nodes.values()].filter(n => n.type === 'state');
    if (stateNodes.length >= 2) {
      gc.setTrailData(incSeries, stateNodes[0].name, stateNodes[1].name);
    }
  }

  function _clearOverlays() {
    gc.clearSparklines();
    gc.clearTrail();
  }

  // ── Auto-layout ────────────────────────────────────────────────────────────
  document.getElementById('btn-auto-layout')?.addEventListener('click', () => {
    pushUndoSnapshot();
    gc.autoLayout();
    setStatus('Auto-layout applied.');
  });

  // ── Reset ──────────────────────────────────────────────────────────────────
  function resetSim() {
    stopAnimate();
    _clearOverlays();
    lastSimAction = 'reset';
    const { t0 } = getParams();
    model.reset(t0);
    incTimes = incSeries = null;
    sliderPanel.syncValues();
    chart.clear();
    updateDataTable(null, null);
    gc.draw();
    statusTime.textContent = '';
    setStatus('Reset. Press ▶ Animate, ⏭ Step, or ⚡ Run all.');
  }

  document.getElementById('btn-run')    .addEventListener('click', runAll);
  document.getElementById('btn-animate').addEventListener('click', toggleAnimate);
  document.getElementById('btn-step')   .addEventListener('click', stepOnce);
  document.getElementById('btn-reset')  .addEventListener('click', resetSim);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  const btnConnect = document.getElementById('tool-connect');
  let _toolBeforeCtrl = null;

  // Task 4: copy/paste clipboard
  let clipboard = null;

  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    const isMeta = e.metaKey || e.ctrlKey;

    // Undo / redo
    if (isMeta && e.key === 'z' && !e.shiftKey) {
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      e.preventDefault(); undo(); return;
    }
    if (isMeta && (e.key === 'Z' || (e.key === 'z' && e.shiftKey) || e.key === 'y')) {
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      e.preventDefault(); redo(); return;
    }

    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    // Task 4: Copy (Ctrl+C) — single or multi
    if (isMeta && e.key === 'c') {
      if (gc.selectedIds && gc.selectedIds.size > 1) {
        gc.copyNodes(gc.selectedIds);
        const names = [...gc.selectedIds].map(id => model.nodes.get(id)?.name).filter(Boolean);
        setStatus(`Copied ${names.length} nodes: ${names.join(', ')}`);
        e.preventDefault();
        return;
      }
      if (gc.selected !== null) {
        gc.copyNode(gc.selected);
        setStatus(`Copied "${model.nodes.get(gc.selected)?.name}"`);
        e.preventDefault();
        return;
      }
    }

    // Task 4: Cut (Ctrl+X)
    if (isMeta && e.key === 'x' && gc.selected !== null) {
      const copied = gc.copyNode(gc.selected);
      if (copied) {
        pushUndoSnapshot();
        const id = gc.selected;
        gc.selected = null;
        onNodeSelect(null);
        model.removeNode(id);
        sliderPanel.refresh();
        gc.draw();
        setStatus(`Cut "${copied.name}"`);
      }
      e.preventDefault();
      return;
    }

    // Task 4: Paste (Ctrl+V) — works for single and multi (with edges)
    if (isMeta && e.key === 'v' && gc.clipboard && gc.clipboard.nodes && gc.clipboard.nodes.length) {
      pushUndoSnapshot();
      const result = gc.pasteNode();
      sliderPanel.refresh();
      if (Array.isArray(result)) {
        setStatus(`Pasted ${result.length} nodes.`);
      } else if (result) {
        setStatus(`Pasted "${result.name}"`);
      }
      e.preventDefault();
      return;
    }

    // Ctrl/Cmd held alone — switch to Connect tool
    if ((e.key === 'Control' || e.key === 'Meta') && !_toolBeforeCtrl) {
      _toolBeforeCtrl = gc.tool;
      setTool('connect');
      btnConnect.style.outline = '2px solid var(--accent)';
      btnConnect.style.outlineOffset = '2px';
      return;
    }

    // Backspace / Delete — remove selected node(s)
    if (e.key === 'Backspace' || e.key === 'Delete') {
      // Multi-selection delete
      if (gc.selectedIds && gc.selectedIds.size > 1) {
        e.preventDefault();
        pushUndoSnapshot();
        const count = gc.selectedIds.size;
        for (const id of [...gc.selectedIds]) model.removeNode(id);
        gc.selectedIds.clear();
        gc.selected = null;
        onNodeSelect(null);
        sliderPanel.refresh();
        gc.draw();
        setStatus(`Deleted ${count} nodes.`);
        return;
      }
      // Single selection delete
      if (gc.selected !== null) {
        e.preventDefault();
        pushUndoSnapshot();
        const id = gc.selected;
        gc.selected = null;
        onNodeSelect(null);
        model.removeNode(id);
        sliderPanel.refresh();
        gc.draw();
        setStatus('Node deleted.');
        return;
      }
    }

    // R — Run all
    if (e.key === 'r' && !isMeta) { runAll(); return; }
    // Space — toggle animate
    if (e.key === ' ') { e.preventDefault(); toggleAnimate(); return; }
    // S — step
    if (e.key === 's' && !isMeta) { stepOnce(); return; }
    // Escape — select tool / deselect / clear highlights
    if (e.key === 'Escape') {
      setTool('select');
      gc.selected = null;
      onNodeSelect(null);
      gc.highlightMap.clear();
      gc.draw();
      hideCtxMenu();
      return;
    }

    // Zoom shortcuts
    if (e.key === '0' && !isMeta) { gc.resetZoom(); return; }
    if (e.key === 'f' && !isMeta) { gc.fitToScreen(); return; }
    if (e.key === 'l' && !isMeta) { pushUndoSnapshot(); gc.autoLayout(); setStatus('Auto-layout applied.'); return; }
    if ((e.key === '+' || e.key === '=') && !isMeta) {
      const canvas = document.getElementById('graph-canvas');
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const factor = 1.2;
      const newScale = Math.min(gc._tx.scale * factor, 12);
      gc._tx.ox = cx - (cx - gc._tx.ox) * (newScale / gc._tx.scale);
      gc._tx.oy = cy - (cy - gc._tx.oy) * (newScale / gc._tx.scale);
      gc._tx.scale = newScale;
      gc.draw();
      if (gc.onZoomChange) gc.onZoomChange(newScale);
      return;
    }
    if (e.key === '-' && !isMeta) {
      const canvas = document.getElementById('graph-canvas');
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const factor = 1 / 1.2;
      const newScale = Math.max(gc._tx.scale * factor, 0.08);
      gc._tx.ox = cx - (cx - gc._tx.ox) * (newScale / gc._tx.scale);
      gc._tx.oy = cy - (cy - gc._tx.oy) * (newScale / gc._tx.scale);
      gc._tx.scale = newScale;
      gc.draw();
      if (gc.onZoomChange) gc.onZoomChange(newScale);
      return;
    }
  });

  document.addEventListener('keyup', e => {
    if ((e.key === 'Control' || e.key === 'Meta') && _toolBeforeCtrl !== null) {
      setTool(_toolBeforeCtrl);
      btnConnect.style.outline = '';
      btnConnect.style.outlineOffset = '';
      _toolBeforeCtrl = null;
    }
  });

  // ── Node editor ────────────────────────────────────────────────────────────
  const nfName     = document.getElementById('nf-name');
  const nfType     = document.getElementById('nf-type');
  const nfExpr     = document.getElementById('nf-expr');
  const nfDerivRow = document.getElementById('nf-deriv-row');
  const nfDeriv    = document.getElementById('nf-deriv');
  const nfInit     = document.getElementById('nf-init');
  const nfSmin     = document.getElementById('nf-smin');
  const nfSmax     = document.getElementById('nf-smax');
  const nfSstep    = document.getElementById('nf-sstep');
  const nfUnit     = document.getElementById('nf-unit');
  const nfDesc     = document.getElementById('nf-desc');
  const nfError    = document.getElementById('nf-error');
  let selectedNodeId = null;

  function updateNodeFormVisibility(type) {
    const isInput = type === 'input';
    const isState = type === 'state';
    const isText  = type === 'text';  // Task 7
    document.getElementById('nf-expr-row')       .style.display = (isInput || isText) ? 'none' : 'flex';
    nfDerivRow                                     .style.display = isState ? 'flex' : 'none';
    document.getElementById('nf-slider-section')  .style.display = isInput ? 'flex' : 'none';
    document.getElementById('nf-slider-max-row')  .style.display = isInput ? 'flex' : 'none';
    document.getElementById('nf-slider-step-row') .style.display = isInput ? 'flex' : 'none';
  }
  nfType.addEventListener('change', () => {
    updateNodeFormVisibility(nfType.value);
    if (selectedNodeId !== null) {
      const node = model.nodes.get(selectedNodeId);
      if (node) {
        node.type = nfType.value;
        sliderPanel.refresh();
        gc.draw();
      }
    }
  });

  function onNodeSelect(node) {
    selectedNodeId = node ? node.id : null;
    const form  = document.getElementById('node-form');
    const noSel = document.getElementById('no-selection');
    if (!node) { form.style.display = 'none'; noSel.style.display = ''; return; }
    // Auto-restore node editor if it was minimized
    if (typeof window._isPanelMinimized === 'function' && window._isPanelMinimized('node-editor')) {
      if (typeof window._restorePanel === 'function') window._restorePanel('node-editor');
    }
    form.style.display = 'flex';
    noSel.style.display = 'none';
    nfName.value    = node.name;
    nfType.value    = node.type;
    nfExpr.value    = node.expr;
    nfDeriv.checked = node.derivMode ?? false;
    nfInit.value    = node.initVal;
    nfSmin.value    = node.sliderMin  ?? '';
    nfSmax.value    = node.sliderMax  ?? '';
    nfSstep.value   = node.sliderStep ?? '';
    nfUnit.value    = node.unit;
    nfDesc.value    = node.desc;
    nfError.textContent = '';
    updateNodeFormVisibility(node.type);
  }

  document.getElementById('nf-apply').addEventListener('click', () => {
    if (selectedNodeId === null) return;
    const node = model.nodes.get(selectedNodeId);
    if (!node) return;

    const newName = nfName.value.trim();
    if (!newName) { nfError.textContent = 'Name required'; return; }
    for (const n of model.nodes.values()) {
      if (n.id !== selectedNodeId && n.name === newName) {
        nfError.textContent = 'Name already used'; return;
      }
    }

    pushUndoSnapshot();

    node.name      = newName;
    node.type      = nfType.value;
    node.expr      = nfExpr.value.trim();
    node.derivMode = nfDeriv.checked;
    node.initVal   = parseFloat(nfInit.value) || 0;
    node.value     = node.initVal;
    node.sliderMin  = nfSmin.value  !== '' ? parseFloat(nfSmin.value)  : undefined;
    node.sliderMax  = nfSmax.value  !== '' ? parseFloat(nfSmax.value)  : undefined;
    node.sliderStep = nfSstep.value !== '' ? parseFloat(nfSstep.value) : undefined;
    node.unit       = nfUnit.value.trim();
    node.desc       = nfDesc.value.trim();
    nfError.textContent = '';

    if (node.type !== 'input' && node.type !== 'text') {
      const nodeNames = [...model.nodes.values()].map(n => n.name);
      const err = node.compile(nodeNames, model._scope);
      if (err) { nfError.textContent = 'Expression error: ' + err; }
    }

    sliderPanel.refresh();
    gc.draw();
    setStatus(`Node "${node.name}" updated`);

    // Task 8: update document title if metadata has a title
    _syncDocTitle();
  });

  // ── Examples ───────────────────────────────────────────────────────────────
  document.getElementById('example-select').addEventListener('change', function () {
    const key = this.value;
    if (!key || !EXAMPLES[key]) return;
    stopAnimate();
    pushUndoSnapshot();
    lastSimAction = null;
    const ex = EXAMPLES[key];
    model.fromJSON(ex);
    if (ex.integrationMethod) {
      model.integrationMethod = ex.integrationMethod;
      integratorSelect.value  = ex.integrationMethod;
    } else {
      model.integrationMethod = integratorSelect.value;
    }
    const sp = ex.simParams;
    if (sp) {
      if (sp.t0 != null) document.getElementById('t0').value = sp.t0;
      if (sp.t1 != null) document.getElementById('t1').value = sp.t1;
      if (sp.dt != null) document.getElementById('dt').value = sp.dt;
    }
    onNodeSelect(null);
    sliderPanel.refresh();
    chart.clear();
    updateDataTable(null, null);
    incTimes = incSeries = null;
    statusTime.textContent = '';
    _clearOverlays();
    gc.fitToScreen();
    if (analysisPanel) analysisPanel.refresh();
    _syncDocTitle();
    setStatus(`Loaded: ${this.options[this.selectedIndex].text} — press ▶ Animate or ⚡ Run all.`);
    // Close the file dropdown
    document.getElementById('file-dropdown').style.display = 'none';
    document.getElementById('dm-example-sub').style.display = 'none';
    this.value = '';
  });

  // ── Save / Load ────────────────────────────────────────────────────────────
  function saveJSON() {
    const blob = new Blob([JSON.stringify(model.toJSON(), null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob), download: 'stgraph-model.json',
    });
    a.click(); URL.revokeObjectURL(a.href);
  }

  function loadJSONFile() {
    document.getElementById('file-input').click();
  }

  document.getElementById('file-input').addEventListener('change', function () {
    if (!this.files[0]) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        stopAnimate();
        pushUndoSnapshot();
        lastSimAction = null;
        model.fromJSON(JSON.parse(ev.target.result));
        onNodeSelect(null);
        sliderPanel.refresh();
        chart.clear();
        updateDataTable(null, null);
        incTimes = incSeries = null;
        gc.fitToScreen();
        if (analysisPanel) analysisPanel.refresh();
        _syncDocTitle();
        setStatus('Model loaded.');
      } catch (err) {
        reportError('load', [err.message]);
      }
    };
    reader.readAsText(this.files[0]);
    this.value = '';
  });

  // ── Share via URL hash ─────────────────────────────────────────────────────
  const shareMenu   = document.getElementById('share-menu');
  const shareUrlEl  = document.getElementById('share-url');
  const btnCopyUrl  = document.getElementById('btn-copy-url');
  const shareSizeWarn = document.getElementById('share-size-warn');

  function encodeModel(json) {
    const str = JSON.stringify(json);
    return btoa(unescape(encodeURIComponent(str)));
  }

  function decodeModel(b64) {
    return JSON.parse(decodeURIComponent(escape(atob(b64))));
  }

  function buildShareUrl() {
    const encoded = encodeModel(model.toJSON());
    const url = `${location.origin}${location.pathname}#model=${encoded}`;
    shareUrlEl.value = url;
    shareSizeWarn.style.display = url.length > 8192 ? '' : 'none';
  }

  function openSharePanel() {
    buildShareUrl();
    shareMenu.style.display = shareMenu.style.display !== 'none' ? 'none' : 'flex';
    if (shareMenu.style.display !== 'none') { shareUrlEl.focus(); shareUrlEl.select(); }
  }

  btnCopyUrl.addEventListener('click', () => {
    navigator.clipboard.writeText(shareUrlEl.value).then(() => {
      btnCopyUrl.textContent = '✓ Copied';
      setTimeout(() => { btnCopyUrl.textContent = 'Copy'; }, 2000);
    });
  });

  document.addEventListener('click', e => {
    if (!shareMenu.contains(e.target)) {
      shareMenu.style.display = 'none';
    }
  });

  // ── Embed mode ─────────────────────────────────────────────────────────────
  if (new URLSearchParams(location.search).get('embed') === '1') {
    document.body.classList.add('embed');
  }

  // ── Load model from URL hash ───────────────────────────────────────────────
  function loadFromHash() {
    const hash = location.hash.slice(1);
    if (!hash.startsWith('model=')) return false;
    try {
      const json = decodeModel(hash.slice(6));
      model.fromJSON(json);
      onNodeSelect(null);
      sliderPanel.refresh();
      chart.clear();
      updateDataTable(null, null);
      incTimes = incSeries = null;
      gc.fitToScreen();
      _syncDocTitle();
      setStatus('Model loaded from share link.');
      return true;
    } catch (err) {
      reportError('load', ['Invalid share link: ' + err.message]);
      return false;
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ── Task 2: Dropdown menus ────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════

  // Generic dropdown toggle helper
  function wireDropdown(btnId, menuId) {
    const btn  = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    if (!btn || !menu) return;
    btn.addEventListener('click', e => {
      const open = menu.style.display !== 'none';
      // Close all other dropdowns first
      document.querySelectorAll('.dropdown-menu').forEach(m => { m.style.display = 'none'; });
      menu.style.display = open ? 'none' : 'block';
      e.stopPropagation();
    });
  }
  wireDropdown('btn-file-menu',  'file-dropdown');
  wireDropdown('btn-tools-menu', 'tools-dropdown');

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => { m.style.display = 'none'; });
  });
  // Prevent menu clicks from bubbling to document
  document.getElementById('file-dropdown') .addEventListener('click', e => e.stopPropagation());
  document.getElementById('tools-dropdown').addEventListener('click', e => e.stopPropagation());

  // ── File menu items ────────────────────────────────────────────────────────
  document.getElementById('dm-example-trigger').addEventListener('click', () => {
    const sub = document.getElementById('dm-example-sub');
    sub.style.display = sub.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('dm-save').addEventListener('click', () => {
    saveJSON();
    document.getElementById('file-dropdown').style.display = 'none';
  });

  document.getElementById('dm-load').addEventListener('click', () => {
    loadJSONFile();
    document.getElementById('file-dropdown').style.display = 'none';
  });

  document.getElementById('dm-share').addEventListener('click', () => {
    document.getElementById('file-dropdown').style.display = 'none';
    openSharePanel();
  });

  // Task 1: Diff Models button + active state
  let diffOpen = false;
  const diffPanelEl = document.getElementById('modeldiff-panel');
  const diffCtnr    = document.getElementById('modeldiff-container');
  let modelDiff     = null;
  const dmDiff      = document.getElementById('dm-diff');

  dmDiff.addEventListener('click', () => {
    diffOpen = !diffOpen;
    diffPanelEl.style.display = diffOpen ? '' : 'none';
    dmDiff.classList.toggle('active', diffOpen);
    if (diffOpen && !modelDiff) {
      modelDiff = new ModelDiff(diffCtnr);
    }
    document.getElementById('file-dropdown').style.display = 'none';
  });

  // Task 8: Model Info
  const modelInfoDialog = document.getElementById('model-info-dialog');
  document.getElementById('dm-model-info').addEventListener('click', () => {
    document.getElementById('file-dropdown').style.display = 'none';
    _openModelInfo();
  });

  function _openModelInfo() {
    const m = model.metadata || {};
    document.getElementById('mi-title').value       = m.title       || '';
    document.getElementById('mi-author').value      = m.author      || '';
    document.getElementById('mi-version').value     = m.version     || '';
    document.getElementById('mi-tags').value        = m.tags        || '';
    document.getElementById('mi-description').value = m.description || '';
    modelInfoDialog.style.display = 'flex';
  }

  document.getElementById('mi-save').addEventListener('click', () => {
    model.metadata = {
      title:       document.getElementById('mi-title').value.trim(),
      author:      document.getElementById('mi-author').value.trim(),
      version:     document.getElementById('mi-version').value.trim(),
      tags:        document.getElementById('mi-tags').value.trim(),
      description: document.getElementById('mi-description').value.trim(),
    };
    _syncDocTitle();
    modelInfoDialog.style.display = 'none';
    setStatus('Model metadata saved.');
  });

  function _syncDocTitle() { _sync3dModel();
    const title = model.metadata && model.metadata.title;
    document.title = title ? `${title} — LuminaGraph` : 'LuminaGraph';
  }

  // ── Tools menu items ───────────────────────────────────────────────────────

  // Minimap toggle
  const minimapCanvas = document.getElementById('minimap-canvas');
  const minimap = new Minimap(minimapCanvas, gc);
  gc.onDraw = () => minimap.draw();
  let minimapVisible = true;
  const dmMinimap = document.getElementById('dm-minimap');
  dmMinimap.classList.add('active');

  dmMinimap.addEventListener('click', () => {
    minimapVisible = !minimapVisible;
    minimap.setVisible(minimapVisible);
    dmMinimap.classList.toggle('active', minimapVisible);
    // keep menu open
  });

  // Task 3: Console, Functions, Analysis — open as floating windows
  const consolePanelEl  = document.getElementById('console-panel');
  const fnlibPanelEl    = document.getElementById('fnlib-panel');
  const analysisPanelEl = document.getElementById('analysis-panel');

  const consoleCtnr    = document.getElementById('console-container');
  const fnlibCtnr      = document.getElementById('fnlib-container');
  const analysisCtnr   = document.getElementById('analysis-container');

  function getConsoleEnv() {
    const env = { t: model._t, dt: parseFloat(document.getElementById('dt').value) || 0.1 };
    for (const n of model.nodes.values()) env[n.name] = n.value;
    return env;
  }

  const consolePanel = new ConsolePanel(consoleCtnr, getConsoleEnv);
  const fnLib        = new FunctionLibrary(fnlibCtnr, model._scope);
  let analysisPanel  = null;

  const dmConsole    = document.getElementById('dm-console');
  const dmFnlib      = document.getElementById('dm-fnlib');
  const dmAnalysis   = document.getElementById('dm-analysis');
  const dmNodeEditor = document.getElementById('dm-nodeeditor');
  const dmParameters = document.getElementById('dm-parameters');
  const dmDatatable  = document.getElementById('dm-datatable');

  // Helper: sync a dm item's active class to whether the panel is visible
  function syncDmActive(dmEl, panelId) {
    if (!dmEl) return;
    const p = document.getElementById(panelId);
    if (!p) return;
    const visible = p.style.display !== 'none';
    const minimized = typeof window._isPanelMinimized === 'function' && window._isPanelMinimized(panelId);
    dmEl.classList.toggle('active', visible && !minimized);
  }

  // Expose so the genie/minimize script can call it after close/minimize
  window._syncDmActive = syncDmActive;

  // Right-panel card toggles (show/hide from panel)
  function toggleRightCard(panelId, dmEl) {
    const p = document.getElementById(panelId);
    if (!p) return;
    const isHidden   = p.style.display === 'none';
    const isMinimized = typeof window._isPanelMinimized === 'function' && window._isPanelMinimized(panelId);
    if (isMinimized) {
      // Restore from tray
      if (typeof window._restorePanel === 'function') window._restorePanel(panelId);
      if (dmEl) dmEl.classList.add('active');
    } else if (isHidden) {
      p.style.display = '';
      if (dmEl) dmEl.classList.add('active');
    } else {
      // Hide it
      if (typeof window._closePanelFully === 'function') {
        window._closePanelFully(panelId);
      } else {
        p.style.display = 'none';
      }
      if (dmEl) dmEl.classList.remove('active');
    }
  }

  if (dmNodeEditor) dmNodeEditor.addEventListener('click', () => toggleRightCard('node-editor',     dmNodeEditor));
  if (dmParameters) dmParameters.addEventListener('click', () => toggleRightCard('slider-panel',   dmParameters));
  if (dmDatatable)  dmDatatable.addEventListener('click',  () => toggleRightCard('data-table-panel', dmDatatable));

  dmConsole.addEventListener('click', () => {
    const visible = consolePanelEl.style.display !== 'none';
    consolePanelEl.style.display = visible ? 'none' : 'flex';
    dmConsole.classList.toggle('active', !visible);
  });

  dmFnlib.addEventListener('click', () => {
    const visible = fnlibPanelEl.style.display !== 'none';
    fnlibPanelEl.style.display = visible ? 'none' : 'flex';
    dmFnlib.classList.toggle('active', !visible);
  });

  dmAnalysis.addEventListener('click', () => {
    const visible = analysisPanelEl.style.display !== 'none';
    analysisPanelEl.style.display = visible ? 'none' : 'flex';
    dmAnalysis.classList.toggle('active', !visible);
    if (!visible && !analysisPanel) {
      analysisPanel = new AnalysisPanel(analysisCtnr, model, getParams, chart);
    }
  });

  // Step mode
  let stepMode   = false;
  const dmStepMode = document.getElementById('dm-stepmode');

  dmStepMode.addEventListener('click', () => {
    stepMode = !stepMode;
    dmStepMode.classList.toggle('active', stepMode);
    setStatus(stepMode ? 'Step mode ON — press ⏭ Step to evaluate node-by-node.' : 'Step mode OFF.');
  });

  // Quiz mode
  let quizMode = false;
  const dmQuiz = document.getElementById('dm-quiz');

  dmQuiz.addEventListener('click', () => {
    quizMode = !quizMode;
    gc.quizMode = quizMode;
    gc.draw();
    dmQuiz.classList.toggle('active', quizMode);
    setStatus(quizMode ? 'Quiz mode ON — press ⚡ Run to see a prediction challenge.' : 'Quiz mode OFF.');
  });

  // ── Search / filter ────────────────────────────────────────────────────────
  const nodeSearch     = document.getElementById('node-search');
  nodeSearch.addEventListener('input', () => {
    gc.searchQuery = nodeSearch.value;
    gc.draw();
  });
  // Clear search on Escape
  nodeSearch.addEventListener('keydown', e => {
    if (e.key === 'Escape') { nodeSearch.value = ''; gc.searchQuery = ''; gc.draw(); }
  });

  // ── Step-by-step mode ──────────────────────────────────────────────────────
  async function stepByStep() {
    stopAnimate();
    const { t0, dt, t1 } = getParams();
    if (!ensureCompiled()) return;

    if (lastSimAction !== 'step' || incTimes === null) {
      initIncremental(t0);
      chart.clear();
      updateDataTable(null, null);
    }
    lastSimAction = 'step';

    if (model._t >= t1 - dt * 0.5) {
      setStatus(`Reached t₁ = ${t1}`);
      return;
    }

    await model.stepWithCallback(dt, async (node, value) => {
      gc.stepHighlight = { nodeId: node.id, label: Number(value).toPrecision(4) };
      gc.draw();
      await new Promise(r => setTimeout(r, 300));
    });

    gc.stepHighlight = null;

    incTimes.push(model._t);
    for (const n of model.nodes.values()) {
      if (!incSeries[n.name]) incSeries[n.name] = [];
      incSeries[n.name].push(n.value);
    }
    chart.setData({ times: incTimes, series: incSeries }, model);
    gc.draw();
    statusTime.textContent = `t = ${model._t.toFixed(3)}`;
    updateDataTable(incTimes, incSeries);
    setStatus(`Step-by-step → t = ${model._t.toFixed(3)}`);
  }

  // ── Quiz mode ──────────────────────────────────────────────────────────────
  const quizModal    = document.getElementById('quiz-modal');
  const quizQuestion = document.getElementById('quiz-question');
  const quizButtons  = document.getElementById('quiz-buttons');
  const quizFeedback = document.getElementById('quiz-feedback');
  const quizContinue = document.getElementById('quiz-continue');

  function _runQuiz() {
    stopAnimate();
    lastSimAction = 'run';
    const { t0, t1, dt } = getParams();
    if (!ensureCompiled()) return;

    const stateNodes = [...model.nodes.values()].filter(n => n.type === 'state');
    if (stateNodes.length === 0) { runAll(); return; }

    const nodeNames = stateNodes.map(n => n.name).join(', ');
    quizQuestion.textContent = `Predict the behavior of: ${nodeNames} over [${t0}, ${t1}]`;
    quizFeedback.textContent = '';
    quizContinue.style.display = 'none';

    const options = ['Increases', 'Decreases', 'Oscillates', 'Stays constant'];
    quizButtons.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.addEventListener('click', () => _quizAnswer(opt, t0, t1, dt, stateNodes));
      quizButtons.appendChild(btn);
    });

    quizModal.classList.add('active');
    quizModal.style.display = 'flex';
  }

  function _quizAnswer(answer, t0, t1, dt, stateNodes) {
    const result = model.run(t0, t1, dt);
    if (result.errors.length) { quizModal.classList.remove('active'); quizModal.style.display = 'none'; reportError('runtime', result.errors); return; }

    incTimes  = result.times;
    incSeries = result.series;

    let actual = 'Stays constant';
    for (const n of stateNodes) {
      const vals = result.series[n.name];
      if (!vals || vals.length < 2) continue;
      const first = vals[0], last = vals[vals.length - 1];
      const range = Math.max(...vals) - Math.min(...vals);
      const mid   = vals[Math.floor(vals.length / 2)];
      if (range < 1e-6) { actual = 'Stays constant'; }
      else if (last > first + range * 0.1 && mid > first) { actual = 'Increases'; }
      else if (last < first - range * 0.1 && mid < first) { actual = 'Decreases'; }
      else { actual = 'Oscillates'; }
      break;
    }

    const correct = answer === actual;
    quizFeedback.style.color = correct ? 'var(--green)' : 'var(--red)';
    quizFeedback.textContent = correct
      ? `✓ Correct! The system ${actual.toLowerCase()}.`
      : `✗ Incorrect. It actually ${actual.toLowerCase()}.`;

    quizButtons.querySelectorAll('button').forEach(b => b.disabled = true);
    quizContinue.style.display = '';
  }

  quizContinue.addEventListener('click', () => {
    quizModal.classList.remove('active');
    quizModal.style.display = 'none';
    chart.setData({ times: incTimes, series: incSeries }, model);
    updateDataTable(incTimes, incSeries);
    gc.draw();
    statusTime.textContent = `t = ${(incTimes || []).at(-1)?.toFixed(3) || ''}`;
    setStatus('Quiz complete. Actual simulation shown.');
  });

  // ── Annotation layer ───────────────────────────────────────────────────────
  const annotationCanvas = document.getElementById('annotation-canvas');
  const annCtx           = annotationCanvas.getContext('2d');
  let annotations        = [];
  let annotationTool     = null;
  let annDrawing         = false;
  let annCurrentPath     = null;

  function resizeAnnotationCanvas() {
    const wrap = annotationCanvas.parentElement;
    annotationCanvas.width  = wrap.clientWidth;
    annotationCanvas.height = wrap.clientHeight;
    redrawAnnotations();
  }
  window.addEventListener('resize', resizeAnnotationCanvas);

  function redrawAnnotations() {
    annCtx.clearRect(0, 0, annotationCanvas.width, annotationCanvas.height);
    for (const ann of annotations) {
      if (ann.type === 'path') {
        annCtx.strokeStyle = ann.color;
        annCtx.lineWidth   = ann.lineWidth;
        annCtx.lineJoin    = 'round';
        annCtx.lineCap     = 'round';
        annCtx.beginPath();
        let started = false;
        for (const [px, py] of ann.points) {
          started ? annCtx.lineTo(px, py) : annCtx.moveTo(px, py);
          started = true;
        }
        annCtx.stroke();
      } else if (ann.type === 'text') {
        annCtx.fillStyle = ann.color;
        annCtx.font      = `${ann.lineWidth * 5 + 10}px sans-serif`;
        annCtx.fillText(ann.text, ann.x, ann.y);
      }
    }
  }

  function annPos(e) {
    const r = annotationCanvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }

  annotationCanvas.addEventListener('mousedown', e => {
    if (!annotationTool) return;
    if (annotationTool === 'draw') {
      annDrawing = true;
      const pt = annPos(e);
      annCurrentPath = {
        type: 'path', points: [pt],
        color:     document.getElementById('ann-color').value,
        lineWidth: parseInt(document.getElementById('ann-width').value, 10) || 2,
      };
    } else if (annotationTool === 'text') {
      const [x, y] = annPos(e);
      const text = prompt('Enter annotation text:');
      if (text) {
        annotations.push({
          type: 'text', text, x, y,
          color:     document.getElementById('ann-color').value,
          lineWidth: parseInt(document.getElementById('ann-width').value, 10) || 2,
        });
        redrawAnnotations();
      }
    }
  });

  annotationCanvas.addEventListener('mousemove', e => {
    if (!annDrawing || !annCurrentPath) return;
    annCurrentPath.points.push(annPos(e));
    redrawAnnotations();
    annCtx.strokeStyle = annCurrentPath.color;
    annCtx.lineWidth   = annCurrentPath.lineWidth;
    annCtx.lineJoin    = 'round';
    annCtx.lineCap     = 'round';
    annCtx.beginPath();
    let started = false;
    for (const [px, py] of annCurrentPath.points) {
      started ? annCtx.lineTo(px, py) : annCtx.moveTo(px, py);
      started = true;
    }
    annCtx.stroke();
  });

  annotationCanvas.addEventListener('mouseup', () => {
    if (annDrawing && annCurrentPath) {
      annotations.push(annCurrentPath);
      annCurrentPath = null;
      annDrawing = false;
      redrawAnnotations();
    }
  });

  annotationCanvas.addEventListener('mouseleave', () => {
    if (annDrawing && annCurrentPath) {
      annotations.push(annCurrentPath);
      annCurrentPath = null;
      annDrawing = false;
      redrawAnnotations();
    }
  });

  document.getElementById('btn-ann-clear').addEventListener('click', () => {
    annotations = [];
    redrawAnnotations();
  });

  // ════════════════════════════════════════════════════════════════════════════
  // ── Task 5: Right-click context menu ─────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════

  const ctxMenu = document.getElementById('ctx-menu');
  let ctxNodeId = null;

  function showCtxMenu(nodeId, x, y) {
    ctxNodeId = nodeId;
    ctxMenu.style.left    = x + 'px';
    ctxMenu.style.top     = y + 'px';
    ctxMenu.style.display = 'block';
  }

  function hideCtxMenu() {
    ctxMenu.style.display = 'none';
    ctxNodeId = null;
  }

  document.addEventListener('click', e => {
    if (!ctxMenu.contains(e.target)) hideCtxMenu();
  });

  gc.onContextMenu = (nodeId, screenX, screenY) => {
    // Select the node visually
    const node = model.nodes.get(nodeId);
    if (node) {
      gc.selected = nodeId;
      onNodeSelect(node);
      gc.draw();
    }
    showCtxMenu(nodeId, screenX, screenY);
  };

  document.getElementById('ctx-edit').addEventListener('click', () => {
    if (ctxNodeId !== null) {
      const node = model.nodes.get(ctxNodeId);
      if (node) {
        gc.selected = ctxNodeId;
        onNodeSelect(node);
        gc.draw();
        // Focus the node editor panel
        const nodeEditor = document.getElementById('node-editor');
        nodeEditor.scrollIntoView({ behavior: 'smooth' });
      }
    }
    hideCtxMenu();
  });

  // Task 6: Show dependencies
  document.getElementById('ctx-deps').addEventListener('click', () => {
    if (ctxNodeId !== null) showDependencies(ctxNodeId);
    hideCtxMenu();
  });

  // Task 6: Show loops
  document.getElementById('ctx-loops').addEventListener('click', () => {
    if (ctxNodeId !== null) showLoops(ctxNodeId);
    hideCtxMenu();
  });

  document.getElementById('ctx-copy').addEventListener('click', () => {
    if (ctxNodeId !== null) {
      const copied = gc.copyNode(ctxNodeId);
      if (copied) {
        clipboard = copied;
        setStatus(`Copied "${copied.name}"`);
      }
    }
    hideCtxMenu();
  });

  document.getElementById('ctx-cut').addEventListener('click', () => {
    if (ctxNodeId !== null) {
      const copied = gc.copyNode(ctxNodeId);
      if (copied) {
        clipboard = copied;
        pushUndoSnapshot();
        gc.selected = null;
        onNodeSelect(null);
        model.removeNode(ctxNodeId);
        sliderPanel.refresh();
        gc.draw();
        setStatus(`Cut "${copied.name}"`);
      }
    }
    hideCtxMenu();
  });

  // Task 9: Add gauge
  document.getElementById('ctx-add-gauge').addEventListener('click', () => {
    if (ctxNodeId !== null) {
      const node = model.nodes.get(ctxNodeId);
      if (node) {
        // Place gauge near the node (offset slightly)
        model.gauges.push({
          nodeId: ctxNodeId,
          x: node.x + 80,
          y: node.y - 60,
          min: 0,
          max: Math.max(1, Math.abs(node.initVal) * 2 || 10),
          radius: 45,
        });
        gc.draw();
        setStatus(`Gauge added for "${node.name}"`);
      }
    }
    hideCtxMenu();
  });

  document.getElementById('ctx-delete').addEventListener('click', () => {
    if (ctxNodeId !== null) {
      pushUndoSnapshot();
      if (gc.selected === ctxNodeId) { gc.selected = null; onNodeSelect(null); }
      model.removeNode(ctxNodeId);
      sliderPanel.refresh();
      gc.draw();
      setStatus('Node deleted.');
    }
    hideCtxMenu();
  });

  // ════════════════════════════════════════════════════════════════════════════
  // ── Task 6: Dependency analysis & loop detection ──────────────────────────
  // ════════════════════════════════════════════════════════════════════════════

  function showDependencies(nodeId) {
    gc.highlightMap.clear();

    const upstream   = findUpstream(nodeId);
    const downstream = findDownstream(nodeId);

    // Selected node: accent color
    gc.highlightMap.set(nodeId, '#4f8ef7');

    for (const id of upstream) {
      if (id !== nodeId) gc.highlightMap.set(id, '#a78bfa'); // purple = upstream
    }
    for (const id of downstream) {
      if (id !== nodeId && !upstream.has(id)) gc.highlightMap.set(id, '#3ecf8e'); // green = downstream
    }

    gc.draw();
    setStatus(`Showing dependencies for "${model.nodes.get(nodeId)?.name}". Press Esc to clear.`);
  }

  function findUpstream(startId) {
    // BFS backwards: follow edges where .to === current
    const visited = new Set();
    const queue   = [startId];
    while (queue.length > 0) {
      const current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);
      for (const e of model.edges) {
        if (e.to === current && !visited.has(e.from)) {
          queue.push(e.from);
        }
      }
    }
    return visited;
  }

  function findDownstream(startId) {
    // BFS forward: follow edges where .from === current
    const visited = new Set();
    const queue   = [startId];
    while (queue.length > 0) {
      const current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);
      for (const e of model.edges) {
        if (e.from === current && !visited.has(e.to)) {
          queue.push(e.to);
        }
      }
    }
    return visited;
  }

  function showLoops(nodeId) {
    gc.highlightMap.clear();
    const loops = findLoops(nodeId);
    if (loops.length === 0) {
      setStatus(`No feedback loops found for "${model.nodes.get(nodeId)?.name}".`);
      return;
    }
    // Highlight all nodes in any loop: orange
    for (const loop of loops) {
      for (const id of loop) {
        gc.highlightMap.set(id, '#f7a24f');
      }
    }
    // The target node in accent
    gc.highlightMap.set(nodeId, '#4f8ef7');
    gc.draw();
    setStatus(`Found ${loops.length} feedback loop(s) containing "${model.nodes.get(nodeId)?.name}". Press Esc to clear.`);
  }

  function findLoops(nodeId) {
    // DFS to find all simple cycles containing nodeId
    const loops = [];
    const path  = [];
    const onPath = new Set();

    function dfs(current) {
      if (onPath.has(current)) {
        // We've found a cycle — check if nodeId is in it
        const idx = path.indexOf(nodeId);
        if (idx !== -1) {
          // Extract the cycle from nodeId onward
          const cycle = path.slice(idx);
          loops.push([...cycle]);
        }
        return;
      }
      onPath.add(current);
      path.push(current);
      for (const e of model.edges) {
        if (e.from === current) {
          dfs(e.to);
        }
      }
      path.pop();
      onPath.delete(current);
    }

    dfs(nodeId);
    return loops;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ── Headless API ─────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════

  window.STGraphAPI = {
    getModel:  () => model.toJSON(),
    loadModel: (json) => {
      model.fromJSON(json);
      sliderPanel.refresh();
      gc.fitToScreen();
      if (analysisPanel) analysisPanel.refresh();
    },
    run:      (t0, t1, dt) => model.run(t0, t1, dt),
    getNodes: () => [...model.nodes.values()].map(n => ({ id: n.id, name: n.name, type: n.type, value: n.value })),
    step:     (dt) => model.step(dt),
    reset:    (t0) => model.reset(t0),
  };

  // ── Init ───────────────────────────────────────────────────────────────────
  const loadedFromHash = loadFromHash();
  if (!loadedFromHash) {
    const ex = EXAMPLES.lorenz;
    model.fromJSON(ex);
    if (ex.integrationMethod) {
      model.integrationMethod = ex.integrationMethod;
      integratorSelect.value  = ex.integrationMethod;
    }
    const sp = ex.simParams;
    if (sp) {
      if (sp.t0 != null) document.getElementById('t0').value = sp.t0;
      if (sp.t1 != null) document.getElementById('t1').value = sp.t1;
      if (sp.dt != null) document.getElementById('dt').value = sp.dt;
    }
  }
  sliderPanel.refresh();
  gc.fitToScreen();
  resizeAnnotationCanvas();
  _syncDocTitle();
  if (!loadedFromHash) {
    setStatus('Ready — press ▶ Animate to watch the simulation, or ⚡ Run for an instant result.');
  }

})();
