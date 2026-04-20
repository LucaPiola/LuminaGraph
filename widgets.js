(() => {

function addTableWidget(at = null) {
  const id = widgetCounter++;
  const z = Math.max(0.0001, ui.zoom || 1);
  const x = at?.x ?? (graphViewport.scrollLeft + 40) / z;
  const y = at?.y ?? (graphViewport.scrollTop + 40) / z;
  graph.widgets.push({
    id,
    type: "table",
    customTitle: "",
    x,
    y,
    width: 360,
    height: 180,
    minimized: false,
    outputOnly: false,
    showHistory: false,
    rows: [],
    columns: [],
  });
}

function addCanvasText(at = null) {
  const id = textItemCounter++;
  const z = Math.max(0.0001, ui.zoom || 1);
  const x = at?.x ?? (graphViewport.scrollLeft + 60) / z;
  const y = at?.y ?? (graphViewport.scrollTop + 60) / z;
  graph.textItems.push({
    id,
    x,
    y,
    width: 240,
    height: 90,
    fillColor: "",
    strokeColor: "",
    html: `<p><strong>${t("menu.insert.text")}</strong></p><p>${t("text.defaultCanvasText")}</p>`,
  });
  selectTextItem(id);
}

function addMatrixWidget(at = null) {
  const id = widgetCounter++;
  const z = Math.max(0.0001, ui.zoom || 1);
  const x = at?.x ?? (graphViewport.scrollLeft + 60) / z;
  const y = at?.y ?? (graphViewport.scrollTop + 60) / z;
  graph.widgets.push({
    id,
    type: "matrix",
    customTitle: "",
    x,
    y,
    width: 320,
    height: 240,
    minimized: false,
    outputOnly: true,
    source: "",
    showNumericValues: true,
    showIndices: true,
    autoFitCells: true,
    cellSize: 28,
    colorScheme: "blue",
    rows: [],
    columns: [],
    xyPairs: [],
  });
}

function addLedWidget(at = null) {
  const id = widgetCounter++;
  const z = Math.max(0.0001, ui.zoom || 1);
  const x = at?.x ?? (graphViewport.scrollLeft + 60) / z;
  const y = at?.y ?? (graphViewport.scrollTop + 60) / z;
  const outputNames = graph.nodes.filter((n) => n.output).map((n) => n.name);
  graph.widgets.push({
    id,
    type: "led",
    customTitle: "",
    x,
    y,
    width: 220,
    height: 120,
    minimized: false,
    outputOnly: true,
    source: outputNames[0] || "",
    rows: [],
    columns: [],
    xyPairs: [],
  });
}

function addSliderWidget(at = null) {
  const id = widgetCounter++;
  const z = Math.max(0.0001, ui.zoom || 1);
  const x = at?.x ?? (graphViewport.scrollLeft + 80) / z;
  const y = at?.y ?? (graphViewport.scrollTop + 80) / z;
  const bindableNames = sliderBindableNodeNames();
  graph.widgets.push({
    id,
    type: "slider",
    customTitle: "",
    x,
    y,
    width: 340,
    height: 120,
    minimized: false,
    outputOnly: false,
    source: bindableNames[0] || "",
    min: 0,
    max: 100,
    step: 1,
    value: 0,
    rows: [],
    columns: [],
    xyPairs: [],
  });
}

function addButtonWidget(at = null) {
  const id = widgetCounter++;
  const z = Math.max(0.0001, ui.zoom || 1);
  const x = at?.x ?? (graphViewport.scrollLeft + 80) / z;
  const y = at?.y ?? (graphViewport.scrollTop + 80) / z;
  const bindableNames = buttonBindableNodeNames();
  graph.widgets.push({
    id,
    type: "button",
    customTitle: "",
    x,
    y,
    width: 260,
    height: 108,
    minimized: false,
    outputOnly: false,
    source: bindableNames[0] || "",
    value: false,
    rows: [],
    columns: [],
    xyPairs: [],
  });
}

function addXYChartWidget(at = null) {
  const id = widgetCounter++;
  const z = Math.max(0.0001, ui.zoom || 1);
  const x = at?.x ?? (graphViewport.scrollLeft + 80) / z;
  const y = at?.y ?? (graphViewport.scrollTop + 80) / z;
  const nodeNames = graph.nodes.filter((n) => n.output).map((n) => n.name);
  graph.widgets.push({
    id,
    type: "xychart",
    customTitle: "",
    x,
    y,
    width: 380,
    height: 240,
    minimized: false,
    outputOnly: false,
    xMin: null,
    xMax: null,
    yMin: null,
    yMax: null,
    showGrid: true,
    legendPosition: "top-right",
    xyPairs: [
      {
        xSource: "time",
        ySource: nodeNames[0] || "",
        showTimeSeries: true,
        showInstantProfile: false,
        color: defaultChartSeriesColor(0),
        showLine: true,
        lineWidth: 2.2,
        lineStyle: "solid",
        pointMode: "all",
        pointSize: 2.4,
        points: [],
      },
    ],
    columns: [],
  });
}

function getNodeByName(name) {
  return graph.nodes.find((n) => n.name === name);
}

function buildNodeNameMap() {
  return new Map(graph.nodes.map((node) => [String(node.name ?? ""), node]));
}

function getModelNodeByName(model, name) {
  return model?.nodes?.find((node) => node.name === name) || null;
}

function getModelNodeById(model, id) {
  return model?.nodes?.find((node) => node.id === id) || null;
}

function buildModelNodeNameMap(model) {
  return new Map((model?.nodes || []).map((node) => [String(node.name ?? ""), node]));
}

function defaultChartSeriesColor(index = 0) {
  return CHART_SERIES_PALETTE[Math.abs(Number(index) || 0) % CHART_SERIES_PALETTE.length];
}

function normalizeChartPointMode(value, legacyShowPoints = null) {
  if (value === "none" || value === "last" || value === "all") {
    return value;
  }
  if (legacyShowPoints === false) {
    return "none";
  }
  return "all";
}

function normalizeChartSeriesToggle(value, fallback = false) {
  return value == null ? Boolean(fallback) : value !== false;
}

function normalizeChartLineStyle(value) {
  if (value === "solid" || value === "dashed" || value === "dotted") {
    return value;
  }
  return "solid";
}

function chartLineDash(style) {
  if (style === "dashed") {
    return [8, 5];
  }
  if (style === "dotted") {
    return [2, 4];
  }
  return [];
}

function sanitizeWidgetColumns(widget) {
  if (!Array.isArray(widget.columns)) {
    widget.columns = [];
    return;
  }
  widget.columns = widget.columns.map((col) => {
    if (typeof col === "string") {
      return col;
    }
    if (col && typeof col === "object") {
      if (typeof col.source === "string") {
        return col.source;
      }
      if (typeof col.name === "string") {
        return col.name;
      }
      if (typeof col.label === "string") {
        return col.label;
      }
    }
    return String(col ?? "");
  });
}

function sanitizeTableWidgetOptions(widget) {
  widget.showHistory = Boolean(widget.showHistory);
  if (!Array.isArray(widget.rows)) {
    widget.rows = [];
  }
}

function sanitizeMatrixWidgetOptions(widget) {
  const allowedNames = new Set(graph.nodes.filter((n) => n.output).map((n) => n.name));
  widget.source = String(widget.source ?? "");
  if (widget.source && !allowedNames.has(widget.source)) {
    widget.source = "";
  }
  widget.showNumericValues = widget.showNumericValues !== false;
  widget.showIndices = widget.showIndices !== false;
  widget.autoFitCells = widget.autoFitCells !== false;
  widget.cellSize = Number.isFinite(Number(widget.cellSize)) ? clamp(Number(widget.cellSize), 2, 96) : 28;
  const allowedPalettes = new Set(["blue", "heat", "grayscale", "diverging", "none"]);
  widget.colorScheme = allowedPalettes.has(String(widget.colorScheme ?? "")) ? String(widget.colorScheme) : "blue";
}

function sanitizeLedWidgetOptions(widget) {
  const allowedNames = new Set(graph.nodes.filter((n) => n.output).map((n) => n.name));
  widget.source = String(widget.source ?? "");
  if (widget.source && !allowedNames.has(widget.source)) {
    widget.source = "";
  }
}

function sanitizeWidgetXYPairs(widget) {
  if (!Array.isArray(widget.xyPairs)) {
    widget.xyPairs = [];
  }
  widget.xyPairs = widget.xyPairs
    .map((pair, idx) => ({
      xSource: String(pair?.xSource ?? "time"),
      ySource: String(pair?.ySource ?? ""),
      showTimeSeries: normalizeChartSeriesToggle(pair?.showTimeSeries, pair?.seriesMode !== "instant"),
      showInstantProfile: normalizeChartSeriesToggle(pair?.showInstantProfile, pair?.seriesMode === "instant" ? true : false),
      color: /^#[0-9a-fA-F]{6}$/.test(String(pair?.color ?? "")) ? String(pair.color) : defaultChartSeriesColor(idx),
      showLine: pair?.showLine !== false,
      lineWidth: Number.isFinite(Number(pair?.lineWidth)) ? clamp(Number(pair.lineWidth), 1, 8) : 2.2,
      lineStyle: normalizeChartLineStyle(pair?.lineStyle),
      pointMode: normalizeChartPointMode(pair?.pointMode, pair?.showPoints),
      pointSize: Number.isFinite(Number(pair?.pointSize)) ? clamp(Number(pair.pointSize), 1, 12) : 2.4,
      seriesData: Array.isArray(pair?.seriesData)
        ? pair.seriesData.map((series) => ({
          label: String(series?.label ?? ""),
          points: Array.isArray(series?.points)
            ? series.points
              .map((p) => ({ x: Number(p?.x), y: Number(p?.y) }))
              .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
            : [],
        }))
        : [],
      instantSeriesData: Array.isArray(pair?.instantSeriesData)
        ? pair.instantSeriesData.map((series) => ({
          label: String(series?.label ?? ""),
          points: Array.isArray(series?.points)
            ? series.points
              .map((p) => ({ x: Number(p?.x), y: Number(p?.y) }))
              .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
            : [],
        }))
        : [],
      points: Array.isArray(pair?.points)
        ? pair.points
          .map((p) => ({ x: Number(p?.x), y: Number(p?.y) }))
          .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
        : [],
    }))
    .filter((pair) => pair.ySource);
}

function sanitizeXYChartOptions(widget) {
  const parseNumOrNull = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  };
  widget.xMin = parseNumOrNull(widget.xMin);
  widget.xMax = parseNumOrNull(widget.xMax);
  widget.yMin = parseNumOrNull(widget.yMin);
  widget.yMax = parseNumOrNull(widget.yMax);
  widget.showGrid = widget.showGrid !== false;
  widget.legendPosition = ["top-right", "top-left", "bottom-right", "bottom-left"].includes(String(widget.legendPosition ?? ""))
    ? String(widget.legendPosition)
    : "top-right";
}

function isFiniteScalar(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isFiniteVector(value) {
  return Array.isArray(value) && value.every((item) => isFiniteScalar(item));
}

function buildChartPairSeriesDefinitions(pair, xValue, yValue) {
  if (isFiniteScalar(xValue) && isFiniteScalar(yValue)) {
    return [
      {
        label: `${pair.xSource} -> ${pair.ySource}`,
        point: { x: xValue, y: yValue },
      },
    ];
  }

  if (isFiniteScalar(xValue) && isFiniteVector(yValue)) {
    return yValue.map((item) => ({
      label: `${pair.xSource} -> ${pair.ySource}`,
      point: { x: xValue, y: item },
    }));
  }

  if (isFiniteVector(xValue) && isFiniteVector(yValue) && xValue.length === yValue.length) {
    return xValue.map((xItem, idx) => ({
      label: `${pair.xSource} -> ${pair.ySource}`,
      point: { x: xItem, y: yValue[idx] },
    }));
  }

  return [];
}

function buildChartPairInstantSeriesDefinitions(pair, xValue, yValue) {
  if (isFiniteScalar(xValue) && isFiniteVector(yValue)) {
    return [
      {
        label: `${pair.xSource} -> ${pair.ySource}`,
        points: yValue.map((item) => ({ x: xValue, y: item })),
      },
    ];
  }

  if (isFiniteVector(xValue) && isFiniteVector(yValue) && xValue.length === yValue.length) {
    return [
      {
        label: `${pair.xSource} -> ${pair.ySource}`,
        points: xValue.map((xItem, idx) => ({ x: xItem, y: yValue[idx] })),
      },
    ];
  }

  return [];
}

function sanitizeSliderWidgetOptions(widget) {
  const parseFinite = (value, fallback) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };
  const allowedNames = new Set(sliderBindableNodeNames());
  widget.source = String(widget.source ?? "");
  if (widget.source && !allowedNames.has(widget.source)) {
    widget.source = "";
  }
  widget.min = parseFinite(widget.min, 0);
  widget.max = parseFinite(widget.max, 100);
  if (widget.max < widget.min) {
    const tmp = widget.min;
    widget.min = widget.max;
    widget.max = tmp;
  }
  widget.step = Math.abs(parseFinite(widget.step, 1));
  if (!Number.isFinite(widget.step) || widget.step <= 0) {
    widget.step = 1;
  }
  widget.value = parseFinite(widget.value, widget.min);
  if (widget.value < widget.min) {
    widget.value = widget.min;
  }
  if (widget.value > widget.max) {
    widget.value = widget.max;
  }
}

function sanitizeButtonWidgetOptions(widget) {
  const allowedNames = new Set(buttonBindableNodeNames());
  widget.source = String(widget.source ?? "");
  if (widget.source && !allowedNames.has(widget.source)) {
    widget.source = "";
  }
  widget.value = widget.value === true || widget.value === "true" || widget.value === 1 || widget.value === "1";
}

function isFiniteMatrix(value) {
  return Array.isArray(value)
    && value.length >= 0
    && value.every((row) => Array.isArray(row))
    && (value.length === 0 || value.every((row) => row.length === value[0].length))
    && value.every((row) => row.every((item) => isFiniteScalar(item)));
}

function snapSliderValue(value, min, max, step) {
  const raw = Number(value);
  const minVal = Number(min);
  const maxVal = Number(max);
  const stepVal = Math.abs(Number(step));
  if (!Number.isFinite(raw) || !Number.isFinite(minVal) || !Number.isFinite(maxVal)) {
    return 0;
  }
  const clamped = clamp(raw, minVal, maxVal);
  if (!Number.isFinite(stepVal) || stepVal <= 0) {
    return clamped;
  }
  const snapped = minVal + Math.round((clamped - minVal) / stepVal) * stepVal;
  const stepText = String(stepVal);
  const dotIndex = stepText.indexOf(".");
  const decimals = dotIndex >= 0 ? stepText.length - dotIndex - 1 : 0;
  return Number(clamp(snapped, minVal, maxVal).toFixed(Math.min(10, decimals)));
}

function applyWidgetDrivenNodeValues() {
  graph.nodes.forEach((node) => {
    node.externalValueEnabled = false;
    node.externalValue = null;
  });
  graph.widgets.forEach((widget) => {
    if (widget.type === "slider") {
      applySliderWidgetValueToNode(widget);
    } else if (widget.type === "button") {
      applyButtonWidgetValueToNode(widget);
    }
  });
}

function applySliderWidgetValueToNode(widget) {
  if (!widget || widget.type !== "slider") {
    return;
  }
  sanitizeSliderWidgetOptions(widget);
  if (!widget.source) {
    return;
  }
  const node = getNodeByName(widget.source);
  if (!canBindSliderToNode(node)) {
    return;
  }
  const value = Number(widget.value);
  node.externalValueEnabled = true;
  node.externalValue = value;
  node.computedValue = value;
  node.computedError = "";
}

function applyButtonWidgetValueToNode(widget) {
  if (!widget || widget.type !== "button") {
    return;
  }
  sanitizeButtonWidgetOptions(widget);
  if (!widget.source) {
    return;
  }
  const node = getNodeByName(widget.source);
  if (!canBindButtonToNode(node)) {
    return;
  }
  const value = widget.value ? 1 : 0;
  node.externalValueEnabled = true;
  node.externalValue = value;
  node.computedValue = value;
  node.computedError = "";
}

function resetModelExternalValues(model) {
  (model?.nodes || []).forEach((node) => {
    node.externalValueEnabled = false;
    node.externalValue = null;
  });
}

function applyRuntimeModelInputOverrides(model, inputValueMap = new Map()) {
  resetModelExternalValues(model);
  inputValueMap.forEach((value, name) => {
    const node = getModelNodeByName(model, name);
    if (!node) {
      return;
    }
    node.externalValueEnabled = true;
    node.externalValue = value;
    node.computedValue = value;
    node.computedError = "";
  });
}

function drawXYChart(canvas, seriesList = [], options = null) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  const drawRoundedRectPath = (x, y, w, h, r) => {
    const radius = Math.max(0, Math.min(r, w / 2, h / 2));
    if (typeof ctx.roundRect === "function") {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      return;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  };
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const activeSeries = (Array.isArray(seriesList) ? seriesList : [])
    .map((s, idx) => ({
      label: String(s?.label ?? ""),
      color: /^#[0-9a-fA-F]{6}$/.test(String(s?.color ?? "")) ? String(s.color) : defaultChartSeriesColor(idx),
      showLine: s?.showLine !== false,
      lineWidth: Number.isFinite(Number(s?.lineWidth)) ? clamp(Number(s.lineWidth), 1, 8) : 2.2,
      lineStyle: normalizeChartLineStyle(s?.lineStyle),
      pointMode: normalizeChartPointMode(s?.pointMode, s?.showPoints),
      pointSize: Number.isFinite(Number(s?.pointSize)) ? clamp(Number(s.pointSize), 1, 12) : 2.4,
      points: Array.isArray(s?.points)
        ? s.points
          .map((p) => ({ x: Number(p?.x), y: Number(p?.y) }))
          .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
        : [],
    }))
    .filter((s) => s.points.length > 0 && (s.showLine || s.pointMode !== "none"));

  if (activeSeries.length < 1) {
    return;
  }

  const cfg = {
    xMin: Number.isFinite(Number(options?.xMin)) ? Number(options.xMin) : null,
    xMax: Number.isFinite(Number(options?.xMax)) ? Number(options.xMax) : null,
    yMin: Number.isFinite(Number(options?.yMin)) ? Number(options.yMin) : null,
    yMax: Number.isFinite(Number(options?.yMax)) ? Number(options.yMax) : null,
    showGrid: options?.showGrid !== false,
    legendPosition: ["top-right", "top-left", "bottom-right", "bottom-left"].includes(String(options?.legendPosition ?? ""))
      ? String(options.legendPosition)
      : "top-right",
  };

  let minX = activeSeries[0].points[0].x;
  let maxX = activeSeries[0].points[0].x;
  let minY = activeSeries[0].points[0].y;
  let maxY = activeSeries[0].points[0].y;
  activeSeries.forEach((series) => {
    series.points.forEach((p) => {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    });
  });
  if (cfg.xMin != null && cfg.xMax != null && cfg.xMax > cfg.xMin) {
    minX = cfg.xMin;
    maxX = cfg.xMax;
  }
  if (cfg.yMin != null && cfg.yMax != null && cfg.yMax > cfg.yMin) {
    minY = cfg.yMin;
    maxY = cfg.yMax;
  }
  if (minX === maxX) {
    minX -= 1;
    maxX += 1;
  }
  if (minY === maxY) {
    minY -= 1;
    maxY += 1;
  }

  const niceStep = (span, approxTicks = 5) => {
    const raw = Math.abs(span) / Math.max(1, approxTicks);
    if (!Number.isFinite(raw) || raw <= 0) {
      return 1;
    }
    const power = 10 ** Math.floor(Math.log10(raw));
    const scaled = raw / power;
    let base = 1;
    if (scaled <= 1) {
      base = 1;
    } else if (scaled <= 2) {
      base = 2;
    } else if (scaled <= 5) {
      base = 5;
    } else {
      base = 10;
    }
    return base * power;
  };

  const buildTicks = (min, max, approxTicks = 5) => {
    const span = max - min;
    if (!Number.isFinite(span) || span <= 0) {
      return [min];
    }
    const step = niceStep(span, approxTicks);
    const start = Math.ceil(min / step) * step;
    const ticks = [min];
    for (let value = start; value < max; value += step) {
      if (Math.abs(value - min) < step * 0.25 || Math.abs(value - max) < step * 0.25) {
        continue;
      }
      ticks.push(Number(value.toFixed(12)));
    }
    ticks.push(max);
    return ticks.filter((value, index, arr) => index === 0 || Math.abs(value - arr[index - 1]) > step * 0.25);
  };

  ctx.font = "11px Segoe UI, Tahoma, sans-serif";
  const provisionalXTicks = buildTicks(minX, maxX, Math.max(4, Math.floor((width - 48) / 90)));
  const provisionalYTicks = buildTicks(minY, maxY, Math.max(4, Math.floor((height - 48) / 60)));
  const maxYLabelWidth = provisionalYTicks.reduce((max, tick) => {
    const label = formatNumberValue(tick);
    return Math.max(max, ctx.measureText(label).width);
  }, 0);
  const leftPad = Math.max(30, Math.ceil(maxYLabelWidth) + 14);
  const rightPad = 24;
  const topPad = 24;
  const bottomPad = 30;
  const plotW = Math.max(10, width - leftPad - rightPad);
  const plotH = Math.max(10, height - topPad - bottomPad);

  ctx.strokeStyle = "#c4d3df";
  ctx.lineWidth = 1;
  ctx.strokeRect(leftPad, topPad, plotW, plotH);

  const sx = (x) => leftPad + ((x - minX) / (maxX - minX)) * plotW;
  const sy = (y) => topPad + plotH - ((y - minY) / (maxY - minY)) * plotH;
  const xTicks = buildTicks(minX, maxX, Math.max(4, Math.floor(plotW / 90)));
  const yTicks = buildTicks(minY, maxY, Math.max(4, Math.floor(plotH / 60)));
  const chartPointBudget = Math.max(200, Math.floor(plotW * 2));
  const sampleSeriesPoints = (points) => {
    if (!Array.isArray(points) || points.length <= chartPointBudget) {
      return points;
    }
    const stride = Math.max(1, Math.ceil(points.length / chartPointBudget));
    const sampled = [];
    for (let i = 0; i < points.length; i += stride) {
      sampled.push(points[i]);
    }
    if (sampled[sampled.length - 1] !== points[points.length - 1]) {
      sampled.push(points[points.length - 1]);
    }
    return sampled;
  };

  if (cfg.showGrid) {
    ctx.strokeStyle = "#d3dee8";
    ctx.lineWidth = 1;
    xTicks.slice(1, -1).forEach((tick) => {
      const gx = sx(tick);
      ctx.beginPath();
      ctx.moveTo(gx, topPad);
      ctx.lineTo(gx, topPad + plotH);
      ctx.stroke();
    });
    yTicks.slice(1, -1).forEach((tick) => {
      const gy = sy(tick);
      ctx.beginPath();
      ctx.moveTo(leftPad, gy);
      ctx.lineTo(leftPad + plotW, gy);
      ctx.stroke();
    });
  }

  ctx.strokeStyle = "#aebfd0";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(leftPad, topPad + plotH);
  ctx.lineTo(leftPad + plotW, topPad + plotH);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(leftPad, topPad);
  ctx.lineTo(leftPad, topPad + plotH);
  ctx.stroke();

  activeSeries.forEach((series, s) => {
    const color = series.color || defaultChartSeriesColor(s);
    const chartPoints = sampleSeriesPoints(series.points);
    ctx.strokeStyle = color;
    ctx.lineWidth = series.lineWidth;
    ctx.setLineDash(chartLineDash(series.lineStyle));
    if (series.showLine) {
      ctx.beginPath();
      let moved = false;
      chartPoints.forEach((p) => {
        const x = sx(p.x);
        const y = sy(p.y);
        if (!moved) {
          ctx.moveTo(x, y);
          moved = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      if (moved) {
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);
    if (series.pointMode !== "none") {
      ctx.fillStyle = color;
      const pointsToDraw = series.pointMode === "last"
        ? [chartPoints[chartPoints.length - 1]].filter(Boolean)
        : chartPoints;
      pointsToDraw.forEach((p) => {
        const x = sx(p.x);
        const y = sy(p.y);
        ctx.beginPath();
        ctx.arc(x, y, series.pointSize, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  });

  ctx.strokeStyle = "#b8c8d8";
  ctx.lineWidth = 1;
  xTicks.forEach((tick) => {
    const x = sx(tick);
    ctx.beginPath();
    ctx.moveTo(x, topPad + plotH);
    ctx.lineTo(x, topPad + plotH + 4);
    ctx.stroke();
  });
  yTicks.forEach((tick) => {
    const y = sy(tick);
    ctx.beginPath();
    ctx.moveTo(leftPad - 4, y);
    ctx.lineTo(leftPad, y);
    ctx.stroke();
  });

  ctx.fillStyle = "#4e6072";
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  xTicks.forEach((tick, index) => {
    const label = formatNumberValue(tick);
    const x = sx(tick);
    if (index === 0) {
      ctx.textAlign = "left";
      ctx.fillText(label, leftPad, topPad + plotH + 8);
    } else if (index === xTicks.length - 1) {
      ctx.textAlign = "right";
      ctx.fillText(label, leftPad + plotW, topPad + plotH + 8);
    } else {
      ctx.textAlign = "center";
      ctx.fillText(label, x, topPad + plotH + 8);
    }
  });
  ctx.textAlign = "right";
  yTicks.forEach((tick, index) => {
    const label = formatNumberValue(tick);
    const y = sy(tick);
    if (index === 0) {
      ctx.fillText(label, leftPad - 8, topPad + plotH - 6);
    } else if (index === yTicks.length - 1) {
      ctx.fillText(label, leftPad - 8, topPad - 6);
    } else {
      ctx.fillText(label, leftPad - 8, y - 6);
    }
  });

  const legendSeries = [];
  const seenLegendLabels = new Set();
  activeSeries.forEach((series, idx) => {
    const key = String(series.label || `s${idx + 1}`);
    if (seenLegendLabels.has(key)) {
      return;
    }
    seenLegendLabels.add(key);
    legendSeries.push({ ...series, legendIndex: idx });
  });
  const visibleLegend = legendSeries.slice(0, 10);
  if (visibleLegend.length > 0) {
    ctx.font = "11px Segoe UI, Tahoma, sans-serif";
    const sampleWidth = 18;
    const sampleGap = 8;
    const rowHeight = 18;
    const legendPaddingX = 10;
    const legendPaddingY = 8;
    const maxLabelWidth = visibleLegend.reduce((max, series, idx) => {
      return Math.max(max, ctx.measureText(series.label || `s${idx + 1}`).width);
    }, 0);
    const legendWidth = Math.ceil(legendPaddingX * 2 + sampleWidth + sampleGap + maxLabelWidth);
    const legendHeight = Math.ceil(legendPaddingY * 2 + visibleLegend.length * rowHeight);
    let legendLeft = leftPad + plotW - legendWidth - 8;
    let legendTop = topPad + 8;
    if (cfg.legendPosition === "top-left") {
      legendLeft = leftPad + 8;
      legendTop = topPad + 8;
    } else if (cfg.legendPosition === "bottom-right") {
      legendLeft = leftPad + plotW - legendWidth - 8;
      legendTop = topPad + plotH - legendHeight - 8;
    } else if (cfg.legendPosition === "bottom-left") {
      legendLeft = leftPad + 8;
      legendTop = topPad + plotH - legendHeight - 8;
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    ctx.strokeStyle = "#d2dde7";
    ctx.lineWidth = 1;
    drawRoundedRectPath(legendLeft, legendTop, legendWidth, legendHeight, 8);
    ctx.fill();
    ctx.stroke();

    visibleLegend.forEach((series, idx) => {
      const rowY = legendTop + legendPaddingY + idx * rowHeight + rowHeight / 2;
      const sampleX = legendLeft + legendPaddingX;
      ctx.strokeStyle = series.color || defaultChartSeriesColor(series.legendIndex ?? idx);
      ctx.lineWidth = series.lineWidth || 2.2;
      ctx.setLineDash(chartLineDash(series.lineStyle));
      ctx.beginPath();
      ctx.moveTo(sampleX, rowY);
      ctx.lineTo(sampleX + sampleWidth, rowY);
      ctx.stroke();
      ctx.setLineDash([]);
      if (series.pointMode !== "none") {
        ctx.fillStyle = series.color || defaultChartSeriesColor(series.legendIndex ?? idx);
        ctx.beginPath();
        ctx.arc(sampleX + sampleWidth / 2, rowY, Math.min(3, series.pointSize || 2.4), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#334b60";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(series.label || `s${idx + 1}`, sampleX + sampleWidth + sampleGap, rowY);
    });
    ctx.textBaseline = "top";
  }
}

function updateXYWidgetsFromComputedValues(timeValue = null, nodeMap = buildNodeNameMap()) {
  const currentTime = Number(
    Number.isFinite(Number(timeValue)) ? timeValue : graph.execution.currentTime,
  );
  graph.widgets.forEach((widget) => {
    if (widget.type !== "xychart") {
      return;
    }
    sanitizeWidgetXYPairs(widget);
    widget.xyPairs.forEach((pair) => {
      if (widget.outputOnly) {
        const xAllowed = pair.xSource === "time" || nodeMap.get(pair.xSource)?.output;
        const yAllowed = pair.ySource === "time" || nodeMap.get(pair.ySource)?.output;
        if (!xAllowed || !yAllowed) {
          return;
        }
      }
      if (pair.xSource !== "time") {
        const xNode = nodeMap.get(pair.xSource);
        if (!xNode || xNode.computedError) {
          return;
        }
      }
      if (pair.ySource !== "time") {
        const yNode = nodeMap.get(pair.ySource);
        if (!yNode || yNode.computedError) {
          return;
        }
      }
      const xVal = pair.xSource === "time"
        ? currentTime
        : nodeMap.get(pair.xSource)?.computedValue;
      const yVal = pair.ySource === "time"
        ? currentTime
        : nodeMap.get(pair.ySource)?.computedValue;
      if (pair.showInstantProfile) {
        pair.instantSeriesData = buildChartPairInstantSeriesDefinitions(pair, xVal, yVal);
      } else {
        pair.instantSeriesData = [];
      }
      if (pair.showTimeSeries) {
        const seriesDefs = buildChartPairSeriesDefinitions(pair, xVal, yVal);
        if (seriesDefs.length === 0) {
          return;
        }
        if (!Array.isArray(pair.seriesData)) {
          pair.seriesData = [];
        }
        seriesDefs.forEach((seriesDef, idx) => {
          if (!pair.seriesData[idx] || pair.seriesData[idx].label !== seriesDef.label) {
            pair.seriesData[idx] = { label: seriesDef.label, points: [] };
          }
          pair.seriesData[idx].points.push(seriesDef.point);
        });
        if (pair.seriesData.length > seriesDefs.length) {
          pair.seriesData = pair.seriesData.slice(0, seriesDefs.length);
        }
      } else {
        pair.seriesData = [];
      }
    });
  });
}

function updateTableWidgetsFromComputedValues(timeValue = null, nodeMap = buildNodeNameMap()) {
  const currentTime = Number(
    Number.isFinite(Number(timeValue)) ? timeValue : graph.execution.currentTime,
  );
  graph.widgets.forEach((widget) => {
    if (widget.type !== "table") {
      return;
    }
    sanitizeWidgetColumns(widget);
    sanitizeTableWidgetOptions(widget);
    if (!widget.showHistory) {
      return;
    }
    const displayedCols = widget.outputOnly
      ? widget.columns.filter((name) => name === "time" || nodeMap.get(name)?.output)
      : widget.columns.slice();
    const values = {};
    displayedCols.forEach((colName) => {
      if (colName === "time") {
        values.time = { value: currentTime };
        return;
      }
      const node = nodeMap.get(colName);
      if (!node) {
        values[colName] = { value: null };
        return;
      }
      if (node.computedError) {
        values[colName] = { error: node.computedError };
        return;
      }
      values[colName] = { value: node.computedValue };
    });
    widget.rows.push({ values });
  });
}

function clearAllXYChartPoints() {
  graph.widgets.forEach((widget) => {
    if (widget.type === "xychart") {
      sanitizeWidgetXYPairs(widget);
      widget.xyPairs.forEach((pair) => {
        pair.points = [];
        pair.seriesData = [];
        pair.instantSeriesData = [];
      });
    }
  });
}

function clearAllTableWidgetRows() {
  graph.widgets.forEach((widget) => {
    if (widget.type === "table") {
      sanitizeTableWidgetOptions(widget);
      widget.rows = [];
    }
  });
}

function copyTextToClipboard(text) {
  const content = String(text ?? "");
  if (!content) {
    return Promise.resolve(false);
  }
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    return navigator.clipboard.writeText(content).then(() => true).catch(() => false);
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return Promise.resolve(Boolean(ok));
  } catch (_err) {
    return Promise.resolve(false);
  }
}

function renderMatrixGrid(body, widget, matrix) {
  const rowCount = matrix.length;
  const colCount = rowCount > 0 ? matrix[0].length : 0;
  const grid = document.createElement("div");
  grid.className = "matrix-widget-grid";
  const showIndices = widget.showIndices !== false;
  const headerOffset = showIndices ? 1 : 0;
  const availableWidth = Math.max(40, Math.floor(widget.width - 16));
  const availableHeight = Math.max(40, Math.floor(widget.height - 44));
  const fitSize = Math.floor(Math.min(
    availableWidth / Math.max(1, colCount + headerOffset),
    availableHeight / Math.max(1, rowCount + headerOffset),
  ));
  const cellSize = widget.autoFitCells
    ? clamp(fitSize || widget.cellSize, 2, 96)
    : clamp(Number(widget.cellSize) || 28, 2, 96);
  grid.style.setProperty("--matrix-cell-size", `${cellSize}px`);
  grid.style.setProperty("--matrix-font-size", `${Math.max(0, Math.floor(cellSize * 0.45))}px`);
  grid.style.gridTemplateColumns = `repeat(${Math.max(1, colCount + headerOffset)}, ${cellSize}px)`;
  grid.style.width = `${Math.max(1, colCount + headerOffset) * cellSize}px`;
  if (showIndices) {
    const corner = document.createElement("div");
    corner.className = "matrix-widget-cell matrix-widget-index";
    corner.textContent = "";
    grid.appendChild(corner);
    for (let colIdx = 0; colIdx < colCount; colIdx += 1) {
      const th = document.createElement("div");
      th.className = "matrix-widget-cell matrix-widget-index";
      th.textContent = String(colIdx);
      grid.appendChild(th);
    }
  }

  let minValue = 0;
  let maxValue = 0;
  if (isFiniteMatrix(matrix) && rowCount > 0 && colCount > 0) {
    minValue = matrix[0][0];
    maxValue = matrix[0][0];
    matrix.forEach((row) => row.forEach((value) => {
      minValue = Math.min(minValue, value);
      maxValue = Math.max(maxValue, value);
    }));
  }
  matrix.forEach((row, rowIdx) => {
    if (showIndices) {
      const rowHeader = document.createElement("div");
      rowHeader.className = "matrix-widget-cell matrix-widget-index";
      rowHeader.textContent = String(rowIdx);
      grid.appendChild(rowHeader);
    }
    row.forEach((value) => {
      const td = document.createElement("div");
      td.className = "matrix-widget-cell matrix-widget-value";
      td.textContent = widget.showNumericValues ? formatComputedValue(value) : "";
      const bg = matrixCellBackgroundColor(value, minValue, maxValue, widget.colorScheme);
      if (bg) {
        td.style.backgroundColor = bg;
      }
      grid.appendChild(td);
    });
  });
  body.appendChild(grid);
}

function widgetDefaultTitle(widget) {
  if (widget.type === "xychart") {
    return t("widget.chartTitle", { id: widget.id });
  }
  if (widget.type === "matrix") {
    return t("widget.matrixTitle", { id: widget.id });
  }
  if (widget.type === "slider") {
    return t("widget.sliderTitle", { id: widget.id });
  }
  if (widget.type === "button") {
    return t("widget.buttonTitle", { id: widget.id });
  }
  if (widget.type === "led") {
    return t("widget.ledTitle", { id: widget.id });
  }
  return t("widget.tableTitle", { id: widget.id });
}

function widgetDisplayTitle(widget) {
  const custom = String(widget.customTitle ?? "").trim();
  return custom || widgetDefaultTitle(widget);
}

function widgetDisplayedTableColumns(widget, nodeMap = buildNodeNameMap()) {
  return widget.outputOnly
    ? widget.columns.filter((name) => name === "time" || nodeMap.get(name)?.output)
    : widget.columns.slice();
}

function buildTableRowElement(displayedCols, entry) {
  const row = document.createElement("tr");
  displayedCols.forEach((colName) => {
    const td = document.createElement("td");
    const cell = entry?.values?.[colName];
    if (cell?.error) {
      td.textContent = t("text.valueError", { reason: evalReasonText(cell.error) });
    } else if (Object.prototype.hasOwnProperty.call(entry?.values || {}, colName)) {
      td.textContent = formatComputedValue(cell?.value ?? null);
    } else {
      td.textContent = "-";
    }
    row.appendChild(td);
  });
  return row;
}

function matrixPaletteColor(scheme, ratio) {
  const tValue = clamp(Number(ratio) || 0, 0, 1);
  if (scheme === "heat") {
    const hue = 44 - (44 * tValue);
    const sat = 90;
    const light = 94 - (46 * tValue);
    return `hsl(${hue.toFixed(1)} ${sat}% ${light.toFixed(1)}%)`;
  }
  if (scheme === "grayscale") {
    const light = 98 - (68 * tValue);
    return `hsl(210 10% ${light.toFixed(1)}%)`;
  }
  if (scheme === "diverging") {
    const hue = tValue < 0.5 ? 210 : 12;
    const distance = Math.abs(tValue - 0.5) * 2;
    const sat = 68;
    const light = 96 - (44 * distance);
    return `hsl(${hue} ${sat}% ${light.toFixed(1)}%)`;
  }
  return `hsl(204 76% ${94 - (38 * tValue)}%)`;
}

function matrixCellBackgroundColor(value, minValue, maxValue, scheme) {
  if (scheme === "none" || !isFiniteScalar(value)) {
    return "";
  }
  const range = maxValue - minValue;
  if (range > 0) {
    return matrixPaletteColor(scheme, (value - minValue) / range);
  }
  if (value === 0) {
    return "";
  }
  return matrixPaletteColor(scheme, 0.55);
}

function coerceLedState(value) {
  if (value === true || value === false) {
    return { ok: true, value };
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value === 0) {
      return { ok: true, value: false };
    }
    if (value === 1) {
      return { ok: true, value: true };
    }
  }
  if (typeof value === "string") {
    const lower = value.trim().toLowerCase();
    if (lower === "true") {
      return { ok: true, value: true };
    }
    if (lower === "false") {
      return { ok: true, value: false };
    }
  }
  return { ok: false, value: false };
}

function renderLedWidgetBody(body, widget, nodeMap = buildNodeNameMap()) {
  body.innerHTML = "";
  const sourceNode = nodeMap.get(widget.source) || null;
  const wrap = document.createElement("div");
  wrap.className = "led-widget-wrap";
  const sourceLine = document.createElement("div");
  sourceLine.className = "led-widget-source";
  sourceLine.textContent = widget.source || t("widget.noneOption");
  wrap.appendChild(sourceLine);

  const display = document.createElement("div");
  display.className = "led-widget-display";
  const lamp = document.createElement("div");
  lamp.className = "led-widget-lamp";
  const label = document.createElement("div");
  label.className = "led-widget-label";

  if (!sourceNode) {
    lamp.classList.add("is-invalid");
    label.textContent = t("widget.noneOption");
  } else if (sourceNode.computedError) {
    lamp.classList.add("is-invalid");
    label.textContent = localizeExpressionErrorMessage(String(sourceNode.computedError || ""));
  } else {
    const coerced = coerceLedState(sourceNode.computedValue);
    if (coerced.ok) {
      lamp.classList.toggle("is-on", coerced.value);
      lamp.classList.toggle("is-off", !coerced.value);
      label.textContent = coerced.value ? t("widget.ledState.on") : t("widget.ledState.off");
    } else {
      lamp.classList.add("is-invalid");
      label.textContent = t("widget.ledInvalid");
    }
  }

  display.appendChild(lamp);
  display.appendChild(label);
  wrap.appendChild(display);
  body.appendChild(wrap);
}

function renderMatrixWidgetBody(body, widget, nodeMap = buildNodeNameMap()) {
  body.innerHTML = "";
  sanitizeMatrixWidgetOptions(widget);
  const sourceNode = nodeMap.get(widget.source);
  if (!sourceNode || !widget.source) {
    const msg = document.createElement("div");
    msg.className = "empty-props";
    msg.textContent = t("widget.matrixEmpty");
    body.appendChild(msg);
    return;
  }
  if (sourceNode.computedError) {
    if (Array.isArray(widget.lastMatrixValue)) {
      renderMatrixGrid(body, widget, widget.lastMatrixValue);
      return;
    }
    const msg = document.createElement("div");
    msg.className = "empty-props error";
    msg.textContent = t("text.valueError", { reason: evalReasonText(sourceNode.computedError) });
    body.appendChild(msg);
    return;
  }
  const matrix = sourceNode.computedValue;
  if (!Array.isArray(matrix) || !matrix.every((row) => Array.isArray(row))) {
    if (Array.isArray(widget.lastMatrixValue)) {
      renderMatrixGrid(body, widget, widget.lastMatrixValue);
      return;
    }
    const msg = document.createElement("div");
    msg.className = "empty-props";
    msg.textContent = t("widget.matrixNotMatrix");
    body.appendChild(msg);
    return;
  }
  const rowCount = matrix.length;
  const colCount = rowCount > 0 ? matrix[0].length : 0;
  if (!matrix.every((row) => row.length === colCount)) {
    if (Array.isArray(widget.lastMatrixValue)) {
      renderMatrixGrid(body, widget, widget.lastMatrixValue);
      return;
    }
    const msg = document.createElement("div");
    msg.className = "empty-props";
    msg.textContent = t("widget.matrixNotMatrix");
    body.appendChild(msg);
    return;
  }
  widget.lastMatrixValue = deepClone(matrix);
  renderMatrixGrid(body, widget, matrix);
}

function renderTableWidgetBody(body, widget, nodeMap = buildNodeNameMap()) {
  body.innerHTML = "";
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  const displayedCols = widgetDisplayedTableColumns(widget, nodeMap);
  displayedCols.forEach((colName) => {
    const th = document.createElement("th");
    th.textContent = colName || t("widget.columnEmpty");
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  table.dataset.columns = JSON.stringify(displayedCols);
  if (widget.showHistory) {
    sanitizeTableWidgetOptions(widget);
    widget.rows.forEach((entry) => {
      tbody.appendChild(buildTableRowElement(displayedCols, entry));
    });
    table.dataset.rowCount = String(widget.rows.length);
  } else {
    const row = document.createElement("tr");
    displayedCols.forEach((colName) => {
      const td = document.createElement("td");
      if (colName === "time") {
        const tVal = graph.execution.currentTime == null ? graph.execution.t0 : graph.execution.currentTime;
        td.textContent = formatNumberValue(Number(tVal));
      } else {
        const node = nodeMap.get(colName);
        if (!node) {
          td.textContent = "-";
        } else if (node.computedError) {
          td.textContent = t("text.valueError", { reason: evalReasonText(node.computedError) });
        } else {
          td.textContent = formatComputedValue(node.computedValue);
        }
      }
      row.appendChild(td);
    });
    tbody.appendChild(row);
    table.dataset.rowCount = "1";
  }
  table.appendChild(tbody);
  body.appendChild(table);
  if (widget.showHistory) {
    window.requestAnimationFrame(() => {
      body.scrollTop = body.scrollHeight;
    });
  }
}

function matrixWidgetStructuredText(widget, nodeMap = buildNodeNameMap()) {
  sanitizeMatrixWidgetOptions(widget);
  const sourceNode = nodeMap.get(widget.source);
  let matrix = null;
  if (
    sourceNode &&
    !sourceNode.computedError &&
    Array.isArray(sourceNode.computedValue) &&
    sourceNode.computedValue.every((row) => Array.isArray(row))
  ) {
    const rowCount = sourceNode.computedValue.length;
    const colCount = rowCount > 0 ? sourceNode.computedValue[0].length : 0;
    if (sourceNode.computedValue.every((row) => row.length === colCount)) {
      matrix = sourceNode.computedValue;
    }
  }
  if (!matrix && Array.isArray(widget.lastMatrixValue)) {
    matrix = widget.lastMatrixValue;
  }
  if (!Array.isArray(matrix)) {
    return "";
  }
  return matrix
    .map((row) => row.map((value) => formatComputedValue(value)).join("\t"))
    .join("\n")
    .trim();
}

function widgetRenderedText(widget) {
  if (widget?.type === "matrix") {
    return matrixWidgetStructuredText(widget);
  }
  const root = widgetLayer.querySelector(`.value-widget[data-widget-id="${widget.id}"]`);
  const body = root?.querySelector(".value-widget-body");
  return String(body?.innerText || "").trim();
}

function refreshTableWidgetRuntimeBody(root, widget, nodeMap = buildNodeNameMap()) {
  const body = root.querySelector(".value-widget-body");
  const table = body?.querySelector("table");
  const displayedCols = widgetDisplayedTableColumns(widget, nodeMap);
  const columnsKey = JSON.stringify(displayedCols);
  if (!body || !table || table.dataset.columns !== columnsKey) {
    renderTableWidgetBody(body || root.querySelector(".value-widget-body"), widget, nodeMap);
    return;
  }
  const tbody = table.querySelector("tbody");
  if (!tbody) {
    renderTableWidgetBody(body, widget, nodeMap);
    return;
  }
  if (widget.showHistory) {
    sanitizeTableWidgetOptions(widget);
    const renderedRows = Number(table.dataset.rowCount || 0);
    if (renderedRows > widget.rows.length) {
      renderTableWidgetBody(body, widget, nodeMap);
      return;
    }
    for (let i = renderedRows; i < widget.rows.length; i += 1) {
      tbody.appendChild(buildTableRowElement(displayedCols, widget.rows[i]));
    }
    table.dataset.rowCount = String(widget.rows.length);
    window.requestAnimationFrame(() => {
      body.scrollTop = body.scrollHeight;
    });
    return;
  }
  renderTableWidgetBody(body, widget, nodeMap);
}

function refreshMatrixWidgetRuntimeBody(root, widget, nodeMap = buildNodeNameMap()) {
  const body = root.querySelector(".value-widget-body");
  if (!body) {
    renderWidgets();
    return;
  }
  renderMatrixWidgetBody(body, widget, nodeMap);
}

function refreshChartWidgetRuntimeBody(root, widget, nodeMap = buildNodeNameMap()) {
  const canvas = root.querySelector("canvas.xy-chart-canvas");
  if (!canvas) {
    renderWidgets();
    return;
  }
  const displayedPairs = widget.outputOnly
    ? widget.xyPairs.filter((pair) => {
      const xAllowed = pair.xSource === "time" || nodeMap.get(pair.xSource)?.output;
      const yAllowed = pair.ySource === "time" || nodeMap.get(pair.ySource)?.output;
      return xAllowed && yAllowed;
    })
    : widget.xyPairs;
  const seriesList = displayedPairs.flatMap((pair) => {
    const out = [];
    if (pair.showTimeSeries) {
      const seriesData = Array.isArray(pair.seriesData) && pair.seriesData.length > 0
        ? pair.seriesData
        : [{ label: `${pair.xSource} -> ${pair.ySource}`, points: pair.points || [] }];
      out.push(...seriesData.map((series, idx) => ({
        label: series.label || `${pair.xSource} -> ${pair.ySource}${seriesData.length > 1 ? ` [${idx}]` : ""}`,
        color: pair.color,
        showLine: pair.showLine,
        lineWidth: pair.lineWidth,
        lineStyle: pair.lineStyle,
        pointMode: pair.pointMode,
        pointSize: pair.pointSize,
        points: series.points || [],
      })));
    }
    if (pair.showInstantProfile) {
      const instantSeriesData = Array.isArray(pair.instantSeriesData) && pair.instantSeriesData.length > 0
        ? pair.instantSeriesData
        : [];
      out.push(...instantSeriesData.map((series) => ({
        label: series.label || `${pair.xSource} -> ${pair.ySource}`,
        color: pair.color,
        showLine: pair.showLine,
        lineWidth: pair.lineWidth,
        lineStyle: pair.lineStyle,
        pointMode: pair.pointMode === "last" ? "all" : pair.pointMode,
        pointSize: pair.pointSize,
        points: series.points || [],
      })));
    }
    return out;
  });
  drawXYChart(canvas, seriesList, widget);
}

function refreshSliderWidgetRuntimeBody(root, widget) {
  const rangeInput = root.querySelector("input[type='range']");
  const valueInput = root.querySelector(".slider-widget-number");
  const sourceLine = root.querySelector(".slider-widget-source");
  const minLabel = root.querySelector(".slider-bound-min");
  const maxLabel = root.querySelector(".slider-bound-max");
  const sourceNode = getNodeByName(widget.source);
  const lockedForRun = sourceNode?.shape === "diamond" && graph.execution.currentTime != null;
  if (sourceLine) {
    sourceLine.textContent = widget.source || t("text.unnamed");
  }
  if (rangeInput) {
    rangeInput.min = String(widget.min);
    rangeInput.max = String(widget.max);
    rangeInput.step = String(widget.step);
    rangeInput.value = String(widget.value);
    rangeInput.disabled = lockedForRun;
  }
  if (valueInput) {
    valueInput.min = String(widget.min);
    valueInput.max = String(widget.max);
    valueInput.step = String(widget.step);
    valueInput.value = String(widget.value);
    valueInput.disabled = lockedForRun;
  }
  if (minLabel) {
    minLabel.textContent = formatNumberValue(Number(widget.min));
  }
  if (maxLabel) {
    maxLabel.textContent = formatNumberValue(Number(widget.max));
  }
}

function refreshButtonWidgetRuntimeBody(root, widget) {
  sanitizeButtonWidgetOptions(widget);
  const body = root.querySelector(".value-widget-body");
  const toggleBtn = body?.querySelector(".button-widget-toggle");
  const sourceLine = body?.querySelector(".button-widget-source");
  if (!body || !toggleBtn || !sourceLine) {
    renderWidgets();
    return;
  }
  const sourceNode = getNodeByName(widget.source);
  const lockedForRun = sourceNode?.shape === "diamond" && graph.execution.currentTime != null;
  sourceLine.textContent = widget.source || t("text.unnamed");
  toggleBtn.disabled = lockedForRun;
  toggleBtn.classList.toggle("is-on", Boolean(widget.value));
  toggleBtn.classList.toggle("is-off", !Boolean(widget.value));
  toggleBtn.textContent = widget.value ? t("widget.buttonState.true") : t("widget.buttonState.false");
}

function refreshLedWidgetRuntimeBody(root, widget, nodeMap = buildNodeNameMap()) {
  sanitizeLedWidgetOptions(widget);
  const body = root.querySelector(".value-widget-body");
  if (!body) {
    renderWidgets();
    return;
  }
  renderLedWidgetBody(body, widget, nodeMap);
}

function refreshRuntimeWidgetContents() {
  const roots = [...widgetLayer.querySelectorAll(".value-widget[data-widget-id]")];
  if (roots.length !== graph.widgets.length) {
    renderWidgets();
    return;
  }
  const rootMap = new Map(roots.map((root) => [Number(root.dataset.widgetId), root]));
  const nodeMap = buildNodeNameMap();
  for (const widget of graph.widgets) {
    const root = rootMap.get(widget.id);
    if (!root) {
      renderWidgets();
      return;
    }
    if (widget.type === "table") {
      refreshTableWidgetRuntimeBody(root, widget, nodeMap);
    } else if (widget.type === "matrix") {
      refreshMatrixWidgetRuntimeBody(root, widget, nodeMap);
    } else if (widget.type === "xychart") {
      refreshChartWidgetRuntimeBody(root, widget, nodeMap);
    } else if (widget.type === "slider") {
      refreshSliderWidgetRuntimeBody(root, widget);
    } else if (widget.type === "button") {
      refreshButtonWidgetRuntimeBody(root, widget);
    } else if (widget.type === "led") {
      refreshLedWidgetRuntimeBody(root, widget, nodeMap);
    } else {
      renderWidgets();
      return;
    }
  }
}

function refreshRuntimeView() {
  clearStrictInvalidNodeValues();
  updateModelRunButtons();
  updateMenuTimeLabel();
  if (ui.sliderInteraction == null) {
    applyWidgetDrivenNodeValues();
    refreshRuntimeWidgetContents();
  } else {
    applyWidgetDrivenNodeValues();
  }
  refreshRenderedNodeTooltipElements();
  refreshSidebar();
  refreshActiveTooltip();
  updateEditingLockUi();
}

function renderWidgets() {
  widgetLayer.innerHTML = "";
  applyWidgetDrivenNodeValues();
  const view = svg.viewBox.baseVal;
  const viewMinX = view?.x ?? 0;
  const viewMinY = view?.y ?? 0;

  graph.widgets.forEach((widget) => {
    if (widget.type !== "table" && widget.type !== "xychart" && widget.type !== "slider" && widget.type !== "matrix" && widget.type !== "button" && widget.type !== "led") {
      return;
    }
    if (widget.type === "table") {
      sanitizeWidgetColumns(widget);
      sanitizeTableWidgetOptions(widget);
    } else if (widget.type === "matrix") {
      sanitizeMatrixWidgetOptions(widget);
    } else if (widget.type === "xychart") {
      sanitizeWidgetXYPairs(widget);
      sanitizeXYChartOptions(widget);
    } else if (widget.type === "button") {
      sanitizeButtonWidgetOptions(widget);
    } else if (widget.type === "led") {
      sanitizeLedWidgetOptions(widget);
    } else {
      sanitizeSliderWidgetOptions(widget);
    }
    const root = document.createElement("div");
    root.className = "value-widget";
    if (ui.selected?.type === "widget" && ui.selected.id === widget.id) {
      root.classList.add("selected");
    }
    if (widget.minimized) {
      root.classList.add("minimized");
    }
    const z = Math.max(0.0001, ui.zoom || 1);
    root.style.left = `${(widget.x - viewMinX) * z}px`;
    root.style.top = `${(widget.y - viewMinY) * z}px`;
    root.style.width = `${widget.width}px`;
    root.style.height = widget.minimized ? "36px" : `${widget.height}px`;
    root.style.transform = `scale(${z})`;
    root.style.transformOrigin = "top left";
    root.dataset.widgetId = String(widget.id);
    root.addEventListener("pointerdown", (evt) => {
      evt.stopPropagation();
      if (!(ui.selected?.type === "widget" && ui.selected.id === widget.id)) {
        selectWidget(widget.id);
        render();
      }
    });
    root.addEventListener("contextmenu", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      if (isExecutionFrozen()) {
        return;
      }
      if (!(ui.selected?.type === "widget" && ui.selected.id === widget.id)) {
        selectWidget(widget.id);
        render();
      }
      openWidgetContextMenu(evt, widget);
    });

    const header = document.createElement("div");
    header.className = "value-widget-header";
    const title = document.createElement("span");
    title.textContent = widgetDisplayTitle(widget);
    const actions = document.createElement("div");
    actions.className = "value-widget-actions";
    const minBtn = document.createElement("button");
    minBtn.type = "button";
    minBtn.textContent = widget.minimized ? "+" : "_";
    setTooltipText(minBtn, widget.minimized ? t("widget.restore") : t("widget.minimize"));
    minBtn.addEventListener("pointerdown", (evt) => {
      evt.stopPropagation();
    });
    minBtn.addEventListener("click", (evt) => {
      if (isExecutionFrozen()) {
        return;
      }
      evt.stopPropagation();
      runAction(() => {
        widget.minimized = !widget.minimized;
      });
      setStatusKey(widget.minimized ? "status.widgetMinimized" : "status.widgetRestored");
    });

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "x";
    delBtn.addEventListener("pointerdown", (evt) => {
      evt.stopPropagation();
    });
    delBtn.addEventListener("click", (evt) => {
      if (isExecutionFrozen()) {
        return;
      }
      evt.stopPropagation();
      runAction(() => {
        graph.widgets = graph.widgets.filter((w) => w.id !== widget.id);
      });
      setStatusKey("status.widgetDeleted");
    });
    header.appendChild(title);
    actions.appendChild(minBtn);
    actions.appendChild(delBtn);
    header.appendChild(actions);
    header.addEventListener("pointerdown", (evt) => {
      if (evt.target.closest("button")) {
        return;
      }
      evt.stopPropagation();
      if (!(ui.selected?.type === "widget" && ui.selected.id === widget.id)) {
        selectWidget(widget.id);
      }
      if (isExecutionFrozen()) {
        render();
        return;
      }
      ui.widgetDrag = {
        widgetId: widget.id,
        pointerId: evt.pointerId,
        startClientX: evt.clientX,
        startClientY: evt.clientY,
        startX: widget.x,
        startY: widget.y,
      };
      beginTransaction();
    });

    const body = document.createElement("div");
    body.className = "value-widget-body";
    if (widget.type === "table") {
      renderTableWidgetBody(body, widget);
    } else if (widget.type === "matrix") {
      renderMatrixWidgetBody(body, widget);
    } else if (widget.type === "led") {
      renderLedWidgetBody(body, widget);
    } else if (widget.type === "xychart") {
      const canvasWrap = document.createElement("div");
      canvasWrap.className = "xy-chart-canvas-wrap";
      const canvas = document.createElement("canvas");
      canvas.className = "xy-chart-canvas";
      const cw = Math.max(140, Math.floor(widget.width - 18));
      const ch = Math.max(100, Math.floor(widget.height - 52));
      canvas.width = cw;
      canvas.height = ch;
      const displayedPairs = widget.outputOnly
        ? widget.xyPairs.filter((pair) => {
          const xAllowed = pair.xSource === "time" || getNodeByName(pair.xSource)?.output;
          const yAllowed = pair.ySource === "time" || getNodeByName(pair.ySource)?.output;
          return xAllowed && yAllowed;
        })
        : widget.xyPairs;
      const seriesList = displayedPairs.flatMap((pair) => {
        const out = [];
        if (pair.showTimeSeries) {
          const seriesData = Array.isArray(pair.seriesData) && pair.seriesData.length > 0
            ? pair.seriesData
            : [{ label: `${pair.xSource} -> ${pair.ySource}`, points: pair.points || [] }];
          out.push(...seriesData.map((series, idx) => ({
            label: series.label || `${pair.xSource} -> ${pair.ySource}${seriesData.length > 1 ? ` [${idx}]` : ""}`,
            color: pair.color,
            showLine: pair.showLine,
            lineWidth: pair.lineWidth,
            lineStyle: pair.lineStyle,
            pointMode: pair.pointMode,
            pointSize: pair.pointSize,
            points: series.points || [],
          })));
        }
        if (pair.showInstantProfile) {
          const instantSeriesData = Array.isArray(pair.instantSeriesData) && pair.instantSeriesData.length > 0
            ? pair.instantSeriesData
            : [];
          out.push(...instantSeriesData.map((series) => ({
            label: series.label || `${pair.xSource} -> ${pair.ySource}`,
            color: pair.color,
            showLine: pair.showLine,
            lineWidth: pair.lineWidth,
            lineStyle: pair.lineStyle,
            pointMode: pair.pointMode === "last" ? "all" : pair.pointMode,
            pointSize: pair.pointSize,
            points: series.points || [],
          })));
        }
        return out;
      });
      drawXYChart(canvas, seriesList, widget);
      canvasWrap.appendChild(canvas);
      body.appendChild(canvasWrap);
    } else if (widget.type === "slider") {
      const sliderWrap = document.createElement("div");
      sliderWrap.className = "slider-widget-wrap";

      const sourceLine = document.createElement("div");
      sourceLine.className = "slider-widget-source";
      sourceLine.textContent = widget.source || t("text.unnamed");
      const sourceNode = getNodeByName(widget.source);
      const lockedForRun = sourceNode?.shape === "diamond" && graph.execution.currentTime != null;

      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = String(widget.min);
      slider.max = String(widget.max);
      slider.step = String(widget.step);
      slider.value = String(widget.value);
      slider.disabled = lockedForRun;
      slider.addEventListener("pointerdown", (evt) => {
        if (lockedForRun) {
          return;
        }
        evt.stopPropagation();
        ui.sliderInteraction = { widgetId: widget.id, mode: "range" };
        if (!(ui.selected?.type === "widget" && ui.selected.id === widget.id)) {
          selectWidget(widget.id);
        }
      });
      slider.addEventListener("mousedown", (evt) => {
        evt.stopPropagation();
      });

      const minLabel = document.createElement("span");
      minLabel.className = "slider-bound slider-bound-min";
      minLabel.textContent = formatNumberValue(Number(widget.min));

      const maxLabel = document.createElement("span");
      maxLabel.className = "slider-bound slider-bound-max";
      maxLabel.textContent = formatNumberValue(Number(widget.max));

      const valueInput = document.createElement("input");
      valueInput.type = "number";
      valueInput.step = String(widget.step);
      valueInput.min = String(widget.min);
      valueInput.max = String(widget.max);
      valueInput.value = String(widget.value);
      valueInput.className = "slider-widget-number";
      valueInput.disabled = lockedForRun;
      valueInput.addEventListener("pointerdown", (evt) => {
        if (lockedForRun) {
          return;
        }
        evt.stopPropagation();
        ui.sliderInteraction = { widgetId: widget.id, mode: "number" };
      });
      valueInput.addEventListener("mousedown", (evt) => {
        evt.stopPropagation();
      });
      valueInput.addEventListener("focus", () => {
        if (lockedForRun) {
          return;
        }
        ui.sliderInteraction = { widgetId: widget.id, mode: "number" };
      });

      const rangeLine = document.createElement("div");
      rangeLine.className = "slider-range-line";
      rangeLine.appendChild(minLabel);
      rangeLine.appendChild(slider);
      rangeLine.appendChild(valueInput);
      rangeLine.appendChild(maxLabel);

      const syncSliderDisplay = (nextValue = slider.value, commit = false) => {
        const snapped = snapSliderValue(nextValue, widget.min, widget.max, widget.step);
        widget.value = snapped;
        slider.value = String(snapped);
        valueInput.value = String(snapped);
        applySliderWidgetValueToNode(widget);
        if (commit) {
          refreshSidebar();
          scheduleFileStatusRefresh();
        }
      };

      slider.addEventListener("input", (evt) => {
        evt.stopPropagation();
        syncSliderDisplay();
      });
      slider.addEventListener("change", (evt) => {
        evt.stopPropagation();
        syncSliderDisplay(slider.value, true);
      });
      slider.addEventListener("pointerup", (evt) => {
        evt.stopPropagation();
        ui.sliderInteraction = null;
        render();
      });
      slider.addEventListener("pointercancel", () => {
        ui.sliderInteraction = null;
        render();
      });
      valueInput.addEventListener("input", (evt) => {
        evt.stopPropagation();
        syncSliderDisplay(valueInput.value);
      });
      valueInput.addEventListener("change", (evt) => {
        evt.stopPropagation();
        syncSliderDisplay(valueInput.value, true);
        render();
      });
      valueInput.addEventListener("blur", () => {
        ui.sliderInteraction = null;
        syncSliderDisplay(valueInput.value, true);
        render();
      });

      sliderWrap.appendChild(sourceLine);
      sliderWrap.appendChild(rangeLine);
      body.appendChild(sliderWrap);
    } else {
      const buttonWrap = document.createElement("div");
      buttonWrap.className = "button-widget-wrap";

      const sourceLine = document.createElement("div");
      sourceLine.className = "button-widget-source";
      sourceLine.textContent = widget.source || t("text.unnamed");
      const sourceNode = getNodeByName(widget.source);
      const lockedForRun = sourceNode?.shape === "diamond" && graph.execution.currentTime != null;

      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className = "button-widget-toggle";
      toggleBtn.disabled = lockedForRun;
      const syncButtonDisplay = (commit = false) => {
        toggleBtn.classList.toggle("is-on", Boolean(widget.value));
        toggleBtn.classList.toggle("is-off", !Boolean(widget.value));
        toggleBtn.textContent = widget.value ? t("widget.buttonState.true") : t("widget.buttonState.false");
        applyButtonWidgetValueToNode(widget);
        if (commit) {
          refreshSidebar();
          scheduleFileStatusRefresh();
        }
      };
      syncButtonDisplay();
      toggleBtn.addEventListener("pointerdown", (evt) => {
        if (lockedForRun) {
          return;
        }
        evt.stopPropagation();
        if (!(ui.selected?.type === "widget" && ui.selected.id === widget.id)) {
          selectWidget(widget.id);
        }
      });
      toggleBtn.addEventListener("click", (evt) => {
        if (lockedForRun) {
          return;
        }
        evt.stopPropagation();
        widget.value = !widget.value;
        syncButtonDisplay(true);
        renderWidgets();
      });

      buttonWrap.appendChild(sourceLine);
      buttonWrap.appendChild(toggleBtn);
      body.appendChild(buttonWrap);
    }

    const resize = document.createElement("div");
    resize.className = "value-widget-resize";
    resize.addEventListener("pointerdown", (evt) => {
      evt.stopPropagation();
      if (isExecutionFrozen()) {
        return;
      }
      ui.widgetResize = {
        widgetId: widget.id,
        pointerId: evt.pointerId,
        startClientX: evt.clientX,
        startClientY: evt.clientY,
        startWidth: widget.width,
        startHeight: widget.height,
      };
      beginTransaction();
    });

    root.appendChild(header);
    root.appendChild(body);
    root.appendChild(resize);
    widgetLayer.appendChild(root);
  });
}

function startEdgeCreateFromNode(nodeId, pointerId, p) {
  const node = getNodeById(nodeId);
  if (!node) {
    return;
  }
  selectSingleNode(node.id);
  ui.edgeCreate = {
    fromId: node.id,
    pointerId,
    current: p || { x: node.x, y: node.y },
  };
  ui.edgeCreateLastPoint = p || { x: node.x, y: node.y };
  ui.edgeCreateHoverId = null;
  setStatus(t("hint.edge.4"));
}

function startEdgeCreateFromMouse(nodeId, evt) {
  startEdgeCreateFromNode(nodeId, "mouse", svgPointFromClient(evt.clientX, evt.clientY));
  render();
}

function updateEdgeCreateFromClient(clientX, clientY) {
  if (!ui.edgeCreate) {
    return;
  }
  const pRaw = svgPointFromClient(clientX, clientY);
  ui.edgeCreate.current = snapPoint(pRaw);
  ui.edgeCreateLastPoint = pRaw;
  ui.edgeCreateHoverId = nodeIdAtClient(clientX, clientY) ?? nodeIdAtGraphPoint(pRaw);
}

function finishEdgeCreateFromClient(clientX, clientY) {
  if (!ui.edgeCreate) {
    return;
  }
  const dropPoint = ui.edgeCreateLastPoint || svgPointFromClient(clientX, clientY);
  const toId =
    ui.edgeCreateHoverId ??
    nodeIdAtClient(clientX, clientY) ??
    nodeIdAtGraphPoint(dropPoint);
  const fromId = ui.edgeCreate.fromId;
  ui.edgeCreate = null;
  ui.edgeCreateHoverId = null;
  ui.edgeCreateLastPoint = null;

  if (toId != null) {
    let created = false;
    runAction(() => {
      created = Boolean(addEdge(fromId, toId));
    });
    if (created) {
      setStatusKey("status.edgeCreated");
    }
  } else {
    setStatusKey("status.edgeCanceled");
    render();
  }
}

function removeControlPoint(edgeId, cpIndex) {
  const edge = getEdgeById(edgeId);
  if (!edge || !edge.controlPoints[cpIndex]) {
    return;
  }

  edge.controlPoints.splice(cpIndex, 1);
  if (
    ui.selectedControlPoint &&
    ui.selectedControlPoint.edgeId === edgeId &&
    ui.selectedControlPoint.index === cpIndex
  ) {
    ui.selectedControlPoint = null;
  }
}

function removeSelected() {
  if (ui.selectedControlPoint) {
    runAction(() => {
      removeControlPoint(ui.selectedControlPoint.edgeId, ui.selectedControlPoint.index);
    });
    return;
  }

  if (ui.selectedNodes.size > 0) {
    runAction(() => {
      const selectedIds = new Set(ui.selectedNodes);
      graph.nodes
        .filter((n) => selectedIds.has(n.id))
        .forEach((n) => removeNodeFromInputWidgetBindings(n.name));
      graph.nodes = graph.nodes.filter((n) => !selectedIds.has(n.id));
      graph.edges = graph.edges.filter((e) => !selectedIds.has(e.from) && !selectedIds.has(e.to));
      clearAllSelection();
      setStatusKey("status.nodesDeleted");
    });
    return;
  }

  if (ui.selected?.type === "edge") {
    runAction(() => {
      graph.edges = graph.edges.filter((e) => e.id !== ui.selected.id);
      clearAllSelection();
      setStatusKey("status.edgeDeleted");
    });
    return;
  }

  if (ui.selected?.type === "widget") {
    runAction(() => {
      graph.widgets = graph.widgets.filter((w) => w.id !== ui.selected.id);
      clearAllSelection();
      setStatusKey("status.widgetDeleted");
    });
    return;
  }

  if (ui.selected?.type === "text") {
    runAction(() => {
      graph.textItems = graph.textItems.filter((item) => item.id !== ui.selected.id);
      clearAllSelection();
      setStatusKey("status.textDeleted");
    });
  }
}

function distancePointToSegment(p, a, b) {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const apx = p.x - a.x;
  const apy = p.y - a.y;
  const ab2 = abx * abx + aby * aby || 1;
  const t = clamp((apx * abx + apy * aby) / ab2, 0, 1);
  const qx = a.x + t * abx;
  const qy = a.y + t * aby;
  const dx = p.x - qx;
  const dy = p.y - qy;
  return { distance: Math.hypot(dx, dy), t };
}

function addControlPointAt(edge, p) {
  const geom = buildEdgeGeometry(edge);
  if (!geom) {
    return;
  }

  let insertAt = edge.controlPoints.length;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let i = 0; i < geom.points.length - 1; i += 1) {
    const d = distancePointToSegment(p, geom.points[i], geom.points[i + 1]);
    if (d.distance < bestDistance) {
      bestDistance = d.distance;
      insertAt = i;
    }
  }

  const snapped = snapPoint(p);
  edge.controlPoints.splice(insertAt, 0, { x: snapped.x, y: snapped.y });
  ui.selectedControlPoint = { edgeId: edge.id, index: insertAt };
}

function nodeIdAtClient(clientX, clientY) {
  const elements = document.elementsFromPoint(clientX, clientY);
  for (const el of elements) {
    const group = el.closest?.(".node");
    if (group) {
      return Number(group.dataset.nodeId);
    }
  }
  return null;
}

function pointInsideNode(node, p) {
  const dx = p.x - node.x;
  const dy = p.y - node.y;
  const hw = node.width / 2;
  const hh = node.height / 2;

  if (node.shape === "ellipse") {
    const v = (dx * dx) / (hw * hw) + (dy * dy) / (hh * hh);
    return v <= 1;
  }
  if (node.shape === "diamond") {
    const v = Math.abs(dx) / hw + Math.abs(dy) / hh;
    return v <= 1;
  }
  return Math.abs(dx) <= hw && Math.abs(dy) <= hh;
}

function nodeIdAtGraphPoint(p) {
  for (let i = graph.nodes.length - 1; i >= 0; i -= 1) {
    const node = graph.nodes[i];
    if (pointInsideNode(node, p)) {
      return node.id;
    }
  }
  return null;
}

function openBackgroundContextMenu(evt) {
  if (isExecutionFrozen()) {
    return;
  }
  const p = svgPointFromClient(evt.clientX, evt.clientY);
  showContextMenu(evt.clientX, evt.clientY, [
    {
      label: t("context.bg.newRect"),
      action: () => {
        runAction(() => addNode("rect", p));
        setStatusKey("status.nodeCreated");
      },
    },
    {
      label: t("context.bg.newEllipse"),
      action: () => {
        runAction(() => addNode("ellipse", p));
        setStatusKey("status.nodeCreated");
      },
    },
    {
      label: t("context.bg.newDiamond"),
      action: () => {
        runAction(() => addNode("diamond", p));
        setStatusKey("status.nodeCreated");
      },
    },
    {
      label: t("context.bg.newSubmodel"),
      action: () => {
        runAction(() => addNode("submodel", p));
        setStatusKey("status.nodeCreated");
      },
    },
    {
      label: t("context.bg.newText"),
      action: () => {
        runAction(() => addCanvasText({ x: p.x, y: p.y }));
        setStatusKey("status.textCreated");
      },
    },
    { separator: true },
    {
      label: t("context.bg.newSliderWidget"),
      action: () => {
        runAction(() => addSliderWidget({ x: p.x, y: p.y }));
        setStatusKey("status.widgetSliderCreated");
      },
    },
    {
      label: t("context.bg.newButtonWidget"),
      action: () => {
        runAction(() => addButtonWidget({ x: p.x, y: p.y }));
        setStatusKey("status.widgetButtonCreated");
      },
    },
    {
      label: t("context.bg.newMatrixWidget"),
      action: () => {
        runAction(() => addMatrixWidget({ x: p.x, y: p.y }));
        setStatusKey("status.widgetMatrixCreated");
      },
    },
    {
      label: t("context.bg.newLedWidget"),
      action: () => {
        runAction(() => addLedWidget({ x: p.x, y: p.y }));
        setStatusKey("status.widgetLedCreated");
      },
    },
    {
      label: t("context.bg.newTableWidget"),
      action: () => {
        runAction(() => addTableWidget({ x: p.x, y: p.y }));
        setStatusKey("status.widgetCreated");
      },
    },
    {
      label: t("context.bg.newXYChartWidget"),
      action: () => {
        runAction(() => addXYChartWidget({ x: p.x, y: p.y }));
        setStatusKey("status.widgetChartCreated");
      },
    },
  ]);
}

function openNodeContextMenu(evt, node) {
  if (isExecutionFrozen()) {
    return;
  }
  const useSelectionDelete = ui.selectedNodes.has(node.id) && ui.selectedNodes.size > 0;
  showContextMenu(evt.clientX, evt.clientY, [
    {
      label: t("context.node.rename"),
      action: () => {
        selectSingleNode(node.id);
        render();
        nodeNameInput.focus();
        nodeNameInput.select();
        setStatusKey("status.renameNode");
      },
    },
    {
      label: t("context.node.addProp"),
      action: () => {
        runAction(() => {
          const target = getNodeById(node.id);
          if (target) {
            target.properties.push({ key: "", value: "" });
          }
        });
        setStatusKey("status.propertyAdded");
      },
    },
    ...(isSubmodelNode(node)
      ? [{
        label: t("action.openSubmodel"),
        action: () => {
          void openSubmodelNode(node);
        },
      }]
      : []),
    {
      label: t("context.node.newLinked"),
      action: () => {
        runAction(() => {
          const p = { x: node.x + 180, y: node.y };
          addNode("rect", p);
          const createdNodeId = [...ui.selectedNodes][0];
          addEdge(node.id, createdNodeId);
        });
        setStatusKey("status.linkedNodeCreated");
      },
    },
    {
      label: useSelectionDelete ? t("menu.edit.delete") : t("context.node.delete"),
      action: () => {
        if (useSelectionDelete) {
          removeSelected();
          return;
        }
        runAction(() => {
          removeNodeFromSliderBindings(node.name);
          graph.nodes = graph.nodes.filter((n) => n.id !== node.id);
          graph.edges = graph.edges.filter((e) => e.from !== node.id && e.to !== node.id);
          clearAllSelection();
        });
        setStatusKey("status.nodeDeleted");
      },
    },
  ]);
}

function openWidgetContextMenu(evt, widget) {
  if (isExecutionFrozen()) {
    return;
  }
  const wasMinimized = Boolean(widget.minimized);
  showContextMenu(evt.clientX, evt.clientY, [
    {
      label: t("context.widget.copy"),
      action: async () => {
        const content = widgetRenderedText(widget);
        const ok = await copyTextToClipboard(content);
        setStatusKey(ok ? "status.widgetCopied" : "status.clipboardEmpty");
      },
      disabled: !widgetRenderedText(widget),
    },
    {
      label: wasMinimized ? t("context.widget.restore") : t("context.widget.minimize"),
      action: () => {
        runAction(() => {
          const target = graph.widgets.find((w) => w.id === widget.id);
          if (target) {
            target.minimized = !target.minimized;
          }
        });
        setStatusKey(wasMinimized ? "status.widgetRestored" : "status.widgetMinimized");
      },
    },
    {
      label: t("context.widget.delete"),
      action: () => {
        runAction(() => {
          graph.widgets = graph.widgets.filter((w) => w.id !== widget.id);
          clearAllSelection();
        });
        setStatusKey("status.widgetDeleted");
      },
    },
  ]);
}

function openTextContextMenu(evt, item) {
  if (isExecutionFrozen()) {
    return;
  }
  showContextMenu(evt.clientX, evt.clientY, [
    {
      label: t("context.text.edit"),
      action: () => {
        selectTextItem(item.id);
        render();
        window.requestAnimationFrame(() => {
          textHtmlInput?.focus();
          textHtmlInput?.select();
        });
      },
    },
    {
      label: t("context.text.delete"),
      action: () => {
        runAction(() => {
          graph.textItems = graph.textItems.filter((entry) => entry.id !== item.id);
          clearAllSelection();
        });
        setStatusKey("status.textDeleted");
      },
    },
  ]);
}

function openEdgeContextMenu(evt, edgeId, atPoint) {
  const edge = getEdgeById(edgeId);
  if (!edge) {
    return;
  }

  showContextMenu(evt.clientX, evt.clientY, [
    {
      label: t("context.edge.addCp"),
      action: () => {
        runAction(() => {
          const target = getEdgeById(edgeId);
          if (!target) {
            return;
          }
          selectEdge(edgeId);
          addControlPointAt(target, atPoint);
        });
        setStatusKey("status.cpAdded");
      },
    },
    {
      label: t("context.edge.clearCp"),
      action: () => {
        runAction(() => {
          const target = getEdgeById(edgeId);
          if (!target) {
            return;
          }
          target.controlPoints = [];
          selectEdge(edgeId);
        });
        setStatusKey("status.cpCleared");
      },
      disabled: edge.controlPoints.length === 0,
    },
    {
      label: t("context.edge.delete"),
      action: () => {
        runAction(() => {
          graph.edges = graph.edges.filter((e) => e.id !== edgeId);
          clearAllSelection();
        });
        setStatusKey("status.edgeDeleted");
      },
    },
  ]);
}

function marqueeRect(m) {
  const x = Math.min(m.start.x, m.current.x);
  const y = Math.min(m.start.y, m.current.y);
  const width = Math.abs(m.current.x - m.start.x);
  const height = Math.abs(m.current.y - m.start.y);
  return { x, y, width, height };
}

function nodesInRect(rect) {
  return graph.nodes
    .filter((n) => n.x >= rect.x && n.x <= rect.x + rect.width && n.y >= rect.y && n.y <= rect.y + rect.height)
    .map((n) => n.id);
}

function normalizeNodeDescriptionProperty(node) {
  if (!node) {
    return null;
  }
  if (!Array.isArray(node.properties)) {
    node.properties = [];
  }
  const canonicalKey = descriptionPropertyKey();
  const acceptedKeys = descriptionPropertyKeys();
  const legacyValue = node.description == null ? "" : String(node.description);
  const matches = node.properties.filter((prop) => acceptedKeys.has(String(prop?.key ?? "").trim().toLowerCase()));
  let target = matches[0] || null;
  if (!target) {
    target = { key: canonicalKey, value: legacyValue };
    node.properties.unshift(target);
  } else {
    target.key = canonicalKey;
    if ((target.value == null || target.value === "") && legacyValue) {
      target.value = legacyValue;
    }
  }
  for (let i = node.properties.length - 1; i >= 0; i -= 1) {
    const prop = node.properties[i];
    if (prop !== target && acceptedKeys.has(String(prop?.key ?? "").trim().toLowerCase())) {
      node.properties.splice(i, 1);
    }
  }
  delete node.description;
  return target;
}

function getNodeDescription(node) {
  return String(normalizeNodeDescriptionProperty(node)?.value ?? "").trim();
}

function buildNodeTooltipText(node) {
  if (!node) {
    return { text: "", tone: "" };
  }
  const description = getNodeDescription(node);
  if (node.computedValue != null) {
    const valueText = summarizeTooltipValue(node.computedValue);
    return { text: description ? `${description}: ${valueText}` : valueText, tone: "value" };
  }
  if (String(node.computedError || "").trim()) {
    const errorText = localizeExpressionErrorMessage(node.computedError);
    return { text: description ? `${description}: ${errorText}` : errorText, tone: "error" };
  }
  return { text: description, tone: "" };
}

function canvasTextDisplayHtml(item) {
  const sanitized = sanitizeRichTextHtml(item?.html ?? "");
  return sanitized || `<p>${t("text.defaultCanvasText")}</p>`;
}

function updateSelectedTextHtml(nextValue) {
  const item = ui.selected?.type === "text" ? getTextItemById(ui.selected.id) : null;
  if (!item || !textHtmlInput) {
    return false;
  }
  textHtmlInput.value = nextValue;
  item.html = String(nextValue ?? "");
  sanitizeTextItem(item);
  dirtySinceLastSave = true;
  updateFileStatusLabel(true);
  render();
  return true;
}

function wrapTextSelection(startTag, endTag, placeholder = "testo") {
  if (!textHtmlInput) {
    return;
  }
  const start = textHtmlInput.selectionStart ?? 0;
  const end = textHtmlInput.selectionEnd ?? 0;
  const current = textHtmlInput.value || "";
  const selected = start === end ? placeholder : current.slice(start, end);
  const nextValue = `${current.slice(0, start)}${startTag}${selected}${endTag}${current.slice(end)}`;
  if (!updateSelectedTextHtml(nextValue)) {
    return;
  }
  const nextStart = start + startTag.length;
  const nextEnd = nextStart + selected.length;
  textHtmlInput.focus();
  textHtmlInput.setSelectionRange(nextStart, nextEnd);
}

function insertTextHtmlSnippet(snippet) {
  if (!textHtmlInput) {
    return;
  }
  const start = textHtmlInput.selectionStart ?? 0;
  const end = textHtmlInput.selectionEnd ?? 0;
  const current = textHtmlInput.value || "";
  const nextValue = `${current.slice(0, start)}${snippet}${current.slice(end)}`;
  if (!updateSelectedTextHtml(nextValue)) {
    return;
  }
  const caret = start + snippet.length;
  textHtmlInput.focus();
  textHtmlInput.setSelectionRange(caret, caret);
}

function renderPropertiesEditor(container, items, ownerKey, deleteHandler, options = {}) {
  const activeEl = document.activeElement;
  const activeInPropsEditor =
    container.contains(activeEl) &&
    (activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA" || activeEl?.tagName === "SELECT");
  if (activeInPropsEditor && container.dataset.ownerKey === ownerKey) {
    return true;
  }

  container.innerHTML = "";
  container.dataset.ownerKey = ownerKey;
  if (!Array.isArray(items) || items.length === 0) {
    const msg = document.createElement("div");
    msg.className = "empty-props";
    msg.textContent = t("text.noneProps");
    container.appendChild(msg);
    return false;
  }

  const isLockedKey = typeof options.isLockedKey === "function" ? options.isLockedKey : () => false;
  items.forEach((prop, idx) => {
    const row = document.createElement("div");
    row.className = "prop-row";
    const locked = isLockedKey(prop, idx);
    if (locked) {
      row.classList.add("prop-row-locked");
    }

    const keyInput = document.createElement("input");
    keyInput.placeholder = t("prop.keyPlaceholder");
    keyInput.value = prop.key;
    if (locked) {
      keyInput.readOnly = true;
      keyInput.tabIndex = -1;
      keyInput.classList.add("display-only-input");
    } else {
      keyInput.addEventListener("input", () => {
        prop.key = keyInput.value;
      });
    }

    const valueInput = document.createElement("input");
    valueInput.placeholder = t("prop.valuePlaceholder");
    valueInput.value = prop.value;
    valueInput.addEventListener("input", () => {
      prop.value = valueInput.value;
    });
    if (locked) {
      setTooltipText(valueInput, t("tooltip.node.description"));
    }

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "X";
    if (locked) {
      delBtn.disabled = true;
      delBtn.classList.add("hidden");
    } else {
      delBtn.addEventListener("click", () => {
        delete container.dataset.ownerKey;
        runAction(() => {
          deleteHandler(idx);
        });
      });
    }

    row.appendChild(keyInput);
    row.appendChild(valueInput);
    row.appendChild(delBtn);
    container.appendChild(row);
  });
  return false;
}

function refreshWidgetConfigPanel(widget) {
  widgetConfig.innerHTML = "";
  widgetConfig.className = "widget-config-grid";

  const createWidgetSection = () => {
    const section = document.createElement("div");
    section.className = "panel-section compact-panel-section";
    widgetConfig.appendChild(section);
    return section;
  };

  const appendWidgetSectionTitle = (section, labelKey) => {
    const title = document.createElement("h4");
    title.className = "widget-section-title";
    title.textContent = t(labelKey);
    section.appendChild(title);
    return title;
  };

  const createCompactField = (labelKey, inputEl) => {
    const wrap = document.createElement("label");
    wrap.className = "compact-field";
    const text = document.createElement("span");
    text.textContent = t(labelKey);
    wrap.appendChild(text);
    wrap.appendChild(inputEl);
    return wrap;
  };

  const mainSection = createWidgetSection();

  const titleLabel = document.createElement("label");
  titleLabel.textContent = t("widget.customTitleLabel");
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.placeholder = t("widget.customTitlePlaceholder");
  titleInput.value = String(widget.customTitle ?? "");
  titleInput.addEventListener("change", () => {
    runAction(() => {
      widget.customTitle = titleInput.value;
    });
  });
  mainSection.appendChild(titleLabel);
  mainSection.appendChild(titleInput);

  const outputNodeNames = graph.nodes.filter((n) => n.output).map((n) => n.name);
  const nodeNames = outputNodeNames;

  if (widget.type === "slider") {
    sanitizeSliderWidgetOptions(widget);
    const sliderSection = createWidgetSection();
    const sourceLabel = document.createElement("label");
    sourceLabel.textContent = t("widget.sliderSourceLabel");
    const sourceSelect = document.createElement("select");
    const sliderChoices = ["", ...sliderBindableNodeNames()];
    sliderChoices.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name || t("widget.noneOption");
      sourceSelect.appendChild(opt);
    });
    sourceSelect.value = sliderChoices.includes(widget.source) ? widget.source : "";
    sourceSelect.addEventListener("change", () => {
      runAction(() => {
        widget.source = sourceSelect.value;
      });
    });
    sliderSection.appendChild(sourceLabel);
    sliderSection.appendChild(sourceSelect);

    const limitsLabel = document.createElement("label");
    limitsLabel.textContent = t("widget.sliderRangeLabel");
    sliderSection.appendChild(limitsLabel);

    const rangeRow = document.createElement("div");
    rangeRow.className = "row3-exec";
    const minInput = document.createElement("input");
    minInput.type = "number";
    minInput.step = "any";
    minInput.value = String(widget.min);
    minInput.addEventListener("change", () => {
      runAction(() => {
        widget.min = Number(minInput.value);
        sanitizeSliderWidgetOptions(widget);
      });
    });
    const stepInput = document.createElement("input");
    stepInput.type = "number";
    stepInput.step = "any";
    stepInput.min = "0.0000001";
    stepInput.value = String(widget.step);
    stepInput.addEventListener("change", () => {
      runAction(() => {
        widget.step = Number(stepInput.value);
        sanitizeSliderWidgetOptions(widget);
      });
    });
    const maxInput = document.createElement("input");
    maxInput.type = "number";
    maxInput.step = "any";
    maxInput.value = String(widget.max);
    maxInput.addEventListener("change", () => {
      runAction(() => {
        widget.max = Number(maxInput.value);
        sanitizeSliderWidgetOptions(widget);
      });
    });
    rangeRow.appendChild(createCompactField("widget.sliderMin", minInput));
    rangeRow.appendChild(createCompactField("widget.sliderStep", stepInput));
    rangeRow.appendChild(createCompactField("widget.sliderMax", maxInput));
    sliderSection.appendChild(rangeRow);
    return;
  }

  if (widget.type === "button") {
    sanitizeButtonWidgetOptions(widget);
    const buttonSection = createWidgetSection();
    const sourceLabel = document.createElement("label");
    sourceLabel.textContent = t("widget.buttonSourceLabel");
    const sourceSelect = document.createElement("select");
    const buttonChoices = ["", ...buttonBindableNodeNames()];
    buttonChoices.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name || t("widget.noneOption");
      sourceSelect.appendChild(opt);
    });
    sourceSelect.value = buttonChoices.includes(widget.source) ? widget.source : "";
    sourceSelect.addEventListener("change", () => {
      runAction(() => {
        widget.source = sourceSelect.value;
        sanitizeButtonWidgetOptions(widget);
      });
    });
    buttonSection.appendChild(sourceLabel);
    buttonSection.appendChild(sourceSelect);

    const valueLabel = document.createElement("label");
    valueLabel.className = "menu-check compact-bool";
    const valueInput = document.createElement("input");
    valueInput.type = "checkbox";
    valueInput.checked = widget.value === true;
    valueInput.addEventListener("change", () => {
      runAction(() => {
        widget.value = valueInput.checked;
        sanitizeButtonWidgetOptions(widget);
      });
    });
    const valueText = document.createElement("span");
    valueText.textContent = t("widget.buttonValueLabel");
    valueLabel.appendChild(valueInput);
    valueLabel.appendChild(valueText);
    buttonSection.appendChild(valueLabel);
    return;
  }

  if (widget.type === "matrix") {
    sanitizeMatrixWidgetOptions(widget);
    const matrixSection = createWidgetSection();
    const sourceLabel = document.createElement("label");
    sourceLabel.textContent = t("widget.matrixSourceLabel");
    const sourceSelect = document.createElement("select");
    const matrixChoices = ["", ...outputNodeNames];
    matrixChoices.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name || t("widget.noneOption");
      sourceSelect.appendChild(opt);
    });
    sourceSelect.value = matrixChoices.includes(widget.source) ? widget.source : "";
    sourceSelect.addEventListener("change", () => {
      runAction(() => {
        widget.source = sourceSelect.value;
        widget.lastMatrixValue = null;
        sanitizeMatrixWidgetOptions(widget);
      });
    });
    matrixSection.appendChild(sourceLabel);
    matrixSection.appendChild(sourceSelect);

    const valuesLabel = document.createElement("label");
    valuesLabel.className = "menu-check compact-bool";
    const valuesInput = document.createElement("input");
    valuesInput.type = "checkbox";
    valuesInput.checked = widget.showNumericValues !== false;
    valuesInput.addEventListener("change", () => {
      runAction(() => {
        widget.showNumericValues = valuesInput.checked;
      });
    });
    const valuesText = document.createElement("span");
    valuesText.textContent = t("widget.matrixShowValues");
    valuesLabel.appendChild(valuesInput);
    valuesLabel.appendChild(valuesText);
    matrixSection.appendChild(valuesLabel);

    const indicesLabel = document.createElement("label");
    indicesLabel.className = "menu-check compact-bool";
    const indicesInput = document.createElement("input");
    indicesInput.type = "checkbox";
    indicesInput.checked = widget.showIndices !== false;
    indicesInput.addEventListener("change", () => {
      runAction(() => {
        widget.showIndices = indicesInput.checked;
      });
    });
    const indicesText = document.createElement("span");
    indicesText.textContent = t("widget.matrixShowIndices");
    indicesLabel.appendChild(indicesInput);
    indicesLabel.appendChild(indicesText);
    matrixSection.appendChild(indicesLabel);

    const fitLabel = document.createElement("label");
    fitLabel.className = "menu-check compact-bool";
    const fitInput = document.createElement("input");
    fitInput.type = "checkbox";
    fitInput.checked = widget.autoFitCells !== false;
    fitInput.addEventListener("change", () => {
      runAction(() => {
        widget.autoFitCells = fitInput.checked;
      });
      cellSizeInput.disabled = fitInput.checked;
    });
    const fitText = document.createElement("span");
    fitText.textContent = t("widget.matrixAutoFitCells");
    fitLabel.appendChild(fitInput);
    fitLabel.appendChild(fitText);
    matrixSection.appendChild(fitLabel);

    const matrixOptionsRow = document.createElement("div");
    matrixOptionsRow.className = "row3-exec";

    const cellSizeInput = document.createElement("input");
    cellSizeInput.type = "number";
    cellSizeInput.min = "2";
    cellSizeInput.max = "96";
    cellSizeInput.step = "1";
    cellSizeInput.value = String(widget.cellSize ?? 28);
    cellSizeInput.disabled = widget.autoFitCells !== false;
    cellSizeInput.addEventListener("change", () => {
      runAction(() => {
        widget.cellSize = clamp(Number(cellSizeInput.value) || 28, 2, 96);
      });
      cellSizeInput.value = String(widget.cellSize);
    });

    const colorSelect = document.createElement("select");
    ["blue", "heat", "grayscale", "diverging", "none"].forEach((scheme) => {
      const opt = document.createElement("option");
      opt.value = scheme;
      opt.textContent = t(`widget.matrixColorScheme.${scheme}`);
      colorSelect.appendChild(opt);
    });
    colorSelect.value = widget.colorScheme;
    colorSelect.addEventListener("change", () => {
      runAction(() => {
        widget.colorScheme = colorSelect.value;
      });
    });

    matrixOptionsRow.appendChild(createCompactField("widget.matrixCellSize", cellSizeInput));
    matrixOptionsRow.appendChild(createCompactField("widget.matrixColorSchemeLabel", colorSelect));
    matrixSection.appendChild(matrixOptionsRow);
    return;
  }

  if (widget.type === "led") {
    sanitizeLedWidgetOptions(widget);
    const ledSection = createWidgetSection();
    const sourceLabel = document.createElement("label");
    sourceLabel.textContent = t("widget.ledSourceLabel");
    const sourceSelect = document.createElement("select");
    const ledChoices = ["", ...outputNodeNames];
    ledChoices.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name || t("widget.noneOption");
      sourceSelect.appendChild(opt);
    });
    sourceSelect.value = ledChoices.includes(widget.source) ? widget.source : "";
    sourceSelect.addEventListener("change", () => {
      runAction(() => {
        widget.source = sourceSelect.value;
        sanitizeLedWidgetOptions(widget);
      });
    });
    ledSection.appendChild(sourceLabel);
    ledSection.appendChild(sourceSelect);
    return;
  }

  if (widget.type === "table") {
    sanitizeWidgetColumns(widget);
    sanitizeTableWidgetOptions(widget);
    const tableSection = createWidgetSection();
    const list = document.createElement("div");
    list.className = "props-list";
    const tableChoices = ["time", ...nodeNames];
    widget.columns.forEach((colName, idx) => {
      const row = document.createElement("div");
      row.className = "prop-row";
      row.style.gridTemplateColumns = "1fr auto auto auto";
      const sel = document.createElement("select");
      tableChoices.forEach((name) => {
        const opt = document.createElement("option");
        opt.value = name || "";
        opt.textContent = name === "time" ? t("widget.xSourceTime") : name;
        sel.appendChild(opt);
      });
      sel.value = tableChoices.includes(colName) ? colName : "time";
      sel.addEventListener("change", () => {
        runAction(() => {
          widget.columns[idx] = sel.value;
        });
      });
      const del = document.createElement("button");
      del.type = "button";
      del.textContent = "-";
      del.addEventListener("click", () => {
        runAction(() => {
          if (widget.columns.length > 0) {
            widget.columns.splice(idx, 1);
          }
        });
      });
      const upBtn = document.createElement("button");
      upBtn.type = "button";
      upBtn.textContent = "↑";
      setTooltipText(upBtn, t("widget.moveUp"));
      upBtn.disabled = idx === 0;
      upBtn.addEventListener("click", () => {
        runAction(() => {
          if (idx <= 0 || idx >= widget.columns.length) {
            return;
          }
          const tmp = widget.columns[idx - 1];
          widget.columns[idx - 1] = widget.columns[idx];
          widget.columns[idx] = tmp;
        });
      });
      const downBtn = document.createElement("button");
      downBtn.type = "button";
      downBtn.textContent = "↓";
      setTooltipText(downBtn, t("widget.moveDown"));
      downBtn.disabled = idx >= widget.columns.length - 1;
      downBtn.addEventListener("click", () => {
        runAction(() => {
          if (idx < 0 || idx >= widget.columns.length - 1) {
            return;
          }
          const tmp = widget.columns[idx + 1];
          widget.columns[idx + 1] = widget.columns[idx];
          widget.columns[idx] = tmp;
        });
      });
      row.appendChild(sel);
      row.appendChild(upBtn);
      row.appendChild(downBtn);
      row.appendChild(del);
      list.appendChild(row);
    });
    const add = document.createElement("button");
    add.type = "button";
    add.className = "small-btn";
    add.textContent = t("widget.addColumn");
    add.addEventListener("click", () => {
      runAction(() => {
        widget.columns.push("time");
      });
    });
    const modeLabel = document.createElement("label");
    modeLabel.className = "menu-check compact-bool";
    const modeInput = document.createElement("input");
    modeInput.type = "checkbox";
    modeInput.checked = Boolean(widget.showHistory);
    modeInput.addEventListener("change", () => {
      runAction(() => {
        if (!widget.showHistory && modeInput.checked) {
          widget.rows = [];
        }
        widget.showHistory = modeInput.checked;
      });
    });
    const modeText = document.createElement("span");
    modeText.textContent = t("widget.showHistory");
    modeLabel.appendChild(modeInput);
    modeLabel.appendChild(modeText);
    tableSection.appendChild(list);
    tableSection.appendChild(add);
    tableSection.appendChild(modeLabel);
    return;
  }

  sanitizeWidgetXYPairs(widget);
  sanitizeXYChartOptions(widget);
  const choices = ["time", ...nodeNames];
  const chartPairsSection = createWidgetSection();
  appendWidgetSectionTitle(chartPairsSection, "widget.xyPairsLabel");

  const pairList = document.createElement("div");
  pairList.className = "chart-pair-list";
  const currentPairCount = widget.xyPairs.length;
  const currentActivePair = ui.activeChartPairByWidgetId.get(widget.id) ?? 0;
  const activePairIndex = currentPairCount > 0
    ? clamp(currentActivePair, 0, currentPairCount - 1)
    : -1;
  if (currentPairCount > 0) {
    ui.activeChartPairByWidgetId.set(widget.id, activePairIndex);
  } else {
    ui.activeChartPairByWidgetId.delete(widget.id);
  }

  widget.xyPairs.forEach((pair, idx) => {
    const row = document.createElement("div");
    row.className = "chart-pair-list-row";

    const selectBtn = document.createElement("button");
    selectBtn.type = "button";
    selectBtn.className = "chart-pair-select-btn";
    if (idx === activePairIndex) {
      selectBtn.classList.add("active");
    }
    selectBtn.textContent = `${pair.xSource} -> ${pair.ySource}`;
    selectBtn.addEventListener("click", () => {
      ui.activeChartPairByWidgetId.set(widget.id, idx);
      refreshWidgetConfigPanel(widget);
    });

    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "-";
    del.className = "chart-pair-delete-btn";
    setTooltipText(del, t("widget.removePair"));
    del.addEventListener("click", () => {
      runAction(() => {
        if (widget.xyPairs.length > 0) {
          widget.xyPairs.splice(idx, 1);
          const nextIndex = Math.max(0, Math.min(idx, widget.xyPairs.length - 1));
          if (widget.xyPairs.length > 0) {
            ui.activeChartPairByWidgetId.set(widget.id, nextIndex);
          } else {
            ui.activeChartPairByWidgetId.delete(widget.id);
          }
        }
      });
    });

    row.appendChild(selectBtn);
    row.appendChild(del);
    pairList.appendChild(row);
  });
  chartPairsSection.appendChild(pairList);

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "small-btn";
  addBtn.textContent = t("widget.addPair");
  addBtn.addEventListener("click", () => {
    runAction(() => {
      const defaultY = nodeNames[0] || "time";
        widget.xyPairs.push({
          xSource: "time",
          ySource: defaultY,
          showTimeSeries: true,
          showInstantProfile: false,
          color: defaultChartSeriesColor(widget.xyPairs.length),
          showLine: true,
          lineWidth: 2.2,
          lineStyle: "solid",
          pointMode: "all",
          pointSize: 2.4,
          points: [],
        });
      ui.activeChartPairByWidgetId.set(widget.id, widget.xyPairs.length - 1);
    });
  });
  chartPairsSection.appendChild(addBtn);

  if (activePairIndex >= 0 && widget.xyPairs[activePairIndex]) {
    const activePairSection = createWidgetSection();
    appendWidgetSectionTitle(activePairSection, "widget.activePairLabel");

    const pair = widget.xyPairs[activePairIndex];

    const topRow = document.createElement("div");
    topRow.className = "chart-pair-top";

    const xSel = document.createElement("select");
    choices.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name === "time" ? t("widget.xSourceTime") : name;
      xSel.appendChild(opt);
    });
    xSel.value = choices.includes(pair.xSource) ? pair.xSource : "time";
    setTooltipText(xSel, t("widget.xSourceLabel"));
    xSel.addEventListener("change", () => {
      runAction(() => {
        widget.xyPairs[activePairIndex].xSource = xSel.value;
        widget.xyPairs[activePairIndex].points = [];
        widget.xyPairs[activePairIndex].seriesData = [];
        widget.xyPairs[activePairIndex].instantSeriesData = [];
      });
    });

    const ySel = document.createElement("select");
    choices.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name === "time" ? t("widget.xSourceTime") : name;
      ySel.appendChild(opt);
    });
    ySel.value = choices.includes(pair.ySource) ? pair.ySource : "time";
    setTooltipText(ySel, t("widget.ySeriesLabel"));
    ySel.addEventListener("change", () => {
      runAction(() => {
        widget.xyPairs[activePairIndex].ySource = ySel.value;
        widget.xyPairs[activePairIndex].points = [];
        widget.xyPairs[activePairIndex].seriesData = [];
        widget.xyPairs[activePairIndex].instantSeriesData = [];
      });
    });

    topRow.appendChild(xSel);
    topRow.appendChild(ySel);
    activePairSection.appendChild(topRow);

    const modesRow = document.createElement("div");
    modesRow.className = "chart-pair-modes";

    const timeSeriesLabel = document.createElement("label");
    timeSeriesLabel.className = "menu-check compact-bool";
    setTooltipText(timeSeriesLabel, t("widget.showTimeSeries"));
    const timeSeriesInput = document.createElement("input");
    timeSeriesInput.type = "checkbox";
    timeSeriesInput.checked = pair.showTimeSeries !== false;
    timeSeriesInput.addEventListener("change", () => {
      runAction(() => {
        widget.xyPairs[activePairIndex].showTimeSeries = timeSeriesInput.checked;
        widget.xyPairs[activePairIndex].points = [];
        widget.xyPairs[activePairIndex].seriesData = [];
      });
    });
    const timeSeriesText = document.createElement("span");
    timeSeriesText.textContent = t("widget.showTimeSeries");
    timeSeriesLabel.appendChild(timeSeriesInput);
    timeSeriesLabel.appendChild(timeSeriesText);

    const instantProfileLabel = document.createElement("label");
    instantProfileLabel.className = "menu-check compact-bool";
    setTooltipText(instantProfileLabel, t("widget.showInstantProfile"));
    const instantProfileInput = document.createElement("input");
    instantProfileInput.type = "checkbox";
    instantProfileInput.checked = pair.showInstantProfile === true;
    instantProfileInput.addEventListener("change", () => {
      runAction(() => {
        widget.xyPairs[activePairIndex].showInstantProfile = instantProfileInput.checked;
        widget.xyPairs[activePairIndex].instantSeriesData = [];
      });
    });
    const instantProfileText = document.createElement("span");
    instantProfileText.textContent = t("widget.showInstantProfile");
    instantProfileLabel.appendChild(instantProfileInput);
    instantProfileLabel.appendChild(instantProfileText);

    modesRow.appendChild(timeSeriesLabel);
    modesRow.appendChild(instantProfileLabel);
    activePairSection.appendChild(modesRow);

    const styleRow = document.createElement("div");
    styleRow.className = "chart-pair-style-row";

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = /^#[0-9a-fA-F]{6}$/.test(String(pair.color ?? "")) ? String(pair.color) : defaultChartSeriesColor(activePairIndex);
    setTooltipText(colorInput, t("widget.seriesColor"));
    colorInput.addEventListener("change", () => {
      runAction(() => {
        widget.xyPairs[activePairIndex].color = colorInput.value;
      });
    });

    const lineLabel = document.createElement("label");
    lineLabel.className = "menu-check compact-bool";
    setTooltipText(lineLabel, t("widget.seriesLine"));
    const lineInput = document.createElement("input");
    lineInput.type = "checkbox";
    lineInput.checked = pair.showLine !== false;
    lineInput.addEventListener("change", () => {
      runAction(() => {
        widget.xyPairs[activePairIndex].showLine = lineInput.checked;
      });
    });
    const lineText = document.createElement("span");
    lineText.textContent = t("widget.seriesLine");
    lineLabel.appendChild(lineInput);
    lineLabel.appendChild(lineText);

    const pointsSelect = document.createElement("select");
    setTooltipText(pointsSelect, t("widget.seriesPoints"));
    ["none", "last", "all"].forEach((mode) => {
      const opt = document.createElement("option");
      opt.value = mode;
      opt.textContent = t(`widget.seriesPointsMode.${mode}`);
      pointsSelect.appendChild(opt);
    });
    pointsSelect.value = normalizeChartPointMode(pair.pointMode, pair.showPoints);
    pointsSelect.addEventListener("change", () => {
      runAction(() => {
        widget.xyPairs[activePairIndex].pointMode = pointsSelect.value;
      });
    });

    const pointSizeInput = document.createElement("input");
    pointSizeInput.type = "number";
    pointSizeInput.step = "0.2";
    pointSizeInput.min = "1";
    pointSizeInput.max = "12";
    pointSizeInput.value = String(Number(pair.pointSize ?? 2.4));
    setTooltipText(pointSizeInput, t("widget.pointSize"));
    pointSizeInput.addEventListener("change", () => {
      runAction(() => {
        widget.xyPairs[activePairIndex].pointSize = clamp(Number(pointSizeInput.value) || 2.4, 1, 12);
      });
    });

    const lineStyleSelect = document.createElement("select");
    setTooltipText(lineStyleSelect, t("widget.lineStyle"));
    ["solid", "dashed", "dotted"].forEach((mode) => {
      const opt = document.createElement("option");
      opt.value = mode;
      opt.textContent = t(`widget.lineStyleMode.${mode}`);
      lineStyleSelect.appendChild(opt);
    });
    lineStyleSelect.value = normalizeChartLineStyle(pair.lineStyle);
    lineStyleSelect.addEventListener("change", () => {
      runAction(() => {
        widget.xyPairs[activePairIndex].lineStyle = normalizeChartLineStyle(lineStyleSelect.value);
      });
    });

    const lineWidthInput = document.createElement("input");
    lineWidthInput.type = "number";
    lineWidthInput.step = "0.2";
    lineWidthInput.min = "1";
    lineWidthInput.max = "8";
    lineWidthInput.value = String(Number(pair.lineWidth ?? 2.2));
    setTooltipText(lineWidthInput, t("widget.lineWidth"));
    lineWidthInput.addEventListener("change", () => {
      runAction(() => {
        widget.xyPairs[activePairIndex].lineWidth = clamp(Number(lineWidthInput.value) || 2.2, 1, 8);
      });
    });

    const primaryStyleRow = document.createElement("div");
    primaryStyleRow.className = "chart-pair-style-main";
    primaryStyleRow.appendChild(colorInput);
    primaryStyleRow.appendChild(lineLabel);
    primaryStyleRow.appendChild(createCompactField("widget.lineStyle", lineStyleSelect));
    primaryStyleRow.appendChild(createCompactField("widget.lineWidth", lineWidthInput));

    const secondaryStyleRow = document.createElement("div");
    secondaryStyleRow.className = "chart-pair-style-secondary";
    secondaryStyleRow.appendChild(createCompactField("widget.seriesPoints", pointsSelect));
    secondaryStyleRow.appendChild(createCompactField("widget.pointSize", pointSizeInput));

    styleRow.appendChild(primaryStyleRow);
    styleRow.appendChild(secondaryStyleRow);
    activePairSection.appendChild(styleRow);
  } else {
    const emptyPairs = document.createElement("div");
    emptyPairs.className = "empty-props";
    emptyPairs.textContent = t("widget.noPairs");
    chartPairsSection.appendChild(emptyPairs);
  }

  const chartAxisSection = createWidgetSection();
  appendWidgetSectionTitle(chartAxisSection, "widget.axisLimitsLabel");

  const parseLimitInput = (text) => {
    const trimmed = String(text ?? "").trim();
    if (!trimmed) {
      return null;
    }
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  };

  const xLimitRow = document.createElement("div");
  xLimitRow.className = "row2-exec";
  const xMinInput = document.createElement("input");
  xMinInput.type = "number";
  xMinInput.step = "any";
  xMinInput.placeholder = t("widget.axisXMin");
  xMinInput.value = widget.xMin == null ? "" : String(widget.xMin);
  xMinInput.addEventListener("change", () => {
    runAction(() => {
      widget.xMin = parseLimitInput(xMinInput.value);
    });
  });
  const xMaxInput = document.createElement("input");
  xMaxInput.type = "number";
  xMaxInput.step = "any";
  xMaxInput.placeholder = t("widget.axisXMax");
  xMaxInput.value = widget.xMax == null ? "" : String(widget.xMax);
  xMaxInput.addEventListener("change", () => {
    runAction(() => {
      widget.xMax = parseLimitInput(xMaxInput.value);
    });
  });
  xLimitRow.appendChild(createCompactField("widget.axisXMin", xMinInput));
  xLimitRow.appendChild(createCompactField("widget.axisXMax", xMaxInput));
  chartAxisSection.appendChild(xLimitRow);

  const yLimitRow = document.createElement("div");
  yLimitRow.className = "row2-exec";
  const yMinInput = document.createElement("input");
  yMinInput.type = "number";
  yMinInput.step = "any";
  yMinInput.placeholder = t("widget.axisYMin");
  yMinInput.value = widget.yMin == null ? "" : String(widget.yMin);
  yMinInput.addEventListener("change", () => {
    runAction(() => {
      widget.yMin = parseLimitInput(yMinInput.value);
    });
  });
  const yMaxInput = document.createElement("input");
  yMaxInput.type = "number";
  yMaxInput.step = "any";
  yMaxInput.placeholder = t("widget.axisYMax");
  yMaxInput.value = widget.yMax == null ? "" : String(widget.yMax);
  yMaxInput.addEventListener("change", () => {
    runAction(() => {
      widget.yMax = parseLimitInput(yMaxInput.value);
    });
  });
  yLimitRow.appendChild(createCompactField("widget.axisYMin", yMinInput));
  yLimitRow.appendChild(createCompactField("widget.axisYMax", yMaxInput));
  chartAxisSection.appendChild(yLimitRow);

  const gridLabel = document.createElement("label");
  gridLabel.className = "menu-check compact-bool";
  const gridInput = document.createElement("input");
  gridInput.type = "checkbox";
  gridInput.checked = widget.showGrid !== false;
  gridInput.addEventListener("change", () => {
    runAction(() => {
      widget.showGrid = gridInput.checked;
    });
  });
  const gridSpan = document.createElement("span");
  gridSpan.textContent = t("widget.showGrid");
  gridLabel.appendChild(gridInput);
  gridLabel.appendChild(gridSpan);
  chartAxisSection.appendChild(gridLabel);

  const legendPositionSelect = document.createElement("select");
  ["top-right", "top-left", "bottom-right", "bottom-left"].forEach((pos) => {
    const opt = document.createElement("option");
    opt.value = pos;
    opt.textContent = t(`widget.legendPositionMode.${pos}`);
    legendPositionSelect.appendChild(opt);
  });
  legendPositionSelect.value = widget.legendPosition || "top-right";
  legendPositionSelect.addEventListener("change", () => {
    runAction(() => {
      widget.legendPosition = legendPositionSelect.value;
    });
  });
  chartAxisSection.appendChild(createCompactField("widget.legendPosition", legendPositionSelect));
}

globalThis.Widgets = {
  addCanvasText,
  addLedWidget,
  addButtonWidget,
  addTableWidget,
  addMatrixWidget,
  addSliderWidget,
  addXYChartWidget,
  getModelNodeById,
  buildNodeNameMap,
  defaultChartSeriesColor,
  normalizeChartPointMode,
  normalizeChartSeriesToggle,
  normalizeChartLineStyle,
  applyWidgetDrivenNodeValues,
  applyRuntimeModelInputOverrides,
  refreshRuntimeView,
  startEdgeCreateFromNode,
  startEdgeCreateFromMouse,
  updateEdgeCreateFromClient,
  finishEdgeCreateFromClient,
  addControlPointAt,
  removeControlPoint,
  removeSelected,
  nodeIdAtGraphPoint,
  openBackgroundContextMenu,
  openNodeContextMenu,
  openTextContextMenu,
  openEdgeContextMenu,
  marqueeRect,
  nodesInRect,
  normalizeNodeDescriptionProperty,
  getNodeDescription,
  buildNodeTooltipText,
  canvasTextDisplayHtml,
  wrapTextSelection,
  insertTextHtmlSnippet,
  renderPropertiesEditor,
  sanitizeWidgetColumns,
  sanitizeTableWidgetOptions,
  sanitizeMatrixWidgetOptions,
  sanitizeLedWidgetOptions,
  sanitizeWidgetXYPairs,
  sanitizeXYChartOptions,
  sanitizeSliderWidgetOptions,
  sanitizeButtonWidgetOptions,
  drawXYChart,
  updateXYWidgetsFromComputedValues,
  updateTableWidgetsFromComputedValues,
  clearAllXYChartPoints,
  clearAllTableWidgetRows,
  renderWidgets,
  refreshWidgetConfigPanel,
};

})();
