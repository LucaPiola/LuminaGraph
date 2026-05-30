/**
 * Minimal test runner — no external dependencies.
 * Usage: node tests/runner.js
 */

let passed = 0, failed = 0;
let currentSuite = '';

function describe(label, fn) {
  currentSuite = label;
  console.log(`\n  ${label}`);
  fn();
}

function it(name, fn) {
  try {
    fn();
    console.log(`    ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`    ✗ ${name}`);
    console.log(`        ${err.message}`);
    failed++;
  }
}

function assert(cond, msg = 'Assertion failed') {
  if (!cond) throw new Error(msg);
}

function assertEqual(a, b, msg) {
  if (a !== b) throw new Error(msg ?? `Expected ${JSON.stringify(a)} === ${JSON.stringify(b)}`);
}

/** Pass if |a - b| < eps */
function assertClose(a, b, eps = 1e-6, msg) {
  const diff = Math.abs(a - b);
  if (diff > eps) throw new Error(msg ?? `Expected |${a} - ${b}| < ${eps}, got ${diff.toFixed(10)}`);
}

/** Pass if a < b */
function assertLess(a, b, msg) {
  if (a >= b) throw new Error(msg ?? `Expected ${a} < ${b}`);
}

function summary() {
  const total = passed + failed;
  console.log(`\n  ─────────────────────────────────────`);
  console.log(`  ${passed}/${total} passed${failed > 0 ? `, ${failed} FAILED` : ' ✓'}`);
  console.log('');
  if (failed > 0) process.exit(1);
}

module.exports = { describe, it, assert, assertEqual, assertClose, assertLess, summary };
