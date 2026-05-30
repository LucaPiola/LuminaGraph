/**
 * Topology
 *
 * Pure topological-sort utilities for the STGraph node graph.
 * No dependencies on STNode or STModel — operates on plain id/type/edge data
 * so it can be tested in isolation.
 *
 * Evaluation order rule:
 *   1. Input nodes  → always first (constants, no dependencies)
 *   2. State nodes  → second (expose their *previous* value to algebraic nodes)
 *   3. Algebraic / Output nodes → Kahn's BFS on inter-algebraic dependencies
 *
 * State→algebraic edges are NOT treated as ordering constraints because state
 * nodes expose their value from the *previous* timestep; there is no circular
 * wait. Only algebraic→algebraic and input→algebraic edges create ordering
 * requirements.
 */

/**
 * @typedef {{ id: number, type: 'state'|'algebraic'|'input'|'output' }} NodeDescriptor
 * @typedef {{ from: number, to: number }} Edge
 */

/**
 * Compute a valid evaluation order for a set of nodes and edges.
 *
 * @param {NodeDescriptor[]} nodes
 * @param {Edge[]}           edges
 * @returns {number[]} Ordered array of node ids
 */
function topoSort(nodes, edges) {
  const byId = new Map(nodes.map(n => [n.id, n]));

  // ── Partition by role ──────────────────────────────────────────────────────
  const inputs  = nodes.filter(n => n.type === 'input') .map(n => n.id);
  const states  = nodes.filter(n => n.type === 'state') .map(n => n.id);
  const derived = nodes.filter(n => n.type === 'algebraic' || n.type === 'output').map(n => n.id);

  // ── Build dependency graph for algebraic/output nodes only ─────────────────
  // dep[id] = set of derived-node ids that `id` depends on (must come before it)
  const dep = new Map(derived.map(id => [id, new Set()]));

  for (const edge of edges) {
    const src = byId.get(edge.from);
    const dst = byId.get(edge.to);
    if (!src || !dst) continue;
    const dstIsDerived = dst.type === 'algebraic' || dst.type === 'output';
    const srcIsDerived = src.type === 'algebraic' || src.type === 'output';
    if (dstIsDerived && srcIsDerived) {
      dep.get(dst.id).add(src.id);
    }
  }

  // ── Kahn's BFS on derived nodes ────────────────────────────────────────────
  const inDeg = new Map(derived.map(id => [id, dep.get(id).size]));
  const queue = derived.filter(id => inDeg.get(id) === 0);
  const sortedDerived = [];
  const visited = new Set(queue);

  while (queue.length > 0) {
    const cur = queue.shift();
    sortedDerived.push(cur);
    // find derived nodes that list `cur` as a dependency
    for (const [id, deps] of dep) {
      if (deps.has(cur) && !visited.has(id)) {
        deps.delete(cur);
        if (deps.size === 0) {
          queue.push(id);
          visited.add(id);
        }
      }
    }
  }

  // Any remaining derived nodes (cycles) are appended in original order
  for (const id of derived) {
    if (!visited.has(id)) sortedDerived.push(id);
  }

  return [...inputs, ...states, ...sortedDerived];
}

// ── Dual-environment export ───────────────────────────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { topoSort };
}
