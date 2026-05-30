/**
 * Minimap.js — Small canvas showing the full graph with a viewport rectangle.
 * Supports click/drag to pan the main canvas.
 */
(function () {

  class Minimap {
    /**
     * @param {HTMLCanvasElement} minimapCanvas
     * @param {GraphCanvas}       gc
     */
    constructor(minimapCanvas, gc) {
      this._canvas = minimapCanvas;
      this._ctx    = minimapCanvas.getContext('2d');
      this._gc     = gc;
      this._visible = true;
      this._dragging = false;

      minimapCanvas.addEventListener('mousedown', e => this._onDown(e));
      minimapCanvas.addEventListener('mousemove', e => this._onMove(e));
      minimapCanvas.addEventListener('mouseup',   e => this._onUp(e));
      minimapCanvas.addEventListener('mouseleave',() => { this._dragging = false; });
    }

    setVisible(v) {
      this._visible = v;
      this._canvas.style.display = v ? 'block' : 'none';
    }

    draw() {
      if (!this._visible) return;
      const canvas = this._canvas;
      const ctx    = this._ctx;
      const MW = canvas.width, MH = canvas.height;

      ctx.clearRect(0, 0, MW, MH);

      // Background
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#23272f';
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, MW, MH);

      const nodes = [...this._gc.model.nodes.values()];
      if (nodes.length === 0) {
        // Draw viewport rect anyway
        this._drawViewport(MW, MH, 1, 0, 0);
        return;
      }

      // Compute world bounds of all nodes
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const n of nodes) {
        minX = Math.min(minX, n.x - n.rx);
        minY = Math.min(minY, n.y - n.ry);
        maxX = Math.max(maxX, n.x + n.rx);
        maxY = Math.max(maxY, n.y + n.ry);
      }

      const PAD = 10;
      const worldW = maxX - minX + PAD * 2;
      const worldH = maxY - minY + PAD * 2;
      const scale  = Math.min((MW - 4) / worldW, (MH - 4) / worldH);
      const offX   = 2 + (MW - 4 - worldW * scale) / 2 - (minX - PAD) * scale;
      const offY   = 2 + (MH - 4 - worldH * scale) / 2 - (minY - PAD) * scale;

      // Draw edges
      const edgeColor = getComputedStyle(document.documentElement).getPropertyValue('--edge-color').trim() || '#4a5568';
      ctx.strokeStyle = edgeColor;
      ctx.lineWidth   = 0.5;
      for (const e of this._gc.model.edges) {
        const a = this._gc.model.nodes.get(e.from);
        const b = this._gc.model.nodes.get(e.to);
        if (!a || !b) continue;
        ctx.beginPath();
        ctx.moveTo(a.x * scale + offX, a.y * scale + offY);
        ctx.lineTo(b.x * scale + offX, b.y * scale + offY);
        ctx.stroke();
      }

      // Draw nodes as tiny rectangles
      const colors = { state:'#4f8ef7', algebraic:'#3ecf8e', input:'#f7a24f', output:'#f7604f' };
      for (const n of nodes) {
        const nx = n.x * scale + offX;
        const ny = n.y * scale + offY;
        const nw = Math.max(2, n.rx * scale * 2);
        const nh = Math.max(2, n.ry * scale * 2);
        ctx.fillStyle = (colors[n.type] || '#888') + 'cc';
        ctx.fillRect(nx - nw / 2, ny - nh / 2, nw, nh);
      }

      // Draw viewport rectangle
      this._drawViewport(MW, MH, scale, offX, offY);

      // Store transform for click→world conversion
      this._mmScale = scale;
      this._mmOffX  = offX;
      this._mmOffY  = offY;
    }

    _drawViewport(MW, MH, scale, offX, offY) {
      const gc = this._gc;
      const mainCanvas = gc.canvas;
      const W = mainCanvas.width, H = mainCanvas.height;
      const { scale: gcScale, ox, oy } = gc._tx;

      // World corners of the main viewport
      const wl = -ox / gcScale;
      const wt = -oy / gcScale;
      const wr = (W - ox) / gcScale;
      const wb = (H - oy) / gcScale;

      // Map to minimap coords
      const rx = wl * scale + offX;
      const ry = wt * scale + offY;
      const rw = (wr - wl) * scale;
      const rh = (wb - wt) * scale;

      const ctx = this._ctx;
      ctx.strokeStyle = 'var(--accent, #4f8ef7)';
      ctx.lineWidth   = 1.5;
      ctx.setLineDash([2, 2]);
      ctx.strokeRect(rx, ry, rw, rh);
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(79,142,247,0.08)';
      ctx.fillRect(rx, ry, rw, rh);
    }

    _mmToWorld(mx, my) {
      if (!this._mmScale) return null;
      const wx = (mx - this._mmOffX) / this._mmScale;
      const wy = (my - this._mmOffY) / this._mmScale;
      return { wx, wy };
    }

    _panToWorld(wx, wy) {
      const gc = this._gc;
      const W = gc.canvas.width, H = gc.canvas.height;
      gc._tx.ox = W / 2 - wx * gc._tx.scale;
      gc._tx.oy = H / 2 - wy * gc._tx.scale;
      gc.draw();
      if (gc.onZoomChange) gc.onZoomChange(gc._tx.scale);
      this.draw();
    }

    _onDown(e) {
      const r = this._canvas.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      this._dragging = true;
      const pos = this._mmToWorld(mx, my);
      if (pos) this._panToWorld(pos.wx, pos.wy);
    }

    _onMove(e) {
      if (!this._dragging) return;
      const r = this._canvas.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const pos = this._mmToWorld(mx, my);
      if (pos) this._panToWorld(pos.wx, pos.wy);
    }

    _onUp() { this._dragging = false; }
  }

  window.Minimap = Minimap;

})();
