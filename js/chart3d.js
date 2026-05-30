/**
 * Chart3D — interactive 3D phase space orbit using Three.js
 *
 * Renders the trajectory (x,y,z) of any three model variables as a glowing
 * line in 3D space. OrbitControls allow rotate/zoom/pan.
 */
class Chart3D {
  constructor(containerEl) {
    this.container   = containerEl;
    this._data       = null;
    this._model      = null;
    this._psX        = null;
    this._psY        = null;
    this._psZ        = null;
    this._ready      = false;
    this._animId     = null;
    this._line       = null;
    this._axesHelper = null;
    this._renderer   = null;
    this._scene      = null;
    this._camera     = null;
    this._controls   = null;
    this._defaultCamPos = { x: 50, y: 30, z: 60 };
  }

  // ── Lazy init — only create WebGL context when tab is first shown ────────
  init() {
    if (this._ready || typeof THREE === 'undefined') return false;
    this._ready = true;

    const W = this.container.clientWidth  || 520;
    const H = this.container.clientHeight || 300;

    // Scene
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0x08091a);
    this._scene.fog = new THREE.FogExp2(0x08091a, 0.004);

    // Camera
    this._camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 2000);
    this._camera.position.set(
      this._defaultCamPos.x,
      this._defaultCamPos.y,
      this._defaultCamPos.z
    );

    // Renderer
    this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this._renderer.setSize(W, H);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this._renderer.domElement);

    // OrbitControls
    this._controls = new THREE.OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping    = true;
    this._controls.dampingFactor    = 0.06;
    this._controls.rotateSpeed      = 0.8;
    this._controls.zoomSpeed        = 1.2;
    this._controls.minDistance      = 5;
    this._controls.maxDistance      = 500;
    this._controls.enablePan        = true;

    // Grid (subtle)
    const grid = new THREE.GridHelper(100, 20, 0x1a1d35, 0x141728);
    this._scene.add(grid);

    // Axes labels (just small dots at tips)
    this._buildAxes();

    // Start render loop
    const tick = () => {
      this._animId = requestAnimationFrame(tick);
      this._controls.update();
      this._renderer.render(this._scene, this._camera);
    };
    tick();

    return true;
  }

  _buildAxes() {
    // Custom thin axes with labels
    const axLen = 30;
    const mat = (hex) => new THREE.LineBasicMaterial({ color: hex, linewidth: 1 });
    const line = (points, hex) => {
      const g = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)));
      return new THREE.Line(g, mat(hex));
    };
    this._scene.add(line([[0,0,0],[axLen,0,0]], 0x4f8ef7)); // X — blue
    this._scene.add(line([[0,0,0],[0,axLen,0]], 0x3ecf8e)); // Y — green
    this._scene.add(line([[0,0,0],[0,0,axLen]], 0xf87171)); // Z — red

    // Tick spheres at axis tips
    const sphere = (pos, color) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 8, 8),
        new THREE.MeshBasicMaterial({ color })
      );
      mesh.position.set(...pos);
      this._scene.add(mesh);
    };
    sphere([axLen, 0, 0], 0x4f8ef7);
    sphere([0, axLen, 0], 0x3ecf8e);
    sphere([0, 0, axLen], 0xf87171);
  }

  // ── Public: feed new simulation data ────────────────────────────────────
  setData(result, model) {
    this._data  = result;
    this._model = model;
    this._updateSelectors();
    this.draw();
  }

  // ── Draw the 3D trajectory ───────────────────────────────────────────────
  draw() {
    if (!this._ready || !this._data) return;

    const { series } = this._data;
    const xVals = series[this._psX];
    const yVals = series[this._psY];
    const zVals = series[this._psZ];
    if (!xVals || !yVals || !zVals || xVals.length < 2) return;

    // Remove old trajectory
    if (this._line) {
      this._scene.remove(this._line);
      this._line.geometry.dispose();
      this._line.material.dispose();
      this._line = null;
    }

    const N = Math.min(xVals.length, yVals.length, zVals.length);

    // Build points array — THREE Y is "up", so map model-Z → THREE-Y
    const pts = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pts[i * 3]     = xVals[i];
      pts[i * 3 + 1] = zVals[i]; // model Z → vertical in 3D view
      pts[i * 3 + 2] = yVals[i];
    }

    // Vertex colors: gradient blue → purple → cyan
    const cols = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      // Palette: #4f8ef7 → #a78bfa → #7ef7c0
      if (t < 0.5) {
        const s = t * 2;
        cols[i*3]   = 0.31 + (0.655 - 0.31) * s;
        cols[i*3+1] = 0.557 + (0.545 - 0.557) * s;
        cols[i*3+2] = 0.969 + (0.980 - 0.969) * s;
      } else {
        const s = (t - 0.5) * 2;
        cols[i*3]   = 0.655 + (0.494 - 0.655) * s;
        cols[i*3+1] = 0.545 + (0.969 - 0.545) * s;
        cols[i*3+2] = 0.980 + (0.753 - 0.980) * s;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(cols, 3));

    const mat = new THREE.LineBasicMaterial({ vertexColors: true, linewidth: 1 });
    this._line = new THREE.Line(geo, mat);
    this._scene.add(this._line);

    // Auto-fit camera to data bounds on first draw
    if (!this._hasFit) {
      this._hasFit = true;
      this._fitCamera(xVals, yVals, zVals);
    }
  }

  _fitCamera(xVals, yVals, zVals) {
    let xMid = 0, yMid = 0, zMid = 0, maxSpread = 1;
    const N = xVals.length;
    for (let i = 0; i < N; i++) { xMid += xVals[i]; yMid += yVals[i]; zMid += zVals[i]; }
    xMid /= N; yMid /= N; zMid /= N;
    for (let i = 0; i < N; i++) {
      maxSpread = Math.max(maxSpread,
        Math.abs(xVals[i] - xMid), Math.abs(yVals[i] - yMid), Math.abs(zVals[i] - zMid));
    }
    const dist = maxSpread * 2.5;
    this._controls.target.set(xMid, zMid, yMid);
    this._camera.position.set(xMid + dist, zMid + dist * 0.6, yMid + dist);
    this._controls.update();
    this._defaultCamPos = { x: xMid + dist, y: zMid + dist * 0.6, z: yMid + dist };
    this._defaultTarget = { x: xMid, y: zMid, z: yMid };
  }

  resetCamera() {
    if (!this._ready) return;
    if (this._defaultTarget) {
      this._controls.target.set(
        this._defaultTarget.x, this._defaultTarget.y, this._defaultTarget.z
      );
    }
    this._camera.position.set(
      this._defaultCamPos.x, this._defaultCamPos.y, this._defaultCamPos.z
    );
    this._controls.update();
  }

  // ── Selectors ────────────────────────────────────────────────────────────
  _updateSelectors() {
    const xEl = document.getElementById('ps3-x');
    const yEl = document.getElementById('ps3-y');
    const zEl = document.getElementById('ps3-z');
    if (!xEl || !yEl || !zEl || !this._model) return;

    const nodes = [...this._model.nodes.values()].filter(n => n.type !== 'input');
    const names = nodes.map(n => n.name);
    if (!names.length) return;

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

    this._psX = rebuild(xEl, this._psX, 0);
    this._psY = rebuild(yEl, this._psY, Math.min(1, names.length - 1));
    this._psZ = rebuild(zEl, this._psZ, Math.min(2, names.length - 1));

    if (!xEl.dataset.wired3d) {
      xEl.dataset.wired3d = '1';
      xEl.addEventListener('change', () => { this._psX = xEl.value; this._hasFit = false; this.draw(); });
      yEl.dataset.wired3d = '1';
      yEl.addEventListener('change', () => { this._psY = yEl.value; this._hasFit = false; this.draw(); });
      zEl.dataset.wired3d = '1';
      zEl.addEventListener('change', () => { this._psZ = zEl.value; this._hasFit = false; this.draw(); });
    }
  }

  // ── Resize when panel changes size ───────────────────────────────────────
  resize() {
    if (!this._ready) return;
    const W = this.container.clientWidth;
    const H = this.container.clientHeight;
    if (!W || !H) return;
    this._camera.aspect = W / H;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(W, H);
  }

  // ── Pause rendering when tab is hidden ───────────────────────────────────
  pause()  { if (this._animId) { cancelAnimationFrame(this._animId); this._animId = null; } }
  resume() {
    if (this._ready && !this._animId) {
      const tick = () => {
        this._animId = requestAnimationFrame(tick);
        this._controls.update();
        this._renderer.render(this._scene, this._camera);
      };
      tick();
    }
  }
}
