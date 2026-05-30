const { describe, it, assert, assertEqual } = require('./runner');
const { topoSort } = require('../src/core/Topology');

// Helper: build node descriptors
const n = (id, type) => ({ id, type });
const e = (from, to) => ({ from, to });

describe('Topology — basic ordering rules', () => {
  it('input nodes come before algebraic nodes', () => {
    const nodes = [n(1, 'algebraic'), n(2, 'input')];
    const order = topoSort(nodes, [e(2, 1)]);
    assert(order.indexOf(2) < order.indexOf(1), `inputs must precede algebraic: ${order}`);
  });

  it('state nodes come before algebraic nodes', () => {
    const nodes = [n(1, 'algebraic'), n(2, 'state')];
    const order = topoSort(nodes, [e(2, 1)]);
    assert(order.indexOf(2) < order.indexOf(1), `state must precede algebraic: ${order}`);
  });

  it('all nodes appear in the result', () => {
    const nodes = [n(1,'state'), n(2,'input'), n(3,'algebraic'), n(4,'output')];
    const order = topoSort(nodes, []);
    assertEqual(order.length, 4);
  });
});

describe('Topology — algebraic chain ordering', () => {
  it('A→B→C: B comes before C', () => {
    // A (input) → B (algebraic) → C (algebraic)
    const nodes = [n(1,'input'), n(2,'algebraic'), n(3,'algebraic')];
    const edges = [e(1, 2), e(2, 3)];
    const order = topoSort(nodes, edges);
    assert(order.indexOf(2) < order.indexOf(3), `B must precede C: ${order}`);
  });

  it('diamond A→B, A→C, B+C→D: B and C before D', () => {
    const nodes = [n(1,'input'), n(2,'algebraic'), n(3,'algebraic'), n(4,'algebraic')];
    const edges = [e(1,2), e(1,3), e(2,4), e(3,4)];
    const order = topoSort(nodes, edges);
    assert(order.indexOf(2) < order.indexOf(4), `B must precede D: ${order}`);
    assert(order.indexOf(3) < order.indexOf(4), `C must precede D: ${order}`);
  });

  it('state→algebraic edge does NOT create algebraic ordering constraint', () => {
    // State node 1 feeds algebraic 2 and 3; 2 and 3 have no inter-dependency.
    // Both should appear after state but their relative order is unconstrained.
    const nodes = [n(1,'state'), n(2,'algebraic'), n(3,'algebraic')];
    const edges = [e(1,2), e(1,3)];
    const order = topoSort(nodes, edges);
    assertEqual(order.length, 3);
    assert(order.indexOf(1) < order.indexOf(2));
    assert(order.indexOf(1) < order.indexOf(3));
  });
});

describe('Topology — cycle handling', () => {
  it('does not throw on a cycle', () => {
    const nodes = [n(1,'algebraic'), n(2,'algebraic')];
    const edges = [e(1,2), e(2,1)];
    let ok = false;
    try { topoSort(nodes, edges); ok = true; } catch {}
    assert(ok, 'topoSort threw on a cyclic graph');
  });

  it('includes all nodes even when cycle is present', () => {
    const nodes = [n(1,'algebraic'), n(2,'algebraic'), n(3,'input')];
    const edges = [e(1,2), e(2,1)];
    const order = topoSort(nodes, edges);
    assertEqual(order.length, 3);
  });
});

describe('Topology — edge cases', () => {
  it('empty graph returns empty array', () => {
    assertEqual(topoSort([], []).length, 0);
  });

  it('single node returns that node', () => {
    const order = topoSort([n(42,'input')], []);
    assertEqual(order.length, 1);
    assertEqual(order[0], 42);
  });

  it('stale edge (missing node) does not crash', () => {
    const nodes = [n(1,'algebraic')];
    const edges = [e(99, 1)]; // node 99 doesn't exist
    let ok = false;
    try { topoSort(nodes, edges); ok = true; } catch {}
    assert(ok, 'topoSort threw on a stale edge');
  });
});
