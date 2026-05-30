// Test entry point — runs all test suites in order
const { summary } = require('./runner');

require('./ExpressionScope.test');
require('./Topology.test');
require('./Integrators.test');

summary();
