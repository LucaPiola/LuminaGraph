/**
 * AnalysisPanel.js — Equilibrium, Stability, Bifurcation, Monte Carlo UI
 */
(function () {

  class AnalysisPanel {
    /**
     * @param {HTMLElement} containerEl
     * @param {STModel}     model
     * @param {Function}    getParams  – () => { t0, t1, dt }
     * @param {STChart}     chart
     */
    constructor(containerEl, model, getParams, chart) {
      this._container = containerEl;
      this._model     = model;
      this._getParams = getParams;
      this._chart     = chart;
      this._bifCanvas = null;
      this._bifCtx    = null;
      this._render();
    }

    _render() {
      this._container.innerHTML = `
        <!-- Equilibrium finder -->
        <div class="analysis-section">
          <div class="analysis-section-title">Equilibrium Finder</div>
          <button id="btn-find-eq">Find Equilibrium</button>
          <div id="eq-result" class="analysis-result"></div>
        </div>

        <!-- Stability analysis -->
        <div class="analysis-section">
          <div class="analysis-section-title">Stability Analysis</div>
          <div class="sp-empty" style="font-size:11px;margin-bottom:6px">Run equilibrium finder first</div>
          <button id="btn-stability" disabled>Stability Analysis</button>
          <div id="stability-result" class="analysis-result"></div>
        </div>

        <!-- Bifurcation diagram -->
        <div class="analysis-section">
          <div class="analysis-section-title">Bifurcation Diagram</div>
          <div class="sm-row" style="margin-bottom:4px">
            <span>Parameter node</span>
            <select id="bif-node" style="background:var(--bg);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:2px 6px;font-size:11px"></select>
          </div>
          <div class="sm-row" style="margin-bottom:4px">
            <span>Min</span>
            <input id="bif-min" type="number" value="0" class="sm-input" />
            <span>Max</span>
            <input id="bif-max" type="number" value="10" class="sm-input" />
            <span>Steps</span>
            <input id="bif-steps" type="number" value="50" min="2" max="500" class="sm-input" />
          </div>
          <button id="btn-bif">Run Bifurcation</button>
          <div id="bif-result" class="analysis-result"></div>
          <canvas id="bif-canvas" width="400" height="300" style="display:none;margin-top:8px;border:1px solid var(--border);border-radius:4px;max-width:100%"></canvas>
        </div>

        <!-- Monte Carlo -->
        <div class="analysis-section">
          <div class="analysis-section-title">Monte Carlo Simulation</div>
          <div class="sm-row" style="margin-bottom:4px">
            <span>N runs</span>
            <input id="mc-n" type="number" value="50" min="2" max="1000" class="sm-input" />
            <span>Noise %</span>
            <input id="mc-noise" type="number" value="5" min="0" max="100" step="0.5" class="sm-input" />
          </div>
          <button id="btn-mc">Run Monte Carlo</button>
          <div id="mc-result" class="analysis-result"></div>
        </div>

        <!-- Sensitivity Heatmap -->
        <div class="analysis-section">
          <div class="analysis-section-title">Sensitivity Analysis</div>
          <div class="sm-row" style="margin-bottom:6px">
            <span>Perturbation</span>
            <input id="sens-pct" type="number" value="10" min="0.1" max="50" step="0.5" class="sm-input" />
            <span>%</span>
          </div>
          <button id="btn-sensitivity">Run Sensitivity</button>
          <div id="sensitivity-result" class="analysis-result"></div>
        </div>
      `;

      this._eqResult         = this._container.querySelector('#eq-result');
      this._stabilityResult  = this._container.querySelector('#stability-result');
      this._bifResult        = this._container.querySelector('#bif-result');
      this._mcResult         = this._container.querySelector('#mc-result');
      this._sensResult       = this._container.querySelector('#sensitivity-result');
      this._btnStability     = this._container.querySelector('#btn-stability');
      this._bifCanvas        = this._container.querySelector('#bif-canvas');
      this._bifCtx           = this._bifCanvas.getContext('2d');

      this._eqValues = null;

      this._container.querySelector('#btn-find-eq').addEventListener('click', () => this._runEq());
      this._btnStability.addEventListener('click', () => this._runStability());
      this._container.querySelector('#btn-bif').addEventListener('click', () => this._runBif());
      this._container.querySelector('#btn-mc').addEventListener('click', () => this._runMC());
      this._container.querySelector('#btn-sensitivity').addEventListener('click', () => this._runSensitivity());

      this._refreshBifNodes();
    }

    _refreshBifNodes() {
      const select = this._container.querySelector('#bif-node');
      if (!select) return;
      const inputNodes = [...this._model.nodes.values()].filter(n => n.type === 'input');
      select.innerHTML = inputNodes.length === 0
        ? '<option value="">No input nodes</option>'
        : inputNodes.map(n => `<option value="${n.id}">${n.name}</option>`).join('');
    }

    refresh() { this._refreshBifNodes(); }

    _runEq() {
      const { dt } = this._getParams();
      const res = Analysis.findEquilibrium(this._model, dt);

      if (res.errors && res.errors.length) {
        this._eqResult.innerHTML = `<span class="console-err">Error: ${res.errors.join(', ')}</span>`;
        return;
      }

      this._eqValues = res.eqValues;

      if (res.rows.length === 0) {
        this._eqResult.innerHTML = '<span style="color:var(--muted)">No state nodes.</span>';
        return;
      }

      const rows = res.rows.map(r => `
        <tr>
          <td>${r.name}</td>
          <td>${r.value.toPrecision(6)}</td>
          <td style="color:${r.converged ? 'var(--green)' : 'var(--orange)'}">
            ${r.converged ? '✓' : 'not converged'}
          </td>
        </tr>
      `).join('');

      this._eqResult.innerHTML = `
        <table class="analysis-table">
          <thead><tr><th>Node</th><th>Eq. value</th><th>Converged?</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `;

      this._btnStability.disabled = false;
    }

    _runStability() {
      if (!this._eqValues) { this._stabilityResult.textContent = 'Run equilibrium finder first.'; return; }
      const { dt } = this._getParams();
      const res = Analysis.stabilityAnalysis(this._model, this._eqValues, dt);

      if (res.errors && res.errors.length) {
        this._stabilityResult.innerHTML = `<span class="console-err">Error: ${res.errors.join(', ')}</span>`;
        return;
      }

      if (res.message) {
        this._stabilityResult.textContent = res.message;
        return;
      }

      const eigStr = res.eigenvalues.map((v, i) =>
        `<tr><td>λ${i + 1}</td><td>${v.toFixed(6)}</td><td style="color:${v < 0 ? 'var(--green)' : 'var(--red)'}">${v < 0 ? 'stable' : 'unstable'}</td></tr>`
      ).join('');

      const overallColor = res.stable ? 'var(--green)' : 'var(--red)';
      const overallText  = res.stable ? '✓ Stable equilibrium' : '✗ Unstable equilibrium';

      this._stabilityResult.innerHTML = `
        <div style="color:${overallColor};font-weight:600;margin-bottom:6px">${overallText}</div>
        <table class="analysis-table">
          <thead><tr><th>Eigenvalue</th><th>Re(λ)</th><th>Stability</th></tr></thead>
          <tbody>${eigStr}</tbody>
        </table>
      `;
    }

    _runBif() {
      const select = this._container.querySelector('#bif-node');
      const nodeId = parseInt(select.value, 10);
      if (!nodeId) { this._bifResult.textContent = 'Select a parameter node.'; return; }

      const pMin  = parseFloat(this._container.querySelector('#bif-min').value)   || 0;
      const pMax  = parseFloat(this._container.querySelector('#bif-max').value)   || 10;
      const steps = parseInt(this._container.querySelector('#bif-steps').value, 10) || 50;
      const { t0, t1, dt } = this._getParams();

      this._bifResult.textContent = 'Running…';

      // Defer to allow UI to update
      setTimeout(() => {
        const res = Analysis.bifurcationDiagram(this._model, nodeId, pMin, pMax, steps, t0, t1, dt);

        if (res.errors && res.errors.length) {
          this._bifResult.innerHTML = `<span class="console-err">${res.errors.join(', ')}</span>`;
          return;
        }

        this._bifResult.textContent = '';
        this._drawBifCanvas(res, pMin, pMax);
      }, 10);
    }

    _drawBifCanvas(res, pMin, pMax) {
      const canvas = this._bifCanvas;
      canvas.style.display = 'block';
      const ctx = this._bifCtx;
      const W = canvas.width, H = canvas.height;
      const PAD = { top: 20, right: 20, bottom: 36, left: 48 };
      const plotW = W - PAD.left - PAD.right;
      const plotH = H - PAD.top  - PAD.bottom;

      ctx.clearRect(0, 0, W, H);
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#23272f';
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Collect all values for y scale
      let yMin = Infinity, yMax = -Infinity;
      const stateNames = Object.keys(res.dots);
      for (const name of stateNames) {
        for (const { v } of res.dots[name]) {
          if (isFinite(v)) { yMin = Math.min(yMin, v); yMax = Math.max(yMax, v); }
        }
      }
      if (!isFinite(yMin)) { yMin = 0; yMax = 1; }
      if (yMin === yMax)   { yMin -= 1; yMax += 1; }

      const px = p => PAD.left + (p - pMin) / (pMax - pMin) * plotW;
      const py = v => PAD.top  + (1 - (v - yMin) / (yMax - yMin)) * plotH;

      const palette = ['#4f8ef7','#3ecf8e','#f7a24f','#f7604f','#b57bff','#ff7bca'];
      const muted   = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#6b7280';
      const border  = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#2a2f3a';

      // Grid
      ctx.strokeStyle = border; ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const v  = yMin + (yMax - yMin) * i / 5;
        const yp = py(v);
        ctx.beginPath(); ctx.moveTo(PAD.left, yp); ctx.lineTo(W - PAD.right, yp); ctx.stroke();
        ctx.fillStyle = muted; ctx.font = '9px monospace'; ctx.textAlign = 'right';
        ctx.fillText(v.toPrecision(3), PAD.left - 3, yp + 3);
      }
      for (let i = 0; i <= 5; i++) {
        const p  = pMin + (pMax - pMin) * i / 5;
        const xp = px(p);
        ctx.beginPath(); ctx.moveTo(xp, PAD.top); ctx.lineTo(xp, H - PAD.bottom); ctx.stroke();
        ctx.fillStyle = muted; ctx.font = '9px monospace'; ctx.textAlign = 'center';
        ctx.fillText(p.toPrecision(3), xp, H - PAD.bottom + 12);
      }

      // Dots
      stateNames.forEach((name, idx) => {
        const color = palette[idx % palette.length];
        ctx.fillStyle = color;
        for (const { p, v } of res.dots[name]) {
          if (!isFinite(v)) continue;
          ctx.beginPath();
          ctx.arc(px(p), py(v), 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Legend
      ctx.font = '10px monospace';
      stateNames.forEach((name, idx) => {
        const color = palette[idx % palette.length];
        ctx.fillStyle = color;
        ctx.fillRect(PAD.left + idx * 80, PAD.top - 14, 8, 8);
        ctx.fillText(name, PAD.left + idx * 80 + 11, PAD.top - 7);
      });

      // Axis label
      ctx.fillStyle = muted; ctx.font = '10px monospace'; ctx.textAlign = 'center';
      ctx.fillText('parameter', PAD.left + plotW / 2, H - 3);
    }

    _runSensitivity() {
      const pct = parseFloat(this._container.querySelector('#sens-pct').value) || 10;
      const params = this._getParams();
      this._sensResult.textContent = 'Running…';

      setTimeout(() => {
        const res = Analysis.sensitivityAnalysis(this._model, params, pct);

        if (res.errors && res.errors.length) {
          this._sensResult.innerHTML = `<span class="console-err">${res.errors.join(', ')}</span>`;
          return;
        }
        if (!res.rankings.length) {
          this._sensResult.textContent = 'No input nodes to analyse.';
          return;
        }

        const maxScore = res.rankings[0].score || 1;
        const rows = res.rankings.map((r, i) => {
          const pct = Math.max(2, Math.round(r.score / maxScore * 100));
          const label = r.desc ? `${r.name} — ${r.desc}` : r.name;
          const palette = ['#4f8ef7','#a78bfa','#3ecf8e','#f7a24f','#f7604f','#7ef7c0'];
          const col = palette[i % palette.length];
          return `
            <div style="margin-bottom:5px">
              <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:2px">
                <span style="color:rgba(255,255,255,0.75)">${label}</span>
                <span style="color:rgba(255,255,255,0.45)">${r.score < 0.001 ? r.score.toExponential(1) : r.score.toFixed(3)}</span>
              </div>
              <div style="height:6px;border-radius:3px;background:rgba(255,255,255,0.08)">
                <div style="width:${pct}%;height:100%;border-radius:3px;background:${col};transition:width 0.4s ease"></div>
              </div>
            </div>`;
        }).join('');

        this._sensResult.innerHTML = `
          <div style="font-size:10px;color:rgba(255,255,255,0.35);margin-bottom:8px">
            Sensitivity to ±${pct}% perturbation on each parameter
          </div>${rows}`;
      }, 10);
    }

    _runMC() {
      const nRuns = parseInt(this._container.querySelector('#mc-n').value, 10) || 50;
      const noise = parseFloat(this._container.querySelector('#mc-noise').value) || 5;
      const { t0, t1, dt } = this._getParams();

      this._mcResult.textContent = `Running ${nRuns} simulations…`;

      setTimeout(() => {
        const res = Analysis.monteCarlo(this._model, nRuns, noise, t0, t1, dt);

        if (res.errors && res.errors.length) {
          this._mcResult.innerHTML = `<span class="console-err">${res.errors.join(', ')}</span>`;
          return;
        }

        this._mcResult.textContent = `Done — ${nRuns} runs. Confidence bands drawn on chart.`;

        // Pass bands to chart
        if (this._chart && typeof this._chart.drawBands === 'function') {
          this._chart.drawBands(res.times, res.bandsMap);
        }
      }, 10);
    }
  }

  window.AnalysisPanel = AnalysisPanel;

})();
