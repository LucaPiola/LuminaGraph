/**
 * ConsolePanel.js — REPL / console panel for evaluating expressions
 * against the current simulation environment.
 */
(function () {

  class ConsolePanel {
    /**
     * @param {HTMLElement} containerEl
     * @param {Function}    getEnv  – returns { t, dt, nodeName: value, ... }
     */
    constructor(containerEl, getEnv) {
      this._container = containerEl;
      this._getEnv    = getEnv;
      this._history   = [];
      this._render();
    }

    _render() {
      this._container.innerHTML = `
        <div id="console-output" class="console-output"></div>
        <div class="console-input-row">
          <span class="console-prompt">&gt;</span>
          <input id="console-input" type="text" class="console-input"
            placeholder="e.g. x * 2 + t" autocomplete="off" spellcheck="false" />
          <button id="console-run-btn" title="Run (Enter)">▶</button>
          <button id="console-clear-btn" title="Clear">✕</button>
        </div>
      `;

      this._output   = this._container.querySelector('#console-output');
      this._input    = this._container.querySelector('#console-input');
      const runBtn   = this._container.querySelector('#console-run-btn');
      const clearBtn = this._container.querySelector('#console-clear-btn');

      runBtn  .addEventListener('click', () => this._eval());
      clearBtn.addEventListener('click', () => this._clear());

      this._input.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); this._eval(); }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = this._history[this._histIdx - 1];
          if (prev !== undefined) { this._histIdx--; this._input.value = prev; }
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = this._history[this._histIdx + 1];
          if (next !== undefined) { this._histIdx++; this._input.value = next; }
          else { this._histIdx = this._history.length; this._input.value = ''; }
        }
      });

      this._histIdx = 0;
    }

    _eval() {
      const code = this._input.value.trim();
      if (!code) return;

      this._history.push(code);
      this._histIdx = this._history.length;
      this._input.value = '';

      const env = this._getEnv();

      let result;
      try {
        const keys   = Object.keys(env);
        const vals   = keys.map(k => env[k]);
        const fn     = new Function(...keys, `"use strict"; return (${code});`);
        result       = fn(...vals);
      } catch (err) {
        this._appendLine(code, undefined, err.message);
        return;
      }

      this._appendLine(code, result, null);
    }

    _appendLine(code, result, error) {
      const entry = document.createElement('div');
      entry.className = 'console-entry';

      const inputEl = document.createElement('div');
      inputEl.className = 'console-in';
      inputEl.textContent = '> ' + code;
      entry.appendChild(inputEl);

      const outputEl = document.createElement('div');
      if (error) {
        outputEl.className = 'console-err';
        outputEl.textContent = '! ' + error;
      } else {
        outputEl.className = 'console-out';
        outputEl.textContent = '← ' + (typeof result === 'object' ? JSON.stringify(result) : String(result));
      }
      entry.appendChild(outputEl);
      this._output.appendChild(entry);
      this._output.scrollTop = this._output.scrollHeight;
    }

    _clear() {
      this._output.innerHTML = '';
    }
  }

  window.ConsolePanel = ConsolePanel;

})();
