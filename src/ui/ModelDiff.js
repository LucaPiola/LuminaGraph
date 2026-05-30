/**
 * ModelDiff.js — Side-by-side model comparison panel
 */
(function () {

  class ModelDiff {
    constructor(containerEl) {
      this._container = containerEl;
      this._modelA = null;
      this._modelB = null;
      this._render();
    }

    _render() {
      this._container.innerHTML = `
        <div class="diff-inputs">
          <div class="diff-col">
            <div class="diff-col-label">Model A</div>
            <textarea id="diff-a" class="diff-textarea" placeholder='Paste model JSON or use file input…'></textarea>
            <div style="display:flex;gap:6px;margin-top:4px">
              <button id="diff-load-a">📂 Load file</button>
              <input type="file" id="diff-file-a" accept=".json" style="display:none" />
              <span id="diff-a-name" style="font-size:10px;color:var(--muted);align-self:center"></span>
            </div>
          </div>
          <div class="diff-col">
            <div class="diff-col-label">Model B</div>
            <textarea id="diff-b" class="diff-textarea" placeholder='Paste model JSON or use file input…'></textarea>
            <div style="display:flex;gap:6px;margin-top:4px">
              <button id="diff-load-b">📂 Load file</button>
              <input type="file" id="diff-file-b" accept=".json" style="display:none" />
              <span id="diff-b-name" style="font-size:10px;color:var(--muted);align-self:center"></span>
            </div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="diff-run-btn">⚡ Compare</button>
          <button id="diff-clear-btn">Clear</button>
        </div>
        <div id="diff-result" class="diff-result"></div>
      `;

      this._container.querySelector('#diff-load-a').addEventListener('click', () =>
        this._container.querySelector('#diff-file-a').click()
      );
      this._container.querySelector('#diff-load-b').addEventListener('click', () =>
        this._container.querySelector('#diff-file-b').click()
      );

      this._wireFile('diff-file-a', 'diff-a', 'diff-a-name');
      this._wireFile('diff-file-b', 'diff-b', 'diff-b-name');

      this._container.querySelector('#diff-run-btn').addEventListener('click', () => this._compare());
      this._container.querySelector('#diff-clear-btn').addEventListener('click', () => {
        this._container.querySelector('#diff-a').value = '';
        this._container.querySelector('#diff-b').value = '';
        this._container.querySelector('#diff-a-name').textContent = '';
        this._container.querySelector('#diff-b-name').textContent = '';
        this._container.querySelector('#diff-result').innerHTML = '';
      });
    }

    _wireFile(inputId, textareaId, nameId) {
      this._container.querySelector('#' + inputId).addEventListener('change', function () {
        if (!this.files[0]) return;
        const nameEl = document.getElementById(nameId) ||
                       this.closest('.diff-inputs').querySelector('#' + nameId);
        const file = this.files[0];
        const reader = new FileReader();
        reader.onload = ev => {
          const ta = document.getElementById(textareaId);
          if (ta) ta.value = ev.target.result;
          const ne = document.getElementById(nameId);
          if (ne) ne.textContent = file.name;
        };
        reader.readAsText(file);
        this.value = '';
      });
    }

    _compare() {
      const textA = this._container.querySelector('#diff-a').value.trim();
      const textB = this._container.querySelector('#diff-b').value.trim();
      const resultEl = this._container.querySelector('#diff-result');

      let jsonA, jsonB;
      try { jsonA = JSON.parse(textA); } catch (e) { resultEl.innerHTML = `<span class="console-err">Model A JSON error: ${e.message}</span>`; return; }
      try { jsonB = JSON.parse(textB); } catch (e) { resultEl.innerHTML = `<span class="console-err">Model B JSON error: ${e.message}</span>`; return; }

      const nodesA = {};
      const nodesB = {};
      for (const n of (jsonA.nodes || [])) nodesA[n.name] = n;
      for (const n of (jsonB.nodes || [])) nodesB[n.name] = n;

      const allNames = new Set([...Object.keys(nodesA), ...Object.keys(nodesB)]);

      const onlyA    = [];
      const onlyB    = [];
      const changed  = [];
      const same     = [];

      for (const name of allNames) {
        if (!nodesB[name]) { onlyA.push(name); continue; }
        if (!nodesA[name]) { onlyB.push(name); continue; }
        const a = nodesA[name], b = nodesB[name];
        const diffs = [];
        if (a.type    !== b.type)    diffs.push(`type: ${a.type} → ${b.type}`);
        if (a.expr    !== b.expr)    diffs.push(`expr: "${a.expr}" → "${b.expr}"`);
        if (a.initVal !== b.initVal) diffs.push(`initVal: ${a.initVal} → ${b.initVal}`);
        if (diffs.length) changed.push({ name, diffs });
        else same.push(name);
      }

      // Edges
      const edgeKey = e => `${e.from}→${e.to}`;
      const edgesA = new Set((jsonA.edges || []).map(edgeKey));
      const edgesB = new Set((jsonB.edges || []).map(edgeKey));
      const edgesOnlyA = [...edgesA].filter(k => !edgesB.has(k));
      const edgesOnlyB = [...edgesB].filter(k => !edgesA.has(k));

      let html = '<div class="diff-output">';

      if (same.length)    html += this._section('Unchanged nodes', same.map(n => `<span class="diff-same">${n}</span>`).join(' '), '#6b7280');
      if (onlyA.length)   html += this._section('Only in A', onlyA.map(n => `<span class="diff-only-a">${n}</span>`).join(' '), 'var(--red)');
      if (onlyB.length)   html += this._section('Only in B', onlyB.map(n => `<span class="diff-only-b">${n}</span>`).join(' '), 'var(--green)');
      if (changed.length) html += this._section('Changed', changed.map(c =>
        `<div class="diff-changed-item"><b>${c.name}</b>: ${c.diffs.join('; ')}</div>`
      ).join(''), 'var(--orange)');

      if (edgesOnlyA.length) html += this._section('Edges only in A', edgesOnlyA.join(', '), 'var(--red)');
      if (edgesOnlyB.length) html += this._section('Edges only in B', edgesOnlyB.join(', '), 'var(--green)');

      if (onlyA.length === 0 && onlyB.length === 0 && changed.length === 0
          && edgesOnlyA.length === 0 && edgesOnlyB.length === 0) {
        html += '<div style="color:var(--green);font-weight:600">✓ Models are identical</div>';
      }

      html += '</div>';
      resultEl.innerHTML = html;
    }

    _section(title, content, color) {
      return `<div class="diff-section">
        <div class="diff-section-title" style="color:${color}">${title}</div>
        <div class="diff-section-content">${content}</div>
      </div>`;
    }
  }

  window.ModelDiff = ModelDiff;

})();
