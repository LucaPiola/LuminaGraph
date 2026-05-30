/**
 * ErrorLogger
 *
 * Captures compile/runtime errors with the full model snapshot at the moment
 * of failure. Logs are persisted in localStorage and downloadable as JSON.
 *
 * Each log entry is stored as:
 *   {
 *     id:        string,           // "error-<ISO-timestamp>"
 *     timestamp: string,           // ISO 8601
 *     type:      string,           // 'compile' | 'runtime' | 'load'
 *     messages:  string[],         // error message(s)
 *     model:     object,           // model.toJSON() snapshot
 *   }
 *
 * Usage:
 *   const logger = new ErrorLogger(model);
 *   logger.log('compile', ['x: Unexpected token …']);
 *   logger.download();   // triggers browser download of all logs as JSON
 */
class ErrorLogger {
  static STORAGE_KEY = 'stgraph_error_log';
  static MAX_ENTRIES = 100;

  /** @param {STModel} model – live model reference for snapshot */
  constructor(model) {
    this._model    = model;
    this._entries  = this._loadFromStorage();
    this._listeners = []; // (count) => void
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Record an error with the current model state.
   * @param {'compile'|'runtime'|'load'} type
   * @param {string[]} messages
   */
  log(type, messages) {
    const entry = {
      id:        `error-${new Date().toISOString()}`,
      timestamp: new Date().toISOString(),
      type,
      messages,
      model: this._model.toJSON(),
    };
    this._entries.push(entry);

    // Cap to MAX_ENTRIES (drop oldest)
    if (this._entries.length > ErrorLogger.MAX_ENTRIES) {
      this._entries = this._entries.slice(-ErrorLogger.MAX_ENTRIES);
    }

    this._saveToStorage();
    this._notify();
    console.error(`[STGraph ${type}]`, messages.join(' | '), '\nModel snapshot logged.');
  }

  /** Total number of stored error entries */
  get count() { return this._entries.length; }

  /** Download all entries as a pretty-printed JSON file */
  download() {
    if (this._entries.length === 0) return;
    const blob = new Blob(
      [JSON.stringify(this._entries, null, 2)],
      { type: 'application/json' }
    );
    const ts  = new Date().toISOString().replace(/[:.]/g, '-');
    const url = URL.createObjectURL(blob);
    const a   = Object.assign(document.createElement('a'), {
      href: url,
      download: `stgraph-errors-${ts}.json`,
    });
    a.click();
    URL.revokeObjectURL(url);
  }

  /** Download a single entry by index */
  downloadEntry(index) {
    const entry = this._entries[index];
    if (!entry) return;
    const blob = new Blob([JSON.stringify(entry, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), {
      href: url,
      download: `${entry.id}.json`,
    });
    a.click();
    URL.revokeObjectURL(url);
  }

  /** Remove all stored entries */
  clear() {
    this._entries = [];
    this._saveToStorage();
    this._notify();
  }

  /** Subscribe to count changes: fn(count) */
  onChange(fn) { this._listeners.push(fn); }

  // ── Private ────────────────────────────────────────────────────────────────

  _loadFromStorage() {
    try {
      return JSON.parse(localStorage.getItem(ErrorLogger.STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  _saveToStorage() {
    try {
      localStorage.setItem(ErrorLogger.STORAGE_KEY, JSON.stringify(this._entries));
    } catch {
      // localStorage might be unavailable (file:// in some browsers)
    }
  }

  _notify() {
    for (const fn of this._listeners) fn(this._entries.length);
  }
}
