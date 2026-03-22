(function attachGraphSemantics(global) {
  const VARIABLE_NAME_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
  const RESERVED_WORDS = new Set([
    "break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete",
    "do", "else", "export", "extends", "finally", "for", "function", "if", "import", "in",
    "instanceof", "let", "new", "return", "super", "switch", "this", "throw", "try", "typeof",
    "var", "void", "while", "with", "yield", "enum", "await", "implements", "interface",
    "package", "private", "protected", "public", "static", "null", "true", "false", "time",
    "t0", "t1", "dt",
  ]);
  const probability = global.GraphProbability || {};
  const EXPRESSION_CACHE_LIMIT = 1000;
  const expressionCache = new Map();

  function unavailablePropertyGetter() {
    throw new Error("getProperty is only available in node expressions");
  }

  function unavailablePropertySetter() {
    throw new Error("setProperty is only available in node expressions");
  }

  function unavailableModelPropertyGetter() {
    throw new Error("getModelProperty is unavailable");
  }

  function unavailableModelPropertySetter() {
    throw new Error("setModelProperty is unavailable");
  }

  function unavailableIntegral() {
    throw new Error("integral is only available in state node expressions");
  }

  function unavailableArrayConstructor() {
    throw new Error("array is a special expression form");
  }

  function unavailableMapOperator() {
    throw new Error("map is a special expression form");
  }

  function unavailableFilterOperator() {
    throw new Error("filter is a special expression form");
  }

  function unavailableReduceOperator() {
    throw new Error("reduce is a special expression form");
  }

  function unavailableDistribution(name) {
    return () => {
      throw new Error(`${name} is unavailable`);
    };
  }

  function sameArrayShape(left, right) {
    if (Array.isArray(left) !== Array.isArray(right)) {
      return false;
    }
    if (!Array.isArray(left)) {
      return true;
    }
    if (left.length !== right.length) {
      return false;
    }
    return left.every((item, idx) => sameArrayShape(item, right[idx]));
  }

  function mapFunctionArgs(args, scalarFn) {
    const ref = args.find((arg) => Array.isArray(arg));
    if (!ref) {
      return scalarFn(...args);
    }
    if (!args.every((arg) => !Array.isArray(arg) || sameArrayShape(ref, arg))) {
      throw new Error("function arguments must have matching shapes");
    }
    return ref.map((_, idx) => mapFunctionArgs(
      args.map((arg) => (Array.isArray(arg) ? arg[idx] : arg)),
      scalarFn,
    ));
  }

  function vectorizeFunction(fn) {
    return (...args) => mapFunctionArgs(args, (...scalarArgs) => fn(...scalarArgs));
  }

  const MATH_SCOPE = Object.freeze({
    __if: vectorizeFunction((condition, whenTrue, whenFalse) => (condition ? whenTrue : whenFalse)),
    sin: vectorizeFunction(Math.sin),
    cos: vectorizeFunction(Math.cos),
    tan: vectorizeFunction(Math.tan),
    asin: vectorizeFunction(Math.asin),
    acos: vectorizeFunction(Math.acos),
    atan: vectorizeFunction(Math.atan),
    atan2: vectorizeFunction(Math.atan2),
    sinh: vectorizeFunction(Math.sinh),
    cosh: vectorizeFunction(Math.cosh),
    tanh: vectorizeFunction(Math.tanh),
    exp: vectorizeFunction(Math.exp),
    log: vectorizeFunction(Math.log),
    log10: vectorizeFunction(Math.log10),
    log2: vectorizeFunction(Math.log2),
    sqrt: vectorizeFunction(Math.sqrt),
    pow: vectorizeFunction(Math.pow),
    abs: vectorizeFunction(Math.abs),
    min: vectorizeFunction(Math.min),
    max: vectorizeFunction(Math.max),
    round: vectorizeFunction(Math.round),
    floor: vectorizeFunction(Math.floor),
    ceil: vectorizeFunction(Math.ceil),
    trunc: vectorizeFunction(Math.trunc),
    int: vectorizeFunction(Math.trunc),
    sign: vectorizeFunction(Math.sign),
    rand: Math.random,
    range: (...args) => {
      if (args.length === 1) {
        return buildNumericRange(0, args[0], 1);
      }
      if (args.length === 2) {
        return buildNumericRange(args[0], args[1], null);
      }
      if (args.length === 3) {
        return buildNumericRange(args[0], args[1], args[2]);
      }
      throw new Error("range expects 1, 2, or 3 arguments");
    },
    array: unavailableArrayConstructor,
    map: unavailableMapOperator,
    filter: unavailableFilterOperator,
    reduce: unavailableReduceOperator,
    gaussian: typeof probability.gaussian === "function" ? probability.gaussian : unavailableDistribution("gaussian"),
    uniform: typeof probability.uniform === "function" ? probability.uniform : unavailableDistribution("uniform"),
    exponential: typeof probability.exponential === "function" ? probability.exponential : unavailableDistribution("exponential"),
    getProperty: unavailablePropertyGetter,
    setProperty: unavailablePropertySetter,
    getModelProperty: unavailableModelPropertyGetter,
    setModelProperty: unavailableModelPropertySetter,
    integral: unavailableIntegral,
    pi: Math.PI,
    e: Math.E,
  });
  const FUNCTION_NAMES = new Set(
    Object.keys(MATH_SCOPE).filter((name) => typeof MATH_SCOPE[name] === "function"),
  );

  function normalizeName(name) {
    return String(name ?? "").trim();
  }

  function isValidVariableName(name) {
    return VARIABLE_NAME_RE.test(normalizeName(name));
  }

  function isReservedWord(name) {
    return RESERVED_WORDS.has(normalizeName(name));
  }

  function isFunctionName(name) {
    return FUNCTION_NAMES.has(normalizeName(name));
  }

  function isUniqueNodeName(nodes, name, exceptId = null) {
    const target = normalizeName(name);
    return !nodes.some((node) => node.id !== exceptId && normalizeName(node.name) === target);
  }

  function validateNodeName(nodes, name, exceptId = null) {
    const normalized = normalizeName(name);
    if (!isValidVariableName(normalized)) {
      return { ok: false, reason: "invalid", name: normalized };
    }
    if (isFunctionName(normalized)) {
      return { ok: false, reason: "function", name: normalized };
    }
    if (isReservedWord(normalized)) {
      return { ok: false, reason: "reserved", name: normalized };
    }
    if (!isUniqueNodeName(nodes, normalized, exceptId)) {
      return { ok: false, reason: "duplicate", name: normalized };
    }
    return { ok: true, reason: null, name: normalized };
  }

  function makeUniqueName(nodes, baseName, exceptId = null, fallbackPrefix = "n") {
    const normalizedBase = normalizeName(baseName);
    const seed = isValidVariableName(normalizedBase) ? normalizedBase : fallbackPrefix;
    let candidate = seed;
    let index = 1;
    while (
      !isUniqueNodeName(nodes, candidate, exceptId) ||
      isReservedWord(candidate) ||
      isFunctionName(candidate)
    ) {
      index += 1;
      candidate = `${seed}_${index}`;
    }
    return candidate;
  }

  function sanitizeNodeNames(nodes, fallbackPrefix = "n") {
    const out = [];
    nodes.forEach((node) => {
      const candidate = normalizeName(node.name);
      const uniqueName = makeUniqueName(out, candidate, null, fallbackPrefix);
      out.push({ ...node, name: uniqueName });
    });
    return out;
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function isNumericVector(value) {
    return Array.isArray(value) && value.every((item) => isFiniteNumber(item));
  }

  function isNumericMatrix(value) {
    if (!Array.isArray(value) || value.length === 0) {
      return false;
    }
    if (!value.every((row) => Array.isArray(row) && row.every((item) => isFiniteNumber(item)))) {
      return false;
    }
    const columns = value[0].length;
    return value.every((row) => row.length === columns);
  }

  function isNumericTensor(value) {
    if (isFiniteNumber(value)) {
      return true;
    }
    if (!Array.isArray(value)) {
      return false;
    }
    if (value.length === 0) {
      return true;
    }
    if (!value.every((item) => isNumericTensor(item))) {
      return false;
    }
    const first = value[0];
    if (!Array.isArray(first)) {
      return value.every((item) => !Array.isArray(item));
    }
    return value.every((item) => Array.isArray(item) && sameArrayShape(first, item));
  }

  function isNumericNestedArray(value) {
    if (isFiniteNumber(value)) {
      return true;
    }
    if (!Array.isArray(value)) {
      return false;
    }
    return value.every((item) => isNumericNestedArray(item));
  }

  function validateComputedValue(value) {
    if (isFiniteNumber(value)) {
      return { ok: true, kind: "number", value };
    }
    if (isNumericVector(value)) {
      return { ok: true, kind: "vector", value: value.slice() };
    }
    if (isNumericMatrix(value)) {
      return { ok: true, kind: "matrix", value: value.map((row) => row.slice()) };
    }
    if (isNumericTensor(value)) {
      return { ok: true, kind: "array", value: JSON.parse(JSON.stringify(value)) };
    }
    if (isNumericNestedArray(value)) {
      return { ok: true, kind: "array", value: JSON.parse(JSON.stringify(value)) };
    }
    return { ok: false, reason: "type" };
  }

  function eulerIntegrateValue(currentValue, deltaValue, dtValue) {
    const dt = Number(dtValue);
    if (!Number.isFinite(dt)) {
      throw new Error("dt must be finite");
    }
    if (isFiniteNumber(currentValue) && isFiniteNumber(deltaValue)) {
      return currentValue + deltaValue * dt;
    }
    if (isNumericVector(currentValue) && isNumericVector(deltaValue) && currentValue.length === deltaValue.length) {
      return currentValue.map((item, idx) => item + deltaValue[idx] * dt);
    }
    if (
      isNumericMatrix(currentValue) &&
      isNumericMatrix(deltaValue) &&
      currentValue.length === deltaValue.length &&
      currentValue.every((row, rowIdx) => row.length === deltaValue[rowIdx].length)
    ) {
      return currentValue.map((row, rowIdx) => row.map((item, colIdx) => item + deltaValue[rowIdx][colIdx] * dt));
    }
    throw new Error("integral requires matching numeric state and derivative");
  }

  function createStateIntegral(node, globals = {}) {
    if (!node) {
      return unavailableIntegral;
    }
    return (value) => eulerIntegrateValue(node.computedValue, value, globals.dt);
  }

  function coerceBooleanToNumber(value) {
    if (value === true) {
      return 1;
    }
    if (value === false) {
      return 0;
    }
    if (Array.isArray(value)) {
      return value.map((item) => coerceBooleanToNumber(item));
    }
    return value;
  }

  function parsePropertyStoredValue(raw) {
    const text = String(raw ?? "");
    const trimmed = text.trim();
    if (!trimmed) {
      return "";
    }
    if (trimmed === "true") {
      return 1;
    }
    if (trimmed === "false") {
      return 0;
    }
    const numeric = Number(trimmed);
    if (Number.isFinite(numeric)) {
      return numeric;
    }
    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        return JSON.parse(trimmed);
      } catch (err) {
        return text;
      }
    }
    return text;
  }

  function serializePropertyStoredValue(value) {
    const normalized = coerceBooleanToNumber(value);
    if (normalized === null || normalized === undefined) {
      return "";
    }
    if (typeof normalized === "number") {
      return String(normalized);
    }
    if (Array.isArray(normalized)) {
      return JSON.stringify(normalized);
    }
    if (typeof normalized === "object") {
      return JSON.stringify(normalized);
    }
    return String(normalized);
  }

  function ensureNodePropertyAccess(node) {
    if (!node || !Array.isArray(node.properties)) {
      return {
        getProperty: unavailablePropertyGetter,
        setProperty: unavailablePropertySetter,
      };
    }
    return {
      getProperty: (key, fallback = null) => {
        const name = String(key ?? "");
        const found = node.properties.find((prop) => String(prop?.key ?? "") === name);
        if (!found) {
          return fallback;
        }
        return parsePropertyStoredValue(found.value);
      },
      setProperty: (key, value) => {
        const name = String(key ?? "");
        const stored = serializePropertyStoredValue(value);
        const found = node.properties.find((prop) => String(prop?.key ?? "") === name);
        if (found) {
          found.value = stored;
        } else {
          node.properties.push({ key: name, value: stored });
        }
        return value;
      },
    };
  }

  function rewriteThisAlias(expression) {
    const src = String(expression ?? "");
    let out = "";
    let i = 0;
    let mode = "code";

    while (i < src.length) {
      const ch = src[i];

      if (mode === "code") {
        if (ch === "'" || ch === '"' || ch === "`") {
          mode = ch;
          out += ch;
          i += 1;
          continue;
        }
        if (src.slice(i, i + 4) === "this") {
          const prev = i > 0 ? src[i - 1] : "";
          const next = i + 4 < src.length ? src[i + 4] : "";
          const prevOk = !/[A-Za-z0-9_$]/.test(prev);
          const nextOk = !/[A-Za-z0-9_$]/.test(next);
          if (prevOk && nextOk) {
            out += "__self";
            i += 4;
            continue;
          }
        }
        out += ch;
        i += 1;
        continue;
      }

      out += ch;
      if (ch === "\\") {
        if (i + 1 < src.length) {
          out += src[i + 1];
          i += 2;
          continue;
        }
      }
      if (ch === mode) {
        mode = "code";
      }
      i += 1;
    }

    return out;
  }

  function containsIdentifierToken(expression, token) {
    const src = String(expression ?? "");
    const target = String(token ?? "");
    if (!target) {
      return false;
    }
    let i = 0;
    let mode = "code";
    while (i < src.length) {
      const ch = src[i];
      if (mode === "code") {
        if (ch === "'" || ch === '"' || ch === "`") {
          mode = ch;
          i += 1;
          continue;
        }
        if (src.slice(i, i + target.length) === target) {
          const prev = i > 0 ? src[i - 1] : "";
          const next = i + target.length < src.length ? src[i + target.length] : "";
          const prevOk = !/[A-Za-z0-9_$]/.test(prev);
          const nextOk = !/[A-Za-z0-9_$]/.test(next);
          if (prevOk && nextOk) {
            return true;
          }
        }
        i += 1;
        continue;
      }
      if (ch === "\\") {
        i += 2;
        continue;
      }
      if (ch === mode) {
        mode = "code";
      }
      i += 1;
    }
    return false;
  }

  function containsThisAlias(expression) {
    return containsIdentifierToken(expression, "this");
  }

  function rewriteConditionalIfCalls(expression) {
    return String(expression ?? "").replace(/(^|[^A-Za-z0-9_$])if\s*\(/g, "$1__if(");
  }

  function rememberCompiledExpression(source, entry) {
    if (expressionCache.has(source)) {
      expressionCache.delete(source);
    }
    expressionCache.set(source, entry);
    if (expressionCache.size > EXPRESSION_CACHE_LIMIT) {
      const oldestKey = expressionCache.keys().next().value;
      expressionCache.delete(oldestKey);
    }
    return entry;
  }

  function getCompiledExpression(source) {
    const key = String(source ?? "");
    const cached = expressionCache.get(key);
    if (cached) {
      expressionCache.delete(key);
      expressionCache.set(key, cached);
      return cached;
    }

    const compiled = {
      hasThisAlias: containsThisAlias(key),
      hasIntegral: containsIdentifierToken(key, "integral"),
      ast: null,
      syntaxErrorMessage: null,
      integralArgAsts: [],
    };

    try {
      const normalizedSource = rewriteThisAlias(rewriteConditionalIfCalls(key));
      compiled.ast = parseExpressionAst(normalizedSource);
      compiled.integralArgAsts = collectIntegralArgAstsFromNode(compiled.ast, []);
    } catch (err) {
      if (err && err.name === "SyntaxError") {
        compiled.syntaxErrorMessage = String(err.message || "");
      } else {
        throw err;
      }
    }

    return rememberCompiledExpression(key, compiled);
  }

  function getPureIntegralArgAst(compiled) {
    const ast = compiled?.ast;
    if (!ast || ast.type !== "call" || ast.name !== "integral" || ast.args.length !== 1) {
      return null;
    }
    return ast.args[0];
  }

  function collectIntegralArgAstsFromNode(node, out = []) {
    if (!node || typeof node !== "object") {
      return out;
    }
    if (node.type === "call" && node.name === "integral" && node.args.length === 1) {
      out.push(node.args[0]);
    }
    Object.values(node).forEach((value) => {
      if (Array.isArray(value)) {
        value.forEach((item) => collectIntegralArgAstsFromNode(item, out));
      } else if (value && typeof value === "object") {
        collectIntegralArgAstsFromNode(value, out);
      }
    });
    return out;
  }

  function vectorizedBinaryOperation(left, right, scalarFn) {
    if (Array.isArray(left) || Array.isArray(right)) {
      if (Array.isArray(left) && Array.isArray(right)) {
        if (!sameArrayShape(left, right)) {
          throw new Error("operator arguments must have matching shapes");
        }
        return left.map((item, idx) => vectorizedBinaryOperation(item, right[idx], scalarFn));
      }
      const arr = Array.isArray(left) ? left : right;
      const scalar = Array.isArray(left) ? right : left;
      return arr.map((item) => vectorizedBinaryOperation(
        Array.isArray(left) ? item : scalar,
        Array.isArray(left) ? scalar : item,
        scalarFn,
      ));
    }
    return scalarFn(left, right);
  }

  function vectorizedUnaryOperation(value, scalarFn) {
    if (Array.isArray(value)) {
      return value.map((item) => vectorizedUnaryOperation(item, scalarFn));
    }
    return scalarFn(value);
  }

  function normalizeSliceIndex(value, size, fallback) {
    if (value == null) {
      return fallback;
    }
    let idx = Number(value);
    if (!Number.isInteger(idx)) {
      throw new Error("slice bounds must be integers");
    }
    if (idx < 0) {
      idx += size;
    }
    return idx;
  }

  function buildNumericRange(startValue, endValue, stepValue = null) {
    const start = Number(startValue);
    const end = Number(endValue);
    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      throw new Error("range bounds must be finite numbers");
    }
    let step = stepValue == null ? (end >= start ? 1 : -1) : Number(stepValue);
    if (!Number.isFinite(step) || step === 0) {
      throw new Error("range step must be a non-zero finite number");
    }
    if ((end > start && step < 0) || (end < start && step > 0)) {
      throw new Error("range step does not reach the end value");
    }
    const out = [];
    const epsilon = Math.abs(step) * 1e-9;
    const maxItems = 100000;
    if (step > 0) {
      for (let value = start; value < end - epsilon; value += step) {
        out.push(Number(value.toFixed(12)));
        if (out.length > maxItems) {
          throw new Error("range is too large");
        }
      }
    } else {
      for (let value = start; value > end + epsilon; value += step) {
        out.push(Number(value.toFixed(12)));
        if (out.length > maxItems) {
          throw new Error("range is too large");
        }
      }
    }
    return out;
  }

  function scalarBinaryOperation(op, left, right) {
    switch (op) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
      case "%":
        return left % right;
      case "**":
        return left ** right;
      case "<":
        return left < right;
      case ">":
        return left > right;
      case "<=":
        return left <= right;
      case ">=":
        return left >= right;
      case "==":
        return left == right;
      case "!=":
        return left != right;
      case "===":
        return left === right;
      case "!==":
        return left !== right;
      case "&&":
        return left && right;
      case "||":
        return left || right;
      default:
        throw new Error(`Unsupported reducer operator ${op}`);
    }
  }

  function applyReducer(accumulator, value, reducer, scope) {
    if (!reducer || typeof reducer !== "object") {
      throw new Error("invalid reducer");
    }
    if (reducer.refKind === "operator") {
      return scalarBinaryOperation(reducer.name, accumulator, value);
    }
    if (reducer.refKind === "function") {
      const fn = scope?.[reducer.name];
      if (typeof fn !== "function") {
        throw new Error(`${reducer.name} is not callable`);
      }
      return fn(accumulator, value);
    }
    throw new Error("invalid reducer");
  }

  function reduceArrayElements(values, reducer, scope, hasInit = false, initValue = null) {
    if (!Array.isArray(values)) {
      throw new Error("reduce expects a vector or matrix");
    }
    if (hasInit) {
      return values.reduce((acc, value) => applyReducer(acc, value, reducer, scope), initValue);
    }
    if (values.length === 0) {
      throw new Error("reduce requires a non-empty vector when no initial value is provided");
    }
    return values.slice(1).reduce((acc, value) => applyReducer(acc, value, reducer, scope), values[0]);
  }

  function reduceMatrixAlongAxis(matrix, axis, reducer, scope, hasInit = false, initValue = null) {
    if (!isNumericMatrix(matrix) && !Array.isArray(matrix)) {
      throw new Error("reduce expects a vector or matrix");
    }
    if (!Array.isArray(matrix) || matrix.length === 0 || !matrix.every((row) => Array.isArray(row))) {
      throw new Error("reduce axis requires a matrix");
    }
    const rowCount = matrix.length;
    const colCount = matrix[0].length;
    if (!matrix.every((row) => row.length === colCount)) {
      throw new Error("reduce axis requires a rectangular matrix");
    }
    if (!Number.isInteger(axis) || (axis !== 0 && axis !== 1)) {
      throw new Error("reduce matrix axis must be 0 or 1");
    }
    if (axis === 0) {
      return Array.from({ length: colCount }, (_, colIdx) => {
        const values = Array.from({ length: rowCount }, (_, rowIdx) => matrix[rowIdx][colIdx]);
        return reduceArrayElements(values, reducer, scope, hasInit, initValue);
      });
    }
    return matrix.map((row) => reduceArrayElements(row, reducer, scope, hasInit, initValue));
  }

  function tokenizeExpression(source) {
    const tokens = [];
    let i = 0;
    while (i < source.length) {
      const ch = source[i];
      if (/\s/.test(ch)) {
        i += 1;
        continue;
      }
      const three = source.slice(i, i + 3);
      const two = source.slice(i, i + 2);
      if (three === "===" || three === "!==") {
        tokens.push({ type: "op", value: three });
        i += 3;
        continue;
      }
      if (["&&", "||", "==", "!=", "<=", ">=", "**"].includes(two)) {
        tokens.push({ type: "op", value: two });
        i += 2;
        continue;
      }
      if ("+-*/%<>()[],!:. ".replace(/\s/g, "").includes(ch)) {
        tokens.push({ type: "op", value: ch });
        i += 1;
        continue;
      }
      if (ch === "'" || ch === "\"") {
        const quote = ch;
        let out = "";
        i += 1;
        while (i < source.length) {
          const cur = source[i];
          if (cur === "\\") {
            if (i + 1 >= source.length) {
              throw new SyntaxError("Unterminated string");
            }
            const next = source[i + 1];
            const map = { n: "\n", r: "\r", t: "\t", "\\": "\\", "'": "'", "\"": "\"" };
            out += Object.prototype.hasOwnProperty.call(map, next) ? map[next] : next;
            i += 2;
            continue;
          }
          if (cur === quote) {
            i += 1;
            break;
          }
          out += cur;
          i += 1;
        }
        if (source[i - 1] !== quote) {
          throw new SyntaxError("Unterminated string");
        }
        tokens.push({ type: "string", value: out });
        continue;
      }
      if (/[0-9.]/.test(ch)) {
        let j = i;
        while (j < source.length && /[0-9.]/.test(source[j])) {
          j += 1;
        }
        if (/[eE]/.test(source[j])) {
          j += 1;
          if (/[+-]/.test(source[j])) {
            j += 1;
          }
          while (j < source.length && /[0-9]/.test(source[j])) {
            j += 1;
          }
        }
        const text = source.slice(i, j);
        const value = Number(text);
        if (!Number.isFinite(value)) {
          throw new SyntaxError("Invalid number");
        }
        tokens.push({ type: "number", value });
        i = j;
        continue;
      }
      if (/[A-Za-z_$]/.test(ch)) {
        let j = i + 1;
        while (j < source.length && /[A-Za-z0-9_$]/.test(source[j])) {
          j += 1;
        }
        tokens.push({ type: "identifier", value: source.slice(i, j) });
        i = j;
        continue;
      }
      throw new SyntaxError(`Unexpected token ${ch}`);
    }
    tokens.push({ type: "eof", value: "" });
    return tokens;
  }

  function parseExpressionAst(source) {
    const tokens = tokenizeExpression(source);
    let index = 0;
    const peek = () => tokens[index];
    const next = () => tokens[index++];
    const match = (...values) => {
      const token = peek();
      if (token && values.includes(token.value)) {
        index += 1;
        return token;
      }
      return null;
    };
    const expect = (value) => {
      const token = next();
      if (!token || token.value !== value) {
        throw new SyntaxError(`Expected '${value}'`);
      }
      return token;
    };

    function parseReduceReference() {
      const token = peek();
      if (!token) {
        throw new SyntaxError("Missing reduce operator");
      }
      if (token.type === "identifier") {
        next();
        return { type: "callable-ref", refKind: "function", name: token.value };
      }
      if (
        token.type === "op" &&
        ["+", "-", "*", "/", "%", "**", "<", ">", "<=", ">=", "==", "!=", "===", "!==", "&&", "||"].includes(token.value)
      ) {
        next();
        return { type: "callable-ref", refKind: "operator", name: token.value };
      }
      throw new SyntaxError("reduce expects an operator or function as first argument");
    }

    function parseBracketAccessor(target) {
      if (match("]")) {
        throw new SyntaxError("Empty index");
      }

      let start = null;
      let end = null;
      let step = null;

      if (match(":")) {
        if (!match("]")) {
          if (!match(":")) {
            end = parseLogicalOr();
            if (match(":")) {
              if (!match("]")) {
                step = parseLogicalOr();
                expect("]");
              }
            } else {
              expect("]");
            }
          } else if (!match("]")) {
            step = parseLogicalOr();
            expect("]");
          }
        }
        return { type: "slice", target, start, end, step };
      }

      const first = parseLogicalOr();
      if (!match(":")) {
        expect("]");
        return { type: "index", target, index: first };
      }

      start = first;
      if (!match("]")) {
        if (!match(":")) {
          end = parseLogicalOr();
          if (match(":")) {
            if (!match("]")) {
              step = parseLogicalOr();
              expect("]");
            }
          } else {
            expect("]");
          }
        } else if (!match("]")) {
          step = parseLogicalOr();
          expect("]");
        }
      }
      return { type: "slice", target, start, end, step };
    }

    function parsePrimary() {
      const token = peek();
      if (!token) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (match("(")) {
        const expr = parseLogicalOr();
        expect(")");
        return expr;
      }
      if (match("[")) {
        if (match("]")) {
          return { type: "array", elements: [] };
        }
        const elements = [parseLogicalOr()];
        while (match(",")) {
          elements.push(parseLogicalOr());
        }
        expect("]");
        return { type: "array", elements };
      }
      if (token.type === "number") {
        next();
        return { type: "literal", value: token.value };
      }
      if (token.type === "string") {
        next();
        return { type: "literal", value: token.value };
      }
      if (token.type === "identifier") {
        next();
        const name = token.value;
        if (match("(")) {
          const args = [];
          if (name === "reduce") {
            if (!match(")")) {
              args.push(parseReduceReference());
              while (match(",")) {
                args.push(parseLogicalOr());
              }
              expect(")");
            }
          } else if (!match(")")) {
            do {
              args.push(parseLogicalOr());
            } while (match(","));
            expect(")");
          }
          return { type: "call", name, args };
        }
        if (name === "true") {
          return { type: "literal", value: true };
        }
        if (name === "false") {
          return { type: "literal", value: false };
        }
        if (name === "null") {
          return { type: "literal", value: null };
        }
        return { type: "identifier", name };
      }
      throw new SyntaxError(`Unexpected token ${token.value}`);
    }

    function parsePostfix() {
      let expr = parsePrimary();
      while (true) {
        if (match(".")) {
          const token = next();
          if (!token || token.type !== "identifier") {
            throw new SyntaxError("Expected property name after '.'");
          }
          expr = { type: "member", target: expr, property: token.value };
          continue;
        }
        if (match("[")) {
          expr = parseBracketAccessor(expr);
          continue;
        }
        return expr;
      }
    }

    function parseUnary() {
      const token = peek();
      if (token && token.type === "op" && ["+", "-", "!"].includes(token.value)) {
        next();
        return { type: "unary", op: token.value, argument: parseUnary() };
      }
      return parsePostfix();
    }

    function parsePower() {
      let left = parseUnary();
      if (match("**")) {
        left = { type: "binary", op: "**", left, right: parsePower() };
      }
      return left;
    }

    function parseMultiplicative() {
      let left = parsePower();
      while (true) {
        const op = match("*", "/", "%");
        if (!op) {
          return left;
        }
        left = { type: "binary", op: op.value, left, right: parsePower() };
      }
    }

    function parseAdditive() {
      let left = parseMultiplicative();
      while (true) {
        const op = match("+", "-");
        if (!op) {
          return left;
        }
        left = { type: "binary", op: op.value, left, right: parseMultiplicative() };
      }
    }

    function parseComparison() {
      let left = parseAdditive();
      while (true) {
        const op = match("<", ">", "<=", ">=");
        if (!op) {
          return left;
        }
        left = { type: "binary", op: op.value, left, right: parseAdditive() };
      }
    }

    function parseEquality() {
      let left = parseComparison();
      while (true) {
        const op = match("==", "!=", "===", "!==");
        if (!op) {
          return left;
        }
        left = { type: "binary", op: op.value, left, right: parseComparison() };
      }
    }

    function parseLogicalAnd() {
      let left = parseEquality();
      while (match("&&")) {
        left = { type: "binary", op: "&&", left, right: parseEquality() };
      }
      return left;
    }

    function parseLogicalOr() {
      let left = parseLogicalAnd();
      while (match("||")) {
        left = { type: "binary", op: "||", left, right: parseLogicalAnd() };
      }
      return left;
    }

    const ast = parseLogicalOr();
    if (peek().type !== "eof") {
      throw new SyntaxError(`Unexpected token ${peek().value}`);
    }
    return ast;
  }

  function evaluateAstNode(node, scope, hooks = null) {
    switch (node.type) {
      case "literal":
        return node.value;
      case "array":
        return node.elements.map((item) => evaluateAstNode(item, scope, hooks));
      case "identifier":
        if (!Object.prototype.hasOwnProperty.call(scope, node.name)) {
          throw new ReferenceError(`${node.name} is not defined`);
        }
        return scope[node.name];
      case "member": {
        const target = evaluateAstNode(node.target, scope, hooks);
        if (target == null || (typeof target !== "object" && !Array.isArray(target))) {
          throw new Error("member access requires an object or array");
        }
        if (!Object.prototype.hasOwnProperty.call(target, node.property)) {
          throw new ReferenceError(`${node.property} is not defined`);
        }
        return target[node.property];
      }
      case "index": {
        const target = evaluateAstNode(node.target, scope, hooks);
        if (!Array.isArray(target)) {
          throw new Error("indexing requires an array or matrix");
        }
        let idx = Number(evaluateAstNode(node.index, scope, hooks));
        if (!Number.isInteger(idx)) {
          throw new Error("array index must be an integer");
        }
        if (idx < 0) {
          idx += target.length;
        }
        if (idx < 0 || idx >= target.length) {
          throw new Error("array index out of range");
        }
        return target[idx];
      }
      case "slice": {
        const target = evaluateAstNode(node.target, scope, hooks);
        if (!Array.isArray(target)) {
          throw new Error("slicing requires an array or matrix");
        }
        const step = node.step == null ? 1 : Number(evaluateAstNode(node.step, scope, hooks));
        if (!Number.isInteger(step) || step === 0) {
          throw new Error("slice step must be a non-zero integer");
        }
        const size = target.length;
        const start = step > 0
          ? normalizeSliceIndex(node.start == null ? null : evaluateAstNode(node.start, scope, hooks), size, 0)
          : normalizeSliceIndex(node.start == null ? null : evaluateAstNode(node.start, scope, hooks), size, size - 1);
        const end = step > 0
          ? normalizeSliceIndex(node.end == null ? null : evaluateAstNode(node.end, scope, hooks), size, size)
          : normalizeSliceIndex(node.end == null ? null : evaluateAstNode(node.end, scope, hooks), size, -1);
        const out = [];
        if (step > 0) {
          for (let idx = Math.max(0, start); idx < Math.min(size, end); idx += step) {
            out.push(target[idx]);
          }
        } else {
          for (let idx = Math.min(size - 1, start); idx > Math.max(-1, end); idx += step) {
            out.push(target[idx]);
          }
        }
        return out;
      }
      case "call": {
        if (node.name === "integral" && hooks?.onIntegralCall) {
          return hooks.onIntegralCall(node, scope);
        }
        if (node.name === "array") {
          if (node.args.length !== 2) {
            throw new Error("array expects exactly 2 arguments");
          }
          const dimsValue = evaluateAstNode(node.args[0], scope, hooks);
          const dims = Array.isArray(dimsValue) ? dimsValue.slice() : [dimsValue];
          if (!dims.length) {
            throw new Error("array requires at least one dimension");
          }
          const normalizedDims = dims.map((dim, idx) => {
            const value = Number(dim);
            if (!Number.isInteger(value) || value < 0) {
              throw new Error(`array dimension ${idx} must be a non-negative integer`);
            }
            return value;
          });
          const totalSize = normalizedDims.reduce((acc, value) => acc * Math.max(1, value), 1);
          if (totalSize > 100000) {
            throw new Error("array is too large");
          }
          const buildArray = (level, localIndices) => {
            if (level >= normalizedDims.length) {
              const localScope = { ...scope };
              localIndices.forEach((value, idx) => {
                localScope[`$${idx}`] = value;
              });
              return evaluateAstNode(node.args[1], localScope, hooks);
            }
            const size = normalizedDims[level];
            return Array.from({ length: size }, (_, idx) => buildArray(level + 1, [...localIndices, idx]));
          };
          return buildArray(0, []);
        }
        if (node.name === "map") {
          if (node.args.length !== 2) {
            throw new Error("map expects exactly 2 arguments");
          }
          const target = evaluateAstNode(node.args[1], scope, hooks);
          if (!Array.isArray(target)) {
            throw new Error("map expects a vector or matrix");
          }
          const mapArray = (value, localIndices) => {
            if (!Array.isArray(value)) {
              const localScope = { ...scope, $value: value };
              localIndices.forEach((indexValue, idx) => {
                localScope[`$${idx}`] = indexValue;
              });
              return evaluateAstNode(node.args[0], localScope, hooks);
            }
            return value.map((item, idx) => mapArray(item, [...localIndices, idx]));
          };
          return mapArray(target, []);
        }
        if (node.name === "filter") {
          if (node.args.length !== 2) {
            throw new Error("filter expects exactly 2 arguments");
          }
          const target = evaluateAstNode(node.args[1], scope, hooks);
          if (!Array.isArray(target)) {
            throw new Error("filter expects a vector or matrix");
          }
          const filterArray = (value, localIndices) => {
            if (!Array.isArray(value)) {
              const localScope = { ...scope, $value: value };
              localIndices.forEach((indexValue, idx) => {
                localScope[`$${idx}`] = indexValue;
              });
              return coerceBooleanToNumber(evaluateAstNode(node.args[0], localScope, hooks)) ? value : undefined;
            }
            const out = value
              .map((item, idx) => filterArray(item, [...localIndices, idx]))
              .filter((item) => item !== undefined);
            return out;
          };
          return filterArray(target, []);
        }
        if (node.name === "reduce") {
          if (node.args.length < 2 || node.args.length > 4) {
            throw new Error("reduce expects 2 to 4 arguments");
          }
          const reducer = node.args[0];
          if (!reducer || reducer.type !== "callable-ref") {
            throw new Error("reduce expects an operator or function as first argument");
          }
          const target = evaluateAstNode(node.args[1], scope, hooks);
          const isMatrix = Array.isArray(target) && target.length > 0 && target.every((row) => Array.isArray(row));
          if (!Array.isArray(target)) {
            throw new Error("reduce expects a vector or matrix");
          }
          if (!isMatrix) {
            const hasInit = node.args.length >= 3;
            const initValue = hasInit ? evaluateAstNode(node.args[2], scope, hooks) : null;
            return reduceArrayElements(target, reducer, scope, hasInit, initValue);
          }
          if (node.args.length < 3) {
            throw new Error("reduce on matrices requires an axis argument");
          }
          const axis = Number(evaluateAstNode(node.args[2], scope, hooks));
          if (!Number.isInteger(axis)) {
            throw new Error("reduce matrix axis must be 0 or 1");
          }
          const hasInit = node.args.length >= 4;
          const initValue = hasInit ? evaluateAstNode(node.args[3], scope, hooks) : null;
          return reduceMatrixAlongAxis(target, axis, reducer, scope, hasInit, initValue);
        }
        if (!Object.prototype.hasOwnProperty.call(scope, node.name)) {
          throw new ReferenceError(`${node.name} is not defined`);
        }
        const fn = scope[node.name];
        if (typeof fn !== "function") {
          throw new Error(`${node.name} is not callable`);
        }
        const args = node.args.map((arg) => evaluateAstNode(arg, scope, hooks));
        return fn(...args);
      }
      case "unary": {
        const value = evaluateAstNode(node.argument, scope, hooks);
        if (node.op === "+") {
          return vectorizedUnaryOperation(value, (item) => +item);
        }
        if (node.op === "-") {
          return vectorizedUnaryOperation(value, (item) => -item);
        }
        if (node.op === "!") {
          return vectorizedUnaryOperation(value, (item) => !item);
        }
        throw new Error(`Unsupported operator ${node.op}`);
      }
      case "binary": {
        const left = evaluateAstNode(node.left, scope, hooks);
        const right = evaluateAstNode(node.right, scope, hooks);
        switch (node.op) {
          case "+":
            return vectorizedBinaryOperation(left, right, (a, b) => a + b);
          case "-":
            return vectorizedBinaryOperation(left, right, (a, b) => a - b);
          case "*":
            return vectorizedBinaryOperation(left, right, (a, b) => a * b);
          case "/":
            return vectorizedBinaryOperation(left, right, (a, b) => a / b);
          case "%":
            return vectorizedBinaryOperation(left, right, (a, b) => a % b);
          case "**":
            return vectorizedBinaryOperation(left, right, (a, b) => a ** b);
          case "<":
            return vectorizedBinaryOperation(left, right, (a, b) => a < b);
          case ">":
            return vectorizedBinaryOperation(left, right, (a, b) => a > b);
          case "<=":
            return vectorizedBinaryOperation(left, right, (a, b) => a <= b);
          case ">=":
            return vectorizedBinaryOperation(left, right, (a, b) => a >= b);
          case "==":
            return vectorizedBinaryOperation(left, right, (a, b) => a == b);
          case "!=":
            return vectorizedBinaryOperation(left, right, (a, b) => a != b);
          case "===":
            return vectorizedBinaryOperation(left, right, (a, b) => a === b);
          case "!==":
            return vectorizedBinaryOperation(left, right, (a, b) => a !== b);
          case "&&":
            return vectorizedBinaryOperation(left, right, (a, b) => a && b);
          case "||":
            return vectorizedBinaryOperation(left, right, (a, b) => a || b);
          default:
            throw new Error(`Unsupported operator ${node.op}`);
        }
      }
      default:
        throw new Error(`Unsupported AST node ${node.type}`);
    }
  }

  function evaluateValueExpression(expression, context = {}, options = {}) {
    const source = String(expression ?? "").trim();
    if (!source) {
      return { ok: true, kind: "empty", value: null };
    }
    const compiled = getCompiledExpression(source);
    if (!options.allowThisAlias && compiled.hasThisAlias) {
      return { ok: false, reason: "runtime", message: "'this' is only available in state transitions" };
    }
    if (!options.allowIntegral && compiled.hasIntegral) {
      return { ok: false, reason: "runtime", message: "'integral' is only available in state transitions" };
    }
    if (compiled.syntaxErrorMessage) {
      return { ok: false, reason: "syntax", message: compiled.syntaxErrorMessage };
    }

    let raw;
    try {
      raw = evaluateAstNode(compiled.ast, { ...MATH_SCOPE, ...context });
    } catch (err) {
      if (err && err.name === "ReferenceError") {
        return { ok: false, reason: "reference", message: String(err.message || "") };
      }
      if (err && err.name === "SyntaxError") {
        return { ok: false, reason: "syntax", message: String(err.message || "") };
      }
      return { ok: false, reason: "runtime", message: String(err?.message || "") };
    }

    const normalized = coerceBooleanToNumber(raw);
    const validated = validateComputedValue(normalized);
    if (!validated.ok) {
      return { ok: false, reason: "type" };
    }
    return { ok: true, kind: validated.kind, value: validated.value };
  }

  function analyzeStateTransitionExpression(expression) {
    const source = String(expression ?? "").trim();
    if (!source) {
      return { ok: true, pureIntegral: false, usesIntegral: false, integralCount: 0 };
    }
    const compiled = getCompiledExpression(source);
    if (compiled.syntaxErrorMessage) {
      return {
        ok: false,
        reason: "syntax",
        message: compiled.syntaxErrorMessage,
        pureIntegral: false,
        usesIntegral: compiled.hasIntegral,
        integralCount: Array.isArray(compiled.integralArgAsts) ? compiled.integralArgAsts.length : 0,
      };
    }
    return {
      ok: true,
      pureIntegral: Boolean(getPureIntegralArgAst(compiled)),
      usesIntegral: compiled.hasIntegral,
      integralCount: Array.isArray(compiled.integralArgAsts) ? compiled.integralArgAsts.length : 0,
    };
  }

  function evaluateIntegralDerivativeExpression(expression, context = {}, options = {}) {
    const source = String(expression ?? "").trim();
    if (!source) {
      return { ok: false, reason: "runtime", message: "empty integral expression" };
    }
    const compiled = getCompiledExpression(source);
    if (!options.allowThisAlias && compiled.hasThisAlias) {
      return { ok: false, reason: "runtime", message: "'this' is only available in state transitions" };
    }
    const derivativeAst = getPureIntegralArgAst(compiled);
    if (!derivativeAst) {
      return { ok: false, reason: "runtime", message: "integral derivative is unavailable" };
    }
    if (compiled.syntaxErrorMessage) {
      return { ok: false, reason: "syntax", message: compiled.syntaxErrorMessage };
    }

    let raw;
    try {
      raw = evaluateAstNode(derivativeAst, { ...MATH_SCOPE, integral: unavailableIntegral, ...context });
    } catch (err) {
      if (err && err.name === "ReferenceError") {
        return { ok: false, reason: "reference", message: String(err.message || "") };
      }
      if (err && err.name === "SyntaxError") {
        return { ok: false, reason: "syntax", message: String(err.message || "") };
      }
      return { ok: false, reason: "runtime", message: String(err?.message || "") };
    }

    const normalized = coerceBooleanToNumber(raw);
    const validated = validateComputedValue(normalized);
    if (!validated.ok) {
      return { ok: false, reason: "type" };
    }
    return { ok: true, kind: validated.kind, value: validated.value };
  }

  function evaluateIntegralDerivativeList(expression, context = {}, options = {}) {
    const source = String(expression ?? "").trim();
    if (!source) {
      return { ok: true, kind: "array", value: [] };
    }
    const compiled = getCompiledExpression(source);
    if (!options.allowThisAlias && compiled.hasThisAlias) {
      return { ok: false, reason: "runtime", message: "'this' is only available in state transitions" };
    }
    if (compiled.syntaxErrorMessage) {
      return { ok: false, reason: "syntax", message: compiled.syntaxErrorMessage };
    }

    const values = [];
    try {
      for (const derivativeAst of compiled.integralArgAsts || []) {
        const raw = evaluateAstNode(derivativeAst, { ...MATH_SCOPE, integral: unavailableIntegral, ...context });
        const normalized = coerceBooleanToNumber(raw);
        const validated = validateComputedValue(normalized);
        if (!validated.ok) {
          return { ok: false, reason: "type" };
        }
        values.push(validated.value);
      }
    } catch (err) {
      if (err && err.name === "ReferenceError") {
        return { ok: false, reason: "reference", message: String(err.message || "") };
      }
      if (err && err.name === "SyntaxError") {
        return { ok: false, reason: "syntax", message: String(err.message || "") };
      }
      return { ok: false, reason: "runtime", message: String(err?.message || "") };
    }
    return { ok: true, kind: "array", value: values };
  }

  function evaluateStateTransitionExpressionWithIntegralValues(expression, context = {}, integralValues = [], options = {}) {
    const source = String(expression ?? "").trim();
    if (!source) {
      return { ok: true, kind: "empty", value: null };
    }
    const compiled = getCompiledExpression(source);
    if (!options.allowThisAlias && compiled.hasThisAlias) {
      return { ok: false, reason: "runtime", message: "'this' is only available in state transitions" };
    }
    if (compiled.syntaxErrorMessage) {
      return { ok: false, reason: "syntax", message: compiled.syntaxErrorMessage };
    }

    let integralIndex = 0;
    let raw;
    try {
      raw = evaluateAstNode(
        compiled.ast,
        { ...MATH_SCOPE, integral: unavailableIntegral, ...context },
        {
          onIntegralCall(callNode) {
            if (callNode.args.length !== 1) {
              throw new Error("integral expects exactly 1 argument");
            }
            if (integralIndex >= integralValues.length) {
              throw new Error("integral value is unavailable");
            }
            const out = integralValues[integralIndex];
            integralIndex += 1;
            return out;
          },
        },
      );
    } catch (err) {
      if (err && err.name === "ReferenceError") {
        return { ok: false, reason: "reference", message: String(err.message || "") };
      }
      if (err && err.name === "SyntaxError") {
        return { ok: false, reason: "syntax", message: String(err.message || "") };
      }
      return { ok: false, reason: "runtime", message: String(err?.message || "") };
    }

    const normalized = coerceBooleanToNumber(raw);
    const validated = validateComputedValue(normalized);
    if (!validated.ok) {
      return { ok: false, reason: "type" };
    }
    return { ok: true, kind: validated.kind, value: validated.value };
  }

  function validateExpressionSyntax(expression, extraNames = [], options = {}) {
    const source = String(expression ?? "").trim();
    if (!source) {
      return { ok: true };
    }
    const compiled = getCompiledExpression(source);
    if (!options.allowThisAlias && compiled.hasThisAlias) {
      return { ok: false, reason: "runtime", message: "'this' is only available in state transitions" };
    }
    if (!options.allowIntegral && compiled.hasIntegral) {
      return { ok: false, reason: "runtime", message: "'integral' is only available in state transitions" };
    }
    const scopeNames = [
      ...Object.keys(MATH_SCOPE),
      ...extraNames.map((name) => String(name ?? "").trim()).filter(Boolean),
    ];
    void scopeNames;
    if (compiled.syntaxErrorMessage) {
      return { ok: false, reason: "syntax", message: compiled.syntaxErrorMessage };
    }
    return { ok: true };
  }

  function formatComputedValue(value) {
    if (value === null || value === undefined) {
      return "-";
    }
    if (typeof value === "number") {
      return String(value);
    }
    return JSON.stringify(value);
  }

  function isIdentifierStart(ch) {
    return /[A-Za-z_$]/.test(ch);
  }

  function isIdentifierPart(ch) {
    return /[A-Za-z0-9_$]/.test(ch);
  }

  function replaceIdentifierInExpression(expression, oldName, newName) {
    const src = String(expression ?? "");
    const from = String(oldName ?? "");
    const to = String(newName ?? "");
    if (!from || from === to) {
      return src;
    }

    let out = "";
    let i = 0;
    let mode = "code";
    while (i < src.length) {
      const ch = src[i];

      if (mode === "code") {
        if (ch === "'" || ch === '"' || ch === "`") {
          mode = ch;
          out += ch;
          i += 1;
          continue;
        }
        if (isIdentifierStart(ch)) {
          let j = i + 1;
          while (j < src.length && isIdentifierPart(src[j])) {
            j += 1;
          }
          const token = src.slice(i, j);
          const prev = i > 0 ? src[i - 1] : "";
          out += token === from && prev !== "." ? to : token;
          i = j;
          continue;
        }
        out += ch;
        i += 1;
        continue;
      }

      out += ch;
      if (ch === "\\") {
        if (i + 1 < src.length) {
          out += src[i + 1];
          i += 2;
          continue;
        }
      }
      if (ch === mode) {
        mode = "code";
      }
      i += 1;
    }
    return out;
  }

  function evaluateGraphExpressions(nodes, edges, globals = {}) {
    const nodeById = new Map(nodes.map((node) => [node.id, node]));
    const incoming = new Map();
    nodes.forEach((node) => incoming.set(node.id, []));
    edges.forEach((edge) => {
      if (incoming.has(edge.to) && nodeById.has(edge.from)) {
        incoming.get(edge.to).push(edge.from);
      }
    });

    const pending = new Set(nodes.map((node) => node.id));
    const results = new Map();
    let progressed = true;

    while (pending.size > 0 && progressed) {
      progressed = false;
      for (const nodeId of Array.from(pending)) {
        const node = nodeById.get(nodeId);
        if (!node) {
          pending.delete(nodeId);
          continue;
        }

        const predecessorIds = incoming.get(nodeId) || [];
        const context = { ...globals, ...ensureNodePropertyAccess(node) };
        let dependenciesReady = true;
        predecessorIds.forEach((fromId) => {
          const fromNode = nodeById.get(fromId);
          if (!fromNode) {
            return;
          }
          const depResult = results.get(fromId);
          if (!depResult || !depResult.ok) {
            dependenciesReady = false;
            return;
          }
          context[fromNode.name] = depResult.value;
        });

        if (!dependenciesReady) {
          continue;
        }

        const result = evaluateValueExpression(node.valueExpression, context);
        results.set(nodeId, result);
        pending.delete(nodeId);
        progressed = true;
      }
    }

    pending.forEach((nodeId) => {
      results.set(nodeId, { ok: false, reason: "dependency" });
    });

    return nodes.map((node) => ({
      id: node.id,
      result: results.get(node.id) || { ok: false, reason: "dependency" },
    }));
  }

  function isStateNode(node) {
    return String(node?.shape || "") === "rect";
  }

  function isParameterNode(node) {
    return String(node?.shape || "") === "diamond";
  }

  function hasExternalValue(node) {
    return Boolean(node?.externalValueEnabled);
  }

  function prepareStatefulExecutionPlan(nodes, edges) {
    const nodeById = new Map(nodes.map((node) => [node.id, node]));
    const incoming = new Map();
    nodes.forEach((node) => incoming.set(node.id, []));
    edges.forEach((edge) => {
      if (incoming.has(edge.to) && nodeById.has(edge.from)) {
        incoming.get(edge.to).push(edge.from);
      }
    });
    return {
      nodeById,
      incoming,
      stateNodes: nodes.filter((node) => isStateNode(node)),
    };
  }

  function evaluateStatefulGraphStep(nodes, edges, globals = {}, plan = null, options = {}) {
    const runtimePlan = plan || prepareStatefulExecutionPlan(nodes, edges);
    const nodeById = runtimePlan.nodeById;
    const incoming = runtimePlan.incoming;
    const stateValueOverrides = options?.stateValueOverrides instanceof Map ? options.stateValueOverrides : null;
    const derivativeStateNodeIds = options?.derivativeStateNodeIds instanceof Set ? options.derivativeStateNodeIds : null;
    const customNodeEvaluator = typeof options?.customNodeEvaluator === "function"
      ? options.customNodeEvaluator
      : null;
    const resolvedStateValue = (node) => {
      if (stateValueOverrides && stateValueOverrides.has(node.id)) {
        return stateValueOverrides.get(node.id);
      }
      return node.computedValue;
    };
    const fixedNodes = nodes.filter((node) => !isStateNode(node) && hasExternalValue(node));
    const parameterNodes = nodes.filter((node) => isParameterNode(node) && !hasExternalValue(node));
    const algebraicNodes = nodes.filter((node) => !isStateNode(node) && !isParameterNode(node) && !hasExternalValue(node));
    const fixedResults = new Map();
    const stateNodes = runtimePlan.stateNodes;
    const parameterResults = new Map();
    const algebraicResults = new Map();

    fixedNodes.forEach((node) => {
      fixedResults.set(node.id, { ok: true, value: node.externalValue });
    });

    parameterNodes.forEach((node) => {
      if (node.computedError) {
        parameterResults.set(node.id, { ok: false, reason: node.computedError });
        return;
      }
      if (node.computedValue !== null && node.computedValue !== undefined) {
        parameterResults.set(node.id, { ok: true, value: node.computedValue });
        return;
      }
      parameterResults.set(node.id, evaluateValueExpression(node.valueExpression, { ...globals }));
    });

    const pending = new Set(algebraicNodes.map((node) => node.id));
    let progressed = true;
    while (pending.size > 0 && progressed) {
      progressed = false;
      for (const nodeId of Array.from(pending)) {
        const node = nodeById.get(nodeId);
        if (!node) {
          pending.delete(nodeId);
          continue;
        }
        const context = { ...globals, ...ensureNodePropertyAccess(node) };
        const predecessors = incoming.get(nodeId) || [];
        let dependenciesReady = true;

        predecessors.forEach((fromId) => {
          if (!dependenciesReady) {
            return;
          }
          const fromNode = nodeById.get(fromId);
          if (!fromNode) {
            return;
          }
          if (isStateNode(fromNode)) {
            context[fromNode.name] = resolvedStateValue(fromNode);
            return;
          }
          if (hasExternalValue(fromNode)) {
            const depResult = fixedResults.get(fromId);
            if (!depResult || !depResult.ok) {
              dependenciesReady = false;
              return;
            }
            context[fromNode.name] = depResult.value;
            return;
          }
          if (isParameterNode(fromNode)) {
            const depResult = parameterResults.get(fromId);
            if (!depResult || !depResult.ok) {
              dependenciesReady = false;
              return;
            }
            context[fromNode.name] = depResult.value;
            return;
          }
          const depResult = algebraicResults.get(fromId);
          if (!depResult || !depResult.ok) {
            dependenciesReady = false;
            return;
          }
          context[fromNode.name] = depResult.value;
        });

        if (!dependenciesReady) {
          continue;
        }

        const customResult = customNodeEvaluator
          ? customNodeEvaluator(node, context, { globals, runtimePlan, predecessors })
          : null;
        const result = customResult || evaluateValueExpression(node.valueExpression, context);
        algebraicResults.set(nodeId, result);
        pending.delete(nodeId);
        progressed = true;
      }
    }

    pending.forEach((nodeId) => {
      algebraicResults.set(nodeId, { ok: false, reason: "dependency" });
    });

    const stateTransitionResults = new Map();
    stateNodes.forEach((node) => {
      const context = {
        ...globals,
        __self: resolvedStateValue(node),
        ...ensureNodePropertyAccess(node),
        integral: createStateIntegral(node, globals),
      };
      const predecessors = incoming.get(node.id) || [];
      let dependenciesReady = true;

      predecessors.forEach((fromId) => {
        if (!dependenciesReady) {
          return;
        }
        const fromNode = nodeById.get(fromId);
        if (!fromNode) {
          return;
        }
        if (isStateNode(fromNode)) {
          context[fromNode.name] = resolvedStateValue(fromNode);
          return;
        }
        if (hasExternalValue(fromNode)) {
          const depResult = fixedResults.get(fromId);
          if (!depResult || !depResult.ok) {
            dependenciesReady = false;
            return;
          }
          context[fromNode.name] = depResult.value;
          return;
        }
        if (isParameterNode(fromNode)) {
          const depResult = parameterResults.get(fromId);
          if (!depResult || !depResult.ok) {
            dependenciesReady = false;
            return;
          }
          context[fromNode.name] = depResult.value;
          return;
        }
        const depResult = algebraicResults.get(fromId);
        if (!depResult || !depResult.ok) {
          dependenciesReady = false;
          return;
        }
        context[fromNode.name] = depResult.value;
      });

      if (!dependenciesReady) {
        stateTransitionResults.set(node.id, { ok: false, reason: "dependency" });
        return;
      }
      if (derivativeStateNodeIds && derivativeStateNodeIds.has(node.id)) {
        stateTransitionResults.set(node.id, evaluateIntegralDerivativeList(node.valueExpression, context, {
          allowThisAlias: true,
        }));
        return;
      }
      stateTransitionResults.set(node.id, evaluateValueExpression(node.valueExpression, context, {
        allowThisAlias: true,
        allowIntegral: true,
      }));
    });

    return {
      algebraic: [
        ...fixedNodes.map((node) => ({
          id: node.id,
          result: fixedResults.get(node.id) || { ok: false, reason: "dependency" },
        })),
        ...parameterNodes.map((node) => ({
          id: node.id,
          result: parameterResults.get(node.id) || { ok: false, reason: "dependency" },
        })),
        ...algebraicNodes.map((node) => ({
          id: node.id,
          result: algebraicResults.get(node.id) || { ok: false, reason: "dependency" },
        })),
      ],
      stateTransitions: stateNodes.map((node) => ({
        id: node.id,
        result: stateTransitionResults.get(node.id) || { ok: false, reason: "dependency" },
      })),
    };
  }

  global.GraphSemantics = {
    normalizeName,
    isValidVariableName,
    isReservedWord,
    isFunctionName,
    isUniqueNodeName,
    validateNodeName,
    makeUniqueName,
    sanitizeNodeNames,
    validateComputedValue,
    evaluateValueExpression,
    validateExpressionSyntax,
    formatComputedValue,
    replaceIdentifierInExpression,
    analyzeStateTransitionExpression,
    evaluateIntegralDerivativeExpression,
    evaluateIntegralDerivativeList,
    evaluateStateTransitionExpressionWithIntegralValues,
    evaluateGraphExpressions,
    prepareStatefulExecutionPlan,
    evaluateStatefulGraphStep,
  };
})(window);
