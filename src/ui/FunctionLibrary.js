/**
 * FunctionLibrary.js — User-defined STEL function extensions
 * Stores functions in localStorage and registers them into ExpressionScope.
 */
(function () {

  const STORAGE_KEY = 'stgraph_functions';

  class FunctionLibrary {
    /**
     * @param {HTMLElement} containerEl
     * @param {object}      scope  – the ExpressionScope object (will be extended via _userFns)
     */
    constructor(containerEl, scope) {
      this._container = containerEl;
      this._scope     = scope;
      this._fns       = this._load();
      this._registerAll();
      this._render();
    }

    _load() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch { return []; }
    }

    _save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._fns));
    }

    _registerAll() {
      for (const fn of this._fns) {
        try { this._registerOne(fn); } catch (_) {}
      }
    }

    _registerOne(fn) {
      const argList = fn.args.split(',').map(s => s.trim()).filter(Boolean);
      // Store in the module-level mutable bag — STNode.compile picks it up via scope
      FunctionLibrary._userFns[fn.name] = new Function(...argList, fn.body);
    }

    _unregisterOne(name) {
      delete FunctionLibrary._userFns[name];
    }

    _render() {
      this._container.innerHTML = `
        <div class="fn-add-form">
          <div class="fn-row">
            <input id="fn-name"  type="text" placeholder="Function name (e.g. sigmoid)" class="fn-input" />
            <input id="fn-args"  type="text" placeholder="Args (e.g. x, k)" class="fn-input" />
          </div>
          <textarea id="fn-body" rows="3" placeholder="return 1/(1+Math.exp(-k*x));" class="fn-body"></textarea>
          <div class="fn-row">
            <button id="fn-add-btn">+ Add Function</button>
            <span id="fn-error" class="error-msg"></span>
          </div>
        </div>
        <div id="fn-list" class="fn-list"></div>
      `;

      this._nameInput = this._container.querySelector('#fn-name');
      this._argsInput = this._container.querySelector('#fn-args');
      this._bodyInput = this._container.querySelector('#fn-body');
      this._errorEl   = this._container.querySelector('#fn-error');
      const addBtn    = this._container.querySelector('#fn-add-btn');

      addBtn.addEventListener('click', () => this._add());
      this._renderList();
    }

    _add() {
      const name = this._nameInput.value.trim();
      const args = this._argsInput.value.trim();
      const body = this._bodyInput.value.trim();
      this._errorEl.textContent = '';

      if (!name) { this._errorEl.textContent = 'Name required'; return; }
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
        this._errorEl.textContent = 'Invalid name (letters/numbers/underscore)'; return;
      }
      if (!body) { this._errorEl.textContent = 'Body required'; return; }

      // Test compile
      try {
        const argList = args.split(',').map(s => s.trim()).filter(Boolean);
        new Function(...argList, body);
      } catch (err) {
        this._errorEl.textContent = 'Syntax error: ' + err.message; return;
      }

      // Remove existing with same name
      this._fns = this._fns.filter(f => f.name !== name);
      const fn = { name, args, body };
      this._fns.push(fn);
      this._save();
      this._registerOne(fn);

      this._nameInput.value = '';
      this._argsInput.value = '';
      this._bodyInput.value = '';
      this._renderList();
    }

    _delete(name) {
      this._unregisterOne(name);
      this._fns = this._fns.filter(f => f.name !== name);
      this._save();
      this._renderList();
    }

    _renderList() {
      const listEl = this._container.querySelector('#fn-list');
      if (!listEl) return;
      if (this._fns.length === 0) {
        listEl.innerHTML = '<div class="sp-empty">No functions defined</div>';
        return;
      }
      listEl.innerHTML = this._fns.map(fn => `
        <div class="fn-item" data-name="${fn.name}">
          <div class="fn-item-header">
            <span class="fn-item-sig"><b>${fn.name}</b>(${fn.args})</span>
            <button class="fn-delete-btn icon-btn" data-name="${fn.name}" title="Delete">✕</button>
          </div>
          <pre class="fn-item-body">${fn.body}</pre>
        </div>
      `).join('');

      listEl.querySelectorAll('.fn-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => this._delete(btn.dataset.name));
      });
    }

    getFunctions() { return [...this._fns]; }
  }

  // Mutable bag of user-defined functions — never frozen, readable by STNode via scope
  FunctionLibrary._userFns = {};

  window.FunctionLibrary = FunctionLibrary;

})();
