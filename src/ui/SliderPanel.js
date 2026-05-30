/**
 * SliderPanel
 *
 * Renders an interactive parameter panel for all 'input' nodes in an STModel.
 * Nodes with sliderMin/sliderMax metadata get a range slider; others get a
 * plain number input. Changing any control fires the onParamChange callback so
 * the application can re-run the simulation.
 *
 * Usage:
 *   const panel = new SliderPanel(containerEl, model, onParamChange);
 *   panel.refresh();   // call after model changes (new example, load, etc.)
 */
class SliderPanel {
  /**
   * @param {HTMLElement} container     – The DOM element to render into
   * @param {STModel}     model         – Live model reference
   * @param {Function}    onParamChange – Called with (nodeId, newValue) on every change
   */
  constructor(container, model, onParamChange) {
    this._container     = container;
    this._model         = model;
    this._onParamChange = onParamChange;
    this._rows          = new Map(); // nodeId → { slider, number, label }
  }

  /** Rebuild the panel from the current model's input nodes. */
  refresh() {
    this._container.innerHTML = '';
    this._rows.clear();

    const inputs = [...this._model.nodes.values()].filter(n => n.type === 'input');
    if (inputs.length === 0) {
      this._container.innerHTML = '<div class="sp-empty">No input nodes</div>';
      return;
    }

    for (const node of inputs) {
      this._container.appendChild(this._buildRow(node));
    }
  }

  /**
   * Sync displayed values to the current model state without rebuilding DOM.
   * Call this after a reset so sliders reflect initVal again.
   */
  syncValues() {
    for (const [id, row] of this._rows) {
      const node = this._model.nodes.get(id);
      if (!node) continue;
      if (row.slider) {
        row.slider.value = node.initVal;
        const mn = parseFloat(row.slider.min), mx = parseFloat(row.slider.max);
        const pct = mx > mn ? ((node.initVal - mn) / (mx - mn)) * 100 : 0;
        row.slider.style.setProperty('--fill', Math.max(0, Math.min(100, pct)) + '%');
      }
      row.number.value = node.initVal;
    }
  }

  // ── Private ─────────────────────────────────────────────────────────────────

  _buildRow(node) {
    const hasSlider = node.sliderMin !== undefined && node.sliderMax !== undefined;

    const row = document.createElement('div');
    row.className = 'sp-row';

    // Label: name + unit
    const label = document.createElement('div');
    label.className = 'sp-label';
    label.title = node.desc || node.name;
    const baseName = node.unit ? `${node.name} [${node.unit}]` : node.name;
    label.textContent = node.desc ? `${baseName} (${node.desc})` : baseName;
    row.appendChild(label);

    // Controls container
    const controls = document.createElement('div');
    controls.className = 'sp-controls';

    let sliderEl = null;

    if (hasSlider) {
      sliderEl = document.createElement('input');
      sliderEl.type  = 'range';
      sliderEl.min   = node.sliderMin;
      sliderEl.max   = node.sliderMax;
      sliderEl.step  = node.sliderStep ?? 'any';
      sliderEl.value = node.initVal;
      sliderEl.className = 'sp-slider';
      controls.appendChild(sliderEl);
    }

    const numEl = document.createElement('input');
    numEl.type      = 'number';
    numEl.value     = node.initVal;
    numEl.step      = node.sliderStep ?? 'any';
    numEl.className = 'sp-number';
    controls.appendChild(numEl);

    row.appendChild(controls);

    // ── Event wiring ──────────────────────────────────────────────────────────
    const origMin = node.sliderMin;
    const origMax = node.sliderMax;

    const updateFill = () => {
      if (!sliderEl) return;
      const mn = parseFloat(sliderEl.min), mx = parseFloat(sliderEl.max);
      const v  = parseFloat(sliderEl.value);
      const pct = mx > mn ? ((v - mn) / (mx - mn)) * 100 : 0;
      sliderEl.style.setProperty('--fill', Math.max(0, Math.min(100, pct)) + '%');
    };

    const commit = (rawVal) => {
      const v = parseFloat(rawVal);
      if (!isFinite(v)) return;
      node.initVal = v;
      node.value   = v;
      if (sliderEl) {
        // Auto-expand slider range when value is typed outside original bounds
        if (v < parseFloat(sliderEl.min)) sliderEl.min = v;
        if (v > parseFloat(sliderEl.max)) sliderEl.max = v;
        sliderEl.value = v;
        // Visual cue when range has been extended beyond original
        const expanded = parseFloat(sliderEl.min) < origMin || parseFloat(sliderEl.max) > origMax;
        sliderEl.classList.toggle('range-expanded', expanded);
        updateFill();
      }
      numEl.value = v;
      this._onParamChange(node.id, v);
    };

    if (sliderEl) {
      updateFill(); // initial fill
      sliderEl.addEventListener('input', e => {
        numEl.value = e.target.value;   // live preview
        commit(e.target.value);
      });
    }

    numEl.addEventListener('change', e => commit(e.target.value));

    this._rows.set(node.id, { slider: sliderEl, number: numEl, label });
    return row;
  }
}
