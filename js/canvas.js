/**
 * GraphCanvas — Interactive graph editor.
 *
 * Tasks added:
 *   Task 4  – clipboard (copy/paste) support via gc.clipboard + gc.copyNode()/pasteNode()
 *   Task 5  – right-click context menu via `contextmenu` event; gc.onContextMenu callback
 *   Task 6  – highlightMap: Map<id, color> for dependency/loop highlighting
 *   Task 7  – text node type rendered as plain label
 *   Task 9  – gauges array drawn as arc overlays after nodes
 */
class GraphCanvas {
  constructor(canvasEl, model, onSelect) {
    this.canvas   = canvasEl;
    this.ctx      = canvasEl.getContext('2d');
    this.model    = model;
    this.onSelect = onSelect;

    this.tool     = 'select';
    this.selected = null;

    this.onMutation    = null;
    this.onZoomChange  = null;
    this.onDraw        = null;
    this.onContextMenu = null; // (nodeId, screenX, screenY) => void

    this.quizMode      = false;
    this.stepHighlight = null;
    this.searchQuery   = '';

    // Task 6 – highlight map: Map<nodeId, cssColor>
    this.highlightMap  = new Map();

    // Task 4 – clipboard
    this.clipboard     = null;

    this._tx = { scale: 1, ox: 0, oy: 0 };

    this._drag         = null;
    this._connecting   = null;
    this._resizeHandle = null;
    this._panDrag      = null;
    this._rubberBand   = null;  // { x0, y0, x1, y1 } in world coords
    this.selectedIds   = new Set(); // multi-selection set

    // Sparklines: Map<nodeId, number[]> — last N values per node
    this._sparklines   = new Map();
    this._sparkMax     = 80; // number of samples to keep

    // Live phase trail: { pts: Float32Array, len, xName, yName, xMin,xMax,yMin,yMax }
    this._trail        = null;

    this._colors = {
      state:     '#4f8ef7',
      algebraic: '#3ecf8e',
      input:     '#f7a24f',
      output:    '#f7604f',
      text:      '#a78bfa', // Task 7
    };

    this._resize();
    window.addEventListener('resize', () => this._resize());
    canvasEl.addEventListener('mousedown',    e => this._onDown(e));
    canvasEl.addEventListener('mousemove',    e => this._onMove(e));
    canvasEl.addEventListener('mouseup',      e => this._onUp(e));
    canvasEl.addEventListener('dblclick',     e => this._onDblClick(e));
    canvasEl.addEventListener('mouseleave',   e => this._onMouseLeave(e));
    canvasEl.addEventListener('wheel',        e => this._onWheel(e), { passive: false });
    canvasEl.addEventListener('contextmenu',  e => this._onContextMenu(e)); // Task 5
  }

  setTool(t) {
    this.tool        = t;
    this._connecting = null;
    this._resizeHandle = null;
    this.draw();
  }

  // ── Zoom / pan public methods ───────────────────────────────────────────────

  resetZoom() {
    this._tx = { scale: 1, ox: 0, oy: 0 };
    this.draw();
    if (this.onZoomChange) this.onZoomChange(1);
  }

  fitToScreen() {
    const nodes = [...this.model.nodes.values()];
    if (nodes.length === 0) { this.resetZoom(); return; }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of nodes) {
      minX = Math.min(minX, n.x - n.rx);
      minY = Math.min(minY, n.y - n.ry);
      maxX = Math.max(maxX, n.x + n.rx);
      maxY = Math.max(maxY, n.y + n.ry);
    }

    const PAD = 80;
    const W = this.canvas.width, H = this.canvas.height;
    const bw = maxX - minX + PAD * 2;
    const bh = maxY - minY + PAD * 2;
    const scale = Math.min(3, Math.min(W / bw, H / bh)) * 0.88;

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    this._tx.scale = scale;
    this._tx.ox    = W / 2 - cx * scale;
    this._tx.oy    = H / 2 - cy * scale;

    this.draw();
    if (this.onZoomChange) this.onZoomChange(scale);
  }

  // ── Sparklines ─────────────────────────────────────────────────────────────

  /** Push one new value per node from the current model state */
  pushSparklineSample() {
    for (const n of this.model.nodes.values()) {
      if (n.type === 'input') continue;
      if (!this._sparklines.has(n.id)) this._sparklines.set(n.id, []);
      const arr = this._sparklines.get(n.id);
      arr.push(n.value);
      if (arr.length > this._sparkMax) arr.shift();
    }
  }

  clearSparklines() { this._sparklines.clear(); }

  // ── Phase trail ────────────────────────────────────────────────────────────

  /** Feed the live trail with current series data */
  setTrailData(series, xName, yName) {
    const xs = series[xName], ys = series[yName];
    if (!xs || !ys || xs.length < 2) { this._trail = null; return; }
    const N = Math.min(xs.length, ys.length);
    let xMin =  Infinity, xMax = -Infinity;
    let yMin =  Infinity, yMax = -Infinity;
    for (let i = 0; i < N; i++) {
      if (isFinite(xs[i])) { xMin = Math.min(xMin, xs[i]); xMax = Math.max(xMax, xs[i]); }
      if (isFinite(ys[i])) { yMin = Math.min(yMin, ys[i]); yMax = Math.max(yMax, ys[i]); }
    }
    this._trail = { xs, ys, len: N, xName, yName, xMin, xMax, yMin, yMax };
  }

  clearTrail() { this._trail = null; }

  // ── Auto layout (Fruchterman-Reingold spring embedder) ────────────────────

  autoLayout() {
    const nodes = [...this.model.nodes.values()];
    if (nodes.length < 2) return;
    const edges = this.model.edges;

    const W = (this.canvas.width  / this._tx.scale) * 0.7;
    const H = (this.canvas.height / this._tx.scale) * 0.7;
    const k = Math.sqrt(W * H / nodes.length) * 1.2;

    // Working positions
    const pos = new Map(nodes.map(n => [n.id, { x: n.x, y: n.y }]));

    let temp = W * 0.3;
    const iters = 280;

    for (let iter = 0; iter < iters; iter++) {
      const disp = new Map(nodes.map(n => [n.id, { x: 0, y: 0 }]));

      // Repulsion between every pair
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const u = nodes[i], v = nodes[j];
          const pu = pos.get(u.id), pv = pos.get(v.id);
          let dx = pu.x - pv.x, dy = pu.y - pv.y;
          const d = Math.max(0.5, Math.sqrt(dx*dx + dy*dy));
          const f = k * k / d;
          dx = dx / d * f; dy = dy / d * f;
          disp.get(u.id).x += dx; disp.get(u.id).y += dy;
          disp.get(v.id).x -= dx; disp.get(v.id).y -= dy;
        }
      }

      // Attraction along edges
      for (const e of edges) {
        const pu = pos.get(e.from), pv = pos.get(e.to);
        if (!pu || !pv) continue;
        const dx = pu.x - pv.x, dy = pu.y - pv.y;
        const d = Math.max(0.5, Math.sqrt(dx*dx + dy*dy));
        const f = d * d / k;
        const fx = dx / d * f, fy = dy / d * f;
        disp.get(e.from).x -= fx; disp.get(e.from).y -= fy;
        disp.get(e.to).x   += fx; disp.get(e.to).y   += fy;
      }

      // Apply displacement clamped to temperature
      for (const n of nodes) {
        const d = disp.get(n.id);
        const len = Math.max(0.01, Math.sqrt(d.x*d.x + d.y*d.y));
        const move = Math.min(len, temp);
        const p = pos.get(n.id);
        p.x += d.x / len * move;
        p.y += d.y / len * move;
      }

      temp *= 0.97; // cool
    }

    // Commit positions
    for (const n of nodes) {
      const p = pos.get(n.id);
      n.x = Math.round(p.x);
      n.y = Math.round(p.y);
    }

    if (this.onMutation) this.onMutation();
    this.fitToScreen();
  }

  // ── Private: geometry helpers ───────────────────────────────────────────────

  _resize() {
    const wrap = this.canvas.parentElement;
    this.canvas.width  = wrap.clientWidth;
    this.canvas.height = wrap.clientHeight;
    this.draw();
  }

  _pos(e) {
    const r = this.canvas.getBoundingClientRect();
    const sx = e.clientX - r.left, sy = e.clientY - r.top;
    return { x: (sx - this._tx.ox) / this._tx.scale, y: (sy - this._tx.oy) / this._tx.scale };
  }

  _posScreen(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  _hitNode(n, px, py) {
    // Task 7: text nodes use a bounding-box hit test
    if (n.type === 'text') {
      return Math.abs(px - n.x) < n.rx && Math.abs(py - n.y) < n.ry;
    }
    const dx = (px - n.x) / n.rx;
    const dy = (py - n.y) / n.ry;
    return dx * dx + dy * dy <= 1;
  }

  _nodeAt(x, y) {
    for (const n of [...this.model.nodes.values()].reverse()) {
      if (this._hitNode(n, x, y)) return n;
    }
    return null;
  }

  _hitHandle(node, px, py) {
    if (node.id !== this.selected) return null;
    const handles = this._handlePositions(node);
    const hitR = 7 / this._tx.scale;
    for (const h of handles) {
      const dx = px - h.x, dy = py - h.y;
      if (Math.sqrt(dx * dx + dy * dy) <= hitR) return h;
    }
    return null;
  }

  _handlePositions(node) {
    return [
      { x: node.x + node.rx, y: node.y,        axis: 'x', dir:  1 },
      { x: node.x - node.rx, y: node.y,        axis: 'x', dir: -1 },
      { x: node.x,           y: node.y + node.ry, axis: 'y', dir:  1 },
      { x: node.x,           y: node.y - node.ry, axis: 'y', dir: -1 },
    ];
  }

  _edgeAt(x, y) {
    const hitDist = 8 / this._tx.scale;
    for (const e of this.model.edges) {
      const a = this.model.nodes.get(e.from);
      const b = this.model.nodes.get(e.to);
      if (!a || !b) continue;
      const dx = b.x - a.x, dy = b.y - a.y;
      const len2 = dx * dx + dy * dy;
      if (len2 === 0) continue;
      const t  = Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / len2));
      const px = a.x + t * dx - x, py = a.y + t * dy - y;
      if (Math.sqrt(px * px + py * py) < hitDist) return e;
    }
    return null;
  }

  // ── Task 5: right-click context menu ────────────────────────────────────────

  _onContextMenu(e) {
    const { x, y } = this._pos(e);
    const node = this._nodeAt(x, y);
    if (node) {
      e.preventDefault();
      if (this.onContextMenu) this.onContextMenu(node.id, e.clientX, e.clientY);
    }
  }

  // ── Task 4: copy / paste nodes ──────────────────────────────────────────────

  // ── Internal: serialize a node for clipboard ───────────────────────────────
  _serializeNode(n) {
    return {
      name: n.name, type: n.type, expr: n.expr, initVal: n.initVal,
      unit: n.unit, desc: n.desc, derivMode: n.derivMode,
      sliderMin: n.sliderMin, sliderMax: n.sliderMax, sliderStep: n.sliderStep,
      rx: n.rx, ry: n.ry, x: n.x, y: n.y,
    };
  }

  // ── Internal: collect edges within a set of node IDs ──────────────────────
  _edgesWithin(ids) {
    const idSet = new Set(ids);
    return this.model.edges
      .filter(e => idSet.has(e.from) && idSet.has(e.to))
      .map(e => ({
        fromName: this.model.nodes.get(e.from).name,
        toName:   this.model.nodes.get(e.to).name,
      }));
  }

  // ── Single-node copy (used for cut and single selection) ───────────────────
  copyNode(nodeId) {
    const n = this.model.nodes.get(nodeId);
    if (!n) return null;
    this.clipboard = { nodes: [this._serializeNode(n)], edges: [] };
    return this.clipboard.nodes[0];
  }

  // ── Multi-node copy — includes all edges between selected nodes ────────────
  copyNodes(ids) {
    const nodes = [...ids].map(id => this.model.nodes.get(id)).filter(Boolean);
    if (!nodes.length) return;
    this.clipboard = {
      nodes: nodes.map(n => this._serializeNode(n)),
      edges: this._edgesWithin([...ids]),
    };
    return this.clipboard;
  }

  // ── Paste nodes + their edges ──────────────────────────────────────────────
  pasteNode() {
    if (!this.clipboard || !this.clipboard.nodes || !this.clipboard.nodes.length) return null;
    if (this.onMutation) this.onMutation();

    const existingNames = new Set([...this.model.nodes.values()].map(n => n.name));
    const _uniqueName = (base) => {
      base = base.replace(/_copy\d*$/, '');
      let name = base + '_copy', i = 1;
      while (existingNames.has(name)) name = base + '_copy' + (++i);
      existingNames.add(name);
      return name;
    };

    // Map original name → new name for edge reconnection
    const nameMap = {};
    const newNodes = this.clipboard.nodes.map(c => {
      const newName = _uniqueName(c.name);
      nameMap[c.name] = newName;
      const n = this.model.addNode(newName, c.type, c.expr, c.initVal, c.unit, c.desc, c.derivMode);
      n.x = c.x + 40; n.y = c.y + 40;
      n.rx = c.rx;    n.ry = c.ry;
      if (c.sliderMin  !== undefined) n.sliderMin  = c.sliderMin;
      if (c.sliderMax  !== undefined) n.sliderMax  = c.sliderMax;
      if (c.sliderStep !== undefined) n.sliderStep = c.sliderStep;
      return n;
    });

    // Reconnect edges using the new names
    const nameToId = new Map([...this.model.nodes.values()].map(n => [n.name, n.id]));
    for (const e of (this.clipboard.edges || [])) {
      const fromId = nameToId.get(nameMap[e.fromName]);
      const toId   = nameToId.get(nameMap[e.toName]);
      if (fromId != null && toId != null) this.model.addEdge(fromId, toId);
    }

    // Select all pasted nodes
    this.selectedIds.clear();
    newNodes.forEach(n => this.selectedIds.add(n.id));
    if (newNodes.length === 1) {
      this.selected = newNodes[0].id;
      this.onSelect(newNodes[0]);
    } else {
      this.selected = null;
      this.onSelect(null);
    }
    this.draw();
    return newNodes.length === 1 ? newNodes[0] : newNodes;
  }

  // ── Private: event handlers ─────────────────────────────────────────────────

  _onDown(e) {
    if (e.button === 1) {
      e.preventDefault();
      const { x: sx, y: sy } = this._posScreen(e);
      this._panDrag = { startOx: this._tx.ox, startOy: this._tx.oy, startMx: sx, startMy: sy };
      this.canvas.style.cursor = 'grabbing';
      return;
    }

    const { x, y } = this._pos(e);

    if (this.tool === 'select') {
      const selNode = this.selected !== null ? this.model.nodes.get(this.selected) : null;
      if (selNode) {
        const h = this._hitHandle(selNode, x, y);
        if (h) {
          this._resizeHandle = {
            node: selNode, axis: h.axis, dir: h.dir,
            startMx: x, startMy: y,
            startRx: selNode.rx, startRy: selNode.ry,
            startNodeX: selNode.x, startNodeY: selNode.y,
          };
          document.body.style.cursor = h.axis === 'x' ? 'ew-resize' : 'ns-resize';
          e.preventDefault();
          return;
        }
      }

      const node = this._nodeAt(x, y);
      if (node) {
        // If clicking a node that's in a multi-selection, start dragging all of them
        if (this.selectedIds.size > 1 && this.selectedIds.has(node.id)) {
          this._drag = { node, ox: x - node.x, oy: y - node.y, multi: true };
        } else {
          this.selectedIds.clear();
          this.selected = node.id;
          this.selectedIds.add(node.id);
          this._drag = { node, ox: x - node.x, oy: y - node.y };
          this.onSelect(node);
        }
      } else {
        // Start rubber-band selection on empty canvas
        this.selected = null;
        this.selectedIds.clear();
        this._rubberBand = { x0: x, y0: y, x1: x, y1: y };
        this.onSelect(null);
      }

    } else if (this.tool === 'connect') {
      const node = this._nodeAt(x, y);
      if (node) this._connecting = { fromId: node.id, mx: x, my: y };

    } else if (this.tool === 'delete') {
      const node = this._nodeAt(x, y);
      if (node) {
        if (this.onMutation) this.onMutation();
        if (node.id === this.selected) { this.selected = null; this.onSelect(null); }
        this.model.removeNode(node.id);
      } else {
        const edge = this._edgeAt(x, y);
        if (edge) {
          if (this.onMutation) this.onMutation();
          this.model.removeEdge(edge.from, edge.to);
        }
      }
    }

    this.draw();
  }

  _onMove(e) {
    if (this._panDrag) {
      const { x: sx, y: sy } = this._posScreen(e);
      this._tx.ox = this._panDrag.startOx + (sx - this._panDrag.startMx);
      this._tx.oy = this._panDrag.startOy + (sy - this._panDrag.startMy);
      this.draw();
      return;
    }

    const { x, y } = this._pos(e);

    if (this._resizeHandle) {
      const { node, axis, dir, startRx, startRy, startNodeX, startNodeY } = this._resizeHandle;

      if (axis === 'x') {
        if (dir === 1) {
          const fixedLeft = startNodeX - startRx;
          node.rx = Math.max(18, x - fixedLeft);
          node.x  = fixedLeft + node.rx;
        } else {
          const fixedRight = startNodeX + startRx;
          node.rx = Math.max(18, fixedRight - x);
          node.x  = fixedRight - node.rx;
        }
      } else {
        if (dir === 1) {
          const fixedTop = startNodeY - startRy;
          node.ry = Math.max(18, y - fixedTop);
          node.y  = fixedTop + node.ry;
        } else {
          const fixedBottom = startNodeY + startRy;
          node.ry = Math.max(18, fixedBottom - y);
          node.y  = fixedBottom - node.ry;
        }
      }

      this.draw();
      return;
    }

    if (this._drag) {
      const dx = (x - this._drag.ox) - this._drag.node.x;
      const dy = (y - this._drag.oy) - this._drag.node.y;
      if (this._drag.multi) {
        // Move all selected nodes together
        for (const id of this.selectedIds) {
          const n = this.model.nodes.get(id);
          if (n) { n.x += dx; n.y += dy; }
        }
      } else {
        this._drag.node.x += dx;
        this._drag.node.y += dy;
      }
    }
    if (this._rubberBand) {
      this._rubberBand.x1 = x;
      this._rubberBand.y1 = y;
    }
    if (this._connecting) {
      this._connecting.mx = x;
      this._connecting.my = y;
    }
    if (this._drag || this._connecting || this._rubberBand) this.draw();

    if (!this._drag && !this._connecting && this.tool === 'select') {
      const selNode = this.selected !== null ? this.model.nodes.get(this.selected) : null;
      if (selNode) {
        const h = this._hitHandle(selNode, x, y);
        if (h) {
          this.canvas.style.cursor = h.axis === 'x' ? 'ew-resize' : 'ns-resize';
          return;
        }
      }
      this.canvas.style.cursor = this._nodeAt(x, y) ? 'grab' : 'default';
    }
  }

  _onUp(e) {
    if (this._panDrag) {
      this._panDrag = null;
      this.canvas.style.cursor = 'default';
      return;
    }

    if (this._resizeHandle) {
      this._resizeHandle = null;
      document.body.style.cursor = '';
      this.canvas.style.cursor = 'default';
      this.draw();
      return;
    }

    if (this._rubberBand) {
      const rb = this._rubberBand;
      const minX = Math.min(rb.x0, rb.x1), maxX = Math.max(rb.x0, rb.x1);
      const minY = Math.min(rb.y0, rb.y1), maxY = Math.max(rb.y0, rb.y1);
      this.selectedIds.clear();
      for (const n of this.model.nodes.values()) {
        if (n.x - n.rx <= maxX && n.x + n.rx >= minX &&
            n.y - n.ry <= maxY && n.y + n.ry >= minY) {
          this.selectedIds.add(n.id);
        }
      }
      if (this.selectedIds.size === 1) {
        this.selected = [...this.selectedIds][0];
        this.onSelect(this.model.nodes.get(this.selected));
      } else if (this.selectedIds.size > 1) {
        this.selected = null;
        this.onSelect(null);
      }
      this._rubberBand = null;
      this.draw();
      return;
    }

    if (this._connecting) {
      const { x, y } = this._pos(e);
      const target = this._nodeAt(x, y);
      if (target && target.id !== this._connecting.fromId) {
        if (this.onMutation) this.onMutation();
        this.model.addEdge(this._connecting.fromId, target.id);
      }
      this._connecting = null;
    }
    this._drag = null;
    this.draw();
  }

  _onMouseLeave(e) {
    if (this._panDrag)   { this._panDrag   = null; }
    if (this._rubberBand){ this._rubberBand = null; this.draw(); }
  }

  _onDblClick(e) {
    if (this.tool !== 'select') return;
    const { x, y } = this._pos(e);
    if (this._nodeAt(x, y)) return;
    if (this.onMutation) this.onMutation();
    const n = this.model.addNode(`n${this.model._nextId}`, 'algebraic', '0', 0, '', '');
    n.x = x; n.y = y;
    this.selected = n.id;
    this.onSelect(n);
    this.draw();
  }

  _onWheel(e) {
    e.preventDefault();
    if (e.ctrlKey) {
      const { x: sx, y: sy } = this._posScreen(e);
      const factor = e.deltaY < 0 ? 1.015 : 1 / 1.015;
      const newScale = Math.min(Math.max(this._tx.scale * factor, 0.08), 12);
      this._tx.ox = sx - (sx - this._tx.ox) * (newScale / this._tx.scale);
      this._tx.oy = sy - (sy - this._tx.oy) * (newScale / this._tx.scale);
      this._tx.scale = newScale;
      if (this.onZoomChange) this.onZoomChange(newScale);
    } else {
      this._tx.ox -= e.deltaX;
      this._tx.oy -= e.deltaY;
    }
    this.draw();
  }

  // ── Drawing ─────────────────────────────────────────────────────────────────

  draw() {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    ctx.clearRect(0, 0, W, H);

    const { scale, ox, oy } = this._tx;

    this._drawGrid(W, H);

    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, ox, oy);

    // Phase trail — drawn first so nodes appear on top
    if (this._trail) this._drawTrail();

    this._drawEdges();
    if (this._connecting) this._drawConnectingLine();
    for (const n of this.model.nodes.values()) this._drawNode(n);

    // Task 9: draw gauge overlays
    if (this.model.gauges && this.model.gauges.length > 0) {
      for (const g of this.model.gauges) this._drawGauge(g);
    }

    ctx.restore();

    // Draw rubber-band selection rectangle (screen space, outside transform)
    if (this._rubberBand) {
      const rb = this._rubberBand;
      const { scale, ox, oy } = this._tx;
      const toS = v => v * scale;
      const sx0 = toS(rb.x0) + ox, sy0 = toS(rb.y0) + oy;
      const sx1 = toS(rb.x1) + ox, sy1 = toS(rb.y1) + oy;
      ctx.save();
      ctx.strokeStyle = 'rgba(79,142,247,0.85)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      ctx.fillStyle = 'rgba(79,142,247,0.10)';
      const rx = Math.min(sx0, sx1), ry = Math.min(sy0, sy1);
      const rw = Math.abs(sx1 - sx0), rh = Math.abs(sy1 - sy0);
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeRect(rx, ry, rw, rh);
      ctx.setLineDash([]);
      ctx.restore();
    }

    if (this.stepHighlight) this._drawStepTooltip(this.stepHighlight);

    if (this.onDraw) this.onDraw();
  }

  _drawGrid(W, H) {
    const ctx = this.ctx;
    const { scale, ox, oy } = this._tx;
    ctx.strokeStyle = getComputedStyle(document.documentElement)
                        .getPropertyValue('--grid-color').trim() || '#1e2229';
    ctx.lineWidth = 1;

    const worldLeft   = -ox / scale;
    const worldTop    = -oy / scale;
    const worldRight  = (W - ox) / scale;
    const worldBottom = (H - oy) / scale;

    const GRID = 40;
    const startX = Math.floor(worldLeft  / GRID) * GRID;
    const startY = Math.floor(worldTop   / GRID) * GRID;

    for (let gx = startX; gx <= worldRight; gx += GRID) {
      const sx = gx * scale + ox;
      ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, H); ctx.stroke();
    }
    for (let gy = startY; gy <= worldBottom; gy += GRID) {
      const sy = gy * scale + oy;
      ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(W, sy); ctx.stroke();
    }
  }

  _drawEdges() {
    for (const e of this.model.edges) {
      const a = this.model.nodes.get(e.from);
      const b = this.model.nodes.get(e.to);
      if (a && b) this._drawArrow(a, b);
    }
  }

  _drawConnectingLine() {
    const src = this.model.nodes.get(this._connecting.fromId);
    if (!src) return;
    const ctx = this.ctx;
    const s = this._tx.scale;
    ctx.setLineDash([5 / s, 4 / s]);
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1.5 / s;
    ctx.beginPath();
    ctx.moveTo(src.x, src.y);
    ctx.lineTo(this._connecting.mx, this._connecting.my);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  _drawArrow(a, b) {
    const ctx   = this.ctx;
    const s     = this._tx.scale;
    const dx    = b.x - a.x, dy = b.y - a.y;
    const len   = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) return;
    const ux = dx / len, uy = dy / len;

    const startR = this._edgeRadius(a,  ux,  uy);
    const endR   = this._edgeRadius(b, -ux, -uy);
    const sx = a.x + ux * startR, sy = a.y + uy * startR;
    const ex = b.x - ux * endR,   ey = b.y - uy * endR;

    const color = getComputedStyle(document.documentElement)
                    .getPropertyValue('--edge-color').trim() || 'rgba(100,150,255,0.45)';
    ctx.strokeStyle = color;
    ctx.fillStyle   = color;
    ctx.lineWidth   = 1.5 / s;
    ctx.setLineDash([]);
    // Glowing path
    ctx.shadowColor = color;
    ctx.shadowBlur  = 8 / s;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    const angle = Math.atan2(ey - sy, ex - sx);
    const al = 10 / s, aw = 0.4;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - al * Math.cos(angle - aw), ey - al * Math.sin(angle - aw));
    ctx.lineTo(ex - al * Math.cos(angle + aw), ey - al * Math.sin(angle + aw));
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  _edgeRadius(node, ux, uy) {
    const { rx, ry } = node;
    const denom = Math.sqrt((ry * ux) ** 2 + (rx * uy) ** 2);
    return denom === 0 ? rx : (rx * ry) / denom + 4;
  }

  _drawNode(n) {
    // Task 7: text nodes rendered as plain label
    if (n.type === 'text') {
      this._drawTextNode(n);
      return;
    }

    const ctx = this.ctx;
    const s = this._tx.scale;
    const isSelected = n.id === this.selected || this.selectedIds.has(n.id);

    // Task 6: check highlight map
    const hlColor = this.highlightMap.get(n.id);
    const _rawColor = hlColor || this._colors[n.type] || '#888888';
    // Normalize 3-digit hex (#abc → #aabbcc) so alpha appending (#abc + '42' = valid)
    const color = _rawColor.startsWith('#') && _rawColor.length === 4
      ? '#' + _rawColor[1]+_rawColor[1]+_rawColor[2]+_rawColor[2]+_rawColor[3]+_rawColor[3]
      : _rawColor;

    const { x, y, rx, ry } = n;

    const q = (this.searchQuery || '').toLowerCase().trim();
    const matchesSearch = !q ||
      n.name.toLowerCase().includes(q) ||
      n.type.toLowerCase().includes(q);
    const isDimmed    = q && !matchesSearch;
    const isHighlight = q && matchesSearch;

    const cr = Math.min(rx, ry) * 0.65; // pill-like corners
    const isStepNode = this.stepHighlight && this.stepHighlight.nodeId === n.id;

    if (isDimmed) ctx.globalAlpha = 0.22;

    // Ambient glow
    ctx.shadowColor = isStepNode ? '#ffffff' : color;
    ctx.shadowBlur  = (isStepNode ? 32 : isSelected ? 24 : isHighlight ? 20 : hlColor ? 16 : 10) / s;

    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x - rx, y - ry, rx * 2, ry * 2, cr);
    } else {
      this._roundRectPath(ctx, x - rx, y - ry, rx * 2, ry * 2, cr);
    }

    // Glass gradient fill
    const grad = ctx.createLinearGradient(x, y - ry, x, y + ry);
    if (isSelected) {
      grad.addColorStop(0, color + '70');
      grad.addColorStop(0.5, color + '44');
      grad.addColorStop(1, color + '28');
    } else {
      grad.addColorStop(0, color + '42');
      grad.addColorStop(0.5, color + '28');
      grad.addColorStop(1, color + '14');
    }
    ctx.fillStyle = grad;
    ctx.fill();

    // Border
    ctx.shadowBlur  = 0;
    ctx.strokeStyle = isStepNode ? '#ffffff' : isSelected ? color : (hlColor || color) + 'CC';
    ctx.lineWidth   = (isStepNode ? 4 : isSelected ? 2.5 : hlColor ? 2.5 : isHighlight ? 2.5 : 1.8) / s;
    ctx.stroke();

    // Glass sheen: top half highlight (simulates lit glass plate)
    ctx.save();
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x - rx + 1/s, y - ry + 1/s, (rx - 1/s) * 2, ry - 1/s, [cr, cr, 0, 0]);
    } else {
      this._roundRectPath(ctx, x - rx + 1/s, y - ry + 1/s, (rx - 1/s) * 2, ry - 1/s, cr);
    }
    ctx.clip();
    const sheenGrad = ctx.createLinearGradient(x, y - ry, x, y);
    sheenGrad.addColorStop(0, 'rgba(255,255,255,0.22)');
    sheenGrad.addColorStop(1, 'rgba(255,255,255,0.00)');
    ctx.fillStyle = sheenGrad;
    ctx.fillRect(x - rx, y - ry, rx * 2, ry);
    ctx.restore();

    const fontSize = Math.max(9, Math.min(13, rx * 0.55));
    ctx.fillStyle     = isSelected ? '#fff' : 'rgba(255,255,255,0.92)';
    ctx.font          = `bold ${fontSize}px monospace`;
    ctx.textAlign     = 'center';
    ctx.textBaseline  = 'middle';
    const maxChars = Math.floor(rx / (fontSize * 0.5));
    const label    = n.name.length > maxChars ? n.name.slice(0, maxChars) + '…' : n.name;
    ctx.fillText(label, x, y);

    ctx.fillStyle    = getComputedStyle(document.documentElement)
                        .getPropertyValue('--muted').trim() || '#6b7280';
    ctx.font         = '10px monospace';
    const valStr = this.quizMode
      ? '?'
      : (n.value !== undefined ? Number(n.value).toPrecision(4) : '');
    ctx.fillText(valStr, x, y + ry + 12);

    // Sparkline — small value history chart below the node
    const spark = this._sparklines.get(n.id);
    if (spark && spark.length > 2 && !this.quizMode) {
      const sw = rx * 1.6, sh = 10;
      const sx0 = x - sw / 2, sy0 = y + ry + 18;
      let vMin = Infinity, vMax = -Infinity;
      for (const v of spark) { if (isFinite(v)) { vMin = Math.min(vMin, v); vMax = Math.max(vMax, v); } }
      const vRange = vMax - vMin || 1;
      ctx.save();
      ctx.globalAlpha = isDimmed ? 0.15 : 0.55;
      ctx.strokeStyle = color;
      ctx.lineWidth   = 1 / this._tx.scale;
      ctx.beginPath();
      for (let i = 0; i < spark.length; i++) {
        const px = sx0 + (i / (spark.length - 1)) * sw;
        const py = sy0 + sh - ((spark[i] - vMin) / vRange) * sh;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    }

    if (isDimmed) ctx.globalAlpha = 1;
    if (isSelected) this._drawHandles(n, color);
  }

  // ── Trail drawing ──────────────────────────────────────────────────────────
  _drawTrail() {
    const t = this._trail;
    const ctx = this.ctx;
    const N = t.len;
    if (N < 2) return;

    // Compute centroid of all nodes (world space) to center the trail
    const nodes = [...this.model.nodes.values()];
    let cx = 0, cy = 0;
    for (const n of nodes) { cx += n.x; cy += n.y; }
    cx /= nodes.length; cy /= nodes.length;

    // Scale trail to fit within ~250 world units
    const xRange = (t.xMax - t.xMin) || 1;
    const yRange = (t.yMax - t.yMin) || 1;
    const trailSize = 220;
    const scaleX = trailSize / xRange;
    const scaleY = trailSize / yRange;
    const sc = Math.min(scaleX, scaleY);
    const toWx = v => cx + (v - (t.xMin + xRange / 2)) * sc;
    const toWy = v => cy + (v - (t.yMin + yRange / 2)) * sc;

    // Draw as segmented line with color gradient (blue → purple → cyan)
    ctx.save();
    ctx.lineWidth = 0.8 / this._tx.scale;

    const segSize = 8; // points per segment for color banding
    for (let i = 1; i < N; i++) {
      const t0 = (i - 1) / (N - 1);
      // Palette: #4f8ef7 → #a78bfa → #7ef7c0
      let r, g, b;
      if (t0 < 0.5) {
        const s = t0 * 2;
        r = Math.round(79  + (167 - 79)  * s);
        g = Math.round(142 + (139 - 142) * s);
        b = Math.round(247 + (250 - 247) * s);
      } else {
        const s = (t0 - 0.5) * 2;
        r = Math.round(167 + (126 - 167) * s);
        g = Math.round(139 + (247 - 139) * s);
        b = Math.round(250 + (192 - 250) * s);
      }
      const alpha = 0.18 + t0 * 0.38; // older = more transparent
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.beginPath();
      ctx.moveTo(toWx(t.xs[i-1]), toWy(t.ys[i-1]));
      ctx.lineTo(toWx(t.xs[i]),   toWy(t.ys[i]));
      ctx.stroke();
    }

    // Draw a bright dot at the current position
    const cx2 = toWx(t.xs[N-1]), cy2 = toWy(t.ys[N-1]);
    const dotR = 3 / this._tx.scale;
    ctx.beginPath();
    ctx.arc(cx2, cy2, dotR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fill();
    ctx.restore();
  }

  // Task 7: text node drawing
  _drawTextNode(n) {
    const ctx = this.ctx;
    const s = this._tx.scale;
    const isSelected = n.id === this.selected;
    const color = this._colors.text;
    const { x, y } = n;

    const q = (this.searchQuery || '').toLowerCase().trim();
    const matchesSearch = !q || n.name.toLowerCase().includes(q);
    if (q && !matchesSearch) ctx.globalAlpha = 0.25;

    // Selection dashed rect
    if (isSelected) {
      ctx.save();
      ctx.setLineDash([4 / s, 3 / s]);
      ctx.strokeStyle = color;
      ctx.lineWidth   = 1.5 / s;
      ctx.strokeRect(x - n.rx, y - n.ry, n.rx * 2, n.ry * 2);
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Main text (name)
    const fontSize = Math.max(10, Math.min(16, n.rx * 0.5));
    ctx.font          = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle     = color;
    ctx.textAlign     = 'center';
    ctx.textBaseline  = isSelected ? 'bottom' : 'middle';
    ctx.fillText(n.name, x, isSelected ? y : y);

    // Subtitle (desc) if selected
    if (isSelected && n.desc) {
      ctx.font      = `${fontSize * 0.75}px sans-serif`;
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#6b7280';
      ctx.textBaseline = 'top';
      ctx.fillText(n.desc, x, y + 2);
    }

    if (q && !matchesSearch) ctx.globalAlpha = 1;
    if (isSelected) this._drawHandles(n, color);
  }

  // Task 9: Gauge overlay drawing
  _drawGauge(g) {
    const node = this.model.nodes.get(g.nodeId);
    if (!node) return;
    const ctx  = this.ctx;
    const s    = this._tx.scale;

    const gx = g.x, gy = g.y;
    const R = g.radius || 40;
    const min = g.min ?? 0, max = g.max ?? 1;
    const val = node.value ?? 0;
    const fraction = Math.max(0, Math.min(1, (val - min) / ((max - min) || 1)));

    // Arc: from 210° to 330° (220° sweep)
    const startAngle = Math.PI * (210 / 180);
    const sweepAngle = Math.PI * (220 / 180);
    const endAngle   = startAngle + sweepAngle * fraction;

    // Background arc
    ctx.beginPath();
    ctx.arc(gx, gy, R, startAngle, startAngle + sweepAngle);
    ctx.strokeStyle = '#2e3340';
    ctx.lineWidth   = 8 / s;
    ctx.lineCap     = 'round';
    ctx.stroke();

    // Value arc
    const arcColor = fraction < 0.5 ? '#3ecf8e' : fraction < 0.8 ? '#f7a24f' : '#f7604f';
    ctx.beginPath();
    ctx.arc(gx, gy, R, startAngle, endAngle);
    ctx.strokeStyle = arcColor;
    ctx.lineWidth   = 8 / s;
    ctx.lineCap     = 'round';
    ctx.stroke();
    ctx.lineCap     = 'butt';

    // Label: node name + value
    ctx.fillStyle    = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#d4d8e2';
    ctx.font         = `bold ${Math.max(7, 11 / s)}px monospace`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.name, gx, gy - 8 / s);
    ctx.fillStyle = arcColor;
    ctx.font      = `${Math.max(6, 9 / s)}px monospace`;
    ctx.fillText(Number(val).toPrecision(4), gx, gy + 6 / s);

    // Min / max labels
    ctx.fillStyle    = '#6b7280';
    ctx.font         = `${Math.max(5, 8 / s)}px monospace`;
    ctx.textBaseline = 'top';
    ctx.textAlign    = 'left';
    ctx.fillText(min, gx - R, gy + R * 0.5 + 4 / s);
    ctx.textAlign = 'right';
    ctx.fillText(max, gx + R, gy + R * 0.5 + 4 / s);
    ctx.textBaseline = 'middle';
  }

  _drawStepTooltip(highlight) {
    const node = this.model.nodes.get(highlight.nodeId);
    if (!node) return;
    const ctx = this.ctx;
    const { scale, ox, oy } = this._tx;

    const sx = node.x * scale + ox;
    const sy = (node.y - node.ry) * scale + oy - 10;

    const text = `Evaluating: ${node.name} = ${highlight.label}`;
    ctx.font = 'bold 12px monospace';
    const tw = ctx.measureText(text).width;
    const ph = 26, pw = tw + 20;

    ctx.fillStyle = 'rgba(30,35,45,0.92)';
    const bx = Math.min(Math.max(sx - pw / 2, 4), this.canvas.width - pw - 4);
    const by = Math.max(sy - ph, 4);
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') ctx.roundRect(bx, by, pw, ph, 5);
    else ctx.rect(bx, by, pw, ph);
    ctx.fill();
    ctx.strokeStyle = '#4f8ef7';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, bx + pw / 2, by + ph / 2);
  }

  _drawHandles(node, color) {
    const ctx = this.ctx;
    const s = this._tx.scale;
    const handles = this._handlePositions(node);
    for (const h of handles) {
      ctx.beginPath();
      ctx.arc(h.x, h.y, 5 / s, 0, Math.PI * 2);
      ctx.fillStyle   = color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth   = 1.5 / s;
      ctx.stroke();
    }
  }

  _roundRectPath(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y,     x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x,     y + h, r);
    ctx.arcTo(x,     y + h, x,     y,     r);
    ctx.arcTo(x,     y,     x + w, y,     r);
    ctx.closePath();
  }
}
