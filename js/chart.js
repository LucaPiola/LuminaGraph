// Time-series and phase-space chart renderer
class STChart {
  constructor(canvasEl, legendEl) {
    this.canvas  = canvasEl;
    this.ctx     = canvasEl.getContext('2d');
    this.legend  = legendEl;
    this._data   = null;
    this._model  = null;
    this._mode   = 'timeseries'; // 'timeseries' | 'phasespace'
    this._psX    = null; // node name for X axis in phase space
    this._psY    = null; // node name for Y axis in phase space
    this._palette = ['#4f8ef7','#3ecf8e','#f7a24f','#f7604f','#b57bff','#ff7bca','#7bffea','#ffe97b'];
    this._viz = { lineWidth: 2, showLabels: false, decimals: 3, labelEvery: 10, showDots: false };
    window.addEventListener('resize', () => this.draw());
  }

  setMode(mode) {
    this._mode = mode;
    this.draw();
  }

  setData(result, model) {
    this._data  = result;
    this._model = model;
    this._updatePhaseSelectors();
    this.draw();
  }

  updateViz(settings) {
    Object.assign(this._viz, settings);
    this.draw();
  }

  clear() {
    this._data = null;
    this._bands = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.legend.innerHTML = '';
  }

  /**
   * Draw confidence bands from Monte Carlo.
   * @param {number[]}  times
   * @param {Object}    bandsMap  – { nodeName: { mean, lo, hi } }
   */
  drawBands(times, bandsMap) {
    this._bands = { times, bandsMap };
    this.draw();
  }

  // Read a CSS custom property from the document root
  _css(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  _updatePhaseSelectors() {
    const psXEl = document.getElementById('ps-x');
    const psYEl = document.getElementById('ps-y');
    if (!psXEl || !psYEl || !this._model) return;

    const nodes = [...this._model.nodes.values()].filter(n => n.type !== 'input');
    const names = nodes.map(n => n.name);
    if (!names.length) return;

    // Rebuild options only if the node list actually changed — never replace
    // the element mid-interaction (that broke dropdown selection)
    const rebuild = (el, saved, defaultIdx) => {
      const existing = [...el.options].map(o => o.value);
      if (JSON.stringify(existing) !== JSON.stringify(names)) {
        el.innerHTML = '';
        names.forEach(name => {
          const opt = document.createElement('option');
          opt.value = name; opt.textContent = name;
          el.appendChild(opt);
        });
      }
      const target = saved && names.includes(saved) ? saved : (names[defaultIdx] || names[0]);
      el.value = target;
      return target;
    };

    this._psX = rebuild(psXEl, this._psX, 0);
    this._psY = rebuild(psYEl, this._psY, Math.min(1, names.length - 1));

    // Wire listeners exactly once using a dataset flag
    if (!psXEl.dataset.wired) {
      psXEl.dataset.wired = '1';
      psXEl.addEventListener('change', () => { this._psX = psXEl.value; this.draw(); });
    }
    if (!psYEl.dataset.wired) {
      psYEl.dataset.wired = '1';
      psYEl.addEventListener('change', () => { this._psY = psYEl.value; this.draw(); });
    }
  }

  draw() {
    if (this._mode === 'phasespace') {
      this._drawPhaseSpace();
    } else {
      this._drawTimeSeries();
    }
  }

  _drawTimeSeries() {
    if (!this._data || !this._data.times) return;
    const canvas = this.canvas;
    canvas.width  = canvas.parentElement.clientWidth - 4;
    canvas.height = Math.max(canvas.parentElement.clientHeight - 80, 120);

    const ctx = this.ctx;
    const W = canvas.width, H = canvas.height;
    const PAD = { top: 16, right: 16, bottom: 32, left: 50 };
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top  - PAD.bottom;

    ctx.clearRect(0, 0, W, H);

    const { times, series } = this._data;
    if (!times || times.length === 0) return;

    const nodeArr   = [...this._model.nodes.values()];
    const plotNodes = nodeArr.filter(n => n.type !== 'input');
    if (plotNodes.length === 0) return;

    // Global min/max Y
    let yMin = Infinity, yMax = -Infinity;
    for (const n of plotNodes) {
      const vals = series[n.name];
      if (!vals) continue;
      for (const v of vals) {
        if (isFinite(v)) { yMin = Math.min(yMin, v); yMax = Math.max(yMax, v); }
      }
    }
    if (!isFinite(yMin)) { yMin = 0; yMax = 1; }
    if (yMin === yMax)   { yMin -= 1; yMax += 1; }

    const tMin = times[0], tMax = times[times.length - 1];
    const tx = t => PAD.left + (t - tMin) / (tMax - tMin) * plotW;
    const ty = v => PAD.top  + (1 - (v - yMin) / (yMax - yMin)) * plotH;

    // Background
    ctx.fillStyle = this._css('--surface') || '#23272f';
    ctx.fillRect(0, 0, W, H);

    const borderColor = this._css('--border') || '#2a2f3a';
    const mutedColor  = this._css('--muted')  || '#6b7280';
    const textColor   = this._css('--text')   || '#d4d8e2';

    // Y grid + tick labels
    ctx.lineWidth = 1;
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const v  = yMin + (yMax - yMin) * i / yTicks;
      const py = ty(v);
      ctx.strokeStyle = borderColor;
      ctx.beginPath(); ctx.moveTo(PAD.left, py); ctx.lineTo(W - PAD.right, py); ctx.stroke();
      ctx.fillStyle = mutedColor; ctx.font = '10px monospace'; ctx.textAlign = 'right';
      ctx.fillText(v.toPrecision(3), PAD.left - 4, py + 3);
    }
    // X grid + tick labels
    const xTicks = Math.min(6, times.length - 1);
    ctx.textAlign = 'center';
    for (let i = 0; i <= xTicks; i++) {
      const t  = tMin + (tMax - tMin) * i / xTicks;
      const px = tx(t);
      ctx.strokeStyle = borderColor;
      ctx.beginPath(); ctx.moveTo(px, PAD.top); ctx.lineTo(px, H - PAD.bottom); ctx.stroke();
      ctx.fillStyle = mutedColor; ctx.font = '10px monospace';
      ctx.fillText(t.toPrecision(3), px, H - PAD.bottom + 14);
    }

    const viz = this._viz;

    // Series lines + optional dots/labels
    this.legend.innerHTML = '';
    plotNodes.forEach((n, idx) => {
      const vals = series[n.name];
      if (!vals || vals.length === 0) return;
      const color = this._palette[idx % this._palette.length];

      // Line
      ctx.strokeStyle = color;
      ctx.lineWidth   = viz.lineWidth;
      ctx.lineJoin    = 'round';
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < times.length; i++) {
        const px = tx(times[i]), py = ty(vals[i]);
        if (!isFinite(py)) { started = false; continue; }
        started ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        started = true;
      }
      ctx.stroke();

      // Dots and value labels at every N steps
      if (viz.showLabels || viz.showDots) {
        const every = Math.max(1, Math.round(viz.labelEvery));
        for (let i = 0; i < times.length; i += every) {
          const px = tx(times[i]), py = ty(vals[i]);
          if (!isFinite(py)) continue;

          if (viz.showDots) {
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = this._css('--surface') || '#23272f';
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          if (viz.showLabels) {
            const label = Number(vals[i]).toFixed(Math.max(0, Math.round(viz.decimals)));
            ctx.fillStyle = color;
            ctx.font = '9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(label, px, py - 7);
          }
        }
      }

      // Legend
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.innerHTML = `<span class="legend-dot" style="background:${color}"></span>${n.name}`;
      this.legend.appendChild(item);
    });

    ctx.fillStyle = mutedColor; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('t', W / 2, H - 2);

    // Draw Monte Carlo confidence bands if available
    if (this._bands && this._bands.times && this._bands.times.length > 0) {
      const bTimes  = this._bands.times;
      const bTMin   = bTimes[0], bTMax = bTimes[bTimes.length - 1];
      const btx     = t => PAD.left + (t - bTMin) / (bTMax - bTMin) * plotW;

      plotNodes.forEach((n, idx) => {
        const band = this._bands.bandsMap[n.name];
        if (!band) return;
        const color = this._palette[idx % this._palette.length];

        // Shaded band (lo-hi)
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < bTimes.length; i++) {
          const bpx = btx(bTimes[i]);
          const bpy = ty(band.lo[i]);
          if (!isFinite(bpy)) { started = false; continue; }
          started ? ctx.lineTo(bpx, bpy) : ctx.moveTo(bpx, bpy);
          started = true;
        }
        for (let i = bTimes.length - 1; i >= 0; i--) {
          const bpx = btx(bTimes[i]);
          const bpy = ty(band.hi[i]);
          if (!isFinite(bpy)) continue;
          ctx.lineTo(bpx, bpy);
        }
        ctx.closePath();
        ctx.fillStyle = color + '30';
        ctx.fill();

        // Mean line (dashed)
        ctx.strokeStyle = color;
        ctx.lineWidth   = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        started = false;
        for (let i = 0; i < bTimes.length; i++) {
          const bpx = btx(bTimes[i]);
          const bpy = ty(band.mean[i]);
          if (!isFinite(bpy)) { started = false; continue; }
          started ? ctx.lineTo(bpx, bpy) : ctx.moveTo(bpx, bpy);
          started = true;
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }
  }

  _drawPhaseSpace() {
    const canvas = this.canvas;
    canvas.width  = canvas.parentElement.clientWidth - 4;
    canvas.height = Math.max(canvas.parentElement.clientHeight - 80, 120);

    const ctx = this.ctx;
    const W = canvas.width, H = canvas.height;

    // Background
    ctx.fillStyle = this._css('--surface') || '#23272f';
    ctx.fillRect(0, 0, W, H);

    this.legend.innerHTML = '';

    if (!this._data || !this._data.times || this._data.times.length < 2) {
      const mutedColor = this._css('--muted') || '#6b7280';
      ctx.fillStyle = mutedColor;
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Run simulation first', W / 2, H / 2);
      return;
    }

    const { times, series } = this._data;
    const xName = this._psX;
    const yName = this._psY;
    const xVals = series[xName];
    const yVals = series[yName];

    if (!xVals || !yVals || xVals.length < 2) {
      const mutedColor = this._css('--muted') || '#6b7280';
      ctx.fillStyle = mutedColor;
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Run simulation first', W / 2, H / 2);
      return;
    }

    const PAD = { top: 24, right: 24, bottom: 48, left: 56 };
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top  - PAD.bottom;

    let xMin = Infinity, xMax = -Infinity;
    let yMin = Infinity, yMax = -Infinity;
    for (let i = 0; i < xVals.length; i++) {
      if (isFinite(xVals[i])) { xMin = Math.min(xMin, xVals[i]); xMax = Math.max(xMax, xVals[i]); }
      if (isFinite(yVals[i])) { yMin = Math.min(yMin, yVals[i]); yMax = Math.max(yMax, yVals[i]); }
    }
    if (!isFinite(xMin)) { xMin = 0; xMax = 1; }
    if (!isFinite(yMin)) { yMin = 0; yMax = 1; }
    if (xMin === xMax) { xMin -= 1; xMax += 1; }
    if (yMin === yMax) { yMin -= 1; yMax += 1; }

    // Add 5% margin
    const xRange = xMax - xMin, yRange = yMax - yMin;
    xMin -= xRange * 0.05; xMax += xRange * 0.05;
    yMin -= yRange * 0.05; yMax += yRange * 0.05;

    const px = x => PAD.left + (x - xMin) / (xMax - xMin) * plotW;
    const py = y => PAD.top  + (1 - (y - yMin) / (yMax - yMin)) * plotH;

    const borderColor = this._css('--border') || '#2a2f3a';
    const mutedColor  = this._css('--muted')  || '#6b7280';

    // Grid lines
    ctx.lineWidth = 1;
    const ticks = 5;
    for (let i = 0; i <= ticks; i++) {
      // Horizontal (Y axis)
      const yv = yMin + (yMax - yMin) * i / ticks;
      const ypx = py(yv);
      ctx.strokeStyle = borderColor;
      ctx.beginPath(); ctx.moveTo(PAD.left, ypx); ctx.lineTo(W - PAD.right, ypx); ctx.stroke();
      ctx.fillStyle = mutedColor; ctx.font = '10px monospace'; ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(yv.toPrecision(3), PAD.left - 4, ypx);

      // Vertical (X axis)
      const xv = xMin + (xMax - xMin) * i / ticks;
      const xpx = px(xv);
      ctx.beginPath(); ctx.moveTo(xpx, PAD.top); ctx.lineTo(xpx, H - PAD.bottom); ctx.stroke();
      ctx.fillStyle = mutedColor; ctx.font = '10px monospace'; ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(xv.toPrecision(3), xpx, H - PAD.bottom + 4);
    }

    // Draw trajectory as colored segments (blue→orange over time)
    const n = xVals.length;
    // Use segments for color gradient
    const STEP = Math.max(1, Math.floor(n / 500)); // cap segments for perf
    for (let i = 0; i < n - 1; i += STEP) {
      const t = i / (n - 1);
      // Interpolate blue #4f8ef7 → orange #f7a24f
      const r = Math.round(0x4f + (0xf7 - 0x4f) * t);
      const g = Math.round(0x8e + (0xa2 - 0x8e) * t);
      const b = Math.round(0xf7 + (0x4f - 0xf7) * t);
      ctx.strokeStyle = `rgb(${r},${g},${b})`;
      ctx.lineWidth = this._viz.lineWidth;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(px(xVals[i]), py(yVals[i]));
      const end = Math.min(i + STEP, n - 1);
      ctx.lineTo(px(xVals[end]), py(yVals[end]));
      ctx.stroke();
    }

    // Start point (t₀) — blue circle
    const x0 = px(xVals[0]), y0 = py(yVals[0]);
    ctx.beginPath();
    ctx.arc(x0, y0, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#4f8ef7';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#4f8ef7';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('t₀', x0 + 8, y0 - 2);

    // End point (t₁) — orange circle
    const x1 = px(xVals[n - 1]), y1 = py(yVals[n - 1]);
    ctx.beginPath();
    ctx.arc(x1, y1, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f7a24f';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#f7a24f';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('t₁', x1 + 8, y1 - 2);

    // Axis labels
    ctx.fillStyle = mutedColor;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(xName, PAD.left + plotW / 2, H - 2);

    ctx.save();
    ctx.translate(12, PAD.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(yName, 0, 0);
    ctx.restore();
  }

  // ── Export methods ──────────────────────────────────────────────────────────

  downloadCSV(model) {
    if (!this._data) return;
    const { times, series } = this._data;
    const nodes = [...model.nodes.values()].filter(n => n.type !== 'input');
    const header = ['t', ...nodes.map(n => n.name)].join(',');
    const rows = times.map((t, i) =>
      [t.toFixed(6), ...nodes.map(n => (series[n.name]?.[i] ?? '').toString())].join(',')
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob), download: 'stgraph-data.csv'
    });
    a.click(); URL.revokeObjectURL(a.href);
  }

  downloadPNG() {
    if (!this._data) return;
    const a = Object.assign(document.createElement('a'), {
      href: this.canvas.toDataURL('image/png'), download: 'stgraph-chart.png'
    });
    a.click();
  }
}
