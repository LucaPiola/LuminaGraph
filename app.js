const svg = document.getElementById("graphCanvas");
const graphViewport = document.getElementById("graphViewport");
const sidebar = document.getElementById("sidebar");
const statusText = document.getElementById("statusText");
const fileStatusText = document.getElementById("fileStatusText");
const modelBreadcrumbText = document.getElementById("modelBreadcrumbText");
const menuTimeText = document.getElementById("menuTimeText");
const topMenuBar = document.getElementById("topMenuBar");
const menuRoots = Array.from(document.querySelectorAll(".menu-root"));
const menuTitles = Array.from(document.querySelectorAll(".menu-title"));
const menuCommands = Array.from(document.querySelectorAll(".menu-command"));
const addRectNodeItem = document.getElementById("addRectNodeItem");
const addEllipseNodeItem = document.getElementById("addEllipseNodeItem");
const addDiamondNodeItem = document.getElementById("addDiamondNodeItem");
const addSubmodelNodeItem = document.getElementById("addSubmodelNodeItem");
const addTextItem = document.getElementById("addTextItem");
const addButtonWidgetItem = document.getElementById("addButtonWidgetItem");
const addSliderWidgetItem = document.getElementById("addSliderWidgetItem");
const addLedWidgetItem = document.getElementById("addLedWidgetItem");
const addMatrixWidgetItem = document.getElementById("addMatrixWidgetItem");
const addTableWidgetItem = document.getElementById("addTableWidgetItem");
const addXYChartWidgetItem = document.getElementById("addXYChartWidgetItem");
const fitContentItem = document.getElementById("fitContentItem");
const zoomInItem = document.getElementById("zoomInItem");
const zoomOutItem = document.getElementById("zoomOutItem");
const zoomResetItem = document.getElementById("zoomResetItem");
const toggleGraphItem = document.getElementById("toggleGraphItem");
const toggleWidgetsItem = document.getElementById("toggleWidgetsItem");
const toggleGraphBtn = document.getElementById("toggleGraphBtn");
const toggleWidgetsBtn = document.getElementById("toggleWidgetsBtn");
const runEvalBtn = document.getElementById("runEvalBtn");
const runStepBtn = document.getElementById("runStepBtn");
const runTimedToggleBtn = document.getElementById("runTimedToggleBtn");
const runResetBtn = document.getElementById("runResetBtn");
const topRunEvalBtn = document.getElementById("topRunEvalBtn");
const topRunStepBtn = document.getElementById("topRunStepBtn");
const topRunTimedBtn = document.getElementById("topRunTimedBtn");
const topRunResetBtn = document.getElementById("topRunResetBtn");
const runStrictDefinitionsInput = document.getElementById("runStrictDefinitionsInput");
const selectAllBtn = document.getElementById("selectAllBtn");
const cutBtn = document.getElementById("cutBtn");
const copyBtn = document.getElementById("copyBtn");
const pasteBtn = document.getElementById("pasteBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const deleteBtn = document.getElementById("deleteBtn");
const deleteBtnLabel = deleteBtn?.querySelector("[data-i18n='menu.edit.delete']") || deleteBtn?.querySelector("span");
const newGraphBtn = document.getElementById("newGraphBtn");
const saveJsonBtn = document.getElementById("saveJsonBtn");
const saveAsJsonBtn = document.getElementById("saveAsJsonBtn");
const loadJsonBtn = document.getElementById("loadJsonBtn");
const recentModelsMenuRoot = document.getElementById("recentModelsMenuRoot");
const recentModelsSep = document.getElementById("recentModelsSep");
const recentModelsSection = document.getElementById("recentModelsSection");
const clearRecentModelsBtn = document.getElementById("clearRecentModelsBtn");
const loadJsonInput = document.getElementById("loadJsonInput");
const snapToGridInput = document.getElementById("snapToGridInput");
const gridSizeInput = document.getElementById("gridSizeInput");

const noSelection = document.getElementById("noSelection");
const globalPanel = document.getElementById("globalPanel");
const nodePanel = document.getElementById("nodePanel");
const edgePanel = document.getElementById("edgePanel");
const widgetPanel = document.getElementById("widgetPanel");
const widgetPanelTitle = document.getElementById("widgetPanelTitle");
const modelTitleInput = document.getElementById("modelTitleInput");
const timeStartInput = document.getElementById("timeStartInput");
const timeStepInput = document.getElementById("timeStepInput");
const timeEndInput = document.getElementById("timeEndInput");
const timeDelayInput = document.getElementById("timeDelayInput");
const decimalDigitsInput = document.getElementById("decimalDigitsInput");
const integratorInput = document.getElementById("integratorInput");
const strictDefinitionsInput = document.getElementById("strictDefinitionsInput");
const timeCurrentOutput = document.getElementById("timeCurrentOutput");
const modelPropsList = document.getElementById("modelPropsList");
const addModelPropBtn = document.getElementById("addModelPropBtn");
const zoomRangeInput = document.getElementById("zoomRangeInput");
const zoomRangeValue = document.getElementById("zoomRangeValue");
const runFullModelBtn = document.getElementById("runFullModelBtn");
const manualStepBtn = document.getElementById("manualStepBtn");
const timedToggleBtn = document.getElementById("timedToggleBtn");
const resetExecBtn = document.getElementById("resetExecBtn");

const nodeNameInput = document.getElementById("nodeNameInput");
const nodeShapeInput = document.getElementById("nodeShapeInput");
const nodeInputInput = document.getElementById("nodeInputInput");
const nodeInputLabel = nodeInputInput?.closest("label");
const nodeOutputInput = document.getElementById("nodeOutputInput");
const nodeValueExprLabel = document.getElementById("nodeValueExprLabel");
const nodeValueExprRow = document.getElementById("nodeValueExprRow");
const nodeValueExprInput = document.getElementById("nodeValueExprInput");
const editNodeValueExprBtn = document.getElementById("editNodeValueExprBtn");
const nodeValueExprStatus = document.getElementById("nodeValueExprStatus");
const nodeModelPathLabel = document.getElementById("nodeModelPathLabel");
const nodeModelPathInput = document.getElementById("nodeModelPathInput");
const submodelActionRow = document.getElementById("submodelActionRow");
const loadSubmodelBtn = document.getElementById("loadSubmodelBtn");
const showSubmodelBtn = document.getElementById("showSubmodelBtn");
const nodeSubmodelInfo = document.getElementById("nodeSubmodelInfo");
const nodeSubmodelBindings = document.getElementById("nodeSubmodelBindings");
const nodeInitialStateLabel = document.getElementById("nodeInitialStateLabel");
const nodeInitialStateRow = document.getElementById("nodeInitialStateRow");
const nodeInitialStateInput = document.getElementById("nodeInitialStateInput");
const editNodeInitialStateBtn = document.getElementById("editNodeInitialStateBtn");
const nodeInitialStateStatus = document.getElementById("nodeInitialStateStatus");
const nodeValueOutput = document.getElementById("nodeValueOutput");
const nodeFillColorInput = document.getElementById("nodeFillColorInput");
const nodeStrokeColorInput = document.getElementById("nodeStrokeColorInput");
const resetNodeColorsBtn = document.getElementById("resetNodeColorsBtn");
const propsList = document.getElementById("propsList");
const addPropBtn = document.getElementById("addPropBtn");

const edgeInfo = document.getElementById("edgeInfo");
const textPanel = document.getElementById("textPanel");
const textWidthInput = document.getElementById("textWidthInput");
const textHeightInput = document.getElementById("textHeightInput");
const textFillColorInput = document.getElementById("textFillColorInput");
const textStrokeColorInput = document.getElementById("textStrokeColorInput");
const textToolbar = document.getElementById("textToolbar");
const textHtmlInput = document.getElementById("textHtmlInput");
const widgetConfig = document.getElementById("widgetConfig");
const contextMenu = document.getElementById("contextMenu");
const canvasContent = document.getElementById("canvasContent");
const widgetLayer = document.getElementById("widgetLayer");
const expressionEditorModal = document.getElementById("expressionEditorModal");
const expressionEditorTitle = document.getElementById("expressionEditorTitle");
const expressionEditorTextarea = document.getElementById("expressionEditorTextarea");
const expressionEditorHighlight = document.getElementById("expressionEditorHighlight");
const expressionEditorSurface = document.querySelector(".expression-editor-surface");
const expressionSymbolsFilter = document.getElementById("expressionSymbolsFilter");
const expressionSidebar = document.getElementById("expressionSidebar");
const expressionHelp = document.getElementById("expressionHelp");
const expressionPreviewBox = document.getElementById("expressionPreviewBox");
const expressionPreviewValue = document.getElementById("expressionPreviewValue");
const expressionLibrary = document.getElementById("expressionLibrary");
const expressionEditorHint = document.getElementById("expressionEditorHint");
const expressionEditorStatus = document.getElementById("expressionEditorStatus");
const expressionEditorCloseBtn = document.getElementById("expressionEditorCloseBtn");
const expressionEditorCancelBtn = document.getElementById("expressionEditorCancelBtn");
const expressionEditorApplyBtn = document.getElementById("expressionEditorApplyBtn");
const expressionEditorResizeHandle = document.getElementById("expressionEditorResizeHandle");
const functionsHelpBtn = document.getElementById("functionsHelpBtn");
const aboutAppBtn = document.getElementById("aboutAppBtn");
const exitSubmodelBtn = document.getElementById("exitSubmodelBtn");
const functionsHelpModal = document.getElementById("functionsHelpModal");
const functionsHelpCloseBtn = document.getElementById("functionsHelpCloseBtn");
const functionsHelpDismissBtn = document.getElementById("functionsHelpDismissBtn");
const functionsHelpContent = document.getElementById("functionsHelpContent");
const aboutAppModal = document.getElementById("aboutAppModal");
const aboutAppCloseBtn = document.getElementById("aboutAppCloseBtn");
const aboutAppDismissBtn = document.getElementById("aboutAppDismissBtn");
const expressionEditorSwitchModal = document.getElementById("expressionEditorSwitchModal");
const expressionEditorSwitchCloseBtn = document.getElementById("expressionEditorSwitchCloseBtn");
const expressionEditorSwitchCancelBtn = document.getElementById("expressionEditorSwitchCancelBtn");
const expressionEditorSwitchDiscardBtn = document.getElementById("expressionEditorSwitchDiscardBtn");
const expressionEditorSwitchApplyBtn = document.getElementById("expressionEditorSwitchApplyBtn");
const appTooltip = document.getElementById("appTooltip");

const {
  addCanvasText,
  addLedWidget,
  addButtonWidget,
  addSliderWidget,
  addMatrixWidget,
  addTableWidget,
  addXYChartWidget,
  getModelNodeById,
  buildNodeNameMap,
  defaultChartSeriesColor,
  normalizeChartPointMode,
  normalizeChartSeriesToggle,
  normalizeChartLineStyle,
  applyWidgetDrivenNodeValues,
  applyRuntimeModelInputOverrides,
  updateTableWidgetsFromComputedValues,
  updateXYWidgetsFromComputedValues,
  clearAllXYChartPoints,
  clearAllTableWidgetRows,
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
  renderWidgets,
  refreshWidgetConfigPanel,
} = globalThis.Widgets || {};

const SVG_NS = "http://www.w3.org/2000/svg";
const MAX_HISTORY = 100;
const BASE_CANVAS_WIDTH = 1200;
const BASE_CANVAS_HEIGHT = 800;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;
const SUPPORTED_LANGS = new Set(["it", "en"]);
const CHART_SERIES_PALETTE = ["#0e7ac4", "#e67e22", "#27ae60", "#8e44ad", "#c0392b", "#16a085"];
const RECENT_MODELS_STORAGE_KEY = "stgraphx.recentModels.v1";
const MAX_RECENT_MODELS = 8;
const NODE_FILL_COLOR_PRESETS = [
  { key: "default", value: "" },
  { key: "blue", value: "#dff2ff" },
  { key: "green", value: "#dff6ec" },
  { key: "yellow", value: "#fff7d8" },
  { key: "orange", value: "#ffe8d6" },
  { key: "red", value: "#ffe1e6" },
  { key: "violet", value: "#eee3ff" },
  { key: "gray", value: "#eef2f6" },
];

const NODE_STROKE_COLOR_PRESETS = [
  { key: "default", value: "" },
  { key: "blue", value: "#156fb8" },
  { key: "green", value: "#1f8a5a" },
  { key: "yellow", value: "#b48710" },
  { key: "orange", value: "#c56416" },
  { key: "red", value: "#c43a52" },
  { key: "violet", value: "#6e49b8" },
  { key: "gray", value: "#586978" },
];

const TEXT_FILL_COLOR_PRESETS = [
  { key: "default", value: "" },
  { key: "blue", value: "#eef6ff" },
  { key: "green", value: "#edf9f2" },
  { key: "yellow", value: "#fff9e7" },
  { key: "orange", value: "#fff0e4" },
  { key: "red", value: "#fff0f2" },
  { key: "violet", value: "#f3eeff" },
  { key: "gray", value: "#f3f6f9" },
];

const TEXT_STROKE_COLOR_PRESETS = [
  { key: "default", value: "" },
  { key: "blue", value: "#2f78c4" },
  { key: "green", value: "#2d9564" },
  { key: "yellow", value: "#bc8c19" },
  { key: "orange", value: "#ca6a1d" },
  { key: "red", value: "#c44b61" },
  { key: "violet", value: "#7a58c1" },
  { key: "gray", value: "#6b7b8a" },
];

function normalizeTableColumnName(column) {
  if (typeof column === "string") {
    return column;
  }
  if (column && typeof column === "object") {
    if (typeof column.source === "string") {
      return column.source;
    }
    if (typeof column.name === "string") {
      return column.name;
    }
    if (typeof column.label === "string") {
      return column.label;
    }
  }
  return String(column ?? "");
}

let nodeCounter = 1;
let edgeCounter = 1;
let widgetCounter = 1;
let textItemCounter = 1;
let currentLang = "it";
let i18n = {};
let lastSavedSnapshot = "";
let currentFileHandle = null;
let currentFileName = "";
let currentModelDirectoryHandle = null;
let recentModelEntries = [];
const modelContextStack = [];
const submodelTemplateCache = new Map();
const submodelFileHandleCache = new Map();
const submodelSourceCache = new Map();
const SUBMODEL_DEFERRED_RESOLUTION = "__submodel_deferred_resolution__";
function descriptionPropertyKey() {
  return currentLang === "en" ? "description" : "descrizione";
}

function descriptionPropertyKeys() {
  return new Set(["descrizione", "description"]);
}
let dirtySinceLastSave = false;
let fileStatusRefreshTimer = null;

const graph = {
  modelTitle: "",
  properties: [],
  nodes: [],
  edges: [],
  textItems: [],
  widgets: [],
  execution: {
    t0: 0,
    dt: 1,
    t1: 10,
    delayMs: 1000,
    decimals: 3,
    integrator: "euler",
    strictDefinitions: false,
    currentTime: null,
  },
};

const ui = {
  selected: null,
  selectedNodes: new Set(),
  selectedControlPoint: null,
  lastControlPointTap: null,
  drag: null,
  resize: null,
  edgeCreate: null,
  edgeCreateHoverId: null,
  edgeCreateLastPoint: null,
  controlPointDrag: null,
  marquee: null,
  snapToGrid: true,
  gridSize: 20,
  zoom: 1,
  nodeNameEditStart: null,
  timedRunHandle: null,
  timedStepRunning: false,
  submodelsPrepared: false,
  widgetDrag: null,
  widgetResize: null,
  sliderInteraction: null,
  showGraph: true,
  showWidgets: true,
  expressionEditor: null,
  modalDrag: null,
  modalResize: null,
  tooltipTarget: null,
  tooltipPointer: null,
  tooltipShowTimer: null,
  tooltipHideTimer: null,
  executionPlan: null,
  activeChartPairByWidgetId: new Map(),
  sidebarNodeId: null,
  lastNodeActivate: null,
  textDrag: null,
  textResize: null,
  expressionPreviewTimer: null,
  expressionEditorPendingSelectionAction: null,
  expressionPreviewInitCache: null,
};

const history = {
  undo: [],
  redo: [],
  transactionStart: null,
};

const clipboard = {
  data: null,
  pasteCount: 0,
};

const defs = document.createElementNS(SVG_NS, "defs");
const marker = document.createElementNS(SVG_NS, "marker");
marker.setAttribute("id", "arrow");
marker.setAttribute("viewBox", "0 0 10 10");
marker.setAttribute("refX", "9");
marker.setAttribute("refY", "5");
marker.setAttribute("markerWidth", "8");
marker.setAttribute("markerHeight", "8");
marker.setAttribute("orient", "auto-start-reverse");
const arrowPath = document.createElementNS(SVG_NS, "path");
arrowPath.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
arrowPath.setAttribute("fill", "#3b4e61");
marker.appendChild(arrowPath);
defs.appendChild(marker);
svg.appendChild(defs);

const edgesLayer = document.createElementNS(SVG_NS, "g");
const previewLayer = document.createElementNS(SVG_NS, "g");
const marqueeLayer = document.createElementNS(SVG_NS, "g");
const nodesLayer = document.createElementNS(SVG_NS, "g");
const textLayer = document.createElementNS(SVG_NS, "g");
const controlsLayer = document.createElementNS(SVG_NS, "g");
svg.appendChild(edgesLayer);
svg.appendChild(previewLayer);
svg.appendChild(nodesLayer);
svg.appendChild(textLayer);
svg.appendChild(controlsLayer);
svg.appendChild(marqueeLayer);
const semantics = window.GraphSemantics;

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

function svgPoint(evt) {
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function svgPointFromClient(clientX, clientY) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function worldDeltaFromClientDelta(deltaClientX, deltaClientY) {
  const vb = svg.viewBox.baseVal;
  const width = Math.max(1, svg.clientWidth || Math.round((vb?.width || BASE_CANVAS_WIDTH) * ui.zoom));
  const height = Math.max(1, svg.clientHeight || Math.round((vb?.height || BASE_CANVAS_HEIGHT) * ui.zoom));
  const scaleX = (vb?.width || BASE_CANVAS_WIDTH) / width;
  const scaleY = (vb?.height || BASE_CANVAS_HEIGHT) / height;
  return {
    x: deltaClientX * scaleX,
    y: deltaClientY * scaleY,
  };
}

function isTypingTarget(target = document.activeElement) {
  if (!target || !(target instanceof HTMLElement)) {
    return false;
  }
  if (target.isContentEditable) {
    return true;
  }
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function snap(value) {
  if (!ui.snapToGrid) {
    return value;
  }
  return Math.round(value / ui.gridSize) * ui.gridSize;
}

function snapPoint(p) {
  return { x: snap(p.x), y: snap(p.y) };
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function normalizeColorString(value) {
  return /^#[0-9a-fA-F]{6}$/.test(String(value ?? "")) ? String(value) : "";
}

function defaultNodeFillColor() {
  return "#fcfdff";
}

function defaultNodeStrokeColor() {
  return "#2f4a62";
}

function sanitizeNodeVisualOptions(node) {
  node.fillColor = normalizeColorString(node.fillColor);
  node.strokeColor = normalizeColorString(node.strokeColor);
}

function populateNodeColorSelect(selectEl, presets) {
  if (!selectEl) {
    return;
  }
  const currentValue = String(selectEl.value ?? "");
  selectEl.innerHTML = "";
  presets.forEach((preset) => {
    const opt = document.createElement("option");
    opt.value = preset.value;
    opt.textContent = t(`color.${preset.key}`);
    selectEl.appendChild(opt);
  });
  selectEl.value = presets.some((preset) => preset.value === currentValue) ? currentValue : "";
}

function sanitizeTextItem(item) {
  item.html = String(item?.html ?? "");
  item.x = Number.isFinite(Number(item?.x)) ? Number(item.x) : 120;
  item.y = Number.isFinite(Number(item?.y)) ? Number(item.y) : 120;
  item.width = clamp(Number(item?.width) || 220, 40, 1200);
  item.height = clamp(Number(item?.height) || 80, 24, 1200);
  item.fillColor = normalizeColorString(item?.fillColor);
  item.strokeColor = normalizeColorString(item?.strokeColor);
}

function sanitizeRichTextHtml(rawHtml) {
  const template = document.createElement("template");
  template.innerHTML = String(rawHtml ?? "");
  const allowedTags = new Set([
    "B", "STRONG", "I", "EM", "U", "BR",
    "P", "DIV", "SPAN",
    "H1", "H2", "H3", "H4", "H5", "H6",
    "UL", "OL", "LI", "SUP", "SUB",
  ]);
  const allowedStyles = new Set([
    "color",
    "background-color",
    "font-size",
    "font-weight",
    "font-style",
    "text-decoration",
    "text-align",
    "line-height",
  ]);

  const sanitizeStyle = (value) => {
    return String(value || "")
      .split(";")
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map((chunk) => {
        const [prop, ...rest] = chunk.split(":");
        const key = String(prop || "").trim().toLowerCase();
        if (!allowedStyles.has(key)) {
          return "";
        }
        const val = rest.join(":").trim();
        return val ? `${key}: ${val}` : "";
      })
      .filter(Boolean)
      .join("; ");
  };

  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toUpperCase();
        if (!allowedTags.has(tag)) {
          const fragment = document.createDocumentFragment();
          while (child.firstChild) {
            fragment.appendChild(child.firstChild);
          }
          child.replaceWith(fragment);
          walk(node);
          return;
        }
        [...child.attributes].forEach((attr) => {
          if (attr.name.toLowerCase() !== "style") {
            child.removeAttribute(attr.name);
          }
        });
        const style = sanitizeStyle(child.getAttribute("style"));
        if (style) {
          child.setAttribute("style", style);
        } else {
          child.removeAttribute("style");
        }
        walk(child);
      } else if (child.nodeType === Node.COMMENT_NODE) {
        child.remove();
      }
    });
  };

  walk(template.content);
  return template.innerHTML.trim();
}

function hasPlatformApi(name) {
  return typeof window.STGraphXPlatform?.[name] === "function";
}

function supportsOpenFilePicker() {
  return hasPlatformApi("showOpenFilePicker") || typeof window.showOpenFilePicker === "function";
}

function supportsSaveFilePicker() {
  return hasPlatformApi("showSaveFilePicker") || typeof window.showSaveFilePicker === "function";
}

function supportsDirectoryPicker() {
  return hasPlatformApi("showDirectoryPicker") || typeof window.showDirectoryPicker === "function";
}

async function showOpenFilePickerCompat(options) {
  if (hasPlatformApi("showOpenFilePicker")) {
    return window.STGraphXPlatform.showOpenFilePicker(options);
  }
  if (typeof window.showOpenFilePicker === "function") {
    return window.showOpenFilePicker(options);
  }
  throw new Error("Open file picker not supported");
}

async function showSaveFilePickerCompat(options) {
  if (hasPlatformApi("showSaveFilePicker")) {
    return window.STGraphXPlatform.showSaveFilePicker(options);
  }
  if (typeof window.showSaveFilePicker === "function") {
    return window.showSaveFilePicker(options);
  }
  throw new Error("Save file picker not supported");
}

async function showDirectoryPickerCompat(options) {
  if (hasPlatformApi("showDirectoryPicker")) {
    return window.STGraphXPlatform.showDirectoryPicker(options);
  }
  if (typeof window.showDirectoryPicker === "function") {
    return window.showDirectoryPicker(options);
  }
  throw new Error(t("error.submodelDirectoryUnsupported"));
}

function bundledI18nMessages(lang) {
  const raw = window.STGraphXI18nBundles?.[lang];
  return raw && typeof raw === "object" ? { ...raw } : null;
}

function resolveLangFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get("lang") || "it").trim().toLowerCase();
  const base = raw.split("-")[0];
  if (SUPPORTED_LANGS.has(raw)) {
    return raw;
  }
  if (SUPPORTED_LANGS.has(base)) {
    return base;
  }
  return "it";
}

function fillTemplate(template, vars = {}) {
  return String(template).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) => {
    if (Object.prototype.hasOwnProperty.call(vars, name)) {
      return String(vars[name]);
    }
    return `{${name}}`;
  });
}

function t(key, vars = null) {
  const value = i18n[key] ?? key;
  return vars ? fillTemplate(value, vars) : value;
}

function setTooltipText(el, text) {
  if (!el) {
    return;
  }
  const value = String(text ?? "").trim();
  const isSvgElement = typeof SVGElement !== "undefined" && el instanceof SVGElement;
  const existingSvgTitle = isSvgElement
    ? Array.from(el.children || []).find((child) => child.tagName?.toLowerCase?.() === "title" && child.getAttribute("data-generated-tooltip") === "1")
    : null;
  el.removeAttribute("title");
  if (existingSvgTitle) {
    existingSvgTitle.remove();
  }
  if (!value) {
    el.removeAttribute("data-tooltip");
    return;
  }
  el.setAttribute("data-tooltip", value);
}

function cancelTooltipTimers() {
  if (ui.tooltipShowTimer != null) {
    window.clearTimeout(ui.tooltipShowTimer);
    ui.tooltipShowTimer = null;
  }
  if (ui.tooltipHideTimer != null) {
    window.clearTimeout(ui.tooltipHideTimer);
    ui.tooltipHideTimer = null;
  }
}

function activeTooltipTarget(target) {
  if (!target || !(target instanceof Element)) {
    return null;
  }
  return target.closest("[data-node-tooltip], [data-tooltip]");
}

function nodeTooltipTarget(target) {
  if (!target || !(target instanceof Element)) {
    return null;
  }
  return target.closest("[data-node-tooltip][data-node-id]");
}

function hideAppTooltip() {
  cancelTooltipTimers();
  if (!appTooltip) {
    return;
  }
  appTooltip.classList.add("hidden");
  appTooltip.setAttribute("aria-hidden", "true");
  ui.tooltipTarget = null;
  ui.tooltipPointer = null;
}

function scheduleHideAppTooltip(delay = 90) {
  if (!appTooltip) {
    return;
  }
  if (ui.tooltipHideTimer != null) {
    window.clearTimeout(ui.tooltipHideTimer);
  }
  ui.tooltipHideTimer = window.setTimeout(() => {
    ui.tooltipHideTimer = null;
    hideAppTooltip();
  }, delay);
}

function positionAppTooltip(clientX, clientY) {
  if (!appTooltip || appTooltip.classList.contains("hidden")) {
    return;
  }
  const margin = 12;
  const rect = appTooltip.getBoundingClientRect();
  let left = clientX + 14;
  let top = clientY + 18;
  if (left + rect.width > window.innerWidth - margin) {
    left = window.innerWidth - rect.width - margin;
  }
  if (top + rect.height > window.innerHeight - margin) {
    top = clientY - rect.height - 14;
  }
  if (left < margin) {
    left = margin;
  }
  if (top < margin) {
    top = margin;
  }
  appTooltip.style.left = `${Math.round(left)}px`;
  appTooltip.style.top = `${Math.round(top)}px`;
}

function showAppTooltip(target, clientX, clientY) {
  cancelTooltipTimers();
  if (!appTooltip || !target) {
    return;
  }
  const { text, tone } = tooltipInfoForTarget(target);
  if (!text) {
    hideAppTooltip();
    return;
  }
  applyTooltipState(text, tone);
  appTooltip.classList.remove("hidden");
  appTooltip.setAttribute("aria-hidden", "false");
  ui.tooltipTarget = target;
  ui.tooltipPointer = { x: clientX, y: clientY };
  positionAppTooltip(clientX, clientY);
}

function scheduleShowAppTooltip(target, clientX, clientY, delay = 280) {
  cancelTooltipTimers();
  if (!target) {
    return;
  }
  ui.tooltipShowTimer = window.setTimeout(() => {
    ui.tooltipShowTimer = null;
    showAppTooltip(target, clientX, clientY);
  }, delay);
}

function tooltipInfoForTarget(target) {
  if (!target) {
    return { text: "", tone: "" };
  }
  const nodeEl = nodeTooltipTarget(target);
  if (nodeEl) {
    const node = getNodeById(String(nodeEl.getAttribute("data-node-id") || ""));
    return buildNodeTooltipText(node);
  }
  return { text: String(target.dataset.tooltip || "").trim(), tone: "" };
}

function applyTooltipState(text, tone = "") {
  if (!appTooltip) {
    return;
  }
  appTooltip.textContent = text;
  appTooltip.classList.remove("value", "error");
  if (tone) {
    appTooltip.classList.add(tone);
  }
}

function showNodeTooltip(node, target, clientX, clientY) {
  cancelTooltipTimers();
  if (!appTooltip || !target || !node) {
    return;
  }
  const { text, tone } = buildNodeTooltipText(node);
  if (!text) {
    hideAppTooltip();
    return;
  }
  setTooltipText(target, text);
  applyTooltipState(text, tone);
  appTooltip.classList.remove("hidden");
  appTooltip.setAttribute("aria-hidden", "false");
  ui.tooltipTarget = target;
  ui.tooltipPointer = { x: clientX, y: clientY };
  positionAppTooltip(clientX, clientY);
}

function refreshNodeTooltipElement(target) {
  const nodeEl = nodeTooltipTarget(target);
  if (!nodeEl) {
    return;
  }
  const node = getNodeById(String(nodeEl.getAttribute("data-node-id") || ""));
  if (!node) {
    return;
  }
  setTooltipText(nodeEl, buildNodeTooltipText(node).text);
}

function refreshRenderedNodeTooltipElements() {
  const renderedNodes = document.querySelectorAll(".node[data-node-id]");
  renderedNodes.forEach((nodeEl) => {
    const node = getNodeById(String(nodeEl.getAttribute("data-node-id") || ""));
    if (!node) {
      return;
    }
    setTooltipText(nodeEl, buildNodeTooltipText(node).text);
  });
}

function refreshActiveTooltip() {
  if (!appTooltip || appTooltip.classList.contains("hidden") || !ui.tooltipTarget) {
    return;
  }
  const nodeId = nodeTooltipTarget(ui.tooltipTarget)?.getAttribute?.("data-node-id");
  let target = ui.tooltipTarget;
  if (nodeId) {
    target = document.querySelector(`.node[data-node-id="${CSS.escape(String(nodeId))}"]`) || target;
    ui.tooltipTarget = target;
  }
  refreshNodeTooltipElement(target);
  const { text, tone } = tooltipInfoForTarget(target);
  if (!text) {
    hideAppTooltip();
    return;
  }
  applyTooltipState(text, tone);
  const point = ui.tooltipPointer || { x: 24, y: 24 };
  positionAppTooltip(point.x, point.y);
}

function nodeExpressionTooltipKey(node) {
  if (!node) {
    return "tooltip.node.expressionBehavior";
  }
  if (node.shape === "diamond") {
    return "tooltip.node.expressionValue";
  }
  if (isStateNode(node)) {
    return "tooltip.node.expressionState";
  }
  return "tooltip.node.expressionBehavior";
}

function updateNodeExpressionTooltips(node = selectedNodeForSidebar()) {
  const key = nodeExpressionTooltipKey(node);
  const text = t(key);
  setTooltipText(nodeValueExprLabel, text);
  setTooltipText(nodeValueExprInput, text);
}

function hideExpressionStatus(statusEl) {
  if (!statusEl) {
    return;
  }
  statusEl.textContent = "";
  statusEl.classList.add("hidden");
  statusEl.classList.remove("ok", "error");
}

function showExpressionStatus(statusEl, syntaxResult, showOk = true) {
  if (!statusEl) {
    return;
  }
  if (!syntaxResult || syntaxResult.empty) {
    hideExpressionStatus(statusEl);
    return;
  }
  statusEl.classList.remove("hidden", "ok", "error");
  if (syntaxResult.ok) {
    if (!showOk) {
      hideExpressionStatus(statusEl);
      return;
    }
    statusEl.classList.add("ok");
    statusEl.textContent = t("expr.syntaxOk");
    return;
  }
  statusEl.classList.add("error");
  statusEl.textContent = t("expr.syntaxError", {
    message: localizeExpressionErrorMessage(syntaxResult.message || t("error.evalReason.syntax")),
  });
}

function localizeExpressionErrorMessage(message) {
  const raw = String(message ?? "").trim();
  if (!raw) {
    return t("error.evalReason.syntax");
  }
  const lower = raw.toLowerCase();
  if (["syntax", "syntaxerror"].includes(lower)) {
    return t("error.evalReason.syntax");
  }
  if (["runtime", "runtimeerror"].includes(lower)) {
    return t("error.evalReason.runtime");
  }
  if (["reference", "referenceerror"].includes(lower)) {
    return t("error.evalReason.reference");
  }
  if (["dependency"].includes(lower)) {
    return t("error.evalReason.dependency");
  }
  if (["type", "typeerror"].includes(lower)) {
    return t("error.evalReason.type");
  }
  if (lower === "'this' is only available in state transitions") {
    return t("expr.error.thisOnlyState");
  }
  if (lower === "'integral' is only available in state transitions") {
    return t("expr.error.integralOnlyState");
  }
  if (lower.includes("missing ) after argument list") || lower.includes("missing ) in parenthetical")) {
    return t("expr.error.missingCloseParen");
  }
  if (lower.includes("missing ] after element list")) {
    return t("expr.error.missingCloseBracket");
  }
  if (lower.includes("missing } after property list")) {
    return t("expr.error.missingCloseBrace");
  }
  if (lower.includes("unexpected end of input")) {
    return t("expr.error.unexpectedEnd");
  }
  if (lower.includes("unexpected token")) {
    return t("expr.error.unexpectedToken");
  }
  if (lower.includes("invalid or unexpected token")) {
    return t("expr.error.invalidToken");
  }
  if (lower.includes("unterminated string") || lower.includes("string literal contains an unescaped line break")) {
    return t("expr.error.unterminatedString");
  }
  if (lower.includes("missing : after property id")) {
    return t("expr.error.objectColon");
  }
  if (lower === "invalid number") {
    return t("expr.error.invalidNumber");
  }
  if (lower === "empty index") {
    return t("expr.error.emptyIndex");
  }
  if (lower === "empty index after ','") {
    return t("expr.error.emptyIndexAfterComma");
  }
  if (lower === "expected property name after '.'") {
    return t("expr.error.expectedPropertyAfterDot");
  }
  const notDefinedMatch = raw.match(/^([A-Za-z_$][A-Za-z0-9_$]*) is not defined$/);
  if (notDefinedMatch) {
    return t("expr.error.notDefined", { name: notDefinedMatch[1] });
  }
  const notCallableMatch = raw.match(/^([A-Za-z_$][A-Za-z0-9_$]*) is not callable$/);
  if (notCallableMatch) {
    return t("expr.error.notCallable", { name: notCallableMatch[1] });
  }
  const expectsMatrixMatch = raw.match(/^([A-Za-z_$][A-Za-z0-9_$]*) expects a matrix$/i);
  if (expectsMatrixMatch) {
    return t("expr.error.expectsMatrix", { name: expectsMatrixMatch[1] });
  }
  const expectsRectMatrixMatch = raw.match(/^([A-Za-z_$][A-Za-z0-9_$]*) expects a rectangular matrix$/i);
  if (expectsRectMatrixMatch) {
    return t("expr.error.expectsRectangularMatrix", { name: expectsRectMatrixMatch[1] });
  }
  const expectsVectorMatch = raw.match(/^([A-Za-z_$][A-Za-z0-9_$]*) expects a non-empty vector$/i);
  if (expectsVectorMatch) {
    return t("expr.error.expectsNonEmptyVector", { name: expectsVectorMatch[1] });
  }
  const expectsVectorOrMatrixMatch = raw.match(/^([A-Za-z_$][A-Za-z0-9_$]*) expects a non-empty vector or matrix$/i);
  if (expectsVectorOrMatrixMatch) {
    return t("expr.error.expectsNonEmptyVectorOrMatrix", { name: expectsVectorOrMatrixMatch[1] });
  }
  const expectsVectorGenericMatch = raw.match(/^([A-Za-z_$][A-Za-z0-9_$]*) expects a vector$/i);
  if (expectsVectorGenericMatch) {
    return t("expr.error.expectsVector", { name: expectsVectorGenericMatch[1] });
  }
  const expectsOptionBoolMatch = raw.match(/^([A-Za-z_$][A-Za-z0-9_$]*) expects ([A-Za-z_$][A-Za-z0-9_$]*) to be true, false, 1, or 0$/i);
  if (expectsOptionBoolMatch) {
    return t("expr.error.expectsBooleanFlag", { name: expectsOptionBoolMatch[1], option: expectsOptionBoolMatch[2] });
  }
  const expectsFiniteMatch = raw.match(/^([A-Za-z_$][A-Za-z0-9_$]*) must be finite$/i);
  if (expectsFiniteMatch) {
    return t("expr.error.mustBeFinite", { name: expectsFiniteMatch[1] });
  }
  const expectsNArgsMatch = raw.match(/^([A-Za-z_$][A-Za-z0-9_$]*) expects exactly (\d+) arguments?$/i);
  if (expectsNArgsMatch) {
    return t("expr.error.expectsExactlyArgs", { name: expectsNArgsMatch[1], count: expectsNArgsMatch[2] });
  }
  const expectsRangeArgsMatch = raw.match(/^([A-Za-z_$][A-Za-z0-9_$]*) expects (\d+) to (\d+) arguments?$/i);
  if (expectsRangeArgsMatch) {
    return t("expr.error.expectsArgRange", { name: expectsRangeArgsMatch[1], min: expectsRangeArgsMatch[2], max: expectsRangeArgsMatch[3] });
  }
  const expectsOptionsArgsMatch = raw.match(/^([A-Za-z_$][A-Za-z0-9_$]*) expects (.+) arguments?$/i);
  if (expectsOptionsArgsMatch) {
    return t("expr.error.expectsArgsDescription", { name: expectsOptionsArgsMatch[1], description: expectsOptionsArgsMatch[2] });
  }
  if (lower === "probability must be in (0, 1)") {
    return t("expr.error.probabilityOpen01");
  }
  if (lower === "probability must be in [0, 1]") {
    return t("expr.error.probabilityClosed01");
  }
  if (lower === "probability must be in [0, 1)") {
    return t("expr.error.probabilityHalfOpen01");
  }
  if (lower === "sigma must be > 0") {
    return t("expr.error.sigmaPositive");
  }
  if (lower === "rate must be > 0") {
    return t("expr.error.ratePositive");
  }
  if (lower === "max must be > min") {
    return t("expr.error.maxGreaterThanMin");
  }
  if (lower === "dt must be finite") {
    return t("expr.error.dtFinite");
  }
  if (lower === "range bounds must be finite numbers") {
    return t("expr.error.rangeBoundsFinite");
  }
  if (lower === "range step must be a non-zero finite number") {
    return t("expr.error.rangeStepNonZeroFinite");
  }
  if (lower === "range step does not reach the end value") {
    return t("expr.error.rangeStepNotReachEnd");
  }
  if (lower === "range is too large") {
    return t("expr.error.rangeTooLarge");
  }
  if (lower === "array is too large") {
    return t("expr.error.arrayTooLarge");
  }
  if (lower === "array requires at least one dimension") {
    return t("expr.error.arrayNeedsDimension");
  }
  const arrayDimMatch = raw.match(/^array dimension (\d+) must be a non-negative integer$/i);
  if (arrayDimMatch) {
    return t("expr.error.arrayDimensionNonNegative", { index: arrayDimMatch[1] });
  }
  if (lower === "array is a special expression form" || lower === "map is a special expression form" || lower === "filter is a special expression form" || lower === "reduce is a special expression form" || lower === "append is a special expression form") {
    return t("expr.error.specialForm");
  }
  if (lower === "getproperty is only available in node expressions") {
    return t("expr.error.getPropertyOnlyNode");
  }
  if (lower === "setproperty is only available in node expressions") {
    return t("expr.error.setPropertyOnlyNode");
  }
  if (lower === "getmodelproperty is unavailable") {
    return t("expr.error.getModelPropertyUnavailable");
  }
  if (lower === "setmodelproperty is unavailable") {
    return t("expr.error.setModelPropertyUnavailable");
  }
  if (lower === "integral is only available in state node expressions") {
    return t("expr.error.integralOnlyStateNode");
  }
  if (lower === "empty integral expression") {
    return t("expr.error.emptyIntegralExpression");
  }
  if (lower === "integral derivative is unavailable") {
    return t("expr.error.integralDerivativeUnavailable");
  }
  if (lower === "integral value is unavailable") {
    return t("expr.error.integralValueUnavailable");
  }
  if (lower === "integral requires matching numeric state and derivative") {
    return t("expr.error.integralStateDerivativeMismatch");
  }
  if (lower === "operator arguments must have matching shapes" || lower === "function arguments must have matching shapes" || lower === "if arguments must have matching shapes" || lower === "tensor shape mismatch") {
    return t("expr.error.matchingShapes");
  }
  if (lower === "slice bounds must be integers") {
    return t("expr.error.sliceBoundsIntegers");
  }
  if (lower === "slice step must be a non-zero integer") {
    return t("expr.error.sliceStepNonZeroInteger");
  }
  if (lower === "indexing requires an array or matrix" || lower === "slicing requires an array or matrix") {
    return t("expr.error.indexingArrayOrMatrix");
  }
  if (lower === "matrix index must be a pair of integers") {
    return t("expr.error.matrixIndexPair");
  }
  if (lower === "matrix index requires a matrix target") {
    return t("expr.error.matrixIndexMatrixTarget");
  }
  if (lower === "matrix row index out of range") {
    return t("expr.error.matrixRowOutOfRange");
  }
  if (lower === "matrix column index out of range") {
    return t("expr.error.matrixColOutOfRange");
  }
  if (lower === "array index must be an integer or a [row, col] pair") {
    return t("expr.error.arrayIndexIntegerOrPair");
  }
  if (lower === "array index must be an integer") {
    return t("expr.error.arrayIndexInteger");
  }
  if (lower === "array index out of range") {
    return t("expr.error.arrayIndexOutOfRange");
  }
  if (lower === "member access requires an object or array") {
    return t("expr.error.memberAccessObjectOrArray");
  }
  if (lower === "missing reduce operator") {
    return t("expr.error.missingReduceOperator");
  }
  if (lower === "invalid reducer") {
    return t("expr.error.invalidReducer");
  }
  const reducerCallableMatch = raw.match(/^([A-Za-z_$][A-Za-z0-9_$]*) is not callable$/i);
  if (reducerCallableMatch) {
    return t("expr.error.notCallable", { name: reducerCallableMatch[1] });
  }
  if (lower === "reduce expects a vector or matrix" || lower === "sum expects a vector or matrix" || lower === "count expects a vector or matrix" || lower === "indiceswhere expects a vector or matrix" || lower === "size expects a vector or matrix" || lower === "average expects a vector or matrix" || lower === "stdev expects a vector or matrix") {
    const fn = raw.split(" ")[0];
    return t("expr.error.expectsVectorOrMatrix", { name: fn });
  }
  if (lower === "flatten expects a matrix" || lower === "neighbors expects a matrix") {
    const fn = raw.split(" ")[0];
    return t("expr.error.expectsMatrix", { name: fn });
  }
  if (lower === "sum expects a rectangular numeric matrix" || lower === "average expects a rectangular numeric matrix" || lower === "stdev expects a rectangular numeric matrix") {
    const fn = raw.split(" ")[0];
    return t("expr.error.expectsRectangularNumericMatrix", { name: fn });
  }
  if (lower === "count expects a rectangular matrix" || lower === "indiceswhere expects a rectangular matrix" || lower === "removeat expects a rectangular matrix" || lower === "setat expects a rectangular matrix" || lower === "size expects a rectangular matrix" || lower === "neighbors expects a rectangular matrix") {
    const fn = raw.split(" ")[0];
    return t("expr.error.expectsRectangularMatrix", { name: fn });
  }
  if (lower === "sum axis for matrices must be 0 or 1" || lower === "count axis for matrices must be 0 or 1" || lower === "size axis for matrices must be 0 or 1" || lower === "average axis for matrices must be 0 or 1" || lower === "stdev axis for matrices must be 0 or 1" || lower === "removeat axis for matrices must be 0 or 1" || lower === "reduce matrix axis must be 0 or 1") {
    const fn = raw.split(" ")[0];
    return t("expr.error.axisZeroOrOne", { name: fn });
  }
  if (lower === "size axis for vectors must be 0") {
    return t("expr.error.vectorAxisZero", { name: "size" });
  }
  if (lower === "reduce axis requires a matrix") {
    return t("expr.error.axisRequiresMatrix", { name: "reduce" });
  }
  if (lower === "reduce requires a non-empty vector when no initial value is provided") {
    return t("expr.error.reduceNeedsNonEmptyVector");
  }
  if (lower === "append expects a vector or matrix as first argument") {
    return t("expr.error.appendFirstArgVectorOrMatrix");
  }
  if (lower === "append on matrices expects a vector row as second argument") {
    return t("expr.error.appendSecondArgVectorRow");
  }
  if (lower === "append requires a rectangular matrix") {
    return t("expr.error.expectsRectangularMatrix", { name: "append" });
  }
  if (lower === "appended row length does not match matrix column count") {
    return t("expr.error.appendRowLength");
  }
  if (lower === "set expects a vector") {
    return t("expr.error.expectsVector", { name: "set" });
  }
  if (lower === "union expects two vectors" || lower === "intersection expects two vectors") {
    const fn = raw.split(" ")[0];
    return t("expr.error.expectsTwoVectors", { name: fn });
  }
  if (lower === "setat expects a vector or matrix" || lower === "removeat expects a vector or matrix") {
    const fn = raw.split(" ")[0];
    return t("expr.error.expectsVectorOrMatrix", { name: fn });
  }
  if (lower === "setat expects [row, col] for matrix cell replacement") {
    return t("expr.error.setAtPair");
  }
  if (lower === "setat expects a row vector with matching length") {
    return t("expr.error.setAtRowVectorLength");
  }
  if (lower === "removeat does not accept axis for vectors") {
    return t("expr.error.removeAtAxisVector");
  }
  const integerIndicesMatch = raw.match(/^([A-Za-z_$][A-Za-z0-9_$]*) expects integer indices$/i);
  if (integerIndicesMatch) {
    return t("expr.error.integerIndices", { name: integerIndicesMatch[1] });
  }
  const indexRangeMatch = raw.match(/^([A-Za-z_$][A-Za-z0-9_$]*) index out of range$/i);
  if (indexRangeMatch) {
    return t("expr.error.indexOutOfRange", { name: indexRangeMatch[1] });
  }
  if (lower === "average expects a non-empty vector" || lower === "stdev expects a non-empty vector") {
    const fn = raw.split(" ")[0];
    return t("expr.error.expectsNonEmptyVector", { name: fn });
  }
  if (lower === "average expects a non-empty matrix") {
    return t("expr.error.averageNonEmptyMatrix");
  }
  if (lower === "average expects non-empty matrix rows") {
    return t("expr.error.averageNonEmptyRows");
  }
  if (lower === "grid collision mode must be 'error', 'first', or 'sum'") {
    return t("expr.error.gridCollisionMode");
  }
  if (lower === "grid expects row and column vectors with the same length") {
    return t("expr.error.gridRowColSameLength");
  }
  if (lower === "grid expects type vector with the same length as row and column vectors") {
    return t("expr.error.gridTypeSameLength");
  }
  if (lower === "grid expects non-negative integer coordinates") {
    return t("expr.error.gridNonNegativeCoords");
  }
  const gridCollisionMatch = raw.match(/^grid collision at \[(\d+), (\d+)\]$/i);
  if (gridCollisionMatch) {
    return t("expr.error.gridCollisionAt", { row: gridCollisionMatch[1], col: gridCollisionMatch[2] });
  }
  if (lower === "grid sum mode expects numeric values on coincident coordinates") {
    return t("expr.error.gridSumNumeric");
  }
  if (lower === "filter mode must be 'elements', 'rows', or 'cols'") {
    return t("expr.error.filterMode");
  }
  if (lower === "filter mode 'rows' or 'cols' requires a matrix") {
    return t("expr.error.filterRowsColsMatrix");
  }
  if (lower === "filter mode 'rows' or 'cols' requires a rectangular matrix") {
    return t("expr.error.filterRowsColsRectMatrix");
  }
  if (lower === "map expects a vector or matrix") {
    return t("expr.error.expectsVectorOrMatrix", { name: "map" });
  }
  if (lower === "count conditional form expects a vector or matrix") {
    return t("expr.error.expectsVectorOrMatrix", { name: "count" });
  }
  if (lower === "indiceswhere conditional form expects a vector or matrix") {
    return t("expr.error.expectsVectorOrMatrix", { name: "indicesWhere" });
  }
  if (lower === "unsupported reducer operator +" || lower.startsWith("unsupported reducer operator ")) {
    return t("expr.error.unsupportedReducerOperator", { op: raw.replace(/^Unsupported reducer operator\s*/i, "") });
  }
  if (lower.startsWith("unsupported operator ")) {
    return t("expr.error.unsupportedOperator", { op: raw.replace(/^Unsupported operator\s*/i, "") });
  }
  if (lower.startsWith("unsupported ast node ")) {
    return t("expr.error.unsupportedAstNode", { kind: raw.replace(/^Unsupported AST node\s*/i, "") });
  }
  const expectedTokenMatch = raw.match(/^Expected '(.+)'$/i);
  if (expectedTokenMatch) {
    return t("expr.error.expectedToken", { token: expectedTokenMatch[1] });
  }
  if (lower === "open file picker not supported") {
    return t("expr.error.openPickerUnsupported");
  }
  if (lower === "save file picker not supported") {
    return t("expr.error.savePickerUnsupported");
  }
  if (lower.startsWith("duplicate input binding for ")) {
    return t("expr.error.duplicateInputBinding", { name: raw.replace(/^duplicate input binding for /i, "") });
  }
  if (lower.startsWith("missing submodel output ")) {
    return t("expr.error.missingSubmodelOutput", { name: raw.replace(/^missing submodel output /i, "") });
  }
  if (lower === "missing submodel path") {
    return t("error.submodelMissingPath");
  }
  if (lower === "submodel is not loaded") {
    return t("expr.error.submodelNotLoaded");
  }
  if (lower === "recursive submodel reference") {
    return t("error.submodelRecursiveReference");
  }
  return raw;
}

function validateExpressionDraft(value, fieldKey = null) {
  const text = String(value ?? "");
  const modalMeta = ui.expressionEditor ? expressionEditorMeta() : null;
  const meta = modalMeta || (fieldKey ? expressionFieldMeta(fieldKey) : null);
  const node = modalMeta
    ? getNodeById(ui.expressionEditor.nodeId)
    : selectedNodeForSidebar();
  if (!text.trim()) {
    if (graph.execution.strictDefinitions && meta && node) {
      if (meta.key === "initial" && isStateNode(node)) {
        return { ok: false, empty: true, message: nodeDefinitionIssueText({ reason: "missingInitialState" }) };
      }
      if (meta.key === "value") {
        if (isStateNode(node)) {
          return { ok: false, empty: true, message: nodeDefinitionIssueText({ reason: "missingTransition" }) };
        }
        if (node.shape === "diamond") {
          return { ok: false, empty: true, message: nodeDefinitionIssueText({ reason: "missingValue" }) };
        }
        if (!hasInputWidgetBinding(node)) {
          return { ok: false, empty: true, message: nodeDefinitionIssueText({ reason: "missingBehavior" }) };
        }
      }
    }
    return { ok: true, empty: true };
  }
  const allowStateTransitionOnly = Boolean(meta && meta.key === "value" && node && isStateNode(node));
  const extraNames = [];
  if (node) {
    graph.edges
      .filter((edge) => edge.to === node.id)
      .map((edge) => getNodeById(edge.from))
      .filter(Boolean)
      .filter((depNode) => (meta?.key !== "initial") || depNode.shape === "diamond")
      .forEach((depNode) => {
        extraNames.push(depNode.name);
      });
  }
  const result = semantics.validateExpressionSyntax(text, extraNames, {
    allowThisAlias: allowStateTransitionOnly,
    allowIntegral: allowStateTransitionOnly,
  });
  return result.ok
    ? { ok: true, empty: false }
    : { ok: false, empty: false, message: localizeExpressionErrorMessage(result.message || t("error.evalReason.syntax")) };
}

function updateExpressionFieldState(inputEl, statusEl, value, showOk = false, fieldKey = null) {
  if (!inputEl) {
    return { ok: true, empty: true };
  }
  const syntaxResult = validateExpressionDraft(value, fieldKey);
  inputEl.classList.toggle("invalid", !syntaxResult.ok);
  showExpressionStatus(statusEl, syntaxResult, showOk);
  return syntaxResult;
}

function validateNodeDefinition(node) {
  if (!node) {
    return { ok: true };
  }
  const validateExpr = (value, fieldKey, options = {}) => {
    const extraNames = [];
    graph.edges
      .filter((edge) => edge.to === node.id)
      .map((edge) => getNodeById(edge.from))
      .filter(Boolean)
      .filter((depNode) => fieldKey !== "initial" || depNode.shape === "diamond")
      .forEach((depNode) => {
        extraNames.push(depNode.name);
      });
    return semantics.validateExpressionSyntax(String(value ?? ""), extraNames, options);
  };
  const valueExpr = String(node.valueExpression ?? "");
  const initialExpr = String(node.initialStateExpression ?? "");

  if (isSubmodelNode(node)) {
    if (!String(node.modelPath ?? "").trim()) {
      return { ok: false, reason: "missingSubmodelPath" };
    }
    if (String(node.submodelError ?? "").trim()) {
      return { ok: false, reason: "invalidSubmodelPath", message: String(node.submodelError ?? "") };
    }
    return { ok: true };
  }

  if (isStateNode(node)) {
    if (!valueExpr.trim()) {
      return { ok: false, reason: "missingTransition" };
    }
    const transitionResult = validateExpr(valueExpr, "value", { allowThisAlias: true, allowIntegral: true });
    if (!transitionResult.ok) {
      return { ok: false, reason: "invalidTransition", message: transitionResult.message || "" };
    }
    if (!initialExpr.trim()) {
      return { ok: false, reason: "missingInitialState" };
    }
    const initialResult = validateExpr(initialExpr, "initial");
    if (!initialResult.ok) {
      return { ok: false, reason: "invalidInitialState", message: initialResult.message || "" };
    }
    return { ok: true };
  }

  if (hasInputWidgetBinding(node)) {
    return { ok: true };
  }
  if (!valueExpr.trim()) {
    return { ok: false, reason: node.shape === "diamond" ? "missingValue" : "missingBehavior" };
  }
  const result = validateExpr(valueExpr, "value");
  if (!result.ok) {
    return { ok: false, reason: node.shape === "diamond" ? "invalidValue" : "invalidBehavior", message: result.message || "" };
  }
  return { ok: true };
}

function invalidDefinedNodes() {
  return graph.nodes
    .map((node) => ({ node, issue: validateNodeDefinition(node) }))
    .filter((entry) => !entry.issue.ok);
}

function nodeDefinitionIssueText(issue) {
  if (!issue || issue.ok) {
    return "";
  }
  if (issue.reason === "missingBehavior") {
    return t("error.nodeDefinition.missingBehavior");
  }
  if (issue.reason === "invalidBehavior") {
    return t("error.nodeDefinition.invalidBehavior", { reason: localizeExpressionErrorMessage(issue.message || "") });
  }
  if (issue.reason === "missingValue") {
    return t("error.nodeDefinition.missingValue");
  }
  if (issue.reason === "invalidValue") {
    return t("error.nodeDefinition.invalidValue", { reason: localizeExpressionErrorMessage(issue.message || "") });
  }
  if (issue.reason === "missingTransition") {
    return t("error.nodeDefinition.missingTransition");
  }
  if (issue.reason === "invalidTransition") {
    return t("error.nodeDefinition.invalidTransition", { reason: localizeExpressionErrorMessage(issue.message || "") });
  }
  if (issue.reason === "missingInitialState") {
    return t("error.nodeDefinition.missingInitialState");
  }
  if (issue.reason === "invalidInitialState") {
    return t("error.nodeDefinition.invalidInitialState", { reason: localizeExpressionErrorMessage(issue.message || "") });
  }
  if (issue.reason === "missingSubmodelPath") {
    return t("error.nodeDefinition.missingSubmodelPath");
  }
  if (issue.reason === "invalidSubmodelPath") {
    return t("error.nodeDefinition.invalidSubmodelPath", { reason: issue.message || "" });
  }
  return t("error.evalReason.runtime");
}

function enforceStrictDefinitionsIfNeeded() {
  if (!graph.execution.strictDefinitions) {
    return true;
  }
  const invalidNodes = invalidDefinedNodes();
  if (!invalidNodes.length) {
    return true;
  }
  invalidNodes.forEach(({ node }) => {
    node.computedValue = null;
    node.computedError = "";
    node.pendingStateValue = null;
    node.pendingStateError = "";
  });
  const first = invalidNodes[0];
  setStatusKey("error.strictDefinitionsBlocked", {
    count: invalidNodes.length,
    node: first.node.name,
    reason: nodeDefinitionIssueText(first.issue),
  });
  render();
  return false;
}

function clearStrictInvalidNodeValues() {
  if (!graph.execution.strictDefinitions) {
    return;
  }
  invalidDefinedNodes().forEach(({ node }) => {
    node.computedValue = null;
    node.computedError = "";
    node.pendingStateValue = null;
    node.pendingStateError = "";
  });
}

function hasStrictExecutionBlock() {
  return Boolean(graph.execution.strictDefinitions && invalidDefinedNodes().length > 0);
}

function selectedNodeForSidebar() {
  if (ui.selectedNodes.size !== 1) {
    return null;
  }
  const nodeId = [...ui.selectedNodes][0];
  return getNodeById(nodeId) || null;
}

function expressionFieldMeta(fieldKey, node = selectedNodeForSidebar()) {
  if (!node) {
    return null;
  }
  if (fieldKey === "value") {
    const title = node.shape === "diamond"
      ? t("label.value")
      : (isStateNode(node) ? t("label.stateTransition") : t("label.behaviorFunction"));
    return {
      key: "value",
      title,
      value: String(node.valueExpression ?? ""),
      setValue: (nextValue) => {
        node.valueExpression = String(nextValue ?? "");
      },
      inputEl: nodeValueExprInput,
      statusEl: nodeValueExprStatus,
    };
  }
  if (fieldKey === "initial" && isStateNode(node)) {
    return {
      key: "initial",
      title: t("label.initialState"),
      value: String(node.initialStateExpression ?? ""),
      setValue: (nextValue) => {
        node.initialStateExpression = String(nextValue ?? "");
      },
      inputEl: nodeInitialStateInput,
      statusEl: nodeInitialStateStatus,
    };
  }
  return null;
}

function expressionEditorMeta() {
  if (!ui.expressionEditor) {
    return null;
  }
  const node = getNodeById(ui.expressionEditor.nodeId);
  return expressionFieldMeta(ui.expressionEditor.fieldKey, node);
}

function effectiveExpressionEditorFieldForNode(node, preferredFieldKey) {
  if (!node) {
    return null;
  }
  if (expressionFieldMeta(preferredFieldKey, node)) {
    return preferredFieldKey;
  }
  if (preferredFieldKey !== "value" && expressionFieldMeta("value", node)) {
    return "value";
  }
  return null;
}

function syncExpressionEditorToSelectedNode() {
  if (!ui.expressionEditor || ui.expressionEditor.fieldKey === "__custom__" || !expressionEditorTextarea || !expressionEditorTitle) {
    return;
  }
  const selectedNode = selectedNodeForSidebar();
  if (!selectedNode) {
    return;
  }
  const nextFieldKey = effectiveExpressionEditorFieldForNode(selectedNode, ui.expressionEditor.fieldKey);
  if (!nextFieldKey) {
    return;
  }
  if (ui.expressionEditor.nodeId === selectedNode.id && ui.expressionEditor.fieldKey === nextFieldKey) {
    return;
  }
  const meta = expressionFieldMeta(nextFieldKey, selectedNode);
  if (!meta) {
    return;
  }
  ui.expressionEditor.nodeId = selectedNode.id;
  ui.expressionEditor.fieldKey = meta.key;
  ui.expressionEditor.baseTitle = meta.title;
  ui.expressionEditor.initialValue = meta.value;
  ui.expressionEditor.syntaxOk = true;
  expressionEditorTitle.textContent = meta.title;
  expressionEditorTextarea.value = meta.value;
  refreshExpressionEditorValidation();
}

function expressionDocMap() {
  const docs = window.GraphFunctions?.expressionDocs || globalThis.GraphFunctions?.expressionDocs;
  if (!docs) {
    return {};
  }
  const out = {};
  const appendEntries = (entries) => {
    Object.entries(entries || {}).forEach(([name, entry]) => {
      out[name] = {
        ...entry,
        name,
        description: t(entry.descriptionKey),
      };
    });
  };
  appendEntries(docs.variables);
  appendEntries(docs.functions);
  return out;
}

function globalHelpEntries() {
  const docs = expressionDocMap();
  return Object.keys(docs).map((name) => ({ name, ...docs[name] }));
}

function helpGroupLabel(kind) {
  if (kind === "variable") {
    return t("help.group.variables");
  }
  if (kind === "array") {
    return t("help.group.array");
  }
  if (kind === "probability") {
    return t("help.group.probability");
  }
  if (kind === "math") {
    return t("help.group.math");
  }
  return t("help.group.functions");
}

function renderFunctionsHelp() {
  if (!functionsHelpContent) {
    return;
  }
  functionsHelpContent.innerHTML = "";
  const groups = new Map();
  globalHelpEntries().forEach((entry) => {
    const key = entry.kind || "function";
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(entry);
  });

  ["variable", "function", "array", "probability", "math"].forEach((kind) => {
    const entries = (groups.get(kind) || []).slice().sort((left, right) => left.name.localeCompare(right.name));
    if (!entries || !entries.length) {
      return;
    }
    const group = document.createElement("section");
    group.className = "help-group";
    const title = document.createElement("h4");
    title.className = "help-group-title";
    title.textContent = helpGroupLabel(kind);
    group.appendChild(title);

    entries.forEach((entry) => {
      const item = document.createElement("div");
      item.className = "help-item";
      const name = document.createElement("div");
      name.className = "help-item-name";
      name.textContent = entry.name;
      const signature = document.createElement("div");
      signature.className = "help-item-signature";
      signature.textContent = entry.signature || entry.name;
      const desc = document.createElement("div");
      desc.className = "help-item-desc";
      desc.textContent = entry.description || "";
      item.appendChild(name);
      item.appendChild(signature);
      item.appendChild(desc);
      group.appendChild(item);
    });
    functionsHelpContent.appendChild(group);
  });
}

function renderExpressionLibrary() {
  if (!expressionLibrary) {
    return;
  }
  const entries = expressionCatalogForEditor();
  const manualFilter = String(expressionSymbolsFilter?.value || "").trim().toLowerCase();
  const autoFilter = String(ui.expressionEditor?.autoFilter || "").trim().toLowerCase();
  const filter = manualFilter || autoFilter;
  const selectedName = String(ui.expressionEditor?.librarySelectedName || "").trim();
  const filteredEntries = entries
    .filter((entry) => {
      if (!filter) {
        return true;
      }
      return entry.name.toLowerCase().includes(filter);
    })
    .sort((left, right) => {
      const leftName = left.name.toLowerCase();
      const rightName = right.name.toLowerCase();
      const leftStarts = filter ? leftName.startsWith(filter) : false;
      const rightStarts = filter ? rightName.startsWith(filter) : false;
      if (leftStarts !== rightStarts) {
        return leftStarts ? -1 : 1;
      }
      const kindDelta = expressionEntryKindOrder(left.kind) - expressionEntryKindOrder(right.kind);
      return kindDelta || left.name.localeCompare(right.name);
    });
  if (!selectedName && filteredEntries.length > 0 && ui.expressionEditor) {
    ui.expressionEditor.librarySelectedName = filteredEntries[0].name;
  } else if (selectedName && !filteredEntries.some((entry) => entry.name === selectedName) && ui.expressionEditor) {
    ui.expressionEditor.librarySelectedName = filteredEntries[0]?.name || "";
  }
  const effectiveSelectedName = String(ui.expressionEditor?.librarySelectedName || "").trim();

  expressionLibrary.innerHTML = "";
  expressionSidebar?.classList.remove("hidden");
  const groups = new Map();
  filteredEntries.forEach((entry) => {
    const key = entry.kind || "function";
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(entry);
  });
  const visibleEntries = [];
  Array.from(groups.keys())
    .sort((left, right) => expressionEntryKindOrder(left) - expressionEntryKindOrder(right))
    .forEach((kind) => {
      const group = document.createElement("section");
      group.className = "expression-library-group";
      const title = document.createElement("h4");
      title.className = "expression-library-title";
      title.textContent = t(`expr.help.kind.${kind}`);
      const list = document.createElement("div");
      list.className = "expression-library-list";
      groups.get(kind)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((entry) => {
          visibleEntries.push(entry);
          const item = document.createElement("div");
          item.className = "expression-library-item";
          item.classList.toggle("active", entry.name === effectiveSelectedName);
          item.dataset.entryName = entry.name;
          item.tabIndex = 0;
          const name = document.createElement("div");
          name.className = "expression-library-name";
          if (filter) {
            const lowerName = entry.name.toLowerCase();
            const idx = lowerName.indexOf(filter);
            if (idx >= 0) {
              const before = entry.name.slice(0, idx);
              const match = entry.name.slice(idx, idx + filter.length);
              const after = entry.name.slice(idx + filter.length);
              if (before) {
                name.appendChild(document.createTextNode(before));
              }
              const mark = document.createElement("mark");
              mark.textContent = match;
              name.appendChild(mark);
              if (after) {
                name.appendChild(document.createTextNode(after));
              }
            } else {
              name.textContent = entry.name;
            }
          } else {
            name.textContent = entry.name;
          }
          item.appendChild(name);
          const selectEntry = () => {
            setSelectedLibraryEntry(entry.name, entry);
          };
          const activate = () => {
            selectEntry();
            insertSelectedLibraryEntry();
          };
          item.addEventListener("mousedown", (evt) => {
            evt.preventDefault();
          });
          item.addEventListener("click", (evt) => {
            if (evt.shiftKey) {
              selectEntry();
              insertExpressionAtCursor("\n");
              refreshExpressionEditorValidation();
              return;
            }
            if (evt.detail >= 2) {
              activate();
              return;
            }
            selectEntry();
          });
          item.addEventListener("keydown", (evt) => {
            if (evt.key === "Enter") {
              evt.preventDefault();
              activate();
            } else if (evt.key === " ") {
              evt.preventDefault();
              selectEntry();
            }
          });
          item.addEventListener("focus", () => {
            selectEntry();
          });
          list.appendChild(item);
        });
      group.appendChild(title);
      group.appendChild(list);
      expressionLibrary.appendChild(group);
    });
  expressionLibrary.classList.remove("hidden");
  if (!groups.size) {
    const empty = document.createElement("div");
    empty.className = "empty-props";
    empty.textContent = t("text.noMatches");
    expressionLibrary.appendChild(empty);
    return;
  }
  if (effectiveSelectedName) {
    window.requestAnimationFrame(() => {
      const active = expressionLibrary.querySelector(`.expression-library-item[data-entry-name="${CSS.escape(effectiveSelectedName)}"]`);
      active?.scrollIntoView({ block: "nearest" });
    });
  }
}

function setSelectedLibraryEntry(name, entry = null) {
  if (!ui.expressionEditor || !expressionLibrary) {
    return;
  }
  const nextName = String(name || "").trim();
  if (!nextName) {
    return;
  }
  ui.expressionEditor.librarySelectedName = nextName;
  const resolvedEntry = entry || expressionCatalogForEditor().find((item) => item.name === nextName) || null;
  if (resolvedEntry) {
    setExpressionHelp(resolvedEntry);
  }
  expressionLibrary.querySelectorAll(".expression-library-item.active").forEach((item) => {
    item.classList.remove("active");
  });
  const active = expressionLibrary.querySelector(`.expression-library-item[data-entry-name="${CSS.escape(nextName)}"]`);
  if (active) {
    active.classList.add("active");
    active.scrollIntoView({ block: "nearest" });
  }
}

function openFunctionsHelp() {
  if (!functionsHelpModal) {
    return;
  }
  renderFunctionsHelp();
  functionsHelpModal.classList.remove("hidden");
}

function closeFunctionsHelp() {
  if (!functionsHelpModal) {
    return;
  }
  functionsHelpModal.classList.add("hidden");
}

function openAboutApp() {
  if (!aboutAppModal) {
    return;
  }
  aboutAppModal.classList.remove("hidden");
}

function closeAboutApp() {
  if (!aboutAppModal) {
    return;
  }
  aboutAppModal.classList.add("hidden");
}

function expressionEditorHasUnsavedChanges() {
  return Boolean(
    ui.expressionEditor
    && ui.expressionEditor.fieldKey !== "__custom__"
    && expressionEditorTextarea
    && expressionEditorTextarea.value !== String(ui.expressionEditor.initialValue ?? ""),
  );
}

function openExpressionEditorSwitchModal() {
  if (!expressionEditorSwitchModal) {
    return;
  }
  expressionEditorSwitchModal.classList.remove("hidden");
  if (expressionEditorSwitchApplyBtn) {
    expressionEditorSwitchApplyBtn.disabled = !Boolean(ui.expressionEditor?.syntaxOk);
  }
  (expressionEditorSwitchApplyBtn && !expressionEditorSwitchApplyBtn.disabled
    ? expressionEditorSwitchApplyBtn
    : expressionEditorSwitchCancelBtn)?.focus();
}

function closeExpressionEditorSwitchModal() {
  if (!expressionEditorSwitchModal) {
    return;
  }
  expressionEditorSwitchModal.classList.add("hidden");
  ui.expressionEditorPendingSelectionAction = null;
  expressionEditorTextarea?.focus();
}

function currentExpressionEditorSelectionKey() {
  if (!ui.expressionEditor || ui.expressionEditor.fieldKey === "__custom__" || !ui.expressionEditor.nodeId) {
    return "";
  }
  return `node:${ui.expressionEditor.nodeId}`;
}

function requestExpressionEditorSelectionChange(action, nextSelectionKey = "") {
  if (typeof action !== "function") {
    return false;
  }
  if (nextSelectionKey && nextSelectionKey === currentExpressionEditorSelectionKey()) {
    action();
    return true;
  }
  if (!expressionEditorHasUnsavedChanges()) {
    action();
    return true;
  }
  ui.expressionEditorPendingSelectionAction = action;
  openExpressionEditorSwitchModal();
  return false;
}

function runPendingExpressionEditorSelectionAction() {
  const action = ui.expressionEditorPendingSelectionAction;
  closeExpressionEditorSwitchModal();
  if (typeof action === "function") {
    action();
  }
}

function expressionCatalogForEditor() {
  const meta = expressionEditorMeta();
  if (!meta) {
    return [];
  }
  const docs = expressionDocMap();
  const node = getNodeById(ui.expressionEditor.nodeId);
  const allowStateAliases = Boolean(meta.key === "value" && node && isStateNode(node));
  const out = [];
  const seen = new Set();
  const pushEntry = (name, entry) => {
    if (!name || seen.has(name)) {
      return;
    }
    seen.add(name);
    out.push({ name, ...entry });
  };

  Object.entries(docs).forEach(([name, entry]) => {
    if (name === "integral" && !allowStateAliases) {
      return;
    }
    if (name === "this" && !allowStateAliases) {
      return;
    }
    pushEntry(name, entry);
  });

  if (node) {
    pushEntry("self", {
      kind: "variable",
      signature: "self",
      description: t("expr.help.self"),
      insertText: "self",
      cursorOffset: 4,
    });
  }

  if ((meta.key === "value" || meta.key === "initial") && node) {
    graph.edges
      .filter((edge) => edge.to === node.id)
      .map((edge) => getNodeById(edge.from))
      .filter(Boolean)
      .filter((depNode) => meta.key !== "initial" || depNode.shape === "diamond")
      .forEach((depNode) => {
        const nodeDescription = getNodeDescription(depNode);
        pushEntry(depNode.name, {
          kind: "variable",
          signature: depNode.name,
          description: nodeDescription || depNode.name,
          insertText: depNode.name,
          cursorOffset: depNode.name.length,
        });
        if (meta.key === "value" && isSubmodelNode(depNode)) {
          const outputs = Array.isArray(depNode.interfaceCache?.outputs)
            ? depNode.interfaceCache.outputs.map((value) => String(value).trim()).filter(Boolean)
            : [];
          outputs.forEach((outputName) => {
            const qualifiedName = `${depNode.name}.${outputName}`;
            pushEntry(qualifiedName, {
              kind: "variable",
              signature: qualifiedName,
              description: nodeDescription
                ? `${nodeDescription} · ${t("text.submodelOutputEntry", { node: depNode.name, output: outputName })}`
                : t("text.submodelOutputEntry", { node: depNode.name, output: outputName }),
              insertText: qualifiedName,
              cursorOffset: qualifiedName.length,
            });
          });
        }
      });
  }

  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function expressionEntryKindOrder(kind) {
  switch (kind) {
    case "variable":
      return 0;
    case "function":
      return 1;
    case "array":
      return 2;
    case "probability":
      return 3;
    case "property":
      return 4;
    case "math":
      return 5;
    case "node":
      return 6;
    default:
      return 99;
  }
}

function identifierPrefixAtCaret(text, caret) {
  const src = String(text ?? "");
  const pos = Math.max(0, Math.min(caret, src.length));
  let start = pos;
  while (start > 0 && /[A-Za-z0-9_$]/.test(src[start - 1])) {
    start -= 1;
  }
  const prefix = src.slice(start, pos);
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(prefix) ? { start, end: pos, prefix } : null;
}

function identifierAtCaret(text, caret) {
  const src = String(text ?? "");
  const pos = Math.max(0, Math.min(caret, src.length));
  let start = pos;
  while (start > 0 && /[A-Za-z0-9_$]/.test(src[start - 1])) {
    start -= 1;
  }
  let end = pos;
  while (end < src.length && /[A-Za-z0-9_$]/.test(src[end])) {
    end += 1;
  }
  const name = src.slice(start, end);
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : "";
}

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function expressionTokenClass(name, entryMap) {
  if (name === "true" || name === "false" || name === "null") {
    return "expression-token-keyword";
  }
  if (/^\$[0-9]+$/u.test(name) || name === "$value") {
    return "expression-token-variable";
  }
  const entry = entryMap.get(name);
  if (!entry) {
    return "";
  }
  if (entry.kind === "variable") {
    return entry.name?.includes(".") ? "expression-token-node" : "expression-token-variable";
  }
  return "expression-token-function";
}

function expressionBracketStateMap(text, caret) {
  const src = String(text ?? "");
  const stack = [];
  const pairs = new Map();
  const unmatched = new Set();
  const openingFor = { ")": "(", "]": "[", "}": "{" };
  const closingFor = { "(": ")", "[": "]", "{": "}" };

  let inString = false;
  let stringQuote = "";
  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];
    const prev = src[i - 1];
    if (inString) {
      if (ch === stringQuote && prev !== "\\") {
        inString = false;
        stringQuote = "";
      }
      continue;
    }
    if (ch === "\"" || ch === "'") {
      inString = true;
      stringQuote = ch;
      continue;
    }
    if (closingFor[ch]) {
      stack.push({ ch, index: i });
      continue;
    }
    if (openingFor[ch]) {
      const last = stack.pop();
      if (last && last.ch === openingFor[ch]) {
        pairs.set(last.index, i);
        pairs.set(i, last.index);
      } else {
        unmatched.add(i);
        if (last) {
          unmatched.add(last.index);
        }
      }
    }
  }
  stack.forEach((item) => unmatched.add(item.index));

  const candidateIndexes = [];
  if (caret > 0) {
    candidateIndexes.push(caret - 1);
  }
  if (caret < src.length) {
    candidateIndexes.push(caret);
  }
  const active = new Set();
  for (const idx of candidateIndexes) {
    const ch = src[idx];
    if (!"()[]{}".includes(ch)) {
      continue;
    }
    active.add(idx);
    if (pairs.has(idx)) {
      active.add(pairs.get(idx));
    }
    break;
  }
  return { active, unmatched };
}

function renderExpressionHighlight() {
  if (!expressionEditorHighlight || !expressionEditorTextarea) {
    return;
  }
  const text = expressionEditorTextarea.value || "";
  const caret = expressionEditorTextarea.selectionStart ?? 0;
  const bracketState = expressionBracketStateMap(text, caret);
  const catalogMap = new Map(expressionCatalogForEditor().map((entry) => [entry.name, entry]));
  let out = "";
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (ch === "\n") {
      out += "\n";
      i += 1;
      continue;
    }

    if (/\s/u.test(ch)) {
      let j = i + 1;
      while (j < text.length && /\s/u.test(text[j]) && text[j] !== "\n") {
        j += 1;
      }
      out += escapeHtml(text.slice(i, j));
      i = j;
      continue;
    }

    if (ch === "\"" || ch === "'") {
      let j = i + 1;
      while (j < text.length) {
        if (text[j] === ch && text[j - 1] !== "\\") {
          j += 1;
          break;
        }
        j += 1;
      }
      out += `<span class="expression-token-string">${escapeHtml(text.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    if (/[0-9]/u.test(ch) || (ch === "." && /[0-9]/u.test(text[i + 1] || ""))) {
      let j = i + 1;
      while (j < text.length && /[0-9._eE]/u.test(text[j])) {
        j += 1;
      }
      out += `<span class="expression-token-number">${escapeHtml(text.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    if (/[A-Za-z_$]/u.test(ch)) {
      let j = i + 1;
      while (j < text.length && /[A-Za-z0-9_$]/u.test(text[j])) {
        j += 1;
      }
      const name = text.slice(i, j);
      const cls = expressionTokenClass(name, catalogMap);
      out += cls ? `<span class="${cls}">${escapeHtml(name)}</span>` : escapeHtml(name);
      i = j;
      continue;
    }

    if ("()[]{}".includes(ch)) {
      const classes = ["expression-token-bracket"];
      if (bracketState.unmatched.has(i)) {
        classes.push("expression-token-bracket-unmatched");
      } else if (bracketState.active.has(i)) {
        classes.push("expression-token-bracket-active");
      }
      out += `<span class="${classes.join(" ")}">${escapeHtml(ch)}</span>`;
      i += 1;
      continue;
    }

    if (/[+\-*/%=!<>?:&,.;|^~]/u.test(ch)) {
      out += `<span class="expression-token-operator">${escapeHtml(ch)}</span>`;
      i += 1;
      continue;
    }

    out += escapeHtml(ch);
    i += 1;
  }

  expressionEditorHighlight.innerHTML = `${out || " "}\n`;
  expressionEditorHighlight.classList.toggle("invalid", expressionEditorTextarea.classList.contains("invalid"));
  expressionEditorHighlight.scrollTop = expressionEditorTextarea.scrollTop;
  expressionEditorHighlight.scrollLeft = expressionEditorTextarea.scrollLeft;
}

function setExpressionHelp(entry = null) {
  if (!expressionHelp) {
    return;
  }
  if (!entry) {
    expressionHelp.textContent = t("expr.help.empty");
    return;
  }
  const kindKey = `expr.help.kind.${entry.kind || "function"}`;
  const kindLabel = t(kindKey);
  const lines = [
    `${entry.name}  (${kindLabel})`,
    entry.signature || entry.name,
    entry.description || "",
  ].filter(Boolean);
  expressionHelp.textContent = lines.join("\n");
  const preview = expressionValuePreviewForEntry(entry);
  if (!preview) {
    return;
  }
  const valueEl = document.createElement("div");
  valueEl.className = `expression-help-value${preview.error ? " error" : ""}`;
  valueEl.textContent = `${t("expr.preview.title")}: ${preview.text}`;
  expressionHelp.appendChild(valueEl);
  if (preview.typeLabel) {
    const typeEl = document.createElement("div");
    typeEl.className = "expression-help-type";
    typeEl.textContent = `${t("expr.preview.type")}: ${preview.typeLabel}`;
    expressionHelp.appendChild(typeEl);
  }
}

function expressionValuePreviewForEntry(entry) {
  if (!entry) {
    return null;
  }
  const previewState = getExpressionPreviewInitializationState();
  const { context: baseContext, node } = buildExpressionPreviewBaseContext(previewState);

  if (entry.kind === "variable") {
    if (entry.name === "this" && node && isStateNode(node)) {
      const selfValue = node.computedValue;
      if (selfValue == null) {
        return { text: t("expr.preview.unavailableState"), error: true };
      }
      return {
        text: summarizeExpressionPreviewValue(selfValue),
        typeLabel: describeExpressionPreviewShape(selfValue),
        error: false,
      };
    }
    if (entry.name === "self" && node) {
      let selfValue = node.computedValue;
      if (selfValue == null && isStateNode(node)) {
        const initialPreview = evaluateInitialStatePreviewValue(node, previewState.globals, previewState.model);
        if (initialPreview.ok) {
          selfValue = initialPreview.value;
        }
      }
      if (selfValue == null) {
        return { text: t("expr.preview.unavailableState"), error: true };
      }
      if (Array.isArray(selfValue)) {
        return {
          text: summarizeExpressionPreviewValue(selfValue[0]),
          typeLabel: describeExpressionPreviewShape(selfValue[0]),
          error: false,
        };
      }
      return {
        text: summarizeExpressionPreviewValue(selfValue),
        typeLabel: describeExpressionPreviewShape(selfValue),
        error: false,
      };
    }
    if (Object.prototype.hasOwnProperty.call(baseContext, entry.name)) {
      return {
        text: summarizeExpressionPreviewValue(baseContext[entry.name]),
        typeLabel: describeExpressionPreviewShape(baseContext[entry.name]),
        error: false,
      };
    }
    return null;
  }
  return null;
}

function renderExpressionAutocomplete() {
  if (!expressionEditorTextarea) {
    return;
  }
  if (!ui.expressionEditor) {
    setExpressionHelp(null);
    return;
  }

  const caret = expressionEditorTextarea.selectionStart ?? 0;
  const tokenInfo = identifierPrefixAtCaret(expressionEditorTextarea.value, caret);
  const exactToken = identifierAtCaret(expressionEditorTextarea.value, caret);
  const allEntries = expressionCatalogForEditor();
  ui.expressionEditor.catalog = allEntries;
  ui.expressionEditor.autoFilter = tokenInfo?.prefix || exactToken || "";

  let helpEntry = null;
  if (tokenInfo && tokenInfo.prefix.length > 0) {
    const prefixLower = tokenInfo.prefix.toLowerCase();
    const suggestions = allEntries
      .filter((entry) => entry.name.toLowerCase().startsWith(prefixLower) && entry.name !== tokenInfo.prefix)
      .sort((left, right) => {
        const kindDelta = expressionEntryKindOrder(left.kind) - expressionEntryKindOrder(right.kind);
        return kindDelta || left.name.localeCompare(right.name);
      });
    ui.expressionEditor.completion = {
      tokenStart: tokenInfo.start,
      tokenEnd: tokenInfo.end,
      entries: suggestions.slice(0, 8),
      activeIndex: 0,
    };
    if (ui.expressionEditor.completion.entries.length > 0) {
      if (!exactToken) {
        helpEntry = ui.expressionEditor.completion.entries[ui.expressionEditor.completion.activeIndex] || null;
      }
    } else {
      ui.expressionEditor.completion = null;
    }
  } else {
    ui.expressionEditor.completion = null;
  }

  if (!helpEntry) {
    if (exactToken) {
      helpEntry = allEntries.find((entry) => entry.name === exactToken) || null;
    }
  }
  const preferred = exactToken
    ? (allEntries.find((entry) => entry.name === exactToken) || null)
    : (ui.expressionEditor.completion?.entries?.[ui.expressionEditor.completion.activeIndex] || null);
  if (preferred && ui.expressionEditor.librarySelectedName !== preferred.name) {
    ui.expressionEditor.librarySelectedName = preferred.name;
  }
  if (!helpEntry && ui.expressionEditor?.librarySelectedName) {
    helpEntry = allEntries.find((entry) => entry.name === ui.expressionEditor.librarySelectedName) || null;
  }
  setExpressionHelp(helpEntry);
  renderExpressionLibrary();
}

function insertSelectedLibraryEntry() {
  if (!ui.expressionEditor || !expressionEditorTextarea) {
    return false;
  }
  const selectedName = String(ui.expressionEditor.librarySelectedName || "").trim();
  if (!selectedName) {
    return false;
  }
  const entry = expressionCatalogForEditor().find((item) => item.name === selectedName);
  if (!entry) {
    return false;
  }
  const replacement = entry.insertText || entry.name;
  const caret = expressionEditorTextarea.selectionStart ?? 0;
  const tokenInfo = identifierPrefixAtCaret(expressionEditorTextarea.value, caret);
  const tokenAtCaret = identifierAtCaret(expressionEditorTextarea.value, caret);
  if (tokenInfo && (tokenInfo.prefix || tokenAtCaret)) {
    const tokenEnd = tokenInfo.end + Math.max(0, tokenAtCaret.length - tokenInfo.prefix.length);
    const before = expressionEditorTextarea.value.slice(0, tokenInfo.start);
    const after = expressionEditorTextarea.value.slice(tokenEnd);
    expressionEditorTextarea.value = `${before}${replacement}${after}`;
    const nextCaret = tokenInfo.start + (entry.cursorOffset ?? replacement.length);
    expressionEditorTextarea.focus();
    expressionEditorTextarea.setSelectionRange(nextCaret, nextCaret);
  } else {
    insertExpressionSnippet(replacement, entry.cursorOffset ?? replacement.length);
  }
  refreshExpressionEditorValidation();
  return true;
}

function insertExpressionSnippet(snippet, cursorOffset = null) {
  if (!expressionEditorTextarea) {
    return false;
  }
  const value = expressionEditorTextarea.value;
  const start = expressionEditorTextarea.selectionStart ?? 0;
  const end = expressionEditorTextarea.selectionEnd ?? start;
  const text = String(snippet ?? "");
  expressionEditorTextarea.value = `${value.slice(0, start)}${text}${value.slice(end)}`;
  const caret = start + (cursorOffset == null ? text.length : cursorOffset);
  expressionEditorTextarea.focus();
  expressionEditorTextarea.setSelectionRange(caret, caret);
  refreshExpressionEditorValidation();
  return true;
}

function visibleLibraryEntryNames() {
  if (!expressionLibrary) {
    return [];
  }
  return Array.from(expressionLibrary.querySelectorAll(".expression-library-item[data-entry-name]"))
    .map((item) => String(item.dataset.entryName || "").trim())
    .filter(Boolean);
}

function moveLibrarySelection(direction) {
  if (!ui.expressionEditor) {
    return false;
  }
  const names = visibleLibraryEntryNames();
  if (!names.length) {
    return false;
  }
  const current = String(ui.expressionEditor.librarySelectedName || "").trim();
  const currentIndex = Math.max(0, names.indexOf(current));
  const nextIndex = (currentIndex + direction + names.length) % names.length;
  setSelectedLibraryEntry(names[nextIndex]);
  return true;
}

function resetExpressionEditorCardPosition() {
  const card = expressionEditorModal?.querySelector(".expression-editor-card");
  if (!card) {
    return;
  }
  card.style.width = "";
  card.style.height = "";
  card.style.left = "50%";
  card.style.top = "50%";
  card.style.transform = "translate(-50%, -50%)";
}

function clearExpressionPreviewTimer() {
  if (ui.expressionPreviewTimer != null) {
    window.clearTimeout(ui.expressionPreviewTimer);
    ui.expressionPreviewTimer = null;
  }
}

function invalidateExpressionPreviewInitializationCache() {
  ui.expressionPreviewInitCache = null;
}

function setExpressionPreviewState(text, tone = "") {
  if (!expressionPreviewBox || !expressionPreviewValue) {
    return;
  }
  expressionPreviewValue.textContent = String(text ?? "");
  expressionPreviewBox.classList.toggle("error", tone === "error");
}

function expressionPreviewNode() {
  if (!ui.expressionEditor) {
    return null;
  }
  if (ui.expressionEditor.nodeId) {
    return getNodeById(ui.expressionEditor.nodeId);
  }
  return selectedNodeForSidebar();
}

function createExpressionPreviewRuntimeModel() {
  const model = cloneRuntimeModel({
    modelTitle: graph.modelTitle,
    properties: graph.properties,
    nodes: graph.nodes,
    edges: graph.edges,
    execution: normalizeExecutionConfig(graph.execution),
  });
  clearRuntimeSubmodelState(model);
  model.execution.currentTime = null;
  return model;
}

function getExpressionPreviewInitializationState() {
  const snapshotKey = currentSnapshot();
  if (ui.expressionPreviewInitCache?.snapshotKey === snapshotKey) {
    return ui.expressionPreviewInitCache.value;
  }
  const model = createExpressionPreviewRuntimeModel();
  const timeValue = Number(model.execution.t0);
  initializeStateNodesForModel(model, timeValue, model.execution);
  evaluateModelAtTimeRecursive(
    model,
    timeValue,
    { rootExecution: model.execution, stack: [] },
  );
  model.execution.currentTime = timeValue;
  const value = {
    model,
    timeValue,
    globals: buildExecutionGlobalsForModel(model, model.execution, timeValue),
    nodeMap: new Map(model.nodes.map((item) => [item.id, item])),
  };
  ui.expressionPreviewInitCache = { snapshotKey, value };
  return value;
}

function expressionPreviewNodeFromState(previewState) {
  const node = expressionPreviewNode();
  if (!node || !previewState?.nodeMap) {
    return null;
  }
  return previewState.nodeMap.get(node.id) || null;
}

function buildExpressionPreviewBaseContext(previewState, meta = null) {
  const context = { ...(previewState?.globals || {}) };
  const node = expressionPreviewNodeFromState(previewState);
  if (!node || !previewState?.model) {
    return { context, node };
  }
  Object.assign(context, nodePropertyAccessForContext(node));
  previewState.model.edges
    .filter((edge) => edge.to === node.id)
    .map((edge) => getModelNodeById(previewState.model, edge.from))
    .filter(Boolean)
    .filter((depNode) => (meta?.key !== "initial") || depNode.shape === "diamond")
    .forEach((depNode) => {
      if (!depNode.computedError) {
        context[depNode.name] = depNode.computedValue;
      }
    });
  return { context, node };
}

function evaluateInitialStatePreviewValue(node, globals, model = graph) {
  if (!node || !isStateNode(node)) {
    return { ok: false };
  }
  const context = {
    ...globals,
    ...nodePropertyAccessForContext(node),
  };
  (model?.edges || [])
    .filter((edge) => edge.to === node.id)
    .map((edge) => getModelNodeById(model, edge.from))
    .filter((depNode) => depNode && depNode.shape === "diamond")
    .forEach((depNode) => {
      if (!depNode.computedError) {
        context[depNode.name] = depNode.computedValue;
      }
    });
  return semantics.evaluateValueExpression(String(node.initialStateExpression ?? ""), context);
}

function buildExpressionPreviewEvaluation() {
  if (!ui.expressionEditor || !expressionEditorTextarea) {
    return null;
  }
  const source = String(expressionEditorTextarea.value ?? "");
  if (!source.trim()) {
    return { ok: true, empty: true, value: null };
  }
  const meta = expressionEditorMeta();
  const previewState = getExpressionPreviewInitializationState();
  const { context, node } = buildExpressionPreviewBaseContext(previewState, meta);

  const isStateTransition = Boolean(meta?.key === "value" && node && isStateNode(node));
  if (isStateTransition) {
    let selfValue = node.computedValue;
    if (selfValue == null) {
      const initialPreview = evaluateInitialStatePreviewValue(node, previewState.globals, previewState.model);
      if (initialPreview.ok) {
        selfValue = initialPreview.value;
      }
    }
    if (selfValue == null) {
      return { ok: false, reason: "runtime", message: t("expr.preview.unavailableState") };
    }
    context.__self = selfValue;
    if (String(source).includes("integral(")) {
      const derivativeList = semantics.evaluateIntegralDerivativeList(source, context, {
        allowThisAlias: true,
      });
      if (!derivativeList.ok) {
        return derivativeList;
      }
      const dt = Number(graph.execution.dt);
      const integralValues = (derivativeList.value || []).map((derivativeValue) => addTensorValues(selfValue, scaleTensorValue(derivativeValue, dt)));
      return semantics.evaluateStateTransitionExpressionWithIntegralValues(
        source,
        context,
        integralValues,
        { allowThisAlias: true },
      );
    }
    return semantics.evaluateValueExpression(source, context, {
      allowThisAlias: true,
      allowIntegral: true,
    });
  }
  return semantics.evaluateValueExpression(source, context);
}

function refreshExpressionPreviewNow() {
  clearExpressionPreviewTimer();
  if (!expressionPreviewBox || !expressionPreviewValue) {
    return;
  }
  const result = buildExpressionPreviewEvaluation();
  if (!result || result.empty) {
    setExpressionPreviewState(t("expr.preview.empty"));
    return;
  }
  if (!result.ok) {
    const msg = result.message ? localizeExpressionErrorMessage(result.message) : t(`error.evalReason.${result.reason || "runtime"}`);
    setExpressionPreviewState(t("expr.preview.error", { message: msg }), "error");
    return;
  }
  setExpressionPreviewState(`${t("expr.preview.type")}: ${describeExpressionPreviewShape(result.value)}\n${summarizeExpressionPreviewValue(result.value)}`);
}

function scheduleExpressionPreviewRefresh(delay = 180) {
  clearExpressionPreviewTimer();
  if (!ui.expressionEditor) {
    setExpressionPreviewState(t("expr.preview.empty"));
    return;
  }
  setExpressionPreviewState(t("expr.preview.pending"));
  ui.expressionPreviewTimer = window.setTimeout(() => {
    ui.expressionPreviewTimer = null;
    refreshExpressionPreviewNow();
  }, delay);
}

function closeExpressionEditor() {
  if (!expressionEditorModal) {
    return;
  }
  expressionEditorModal.classList.add("hidden");
  closeExpressionEditorSwitchModal();
  ui.expressionEditor = null;
  invalidateExpressionPreviewInitializationCache();
  ui.modalDrag = null;
  if (expressionEditorTextarea) {
    expressionEditorTextarea.value = "";
    expressionEditorTextarea.classList.remove("invalid");
  }
  if (expressionEditorHighlight) {
    expressionEditorHighlight.innerHTML = "";
    expressionEditorHighlight.classList.remove("invalid");
  }
  expressionEditorSurface?.classList.remove("invalid");
  if (expressionLibrary) {
    expressionLibrary.innerHTML = "";
    expressionLibrary.classList.add("hidden");
  }
  if (expressionSymbolsFilter) {
    expressionSymbolsFilter.value = "";
  }
  expressionSidebar?.classList.remove("hidden");
  setExpressionHelp(null);
  hideExpressionStatus(expressionEditorStatus);
  clearExpressionPreviewTimer();
  setExpressionPreviewState(t("expr.preview.empty"));
  ui.modalResize = null;
  resetExpressionEditorCardPosition();
}

function refreshExpressionEditorValidation() {
  if (!ui.expressionEditor || !expressionEditorTextarea || !expressionEditorApplyBtn) {
    return { ok: true, empty: true };
  }
  if (expressionEditorTitle) {
    const dirty = expressionEditorTextarea.value !== String(ui.expressionEditor.initialValue ?? "");
    expressionEditorTitle.textContent = `${ui.expressionEditor.baseTitle}${dirty ? " *" : ""}`;
  }
  const syntaxResult = updateExpressionFieldState(
    expressionEditorTextarea,
    expressionEditorStatus,
    expressionEditorTextarea.value,
    true,
    null,
  );
  expressionEditorSurface?.classList.toggle("invalid", !syntaxResult.ok);
  expressionEditorApplyBtn.disabled = !syntaxResult.ok;
  if (expressionEditorSwitchApplyBtn && expressionEditorSwitchModal && !expressionEditorSwitchModal.classList.contains("hidden")) {
    expressionEditorSwitchApplyBtn.disabled = !syntaxResult.ok;
  }
  ui.expressionEditor.syntaxOk = syntaxResult.ok;
  renderExpressionHighlight();
  renderExpressionAutocomplete();
  scheduleExpressionPreviewRefresh(syntaxResult.ok ? 180 : 0);
  return syntaxResult;
}

function lineRangeAroundSelection(textarea) {
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? start;
  const value = textarea.value;
  const lineStart = value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  let lineEnd = value.indexOf("\n", end);
  if (lineEnd < 0) {
    lineEnd = value.length;
  }
  return { start, end, lineStart, lineEnd };
}

function indentExpressionSelection(textarea, outdent = false) {
  if (!textarea) {
    return;
  }
  const { start, end, lineStart, lineEnd } = lineRangeAroundSelection(textarea);
  const value = textarea.value;
  const block = value.slice(lineStart, lineEnd);
  const lines = block.split("\n");
  let removedBeforeStart = 0;
  let removedTotal = 0;
  const nextLines = lines.map((line, idx) => {
    if (!outdent) {
      return `  ${line}`;
    }
    let removed = 0;
    if (line.startsWith("  ")) {
      removed = 2;
    } else if (line.startsWith("\t")) {
      removed = 1;
    } else if (line.startsWith(" ")) {
      removed = 1;
    }
    if (idx === 0) {
      removedBeforeStart = removed;
    }
    removedTotal += removed;
    return line.slice(removed);
  });
  const replacement = nextLines.join("\n");
  textarea.value = `${value.slice(0, lineStart)}${replacement}${value.slice(lineEnd)}`;
  if (start === end && !outdent) {
    const caret = start + 2;
    textarea.setSelectionRange(caret, caret);
  } else {
    const nextStart = Math.max(lineStart, start + (outdent ? -removedBeforeStart : 2));
    const delta = outdent ? -removedTotal : (2 * lines.length);
    const nextEnd = Math.max(nextStart, end + delta);
    textarea.setSelectionRange(nextStart, nextEnd);
  }
}

function insertExpressionNewlineWithIndent(textarea) {
  if (!textarea) {
    return;
  }
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? start;
  const value = textarea.value;
  const lineStart = value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  const currentLine = value.slice(lineStart, start);
  const indent = (currentLine.match(/^[ \t]*/) || [""])[0];
  const extraIndent = /[(\[{]$/.test(currentLine.trimEnd()) ? "  " : "";
  const insertion = `\n${indent}${extraIndent}`;
  textarea.value = `${value.slice(0, start)}${insertion}${value.slice(end)}`;
  const caret = start + insertion.length;
  textarea.setSelectionRange(caret, caret);
}

function openExpressionEditor(fieldKey) {
  const node = selectedNodeForSidebar();
  const meta = expressionFieldMeta(fieldKey, node);
  if (!node || !meta || !expressionEditorModal || !expressionEditorTextarea || !expressionEditorTitle) {
    return;
  }
  if (isExecutionFrozen()) {
    return;
  }
  ui.expressionEditor = {
    nodeId: node.id,
    fieldKey: meta.key,
    syntaxOk: true,
    baseTitle: meta.title,
    initialValue: meta.value,
    librarySelectedName: "",
  };
  expressionEditorTitle.textContent = meta.title;
  expressionEditorTextarea.value = meta.value;
  expressionEditorModal.classList.remove("hidden");
  resetExpressionEditorCardPosition();
  refreshExpressionEditorValidation();
  expressionEditorTextarea.focus();
  expressionEditorTextarea.select();
}

function openNodePrimaryEditor(node) {
  if (!node || isExecutionFrozen()) {
    return;
  }
  if (isSubmodelNode(node)) {
    void openSubmodelNode(node);
    return;
  }
  if (ui.expressionEditor && !expressionEditorModal?.classList.contains("hidden")) {
    selectSingleNode(node.id);
    return;
  }
  selectSingleNode(node.id);
  openExpressionEditor("value");
}

function openCustomExpressionEditor(title, initialValue, onApply) {
  if (!expressionEditorModal || !expressionEditorTextarea || !expressionEditorTitle) {
    return;
  }
  if (isExecutionFrozen()) {
    return;
  }
  ui.expressionEditor = {
    nodeId: null,
    fieldKey: "__custom__",
    syntaxOk: true,
    baseTitle: String(title ?? ""),
    initialValue: String(initialValue ?? ""),
    onApplyCustom: typeof onApply === "function" ? onApply : null,
    librarySelectedName: "",
  };
  expressionEditorTitle.textContent = String(title ?? "");
  expressionEditorTextarea.value = String(initialValue ?? "");
  expressionEditorModal.classList.remove("hidden");
  resetExpressionEditorCardPosition();
  refreshExpressionEditorValidation();
  expressionEditorTextarea.focus();
  expressionEditorTextarea.select();
}

function commitExpressionEditorValue(closeAfter = true) {
  if (!ui.expressionEditor || !ui.expressionEditor.syntaxOk || isExecutionFrozen()) {
    return false;
  }
  if (ui.expressionEditor.fieldKey === "__custom__") {
    const nextValue = expressionEditorTextarea ? expressionEditorTextarea.value : "";
    if (typeof ui.expressionEditor.onApplyCustom === "function") {
      ui.expressionEditor.onApplyCustom(nextValue);
    }
    if (closeAfter) {
      closeExpressionEditor();
    } else {
      ui.expressionEditor.initialValue = nextValue;
      refreshExpressionEditorValidation();
    }
    return true;
  }
  const node = getNodeById(ui.expressionEditor.nodeId);
  const meta = expressionFieldMeta(ui.expressionEditor.fieldKey, node);
  if (!node || !meta || !expressionEditorTextarea) {
    if (closeAfter) {
      closeExpressionEditor();
    }
    return false;
  }
  const nextValue = expressionEditorTextarea.value;
  runAction(() => {
    meta.setValue(nextValue);
  });
  if (meta.inputEl && document.activeElement !== meta.inputEl) {
    meta.inputEl.value = nextValue;
  }
  updateExpressionFieldState(meta.inputEl, meta.statusEl, nextValue, false, meta.key);
  if (closeAfter) {
    closeExpressionEditor();
  } else {
    ui.expressionEditor.initialValue = nextValue;
    ui.expressionEditor.baseTitle = meta.title;
    refreshExpressionEditorValidation();
  }
  return true;
}

function applyExpressionEditor() {
  commitExpressionEditorValue(true);
}

function isFirefoxBrowser() {
  return /firefox/i.test(navigator.userAgent || "");
}

function applyI18nToDom() {
  document.documentElement.lang = currentLang;
  populateNodeColorSelect(nodeFillColorInput, NODE_FILL_COLOR_PRESETS);
  populateNodeColorSelect(nodeStrokeColorInput, NODE_STROKE_COLOR_PRESETS);
  populateNodeColorSelect(textFillColorInput, TEXT_FILL_COLOR_PRESETS);
  populateNodeColorSelect(textStrokeColorInput, TEXT_STROKE_COLOR_PRESETS);
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) {
      return;
    }
    const text = t(key);
    if (el.tagName === "TITLE") {
      document.title = text;
    } else {
      el.textContent = text;
    }
  });
  document.querySelectorAll("[data-title-i18n]").forEach((el) => {
    const key = el.getAttribute("data-title-i18n");
    if (!key) {
      return;
    }
    setTooltipText(el, t(key));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key || !("placeholder" in el)) {
      return;
    }
    el.placeholder = t(key);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");
    if (!key) {
      return;
    }
    el.setAttribute("aria-label", t(key));
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const key = el.getAttribute("data-i18n-alt");
    if (!key) {
      return;
    }
    el.setAttribute("alt", t(key));
  });
  renderRecentModelsMenu();
  updateFileStatusLabel(dirtySinceLastSave);
}

function applyI18nTooltipsToSubtree(root) {
  if (!root || !(root instanceof Element)) {
    return;
  }
  root.querySelectorAll("[data-title-i18n]").forEach((el) => {
    const key = el.getAttribute("data-title-i18n");
    if (!key) {
      return;
    }
    setTooltipText(el, t(key));
  });
}

async function loadI18n() {
  currentLang = resolveLangFromUrl();
  const bundledCurrent = bundledI18nMessages(currentLang);
  if (bundledCurrent) {
    i18n = bundledCurrent;
  } else if (currentLang !== "it") {
    currentLang = "it";
    i18n = bundledI18nMessages("it") || {};
  } else {
    i18n = {};
  }
  applyI18nToDom();
  if (!expressionEditorModal?.classList.contains("hidden")) {
    refreshExpressionEditorValidation();
  }
  if (!functionsHelpModal?.classList.contains("hidden")) {
    renderFunctionsHelp();
  }
}

function setStatus(text) {
  statusText.textContent = text;
  refreshActiveTooltip();
}

function setStatusKey(key, vars = null) {
  setStatus(t(key, vars));
}

function displayFileName() {
  return currentFileName || t("file.unnamed");
}

function updateFileStatusLabel(dirty = dirtySinceLastSave) {
  if (!fileStatusText) {
    return;
  }
  const key = dirty ? "file.status.dirty" : "file.status.clean";
  fileStatusText.textContent = t(key, { name: displayFileName() });
  if (saveJsonBtn) {
    saveJsonBtn.disabled = !dirty;
  }
}

function updateModelBreadcrumb() {
  if (!modelBreadcrumbText || !exitSubmodelBtn) {
    return;
  }
  if (modelContextStack.length === 0) {
    modelBreadcrumbText.textContent = "";
    modelBreadcrumbText.classList.add("hidden");
    exitSubmodelBtn.classList.add("hidden");
    return;
  }
  const segments = [t("text.mainModel"), ...modelContextStack.map((entry) => entry.nodeName)];
  modelBreadcrumbText.textContent = segments.join(" / ");
  modelBreadcrumbText.classList.remove("hidden");
  exitSubmodelBtn.classList.remove("hidden");
}

function scheduleFileStatusRefresh() {
  if (fileStatusRefreshTimer != null) {
    return;
  }
  fileStatusRefreshTimer = window.setTimeout(() => {
    fileStatusRefreshTimer = null;
    dirtySinceLastSave = hasUnsavedChanges();
    updateFileStatusLabel(dirtySinceLastSave);
  }, 120);
}

function evalReasonText(reason) {
  return t(`error.evalReason.${reason || "runtime"}`);
}

function clampDisplayDecimals(value) {
  return clamp(Math.round(Number(value) || 0), 0, 12);
}

function formatNumberValue(value) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  const decimals = clampDisplayDecimals(graph.execution.decimals);
  let text = value.toFixed(decimals);
  if (decimals > 0) {
    text = text.replace(/(\.\d*?[1-9])0+$/u, "$1").replace(/\.0+$/u, "");
  }
  if (text === "-0") {
    return "0";
  }
  return text;
}

function formatComputedValue(value) {
  if (value === null || value === undefined) {
    return "-";
  }
  if (typeof value === "number") {
    return formatNumberValue(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => formatComputedValue(item)).join(", ")}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value);
    try {
      return `{${entries.map(([key, item]) => `${key}: ${formatComputedValue(item)}`).join(", ")}}`;
    } catch (_err) {
      return String(value);
    }
  }
  return String(value);
}

function summarizeTooltipValue(value) {
  if (Array.isArray(value)) {
    const isMatrix =
      value.length > 0 &&
      value.every((row) => Array.isArray(row)) &&
      value.every((row) => row.length === value[0].length);
    if (isMatrix) {
      const rows = value.length;
      const cols = value[0]?.length ?? 0;
      if ((rows * cols) > 16) {
        return t("text.matrixSummary", { rows, cols });
      }
    } else if (value.every((item) => !Array.isArray(item)) && value.length > 8) {
      return t("text.vectorSummary", { size: value.length });
    }
  }
  return formatComputedValue(value);
}

function summarizeExpressionPreviewValue(value) {
  if (Array.isArray(value)) {
    const isMatrix =
      value.length > 0 &&
      value.every((row) => Array.isArray(row)) &&
      value.every((row) => row.length === value[0].length);
    if (isMatrix) {
      const rows = value.length;
      const cols = value[0]?.length ?? 0;
      if ((rows * cols) > 25) {
        return t("text.matrixSummary", { rows, cols });
      }
    } else if (value.every((item) => !Array.isArray(item)) && value.length > 12) {
      return t("text.vectorSummary", { size: value.length });
    }
  }
  return formatComputedValue(value);
}

function describeExpressionPreviewShape(value) {
  if (value === null || value === undefined) {
    return t("expr.preview.shape.empty");
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return t("expr.preview.shape.scalar");
  }
  if (typeof value === "string") {
    return t("expr.preview.shape.text");
  }
  if (Array.isArray(value)) {
    const isMatrix =
      value.length > 0 &&
      value.every((row) => Array.isArray(row)) &&
      value.every((row) => row.length === value[0].length);
    if (isMatrix) {
      return t("expr.preview.shape.matrix", { rows: value.length, cols: value[0]?.length ?? 0 });
    }
    if (value.every((item) => !Array.isArray(item))) {
      return t("expr.preview.shape.vector", { size: value.length });
    }
    return t("expr.preview.shape.array");
  }
  if (typeof value === "object") {
    return t("expr.preview.shape.object");
  }
  return t("expr.preview.shape.scalar");
}

function normalizeExecutionConfig(raw) {
  const t0 = Number(raw?.t0);
  const dt = Number(raw?.dt);
  const t1 = Number(raw?.t1);
  const delayMs = Number(raw?.delayMs);
  const decimals = Number(raw?.decimals);
  const integrator = String(raw?.integrator ?? "euler").toLowerCase();
  const strictDefinitions = Boolean(raw?.strictDefinitions);
  const currentTime = raw?.currentTime;
  return {
    t0: Number.isFinite(t0) ? t0 : 0,
    dt: Number.isFinite(dt) && dt !== 0 ? dt : 1,
    t1: Number.isFinite(t1) ? t1 : 10,
    delayMs: Number.isFinite(delayMs) && delayMs > 0 ? Math.round(delayMs) : 1000,
    decimals: Number.isFinite(decimals) ? clampDisplayDecimals(decimals) : 3,
    integrator: integrator === "rk4" ? "rk4" : "euler",
    strictDefinitions,
    currentTime: Number.isFinite(Number(currentTime)) ? Number(currentTime) : null,
  };
}

function propagateNodeRenameInExpressions(oldName, newName) {
  if (!oldName || !newName || oldName === newName) {
    return;
  }
  graph.nodes.forEach((node) => {
    node.valueExpression = semantics.replaceIdentifierInExpression(
      node.valueExpression,
      oldName,
      newName,
    );
    node.initialStateExpression = semantics.replaceIdentifierInExpression(
      node.initialStateExpression,
      oldName,
      newName,
    );
  });
  graph.widgets.forEach((widget) => {
    if (widget.type === "table" && Array.isArray(widget.columns)) {
      widget.columns = widget.columns.map((name) => (name === oldName ? newName : name));
    }
    if (widget.type === "matrix" && widget.source === oldName) {
      widget.source = newName;
    }
    if (widget.type === "led" && widget.source === oldName) {
      widget.source = newName;
    }
    if (widget.type === "xychart") {
      if (Array.isArray(widget.xyPairs)) {
        widget.xyPairs = widget.xyPairs.map((pair) => ({
          ...pair,
          xSource: pair.xSource === oldName ? newName : pair.xSource,
          ySource: pair.ySource === oldName ? newName : pair.ySource,
        }));
      }
    }
    if ((widget.type === "slider" || widget.type === "button") && widget.source === oldName) {
      widget.source = newName;
    }
  });
}

function removeNodeFromAllWidgetDisplays(nodeName) {
  if (!nodeName) {
    return;
  }
  graph.widgets.forEach((widget) => {
    if (widget.type === "table" && Array.isArray(widget.columns)) {
      widget.columns = widget.columns.filter((name) => name !== nodeName);
    }
    if (widget.type === "matrix" && widget.source === nodeName) {
      widget.source = "";
    }
    if (widget.type === "led" && widget.source === nodeName) {
      widget.source = "";
    }
    if (widget.type === "xychart") {
      if (Array.isArray(widget.xyPairs)) {
        widget.xyPairs = widget.xyPairs.filter((pair) => pair.xSource !== nodeName && pair.ySource !== nodeName);
      }
    }
  });
}

function removeNodeFromInputWidgetBindings(nodeName) {
  if (!nodeName) {
    return;
  }
  graph.widgets.forEach((widget) => {
    if ((widget.type === "slider" || widget.type === "button") && widget.source === nodeName) {
      widget.source = "";
    }
  });
}

function clampZoom(value) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function isStateNode(node) {
  return node?.shape === "rect";
}

function isAlgebraicNode(node) {
  return node?.shape === "ellipse";
}

function isSubmodelNode(node) {
  return node?.shape === "submodel";
}

function nodeHasIncomingEdges(nodeId) {
  return graph.edges.some((edge) => edge.to === nodeId);
}

function canMarkNodeAsInput(node) {
  return isAlgebraicNode(node) && !nodeHasIncomingEdges(node.id);
}

function canBindButtonToNode(node) {
  return Boolean(node && (node.shape === "diamond" || node.input));
}

function canBindSliderToNode(node) {
  return Boolean(node && (node.shape === "diamond" || node.input));
}

function normalizeSubmodelPath(value) {
  let raw = String(value ?? "").trim();
  if (!raw) {
    return "";
  }
  raw = raw.replace(/\\/g, "/");
  while (raw.startsWith("./")) {
    raw = raw.slice(2);
  }
  raw = raw.trim();
  if (!raw || raw === "." || raw.includes("..")) {
    return "";
  }
  const parts = raw.split("/").filter(Boolean);
  const base = parts.length ? parts[parts.length - 1].trim() : "";
  if (!base || base === "." || base === "..") {
    return "";
  }
  return base;
}

function submodelInterfaceSummary(node) {
  const inputs = Array.isArray(node?.interfaceCache?.inputs) ? node.interfaceCache.inputs : [];
  const outputs = Array.isArray(node?.interfaceCache?.outputs) ? node.interfaceCache.outputs : [];
  return t("text.submodelInterfaceSummary", {
    inputs: inputs.length ? inputs.join(", ") : "-",
    outputs: outputs.length ? outputs.join(", ") : "-",
  });
}

function canShowSubmodelNode(node) {
  if (!node || !isSubmodelNode(node)) {
    return false;
  }
  const normalizedPath = normalizeSubmodelPath(node.modelPath);
  if (!normalizedPath) {
    return false;
  }
  return Boolean(
    currentModelDirectoryHandle ||
    submodelTemplateCache.has(normalizedPath) ||
    submodelSourceCache.has(normalizedPath),
  );
}

async function chooseSubmodelFileForNode(node) {
  if (!node || !isSubmodelNode(node)) {
    return false;
  }
  let entry = null;
  if (supportsOpenFilePicker()) {
    const handles = await showOpenFilePickerCompat({
      multiple: false,
      types: [{
        description: "JSON",
        accept: { "application/json": [".json"] },
      }],
    });
    entry = handles?.[0] || null;
  } else {
    entry = await pickSubmodelFileWithInput();
  }
  if (!entry) {
    throw new Error(t("error.loadCancelled"));
  }
  const item = await parseSelectedJsonEntry(entry);
  const normalizedPath = normalizeSubmodelPath(item?.name);
  if (!normalizedPath) {
    throw new Error(t("error.submodelPathInvalid"));
  }
  node.modelPath = normalizedPath;
  node.interfaceCache = { inputs: [], outputs: [] };
  node.submodelError = "";
  node.__runtimeSubmodel = null;
  node.__runtimeSubmodelPath = "";
  submodelSourceCache.set(normalizedPath, item.text);
  if (item.fileHandle) {
    submodelFileHandleCache.set(normalizedPath, item.fileHandle);
  }
  try {
    const data = JSON.parse(item.text);
    submodelTemplateCache.set(normalizedPath, buildRuntimeModelFromData(data));
  } catch (_err) {
    // Parsing/semantic errors are surfaced by the normal refresh path below.
  }
  sanitizeSubmodelBindings(node);
  sanitizeAllEdgesForNode(node.id);
  invalidateExecutionPlan();
  ui.submodelsPrepared = false;
  scheduleFileStatusRefresh();
  return true;
}

function sanitizeSubmodelBindings(node) {
  if (!node || !isSubmodelNode(node)) {
    return;
  }
  const allowedInputs = new Set(
    Array.isArray(node.interfaceCache?.inputs)
      ? node.interfaceCache.inputs.map((value) => String(value).trim()).filter(Boolean)
      : [],
  );
  const source = node.inputBindings && typeof node.inputBindings === "object" ? node.inputBindings : {};
  if (allowedInputs.size === 0) {
    node.inputBindings = Object.fromEntries(
      Object.entries(source)
        .map(([key, value]) => [String(key || "").trim(), String(value ?? "").trim()])
        .filter(([key, value]) => key && value),
    );
    return;
  }
  const next = {};
  Object.entries(source).forEach(([key, value]) => {
    const inputName = String(key || "").trim();
    if (!inputName || !allowedInputs.has(inputName)) {
      return;
    }
    const binding = String(value ?? "").trim();
    if (binding) {
      next[inputName] = binding;
    }
  });
  node.inputBindings = next;
}

function sanitizeAllEdgesForNode(nodeId) {
  graph.edges.forEach((edge) => {
    if (edge.from === nodeId || edge.to === nodeId) {
      sanitizeEdgePorts(edge);
    }
  });
}

function renderSubmodelBindingsEditor(node) {
  if (!nodeSubmodelBindings) {
    return;
  }
  nodeSubmodelBindings.innerHTML = "";
  if (!node || !isSubmodelNode(node)) {
    nodeSubmodelBindings.classList.add("hidden");
    return;
  }
  sanitizeSubmodelBindings(node);
  nodeSubmodelBindings.classList.remove("hidden");

  const note = document.createElement("div");
  note.className = "submodel-bindings-note";
  note.textContent = t("text.submodelBindingDefault");
  nodeSubmodelBindings.appendChild(note);

  const inputs = Array.isArray(node.interfaceCache?.inputs)
    ? node.interfaceCache.inputs.map((value) => String(value).trim()).filter(Boolean)
    : [];
  if (!inputs.length) {
    const empty = document.createElement("div");
    empty.className = "empty-props";
    empty.textContent = t("text.submodelNoInputs");
    nodeSubmodelBindings.appendChild(empty);
    return;
  }

  inputs.forEach((inputName) => {
    const row = document.createElement("div");
    row.className = "submodel-binding-row";
    const label = document.createElement("label");
    const inputId = `submodel-binding-${node.id}-${inputName.replace(/[^a-zA-Z0-9_-]+/g, "_")}`;
    label.htmlFor = inputId;
    label.textContent = inputName;
    const input = document.createElement("input");
    input.id = inputId;
    input.type = "text";
    input.value = String(node.inputBindings?.[inputName] ?? "");
    input.placeholder = t("placeholder.submodelBinding");
    input.setAttribute("data-title-i18n", "tooltip.node.submodelBinding");
    input.addEventListener("focus", () => {
      beginTransaction();
    });
    input.addEventListener("input", () => {
      const expr = String(input.value ?? "").trim();
      if (!node.inputBindings || typeof node.inputBindings !== "object") {
        node.inputBindings = {};
      }
      if (expr) {
        node.inputBindings[inputName] = expr;
      } else {
        delete node.inputBindings[inputName];
      }
      dirtySinceLastSave = true;
      updateFileStatusLabel(true);
      scheduleFileStatusRefresh();
    });
    input.addEventListener("blur", () => {
      commitTransaction();
    });
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "small-btn expr-edit-btn";
    editBtn.textContent = t("action.editExpression");
    setTooltipText(editBtn, t("tooltip.node.editExpression"));
    editBtn.addEventListener("click", () => {
      openCustomExpressionEditor(
        `${t("action.editExpression")} - ${inputName}`,
        input.value,
        (nextValue) => {
          beginTransaction();
          input.value = String(nextValue ?? "");
          const expr = String(input.value ?? "").trim();
          if (!node.inputBindings || typeof node.inputBindings !== "object") {
            node.inputBindings = {};
          }
          if (expr) {
            node.inputBindings[inputName] = expr;
          } else {
            delete node.inputBindings[inputName];
          }
          dirtySinceLastSave = true;
          updateFileStatusLabel(true);
          scheduleFileStatusRefresh();
          commitTransaction();
        },
      );
    });
    row.appendChild(label);
    row.appendChild(input);
    row.appendChild(editBtn);
    nodeSubmodelBindings.appendChild(row);
  });

  applyI18nTooltipsToSubtree(nodeSubmodelBindings);
}

function hasExternalValue(node) {
  return Boolean(node?.externalValueEnabled);
}

function hasSliderBinding(node) {
  return Boolean(node && graph.widgets.some((widget) => widget.type === "slider" && widget.source === node.name));
}

function hasButtonBinding(node) {
  return Boolean(node && graph.widgets.some((widget) => widget.type === "button" && widget.source === node.name));
}

function hasInputWidgetBinding(node) {
  return hasSliderBinding(node) || hasButtonBinding(node);
}

function normalizeInputNodeFlags() {
  graph.nodes.forEach((node) => {
    if (!canMarkNodeAsInput(node)) {
      node.input = false;
    }
  });
}

function buttonBindableNodeNames() {
  return graph.nodes.filter((node) => canBindButtonToNode(node)).map((node) => node.name);
}

function sliderBindableNodeNames() {
  return graph.nodes.filter((node) => canBindSliderToNode(node)).map((node) => node.name);
}

function serializeNodeType(shape) {
  if (shape === "ellipse") {
    return "algebraic";
  }
  if (shape === "diamond") {
    return "parameter";
  }
  if (shape === "submodel") {
    return "submodel";
  }
  return "state";
}

function deserializeNodeType(type) {
  if (type === "algebraic") {
    return "ellipse";
  }
  if (type === "parameter") {
    return "diamond";
  }
  if (type === "submodel") {
    return "submodel";
  }
  return "rect";
}

function graphBounds() {
  let minX = 0;
  let minY = 0;
  let maxX = BASE_CANVAS_WIDTH;
  let maxY = BASE_CANVAS_HEIGHT;

  graph.nodes.forEach((node) => {
    const hw = node.width / 2;
    const hh = node.height / 2;
    minX = Math.min(minX, node.x - hw);
    minY = Math.min(minY, node.y - hh);
    maxX = Math.max(maxX, node.x + hw);
    maxY = Math.max(maxY, node.y + hh);
  });

  graph.edges.forEach((edge) => {
    (edge.controlPoints || []).forEach((cp) => {
      minX = Math.min(minX, cp.x);
      minY = Math.min(minY, cp.y);
      maxX = Math.max(maxX, cp.x);
      maxY = Math.max(maxY, cp.y);
    });
  });

  graph.widgets.forEach((widget) => {
    const width = Number(widget.width) || 0;
    const height = Number(widget.minimized ? 36 : widget.height) || 0;
    minX = Math.min(minX, widget.x);
    minY = Math.min(minY, widget.y);
    maxX = Math.max(maxX, widget.x + width);
    maxY = Math.max(maxY, widget.y + height);
  });

  graph.textItems.forEach((item) => {
    minX = Math.min(minX, item.x);
    minY = Math.min(minY, item.y);
    maxX = Math.max(maxX, item.x + item.width);
    maxY = Math.max(maxY, item.y + item.height);
  });

  const margin = 180;
  minX -= margin;
  minY -= margin;
  maxX += margin;
  maxY += margin;

  return {
    minX,
    minY,
    width: Math.max(200, maxX - minX),
    height: Math.max(200, maxY - minY),
  };
}

function updateCanvasSize(anchorClientX = null, anchorClientY = null, force = false) {
  if (!force && (ui.drag || ui.resize || ui.controlPointDrag || ui.edgeCreate || ui.marquee || ui.textDrag || ui.textResize)) {
    return;
  }

  const rect = graphViewport.getBoundingClientRect();
  const ax = anchorClientX ?? rect.left;
  const ay = anchorClientY ?? rect.top;
  const localX = Math.max(0, Math.min(rect.width, ax - rect.left));
  const localY = Math.max(0, Math.min(rect.height, ay - rect.top));

  const oldVB = svg.viewBox.baseVal;
  const oldView = {
    x: oldVB?.x ?? 0,
    y: oldVB?.y ?? 0,
    width: oldVB?.width || BASE_CANVAS_WIDTH,
    height: oldVB?.height || BASE_CANVAS_HEIGHT,
  };

  const oldPixelWidth = svg.clientWidth || Math.round(oldView.width * ui.zoom);
  const oldPixelHeight = svg.clientHeight || Math.round(oldView.height * ui.zoom);
  const oldContentX = graphViewport.scrollLeft + localX;
  const oldContentY = graphViewport.scrollTop + localY;
  const worldX = oldView.x + (oldContentX / Math.max(1, oldPixelWidth)) * oldView.width;
  const worldY = oldView.y + (oldContentY / Math.max(1, oldPixelHeight)) * oldView.height;

  const bounds = graphBounds();
  const zoomedWidth = Math.round(bounds.width * ui.zoom);
  const zoomedHeight = Math.round(bounds.height * ui.zoom);
  const targetWidth = Math.max(1, zoomedWidth);
  const targetHeight = Math.max(1, zoomedHeight);

  const currentWidth = parseInt(svg.style.width, 10) || svg.clientWidth;
  const currentHeight = parseInt(svg.style.height, 10) || svg.clientHeight;
  const sameView =
    Math.abs(oldView.x - bounds.minX) < 0.001 &&
    Math.abs(oldView.y - bounds.minY) < 0.001 &&
    Math.abs(oldView.width - bounds.width) < 0.001 &&
    Math.abs(oldView.height - bounds.height) < 0.001;
  const sameSize = currentWidth === targetWidth && currentHeight === targetHeight;
  if (!force && sameView && sameSize) {
    return;
  }

  svg.setAttribute("viewBox", `${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`);

  svg.style.width = `${targetWidth}px`;
  svg.style.height = `${targetHeight}px`;

  const newContentX = ((worldX - bounds.minX) / bounds.width) * targetWidth;
  const newContentY = ((worldY - bounds.minY) / bounds.height) * targetHeight;
  graphViewport.scrollLeft = newContentX - localX;
  graphViewport.scrollTop = newContentY - localY;
}

function updateZoomButtons() {
  zoomInItem.disabled = ui.zoom >= MAX_ZOOM;
  zoomOutItem.disabled = ui.zoom <= MIN_ZOOM;
  zoomResetItem.disabled = Math.abs(ui.zoom - 1) < 0.001;
  if (zoomRangeInput && document.activeElement !== zoomRangeInput) {
    zoomRangeInput.value = String(Math.round(ui.zoom * 100));
  }
  if (zoomRangeValue) {
    zoomRangeValue.textContent = `${Math.round(ui.zoom * 100)}%`;
  }
}

function applyCanvasVisibility() {
  svg.style.display = "block";
  edgesLayer.style.display = ui.showGraph ? "" : "none";
  previewLayer.style.display = ui.showGraph ? "" : "none";
  nodesLayer.style.display = ui.showGraph ? "" : "none";
  controlsLayer.style.display = ui.showGraph ? "" : "none";
  marqueeLayer.style.display = ui.showGraph ? "" : "none";
  widgetLayer.style.display = ui.showWidgets ? "" : "none";
  textLayer.style.display = ui.showWidgets ? "" : "none";
  const graphLabel = ui.showGraph ? t("view.btn.hideGraph") : t("view.btn.showGraph");
  const widgetsLabel = ui.showWidgets ? t("view.btn.hideWidgets") : t("view.btn.showWidgets");
  if (toggleGraphBtn) {
    toggleGraphBtn.textContent = graphLabel;
  }
  if (toggleWidgetsBtn) {
    toggleWidgetsBtn.textContent = widgetsLabel;
  }
  if (toggleGraphItem) {
    toggleGraphItem.textContent = graphLabel;
  }
  if (toggleWidgetsItem) {
    toggleWidgetsItem.textContent = widgetsLabel;
  }
}

function updateModelRunButtons() {
  const blocked = hasStrictExecutionBlock();
  if (topRunEvalBtn) {
    setTooltipText(topRunEvalBtn, `${t("menu.run.execute")} (F7)`);
    topRunEvalBtn.disabled = blocked;
  }
  if (topRunStepBtn) {
    setTooltipText(topRunStepBtn, `${t("menu.run.step")} (F8)`);
    topRunStepBtn.disabled = blocked;
  }
  if (topRunTimedBtn) {
    const timedKey = ui.timedRunHandle == null ? "action.timedStart" : "action.timedStop";
    topRunTimedBtn.textContent = ui.timedRunHandle == null ? "⏱" : "⏸";
    setTooltipText(topRunTimedBtn, `${t(timedKey)} (F9)`);
    topRunTimedBtn.disabled = blocked && ui.timedRunHandle == null;
    topRunTimedBtn.classList.toggle("active", ui.timedRunHandle != null);
  }
  if (topRunResetBtn) {
    setTooltipText(topRunResetBtn, `${t("menu.run.reset")} (F10)`);
  }
  if (runFullModelBtn) {
    setTooltipText(runFullModelBtn, `${t("menu.run.execute")} (F7)`);
    runFullModelBtn.disabled = blocked;
  }
  if (manualStepBtn) {
    setTooltipText(manualStepBtn, `${t("menu.run.step")} (F8)`);
    manualStepBtn.disabled = blocked;
  }
  if (timedToggleBtn) {
    const timedKey = ui.timedRunHandle == null ? "action.timedStart" : "action.timedStop";
    timedToggleBtn.textContent = ui.timedRunHandle == null ? "⏱" : "⏸";
    setTooltipText(timedToggleBtn, `${t(timedKey)} (F9)`);
    timedToggleBtn.disabled = blocked && ui.timedRunHandle == null;
  }
  if (resetExecBtn) {
    setTooltipText(resetExecBtn, `${t("menu.run.reset")} (F10)`);
  }
  if (runEvalBtn) {
    runEvalBtn.disabled = blocked;
  }
  if (runStepBtn) {
    runStepBtn.disabled = blocked;
  }
  if (runTimedToggleBtn) {
    runTimedToggleBtn.disabled = blocked && ui.timedRunHandle == null;
  }
  if (runStrictDefinitionsInput) {
    runStrictDefinitionsInput.checked = Boolean(graph.execution.strictDefinitions);
  }
  if (strictDefinitionsInput) {
    strictDefinitionsInput.checked = Boolean(graph.execution.strictDefinitions);
  }
}

function updateDeleteActionLabel() {
  if (!deleteBtnLabel) {
    return;
  }
  deleteBtnLabel.textContent = t("menu.edit.delete");
}

function selectAllNodes() {
  if (graph.nodes.length === 0) {
    return;
  }
  setNodeSelection(graph.nodes.map((n) => n.id), false);
  render();
}

function toggleGraphVisibility() {
  ui.showGraph = !ui.showGraph;
  applyCanvasVisibility();
}

function toggleWidgetsVisibility() {
  ui.showWidgets = !ui.showWidgets;
  applyCanvasVisibility();
}

function applyZoom(nextZoom, anchorClientX = null, anchorClientY = null) {
  const targetZoom = clampZoom(nextZoom);
  if (Math.abs(targetZoom - ui.zoom) < 0.0001) {
    return;
  }

  ui.zoom = targetZoom;
  updateCanvasSize(anchorClientX, anchorClientY, true);
  renderWidgets();

  updateZoomButtons();
  refreshSidebar();
  setStatusKey("status.zoom", { value: Math.round(ui.zoom * 100) });
}

function fitToContent() {
  const rect = graphViewport.getBoundingClientRect();
  if (rect.width < 10 || rect.height < 10) {
    return;
  }

  const bounds = graphBounds();
  const zx = rect.width / Math.max(1, bounds.width);
  const zy = rect.height / Math.max(1, bounds.height);
  ui.zoom = clampZoom(Math.min(zx, zy));
  updateCanvasSize(rect.left + rect.width / 2, rect.top + rect.height / 2, true);
  renderWidgets();

  graphViewport.scrollLeft = Math.max(0, (svg.clientWidth - rect.width) / 2);
  graphViewport.scrollTop = Math.max(0, (svg.clientHeight - rect.height) / 2);

  updateZoomButtons();
  setStatusKey("status.fit", { value: Math.round(ui.zoom * 100) });
}

function closeTopMenus() {
  menuRoots.forEach((root) => root.classList.remove("open"));
}

function toggleTopMenu(root) {
  const wasOpen = root.classList.contains("open");
  closeTopMenus();
  if (!wasOpen) {
    root.classList.add("open");
  }
}

function hideContextMenu() {
  contextMenu.classList.add("hidden");
  contextMenu.innerHTML = "";
}

function showContextMenu(clientX, clientY, items) {
  closeTopMenus();
  contextMenu.innerHTML = "";
  items.forEach((item) => {
    if (item?.separator) {
      const sep = document.createElement("hr");
      sep.className = "context-menu-sep";
      contextMenu.appendChild(sep);
      return;
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = item.label;
    btn.disabled = Boolean(item.disabled);
    btn.addEventListener("click", () => {
      hideContextMenu();
      item.action();
    });
    contextMenu.appendChild(btn);
  });

  contextMenu.classList.remove("hidden");
  const rect = contextMenu.getBoundingClientRect();
  const left = Math.min(clientX, window.innerWidth - rect.width - 8);
  const top = Math.min(clientY, window.innerHeight - rect.height - 8);
  contextMenu.style.left = `${Math.max(8, left)}px`;
  contextMenu.style.top = `${Math.max(8, top)}px`;
}

function getNodeById(id) {
  return graph.nodes.find((n) => n.id === id);
}

function getEdgeById(id) {
  return graph.edges.find((e) => e.id === id);
}

function getWidgetById(id) {
  return graph.widgets.find((w) => w.id === id);
}

function nodeExists(id) {
  return graph.nodes.some((n) => n.id === id);
}

function textItemExists(id) {
  return graph.textItems.some((item) => item.id === id);
}

function getTextItemById(id) {
  return graph.textItems.find((item) => item.id === id) || null;
}

function clearAllSelection() {
  requestExpressionEditorSelectionChange(() => {
    ui.selected = null;
    ui.selectedNodes.clear();
    ui.selectedControlPoint = null;
    ui.lastControlPointTap = null;
    refreshSidebar();
  }, "");
}

function syncNodeSelectionFocus() {
  if (ui.selected?.type === "widget") {
    const widget = getWidgetById(ui.selected.id);
    if (!widget) {
      ui.selected = null;
    }
    ui.selectedNodes.clear();
    return;
  }

  ui.selectedNodes = new Set([...ui.selectedNodes].filter(nodeExists));

  if (ui.selected?.type === "edge") {
    ui.selectedNodes.clear();
    return;
  }

  if (ui.selected?.type === "text") {
    const item = getTextItemById(ui.selected.id);
    if (!item) {
      ui.selected = null;
    }
    ui.selectedNodes.clear();
    return;
  }

  if (ui.selectedNodes.size === 1) {
    const id = [...ui.selectedNodes][0];
    ui.selected = { type: "node", id };
  } else {
    if (ui.selected?.type === "node") {
      ui.selected = null;
    }
  }
}

function selectEdge(id) {
  requestExpressionEditorSelectionChange(() => {
    ui.selected = { type: "edge", id };
    ui.selectedNodes.clear();
    ui.selectedControlPoint = null;
    refreshSidebar();
  }, `edge:${id}`);
}

function selectWidget(id) {
  requestExpressionEditorSelectionChange(() => {
    ui.selected = { type: "widget", id };
    ui.selectedNodes.clear();
    ui.selectedControlPoint = null;
    refreshSidebar();
  }, `widget:${id}`);
}

function selectTextItem(id) {
  requestExpressionEditorSelectionChange(() => {
    ui.selected = { type: "text", id };
    ui.selectedNodes.clear();
    ui.selectedControlPoint = null;
    refreshSidebar();
  }, `text:${id}`);
}

function selectSingleNode(id) {
  requestExpressionEditorSelectionChange(() => {
    ui.selected = { type: "node", id };
    ui.selectedNodes = new Set([id]);
    ui.selectedControlPoint = null;
    refreshSidebar();
  }, `node:${id}`);
}

function toggleNodeSelection(id) {
  const nextSelectionKey =
    ui.selectedNodes.size === 1 && ui.selectedNodes.has(id)
      ? ""
      : "";
  requestExpressionEditorSelectionChange(() => {
    if (ui.selectedNodes.has(id)) {
      ui.selectedNodes.delete(id);
    } else {
      ui.selectedNodes.add(id);
    }
    ui.selectedControlPoint = null;
    ui.selected = null;
    syncNodeSelectionFocus();
    refreshSidebar();
  }, nextSelectionKey);
}

function setNodeSelection(ids, additive = false) {
  const nextIds = new Set(additive ? [...ui.selectedNodes] : []);
  ids.forEach((id) => nextIds.add(id));
  const nextSelectionKey = nextIds.size === 1 ? `node:${[...nextIds][0]}` : "";
  requestExpressionEditorSelectionChange(() => {
    if (!additive) {
      ui.selectedNodes.clear();
    }
    ids.forEach((id) => ui.selectedNodes.add(id));
    ui.selected = null;
    ui.selectedControlPoint = null;
    syncNodeSelectionFocus();
    refreshSidebar();
  }, nextSelectionKey);
}

function exportGraphData() {
  return {
    version: 1,
    modelTitle: String(graph.modelTitle ?? ""),
    modelProperties: graph.properties.map((p) => ({ key: String(p.key), value: String(p.value) })),
    nodeCounter,
    edgeCounter,
    widgetCounter,
    textItemCounter,
    execution: {
      t0: graph.execution.t0,
      dt: graph.execution.dt,
      t1: graph.execution.t1,
      delayMs: graph.execution.delayMs,
      decimals: clampDisplayDecimals(graph.execution.decimals),
      integrator: String(graph.execution.integrator ?? "euler"),
      strictDefinitions: Boolean(graph.execution.strictDefinitions),
    },
    nodes: graph.nodes.map((n) => {
      normalizeNodeDescriptionProperty(n);
      const type = serializeNodeType(n.shape);
      const out = {
        id: n.id,
        name: n.name,
        output: Boolean(n.output),
        type,
        x: n.x,
        y: n.y,
        width: n.width,
        height: n.height,
        fillColor: String(n.fillColor ?? ""),
        strokeColor: String(n.strokeColor ?? ""),
        properties: n.properties.map((p) => ({ key: String(p.key), value: String(p.value) })),
      };
      if (type === "algebraic") {
        out.input = Boolean(n.input);
        out.valueExpression = String(n.valueExpression ?? "");
      } else if (type === "state") {
        out.stateTransition = String(n.valueExpression ?? "");
        out.initialState = String(n.initialStateExpression ?? "");
      } else if (type === "submodel") {
        out.modelPath = String(n.modelPath ?? "");
        out.inputBindings = n.inputBindings && typeof n.inputBindings === "object"
          ? Object.fromEntries(
            Object.entries(n.inputBindings)
              .map(([key, value]) => [String(key), String(value ?? "")])
              .filter(([key]) => key.trim()),
          )
          : {};
        out.interfaceCache = n.interfaceCache && typeof n.interfaceCache === "object"
          ? {
            inputs: Array.isArray(n.interfaceCache.inputs) ? n.interfaceCache.inputs.map((value) => String(value)) : [],
            outputs: Array.isArray(n.interfaceCache.outputs) ? n.interfaceCache.outputs.map((value) => String(value)) : [],
          }
          : { inputs: [], outputs: [] };
      } else {
        out.valueExpression = String(n.valueExpression ?? "");
      }
      return out;
    }),
    edges: graph.edges.map((e) => ({
      id: e.id,
      from: e.from,
      to: e.to,
      sourcePort: String(e.sourcePort ?? ""),
      targetPort: String(e.targetPort ?? ""),
      controlPoints: (e.controlPoints || []).map((cp) => ({ x: cp.x, y: cp.y })),
    })),
    textItems: graph.textItems.map((item) => ({
      id: item.id,
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      fillColor: String(item.fillColor ?? ""),
      strokeColor: String(item.strokeColor ?? ""),
      html: String(item.html ?? ""),
    })),
    widgets: graph.widgets.map((w) => ({
      id: w.id,
      type: w.type,
      customTitle: String(w.customTitle ?? ""),
      x: w.x,
      y: w.y,
      width: w.width,
      height: w.height,
      minimized: Boolean(w.minimized),
      outputOnly: Boolean(w.outputOnly),
      showHistory: Boolean(w.showHistory),
      xMin: Number.isFinite(Number(w.xMin)) ? Number(w.xMin) : null,
      xMax: Number.isFinite(Number(w.xMax)) ? Number(w.xMax) : null,
      yMin: Number.isFinite(Number(w.yMin)) ? Number(w.yMin) : null,
      yMax: Number.isFinite(Number(w.yMax)) ? Number(w.yMax) : null,
      showGrid: w.showGrid !== false,
      legendPosition: ["top-right", "top-left", "bottom-right", "bottom-left"].includes(String(w.legendPosition ?? ""))
        ? String(w.legendPosition)
        : "top-right",
      source: String(w.source ?? ""),
      showNumericValues: w.showNumericValues !== false,
      showIndices: w.showIndices !== false,
      autoFitCells: w.autoFitCells !== false,
      cellSize: Number.isFinite(Number(w.cellSize)) ? clamp(Number(w.cellSize), 2, 96) : 28,
      colorScheme: ["blue", "heat", "grayscale", "diverging", "none"].includes(String(w.colorScheme ?? ""))
        ? String(w.colorScheme)
        : "blue",
      min: Number.isFinite(Number(w.min)) ? Number(w.min) : 0,
      max: Number.isFinite(Number(w.max)) ? Number(w.max) : 100,
      step: Number.isFinite(Number(w.step)) ? Number(w.step) : 1,
      value: w.type === "button"
        ? Boolean(w.value)
        : (Number.isFinite(Number(w.value)) ? Number(w.value) : 0),
      columns: Array.isArray(w.columns) ? w.columns.map(normalizeTableColumnName) : [],
      xyPairs: Array.isArray(w.xyPairs)
        ? w.xyPairs.map((pair, idx) => ({
          xSource: String(pair.xSource ?? "time"),
          ySource: String(pair.ySource ?? ""),
          showTimeSeries: normalizeChartSeriesToggle(pair?.showTimeSeries, pair?.seriesMode !== "instant"),
          showInstantProfile: normalizeChartSeriesToggle(pair?.showInstantProfile, pair?.seriesMode === "instant" ? true : false),
          color: /^#[0-9a-fA-F]{6}$/.test(String(pair?.color ?? "")) ? String(pair.color) : defaultChartSeriesColor(idx),
          showLine: pair?.showLine !== false,
          lineWidth: Number.isFinite(Number(pair?.lineWidth)) ? clamp(Number(pair.lineWidth), 1, 8) : 2.2,
          lineStyle: normalizeChartLineStyle(pair?.lineStyle),
          pointMode: normalizeChartPointMode(pair?.pointMode, pair?.showPoints),
          pointSize: Number.isFinite(Number(pair?.pointSize)) ? clamp(Number(pair.pointSize), 1, 12) : 2.4,
        }))
        : [],
    })),
  };
}

function currentSnapshot() {
  return JSON.stringify(exportGraphData());
}

function captureCurrentModelContext(nodeName = "") {
  return {
    data: exportGraphData(),
    currentFileHandle,
    currentFileName,
    currentModelDirectoryHandle,
    lastSavedSnapshot,
    dirtySinceLastSave,
    history: {
      undo: deepClone(history.undo),
      redo: deepClone(history.redo),
    },
    view: {
      zoom: ui.zoom,
      scrollLeft: graphViewport.scrollLeft,
      scrollTop: graphViewport.scrollTop,
    },
    nodeName: String(nodeName || ""),
  };
}

function restoreModelContext(context) {
  if (!context) {
    return;
  }
  stopTimedExecution(false);
  applyGraphData(context.data);
  currentFileHandle = context.currentFileHandle || null;
  currentFileName = context.currentFileName || "";
  currentModelDirectoryHandle = context.currentModelDirectoryHandle || null;
  lastSavedSnapshot = String(context.lastSavedSnapshot || "");
  dirtySinceLastSave = Boolean(context.dirtySinceLastSave);
  history.undo = Array.isArray(context.history?.undo) ? deepClone(context.history.undo) : [];
  history.redo = Array.isArray(context.history?.redo) ? deepClone(context.history.redo) : [];
  history.transactionStart = null;
  clearAllSelection();
  ui.zoom = clampZoom(Number(context.view?.zoom) || 1);
  updateHistoryButtons();
  updateFileStatusLabel(dirtySinceLastSave);
  updateModelBreadcrumb();
  render();
  window.requestAnimationFrame(() => {
    graphViewport.scrollLeft = Number(context.view?.scrollLeft) || 0;
    graphViewport.scrollTop = Number(context.view?.scrollTop) || 0;
  });
}

function markSavedSnapshot() {
  lastSavedSnapshot = currentSnapshot();
  dirtySinceLastSave = false;
  updateFileStatusLabel(false);
}

function hasUnsavedChanges() {
  return currentSnapshot() !== lastSavedSnapshot;
}

function applyGraphData(data) {
  stopTimedExecution(false);
  clearRuntimeSubmodelState();
  ui.submodelsPrepared = false;
  const execCfg = normalizeExecutionConfig(data.execution);
  graph.modelTitle = String(data?.modelTitle ?? "");
  graph.properties = Array.isArray(data?.modelProperties)
    ? data.modelProperties.map((p) => ({ key: String(p?.key ?? ""), value: String(p?.value ?? "") }))
    : [];
  graph.execution = {
    t0: execCfg.t0,
    dt: execCfg.dt,
    t1: execCfg.t1,
    delayMs: execCfg.delayMs,
    decimals: execCfg.decimals,
    integrator: execCfg.integrator,
    strictDefinitions: execCfg.strictDefinitions,
    currentTime: null,
  };

  graph.nodes = data.nodes.map((n) => {
    const shape = deserializeNodeType(n.type);
    const node = {
      id: n.id,
      name: n.name,
      input: shape === "ellipse" ? Boolean(n.input) : false,
      output: Boolean(n.output),
      shape,
      x: n.x,
      y: n.y,
      width: n.width,
      height: n.height,
      fillColor: normalizeColorString(n.fillColor),
      strokeColor: normalizeColorString(n.strokeColor),
      valueExpression: shape === "rect"
        ? String(n.stateTransition ?? "")
        : String(n.valueExpression ?? ""),
      initialStateExpression: shape === "rect"
        ? String(n.initialState ?? "")
        : String(n.initialStateExpression ?? ""),
      modelPath: shape === "submodel" ? String(n.modelPath ?? "") : "",
      inputBindings: shape === "submodel" && n.inputBindings && typeof n.inputBindings === "object"
        ? Object.fromEntries(
          Object.entries(n.inputBindings)
            .map(([key, value]) => [String(key), String(value ?? "")])
            .filter(([key]) => key.trim()),
        )
        : {},
      interfaceCache: shape === "submodel" && n.interfaceCache && typeof n.interfaceCache === "object"
        ? {
          inputs: Array.isArray(n.interfaceCache.inputs) ? n.interfaceCache.inputs.map((value) => String(value)) : [],
          outputs: Array.isArray(n.interfaceCache.outputs) ? n.interfaceCache.outputs.map((value) => String(value)) : [],
        }
        : { inputs: [], outputs: [] },
      submodelError: "",
      computedValue: null,
      computedError: "",
      pendingStateValue: null,
      pendingStateError: "",
      properties: n.properties.map((p) => ({ key: p.key, value: p.value })),
    };
    normalizeNodeDescriptionProperty(node);
    sanitizeNodeVisualOptions(node);
    return node;
  });
  graph.edges = data.edges.map((e) => ({
    id: e.id,
    from: e.from,
    to: e.to,
    sourcePort: String(e.sourcePort ?? ""),
    targetPort: String(e.targetPort ?? ""),
    controlPoints: (e.controlPoints || []).map((cp) => ({ x: cp.x, y: cp.y })),
  }));
  graph.edges.forEach((edge) => sanitizeEdgePorts(edge));
  graph.textItems = Array.isArray(data.textItems)
    ? data.textItems.map((item) => {
      const out = {
        id: item.id,
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
        fillColor: normalizeColorString(item.fillColor),
        strokeColor: normalizeColorString(item.strokeColor),
        html: String(item.html ?? ""),
      };
      sanitizeTextItem(out);
      return out;
    })
    : [];
  graph.widgets = Array.isArray(data.widgets)
    ? data.widgets
      .filter((w) => Number.isInteger(w.id) && (w.type === "table" || w.type === "xychart" || w.type === "slider" || w.type === "matrix" || w.type === "button" || w.type === "led"))
      .map((w) => ({
        id: w.id,
        type: w.type,
        customTitle: String(w.customTitle ?? ""),
        x: Number.isFinite(Number(w.x)) ? Number(w.x) : 40,
        y: Number.isFinite(Number(w.y)) ? Number(w.y) : 40,
        width: clamp(Number(w.width) || 320, 220, 1200),
        height: clamp(Number(w.height) || 160, 110, 900),
        minimized: Boolean(w.minimized),
        outputOnly: Boolean(w.outputOnly),
        showHistory: Boolean(w.showHistory),
        xMin: Number.isFinite(Number(w.xMin)) ? Number(w.xMin) : null,
        xMax: Number.isFinite(Number(w.xMax)) ? Number(w.xMax) : null,
        yMin: Number.isFinite(Number(w.yMin)) ? Number(w.yMin) : null,
        yMax: Number.isFinite(Number(w.yMax)) ? Number(w.yMax) : null,
        showGrid: w.showGrid !== false,
        legendPosition: ["top-right", "top-left", "bottom-right", "bottom-left"].includes(String(w.legendPosition ?? ""))
          ? String(w.legendPosition)
          : "top-right",
        source: String(w.source ?? ""),
        showNumericValues: w.showNumericValues !== false,
        showIndices: w.showIndices !== false,
        autoFitCells: w.autoFitCells !== false,
        cellSize: Number.isFinite(Number(w.cellSize)) ? clamp(Number(w.cellSize), 2, 96) : 28,
        colorScheme: ["blue", "heat", "grayscale", "diverging", "none"].includes(String(w.colorScheme ?? ""))
          ? String(w.colorScheme)
          : "blue",
        min: Number.isFinite(Number(w.min)) ? Number(w.min) : 0,
        max: Number.isFinite(Number(w.max)) ? Number(w.max) : 100,
        step: Number.isFinite(Number(w.step)) ? Number(w.step) : 1,
        value: w.type === "button"
          ? (w.value === true || w.value === "true" || w.value === 1 || w.value === "1")
          : (Number.isFinite(Number(w.value)) ? Number(w.value) : 0),
        rows: [],
        columns: Array.isArray(w.columns) ? w.columns.map(normalizeTableColumnName) : [],
        xyPairs: Array.isArray(w.xyPairs)
          ? w.xyPairs.map((pair, idx) => ({
            xSource: String(pair.xSource ?? "time"),
            ySource: String(pair.ySource ?? ""),
            showTimeSeries: normalizeChartSeriesToggle(pair?.showTimeSeries, pair?.seriesMode !== "instant"),
            showInstantProfile: normalizeChartSeriesToggle(pair?.showInstantProfile, pair?.seriesMode === "instant" ? true : false),
            color: /^#[0-9a-fA-F]{6}$/.test(String(pair?.color ?? "")) ? String(pair.color) : defaultChartSeriesColor(idx),
            showLine: pair?.showLine !== false,
            lineWidth: Number.isFinite(Number(pair?.lineWidth)) ? clamp(Number(pair.lineWidth), 1, 8) : 2.2,
            lineStyle: normalizeChartLineStyle(pair?.lineStyle),
            pointMode: normalizeChartPointMode(pair?.pointMode, pair?.showPoints),
            pointSize: Number.isFinite(Number(pair?.pointSize)) ? clamp(Number(pair.pointSize), 1, 12) : 2.4,
            points: [],
          }))
          : (() => {
            const legacyX = String(w.xSource ?? w.xNode ?? "time");
            const legacyYNodes = Array.isArray(w.yNodes)
              ? w.yNodes.map((n) => String(n))
              : (w.yNode ? [String(w.yNode)] : []);
            return legacyYNodes.map((yNode, idx) => ({
              xSource: legacyX,
              ySource: yNode,
              showTimeSeries: true,
              showInstantProfile: false,
              color: defaultChartSeriesColor(idx),
              showLine: true,
              lineWidth: 2.2,
              lineStyle: "solid",
              pointMode: "all",
              pointSize: 2.4,
              points: [],
            }));
          })(),
      }))
    : [];

  nodeCounter = Number(data.nodeCounter) || 1;
  edgeCounter = Number(data.edgeCounter) || 1;
  widgetCounter = Number(data.widgetCounter) || 1;
  textItemCounter = Number(data.textItemCounter) || 1;
  normalizeInputNodeFlags();
  initializeStateNodes(graph.execution.t0);

  ui.drag = null;
  ui.resize = null;
  ui.edgeCreate = null;
  ui.edgeCreateHoverId = null;
  ui.edgeCreateLastPoint = null;
  ui.controlPointDrag = null;
  ui.marquee = null;
  ui.widgetDrag = null;
  ui.widgetResize = null;
  ui.textDrag = null;
  ui.textResize = null;
  invalidateExecutionPlan();
  clearAllSelection();
}

function pushUndoState(state) {
  history.undo.push(deepClone(state));
  if (history.undo.length > MAX_HISTORY) {
    history.undo.shift();
  }
}

function invalidateExecutionPlan() {
  ui.executionPlan = null;
  ui.submodelsPrepared = false;
}

function beginTransaction() {
  if (!history.transactionStart) {
    history.transactionStart = exportGraphData();
  }
}

function commitTransaction() {
  if (!history.transactionStart) {
    return;
  }

  const before = JSON.stringify(history.transactionStart);
  const afterState = exportGraphData();
  const after = JSON.stringify(afterState);
  if (before !== after) {
    pushUndoState(history.transactionStart);
    history.redo = [];
    dirtySinceLastSave = true;
    invalidateExecutionPlan();
    updateFileStatusLabel(true);
  }
  history.transactionStart = null;
  updateHistoryButtons();
}

function cancelTransaction() {
  history.transactionStart = null;
}

function runAction(mutator) {
  if (isExecutionFrozen()) {
    resetExecution();
  }
  beginTransaction();
  mutator();
  commitTransaction();
  render();
}

function updateHistoryButtons() {
  const frozen = isExecutionFrozen();
  undoBtn.disabled = frozen || history.undo.length === 0;
  redoBtn.disabled = frozen || history.redo.length === 0;
  pasteBtn.disabled = frozen || !clipboard.data;
}

function hasClipboardSelection() {
  return ui.selectedNodes.size > 0;
}

function hasAnySelection() {
  return Boolean(
    ui.selectedNodes.size > 0 ||
    ui.selectedControlPoint ||
    ui.selected?.type === "edge" ||
    ui.selected?.type === "widget" ||
    ui.selected?.type === "text",
  );
}

function updateEditActionButtons() {
  const frozen = isExecutionFrozen();
  if (selectAllBtn) {
    selectAllBtn.disabled = graph.nodes.length === 0;
  }
  if (cutBtn) {
    cutBtn.disabled = frozen || !hasClipboardSelection();
  }
  if (copyBtn) {
    copyBtn.disabled = !hasClipboardSelection();
  }
  if (deleteBtn) {
    deleteBtn.disabled = frozen || !hasAnySelection();
  }
}

function isExecutionFrozen() {
  if (ui.timedRunHandle != null || ui.timedStepRunning) {
    return true;
  }
  if (graph.execution.currentTime == null) {
    return false;
  }
  const t0 = Number(graph.execution.t0);
  const dt = Number(graph.execution.dt);
  const t1 = Number(graph.execution.t1);
  if (!Number.isFinite(t0) || !Number.isFinite(dt) || !Number.isFinite(t1) || dt === 0) {
    return false;
  }
  if ((dt > 0 && t0 > t1) || (dt < 0 && t0 < t1)) {
    return false;
  }
  return !isExecutionEnded({ t0, dt, t1 });
}

function isEditingUiLocked() {
  return ui.timedRunHandle != null || ui.timedStepRunning;
}

function setControlsDisabled(root, disabled, allowedControls = []) {
  if (!root) {
    return;
  }
  const allowed = new Set((allowedControls || []).filter(Boolean));
  root.querySelectorAll("input, select, textarea, button").forEach((control) => {
    if (allowed.has(control)) {
      return;
    }
    if (disabled) {
      if (!control.disabled) {
        control.dataset.executionDisabled = "1";
        control.disabled = true;
      }
      return;
    }
    if (control.dataset.executionDisabled === "1") {
      control.disabled = false;
      delete control.dataset.executionDisabled;
    }
  });
}

function updateEditingLockUi() {
  const frozen = isEditingUiLocked();
  sidebar?.classList.toggle("execution-frozen", frozen);
  [globalPanel, nodePanel, textPanel, edgePanel, widgetPanel].forEach((panel) => {
    panel?.classList.toggle("execution-frozen", frozen);
  });
  [
    addRectNodeItem,
    addEllipseNodeItem,
    addDiamondNodeItem,
    addSubmodelNodeItem,
    addTextItem,
  addButtonWidgetItem,
  addSliderWidgetItem,
  addMatrixWidgetItem,
    addTableWidgetItem,
    addXYChartWidgetItem,
  ].forEach((btn) => {
    if (btn) {
      btn.disabled = frozen;
    }
  });

  setControlsDisabled(globalPanel, frozen, [runFullModelBtn, manualStepBtn, timedToggleBtn, resetExecBtn]);
  setControlsDisabled(nodePanel, frozen);
  setControlsDisabled(textPanel, frozen);
  setControlsDisabled(edgePanel, frozen);
  setControlsDisabled(widgetPanel, frozen);

  if (expressionEditorTextarea) {
    expressionEditorTextarea.disabled = frozen;
  }
  if (expressionSymbolsFilter) {
    expressionSymbolsFilter.disabled = frozen;
  }
  if (expressionEditorApplyBtn) {
    expressionEditorApplyBtn.disabled = frozen || Boolean(ui.expressionEditor && !ui.expressionEditor.syntaxOk);
  }
  if (runStrictDefinitionsInput) {
    runStrictDefinitionsInput.disabled = frozen;
  }
}

function collectSelectedForClipboard() {
  if (ui.selectedNodes.size === 0) {
    return null;
  }
  const ids = new Set(ui.selectedNodes);
  const nodes = graph.nodes
    .filter((n) => ids.has(n.id))
    .map((n) => ({
      id: n.id,
      name: n.name,
      input: Boolean(n.input),
      output: Boolean(n.output),
      shape: n.shape,
      x: n.x,
      y: n.y,
      width: n.width,
      height: n.height,
      fillColor: String(n.fillColor ?? ""),
      strokeColor: String(n.strokeColor ?? ""),
      valueExpression: n.valueExpression,
      initialStateExpression: n.initialStateExpression,
      modelPath: n.modelPath,
      inputBindings: deepClone(n.inputBindings || {}),
      interfaceCache: deepClone(n.interfaceCache || { inputs: [], outputs: [] }),
      computedValue: n.computedValue,
      computedError: n.computedError,
      pendingStateValue: n.pendingStateValue,
      pendingStateError: n.pendingStateError,
      properties: n.properties.map((p) => ({ key: p.key, value: p.value })),
    }));
  const edges = graph.edges
    .filter((e) => ids.has(e.from) && ids.has(e.to))
    .map((e) => ({
      from: e.from,
      to: e.to,
      sourcePort: String(e.sourcePort ?? ""),
      targetPort: String(e.targetPort ?? ""),
      controlPoints: (e.controlPoints || []).map((cp) => ({ x: cp.x, y: cp.y })),
    }));
  return { nodes, edges };
}

function copySelectionToClipboard() {
  const payload = collectSelectedForClipboard();
  if (!payload || payload.nodes.length === 0) {
    setStatusKey("status.clipboardNothingToCopy");
    return false;
  }
  clipboard.data = deepClone(payload);
  clipboard.pasteCount = 0;
  updateHistoryButtons();
  setStatusKey("status.clipboardCopied", { count: payload.nodes.length });
  return true;
}

function cutSelectionToClipboard() {
  const copied = copySelectionToClipboard();
  if (!copied) {
    return;
  }
  removeSelected();
  setStatusKey("status.clipboardCut");
}

function pasteFromClipboard() {
  if (!clipboard.data || !Array.isArray(clipboard.data.nodes) || clipboard.data.nodes.length === 0) {
    setStatusKey("status.clipboardEmpty");
    return;
  }
  if (isExecutionFrozen()) {
    resetExecution();
  }

  const offset = 30 * (clipboard.pasteCount + 1);
  let pastedCount = 0;
  runAction(() => {
    const idMap = new Map();
    const newNodeIds = [];

    clipboard.data.nodes.forEach((n) => {
      const newId = nodeCounter++;
      const uniqueName = semantics.makeUniqueName(graph.nodes, n.name, null, "n");
      const node = {
        id: newId,
        name: uniqueName,
        input: Boolean(n.input),
        output: Boolean(n.output),
        shape: n.shape,
        x: snap(n.x + offset),
        y: snap(n.y + offset),
        width: n.width,
        height: n.height,
        fillColor: normalizeColorString(n.fillColor),
        strokeColor: normalizeColorString(n.strokeColor),
        valueExpression: String(n.valueExpression ?? ""),
        initialStateExpression: String(n.initialStateExpression ?? ""),
        modelPath: String(n.modelPath ?? ""),
        inputBindings: deepClone(n.inputBindings || {}),
        interfaceCache: deepClone(n.interfaceCache || { inputs: [], outputs: [] }),
        submodelError: "",
        computedValue: n.computedValue ?? null,
        computedError: String(n.computedError ?? ""),
        pendingStateValue: n.pendingStateValue ?? null,
        pendingStateError: String(n.pendingStateError ?? ""),
        properties: (n.properties || []).map((p) => ({ key: String(p.key), value: String(p.value) })),
      };
      normalizeNodeDescriptionProperty(node);
      sanitizeNodeVisualOptions(node);
      graph.nodes.push(node);
      idMap.set(n.id, newId);
      newNodeIds.push(newId);
    });

    clipboard.data.edges.forEach((e) => {
      const from = idMap.get(e.from);
      const to = idMap.get(e.to);
      if (!from || !to || from === to) {
        return;
      }
      graph.edges.push({
        id: edgeCounter++,
        from,
        to,
        sourcePort: String(e.sourcePort ?? ""),
        targetPort: String(e.targetPort ?? ""),
        controlPoints: (e.controlPoints || []).map((cp) => ({
          x: snap(cp.x + offset),
          y: snap(cp.y + offset),
        })),
      });
      sanitizeEdgePorts(graph.edges[graph.edges.length - 1]);
    });

    normalizeInputNodeFlags();
    setNodeSelection(newNodeIds, false);
    pastedCount = newNodeIds.length;
  });

  clipboard.pasteCount += 1;
  updateHistoryButtons();
  setStatusKey("status.clipboardPasted", { count: pastedCount });
}

function undo() {
  if (history.undo.length === 0) {
    return;
  }
  if (isExecutionFrozen()) {
    resetExecution();
  }
  const current = exportGraphData();
  history.redo.push(current);
  const prev = history.undo.pop();
  applyGraphData(prev);
  render();
  setStatusKey("status.undo");
  updateHistoryButtons();
}

function redo() {
  if (history.redo.length === 0) {
    return;
  }
  if (isExecutionFrozen()) {
    resetExecution();
  }
  const current = exportGraphData();
  pushUndoState(current);
  const next = history.redo.pop();
  applyGraphData(next);
  render();
  setStatusKey("status.redo");
  updateHistoryButtons();
}

function diamondPoints(node) {
  const w = node.width / 2;
  const h = node.height / 2;
  return [
    `${node.x},${node.y - h}`,
    `${node.x + w},${node.y}`,
    `${node.x},${node.y + h}`,
    `${node.x - w},${node.y}`,
  ].join(" ");
}

function nodeBoundaryPoint(node, targetX, targetY) {
  const dx = targetX - node.x;
  const dy = targetY - node.y;
  if (dx === 0 && dy === 0) {
    return { x: node.x, y: node.y };
  }

  const hw = node.width / 2;
  const hh = node.height / 2;
  let scale = 1;

  if (node.shape === "ellipse") {
    const denom = Math.sqrt((dx * dx) / (hw * hw) + (dy * dy) / (hh * hh)) || 1;
    scale = 1 / denom;
  } else if (node.shape === "diamond") {
    const denom = Math.abs(dx) / hw + Math.abs(dy) / hh || 1;
    scale = 1 / denom;
  } else {
    const denom = Math.max(Math.abs(dx) / hw, Math.abs(dy) / hh) || 1;
    scale = 1 / denom;
  }

  return {
    x: node.x + dx * scale,
    y: node.y + dy * scale,
  };
}

function buildSplinePath(points) {
  if (points.length < 2) {
    return "";
  }
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }
  if (points.length === 3) {
    return `M ${points[0].x} ${points[0].y} Q ${points[1].x} ${points[1].y} ${points[2].x} ${points[2].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const p = points[i];
    const next = points[i + 1];
    if (i < points.length - 2) {
      const mx = (p.x + next.x) / 2;
      const my = (p.y + next.y) / 2;
      d += ` Q ${p.x} ${p.y} ${mx} ${my}`;
    } else {
      d += ` Q ${p.x} ${p.y} ${next.x} ${next.y}`;
    }
  }
  return d;
}

function buildEdgeGeometry(edge) {
  const fromNode = getNodeById(edge.from);
  const toNode = getNodeById(edge.to);
  if (!fromNode || !toNode) {
    return null;
  }

  const cps = edge.controlPoints || [];
  const firstTarget = cps[0] || { x: toNode.x, y: toNode.y };
  const lastTarget = cps[cps.length - 1] || { x: fromNode.x, y: fromNode.y };

  const start = nodeBoundaryPoint(fromNode, firstTarget.x, firstTarget.y);
  const end = nodeBoundaryPoint(toNode, lastTarget.x, lastTarget.y);
  const points = [start, ...cps, end];

  const path = buildSplinePath(points);

  return { path, points };
}

function getSubmodelEdgePortChoices(node, side) {
  if (!node || !isSubmodelNode(node)) {
    return [];
  }
  const values = side === "target" ? node.interfaceCache?.inputs : node.interfaceCache?.outputs;
  return Array.isArray(values) ? values.map((value) => String(value).trim()).filter(Boolean) : [];
}

function sanitizeEdgePorts(edge) {
  if (!edge) {
    return;
  }
  const sourceChoices = getSubmodelEdgePortChoices(getNodeById(edge.from), "source");
  const targetChoices = getSubmodelEdgePortChoices(getNodeById(edge.to), "target");

  if (sourceChoices.length === 1 && !String(edge.sourcePort ?? "").trim()) {
    edge.sourcePort = sourceChoices[0];
  }
  if (targetChoices.length === 1 && !String(edge.targetPort ?? "").trim()) {
    edge.targetPort = targetChoices[0];
  }

  if (!sourceChoices.includes(String(edge.sourcePort ?? "").trim())) {
    edge.sourcePort = "";
  }
  if (!targetChoices.includes(String(edge.targetPort ?? "").trim())) {
    edge.targetPort = "";
  }
}

function addNode(shape, atPoint = null) {
  const id = nodeCounter++;
  const px = snap(atPoint ? atPoint.x : 180 + (id % 5) * 120);
  const py = snap(atPoint ? atPoint.y : 140 + Math.floor(id / 5) * 90);
  const defaultName = semantics.makeUniqueName(graph.nodes, t("node.defaultName", { id }), null, "n");
  const node = {
    id,
    name: defaultName,
    input: false,
    output: false,
    shape,
    x: px,
    y: py,
    width: 120,
    height: 70,
    fillColor: "",
    strokeColor: "",
    valueExpression: "",
    initialStateExpression: "",
    modelPath: "",
    inputBindings: {},
    interfaceCache: { inputs: [], outputs: [] },
    submodelError: "",
    computedValue: null,
    computedError: "",
    pendingStateValue: null,
    pendingStateError: "",
    properties: [],
  };
  normalizeNodeDescriptionProperty(node);
  sanitizeNodeVisualOptions(node);
  graph.nodes.push(node);
  selectSingleNode(node.id);
}

function addEdge(fromId, toId) {
  if (fromId === toId) {
    setStatusKey("error.edgeDifferentNodes");
    return null;
  }

  const targetNode = getNodeById(toId);
  if (targetNode?.shape === "diamond") {
    setStatusKey("error.parameterIncomingEdge");
    return null;
  }

  const exists = graph.edges.some((e) => e.from === fromId && e.to === toId);
  if (exists) {
    setStatusKey("error.edgeExists");
    return null;
  }

  const edge = {
    id: edgeCounter++,
    from: fromId,
    to: toId,
    sourcePort: "",
    targetPort: "",
    controlPoints: [],
  };
  graph.edges.push(edge);
  sanitizeEdgePorts(edge);
  if (targetNode?.input) {
    removeNodeFromInputWidgetBindings(targetNode.name);
    targetNode.input = false;
  }
  selectEdge(edge.id);
  return edge;
}


function refreshSidebar() {
  syncNodeSelectionFocus();
  syncExpressionEditorToSelectedNode();
  updateDeleteActionLabel();
  updateEditActionButtons();

  if (ui.selected?.type === "edge") {
    delete propsList.dataset.ownerKey;
    noSelection.classList.add("hidden");
    globalPanel.classList.add("hidden");
    textPanel.classList.add("hidden");
    widgetPanel.classList.add("hidden");
    nodePanel.classList.add("hidden");
    edgePanel.classList.remove("hidden");

    const edgeId = ui.selected.id;
    const edge = getEdgeById(edgeId);
    if (!edge) {
      clearAllSelection();
      refreshSidebar();
      return;
    }

    const from = getNodeById(edge.from);
    const to = getNodeById(edge.to);
    sanitizeEdgePorts(edge);
    edgeInfo.innerHTML = "";

    const summary = document.createElement("div");
    summary.textContent = `${from?.name || edge.from} -> ${to?.name || edge.to}`;
    edgeInfo.appendChild(summary);

    const sourceChoices = getSubmodelEdgePortChoices(from, "source");
    if (sourceChoices.length > 0) {
      const sourceWrap = document.createElement("div");
      sourceWrap.className = "widget-config-grid";
      const sourceLabel = document.createElement("label");
      sourceLabel.textContent = t("label.edgeSourcePort");
      const sourceSelect = document.createElement("select");
      const emptyOpt = document.createElement("option");
      emptyOpt.value = "";
      emptyOpt.textContent = t("text.edgePortAuto");
      sourceSelect.appendChild(emptyOpt);
      sourceChoices.forEach((name) => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        sourceSelect.appendChild(opt);
      });
      sourceSelect.value = String(edge.sourcePort ?? "");
      sourceSelect.addEventListener("change", () => {
        runAction(() => {
          edge.sourcePort = String(sourceSelect.value || "");
          sanitizeEdgePorts(edge);
        });
      });
      sourceWrap.appendChild(sourceLabel);
      sourceWrap.appendChild(sourceSelect);
      edgeInfo.appendChild(sourceWrap);
    }

    const targetChoices = getSubmodelEdgePortChoices(to, "target");
    if (targetChoices.length > 0) {
      const targetWrap = document.createElement("div");
      targetWrap.className = "widget-config-grid";
      const targetLabel = document.createElement("label");
      targetLabel.textContent = t("label.edgeTargetPort");
      const targetSelect = document.createElement("select");
      const emptyOpt = document.createElement("option");
      emptyOpt.value = "";
      emptyOpt.textContent = t("text.edgePortAuto");
      targetSelect.appendChild(emptyOpt);
      targetChoices.forEach((name) => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        targetSelect.appendChild(opt);
      });
      targetSelect.value = String(edge.targetPort ?? "");
      targetSelect.addEventListener("change", () => {
        runAction(() => {
          edge.targetPort = String(targetSelect.value || "");
          sanitizeEdgePorts(edge);
        });
      });
      targetWrap.appendChild(targetLabel);
      targetWrap.appendChild(targetSelect);
      edgeInfo.appendChild(targetWrap);
    }
    return;
  }

  if (ui.selected?.type === "widget") {
    ui.sidebarNodeId = null;
    delete propsList.dataset.ownerKey;
    noSelection.classList.add("hidden");
    globalPanel.classList.add("hidden");
    textPanel.classList.add("hidden");
    nodePanel.classList.add("hidden");
    edgePanel.classList.add("hidden");
    widgetPanel.classList.remove("hidden");
    const widget = getWidgetById(ui.selected.id);
    if (!widget) {
      clearAllSelection();
      refreshSidebar();
      return;
    }
    if (widgetPanelTitle) {
      widgetPanelTitle.textContent = widget.type === "xychart"
        ? t("panel.widgetChart")
        : (widget.type === "slider"
          ? t("panel.widgetSlider")
          : (widget.type === "button"
            ? t("panel.widgetButton")
            : (widget.type === "led"
              ? t("panel.widgetLed")
              : (widget.type === "matrix" ? t("panel.widgetMatrix") : t("panel.widgetTable")))));
    }
    refreshWidgetConfigPanel(widget);
    return;
  }

  if (ui.selected?.type === "text") {
    ui.sidebarNodeId = null;
    delete propsList.dataset.ownerKey;
    noSelection.classList.add("hidden");
    globalPanel.classList.add("hidden");
    nodePanel.classList.add("hidden");
    edgePanel.classList.add("hidden");
    widgetPanel.classList.add("hidden");
    textPanel.classList.remove("hidden");
    const item = getTextItemById(ui.selected.id);
    if (!item) {
      clearAllSelection();
      refreshSidebar();
      return;
    }
    if (document.activeElement !== textWidthInput) {
      textWidthInput.value = String(item.width);
    }
    if (document.activeElement !== textHeightInput) {
      textHeightInput.value = String(item.height);
    }
    if (document.activeElement !== textFillColorInput && textFillColorInput) {
      textFillColorInput.value = item.fillColor || "";
    }
    if (document.activeElement !== textStrokeColorInput && textStrokeColorInput) {
      textStrokeColorInput.value = item.strokeColor || "";
    }
    if (document.activeElement !== textHtmlInput) {
      textHtmlInput.value = String(item.html ?? "");
    }
    return;
  }

  if (ui.selectedNodes.size === 1) {
    const nodeId = [...ui.selectedNodes][0];
    const node = getNodeById(nodeId);
    if (!node) {
      clearAllSelection();
      refreshSidebar();
      return;
    }

    noSelection.classList.add("hidden");
    globalPanel.classList.add("hidden");
    textPanel.classList.add("hidden");
    widgetPanel.classList.add("hidden");
    nodePanel.classList.remove("hidden");
    edgePanel.classList.add("hidden");

    const sameSidebarNode = ui.sidebarNodeId === node.id;

    if (!sameSidebarNode || document.activeElement !== nodeNameInput) {
      nodeNameInput.value = node.name;
    }
    if (!sameSidebarNode || document.activeElement !== nodeShapeInput) {
      nodeShapeInput.value = node.shape;
    }
    const showInputToggle = canMarkNodeAsInput(node);
    const submodelNode = isSubmodelNode(node);
    nodeInputInput.checked = Boolean(node.input);
    nodeOutputInput.checked = Boolean(node.output);
    sanitizeNodeVisualOptions(node);
    if (nodeFillColorInput) {
      nodeFillColorInput.value = node.fillColor || "";
    }
    if (nodeStrokeColorInput) {
      nodeStrokeColorInput.value = node.strokeColor || "";
    }
    if (nodeInputLabel) {
      nodeInputLabel.classList.toggle("hidden", !showInputToggle);
    }
    nodeInputInput.disabled = !showInputToggle;
    const stateNode = isStateNode(node);
    const parameterNode = node.shape === "diamond";
    if (nodeOutputInput?.closest("label")) {
      nodeOutputInput.closest("label").classList.toggle("hidden", submodelNode);
    }
    if (submodelNode && !sameSidebarNode) {
      nodeOutputInput.checked = false;
    }
    if (nodeModelPathLabel) {
      nodeModelPathLabel.classList.toggle("hidden", !submodelNode);
    }
    if (nodeModelPathInput) {
      nodeModelPathInput.classList.toggle("hidden", !submodelNode);
      if (submodelNode && (!sameSidebarNode || document.activeElement !== nodeModelPathInput)) {
        nodeModelPathInput.value = node.modelPath || "";
      }
    }
    if (submodelActionRow) {
      submodelActionRow.classList.toggle("hidden", !submodelNode);
    }
    if (loadSubmodelBtn) {
      loadSubmodelBtn.classList.toggle("hidden", !submodelNode);
      loadSubmodelBtn.disabled = !submodelNode;
    }
    if (showSubmodelBtn) {
      showSubmodelBtn.classList.toggle("hidden", !submodelNode);
      showSubmodelBtn.disabled = !submodelNode || !canShowSubmodelNode(node);
    }
    if (nodeSubmodelInfo) {
      if (submodelNode) {
        if (
          (!Array.isArray(node.interfaceCache?.inputs) || node.interfaceCache.inputs.length === 0) &&
          (!Array.isArray(node.interfaceCache?.outputs) || node.interfaceCache.outputs.length === 0) &&
          String(node.modelPath ?? "").trim() &&
          !node.submodelError
        ) {
          void refreshSubmodelInterface(node, false, { allowPrompt: false });
        }
        const summary = node.submodelError
          ? t("text.submodelError", { reason: node.submodelError })
          : submodelInterfaceSummary(node);
        nodeSubmodelInfo.textContent = summary;
        nodeSubmodelInfo.classList.remove("hidden");
        nodeSubmodelInfo.classList.toggle("error", Boolean(node.submodelError));
        nodeSubmodelInfo.classList.toggle("ok", !node.submodelError);
      } else {
        nodeSubmodelInfo.classList.add("hidden");
        nodeSubmodelInfo.classList.remove("error", "ok");
        nodeSubmodelInfo.textContent = "";
      }
    }
    renderSubmodelBindingsEditor(submodelNode ? node : null);
    if (nodeValueExprLabel) {
      nodeValueExprLabel.textContent = parameterNode
        ? t("label.value")
        : (stateNode ? t("label.stateTransition") : t("label.behaviorFunction"));
    }
    updateNodeExpressionTooltips(node);
    if (!submodelNode && (!sameSidebarNode || document.activeElement !== nodeValueExprInput)) {
      nodeValueExprInput.value = node.valueExpression || "";
    }
    nodeValueExprLabel.classList.toggle("hidden", submodelNode);
    nodeValueExprRow?.classList.toggle("hidden", submodelNode);
    nodeValueExprStatus.classList.toggle("hidden", submodelNode);
    if (!submodelNode) {
      updateExpressionFieldState(nodeValueExprInput, nodeValueExprStatus, node.valueExpression || "", false, "value");
    } else {
      nodeValueExprInput.classList.remove("invalid");
      hideExpressionStatus(nodeValueExprStatus);
    }
    if (nodeInitialStateLabel) {
      nodeInitialStateLabel.classList.toggle("hidden", !stateNode || submodelNode);
    }
    if (nodeInitialStateInput) {
      nodeInitialStateRow?.classList.toggle("hidden", !stateNode || submodelNode);
      nodeInitialStateInput.classList.toggle("hidden", !stateNode || submodelNode);
      if (editNodeInitialStateBtn) {
        editNodeInitialStateBtn.classList.toggle("hidden", !stateNode || submodelNode);
      }
      if (nodeInitialStateStatus) {
        nodeInitialStateStatus.classList.toggle("hidden", !stateNode || submodelNode);
      }
      if (stateNode && !submodelNode && (!sameSidebarNode || document.activeElement !== nodeInitialStateInput)) {
        nodeInitialStateInput.value = node.initialStateExpression || "";
      }
      if (stateNode && !submodelNode) {
        updateExpressionFieldState(nodeInitialStateInput, nodeInitialStateStatus, node.initialStateExpression || "", false, "initial");
      } else {
        nodeInitialStateInput.classList.remove("invalid");
        hideExpressionStatus(nodeInitialStateStatus);
      }
    }
    const definitionIssue = validateNodeDefinition(node);
    nodeValueOutput.classList.remove("ok", "error");
    if (graph.execution.strictDefinitions && !definitionIssue.ok) {
      nodeValueOutput.textContent = "-";
    } else if (node.computedError) {
      nodeValueOutput.textContent = t("text.valueError", { reason: evalReasonText(node.computedError) });
      nodeValueOutput.classList.add("error");
    } else {
      nodeValueOutput.textContent = formatComputedValue(node.computedValue);
      if (node.computedValue != null) {
        nodeValueOutput.classList.add("ok");
      }
    }

    normalizeNodeDescriptionProperty(node);
    if (renderPropertiesEditor(
      propsList,
      node.properties,
      `node:${node.id}`,
      (idx) => {
        node.properties.splice(idx, 1);
      },
      {
        isLockedKey: (prop) => descriptionPropertyKeys().has(String(prop?.key ?? "").trim().toLowerCase()),
      },
    )) {
      ui.sidebarNodeId = node.id;
      return;
    }
    ui.sidebarNodeId = node.id;
    return;
  }

  ui.sidebarNodeId = null;
  nodePanel.classList.add("hidden");
  textPanel.classList.add("hidden");
  edgePanel.classList.add("hidden");
  widgetPanel.classList.add("hidden");
  if (nodeValueExprLabel) {
    nodeValueExprLabel.textContent = t("label.behaviorFunction");
  }
  updateNodeExpressionTooltips(null);
  nodeValueExprInput.classList.remove("invalid");
  nodeInitialStateInput.classList.remove("invalid");
  hideExpressionStatus(nodeValueExprStatus);
  hideExpressionStatus(nodeInitialStateStatus);
  nodeInputInput.checked = false;
  if (nodeInputLabel) {
    nodeInputLabel.classList.add("hidden");
  }
  nodeInputInput.disabled = true;
  if (nodeInitialStateLabel) {
    nodeInitialStateLabel.classList.add("hidden");
  }
  if (nodeModelPathLabel) {
    nodeModelPathLabel.classList.add("hidden");
  }
  if (nodeModelPathInput) {
    nodeModelPathInput.classList.add("hidden");
  }
  if (submodelActionRow) {
    submodelActionRow.classList.add("hidden");
  }
  if (loadSubmodelBtn) {
    loadSubmodelBtn.classList.add("hidden");
    loadSubmodelBtn.disabled = true;
  }
  if (showSubmodelBtn) {
    showSubmodelBtn.classList.add("hidden");
    showSubmodelBtn.disabled = true;
  }
  if (nodeSubmodelInfo) {
    nodeSubmodelInfo.classList.add("hidden");
    nodeSubmodelInfo.classList.remove("error", "ok");
    nodeSubmodelInfo.textContent = "";
  }
  renderSubmodelBindingsEditor(null);
  if (nodeOutputInput?.closest("label")) {
    nodeOutputInput.closest("label").classList.remove("hidden");
  }
  nodeValueExprLabel.classList.remove("hidden");
  nodeValueExprRow?.classList.remove("hidden");
  if (nodeInitialStateInput) {
    nodeInitialStateRow?.classList.add("hidden");
    nodeInitialStateInput.classList.add("hidden");
  }
  if (widgetPanelTitle) {
    widgetPanelTitle.textContent = t("panel.widget");
  }
  delete propsList.dataset.ownerKey;

  if (ui.selectedNodes.size > 1) {
    globalPanel.classList.add("hidden");
    noSelection.classList.remove("hidden");
    noSelection.textContent = t("text.nodesSelected", { count: ui.selectedNodes.size });
  } else {
    noSelection.classList.add("hidden");
    globalPanel.classList.remove("hidden");
    if (document.activeElement !== modelTitleInput) {
      modelTitleInput.value = String(graph.modelTitle ?? "");
    }
    if (document.activeElement !== timeStartInput) {
      timeStartInput.value = String(graph.execution.t0);
    }
    if (document.activeElement !== timeStepInput) {
      timeStepInput.value = String(graph.execution.dt);
    }
    if (document.activeElement !== timeEndInput) {
      timeEndInput.value = String(graph.execution.t1);
    }
    if (document.activeElement !== timeDelayInput) {
      timeDelayInput.value = String(graph.execution.delayMs);
    }
    if (decimalDigitsInput && document.activeElement !== decimalDigitsInput) {
      decimalDigitsInput.value = String(clampDisplayDecimals(graph.execution.decimals));
    }
    if (document.activeElement !== integratorInput) {
      integratorInput.value = String(graph.execution.integrator ?? "euler");
    }
    if (strictDefinitionsInput) {
      strictDefinitionsInput.checked = Boolean(graph.execution.strictDefinitions);
    }
    if (zoomRangeInput && document.activeElement !== zoomRangeInput) {
      zoomRangeInput.value = String(Math.round(ui.zoom * 100));
    }
    if (zoomRangeValue) {
      zoomRangeValue.textContent = `${Math.round(ui.zoom * 100)}%`;
    }
    timeCurrentOutput.textContent =
      graph.execution.currentTime == null
        ? formatNumberValue(Number(graph.execution.t0))
        : formatNumberValue(Number(graph.execution.currentTime));
    renderPropertiesEditor(
      modelPropsList,
      graph.properties,
      "model",
      (idx) => {
        graph.properties.splice(idx, 1);
      },
    );
    updateModelRunButtons();
  }
}

function render() {
  clearStrictInvalidNodeValues();
  updateModelRunButtons();
  updateMenuTimeLabel();
  updateDeleteActionLabel();
  updateEditActionButtons();
  updateModelBreadcrumb();
  edgesLayer.innerHTML = "";
  nodesLayer.innerHTML = "";
  textLayer.innerHTML = "";
  controlsLayer.innerHTML = "";
  previewLayer.innerHTML = "";
  marqueeLayer.innerHTML = "";

  graph.edges.forEach((edge) => {
    const geom = buildEdgeGeometry(edge);
    if (!geom) {
      return;
    }

    const g = document.createElementNS(SVG_NS, "g");
    g.classList.add("edge");
    const isSelected = ui.selected?.type === "edge" && ui.selected.id === edge.id;
    if (isSelected) {
      g.classList.add("selected");
    }

    const path = document.createElementNS(SVG_NS, "path");
    path.classList.add("edge-line");
    path.setAttribute("d", geom.path);
    path.setAttribute("marker-end", "url(#arrow)");

    const hit = document.createElementNS(SVG_NS, "path");
    hit.classList.add("edge-hit");
    hit.setAttribute("d", geom.path);

    const onEdgeContextMenu = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      if (isExecutionFrozen()) {
        return;
      }
      selectEdge(edge.id);
      render();
      const p = svgPointFromClient(evt.clientX, evt.clientY);
      openEdgeContextMenu(evt, edge.id, p);
    };

    hit.addEventListener("contextmenu", onEdgeContextMenu);
    path.addEventListener("contextmenu", onEdgeContextMenu);

    const onEdgeHitDown = (evt, pointGetter) => {
      evt.stopPropagation();
      const p = pointGetter(evt);
      if (!isSelected) {
        selectEdge(edge.id);
        render();
        return;
      }
      if (isExecutionFrozen()) {
        return;
      }

      runAction(() => {
        addControlPointAt(edge, p);
      });
      setStatusKey("status.cpAdded");
    };

    path.addEventListener("pointerdown", (evt) => onEdgeHitDown(evt, svgPoint));
    path.addEventListener("mousedown", (evt) => onEdgeHitDown(evt, (e) => svgPointFromClient(e.clientX, e.clientY)));
    hit.addEventListener("pointerdown", (evt) => onEdgeHitDown(evt, svgPoint));
    hit.addEventListener("mousedown", (evt) => onEdgeHitDown(evt, (e) => svgPointFromClient(e.clientX, e.clientY)));

    g.appendChild(path);
    g.appendChild(hit);

    if (isSelected) {
      edge.controlPoints.forEach((cp, idx) => {
        const cpCircle = document.createElementNS(SVG_NS, "circle");
        cpCircle.classList.add("control-point");
        if (
          ui.selectedControlPoint &&
          ui.selectedControlPoint.edgeId === edge.id &&
          ui.selectedControlPoint.index === idx
        ) {
          cpCircle.classList.add("active");
        }
        cpCircle.setAttribute("cx", cp.x);
        cpCircle.setAttribute("cy", cp.y);
        cpCircle.setAttribute("r", "7");

        cpCircle.addEventListener("pointerdown", (evt) => {
          evt.stopPropagation();
          selectEdge(edge.id);
          if (isExecutionFrozen()) {
            render();
            return;
          }
          const now = Date.now();
          if (
            ui.lastControlPointTap &&
            ui.lastControlPointTap.edgeId === edge.id &&
            ui.lastControlPointTap.index === idx &&
            now - ui.lastControlPointTap.time < 320
          ) {
            ui.lastControlPointTap = null;
            runAction(() => {
              removeControlPoint(edge.id, idx);
            });
            setStatusKey("status.cpRemoved");
            return;
          }

          ui.lastControlPointTap = { edgeId: edge.id, index: idx, time: now };
          ui.selectedControlPoint = { edgeId: edge.id, index: idx };
          ui.controlPointDrag = {
            edgeId: edge.id,
            index: idx,
            pointerId: evt.pointerId,
          };
          beginTransaction();
        });

        controlsLayer.appendChild(cpCircle);
      });
    }

    edgesLayer.appendChild(g);
  });

  if (ui.edgeCreate) {
    const fromNode = getNodeById(ui.edgeCreate.fromId);
    if (fromNode) {
      const start = nodeBoundaryPoint(fromNode, ui.edgeCreate.current.x, ui.edgeCreate.current.y);
      const preview = document.createElementNS(SVG_NS, "path");
      preview.classList.add("edge-drag-preview");
      preview.setAttribute("d", `M ${start.x} ${start.y} L ${ui.edgeCreate.current.x} ${ui.edgeCreate.current.y}`);
      preview.setAttribute("marker-end", "url(#arrow)");
      previewLayer.appendChild(preview);
    }
  }

  if (ui.marquee) {
    const r = marqueeRect(ui.marquee);
    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("x", r.x);
    rect.setAttribute("y", r.y);
    rect.setAttribute("width", r.width);
    rect.setAttribute("height", r.height);
    rect.setAttribute("fill", "rgba(14,122,196,0.12)");
    rect.setAttribute("stroke", "#0e7ac4");
    rect.setAttribute("stroke-dasharray", "6 4");
    marqueeLayer.appendChild(rect);
  }

  graph.nodes.forEach((node) => {
    const g = document.createElementNS(SVG_NS, "g");
    g.classList.add("node");
    g.setAttribute("data-node-id", node.id);
    g.setAttribute("data-node-tooltip", "1");
    setTooltipText(g, buildNodeTooltipText(node).text);
    g.addEventListener("pointerenter", (evt) => {
      showNodeTooltip(node, g, evt.clientX, evt.clientY);
    });
    g.addEventListener("pointermove", (evt) => {
      setTooltipText(g, buildNodeTooltipText(node).text);
      ui.tooltipPointer = { x: evt.clientX, y: evt.clientY };
      if (ui.tooltipTarget === g) {
        showNodeTooltip(node, g, evt.clientX, evt.clientY);
      } else {
        showNodeTooltip(node, g, evt.clientX, evt.clientY);
      }
    });
    g.addEventListener("pointerleave", () => {
      scheduleHideAppTooltip(60);
    });
    g.addEventListener("contextmenu", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      if (isExecutionFrozen()) {
        return;
      }
      openNodeContextMenu(evt, node);
    });
    if (ui.selectedNodes.has(node.id)) {
      g.classList.add("selected");
    }
    if (graph.execution.strictDefinitions && !validateNodeDefinition(node).ok) {
      g.classList.add("invalid-definition");
    }
    if (ui.edgeCreate && ui.edgeCreateHoverId === node.id && node.id !== ui.edgeCreate.fromId) {
      g.classList.add("edge-target");
    }

    let shapeEl;
    let shapeOutlineEl = null;
    let submodelInnerShape = null;
    if (node.shape === "ellipse") {
      shapeEl = document.createElementNS(SVG_NS, "ellipse");
      shapeEl.setAttribute("cx", node.x);
      shapeEl.setAttribute("cy", node.y);
      shapeEl.setAttribute("rx", node.width / 2);
      shapeEl.setAttribute("ry", node.height / 2);
    } else if (node.shape === "diamond") {
      shapeEl = document.createElementNS(SVG_NS, "polygon");
      shapeEl.setAttribute("points", diamondPoints(node));
    } else {
      shapeEl = document.createElementNS(SVG_NS, "rect");
      shapeEl.setAttribute("x", node.x - node.width / 2);
      shapeEl.setAttribute("y", node.y - node.height / 2);
      shapeEl.setAttribute("width", node.width);
      shapeEl.setAttribute("height", node.height);
      shapeEl.setAttribute("rx", 8);
      if (isSubmodelNode(node)) {
        submodelInnerShape = document.createElementNS(SVG_NS, "rect");
        submodelInnerShape.setAttribute("x", node.x - node.width / 2 + 6);
        submodelInnerShape.setAttribute("y", node.y - node.height / 2 + 6);
        submodelInnerShape.setAttribute("width", Math.max(8, node.width - 12));
        submodelInnerShape.setAttribute("height", Math.max(8, node.height - 12));
        submodelInnerShape.setAttribute("rx", 6);
        submodelInnerShape.classList.add("node-shape", "node-shape-inner");
      }
    }
    shapeEl.classList.add("node-shape");
    shapeOutlineEl = shapeEl.cloneNode(false);
    shapeOutlineEl.classList.add("node-shape-outline");
    if (node.fillColor) {
      g.style.setProperty("--node-fill", node.fillColor);
    } else {
      g.style.removeProperty("--node-fill");
    }
    if (node.strokeColor) {
      g.style.setProperty("--node-stroke", node.strokeColor);
      g.classList.add("has-custom-stroke");
    } else {
      g.style.removeProperty("--node-stroke");
      g.classList.remove("has-custom-stroke");
    }

    const startEdgeCreate = (evt) => {
      if (isExecutionFrozen()) {
        return;
      }
      evt.stopPropagation();
      startEdgeCreateFromNode(node.id, evt.pointerId, svgPoint(evt));
      render();
    };

    const startEdgeCreateMouse = (evt) => {
      if (isExecutionFrozen()) {
        return;
      }
      evt.stopPropagation();
      startEdgeCreateFromMouse(node.id, evt);
    };

    g.addEventListener("pointerdown", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      ui.marquee = null;
      const additive = evt.ctrlKey || evt.metaKey;

      if (additive) {
        toggleNodeSelection(node.id);
        render();
        return;
      }

      if (!ui.selectedNodes.has(node.id)) {
        selectSingleNode(node.id);
      }
      if (isExecutionFrozen()) {
        render();
        return;
      }

      const dragIds = ui.selectedNodes.size > 0 ? [...ui.selectedNodes] : [node.id];
      const dragSet = new Set(dragIds);
      const startMap = new Map(dragIds.map((id) => {
        const n = getNodeById(id);
        return [id, { x: n.x, y: n.y }];
      }));
      const edgeControlStartMap = new Map();
      graph.edges.forEach((edge) => {
        if (dragSet.has(edge.from) && dragSet.has(edge.to) && edge.controlPoints.length > 0) {
          edgeControlStartMap.set(
            edge.id,
            edge.controlPoints.map((cp) => ({ x: cp.x, y: cp.y })),
          );
        }
      });

      ui.drag = {
        nodeIds: dragIds,
        dragSet,
        startMap,
        edgeControlStartMap,
        anchorNodeId: dragIds[0] ?? node.id,
        startClientX: evt.clientX,
        startClientY: evt.clientY,
        pointerId: evt.pointerId,
      };
      beginTransaction();
    });
    g.addEventListener("pointerup", (evt) => {
      if (evt.button !== 0) {
        return;
      }
      const activeDrag = ui.drag && evt.pointerId === ui.drag.pointerId ? ui.drag : null;
      const moved = activeDrag
        ? Math.hypot(
          evt.clientX - activeDrag.startClientX,
          evt.clientY - activeDrag.startClientY,
        ) >= 4
        : false;
      if (moved) {
        ui.lastNodeActivate = null;
        return;
      }
      const now = performance.now();
      const last = ui.lastNodeActivate;
      if (
        last
        && last.nodeId === node.id
        && (now - last.time) <= 320
      ) {
        ui.lastNodeActivate = null;
        evt.preventDefault();
        evt.stopPropagation();
        if (ui.drag && evt.pointerId === ui.drag.pointerId) {
          ui.drag = null;
          cancelTransaction();
          render();
        }
        openNodePrimaryEditor(node);
        return;
      }
      ui.lastNodeActivate = { nodeId: node.id, time: now };
    });

    const label = document.createElementNS(SVG_NS, "text");
    label.classList.add("node-label");
    label.setAttribute("x", node.x);
    label.setAttribute("y", node.y);
    label.textContent = node.name;

    let inputBadge = null;
    let inputBadgeLabel = null;
    if (node.input) {
      inputBadge = document.createElementNS(SVG_NS, "circle");
      inputBadge.classList.add("node-input-badge");
      inputBadge.setAttribute("cx", node.x - node.width / 2 + 9);
      inputBadge.setAttribute("cy", node.y - node.height / 2 + 9);
      inputBadge.setAttribute("r", "7");
      inputBadgeLabel = document.createElementNS(SVG_NS, "text");
      inputBadgeLabel.classList.add("node-input-badge-label");
      inputBadgeLabel.setAttribute("x", node.x - node.width / 2 + 9);
      inputBadgeLabel.setAttribute("y", node.y - node.height / 2 + 9);
      inputBadgeLabel.textContent = "I";
    }

    let outputBadge = null;
    let outputBadgeLabel = null;
    if (node.output) {
      outputBadge = document.createElementNS(SVG_NS, "circle");
      outputBadge.classList.add("node-output-badge");
      outputBadge.setAttribute("cx", node.x + node.width / 2 - 9);
      outputBadge.setAttribute("cy", node.y - node.height / 2 + 9);
      outputBadge.setAttribute("r", "7");
      outputBadgeLabel = document.createElementNS(SVG_NS, "text");
      outputBadgeLabel.classList.add("node-output-badge-label");
      outputBadgeLabel.setAttribute("x", node.x + node.width / 2 - 9);
      outputBadgeLabel.setAttribute("y", node.y - node.height / 2 + 9);
      outputBadgeLabel.textContent = "O";
    }

    const submodelPorts = [];
    if (isSubmodelNode(node)) {
      const makePorts = (items, side) => {
        const values = Array.isArray(items) ? items : [];
        if (!values.length) {
          return;
        }
        const availableHeight = Math.max(12, node.height - 20);
        const step = availableHeight / (values.length + 1);
        values.forEach((name, idx) => {
          const port = document.createElementNS(SVG_NS, "circle");
          port.classList.add("submodel-port", side);
          port.setAttribute("r", "4");
          port.setAttribute("cx", side === "input" ? node.x - node.width / 2 : node.x + node.width / 2);
          port.setAttribute("cy", node.y - node.height / 2 + 10 + step * (idx + 1));
          const title = document.createElementNS(SVG_NS, "title");
          title.textContent = `${side === "input" ? t("label.input") : t("label.output")}: ${String(name)}`;
          port.appendChild(title);
          submodelPorts.push(port);
        });
      };
      makePorts(node.interfaceCache?.inputs, "input");
      makePorts(node.interfaceCache?.outputs, "output");
    }

    const centerPortHit = document.createElementNS(SVG_NS, "circle");
    const disableCenterPortForMultiSelection =
      ui.selectedNodes.size > 1 && ui.selectedNodes.has(node.id);
    centerPortHit.classList.add("center-port-hit");
    centerPortHit.setAttribute("cx", node.x);
    centerPortHit.setAttribute("cy", node.y);
    centerPortHit.setAttribute("r", "18");
    if (disableCenterPortForMultiSelection) {
      centerPortHit.style.pointerEvents = "none";
      centerPortHit.style.cursor = "inherit";
    } else {
      centerPortHit.addEventListener("pointerdown", startEdgeCreate);
      centerPortHit.addEventListener("mousedown", startEdgeCreateMouse);
    }

    const handle = document.createElementNS(SVG_NS, "circle");
    handle.classList.add("resize-handle");
    handle.setAttribute("cx", node.x + node.width / 2);
    handle.setAttribute("cy", node.y + node.height / 2);
    handle.setAttribute("r", "6");

    handle.addEventListener("pointerdown", (evt) => {
      evt.stopPropagation();
      if (!ui.selectedNodes.has(node.id)) {
        selectSingleNode(node.id);
      }
      if (isExecutionFrozen()) {
        render();
        return;
      }
      ui.resize = {
        nodeId: node.id,
        startPointer: svgPoint(evt),
        startWidth: node.width,
        startHeight: node.height,
        pointerId: evt.pointerId,
      };
      beginTransaction();
      render();
    });

    g.appendChild(shapeOutlineEl);
    g.appendChild(shapeEl);
    if (submodelInnerShape) {
      g.appendChild(submodelInnerShape);
    }
    g.appendChild(label);
    if (inputBadge && inputBadgeLabel) {
      g.appendChild(inputBadge);
      g.appendChild(inputBadgeLabel);
    }
    if (outputBadge && outputBadgeLabel) {
      g.appendChild(outputBadge);
      g.appendChild(outputBadgeLabel);
    }
    submodelPorts.forEach((port) => g.appendChild(port));
    g.appendChild(centerPortHit);
    g.appendChild(handle);
    nodesLayer.appendChild(g);
  });

  graph.textItems.forEach((item) => {
    sanitizeTextItem(item);
    const g = document.createElementNS(SVG_NS, "g");
    g.classList.add("canvas-text-item");
    if (item.fillColor) {
      g.style.setProperty("--text-box-fill", item.fillColor);
    } else {
      g.style.removeProperty("--text-box-fill");
    }
    if (item.strokeColor) {
      g.style.setProperty("--text-box-stroke", item.strokeColor);
      g.classList.add("has-custom-stroke");
    } else {
      g.style.removeProperty("--text-box-stroke");
      g.classList.remove("has-custom-stroke");
    }
    if (ui.selected?.type === "text" && ui.selected.id === item.id) {
      g.classList.add("selected");
    }
    g.setAttribute("transform", `translate(${item.x}, ${item.y})`);

    const frame = document.createElementNS(SVG_NS, "rect");
    frame.classList.add("canvas-text-frame");
    frame.setAttribute("x", "0");
    frame.setAttribute("y", "0");
    frame.setAttribute("width", String(item.width));
    frame.setAttribute("height", String(item.height));
    frame.setAttribute("rx", "6");
    frame.setAttribute("ry", "6");

    const foreignObject = document.createElementNS(SVG_NS, "foreignObject");
    foreignObject.setAttribute("x", "0");
    foreignObject.setAttribute("y", "0");
    foreignObject.setAttribute("width", String(item.width));
    foreignObject.setAttribute("height", String(item.height));
    foreignObject.classList.add("canvas-text-fo");
    const div = document.createElement("div");
    div.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    div.className = "canvas-text-content";
    div.innerHTML = canvasTextDisplayHtml(item);
    foreignObject.appendChild(div);

    const handle = document.createElementNS(SVG_NS, "circle");
    handle.classList.add("resize-handle");
    handle.setAttribute("cx", String(item.width));
    handle.setAttribute("cy", String(item.height));
    handle.setAttribute("r", "6");

    g.addEventListener("pointerdown", (evt) => {
      evt.stopPropagation();
      if (!(ui.selected?.type === "text" && ui.selected.id === item.id)) {
        selectTextItem(item.id);
      }
      if (isExecutionFrozen()) {
        render();
        return;
      }
      ui.textDrag = {
        id: item.id,
        pointerId: evt.pointerId,
        startClientX: evt.clientX,
        startClientY: evt.clientY,
        startX: item.x,
        startY: item.y,
      };
      beginTransaction();
    });
    g.addEventListener("contextmenu", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      if (!(ui.selected?.type === "text" && ui.selected.id === item.id)) {
        selectTextItem(item.id);
      }
      openTextContextMenu(evt, item);
    });
    handle.addEventListener("pointerdown", (evt) => {
      evt.stopPropagation();
      if (!(ui.selected?.type === "text" && ui.selected.id === item.id)) {
        selectTextItem(item.id);
      }
      if (isExecutionFrozen()) {
        render();
        return;
      }
      ui.textResize = {
        id: item.id,
        pointerId: evt.pointerId,
        startClientX: evt.clientX,
        startClientY: evt.clientY,
        startWidth: item.width,
        startHeight: item.height,
      };
      beginTransaction();
    });

    g.appendChild(frame);
    g.appendChild(foreignObject);
    g.appendChild(handle);
    textLayer.appendChild(g);
  });

  refreshActiveTooltip();

  updateCanvasSize();
  if (ui.sliderInteraction == null) {
    renderWidgets();
  } else {
    applyWidgetDrivenNodeValues();
  }
  refreshSidebar();
  updateHistoryButtons();
  updateEditingLockUi();
}

function isValidPoint(p) {
  return p && Number.isFinite(p.x) && Number.isFinite(p.y);
}

function importGraphData(data) {
  if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
    throw new Error(t("error.invalidJson"));
  }

  const nodes = data.nodes
    .filter((n) => Number.isInteger(n.id))
    .map((n) => {
      if (!["state", "algebraic", "parameter", "submodel"].includes(n.type)) {
        throw new Error(t("error.invalidJson"));
      }
      const shape = deserializeNodeType(n.type);
      const node = {
        id: n.id,
        name: typeof n.name === "string" ? n.name : t("node.defaultName", { id: n.id }),
        input: shape === "ellipse" ? Boolean(n.input) : false,
        output: Boolean(n.output),
        type: serializeNodeType(shape),
        x: Number.isFinite(n.x) ? n.x : 200,
        y: Number.isFinite(n.y) ? n.y : 200,
        width: clamp(Number(n.width) || 120, 40, 500),
        height: clamp(Number(n.height) || 70, 30, 500),
        fillColor: normalizeColorString(n.fillColor),
        strokeColor: normalizeColorString(n.strokeColor),
        valueExpression: shape === "rect" ? "" : String(n.valueExpression ?? ""),
        stateTransition: shape === "rect"
          ? String(n.stateTransition ?? "")
          : "",
        initialState: shape === "rect"
          ? String(n.initialState ?? "")
          : "",
        modelPath: shape === "submodel" ? String(n.modelPath ?? "") : "",
        inputBindings: shape === "submodel" && n.inputBindings && typeof n.inputBindings === "object"
          ? Object.fromEntries(
            Object.entries(n.inputBindings)
              .map(([key, value]) => [String(key), String(value ?? "")])
              .filter(([key]) => key.trim()),
          )
          : {},
        interfaceCache: shape === "submodel" && n.interfaceCache && typeof n.interfaceCache === "object"
          ? {
            inputs: Array.isArray(n.interfaceCache.inputs) ? n.interfaceCache.inputs.map((value) => String(value)) : [],
            outputs: Array.isArray(n.interfaceCache.outputs) ? n.interfaceCache.outputs.map((value) => String(value)) : [],
          }
          : { inputs: [], outputs: [] },
        submodelError: "",
        computedValue: null,
        computedError: "",
        pendingStateValue: null,
        pendingStateError: "",
        properties: Array.isArray(n.properties)
          ? n.properties.map((p) => ({ key: String(p?.key ?? ""), value: String(p?.value ?? "") }))
          : [],
      };
      normalizeNodeDescriptionProperty(node);
      sanitizeNodeVisualOptions(node);
      return node;
    });
  const nodesWithValidNames = semantics.sanitizeNodeNames(nodes, "n");

  const nodeIds = new Set(nodesWithValidNames.map((n) => n.id));

  const edges = data.edges
    .filter((e) => {
      if (!Number.isInteger(e.id) || !nodeIds.has(e.from) || !nodeIds.has(e.to) || e.from === e.to) {
        return false;
      }
      const targetNode = nodesWithValidNames.find((n) => n.id === e.to);
      return targetNode?.type !== "parameter";
    })
    .map((e) => ({
      id: e.id,
      from: e.from,
      to: e.to,
      sourcePort: String(e.sourcePort ?? ""),
      targetPort: String(e.targetPort ?? ""),
      controlPoints: Array.isArray(e.controlPoints)
        ? e.controlPoints.filter(isValidPoint).map((cp) => ({ x: cp.x, y: cp.y }))
        : [],
    }));

  const textItems = Array.isArray(data.textItems)
    ? data.textItems
      .filter((item) => Number.isInteger(item?.id))
      .map((item) => {
        const out = {
          id: item.id,
          x: Number(item.x),
          y: Number(item.y),
          width: Number(item.width),
          height: Number(item.height),
          fillColor: normalizeColorString(item.fillColor),
          strokeColor: normalizeColorString(item.strokeColor),
          html: String(item.html ?? ""),
        };
        sanitizeTextItem(out);
        return out;
      })
    : [];

  const maxNodeId = nodesWithValidNames.reduce((max, n) => Math.max(max, n.id), 0);
  const maxEdgeId = edges.reduce((max, e) => Math.max(max, e.id), 0);
  const maxTextItemId = textItems.reduce((max, item) => Math.max(max, item.id), 0);
  const widgets = Array.isArray(data.widgets)
    ? data.widgets
      .filter((w) => Number.isInteger(w.id) && (w.type === "table" || w.type === "xychart" || w.type === "slider" || w.type === "matrix" || w.type === "button" || w.type === "led"))
      .map((w) => ({
        id: w.id,
        type: w.type === "xychart"
          ? "xychart"
          : (w.type === "slider"
            ? "slider"
            : (w.type === "matrix"
              ? "matrix"
              : (w.type === "button" ? "button" : (w.type === "led" ? "led" : "table")))),
        customTitle: String(w.customTitle ?? ""),
        x: Number.isFinite(Number(w.x)) ? Number(w.x) : 40,
        y: Number.isFinite(Number(w.y)) ? Number(w.y) : 40,
        width: clamp(Number(w.width) || 320, 220, 1200),
        height: clamp(Number(w.height) || 160, 110, 900),
        minimized: Boolean(w.minimized),
        outputOnly: Boolean(w.outputOnly),
        showHistory: Boolean(w.showHistory),
        xMin: Number.isFinite(Number(w.xMin)) ? Number(w.xMin) : null,
        xMax: Number.isFinite(Number(w.xMax)) ? Number(w.xMax) : null,
        yMin: Number.isFinite(Number(w.yMin)) ? Number(w.yMin) : null,
        yMax: Number.isFinite(Number(w.yMax)) ? Number(w.yMax) : null,
        showGrid: w.showGrid !== false,
        legendPosition: ["top-right", "top-left", "bottom-right", "bottom-left"].includes(String(w.legendPosition ?? ""))
          ? String(w.legendPosition)
          : "top-right",
        source: String(w.source ?? ""),
        showNumericValues: w.showNumericValues !== false,
        showIndices: w.showIndices !== false,
        autoFitCells: w.autoFitCells !== false,
        cellSize: Number.isFinite(Number(w.cellSize)) ? clamp(Number(w.cellSize), 2, 96) : 28,
        colorScheme: ["blue", "heat", "grayscale", "diverging", "none"].includes(String(w.colorScheme ?? ""))
          ? String(w.colorScheme)
          : "blue",
        min: Number.isFinite(Number(w.min)) ? Number(w.min) : 0,
        max: Number.isFinite(Number(w.max)) ? Number(w.max) : 100,
        step: Number.isFinite(Number(w.step)) ? Number(w.step) : 1,
        value: w.type === "button"
          ? (w.value === true || w.value === "true" || w.value === 1 || w.value === "1")
          : (Number.isFinite(Number(w.value)) ? Number(w.value) : 0),
        rows: [],
        columns: Array.isArray(w.columns) ? w.columns.map(normalizeTableColumnName) : [],
        xyPairs: Array.isArray(w.xyPairs)
          ? w.xyPairs.map((pair, idx) => ({
          xSource: String(pair.xSource ?? "time"),
          ySource: String(pair.ySource ?? ""),
          color: /^#[0-9a-fA-F]{6}$/.test(String(pair?.color ?? "")) ? String(pair.color) : defaultChartSeriesColor(idx),
          showLine: pair?.showLine !== false,
          lineWidth: Number.isFinite(Number(pair?.lineWidth)) ? clamp(Number(pair.lineWidth), 1, 8) : 2.2,
          lineStyle: normalizeChartLineStyle(pair?.lineStyle),
          pointMode: normalizeChartPointMode(pair?.pointMode, pair?.showPoints),
          pointSize: Number.isFinite(Number(pair?.pointSize)) ? clamp(Number(pair.pointSize), 1, 12) : 2.4,
          points: [],
          }))
          : (() => {
            const legacyX = String(w.xSource ?? w.xNode ?? "time");
            const legacyYNodes = Array.isArray(w.yNodes)
              ? w.yNodes.map((n) => String(n))
              : (w.yNode ? [String(w.yNode)] : []);
            return legacyYNodes.map((yNode, idx) => ({
              xSource: legacyX,
              ySource: yNode,
              color: defaultChartSeriesColor(idx),
              showLine: true,
              lineWidth: 2.2,
              lineStyle: "solid",
              pointMode: "all",
              pointSize: 2.4,
              points: [],
            }));
          })(),
      }))
    : [];
  const maxWidgetId = widgets.reduce((max, w) => Math.max(max, w.id), 0);

  applyGraphData({
    version: 1,
    modelTitle: String(data.modelTitle ?? ""),
    modelProperties: Array.isArray(data.modelProperties)
      ? data.modelProperties.map((p) => ({ key: String(p?.key ?? ""), value: String(p?.value ?? "") }))
      : [],
    nodeCounter: Math.max(Number(data.nodeCounter) || 0, maxNodeId) + 1,
    edgeCounter: Math.max(Number(data.edgeCounter) || 0, maxEdgeId) + 1,
    widgetCounter: Math.max(Number(data.widgetCounter) || 0, maxWidgetId) + 1,
    textItemCounter: Math.max(Number(data.textItemCounter) || 0, maxTextItemId) + 1,
    execution: normalizeExecutionConfig(data.execution),
    nodes: nodesWithValidNames,
    edges,
    textItems,
    widgets,
  });
}

function defaultGraphFilename() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `grafo-${stamp}.json`;
}

function normalizeJsonFilename(name) {
  const trimmed = String(name || "").trim();
  if (!trimmed) {
    return defaultGraphFilename();
  }
  return trimmed.toLowerCase().endsWith(".json") ? trimmed : `${trimmed}.json`;
}

function supportsRecentModelPaths() {
  return hasPlatformApi("createFileHandleFromPath");
}

async function extractFileHandlePath(fileHandle) {
  if (!fileHandle) {
    return "";
  }
  if (typeof fileHandle.getPath === "function") {
    try {
      const path = String(await fileHandle.getPath()).trim();
      if (path) {
        return path;
      }
    } catch (_err) {
      // Fall back below.
    }
  }
  const directPath = String(fileHandle.path ?? "").trim();
  return directPath;
}

function saveRecentModelsToStorage() {
  try {
    const payload = recentModelEntries
      .filter((entry) => entry && entry.path)
      .slice(0, MAX_RECENT_MODELS)
      .map((entry) => ({
        name: String(entry.name || ""),
        path: String(entry.path || ""),
      }));
    window.localStorage.setItem(RECENT_MODELS_STORAGE_KEY, JSON.stringify(payload));
  } catch (_err) {
    // Ignore storage failures.
  }
}

function loadRecentModelsFromStorage() {
  try {
    const raw = window.localStorage.getItem(RECENT_MODELS_STORAGE_KEY);
    if (!raw) {
      recentModelEntries = [];
      return;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      recentModelEntries = [];
      return;
    }
    recentModelEntries = parsed
      .map((entry) => ({
        name: String(entry?.name || ""),
        path: String(entry?.path || "").trim(),
        handle: null,
      }))
      .filter((entry) => entry.path)
      .slice(0, MAX_RECENT_MODELS);
  } catch (_err) {
    recentModelEntries = [];
  }
}

function clearRecentModels() {
  recentModelEntries = [];
  saveRecentModelsToStorage();
  renderRecentModelsMenu();
}

async function maybeSaveUnsavedChangesBeforeModelReplace(confirmKey) {
  if (!hasUnsavedChanges()) {
    return true;
  }
  const shouldSave = window.confirm(t(confirmKey));
  if (!shouldSave) {
    return true;
  }
  return saveGraphJson(false);
}

function notifyMissingRecentModelEntry(entry) {
  recentModelEntries = recentModelEntries.filter((item) => item !== entry);
  saveRecentModelsToStorage();
  renderRecentModelsMenu();
  setStatusKey("status.recentMissing");
  window.alert(t("error.recentMissing"));
}

function renderRecentModelsMenu() {
  if (!recentModelsMenuRoot || !recentModelsSection || !recentModelsSep || !clearRecentModelsBtn) {
    return;
  }
  recentModelsSection.innerHTML = "";
  const hasRecent = recentModelEntries.length > 0;
  recentModelsMenuRoot.classList.toggle("hidden", !hasRecent);
  recentModelsSep.classList.toggle("hidden", !hasRecent);
  clearRecentModelsBtn.classList.toggle("hidden", !hasRecent);
  if (!hasRecent) {
    return;
  }
  recentModelEntries.forEach((entry, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "menu-command";
    btn.title = entry.path || entry.name || "";
    const label = document.createElement("span");
    label.textContent = entry.name || entry.path || `${idx + 1}`;
    btn.appendChild(label);
    btn.addEventListener("click", () => {
      closeTopMenus();
      void openRecentModelEntry(entry);
    });
    recentModelsSection.appendChild(btn);
  });
}

async function rememberRecentModel(name, fileHandle = null) {
  const trimmedName = String(name || "").trim();
  const path = supportsRecentModelPaths() ? await extractFileHandlePath(fileHandle) : "";
  const handle = fileHandle || null;
  if (!trimmedName && !path && !handle) {
    return;
  }
  const dedupeIndex = recentModelEntries.findIndex((entry) => {
    if (path && entry.path) {
      return entry.path === path;
    }
    if (!path && !entry.path && handle && entry.handle) {
      return entry.handle === handle;
    }
    return !path && !entry.path && trimmedName && entry.name === trimmedName;
  });
  if (dedupeIndex >= 0) {
    recentModelEntries.splice(dedupeIndex, 1);
  }
  recentModelEntries.unshift({
    name: trimmedName || path || t("file.unnamed"),
    path,
    handle,
  });
  recentModelEntries = recentModelEntries.slice(0, MAX_RECENT_MODELS);
  saveRecentModelsToStorage();
  renderRecentModelsMenu();
}

async function resolveRecentModelHandle(entry) {
  if (entry?.handle) {
    return entry.handle;
  }
  if (entry?.path && supportsRecentModelPaths()) {
    try {
      const handle = window.STGraphXPlatform.createFileHandleFromPath(entry.path);
      entry.handle = handle;
      return handle;
    } catch (_err) {
      return null;
    }
  }
  return null;
}

async function openPreparedJsonEntry(rootEntry) {
  if (!rootEntry) {
    return false;
  }
  submodelTemplateCache.clear();
  submodelFileHandleCache.clear();
  submodelSourceCache.clear();
  const handle = rootEntry.fileHandle;
  const file = rootEntry.file;
  const text = rootEntry.text;
  const rootData = rootEntry.data || JSON.parse(text);
  const directoryHandle = rootEntry.directoryHandle || await deriveDirectoryHandleFromFileHandle(handle) || null;
  loadGraphFromJsonText(
    text,
    rootEntry.name || (handle && handle.name) || (file && file.name) || "graph.json",
    handle || null,
    directoryHandle,
    true,
  );
  await rememberRecentModel(rootEntry.name || (handle && handle.name) || (file && file.name) || "graph.json", handle || null);
  await preloadSubmodelsAfterLoad();
  await maybeSelectModelDirectoryForSubmodels(rootData);
  await preloadSubmodelsAfterLoad();
  return true;
}

async function openRecentModelEntry(entry) {
  try {
    const handle = await resolveRecentModelHandle(entry);
    if (!handle) {
      notifyMissingRecentModelEntry(entry);
      return false;
    }
    const proceed = await maybeSaveUnsavedChangesBeforeModelReplace("confirm.openGraph.save");
    if (!proceed) {
      return false;
    }
    const rootEntry = await prepareSelectedJsonEntries([handle]);
    if (!rootEntry) {
      return false;
    }
    return openPreparedJsonEntry(rootEntry);
  } catch (_err) {
    notifyMissingRecentModelEntry(entry);
    return false;
  }
}

function tryDeriveDirectoryHandleFromFileHandle(fileHandle) {
  const filePath = String(fileHandle?.path ?? "").trim();
  if (!filePath || !hasPlatformApi("createDirectoryHandleFromPath")) {
    return null;
  }
  try {
    return window.STGraphXPlatform.createDirectoryHandleFromPath(filePath);
  } catch (_err) {
    return null;
  }
}

async function deriveDirectoryHandleFromFileHandle(fileHandle) {
  if (!fileHandle) {
    return null;
  }
  if (
    typeof fileHandle.getParentDirectoryPath === "function" &&
    hasPlatformApi("createDirectoryHandleFromDirectoryPath")
  ) {
    try {
      const directoryPath = String(await fileHandle.getParentDirectoryPath()).trim();
      if (directoryPath) {
        return window.STGraphXPlatform.createDirectoryHandleFromDirectoryPath(directoryPath);
      }
    } catch (_err) {
      // Fall back to other derivation strategies below.
    }
  }
  if (typeof fileHandle.getPath === "function" && hasPlatformApi("createDirectoryHandleFromPath")) {
    try {
      const filePath = String(await fileHandle.getPath()).trim();
      if (filePath) {
        return window.STGraphXPlatform.createDirectoryHandleFromPath(filePath);
      }
    } catch (_err) {
      // Fall back to any remaining strategies below.
    }
  }
  if (typeof fileHandle.getParentDirectoryHandle === "function") {
    try {
      const handle = await fileHandle.getParentDirectoryHandle();
      if (handle) {
        return handle;
      }
    } catch (_err) {
      // Fall back to any path-based derivation below.
    }
  }
  return tryDeriveDirectoryHandleFromFileHandle(fileHandle);
}

function derivedDirectoryHandleDisplayName(handle) {
  const name = String(handle?.name ?? "").trim();
  const rawPath = String(handle?.path ?? "").trim();
  return name || rawPath || "";
}

function loadGraphFromJsonText(jsonText, sourceName = "", fileHandle = null, directoryHandle = null, preserveSubmodelCache = false) {
  stopTimedExecution(false);
  try {
    if (!preserveSubmodelCache) {
      submodelTemplateCache.clear();
      submodelFileHandleCache.clear();
      submodelSourceCache.clear();
    }
    const data = JSON.parse(String(jsonText || "{}"));
    runAction(() => {
      importGraphData(data);
    });
    currentFileHandle = fileHandle || null;
    const effectiveDirectoryHandle = directoryHandle || tryDeriveDirectoryHandleFromFileHandle(fileHandle) || null;
    currentModelDirectoryHandle = effectiveDirectoryHandle;
    currentFileName = sourceName || currentFileName || defaultGraphFilename();
    history.undo = [];
    history.redo = [];
    updateHistoryButtons();
    markSavedSnapshot();
    ui.submodelsPrepared = false;
    updateModelBreadcrumb();
    if (effectiveDirectoryHandle) {
      const label = derivedDirectoryHandleDisplayName(effectiveDirectoryHandle);
      if (label) {
        setStatusKey("status.modelFolderDerived", { name: label });
      } else {
        setStatusKey("status.loaded");
      }
    } else {
      setStatusKey("status.loaded");
    }
    window.requestAnimationFrame(() => {
      fitToContent();
    });
  } catch (err) {
    cancelTransaction();
    setStatus(t("error.load", { message: err.message }));
  }
}

function downloadJsonFile(filename, json) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = normalizeJsonFilename(filename);
  a.click();
  URL.revokeObjectURL(url);
}

async function ensureCurrentModelDirectoryHandle() {
  if (currentModelDirectoryHandle) {
    return currentModelDirectoryHandle;
  }
  const derivedFromCurrentFile = await deriveDirectoryHandleFromFileHandle(currentFileHandle);
  if (derivedFromCurrentFile) {
    currentModelDirectoryHandle = derivedFromCurrentFile;
    return currentModelDirectoryHandle;
  }
  if (supportsDirectoryInputSelection()) {
    currentModelDirectoryHandle = await pickModelDirectoryWithInput();
    return currentModelDirectoryHandle;
  }
  if (supportsDirectoryPicker()) {
    currentModelDirectoryHandle = await showDirectoryPickerCompat({ mode: "read" });
    return currentModelDirectoryHandle;
  }
  throw new Error(t("error.submodelDirectoryUnsupported"));
}

function basenameOfSubmodelPath(modelPath) {
  return String(modelPath ?? "").split("/").filter(Boolean).pop() || String(modelPath ?? "");
}

function isDeferredSubmodelResolutionError(err) {
  return String(err?.message || "") === SUBMODEL_DEFERRED_RESOLUTION;
}

function pickSubmodelFileWithInput(accept = ".json,application/json") {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.style.position = "fixed";
    input.style.left = "-9999px";
    input.addEventListener("change", () => {
      const file = input.files && input.files[0] ? input.files[0] : null;
      input.remove();
      if (file) {
        resolve(file);
      } else {
        reject(new Error(t("error.loadCancelled")));
      }
    }, { once: true });
    document.body.appendChild(input);
    input.click();
  });
}

function pickSubmodelFilesWithInput(accept = ".json,application/json") {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = accept;
    input.style.position = "fixed";
    input.style.left = "-9999px";
    input.addEventListener("change", () => {
      const files = Array.from(input.files || []);
      input.remove();
      if (files.length) {
        resolve(files);
      } else {
        reject(new Error(t("error.loadCancelled")));
      }
    }, { once: true });
    document.body.appendChild(input);
    input.click();
  });
}

function supportsDirectoryInputSelection() {
  const input = document.createElement("input");
  return "webkitdirectory" in input || "directory" in input;
}

function createPseudoFileHandle(file) {
  return {
    name: String(file?.name || ""),
    async getFile() {
      return file;
    },
  };
}

function createPseudoDirectoryHandle(files) {
  const fileMap = new Map();
  Array.from(files || []).forEach((file) => {
    const baseName = normalizeSubmodelPath(file?.name) || basenameOfSubmodelPath(file?.name);
    if (baseName && !fileMap.has(baseName)) {
      fileMap.set(baseName, file);
    }
  });
  return {
    kind: "directory",
    name: "",
    async getFileHandle(name) {
      const baseName = normalizeSubmodelPath(name) || basenameOfSubmodelPath(name);
      const file = fileMap.get(baseName);
      if (!file) {
        const err = new Error(`Missing file: ${baseName}`);
        err.name = "NotFoundError";
        throw err;
      }
      return createPseudoFileHandle(file);
    },
  };
}

function pickModelDirectoryWithInput() {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.style.position = "fixed";
    input.style.left = "-9999px";
    input.webkitdirectory = true;
    input.directory = true;
    input.setAttribute("webkitdirectory", "");
    input.setAttribute("directory", "");
    input.addEventListener("change", async () => {
      const files = Array.from(input.files || []).filter((file) => String(file?.name || "").toLowerCase().endsWith(".json"));
      input.remove();
      if (!files.length) {
        reject(new Error(t("error.loadCancelled")));
        return;
      }
      try {
        await cacheSelectedSubmodelEntries(files);
        resolve(createPseudoDirectoryHandle(files));
      } catch (err) {
        reject(err);
      }
    }, { once: true });
    document.body.appendChild(input);
    input.click();
  });
}

async function parseSelectedJsonEntry(entry) {
  if (!entry) {
    return null;
  }
  if (typeof entry.getFile === "function") {
    const file = await entry.getFile();
    const directoryHandle = await deriveDirectoryHandleFromFileHandle(entry);
    return {
      name: String(file?.name || entry.name || ""),
      text: await file.text(),
      file,
      fileHandle: entry,
      directoryHandle,
    };
  }
  const filePath = String(entry?.path || entry?.webkitRelativePath || "").trim();
  const directoryHandle = filePath && hasPlatformApi("createDirectoryHandleFromPath")
    ? window.STGraphXPlatform.createDirectoryHandleFromPath(filePath)
    : null;
  return {
    name: String(entry?.name || ""),
    text: await entry.text(),
    file: entry,
    fileHandle: null,
    directoryHandle,
  };
}

function collectReferencedSubmodelNames(data) {
  if (!data || !Array.isArray(data.nodes)) {
    return [];
  }
  return data.nodes
    .filter((node) => String(node?.type ?? "") === "submodel")
    .map((node) => normalizeSubmodelPath(node?.modelPath))
    .filter(Boolean);
}

function rootModelHasSubmodels(data) {
  return Boolean(data && Array.isArray(data.nodes) && data.nodes.some((node) => String(node?.type ?? "") === "submodel"));
}

function rootModelHasUnresolvedSubmodels(data) {
  const names = collectReferencedSubmodelNames(data);
  return names.some((name) => name && !submodelSourceCache.has(name) && !submodelTemplateCache.has(name));
}

async function maybeSelectModelDirectoryForSubmodels(data) {
  if (!rootModelHasSubmodels(data)) {
    return null;
  }
  const derivedFromCurrentFile = await deriveDirectoryHandleFromFileHandle(currentFileHandle);
  if (derivedFromCurrentFile) {
    currentModelDirectoryHandle = derivedFromCurrentFile;
    return currentModelDirectoryHandle;
  }
  if (currentModelDirectoryHandle) {
    return currentModelDirectoryHandle;
  }
  if (!rootModelHasUnresolvedSubmodels(data)) {
    return null;
  }
  if (!supportsDirectoryInputSelection() && !supportsDirectoryPicker()) {
    return null;
  }
  const shouldSelect = window.confirm(t("confirm.selectModelFolder"));
  if (!shouldSelect) {
    return null;
  }
  const handle = await ensureCurrentModelDirectoryHandle();
  setStatusKey("status.modelFolderSelected");
  return handle;
}

async function prepareSelectedJsonEntries(entries) {
  const parsed = [];
  for (const entry of entries) {
    const item = await parseSelectedJsonEntry(entry);
    if (!item?.name) {
      continue;
    }
    try {
      item.data = JSON.parse(item.text);
    } catch (_err) {
      item.data = null;
    }
    item.baseName = normalizeSubmodelPath(item.name) || basenameOfSubmodelPath(item.name);
    parsed.push(item);
  }
  const referenced = new Set();
  parsed.forEach((item) => {
    collectReferencedSubmodelNames(item.data).forEach((name) => referenced.add(name));
  });
  let root = parsed.find((item) => item.baseName && !referenced.has(item.baseName)) || parsed[0] || null;
  if (!root) {
    return null;
  }
  parsed.forEach((item) => {
    if (!item.baseName || item === root) {
      return;
    }
    submodelSourceCache.set(item.baseName, item.text);
    if (item.fileHandle) {
      submodelFileHandleCache.set(item.baseName, item.fileHandle);
    }
    if (item.data) {
      try {
        submodelTemplateCache.set(item.baseName, buildRuntimeModelFromData(item.data));
      } catch (_err) {
        // Ignore invalid child cache candidates; the actual load path will surface errors.
      }
    }
  });
  return root;
}

async function cacheSelectedSubmodelEntries(entries, allowedNames = null) {
  const allowed = allowedNames instanceof Set ? allowedNames : null;
  for (const entry of entries) {
    const item = await parseSelectedJsonEntry(entry);
    if (!item?.name) {
      continue;
    }
    const baseName = normalizeSubmodelPath(item.name) || basenameOfSubmodelPath(item.name);
    if (!baseName || (allowed && !allowed.has(baseName))) {
      continue;
    }
    submodelSourceCache.set(baseName, item.text);
    if (item.fileHandle) {
      submodelFileHandleCache.set(baseName, item.fileHandle);
    }
    try {
      const data = JSON.parse(item.text);
      submodelTemplateCache.set(baseName, buildRuntimeModelFromData(data));
    } catch (_err) {
      // Ignore invalid JSON here; the actual submodel load path will report the error.
    }
  }
}

async function promptForMissingSubmodelFiles(missingPaths) {
  const unresolved = new Set(
    Array.from(missingPaths || [])
      .map((value) => normalizeSubmodelPath(value))
      .filter(Boolean),
  );
  if (!unresolved.size) {
    return false;
  }
  try {
    if (supportsOpenFilePicker()) {
      const handles = await showOpenFilePickerCompat({
        multiple: true,
        types: [{
          description: "JSON",
          accept: { "application/json": [".json"] },
        }],
      });
      if (!handles || handles.length === 0) {
        return false;
      }
      await cacheSelectedSubmodelEntries(handles, unresolved);
    } else {
      const files = await pickSubmodelFilesWithInput();
      await cacheSelectedSubmodelEntries(files, unresolved);
    }
    return Array.from(unresolved).every((name) => submodelTemplateCache.has(name) || submodelSourceCache.has(name));
  } catch (_err) {
    return false;
  }
}

async function resolveSubmodelFileByPath(modelPath, options = {}) {
  const normalizedPath = normalizeSubmodelPath(modelPath);
  if (!normalizedPath) {
    throw new Error(t("error.submodelPathInvalid"));
  }
  const allowPrompt = options.allowPrompt !== false;
  const expectedName = basenameOfSubmodelPath(normalizedPath);

  async function readFromFileHandle(fileHandle, directoryHandle = null) {
    const file = await fileHandle.getFile();
    const text = await file.text();
    submodelFileHandleCache.set(normalizedPath, fileHandle);
    submodelSourceCache.set(normalizedPath, text);
    return {
      file,
      fileHandle,
      directoryHandle,
      text,
    };
  }

  if (currentModelDirectoryHandle) {
    const fileHandle = await currentModelDirectoryHandle.getFileHandle(normalizedPath);
    return readFromFileHandle(fileHandle, currentModelDirectoryHandle);
  }

  const cachedHandle = submodelFileHandleCache.get(normalizedPath);
  if (cachedHandle) {
    try {
      return await readFromFileHandle(cachedHandle, null);
    } catch (err) {
      submodelFileHandleCache.delete(normalizedPath);
    }
  }

  if (submodelSourceCache.has(normalizedPath) && !options.forcePrompt) {
    return {
      file: null,
      fileHandle: null,
      directoryHandle: null,
      text: submodelSourceCache.get(normalizedPath),
    };
  }

  if (!allowPrompt) {
    throw new Error(SUBMODEL_DEFERRED_RESOLUTION);
  }

  if (supportsDirectoryInputSelection() || supportsDirectoryPicker()) {
    const directoryHandle = await ensureCurrentModelDirectoryHandle();
    const fileHandle = await directoryHandle.getFileHandle(normalizedPath);
    return readFromFileHandle(fileHandle, directoryHandle);
  }

  if (supportsOpenFilePicker()) {
    const handles = await showOpenFilePickerCompat({
      multiple: false,
      types: [{
        description: "JSON",
        accept: { "application/json": [".json"] },
      }],
    });
    const fileHandle = handles?.[0] || null;
    if (!fileHandle) {
      throw new Error(t("error.loadCancelled"));
    }
    if (expectedName && fileHandle.name !== expectedName) {
      throw new Error(`${t("error.submodelPathInvalid")}: ${expectedName}`);
    }
    return readFromFileHandle(fileHandle, null);
  }

  const file = await pickSubmodelFileWithInput();
  if (expectedName && file.name !== expectedName) {
    throw new Error(`${t("error.submodelPathInvalid")}: ${expectedName}`);
  }
  const text = await file.text();
  submodelSourceCache.set(normalizedPath, text);
  return {
    file,
    fileHandle: null,
    directoryHandle: null,
    text,
  };
}

function extractSubmodelInterfaceFromData(data) {
  if (!data || !Array.isArray(data.nodes)) {
    throw new Error(t("error.invalidJson"));
  }
  const inputs = [];
  const outputs = [];
  data.nodes.forEach((node) => {
    const nodeType = String(node?.type ?? "");
    const name = String(node?.name ?? "").trim();
    if (!name) {
      return;
    }
    if (nodeType === "algebraic" && node.input === true) {
      inputs.push(name);
    }
    if (node.output === true) {
      outputs.push(name);
    }
  });
  return {
    inputs: [...new Set(inputs)],
    outputs: [...new Set(outputs)],
  };
}

async function loadSubmodelInterfaceByPath(modelPath) {
  const normalizedPath = normalizeSubmodelPath(modelPath);
  if (!normalizedPath) {
    throw new Error(t("error.submodelPathInvalid"));
  }
  const { text } = await resolveSubmodelFileByPath(normalizedPath);
  const data = JSON.parse(text);
  submodelTemplateCache.set(normalizedPath, buildRuntimeModelFromData(data));
  return extractSubmodelInterfaceFromData(data);
}

async function loadSubmodelTemplateByPath(modelPath, visited = new Set(), options = {}) {
  const normalizedPath = normalizeSubmodelPath(modelPath);
  if (!normalizedPath) {
    throw new Error(t("error.submodelPathInvalid"));
  }
  if (visited.has(normalizedPath)) {
    throw new Error(t("error.submodelRecursiveReference"));
  }
  if (submodelTemplateCache.has(normalizedPath)) {
    const cachedTemplate = submodelTemplateCache.get(normalizedPath);
    const nextVisited = new Set(visited);
    nextVisited.add(normalizedPath);
    for (const childNode of cachedTemplate.nodes.filter((node) => isSubmodelNode(node) && String(node.modelPath ?? "").trim())) {
      await loadSubmodelTemplateByPath(childNode.modelPath, nextVisited, options);
    }
    return cachedTemplate;
  }
  const { text } = await resolveSubmodelFileByPath(normalizedPath, {
    allowPrompt: options.allowPrompt !== false,
  });
  const data = JSON.parse(text);
  const template = buildRuntimeModelFromData(data);
  submodelTemplateCache.set(normalizedPath, template);
  const nextVisited = new Set(visited);
  nextVisited.add(normalizedPath);
  for (const childNode of template.nodes.filter((node) => isSubmodelNode(node) && String(node.modelPath ?? "").trim())) {
    await loadSubmodelTemplateByPath(childNode.modelPath, nextVisited, options);
  }
  return template;
}

async function ensureSubmodelTemplatesReady(options = {}) {
  const submodelNodes = graph.nodes.filter((node) => isSubmodelNode(node));
  if (!submodelNodes.length) {
    ui.submodelsPrepared = true;
    return true;
  }
  if (ui.submodelsPrepared) {
    return true;
  }
  try {
    for (const node of submodelNodes) {
      const normalizedPath = normalizeSubmodelPath(node.modelPath);
      if (!normalizedPath) {
        node.submodelError = t("error.nodeDefinition.missingSubmodelPath");
        continue;
      }
      const template = await loadSubmodelTemplateByPath(normalizedPath, new Set(), options);
      node.interfaceCache = {
        inputs: template.nodes.filter((child) => child.input).map((child) => child.name),
        outputs: template.nodes.filter((child) => child.output).map((child) => child.name),
      };
      node.submodelError = "";
      sanitizeSubmodelBindings(node);
      sanitizeAllEdgesForNode(node.id);
    }
    ui.submodelsPrepared = true;
    refreshSidebar();
    render();
    return true;
  } catch (err) {
    if (options.allowPrompt === false && isDeferredSubmodelResolutionError(err)) {
      return false;
    }
    ui.submodelsPrepared = false;
    setStatusKey("error.submodelPrepareFailed", { message: String(err?.message || t("error.load")) });
    return false;
  }
}

async function refreshSubmodelInterface(node, updateStatus = true, options = {}) {
  if (!node || !isSubmodelNode(node)) {
    return false;
  }
  const modelPath = String(node.modelPath ?? "").trim();
  if (!modelPath) {
    node.interfaceCache = { inputs: [], outputs: [] };
    node.submodelError = t("error.nodeDefinition.missingSubmodelPath");
    ui.submodelsPrepared = false;
    if (updateStatus) {
      setStatusKey("error.submodelMissingPath");
    }
    render();
    return false;
  }
  try {
    const normalizedPath = normalizeSubmodelPath(modelPath);
    const { text } = await resolveSubmodelFileByPath(normalizedPath, {
      allowPrompt: options.allowPrompt !== false,
    });
    const data = JSON.parse(text);
    submodelTemplateCache.set(normalizedPath, buildRuntimeModelFromData(data));
    const iface = extractSubmodelInterfaceFromData(data);
    node.interfaceCache = {
      inputs: Array.isArray(iface.inputs) ? iface.inputs.map((value) => String(value)) : [],
      outputs: Array.isArray(iface.outputs) ? iface.outputs.map((value) => String(value)) : [],
    };
    sanitizeSubmodelBindings(node);
    sanitizeAllEdgesForNode(node.id);
    node.submodelError = "";
    invalidateExecutionPlan();
    ui.submodelsPrepared = false;
    scheduleFileStatusRefresh();
    if (updateStatus) {
      setStatusKey("status.submodelInterfaceLoaded", { name: node.name });
    }
    render();
    return true;
  } catch (err) {
    if (options.allowPrompt === false && isDeferredSubmodelResolutionError(err)) {
      return false;
    }
    node.interfaceCache = { inputs: [], outputs: [] };
    node.submodelError = String(err?.message || t("error.load"));
    ui.submodelsPrepared = false;
    sanitizeAllEdgesForNode(node.id);
    invalidateExecutionPlan();
    scheduleFileStatusRefresh();
    if (updateStatus) {
      setStatusKey("error.submodelLoadFailed", { message: node.submodelError });
    }
    render();
    return false;
  }
}

async function refreshAllSubmodelInterfaces() {
  const submodelNodes = graph.nodes.filter((node) => isSubmodelNode(node) && String(node.modelPath ?? "").trim());
  if (!submodelNodes.length) {
    return;
  }
  for (const node of submodelNodes) {
    // Best-effort refresh without spamming the status bar.
    await refreshSubmodelInterface(node, false, { allowPrompt: false });
  }
}

async function preloadSubmodelsAfterLoad() {
  const submodelNodes = graph.nodes.filter((node) => isSubmodelNode(node) && String(node.modelPath ?? "").trim());
  if (!submodelNodes.length) {
    return;
  }
  try {
    await refreshAllSubmodelInterfaces();
    await ensureSubmodelTemplatesReady({ allowPrompt: false });
  } catch (_err) {
    // Best-effort preload. Errors are already surfaced by the preparation path.
  }
}

async function openSubmodelNode(node) {
  if (!node || !isSubmodelNode(node)) {
    return false;
  }
  const modelPath = normalizeSubmodelPath(node.modelPath);
  if (!modelPath) {
    setStatusKey("error.submodelMissingPath");
    return false;
  }
  try {
    const { text, fileHandle, file, directoryHandle } = await resolveSubmodelFileByPath(modelPath);
    submodelTemplateCache.set(modelPath, buildRuntimeModelFromData(JSON.parse(text)));
    modelContextStack.push(captureCurrentModelContext(node.name));
    const effectiveDirectoryHandle = directoryHandle || await deriveDirectoryHandleFromFileHandle(fileHandle) || null;
    loadGraphFromJsonText(
      text,
      (fileHandle && fileHandle.name) || (file && file.name) || modelPath,
      fileHandle,
      effectiveDirectoryHandle,
      true,
    );
    await preloadSubmodelsAfterLoad();
    setStatusKey("status.submodelOpened", { name: node.name });
    return true;
  } catch (err) {
    setStatusKey("error.submodelOpenFailed", { message: String(err?.message || t("error.load")) });
    return false;
  }
}

async function exitCurrentSubmodel() {
  if (modelContextStack.length === 0) {
    return;
  }
  if (hasUnsavedChanges()) {
    const shouldSave = window.confirm(t("confirm.exitSubmodel.save"));
    if (shouldSave) {
      const saved = await saveGraphJson(false);
      if (!saved) {
        return;
      }
    }
  }
  const parentContext = modelContextStack.pop();
  restoreModelContext(parentContext);
  setStatusKey("status.submodelClosed");
}

async function writeJsonToFileHandle(fileHandle, json) {
  if (!fileHandle) {
    return false;
  }
  try {
    const writable = await fileHandle.createWritable();
    await writable.write(json);
    await writable.close();
    return true;
  } catch (_err) {
    return false;
  }
}

async function pickSaveAsHandle(suggestedName) {
  if (supportsSaveFilePicker()) {
    return showSaveFilePickerCompat({
      suggestedName: normalizeJsonFilename(suggestedName),
      types: [
        {
          description: "JSON",
          accept: { "application/json": [".json"] },
        },
      ],
    });
  }

  return null;
}

async function saveGraphJson(forceSaveAs = false) {
  forceSaveAs = forceSaveAs === true;

  if (!forceSaveAs && !dirtySinceLastSave) {
    setStatusKey("status.alreadySaved");
    return true;
  }

  const data = exportGraphData();
  const json = JSON.stringify(data, null, 2);
  let filename = currentFileName || defaultGraphFilename();

  if (!forceSaveAs && currentFileHandle) {
    const ok = await writeJsonToFileHandle(currentFileHandle, json);
    if (!ok) {
      setStatusKey("error.saveFailed");
      return false;
    }
    filename = currentFileHandle.name || filename;
    currentFileName = filename;
    currentModelDirectoryHandle = currentModelDirectoryHandle || await deriveDirectoryHandleFromFileHandle(currentFileHandle) || null;
    submodelTemplateCache.set(String(currentFileName || filename), buildRuntimeModelFromData(data));
    markSavedSnapshot();
    await rememberRecentModel(currentFileName || filename, currentFileHandle);
    setStatusKey("status.saved");
    return true;
  }

  if (!forceSaveAs && !currentFileHandle) {
    try {
      currentFileHandle = await pickSaveAsHandle(filename);
      if (currentFileHandle) {
        currentFileName = currentFileHandle.name || normalizeJsonFilename(filename);
        const ok = await writeJsonToFileHandle(currentFileHandle, json);
        if (!ok) {
          setStatusKey("error.saveFailed");
          return false;
        }
        currentModelDirectoryHandle = await deriveDirectoryHandleFromFileHandle(currentFileHandle) || currentModelDirectoryHandle || null;
        submodelTemplateCache.set(String(currentFileName || filename), buildRuntimeModelFromData(data));
        markSavedSnapshot();
        await rememberRecentModel(currentFileName || filename, currentFileHandle);
        setStatusKey("status.saved");
        return true;
      }
    } catch (err) {
      if (err && err.name === "AbortError") {
        setStatusKey("status.saveCanceled");
        return false;
      }
      currentFileHandle = null;
    }

    let selectedName = normalizeJsonFilename(filename);
    if (isFirefoxBrowser()) {
      const proposed = window.prompt(t("prompt.saveAs"), selectedName);
      if (proposed == null) {
        setStatusKey("status.saveCanceled");
        return false;
      }
      selectedName = normalizeJsonFilename(proposed);
    }
    currentFileName = selectedName;
    submodelTemplateCache.set(String(currentFileName || selectedName), buildRuntimeModelFromData(data));
    downloadJsonFile(selectedName, json);
    markSavedSnapshot();
    await rememberRecentModel(currentFileName || selectedName, currentFileHandle);
    setStatusKey("status.saved");
    return true;
  }

  if (forceSaveAs) {
    const hasNativeSavePicker = supportsSaveFilePicker();
    try {
      currentFileHandle = await pickSaveAsHandle(filename);
      if (currentFileHandle) {
        currentFileName = currentFileHandle.name || normalizeJsonFilename(filename);
      }
    } catch (err) {
      if (err && err.name === "AbortError") {
        setStatusKey("status.saveCanceled");
        return false;
      }
      if (hasNativeSavePicker) {
        setStatusKey("error.saveFailed");
        return false;
      }
      currentFileHandle = null;
    }
    if (currentFileHandle) {
      const ok = await writeJsonToFileHandle(currentFileHandle, json);
      if (!ok) {
        setStatusKey("error.saveFailed");
        return false;
      } else {
        filename = currentFileHandle.name || filename;
        currentFileName = filename;
        currentModelDirectoryHandle = await deriveDirectoryHandleFromFileHandle(currentFileHandle) || currentModelDirectoryHandle || null;
        submodelTemplateCache.set(String(currentFileName || filename), buildRuntimeModelFromData(data));
        markSavedSnapshot();
        await rememberRecentModel(currentFileName || filename, currentFileHandle);
        setStatusKey("status.savedAs");
        return true;
      }
    }
  }

  if (forceSaveAs) {
    if (isFirefoxBrowser()) {
      const proposed = window.prompt(t("prompt.saveAs"), normalizeJsonFilename(filename));
      if (proposed == null) {
        setStatusKey("status.saveCanceled");
        return false;
      }
      filename = normalizeJsonFilename(proposed);
    } else {
      filename = normalizeJsonFilename(filename);
    }
    currentFileName = filename;
  } else {
    filename = normalizeJsonFilename(filename);
    currentFileName = filename;
  }

  downloadJsonFile(filename, json);
  submodelTemplateCache.set(String(currentFileName || filename), buildRuntimeModelFromData(data));
  markSavedSnapshot();
  await rememberRecentModel(currentFileName || filename, currentFileHandle);
  setStatusKey(forceSaveAs ? "status.savedAs" : "status.saved");
  return true;
}

async function loadGraphJsonFile(file) {
  try {
    const extraFiles = Array.from(loadJsonInput.files || []).filter((entry) => entry !== file);
    const rootEntry = await prepareSelectedJsonEntries([file, ...extraFiles]);
    if (!rootEntry) {
      return;
    }
    await openPreparedJsonEntry(rootEntry);
  } catch (_err) {
    cancelTransaction();
    setStatusKey("status.readError");
  }
}

async function openGraphJson() {
  const proceed = await maybeSaveUnsavedChangesBeforeModelReplace("confirm.openGraph.save");
  if (!proceed) {
    return;
  }
  modelContextStack.length = 0;
  if (supportsOpenFilePicker()) {
    try {
      const handles = await showOpenFilePickerCompat({
        multiple: true,
        types: [
          {
            description: "JSON",
            accept: { "application/json": [".json"] },
          },
        ],
      });
      if (!handles || handles.length === 0) {
        return;
      }
      submodelTemplateCache.clear();
      submodelFileHandleCache.clear();
      submodelSourceCache.clear();
      const rootEntry = await prepareSelectedJsonEntries(handles);
      if (!rootEntry) {
        return;
      }
      await openPreparedJsonEntry(rootEntry);
      return;
    } catch (err) {
      if (err && err.name === "AbortError") {
        return;
      }
    }
  }
  loadJsonInput.multiple = true;
  loadJsonInput.click();
}

async function createNewGraph() {
  const proceed = await maybeSaveUnsavedChangesBeforeModelReplace("confirm.newGraph.save");
  if (!proceed) {
    return;
  }
  modelContextStack.length = 0;

  graph.modelTitle = "";
  graph.properties = [];
  graph.nodes = [];
  graph.edges = [];
  graph.textItems = [];
  graph.widgets = [];
  invalidateExecutionPlan();
  stopTimedExecution(false);
  graph.execution = {
    t0: 0,
    dt: 1,
    t1: 10,
    delayMs: 1000,
    decimals: 3,
    integrator: "euler",
    strictDefinitions: false,
    currentTime: null,
  };
  nodeCounter = 1;
  edgeCounter = 1;
  widgetCounter = 1;
  textItemCounter = 1;
  clearAllSelection();
  history.undo = [];
  history.redo = [];
  updateHistoryButtons();
  currentFileHandle = null;
  currentFileName = defaultGraphFilename();
  currentModelDirectoryHandle = null;
  submodelTemplateCache.clear();
  submodelFileHandleCache.clear();
  submodelSourceCache.clear();
  ui.submodelsPrepared = false;
  markSavedSnapshot();
  setStatusKey("status.newGraph");
  render();
}

function stopTimedExecution(updateStatus = true) {
  if (ui.timedRunHandle != null) {
    window.clearInterval(ui.timedRunHandle);
    ui.timedRunHandle = null;
    ui.timedStepRunning = false;
    if (updateStatus) {
      setStatusKey("status.timedStopped");
    }
    render();
  }
}

function isTimeWithinBounds(value, t0, dt, t1) {
  const epsilon = Math.max(1e-12, Math.abs(dt) * 1e-9);
  if (dt > 0) {
    return value <= t1 + epsilon && value >= t0 - epsilon;
  }
  return value >= t1 - epsilon && value <= t0 + epsilon;
}

function isExecutionEnded(cfg) {
  if (graph.execution.currentTime == null) {
    return false;
  }
  const nextTime = graph.execution.currentTime + cfg.dt;
  return !isTimeWithinBounds(nextTime, cfg.t0, cfg.dt, cfg.t1);
}

function parseModelPropertyStoredValue(raw) {
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

function serializeModelPropertyStoredValue(value) {
  if (value === true) {
    return "1";
  }
  if (value === false) {
    return "0";
  }
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value) || typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

function parseNodePropertyStoredValue(raw) {
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

function serializeNodePropertyStoredValue(value) {
  if (value === true) {
    return "1";
  }
  if (value === false) {
    return "0";
  }
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value) || typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

function buildRuntimeModelFromData(data) {
  if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
    throw new Error(t("error.invalidJson"));
  }
  const execCfg = normalizeExecutionConfig(data.execution);
  const nodes = data.nodes
    .filter((n) => Number.isInteger(n.id))
    .map((n) => {
      if (!["state", "algebraic", "parameter", "submodel"].includes(n.type)) {
        throw new Error(t("error.invalidJson"));
      }
      const shape = deserializeNodeType(n.type);
      const node = {
        id: n.id,
        name: typeof n.name === "string" ? n.name : t("node.defaultName", { id: n.id }),
        input: shape === "ellipse" ? Boolean(n.input) : false,
        output: Boolean(n.output),
        shape,
        x: Number.isFinite(Number(n.x)) ? Number(n.x) : 200,
        y: Number.isFinite(Number(n.y)) ? Number(n.y) : 200,
        width: clamp(Number(n.width) || 120, 40, 500),
        height: clamp(Number(n.height) || 70, 30, 500),
      valueExpression: shape === "rect"
        ? String(n.stateTransition ?? "")
        : String(n.valueExpression ?? ""),
      initialStateExpression: shape === "rect"
        ? String(n.initialState ?? "")
        : "",
      modelPath: shape === "submodel" ? String(n.modelPath ?? "") : "",
      inputBindings: shape === "submodel" && n.inputBindings && typeof n.inputBindings === "object"
          ? Object.fromEntries(
            Object.entries(n.inputBindings)
              .map(([key, value]) => [String(key), String(value ?? "")])
              .filter(([key]) => key.trim()),
          )
          : {},
        interfaceCache: shape === "submodel" && n.interfaceCache && typeof n.interfaceCache === "object"
          ? {
            inputs: Array.isArray(n.interfaceCache.inputs) ? n.interfaceCache.inputs.map((value) => String(value)) : [],
            outputs: Array.isArray(n.interfaceCache.outputs) ? n.interfaceCache.outputs.map((value) => String(value)) : [],
          }
          : { inputs: [], outputs: [] },
        submodelError: "",
        computedValue: null,
        computedError: "",
        pendingStateValue: null,
        pendingStateError: "",
        externalValueEnabled: false,
        externalValue: null,
        properties: Array.isArray(n.properties)
          ? n.properties.map((p) => ({ key: String(p?.key ?? ""), value: String(p?.value ?? "") }))
          : [],
      };
      normalizeNodeDescriptionProperty(node);
      return node;
    });
  const nodesWithValidNames = semantics.sanitizeNodeNames(nodes, "n");
  const nodeIds = new Set(nodesWithValidNames.map((node) => node.id));
  const edges = data.edges
    .filter((e) => Number.isInteger(e.id) && nodeIds.has(e.from) && nodeIds.has(e.to) && e.from !== e.to)
    .map((e) => ({
      id: e.id,
      from: e.from,
      to: e.to,
      sourcePort: String(e.sourcePort ?? ""),
      targetPort: String(e.targetPort ?? ""),
      controlPoints: Array.isArray(e.controlPoints)
        ? e.controlPoints.filter(isValidPoint).map((cp) => ({ x: cp.x, y: cp.y }))
        : [],
    }));

  return {
    modelTitle: String(data?.modelTitle ?? ""),
    properties: Array.isArray(data?.modelProperties)
      ? data.modelProperties.map((p) => ({ key: String(p?.key ?? ""), value: String(p?.value ?? "") }))
      : [],
    nodes: nodesWithValidNames,
    edges,
    widgets: [],
    execution: {
      t0: execCfg.t0,
      dt: execCfg.dt,
      t1: execCfg.t1,
      delayMs: execCfg.delayMs,
      decimals: execCfg.decimals,
      integrator: execCfg.integrator,
      strictDefinitions: execCfg.strictDefinitions,
      currentTime: null,
    },
  };
}

function cloneRuntimeModel(template) {
  return deepClone(template);
}

function getModelPropertyValue(key, fallback = null) {
  const name = String(key ?? "");
  const found = graph.properties.find((prop) => String(prop?.key ?? "") === name);
  if (!found) {
    return fallback;
  }
  return parseModelPropertyStoredValue(found.value);
}

function setModelPropertyValue(key, value) {
  const name = String(key ?? "");
  const stored = serializeModelPropertyStoredValue(value);
  const found = graph.properties.find((prop) => String(prop?.key ?? "") === name);
  if (found) {
    found.value = stored;
  } else {
    graph.properties.push({ key: name, value: stored });
  }
  return value;
}

function buildExecutionGlobals(timeValue) {
  return {
    time: timeValue,
    t0: Number(graph.execution.t0),
    t1: Number(graph.execution.t1),
    dt: Number(graph.execution.dt),
    getModelProperty: getModelPropertyValue,
    setModelProperty: setModelPropertyValue,
  };
}

function buildExecutionGlobalsForModel(model, rootExecution, timeValue) {
  return {
    time: timeValue,
    t0: Number(rootExecution.t0),
    t1: Number(rootExecution.t1),
    dt: Number(rootExecution.dt),
    getModelProperty: (key, fallback = null) => {
      const name = String(key ?? "");
      const found = model.properties.find((prop) => String(prop?.key ?? "") === name);
      return found ? parseModelPropertyStoredValue(found.value) : fallback;
    },
    setModelProperty: (key, value) => {
      const name = String(key ?? "");
      const stored = serializeModelPropertyStoredValue(value);
      const found = model.properties.find((prop) => String(prop?.key ?? "") === name);
      if (found) {
        found.value = stored;
      } else {
        model.properties.push({ key: name, value: stored });
      }
      return value;
    },
  };
}

function nodePropertyAccessForContext(node) {
  return {
    getProperty: (key, fallback = null) => {
      const found = node.properties.find((prop) => String(prop?.key ?? "") === String(key ?? ""));
      return found ? parseNodePropertyStoredValue(found.value) : fallback;
    },
    setProperty: (key, value) => {
      const name = String(key ?? "");
      const stored = serializeNodePropertyStoredValue(value);
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

function evaluateParameterNodesForModel(model, timeValue, rootExecution) {
  const globals = buildExecutionGlobalsForModel(model, rootExecution, timeValue);
  const parameterNodes = (model?.nodes || []).filter((node) => node?.shape === "diamond");
  const pending = new Set(parameterNodes.map((node) => node.id));
  const resolved = new Set();

  parameterNodes.forEach((node) => {
    node.pendingStateValue = null;
    node.pendingStateError = "";
  });

  while (pending.size > 0) {
    let progressed = false;
    for (const nodeId of [...pending]) {
      const node = getModelNodeById(model, nodeId);
      if (!node) {
        pending.delete(nodeId);
        continue;
      }
      const context = {
        ...globals,
        ...nodePropertyAccessForContext(node),
      };
      let blockedByDependency = false;
      (model.edges || [])
        .filter((edge) => edge.to === node.id)
        .forEach((edge) => {
          const fromNode = getModelNodeById(model, edge.from);
          if (!fromNode || fromNode.shape !== "diamond") {
            return;
          }
          if (!resolved.has(fromNode.id)) {
            blockedByDependency = true;
            return;
          }
          context[fromNode.name] = fromNode.computedValue;
        });
      if (blockedByDependency) {
        continue;
      }

      const expr = String(node.valueExpression ?? "0");
      const result = semantics.evaluateValueExpression(expr, context);
      if (result.ok) {
        node.computedValue = result.value;
        node.computedError = "";
      } else {
        node.computedValue = null;
        node.computedError = result.reason || "runtime";
      }
      pending.delete(nodeId);
      resolved.add(nodeId);
      progressed = true;
    }

    if (progressed) {
      continue;
    }

    pending.forEach((nodeId) => {
      const node = getModelNodeById(model, nodeId);
      if (!node) {
        return;
      }
      node.computedValue = null;
      node.computedError = "dependency";
    });
    break;
  }
}

function buildInitialStateContextForModel(model, node, timeValue, rootExecution) {
  const context = {
    ...buildExecutionGlobalsForModel(model, rootExecution, timeValue),
    ...nodePropertyAccessForContext(node),
  };
  (model.edges || [])
    .filter((edge) => edge.to === node.id)
    .forEach((edge) => {
      const fromNode = getModelNodeById(model, edge.from);
      if (!fromNode || fromNode.shape !== "diamond" || fromNode.computedError) {
        return;
      }
      context[fromNode.name] = fromNode.computedValue;
    });
  return context;
}

function initializeStateNodesForModel(model, timeValue, rootExecution) {
  evaluateParameterNodesForModel(model, timeValue, rootExecution);
  model.nodes.forEach((node) => {
    if (!isStateNode(node)) {
      if (node.shape !== "diamond") {
        node.computedValue = null;
        node.computedError = "";
      }
      node.pendingStateValue = null;
      node.pendingStateError = "";
      return;
    }
    const initExpr = String(node.initialStateExpression ?? "0");
    const initResult = semantics.evaluateValueExpression(
      initExpr,
      buildInitialStateContextForModel(model, node, timeValue, rootExecution),
    );
    if (initResult.ok) {
      node.computedValue = initResult.value;
      node.computedError = "";
    } else {
      node.computedValue = null;
      node.computedError = initResult.reason || "runtime";
    }
    node.pendingStateValue = null;
    node.pendingStateError = "";
  });
}

function promotePendingStateNodesForModel(model) {
  model.nodes.forEach((node) => {
    if (!isStateNode(node)) {
      return;
    }
    if (node.pendingStateError) {
      node.computedValue = null;
      node.computedError = node.pendingStateError;
      node.pendingStateValue = null;
      node.pendingStateError = "";
      return;
    }
    if (node.pendingStateValue !== null && node.pendingStateValue !== undefined) {
      node.computedValue = node.pendingStateValue;
      node.computedError = "";
      node.pendingStateValue = null;
      node.pendingStateError = "";
    }
  });
}

function getCachedSubmodelTemplate(modelPath) {
  const normalized = normalizeSubmodelPath(modelPath);
  return normalized ? submodelTemplateCache.get(normalized) || null : null;
}

function ensureSubmodelRuntimeModel(node) {
  const normalizedPath = normalizeSubmodelPath(node?.modelPath);
  if (!normalizedPath) {
    return null;
  }
  const template = getCachedSubmodelTemplate(normalizedPath);
  if (!template) {
    return null;
  }
  if (!node.__runtimeSubmodel || node.__runtimeSubmodelPath !== normalizedPath) {
    node.__runtimeSubmodel = cloneRuntimeModel(template);
    node.__runtimeSubmodelPath = normalizedPath;
  }
  return node.__runtimeSubmodel;
}

function buildSubmodelInputOverrides(model, node, parentContext) {
  const overrides = new Map();
  const assignedPorts = new Set();

  (model?.edges || [])
    .filter((edge) => edge.to === node.id && String(edge.targetPort ?? "").trim())
    .forEach((edge) => {
      const targetPort = String(edge.targetPort ?? "").trim();
      const fromNode = getModelNodeById(model, edge.from);
      if (!fromNode) {
        return;
      }
      if (assignedPorts.has(targetPort)) {
        throw new Error(`duplicate input binding for ${targetPort}`);
      }
      let value = parentContext[fromNode.name];
      const sourcePort = String(edge.sourcePort ?? "").trim();
      if (sourcePort) {
        if (value == null || typeof value !== "object" || !Object.prototype.hasOwnProperty.call(value, sourcePort)) {
          throw new Error(`missing submodel output ${sourcePort}`);
        }
        value = value[sourcePort];
      }
      overrides.set(targetPort, value);
      assignedPorts.add(targetPort);
    });

  Object.entries(node.inputBindings || {}).forEach(([inputName, expr]) => {
    const name = String(inputName || "").trim();
    if (!name || assignedPorts.has(name)) {
      return;
    }
    const result = semantics.evaluateValueExpression(String(expr ?? ""), parentContext);
    if (!result.ok) {
      throw new Error(result.message || result.reason || "runtime");
    }
    overrides.set(name, result.value);
  });

  return overrides;
}

function evaluateModelAtTimeRecursive(model, timeValue, env, options = {}) {
  const executionGlobals = buildExecutionGlobalsForModel(model, env.rootExecution, timeValue);
  const executionPlan = semantics.prepareStatefulExecutionPlan(model.nodes, model.edges);
  const stateValueOverrides = options.stateValueOverrides instanceof Map ? options.stateValueOverrides : null;
  const rk4Analyses = String(env.rootExecution?.integrator ?? "euler") === "rk4"
    ? collectRk4IntegralStateAnalysesForModel(model)
    : new Map();
  const integralStateNodeIds = new Set(rk4Analyses.keys());
  const evalResults = semantics.evaluateStatefulGraphStep(
    model.nodes,
    model.edges,
    executionGlobals,
    executionPlan,
    {
      stateValueOverrides: stateValueOverrides || undefined,
      derivativeStateNodeIds: integralStateNodeIds.size > 0 ? integralStateNodeIds : undefined,
      customNodeEvaluator: createSubmodelNodeEvaluator(model, timeValue, env, {
        applyResults: options.applyResults !== false,
      }),
    },
  );
  const algebraicValueMap = extractSuccessfulAlgebraicValueMap(evalResults.algebraic);

  let rk4Results = null;
  if (integralStateNodeIds.size > 0) {
    const stage1Failure = firstFailedEntry(evalResults.stateTransitions, integralStateNodeIds);
    if (!stage1Failure) {
      const currentStateMap = buildCurrentStateMapForModel(model, stateValueOverrides);
      const k1 = extractSuccessfulResultMap(evalResults.stateTransitions);
      const dt = Number(env.rootExecution.dt);
      const stage2IntegralValues = buildStageIntegralValuesMap(currentStateMap, k1, dt / 2);
      const stage2TransitionValues = evaluateTransitionResultsWithIntegralValuesForModel(
        model,
        timeValue + dt / 2,
        env,
        executionPlan,
        integralStateNodeIds,
        stage2IntegralValues,
        algebraicValueMap,
        stateValueOverrides,
      );
      const stage2StateOverrides = new Map(
        [...integralStateNodeIds].map((nodeId) => [nodeId, stage2TransitionValues.get(nodeId)?.value ?? currentStateMap.get(nodeId)]),
      );
      const stage2 = semantics.evaluateStatefulGraphStep(
        model.nodes,
        model.edges,
        buildExecutionGlobalsForModel(model, env.rootExecution, timeValue + dt / 2),
        executionPlan,
        {
          derivativeStateNodeIds: integralStateNodeIds,
          stateValueOverrides: stage2StateOverrides,
          customNodeEvaluator: createSubmodelNodeEvaluator(model, timeValue + dt / 2, env, { applyResults: false }),
        },
      );
      const stage2Failure = firstFailedEntry(stage2.stateTransitions, integralStateNodeIds);
      if (!stage2Failure) {
        const stage2AlgebraicValueMap = extractSuccessfulAlgebraicValueMap(stage2.algebraic);
        const k2 = extractSuccessfulResultMap(stage2.stateTransitions);
        const stage3IntegralValues = buildStageIntegralValuesMap(currentStateMap, k2, dt / 2);
        const stage3TransitionValues = evaluateTransitionResultsWithIntegralValuesForModel(
          model,
          timeValue + dt / 2,
          env,
          executionPlan,
          integralStateNodeIds,
          stage3IntegralValues,
          stage2AlgebraicValueMap,
          stage2StateOverrides,
        );
        const stage3StateOverrides = new Map(
          [...integralStateNodeIds].map((nodeId) => [nodeId, stage3TransitionValues.get(nodeId)?.value ?? currentStateMap.get(nodeId)]),
        );
        const stage3 = semantics.evaluateStatefulGraphStep(
          model.nodes,
          model.edges,
          buildExecutionGlobalsForModel(model, env.rootExecution, timeValue + dt / 2),
          executionPlan,
          {
            derivativeStateNodeIds: integralStateNodeIds,
            stateValueOverrides: stage3StateOverrides,
            customNodeEvaluator: createSubmodelNodeEvaluator(model, timeValue + dt / 2, env, { applyResults: false }),
          },
        );
        const stage3Failure = firstFailedEntry(stage3.stateTransitions, integralStateNodeIds);
        if (!stage3Failure) {
          const stage3AlgebraicValueMap = extractSuccessfulAlgebraicValueMap(stage3.algebraic);
          const k3 = extractSuccessfulResultMap(stage3.stateTransitions);
          const stage4IntegralValues = buildStageIntegralValuesMap(currentStateMap, k3, dt);
          const stage4TransitionValues = evaluateTransitionResultsWithIntegralValuesForModel(
            model,
            timeValue + dt,
            env,
            executionPlan,
            integralStateNodeIds,
            stage4IntegralValues,
            stage3AlgebraicValueMap,
            stage3StateOverrides,
          );
          const stage4StateOverrides = new Map(
            [...integralStateNodeIds].map((nodeId) => [nodeId, stage4TransitionValues.get(nodeId)?.value ?? currentStateMap.get(nodeId)]),
          );
          const stage4 = semantics.evaluateStatefulGraphStep(
            model.nodes,
            model.edges,
            buildExecutionGlobalsForModel(model, env.rootExecution, timeValue + dt),
            executionPlan,
            {
              derivativeStateNodeIds: integralStateNodeIds,
              stateValueOverrides: stage4StateOverrides,
              customNodeEvaluator: createSubmodelNodeEvaluator(model, timeValue + dt, env, { applyResults: false }),
            },
          );
          const stage4Failure = firstFailedEntry(stage4.stateTransitions, integralStateNodeIds);
          if (!stage4Failure) {
            const k4 = extractSuccessfulResultMap(stage4.stateTransitions);
            rk4Results = new Map();
            integralStateNodeIds.forEach((nodeId) => {
              const k1List = k1.get(nodeId) || [];
              const k2List = k2.get(nodeId) || [];
              const k3List = k3.get(nodeId) || [];
              const k4List = k4.get(nodeId) || [];
              const integratedValues = k1List.map((_, idx) => rk4IntegratedValue(
                currentStateMap.get(nodeId),
                k1List[idx],
                k2List[idx],
                k3List[idx],
                k4List[idx],
                dt,
              ));
              rk4Results.set(
                nodeId,
                evaluateTransitionResultsWithIntegralValuesForModel(
                  model,
                  timeValue,
                  env,
                  executionPlan,
                  new Set([nodeId]),
                  new Map([[nodeId, integratedValues]]),
                  algebraicValueMap,
                  stateValueOverrides,
                ).get(nodeId) || { ok: false, reason: "dependency" },
              );
            });
          } else {
            rk4Results = new Map(stage4.stateTransitions.map((entry) => [entry.id, entry.result]));
          }
        } else {
          rk4Results = new Map(stage3.stateTransitions.map((entry) => [entry.id, entry.result]));
        }
      } else {
        rk4Results = new Map(stage2.stateTransitions.map((entry) => [entry.id, entry.result]));
      }
    } else {
      rk4Results = new Map(evalResults.stateTransitions.map((entry) => [entry.id, entry.result]));
    }
  }

  let successCount = 0;
  let errorCount = 0;
  let firstErrorNode = null;
  let firstErrorReason = null;

  evalResults.algebraic.forEach((entry) => {
    const node = getModelNodeById(model, entry.id);
    if (!node) {
      return;
    }
    if (entry.result.ok) {
      node.computedValue = entry.result.value;
      node.computedError = "";
      successCount += 1;
    } else {
      node.computedValue = null;
      node.computedError = entry.result.reason || "runtime";
      errorCount += 1;
      if (!firstErrorNode) {
        firstErrorNode = node.name;
        firstErrorReason = node.computedError;
      }
    }
  });

  evalResults.stateTransitions.forEach((entry) => {
    const node = getModelNodeById(model, entry.id);
    if (!node) {
      return;
    }
    const result = integralStateNodeIds.has(entry.id) && rk4Results
      ? (rk4Results.get(entry.id) || { ok: false, reason: "dependency" })
      : entry.result;
    if (result.ok) {
      node.pendingStateValue = result.value;
      node.pendingStateError = "";
      successCount += 1;
    } else {
      node.pendingStateValue = null;
      node.pendingStateError = result.reason || "runtime";
      errorCount += 1;
      if (!firstErrorNode) {
        firstErrorNode = node.name;
        firstErrorReason = node.pendingStateError;
      }
    }
  });

  return { successCount, errorCount, firstErrorNode, firstErrorReason };
}

function currentDisplayTimeValue() {
  return graph.execution.currentTime == null
    ? Number(graph.execution.t0)
    : Number(graph.execution.currentTime);
}

function hasInitializedStateSnapshot(model = graph) {
  const stateNodes = (model?.nodes || []).filter((node) => isStateNode(node));
  if (stateNodes.length === 0) {
    return true;
  }
  return stateNodes.some((node) =>
    (node.computedValue !== null && node.computedValue !== undefined) ||
    String(node.computedError || "").trim() ||
    (node.pendingStateValue !== null && node.pendingStateValue !== undefined) ||
    String(node.pendingStateError || "").trim());
}

function updateMenuTimeLabel() {
  if (!menuTimeText) {
    return;
  }
  const baseTime = graph.execution.currentTime == null
    ? Number(graph.execution.t0)
    : Number(graph.execution.currentTime);
  if (!Number.isFinite(baseTime)) {
    menuTimeText.textContent = "";
    return;
  }
  menuTimeText.textContent = t("menu.time", { time: formatNumberValue(baseTime) });
}

function ensureExecutionPlan() {
  if (!ui.executionPlan) {
    ui.executionPlan = semantics.prepareStatefulExecutionPlan(graph.nodes, graph.edges);
  }
  return ui.executionPlan;
}

function isRk4IntegratorSelected() {
  return String(graph.execution.integrator ?? "euler") === "rk4";
}

function graphHasSubmodels(model = graph) {
  return Boolean(model?.nodes?.some((node) => isSubmodelNode(node)));
}

function clearRuntimeSubmodelState(model = graph) {
  (model?.nodes || []).forEach((node) => {
    node.__runtimeSubmodel = null;
    node.__runtimeSubmodelPath = "";
  });
}

function scaleTensorValue(value, factor) {
  if (Array.isArray(value)) {
    return value.map((item) => scaleTensorValue(item, factor));
  }
  return Number(value) * factor;
}

function combineTensorValues(left, right, scalarFn) {
  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) {
      throw new Error("tensor shape mismatch");
    }
    return left.map((item, idx) => combineTensorValues(item, right[idx], scalarFn));
  }
  if (Array.isArray(left) || Array.isArray(right)) {
    throw new Error("tensor shape mismatch");
  }
  return scalarFn(Number(left), Number(right));
}

function addTensorValues(left, right) {
  return combineTensorValues(left, right, (a, b) => a + b);
}

function rk4IntegratedValue(currentValue, k1, k2, k3, k4, dt) {
  const weighted = addTensorValues(
    addTensorValues(k1, scaleTensorValue(k2, 2)),
    addTensorValues(scaleTensorValue(k3, 2), k4),
  );
  return addTensorValues(currentValue, scaleTensorValue(weighted, dt / 6));
}

function collectRk4IntegralStateAnalyses() {
  const analyses = new Map();
  graph.nodes.forEach((node) => {
    if (!isStateNode(node)) {
      return;
    }
    const analysis = semantics.analyzeStateTransitionExpression(node.valueExpression);
    if (analysis.ok && analysis.usesIntegral && analysis.integralCount > 0) {
      analyses.set(node.id, analysis);
    }
  });
  return analyses;
}

function buildStateOverrideMap(baseMap, derivativeMap, factor) {
  const overrides = new Map();
  for (const [nodeId, baseValue] of baseMap.entries()) {
    const derivativeValue = derivativeMap.get(nodeId);
    if (derivativeValue === undefined) {
      continue;
    }
    overrides.set(nodeId, addTensorValues(baseValue, scaleTensorValue(derivativeValue, factor)));
  }
  return overrides;
}

function extractSuccessfulResultMap(entries) {
  const out = new Map();
  entries.forEach((entry) => {
    if (entry?.result?.ok) {
      out.set(entry.id, entry.result.value);
    }
  });
  return out;
}

function extractSuccessfulAlgebraicValueMap(entries) {
  const out = new Map();
  entries.forEach((entry) => {
    if (entry?.result?.ok) {
      out.set(entry.id, entry.result.value);
    }
  });
  return out;
}

function firstFailedEntry(entries, nodeIds = null) {
  const allowed = nodeIds instanceof Set ? nodeIds : null;
  for (const entry of entries) {
    if (allowed && !allowed.has(entry.id)) {
      continue;
    }
    if (!entry?.result?.ok) {
      return entry;
    }
  }
  return null;
}

function collectRk4IntegralStateAnalysesForModel(model) {
  const analyses = new Map();
  (model?.nodes || []).forEach((node) => {
    if (!isStateNode(node)) {
      return;
    }
    const analysis = semantics.analyzeStateTransitionExpression(node.valueExpression);
    if (analysis.ok && analysis.usesIntegral && analysis.integralCount > 0) {
      analyses.set(node.id, analysis);
    }
  });
  return analyses;
}

function buildCurrentStateMapForModel(model, stateValueOverrides = null) {
  const out = new Map();
  (model?.nodes || []).forEach((node) => {
    if (!isStateNode(node)) {
      return;
    }
    out.set(
      node.id,
      stateValueOverrides instanceof Map && stateValueOverrides.has(node.id)
        ? stateValueOverrides.get(node.id)
        : node.computedValue,
    );
  });
  return out;
}

function createSubmodelNodeEvaluator(model, timeValue, env, options = {}) {
  const applyResults = options.applyResults !== false;
  return function submodelNodeEvaluator(runtimeNode, context) {
    if (!isSubmodelNode(runtimeNode)) {
      return null;
    }
    const normalizedPath = normalizeSubmodelPath(runtimeNode.modelPath);
    if (!normalizedPath) {
      return { ok: false, reason: "runtime", message: "missing submodel path" };
    }
    if (!submodelTemplateCache.has(normalizedPath)) {
      return { ok: false, reason: "runtime", message: "submodel is not loaded" };
    }
    if (env.stack.includes(normalizedPath)) {
      return { ok: false, reason: "runtime", message: "recursive submodel reference" };
    }
    try {
      const inputOverrides = buildSubmodelInputOverrides(model, runtimeNode, context);
      const runtimeChildModel = ensureSubmodelRuntimeModel(runtimeNode);
      if (!runtimeChildModel) {
        return { ok: false, reason: "runtime", message: "submodel is not loaded" };
      }
      const childModel = applyResults ? runtimeChildModel : cloneRuntimeModel(runtimeChildModel);
      applyRuntimeModelInputOverrides(childModel, inputOverrides);
      let childResult;
      if (childModel.execution.currentTime == null || childModel.execution.currentTime !== timeValue) {
        if (childModel.execution.currentTime == null) {
          initializeStateNodesForModel(childModel, timeValue, env.rootExecution);
        } else {
          promotePendingStateNodesForModel(childModel);
        }
      }
      childResult = evaluateModelAtTimeRecursive(
        childModel,
        timeValue,
        {
          rootExecution: env.rootExecution,
          stack: [...env.stack, normalizedPath],
        },
        { applyResults },
      );
      childModel.execution.currentTime = timeValue;
      if (childResult.errorCount > 0) {
        return {
          ok: false,
          reason: childResult.firstErrorReason || "runtime",
          message: childResult.firstErrorNode || "submodel",
        };
      }
      const outputs = {};
      childModel.nodes.forEach((childNode) => {
        if (childNode.output) {
          outputs[childNode.name] = childNode.computedValue;
        }
      });
      return { ok: true, kind: "object", value: outputs };
    } catch (err) {
      return { ok: false, reason: "runtime", message: String(err?.message || "runtime") };
    }
  };
}

function evaluateTransitionResultsWithIntegralValuesForModel(
  model,
  timeValue,
  env,
  executionPlan,
  integralStateIds,
  integralValuesMap,
  algebraicValueMap,
  stateValueOverrides = null,
) {
  const globals = buildExecutionGlobalsForModel(model, env.rootExecution, timeValue);
  const results = new Map();
  (model?.nodes || []).forEach((node) => {
    if (!integralStateIds.has(node.id)) {
      return;
    }
    const context = {
      ...globals,
      __self: stateValueOverrides instanceof Map && stateValueOverrides.has(node.id)
        ? stateValueOverrides.get(node.id)
        : node.computedValue,
      getProperty: (key, fallback = null) => {
        const found = node.properties.find((prop) => String(prop?.key ?? "") === String(key ?? ""));
        return found ? parseNodePropertyStoredValue(found.value) : fallback;
      },
      setProperty: (key, value) => {
        const name = String(key ?? "");
        const stored = serializeNodePropertyStoredValue(value);
        const found = node.properties.find((prop) => String(prop?.key ?? "") === name);
        if (found) {
          found.value = stored;
        } else {
          node.properties.push({ key: name, value: stored });
        }
        return value;
      },
    };
    (executionPlan.incoming.get(node.id) || []).forEach((fromId) => {
      const fromNode = getModelNodeById(model, fromId);
      if (!fromNode) {
        return;
      }
      if (isStateNode(fromNode)) {
        context[fromNode.name] = stateValueOverrides instanceof Map && stateValueOverrides.has(fromId)
          ? stateValueOverrides.get(fromId)
          : fromNode.computedValue;
        return;
      }
      if (algebraicValueMap.has(fromId)) {
        context[fromNode.name] = algebraicValueMap.get(fromId);
      }
    });
    results.set(
      node.id,
      semantics.evaluateStateTransitionExpressionWithIntegralValues(
        node.valueExpression,
        context,
        integralValuesMap.get(node.id) || [],
        { allowThisAlias: true },
      ),
    );
  });
  return results;
}

function buildStageIntegralValuesMap(currentStateMap, derivativeListMap, factor) {
  const out = new Map();
  for (const [nodeId, derivativeList] of derivativeListMap.entries()) {
    const currentValue = currentStateMap.get(nodeId);
    if (!Array.isArray(derivativeList)) {
      continue;
    }
    out.set(
      nodeId,
      derivativeList.map((derivativeValue) => addTensorValues(currentValue, scaleTensorValue(derivativeValue, factor))),
    );
  }
  return out;
}

function evaluateTransitionResultsWithIntegralValues(timeValue, integralStateIds, integralValuesMap) {
  const globals = buildExecutionGlobals(timeValue);
  const executionPlan = ensureExecutionPlan();
  const results = new Map();
  graph.nodes.forEach((node) => {
    if (!integralStateIds.has(node.id)) {
      return;
    }
    const context = {
      ...globals,
      __self: node.computedValue,
    };
    (executionPlan.incoming.get(node.id) || []).forEach((fromId) => {
      const fromNode = getNodeById(fromId);
      if (!fromNode) {
        return;
      }
      context[fromNode.name] = fromNode.computedValue;
    });
    const access = {
      getProperty: (key, fallback = null) => {
        const found = node.properties.find((prop) => String(prop?.key ?? "") === String(key ?? ""));
        return found ? parseNodePropertyStoredValue(found.value) : fallback;
      },
      setProperty: (key, value) => {
        const name = String(key ?? "");
        const stored = serializeNodePropertyStoredValue(value);
        const found = node.properties.find((prop) => String(prop?.key ?? "") === name);
        if (found) {
          found.value = stored;
        } else {
          node.properties.push({ key: name, value: stored });
        }
        return value;
      },
    };
    results.set(
      node.id,
      semantics.evaluateStateTransitionExpressionWithIntegralValues(
        node.valueExpression,
        { ...context, ...access },
        integralValuesMap.get(node.id) || [],
        { allowThisAlias: true },
      ),
    );
  });
  return results;
}

function initializeStateNodes(timeValue) {
  evaluateParameterNodesForModel(graph, timeValue, graph.execution);
  graph.nodes.forEach((node) => {
    if (!isStateNode(node)) {
      if (node.shape !== "diamond") {
        node.computedValue = null;
        node.computedError = "";
      }
      node.pendingStateValue = null;
      node.pendingStateError = "";
      return;
    }
    const initExpr = String(node.initialStateExpression ?? "0");
    const initResult = semantics.evaluateValueExpression(
      initExpr,
      buildInitialStateContextForModel(graph, node, timeValue, graph.execution),
    );
    if (initResult.ok) {
      node.computedValue = initResult.value;
      node.computedError = "";
    } else {
      node.computedValue = null;
      node.computedError = initResult.reason || "runtime";
    }
    node.pendingStateValue = null;
    node.pendingStateError = "";
  });
}

function promotePendingStateNodes() {
  graph.nodes.forEach((node) => {
    if (!isStateNode(node)) {
      return;
    }
    if (node.pendingStateError) {
      node.computedValue = null;
      node.computedError = node.pendingStateError;
      node.pendingStateValue = null;
      node.pendingStateError = "";
      return;
    }
    if (node.pendingStateValue !== null && node.pendingStateValue !== undefined) {
      node.computedValue = node.pendingStateValue;
      node.computedError = "";
      node.pendingStateValue = null;
      node.pendingStateError = "";
    }
  });
}

function evaluateAtTime(timeValue) {
  applyWidgetDrivenNodeValues();
  const result = evaluateModelAtTimeRecursive(graph, timeValue, {
    rootExecution: graph.execution,
    stack: [],
  });
  const nodeMap = buildNodeNameMap();
  updateTableWidgetsFromComputedValues(timeValue, nodeMap);
  updateXYWidgetsFromComputedValues(timeValue, nodeMap);
  return result;
}

function validateTimeConfig() {
  const t0 = Number(graph.execution.t0);
  const dt = Number(graph.execution.dt);
  const t1 = Number(graph.execution.t1);
  if (!Number.isFinite(t0) || !Number.isFinite(dt) || !Number.isFinite(t1)) {
    setStatusKey("error.timeInvalid");
    return null;
  }
  if (dt === 0) {
    setStatusKey("error.timeStepZero");
    return null;
  }
  if ((dt > 0 && t0 > t1) || (dt < 0 && t0 < t1)) {
    setStatusKey("error.timeDirection");
    return null;
  }
  return { t0, dt, t1 };
}

async function prepareSubmodelsForExecution() {
  await preloadSubmodelsAfterLoad();
  let ready = await ensureSubmodelTemplatesReady({ allowPrompt: false });
  if (!ready) {
    const hasSubmodels = graph.nodes.some((node) => isSubmodelNode(node) && String(node.modelPath ?? "").trim());
    if (hasSubmodels && !currentModelDirectoryHandle && (supportsDirectoryInputSelection() || supportsDirectoryPicker())) {
      try {
        await ensureCurrentModelDirectoryHandle();
        await preloadSubmodelsAfterLoad();
        ready = await ensureSubmodelTemplatesReady({ allowPrompt: false });
      } catch (_err) {
        ready = false;
      }
    }
  }
  return ready;
}

async function executeOneStep(restartIfEnded = true) {
  if (!enforceStrictDefinitionsIfNeeded()) {
    return false;
  }
  if (!(await prepareSubmodelsForExecution())) {
    return false;
  }
  const cfg = validateTimeConfig();
  if (!cfg) {
    return false;
  }

  let restarted = false;
  const hasStateSnapshot = hasInitializedStateSnapshot();
  if (isExecutionEnded(cfg)) {
    if (!restartIfEnded) {
      setStatusKey("status.timeEndReached", {
        time: formatNumberValue(Number(graph.execution.currentTime ?? cfg.t0)),
      });
      return false;
    }
    graph.execution.currentTime = null;
    restarted = true;
  }
  if (graph.execution.currentTime != null && !hasStateSnapshot) {
    graph.execution.currentTime = null;
    restarted = true;
  }
  const nextTime = graph.execution.currentTime == null ? cfg.t0 : graph.execution.currentTime + cfg.dt;

  let stepResult = null;
  if (restarted) {
    clearAllXYChartPoints();
    clearAllTableWidgetRows();
  }
  if (graph.execution.currentTime == null) {
    clearRuntimeSubmodelState();
    initializeStateNodes(nextTime);
  } else {
    promotePendingStateNodes();
  }
  stepResult = evaluateAtTime(nextTime);
  graph.execution.currentTime = nextTime;
  refreshRuntimeView();

  if (restarted && stepResult.errorCount === 0) {
    setStatusKey("status.executionRestarted", {
      time: formatNumberValue(Number(nextTime)),
      count: stepResult.successCount,
    });
  } else if (stepResult.errorCount > 0) {
    setStatusKey("error.evalStepFailed", {
      node: stepResult.firstErrorNode,
      reason: evalReasonText(stepResult.firstErrorReason),
      time: formatNumberValue(Number(nextTime)),
    });
  } else {
    setStatusKey("status.evalStepDone", {
      count: stepResult.successCount,
      time: formatNumberValue(Number(nextTime)),
    });
  }
  return true;
}

async function executeNodeExpressions() {
  if (!enforceStrictDefinitionsIfNeeded()) {
    return;
  }
  if (!(await prepareSubmodelsForExecution())) {
    return;
  }
  stopTimedExecution(false);
  const cfg = validateTimeConfig();
  if (!cfg) {
    return;
  }

  let continuing = graph.execution.currentTime != null && hasInitializedStateSnapshot();
  if (continuing && isExecutionEnded(cfg)) {
    continuing = false;
  }

  if (!continuing) {
    graph.execution.currentTime = null;
    clearAllXYChartPoints();
    clearAllTableWidgetRows();
    clearRuntimeSubmodelState();
    initializeStateNodes(cfg.t0);
    refreshRuntimeView();
  }

  const maxSteps = 100000;
  const epsilon = Math.max(1e-12, Math.abs(cfg.dt) * 1e-9);
  const timeValues = [];
  let current = continuing ? graph.execution.currentTime + cfg.dt : cfg.t0;
  for (let i = 0; i < maxSteps; i += 1) {
    if ((cfg.dt > 0 && current > cfg.t1 + epsilon) || (cfg.dt < 0 && current < cfg.t1 - epsilon)) {
      break;
    }
    timeValues.push(current);
    current += cfg.dt;
  }

  if (timeValues.length === 0) {
    setStatusKey("error.timeInvalid");
    return;
  }
  if (timeValues.length >= maxSteps) {
    setStatusKey("error.timeTooManySteps", { max: maxSteps });
    return;
  }

  let successCount = 0;
  let errorCount = 0;
  let totalErrorCount = 0;
  let firstErrorNode = null;
  let firstErrorReason = null;
  let firstErrorTime = null;
  let lastTime = timeValues[timeValues.length - 1];

  timeValues.forEach((timeValue, idx) => {
    if (continuing || idx > 0) {
      promotePendingStateNodes();
    }
    const stepResult = evaluateAtTime(timeValue);
    successCount = stepResult.successCount;
    errorCount = stepResult.errorCount;
    totalErrorCount += stepResult.errorCount;
    if (!firstErrorNode && stepResult.firstErrorNode) {
      firstErrorNode = stepResult.firstErrorNode;
      firstErrorReason = stepResult.firstErrorReason;
      firstErrorTime = timeValue;
    }
  });
  graph.execution.currentTime = lastTime;
  refreshRuntimeView();

  if (firstErrorNode) {
    setStatusKey("error.evalFailedDetailedTime", {
      node: firstErrorNode,
      count: totalErrorCount,
      reason: evalReasonText(firstErrorReason),
      time: formatNumberValue(Number(firstErrorTime)),
    });
  } else {
    setStatusKey("status.evalDoneTime", {
      count: successCount,
      steps: timeValues.length,
      time: formatNumberValue(Number(lastTime)),
    });
  }
}

async function runManualStep() {
  if (!enforceStrictDefinitionsIfNeeded()) {
    return;
  }
  stopTimedExecution(false);
  await executeOneStep(true);
}

function resetExecution() {
  stopTimedExecution(false);
  const cfg = validateTimeConfig();
  if (!cfg) {
    return;
  }
  graph.execution.currentTime = null;
  clearAllXYChartPoints();
  clearAllTableWidgetRows();
  clearRuntimeSubmodelState();
  initializeStateNodes(cfg.t0);
  refreshRuntimeView();
  setStatusKey("status.executionReset", { time: formatNumberValue(Number(cfg.t0)) });
}

async function toggleTimedExecution() {
  if (ui.timedRunHandle != null) {
    stopTimedExecution(true);
    return;
  }

  if (!enforceStrictDefinitionsIfNeeded()) {
    return;
  }
  if (!(await prepareSubmodelsForExecution())) {
    return;
  }

  const cfg = validateTimeConfig();
  const delayMs = Number(graph.execution.delayMs);
  if (!cfg) {
    return;
  }
  if (!Number.isFinite(delayMs) || delayMs <= 0) {
    setStatusKey("error.timeDelayInvalid");
    return;
  }
  const ended = isExecutionEnded(cfg);
  const isFreshStart = graph.execution.currentTime == null || ended || !hasInitializedStateSnapshot();
  if (isFreshStart) {
    clearAllXYChartPoints();
    clearAllTableWidgetRows();
    if (ended) {
      graph.execution.currentTime = null;
    }
    refreshRuntimeView();
  }

  ui.timedStepRunning = false;
  ui.timedRunHandle = window.setInterval(async () => {
    if (ui.timedStepRunning) {
      return;
    }
    ui.timedStepRunning = true;
    const ok = await executeOneStep(false);
    ui.timedStepRunning = false;
    if (!ok) {
      stopTimedExecution(false);
      if (!(graph.execution.strictDefinitions && invalidDefinedNodes().length > 0)) {
        setStatusKey("status.timedStopped");
      }
    }
  }, delayMs);
  setStatusKey("status.timedStarted", { delay: delayMs });
  render();
}

window.addEventListener("pointermove", (evt) => {
  if (ui.modalDrag && evt.pointerId === ui.modalDrag.pointerId) {
    const card = ui.modalDrag.card;
    if (card) {
      card.style.transform = "none";
      card.style.left = `${evt.clientX - ui.modalDrag.offsetX}px`;
      card.style.top = `${evt.clientY - ui.modalDrag.offsetY}px`;
    }
    return;
  }
  if (ui.modalResize && evt.pointerId === ui.modalResize.pointerId) {
    const card = ui.modalResize.card;
    if (card) {
      const nextWidth = clamp(ui.modalResize.startWidth + (evt.clientX - ui.modalResize.startClientX), 780, window.innerWidth - 20);
      const nextHeight = clamp(ui.modalResize.startHeight + (evt.clientY - ui.modalResize.startClientY), 420, window.innerHeight - 20);
      card.style.transform = "none";
      card.style.left = `${ui.modalResize.startLeft}px`;
      card.style.top = `${ui.modalResize.startTop}px`;
      card.style.width = `${nextWidth}px`;
      card.style.height = `${nextHeight}px`;
    }
    return;
  }
  if (ui.widgetDrag && evt.pointerId === ui.widgetDrag.pointerId) {
    const widget = graph.widgets.find((w) => w.id === ui.widgetDrag.widgetId);
    if (widget) {
      const z = Math.max(0.0001, ui.zoom || 1);
      const dx = (evt.clientX - ui.widgetDrag.startClientX) / z;
      const dy = (evt.clientY - ui.widgetDrag.startClientY) / z;
      widget.x = ui.widgetDrag.startX + dx;
      widget.y = ui.widgetDrag.startY + dy;
      renderWidgets();
    }
    return;
  }
  if (ui.widgetResize && evt.pointerId === ui.widgetResize.pointerId) {
    const widget = graph.widgets.find((w) => w.id === ui.widgetResize.widgetId);
    if (widget) {
      const z = Math.max(0.0001, ui.zoom || 1);
      const dx = (evt.clientX - ui.widgetResize.startClientX) / z;
      const dy = (evt.clientY - ui.widgetResize.startClientY) / z;
      widget.width = clamp(ui.widgetResize.startWidth + dx, 220, 1200);
      widget.height = clamp(ui.widgetResize.startHeight + dy, 110, 900);
      renderWidgets();
    }
    return;
  }
  if (ui.textDrag && evt.pointerId === ui.textDrag.pointerId) {
    const item = getTextItemById(ui.textDrag.id);
    if (item) {
      const delta = worldDeltaFromClientDelta(
        evt.clientX - ui.textDrag.startClientX,
        evt.clientY - ui.textDrag.startClientY,
      );
      item.x = ui.snapToGrid ? snap(ui.textDrag.startX + delta.x) : ui.textDrag.startX + delta.x;
      item.y = ui.snapToGrid ? snap(ui.textDrag.startY + delta.y) : ui.textDrag.startY + delta.y;
      render();
    }
    return;
  }
  if (ui.textResize && evt.pointerId === ui.textResize.pointerId) {
    const item = getTextItemById(ui.textResize.id);
    if (item) {
      const delta = worldDeltaFromClientDelta(
        evt.clientX - ui.textResize.startClientX,
        evt.clientY - ui.textResize.startClientY,
      );
      item.width = clamp(ui.snapToGrid ? snap(ui.textResize.startWidth + delta.x) : ui.textResize.startWidth + delta.x, 40, 1200);
      item.height = clamp(ui.snapToGrid ? snap(ui.textResize.startHeight + delta.y) : ui.textResize.startHeight + delta.y, 24, 1200);
      render();
    }
    return;
  }

  const pRaw = svgPoint(evt);
  const p = snapPoint(pRaw);
  const hoverNodeId = nodeIdAtGraphPoint(pRaw);
  const hoverNode = hoverNodeId != null ? getNodeById(hoverNodeId) : null;
  const hoverNearCenter = hoverNode ? Math.hypot(pRaw.x - hoverNode.x, pRaw.y - hoverNode.y) <= 20 : false;

  if (!ui.drag && !ui.resize && !ui.edgeCreate && !ui.controlPointDrag && !ui.marquee && !ui.textDrag && !ui.textResize) {
    if (hoverNearCenter) {
      svg.style.cursor = "crosshair";
    } else if (hoverNode) {
      svg.style.cursor = "grab";
    } else {
      svg.style.cursor = "";
    }
  }

  if (ui.drag && evt.pointerId === ui.drag.pointerId) {
    const delta = worldDeltaFromClientDelta(
      evt.clientX - ui.drag.startClientX,
      evt.clientY - ui.drag.startClientY,
    );
    const rawDx = delta.x;
    const rawDy = delta.y;
    let dx = rawDx;
    let dy = rawDy;
    if (ui.snapToGrid) {
      const anchorStart = ui.drag.startMap.get(ui.drag.anchorNodeId);
      if (anchorStart) {
        dx = snap(anchorStart.x + rawDx) - anchorStart.x;
        dy = snap(anchorStart.y + rawDy) - anchorStart.y;
      }
    }
    ui.drag.nodeIds.forEach((id) => {
      const node = getNodeById(id);
      const start = ui.drag.startMap.get(id);
      if (node && start) {
        node.x = ui.snapToGrid ? start.x + dx : start.x + dx;
        node.y = ui.snapToGrid ? start.y + dy : start.y + dy;
      }
    });
    ui.drag.edgeControlStartMap.forEach((cpStart, edgeId) => {
      const edge = getEdgeById(edgeId);
      if (!edge) {
        return;
      }
      edge.controlPoints = cpStart.map((cp) => ({
        x: ui.snapToGrid ? cp.x + dx : cp.x + dx,
        y: ui.snapToGrid ? cp.y + dy : cp.y + dy,
      }));
    });
    render();
  }

  if (ui.resize && evt.pointerId === ui.resize.pointerId) {
    const node = getNodeById(ui.resize.nodeId);
    if (node) {
      const dx = pRaw.x - ui.resize.startPointer.x;
      const dy = pRaw.y - ui.resize.startPointer.y;
      node.width = clamp(snap(ui.resize.startWidth + dx), 40, 500);
      node.height = clamp(snap(ui.resize.startHeight + dy), 30, 500);
      render();
    }
  }

  if (ui.edgeCreate && evt.pointerId === ui.edgeCreate.pointerId) {
    updateEdgeCreateFromClient(evt.clientX, evt.clientY);
    render();
  }

  if (ui.controlPointDrag && evt.pointerId === ui.controlPointDrag.pointerId) {
    const edge = getEdgeById(ui.controlPointDrag.edgeId);
    if (edge && edge.controlPoints[ui.controlPointDrag.index]) {
      ui.lastControlPointTap = null;
      edge.controlPoints[ui.controlPointDrag.index] = p;
      render();
    }
  }

  if (ui.marquee && evt.pointerId === ui.marquee.pointerId) {
    ui.marquee.current = pRaw;
    const rect = marqueeRect(ui.marquee);
    const ids = nodesInRect(rect);
    if (ui.marquee.additive) {
      setNodeSelection([...ui.marquee.baseSelection, ...ids], false);
    } else {
      setNodeSelection(ids, false);
    }
    render();
  }
});

window.addEventListener("mousemove", (evt) => {
  const pRaw = svgPointFromClient(evt.clientX, evt.clientY);
  const hoverNodeId = nodeIdAtGraphPoint(pRaw);
  const hoverNode = hoverNodeId != null ? getNodeById(hoverNodeId) : null;
  const hoverNearCenter = hoverNode ? Math.hypot(pRaw.x - hoverNode.x, pRaw.y - hoverNode.y) <= 20 : false;

  if (!ui.drag && !ui.resize && !ui.edgeCreate && !ui.controlPointDrag && !ui.marquee) {
    if (hoverNearCenter) {
      svg.style.cursor = "crosshair";
    } else if (hoverNode) {
      svg.style.cursor = "grab";
    } else {
      svg.style.cursor = "";
    }
  }

  if (!ui.edgeCreate) {
    return;
  }
  updateEdgeCreateFromClient(evt.clientX, evt.clientY);
  render();
});

window.addEventListener("pointerup", (evt) => {
  let needsRender = false;

  if (ui.modalDrag && evt.pointerId === ui.modalDrag.pointerId) {
    ui.modalDrag = null;
  }
  if (ui.modalResize && evt.pointerId === ui.modalResize.pointerId) {
    ui.modalResize = null;
  }

  if (ui.widgetDrag && evt.pointerId === ui.widgetDrag.pointerId) {
    const widget = graph.widgets.find((w) => w.id === ui.widgetDrag.widgetId);
    const moved = widget && (widget.x !== ui.widgetDrag.startX || widget.y !== ui.widgetDrag.startY);
    ui.widgetDrag = null;
    commitTransaction();
    if (moved) {
      setStatusKey("status.widgetMoved");
    }
    needsRender = true;
  }

  if (ui.widgetResize && evt.pointerId === ui.widgetResize.pointerId) {
    const widget = graph.widgets.find((w) => w.id === ui.widgetResize.widgetId);
    const resized =
      widget &&
      (widget.width !== ui.widgetResize.startWidth || widget.height !== ui.widgetResize.startHeight);
    ui.widgetResize = null;
    commitTransaction();
    if (resized) {
      setStatusKey("status.widgetResized");
    }
    needsRender = true;
  }

  if (ui.textDrag && evt.pointerId === ui.textDrag.pointerId) {
    const item = getTextItemById(ui.textDrag.id);
    const moved =
      item &&
      (item.x !== ui.textDrag.startX || item.y !== ui.textDrag.startY);
    ui.textDrag = null;
    commitTransaction();
    if (moved) {
      setStatusKey("status.textMoved");
    }
    needsRender = true;
  }

  if (ui.textResize && evt.pointerId === ui.textResize.pointerId) {
    const item = getTextItemById(ui.textResize.id);
    const resized =
      item &&
      (item.width !== ui.textResize.startWidth || item.height !== ui.textResize.startHeight);
    ui.textResize = null;
    commitTransaction();
    if (resized) {
      setStatusKey("status.textResized");
    }
    needsRender = true;
  }

  if (ui.edgeCreate && evt.pointerId === ui.edgeCreate.pointerId) {
    finishEdgeCreateFromClient(evt.clientX, evt.clientY);
    needsRender = true;
  }

  if (ui.marquee && evt.pointerId === ui.marquee.pointerId) {
    const rect = marqueeRect(ui.marquee);
    if (rect.width < 4 && rect.height < 4 && !ui.marquee.additive) {
      clearAllSelection();
    }
    ui.marquee = null;
    needsRender = true;
  }

  if (ui.drag && evt.pointerId === ui.drag.pointerId) {
    const movedCount = ui.drag.nodeIds.filter((id) => {
      const node = getNodeById(id);
      const start = ui.drag.startMap.get(id);
      return node && start && (node.x !== start.x || node.y !== start.y);
    }).length;
    ui.drag = null;
    commitTransaction();
    if (movedCount > 0) {
      setStatusKey("status.nodesMoved", { count: movedCount });
    }
    needsRender = true;
  }

  if (ui.resize && evt.pointerId === ui.resize.pointerId) {
    const node = getNodeById(ui.resize.nodeId);
    const resized =
      node &&
      (node.width !== ui.resize.startWidth || node.height !== ui.resize.startHeight);
    ui.resize = null;
    commitTransaction();
    if (resized) {
      setStatusKey("status.nodeResized");
    }
    needsRender = true;
  }

  if (ui.controlPointDrag && evt.pointerId === ui.controlPointDrag.pointerId) {
    ui.controlPointDrag = null;
    commitTransaction();
    needsRender = true;
  }

  if (ui.sliderInteraction?.mode === "range") {
    ui.sliderInteraction = null;
    needsRender = true;
  }

  if (needsRender) {
    render();
  }
  if (!ui.drag && !ui.resize && !ui.edgeCreate && !ui.controlPointDrag && !ui.marquee && !ui.widgetDrag && !ui.widgetResize && !ui.textDrag && !ui.textResize) {
    svg.style.cursor = "";
  }
});

window.addEventListener("mouseup", (evt) => {
  if (!ui.edgeCreate) {
    return;
  }
  finishEdgeCreateFromClient(evt.clientX, evt.clientY);
});

svg.addEventListener("pointerleave", () => {
  ui.edgeCreateHoverId = null;
  ui.edgeCreateLastPoint = null;
  if (!ui.drag && !ui.resize && !ui.controlPointDrag && !ui.edgeCreate && !ui.marquee && !ui.widgetDrag && !ui.widgetResize && !ui.textDrag && !ui.textResize) {
    svg.style.cursor = "";
  }
});

svg.addEventListener("pointerdown", (evt) => {
  hideContextMenu();
  ui.lastNodeActivate = null;
  if (evt.target !== svg) {
    return;
  }

  const additive = evt.ctrlKey || evt.metaKey;
  const p = svgPoint(evt);
  ui.marquee = {
    pointerId: evt.pointerId,
    start: p,
    current: p,
    additive,
    baseSelection: [...ui.selectedNodes],
  };

  if (!additive) {
    clearAllSelection();
  }
  render();
});

[graphViewport, canvasContent].forEach((el) => {
  el?.addEventListener("pointerdown", (evt) => {
    if (!evt.target.closest?.(".node")) {
      ui.lastNodeActivate = null;
    }
    if (evt.target.closest?.(".node, .canvas-text-item, .edge, .st-widget, .menu-bar, .sidebar, .context-menu, svg")) {
      return;
    }
    hideContextMenu();
    closeTopMenus();
    clearAllSelection();
    render();
  });
});

svg.addEventListener("contextmenu", (evt) => {
  const onNode = evt.target.closest?.(".node");
  const onText = evt.target.closest?.(".canvas-text-item");
  if (onNode || onText) {
    return;
  }
  evt.preventDefault();
  openBackgroundContextMenu(evt);
});

[graphViewport, canvasContent].forEach((el) => {
  el?.addEventListener("contextmenu", (evt) => {
    if (evt.target.closest?.(".node, .canvas-text-item, .edge, .st-widget, .context-menu")) {
      return;
    }
    evt.preventDefault();
    openBackgroundContextMenu(evt);
  });
});

menuTitles.forEach((title) => {
  title.addEventListener("click", (evt) => {
    evt.stopPropagation();
    hideContextMenu();
    const root = title.closest(".menu-root");
    if (root) {
      toggleTopMenu(root);
    }
  });
});

menuRoots.forEach((root) => {
  root.addEventListener("pointerenter", () => {
    const hasOpen = menuRoots.some((r) => r.classList.contains("open"));
    if (hasOpen && !root.classList.contains("open")) {
      toggleTopMenu(root);
    }
  });
});

menuCommands.forEach((cmd) => {
  cmd.addEventListener("click", () => {
    closeTopMenus();
  });
});

addRectNodeItem.addEventListener("click", () => {
  runAction(() => {
    addNode("rect");
  });
  setStatusKey("status.nodeCreated");
});

addEllipseNodeItem.addEventListener("click", () => {
  runAction(() => {
    addNode("ellipse");
  });
  setStatusKey("status.nodeCreated");
});

addDiamondNodeItem.addEventListener("click", () => {
  runAction(() => {
    addNode("diamond");
  });
  setStatusKey("status.nodeCreated");
});

if (addSubmodelNodeItem) {
  addSubmodelNodeItem.addEventListener("click", () => {
    runAction(() => {
      addNode("submodel");
    });
    setStatusKey("status.nodeCreated");
  });
}

if (addTextItem) {
  addTextItem.addEventListener("click", () => {
    runAction(() => {
      addCanvasText();
    });
    setStatusKey("status.textCreated");
  });
}

if (addButtonWidgetItem) {
  addButtonWidgetItem.addEventListener("click", () => {
    runAction(() => {
      addButtonWidget();
    });
    setStatusKey("status.widgetButtonCreated");
  });
}

if (addLedWidgetItem) {
  addLedWidgetItem.addEventListener("click", () => {
    runAction(() => {
      addLedWidget();
    });
    setStatusKey("status.widgetLedCreated");
  });
}

addSliderWidgetItem.addEventListener("click", () => {
  runAction(() => {
    addSliderWidget();
  });
  setStatusKey("status.widgetSliderCreated");
});

addMatrixWidgetItem.addEventListener("click", () => {
  runAction(() => {
    addMatrixWidget();
  });
  setStatusKey("status.widgetMatrixCreated");
});

addTableWidgetItem.addEventListener("click", () => {
  runAction(() => {
    addTableWidget();
  });
  setStatusKey("status.widgetCreated");
});
addXYChartWidgetItem.addEventListener("click", () => {
  runAction(() => {
    addXYChartWidget();
  });
  setStatusKey("status.widgetChartCreated");
});

fitContentItem.addEventListener("click", () => {
  fitToContent();
});

zoomInItem.addEventListener("click", () => {
  applyZoom(ui.zoom * 1.2);
});

zoomOutItem.addEventListener("click", () => {
  applyZoom(ui.zoom / 1.2);
});

zoomResetItem.addEventListener("click", () => {
  applyZoom(1);
});

if (zoomRangeInput) {
  zoomRangeInput.addEventListener("input", () => {
    applyZoom(Number(zoomRangeInput.value) / 100);
  });
}
toggleGraphItem.addEventListener("click", () => {
  toggleGraphVisibility();
});
toggleWidgetsItem.addEventListener("click", () => {
  toggleWidgetsVisibility();
});
if (toggleGraphBtn) {
  toggleGraphBtn.addEventListener("click", toggleGraphVisibility);
}
if (toggleWidgetsBtn) {
  toggleWidgetsBtn.addEventListener("click", toggleWidgetsVisibility);
}
if (runFullModelBtn) {
  runFullModelBtn.addEventListener("click", () => {
    void executeNodeExpressions();
  });
}
if (topRunEvalBtn) {
  topRunEvalBtn.addEventListener("click", () => {
    void executeNodeExpressions();
  });
}
if (topRunStepBtn) {
  topRunStepBtn.addEventListener("click", () => {
    void runManualStep();
  });
}
if (topRunTimedBtn) {
  topRunTimedBtn.addEventListener("click", () => {
    void toggleTimedExecution();
  });
}
if (topRunResetBtn) {
  topRunResetBtn.addEventListener("click", resetExecution);
}
runEvalBtn.addEventListener("click", () => {
  void executeNodeExpressions();
});
runStepBtn.addEventListener("click", () => {
  void runManualStep();
});
runTimedToggleBtn.addEventListener("click", () => {
  void toggleTimedExecution();
});
runResetBtn.addEventListener("click", resetExecution);

undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);
if (selectAllBtn) {
  selectAllBtn.addEventListener("click", selectAllNodes);
}
deleteBtn.addEventListener("click", removeSelected);
cutBtn.addEventListener("click", cutSelectionToClipboard);
copyBtn.addEventListener("click", copySelectionToClipboard);
pasteBtn.addEventListener("click", pasteFromClipboard);
newGraphBtn.addEventListener("click", () => {
  createNewGraph();
});
saveJsonBtn.addEventListener("click", () => saveGraphJson(false));
saveAsJsonBtn.addEventListener("click", () => saveGraphJson(true));
loadJsonBtn.addEventListener("click", openGraphJson);

if (exitSubmodelBtn) {
  exitSubmodelBtn.addEventListener("click", () => {
    void exitCurrentSubmodel();
  });
}

snapToGridInput.addEventListener("change", () => {
  ui.snapToGrid = snapToGridInput.checked;
  setStatusKey(ui.snapToGrid ? "status.snapOn" : "status.snapOff");
});

gridSizeInput.addEventListener("change", () => {
  ui.gridSize = clamp(Number(gridSizeInput.value) || 20, 5, 100);
  gridSizeInput.value = String(ui.gridSize);
  setStatusKey("status.gridStep", { value: ui.gridSize });
});

function commitExecutionInput(inputEl, key) {
  const parsed = Number(inputEl.value);
  if (!Number.isFinite(parsed)) {
    inputEl.value = String(graph.execution[key]);
    setStatusKey("error.timeInvalid");
    return;
  }
  graph.execution[key] = parsed;
  setStatusKey("status.timeConfigUpdated");
}

timeStartInput.addEventListener("change", () => commitExecutionInput(timeStartInput, "t0"));
timeStepInput.addEventListener("change", () => commitExecutionInput(timeStepInput, "dt"));
timeEndInput.addEventListener("change", () => commitExecutionInput(timeEndInput, "t1"));
timeDelayInput.addEventListener("change", () => {
  const parsed = Number(timeDelayInput.value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    timeDelayInput.value = String(graph.execution.delayMs);
    setStatusKey("error.timeDelayInvalid");
    return;
  }
  graph.execution.delayMs = Math.round(parsed);
  setStatusKey("status.timeDelayUpdated", { delay: graph.execution.delayMs });
});

if (decimalDigitsInput) {
  decimalDigitsInput.addEventListener("change", () => {
    const parsed = Number(decimalDigitsInput.value);
    if (!Number.isFinite(parsed)) {
      decimalDigitsInput.value = String(clampDisplayDecimals(graph.execution.decimals));
      setStatusKey("error.timeInvalid");
      return;
    }
    graph.execution.decimals = clampDisplayDecimals(parsed);
    decimalDigitsInput.value = String(graph.execution.decimals);
    setStatusKey("status.timeConfigUpdated");
    render();
  });
}

if (integratorInput) {
  integratorInput.addEventListener("change", () => {
    graph.execution.integrator = String(integratorInput.value || "euler").toLowerCase() === "rk4" ? "rk4" : "euler";
    setStatusKey("status.integratorUpdated", { name: t(`integrator.${graph.execution.integrator}`) });
    scheduleFileStatusRefresh();
    render();
  });
}

function commitStrictDefinitionsToggle(enabled) {
  graph.execution.strictDefinitions = Boolean(enabled);
  setStatusKey(graph.execution.strictDefinitions ? "status.strictDefinitionsOn" : "status.strictDefinitionsOff");
  scheduleFileStatusRefresh();
  render();
}

if (strictDefinitionsInput) {
  strictDefinitionsInput.addEventListener("change", () => {
    commitStrictDefinitionsToggle(strictDefinitionsInput.checked);
  });
}
if (runStrictDefinitionsInput) {
  runStrictDefinitionsInput.addEventListener("change", () => {
    commitStrictDefinitionsToggle(runStrictDefinitionsInput.checked);
  });
}

[timeStartInput, timeStepInput, timeEndInput, timeDelayInput, decimalDigitsInput, integratorInput].filter(Boolean).forEach((inputEl) => {
  inputEl.addEventListener("keydown", (evt) => {
    if (evt.key === "Enter") {
      inputEl.blur();
    }
  });
});

loadJsonInput.addEventListener("change", () => {
  const file = loadJsonInput.files?.[0];
  if (file) {
    void loadGraphJsonFile(file);
  }
  loadJsonInput.value = "";
});

if (clearRecentModelsBtn) {
  clearRecentModelsBtn.addEventListener("click", () => {
    clearRecentModels();
    closeTopMenus();
    setStatusKey("status.recentCleared");
  });
}

graphViewport.addEventListener(
  "wheel",
  (evt) => {
    if (!(evt.ctrlKey || evt.metaKey)) {
      return;
    }
    evt.preventDefault();
    const factor = evt.deltaY < 0 ? 1.12 : 1 / 1.12;
    applyZoom(ui.zoom * factor, evt.clientX, evt.clientY);
  },
  { passive: false },
);

nodeNameInput.addEventListener("input", () => {
  if (ui.selectedNodes.size !== 1) {
    return;
  }
  const nodeId = [...ui.selectedNodes][0];
  const node = getNodeById(nodeId);
  if (!node) {
    return;
  }
  const attempt = semantics.validateNodeName(graph.nodes, nodeNameInput.value, node.id);
  if (attempt.ok) {
    nodeNameInput.classList.remove("invalid");
    const oldName = node.name;
    node.name = attempt.name;
    propagateNodeRenameInExpressions(oldName, node.name);
    render();
    return;
  }

  nodeNameInput.classList.add("invalid");
  if (attempt.reason === "duplicate") {
    setStatusKey("error.duplicateNodeName");
  } else if (attempt.reason === "function") {
    setStatusKey("error.functionNodeName");
  } else if (attempt.reason === "reserved") {
    setStatusKey("error.reservedNodeName");
  } else {
    setStatusKey("error.invalidNodeName");
  }
});

nodeNameInput.addEventListener("focus", () => {
  if (ui.selectedNodes.size !== 1) {
    ui.nodeNameEditStart = null;
    return;
  }
  const nodeId = [...ui.selectedNodes][0];
  const node = getNodeById(nodeId);
  ui.nodeNameEditStart = node ? node.name : null;
});

nodeNameInput.addEventListener("blur", () => {
  if (ui.selectedNodes.size !== 1) {
    ui.nodeNameEditStart = null;
    return;
  }
  const nodeId = [...ui.selectedNodes][0];
  const node = getNodeById(nodeId);
  if (!node) {
    ui.nodeNameEditStart = null;
    return;
  }
  if (ui.nodeNameEditStart != null && ui.nodeNameEditStart !== node.name) {
    setStatusKey("status.nodeRenamed", { name: node.name });
  }
  ui.nodeNameEditStart = null;
  nodeNameInput.value = node.name;
  nodeNameInput.classList.remove("invalid");
});

nodeNameInput.addEventListener("keydown", (evt) => {
  if (evt.key === "Enter") {
    nodeNameInput.blur();
  }
});

nodeShapeInput.addEventListener("change", () => {
  if (ui.selectedNodes.size !== 1) {
    return;
  }
  const nodeId = [...ui.selectedNodes][0];
  const node = getNodeById(nodeId);
  if (!node) {
    return;
  }
  runAction(() => {
    const wasSliderBindable = canBindSliderToNode(node);
    node.shape = nodeShapeInput.value;
    if (isSubmodelNode(node)) {
      node.input = false;
      node.output = false;
      node.valueExpression = "";
      node.initialStateExpression = "";
      node.pendingStateValue = null;
      node.pendingStateError = "";
    }
    if (!isStateNode(node)) {
      node.initialStateExpression = "";
      node.pendingStateValue = null;
      node.pendingStateError = "";
    }
    if (!isSubmodelNode(node)) {
      node.modelPath = "";
      node.inputBindings = {};
      node.interfaceCache = { inputs: [], outputs: [] };
      node.submodelError = "";
    }
    node.__runtimeSubmodel = null;
    node.__runtimeSubmodelPath = "";
    normalizeInputNodeFlags();
    if (wasSliderBindable && !canBindSliderToNode(node)) {
      removeNodeFromInputWidgetBindings(node.name);
    }
  });
});

if (nodeModelPathInput) {
  ["focus", "mousedown", "mouseup", "click", "select"].forEach((eventName) => {
    nodeModelPathInput.addEventListener(eventName, (evt) => {
      evt.preventDefault();
      nodeModelPathInput.blur();
    });
  });
}

if (loadSubmodelBtn) {
  loadSubmodelBtn.addEventListener("click", async () => {
    if (ui.selectedNodes.size !== 1) {
      return;
    }
    const nodeId = [...ui.selectedNodes][0];
    const node = getNodeById(nodeId);
    if (!node || !isSubmodelNode(node)) {
      return;
    }
    if (!String(node.modelPath ?? "").trim()) {
      try {
        const chosen = await chooseSubmodelFileForNode(node);
        if (!chosen) {
          return;
        }
      } catch (err) {
        if (err && err.name === "AbortError") {
          return;
        }
        setStatus(String(err?.message || t("error.submodelLoadFailed", { message: t("error.load") })));
        refreshSidebar();
        render();
        return;
      }
    }
    await refreshSubmodelInterface(node, true, { allowPrompt: true });
    await preloadSubmodelsAfterLoad();
    refreshSidebar();
    render();
  });
}

if (showSubmodelBtn) {
  showSubmodelBtn.addEventListener("click", async () => {
    if (ui.selectedNodes.size !== 1) {
      return;
    }
    const nodeId = [...ui.selectedNodes][0];
    const node = getNodeById(nodeId);
    if (!canShowSubmodelNode(node)) {
      return;
    }
    await openSubmodelNode(node);
  });
}

nodeInputInput.addEventListener("change", () => {
  if (ui.selectedNodes.size !== 1) {
    return;
  }
  const nodeId = [...ui.selectedNodes][0];
  const node = getNodeById(nodeId);
  if (!node) {
    return;
  }
  if (!canMarkNodeAsInput(node)) {
    nodeInputInput.checked = false;
    return;
  }
  const wasInput = Boolean(node.input);
  runAction(() => {
    node.input = nodeInputInput.checked;
    if (wasInput && !node.input) {
      removeNodeFromInputWidgetBindings(node.name);
    }
  });
});

nodeOutputInput.addEventListener("change", () => {
  if (ui.selectedNodes.size !== 1) {
    return;
  }
  const nodeId = [...ui.selectedNodes][0];
  const node = getNodeById(nodeId);
  if (!node) {
    return;
  }
  const wasOutput = Boolean(node.output);
  runAction(() => {
    node.output = nodeOutputInput.checked;
    if (wasOutput && !node.output) {
      removeNodeFromAllWidgetDisplays(node.name);
    }
  });
});

if (nodeFillColorInput) {
  nodeFillColorInput.addEventListener("change", () => {
    if (ui.selectedNodes.size !== 1) {
      return;
    }
    const node = getNodeById([...ui.selectedNodes][0]);
    if (!node) {
      return;
    }
    runAction(() => {
      node.fillColor = normalizeColorString(nodeFillColorInput.value);
      sanitizeNodeVisualOptions(node);
    });
  });
}

if (nodeStrokeColorInput) {
  nodeStrokeColorInput.addEventListener("change", () => {
    if (ui.selectedNodes.size !== 1) {
      return;
    }
    const node = getNodeById([...ui.selectedNodes][0]);
    if (!node) {
      return;
    }
    runAction(() => {
      node.strokeColor = normalizeColorString(nodeStrokeColorInput.value);
      sanitizeNodeVisualOptions(node);
    });
  });
}

if (resetNodeColorsBtn) {
  resetNodeColorsBtn.addEventListener("click", () => {
    if (ui.selectedNodes.size !== 1) {
      return;
    }
    const node = getNodeById([...ui.selectedNodes][0]);
    if (!node) {
      return;
    }
    runAction(() => {
      node.fillColor = "";
      node.strokeColor = "";
      sanitizeNodeVisualOptions(node);
    });
  });
}

if (textWidthInput) {
  textWidthInput.addEventListener("change", () => {
    const item = ui.selected?.type === "text" ? getTextItemById(ui.selected.id) : null;
    if (!item) {
      return;
    }
    runAction(() => {
      item.width = clamp(Number(textWidthInput.value) || item.width, 40, 1200);
      sanitizeTextItem(item);
    });
  });
}

if (textHeightInput) {
  textHeightInput.addEventListener("change", () => {
    const item = ui.selected?.type === "text" ? getTextItemById(ui.selected.id) : null;
    if (!item) {
      return;
    }
    runAction(() => {
      item.height = clamp(Number(textHeightInput.value) || item.height, 24, 1200);
      sanitizeTextItem(item);
    });
  });
}

if (textFillColorInput) {
  textFillColorInput.addEventListener("change", () => {
    const item = ui.selected?.type === "text" ? getTextItemById(ui.selected.id) : null;
    if (!item) {
      return;
    }
    runAction(() => {
      item.fillColor = normalizeColorString(textFillColorInput.value);
      sanitizeTextItem(item);
    });
  });
}

if (textStrokeColorInput) {
  textStrokeColorInput.addEventListener("change", () => {
    const item = ui.selected?.type === "text" ? getTextItemById(ui.selected.id) : null;
    if (!item) {
      return;
    }
    runAction(() => {
      item.strokeColor = normalizeColorString(textStrokeColorInput.value);
      sanitizeTextItem(item);
    });
  });
}

if (textHtmlInput) {
  textHtmlInput.addEventListener("focus", () => {
    const item = ui.selected?.type === "text" ? getTextItemById(ui.selected.id) : null;
    if (!item) {
      return;
    }
    beginTransaction();
  });
  textHtmlInput.addEventListener("input", () => {
    const item = ui.selected?.type === "text" ? getTextItemById(ui.selected.id) : null;
    if (!item) {
      return;
    }
    item.html = String(textHtmlInput.value ?? "");
    sanitizeTextItem(item);
    dirtySinceLastSave = true;
    updateFileStatusLabel(true);
    render();
  });
  textHtmlInput.addEventListener("blur", () => {
    commitTransaction();
    render();
  });
}

if (textToolbar) {
  textToolbar.addEventListener("click", (evt) => {
    const btn = evt.target.closest("[data-text-tool]");
    if (!btn) {
      return;
    }
    evt.preventDefault();
    const tool = btn.getAttribute("data-text-tool");
    if (tool === "h1") {
      wrapTextSelection("<h1>", "</h1>", t("text.toolbarHeading1"));
      return;
    }
    if (tool === "h2") {
      wrapTextSelection("<h2>", "</h2>", t("text.toolbarHeading2"));
      return;
    }
    if (tool === "p") {
      wrapTextSelection("<p>", "</p>", t("text.toolbarParagraph"));
      return;
    }
    if (tool === "b") {
      wrapTextSelection("<strong>", "</strong>");
      return;
    }
    if (tool === "i") {
      wrapTextSelection("<em>", "</em>");
      return;
    }
    if (tool === "u") {
      wrapTextSelection("<u>", "</u>");
      return;
    }
    if (tool === "br") {
      insertTextHtmlSnippet("<br>");
    }
  });
}

manualStepBtn.addEventListener("click", () => {
  void runManualStep();
});
timedToggleBtn.addEventListener("click", () => {
  void toggleTimedExecution();
});
resetExecBtn.addEventListener("click", resetExecution);

nodeValueExprInput.addEventListener("input", () => {
  const meta = expressionFieldMeta("value");
  if (!meta) {
    return;
  }
  meta.setValue(nodeValueExprInput.value);
  updateExpressionFieldState(nodeValueExprInput, nodeValueExprStatus, nodeValueExprInput.value, false, "value");
  scheduleFileStatusRefresh();
});

nodeInitialStateInput.addEventListener("input", () => {
  const meta = expressionFieldMeta("initial");
  if (!meta) {
    return;
  }
  meta.setValue(nodeInitialStateInput.value);
  updateExpressionFieldState(nodeInitialStateInput, nodeInitialStateStatus, nodeInitialStateInput.value, false, "initial");
  scheduleFileStatusRefresh();
});

if (editNodeValueExprBtn) {
  editNodeValueExprBtn.addEventListener("click", () => {
    openExpressionEditor("value");
  });
}

if (editNodeInitialStateBtn) {
  editNodeInitialStateBtn.addEventListener("click", () => {
    openExpressionEditor("initial");
  });
}

if (expressionEditorTextarea) {
  expressionEditorTextarea.addEventListener("input", () => {
    refreshExpressionEditorValidation();
  });
  expressionEditorTextarea.addEventListener("scroll", () => {
    renderExpressionHighlight();
  });
  expressionEditorTextarea.addEventListener("keydown", (evt) => {
    if (evt.key === "ArrowDown" && evt.shiftKey) {
      evt.preventDefault();
      moveLibrarySelection(1);
      return;
    }
    if (evt.key === "ArrowUp" && evt.shiftKey) {
      evt.preventDefault();
      moveLibrarySelection(-1);
      return;
    }
    if (evt.key === "Enter" && evt.shiftKey && !evt.ctrlKey && !evt.metaKey) {
      evt.preventDefault();
      insertSelectedLibraryEntry();
      return;
    }
    if (evt.key === "Tab") {
      evt.preventDefault();
      insertExpressionSnippet("\t");
      refreshExpressionEditorValidation();
      return;
    }
    if (evt.key === "Enter" && !evt.ctrlKey && !evt.metaKey) {
      evt.preventDefault();
      insertExpressionSnippet("\n");
      refreshExpressionEditorValidation();
    }
  });
  ["click", "keyup", "mouseup"].forEach((eventName) => {
    expressionEditorTextarea.addEventListener(eventName, () => {
      renderExpressionHighlight();
      renderExpressionAutocomplete();
    });
  });
}

if (expressionEditorCloseBtn) {
  expressionEditorCloseBtn.addEventListener("click", closeExpressionEditor);
}
if (expressionEditorCancelBtn) {
  expressionEditorCancelBtn.addEventListener("click", closeExpressionEditor);
}
if (expressionEditorApplyBtn) {
  expressionEditorApplyBtn.addEventListener("click", applyExpressionEditor);
}
if (expressionSymbolsFilter) {
  expressionSymbolsFilter.addEventListener("input", () => {
    renderExpressionLibrary();
  });
  expressionSymbolsFilter.addEventListener("keydown", (evt) => {
    if (evt.key === "ArrowDown") {
      evt.preventDefault();
      moveLibrarySelection(1);
      return;
    }
    if (evt.key === "ArrowUp") {
      evt.preventDefault();
      moveLibrarySelection(-1);
      return;
    }
    if (evt.key === "Enter") {
      evt.preventDefault();
      insertSelectedLibraryEntry();
      return;
    }
    if (evt.key === "Escape") {
      evt.preventDefault();
      expressionEditorTextarea?.focus();
    }
  });
}
if (expressionEditorModal) {
  const modalHead = expressionEditorModal.querySelector(".modal-head");
  const modalCard = expressionEditorModal.querySelector(".expression-editor-card");
  if (modalHead && modalCard) {
    modalHead.addEventListener("pointerdown", (evt) => {
      if (evt.target.closest("button")) {
        return;
      }
      const rect = modalCard.getBoundingClientRect();
      modalCard.style.transform = "none";
      modalCard.style.left = `${rect.left}px`;
      modalCard.style.top = `${rect.top}px`;
      ui.modalDrag = {
        pointerId: evt.pointerId,
        offsetX: evt.clientX - rect.left,
        offsetY: evt.clientY - rect.top,
        card: modalCard,
      };
    });
  }
  if (expressionEditorResizeHandle && modalCard) {
    expressionEditorResizeHandle.addEventListener("pointerdown", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      const rect = modalCard.getBoundingClientRect();
      modalCard.style.transform = "none";
      modalCard.style.left = `${rect.left}px`;
      modalCard.style.top = `${rect.top}px`;
      modalCard.style.width = `${rect.width}px`;
      modalCard.style.height = `${rect.height}px`;
      ui.modalResize = {
        pointerId: evt.pointerId,
        startClientX: evt.clientX,
        startClientY: evt.clientY,
        startWidth: rect.width,
        startHeight: rect.height,
        startLeft: rect.left,
        startTop: rect.top,
        card: modalCard,
      };
    });
  }
}
if (functionsHelpModal) {
  const modalHead = functionsHelpModal.querySelector(".modal-head");
  const modalCard = functionsHelpModal.querySelector(".functions-help-card");
  if (modalHead && modalCard) {
    modalHead.addEventListener("pointerdown", (evt) => {
      if (evt.target.closest("button")) {
        return;
      }
      const rect = modalCard.getBoundingClientRect();
      modalCard.style.transform = "none";
      modalCard.style.left = `${rect.left}px`;
      modalCard.style.top = `${rect.top}px`;
      ui.modalDrag = {
        pointerId: evt.pointerId,
        offsetX: evt.clientX - rect.left,
        offsetY: evt.clientY - rect.top,
        card: modalCard,
      };
    });
  }
}
if (aboutAppModal) {
  const modalHead = aboutAppModal.querySelector(".modal-head");
  const modalCard = aboutAppModal.querySelector(".about-app-card");
  if (modalHead && modalCard) {
    modalHead.addEventListener("pointerdown", (evt) => {
      if (evt.target.closest("button")) {
        return;
      }
      const rect = modalCard.getBoundingClientRect();
      modalCard.style.transform = "none";
      modalCard.style.left = `${rect.left}px`;
      modalCard.style.top = `${rect.top}px`;
      ui.modalDrag = {
        pointerId: evt.pointerId,
        offsetX: evt.clientX - rect.left,
        offsetY: evt.clientY - rect.top,
        card: modalCard,
      };
    });
  }
}
if (functionsHelpBtn) {
  functionsHelpBtn.addEventListener("click", () => {
    closeTopMenus();
    openFunctionsHelp();
  });
}
if (aboutAppBtn) {
  aboutAppBtn.addEventListener("click", () => {
    closeTopMenus();
    openAboutApp();
  });
}
if (functionsHelpCloseBtn) {
  functionsHelpCloseBtn.addEventListener("click", closeFunctionsHelp);
}
if (functionsHelpDismissBtn) {
  functionsHelpDismissBtn.addEventListener("click", closeFunctionsHelp);
}
if (aboutAppCloseBtn) {
  aboutAppCloseBtn.addEventListener("click", closeAboutApp);
}
if (aboutAppDismissBtn) {
  aboutAppDismissBtn.addEventListener("click", closeAboutApp);
}
if (expressionEditorSwitchCloseBtn) {
  expressionEditorSwitchCloseBtn.addEventListener("click", closeExpressionEditorSwitchModal);
}
if (expressionEditorSwitchCancelBtn) {
  expressionEditorSwitchCancelBtn.addEventListener("click", closeExpressionEditorSwitchModal);
}
if (expressionEditorSwitchDiscardBtn) {
  expressionEditorSwitchDiscardBtn.addEventListener("click", runPendingExpressionEditorSelectionAction);
}
if (expressionEditorSwitchApplyBtn) {
  expressionEditorSwitchApplyBtn.addEventListener("click", () => {
    if (!commitExpressionEditorValue(false)) {
      return;
    }
    runPendingExpressionEditorSelectionAction();
  });
}
if (functionsHelpModal) {
  functionsHelpModal.addEventListener("pointerdown", (evt) => {
    if (evt.target === functionsHelpModal) {
      closeFunctionsHelp();
    }
  });
}
if (aboutAppModal) {
  aboutAppModal.addEventListener("pointerdown", (evt) => {
    if (evt.target === aboutAppModal) {
      closeAboutApp();
    }
  });
}
if (expressionEditorSwitchModal) {
  expressionEditorSwitchModal.addEventListener("pointerdown", (evt) => {
    if (evt.target === expressionEditorSwitchModal) {
      closeExpressionEditorSwitchModal();
    }
  });
}

document.addEventListener("pointerover", (evt) => {
  const target = activeTooltipTarget(evt.target);
  if (!target) {
    scheduleHideAppTooltip(60);
    return;
  }
  ui.tooltipPointer = { x: evt.clientX, y: evt.clientY };
  scheduleShowAppTooltip(target, evt.clientX, evt.clientY);
});

document.addEventListener("pointermove", (evt) => {
  const target = activeTooltipTarget(evt.target);
  if (!target) {
    scheduleHideAppTooltip(60);
    return;
  }
  ui.tooltipPointer = { x: evt.clientX, y: evt.clientY };
  if (ui.tooltipTarget !== target) {
    scheduleShowAppTooltip(target, evt.clientX, evt.clientY);
    return;
  }
  cancelTooltipTimers();
  positionAppTooltip(evt.clientX, evt.clientY);
});

document.addEventListener("pointerout", (evt) => {
  if (!evt.relatedTarget || !activeTooltipTarget(evt.relatedTarget)) {
    scheduleHideAppTooltip(60);
  }
});

document.addEventListener("focusin", (evt) => {
  const target = activeTooltipTarget(evt.target);
  if (!target) {
    return;
  }
  const rect = target.getBoundingClientRect();
  showAppTooltip(target, rect.left + 8, rect.bottom);
});

document.addEventListener("focusout", (evt) => {
  if (!evt.relatedTarget || !activeTooltipTarget(evt.relatedTarget)) {
    hideAppTooltip();
  }
});

window.addEventListener("scroll", hideAppTooltip, true);
window.addEventListener("resize", hideAppTooltip);

modelTitleInput.addEventListener("input", () => {
  graph.modelTitle = modelTitleInput.value;
});

addModelPropBtn.addEventListener("click", () => {
  runAction(() => {
    graph.properties.push({ key: "", value: "" });
  });
});

addPropBtn.addEventListener("click", () => {
  if (ui.selectedNodes.size !== 1) {
    return;
  }
  const nodeId = [...ui.selectedNodes][0];
  const node = getNodeById(nodeId);
  if (!node) {
    return;
  }
  runAction(() => {
    node.properties.push({ key: "", value: "" });
  });
});

window.addEventListener("keydown", (evt) => {
  if ((evt.ctrlKey || evt.metaKey) && !evt.shiftKey && evt.key.toLowerCase() === "n" && !isTypingTarget(evt.target)) {
    evt.preventDefault();
    evt.stopPropagation();
    createNewGraph();
    return;
  }
  if (evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && evt.key.toLowerCase() === "n" && !isTypingTarget(evt.target)) {
    evt.preventDefault();
    evt.stopPropagation();
    createNewGraph();
    return;
  }
  if (evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && evt.key.toLowerCase() === "o" && !isTypingTarget(evt.target)) {
    evt.preventDefault();
    evt.stopPropagation();
    openGraphJson();
  }
}, true);

document.addEventListener("keydown", (evt) => {
  if (!expressionEditorSwitchModal?.classList.contains("hidden")) {
    if (evt.key === "Escape") {
      evt.preventDefault();
      closeExpressionEditorSwitchModal();
    } else if ((evt.ctrlKey || evt.metaKey) && evt.key === "Enter") {
      evt.preventDefault();
      if (commitExpressionEditorValue(false)) {
        runPendingExpressionEditorSelectionAction();
      }
    }
    return;
  }

  const expressionEditorActive =
    !expressionEditorModal?.classList.contains("hidden")
    && expressionEditorModal.contains(document.activeElement);
  if (expressionEditorActive) {
    if (evt.key === "Escape") {
      evt.preventDefault();
      closeExpressionEditor();
    } else if ((evt.ctrlKey || evt.metaKey) && evt.key === "Enter") {
      evt.preventDefault();
      applyExpressionEditor();
    }
    return;
  }

  if (!functionsHelpModal?.classList.contains("hidden")) {
    if (evt.key === "Escape" || evt.key === "F1") {
      evt.preventDefault();
      closeFunctionsHelp();
    }
    return;
  }

  if (!aboutAppModal?.classList.contains("hidden")) {
    if (evt.key === "Escape") {
      evt.preventDefault();
      closeAboutApp();
    }
    return;
  }

  if (evt.key === "F1") {
    evt.preventDefault();
    openFunctionsHelp();
    return;
  }

  if (evt.key === "F7") {
    evt.preventDefault();
    if (!hasStrictExecutionBlock()) {
      void executeNodeExpressions();
    }
    return;
  }
  if (evt.key === "F8") {
    evt.preventDefault();
    if (!hasStrictExecutionBlock()) {
      void runManualStep();
    }
    return;
  }
  if (evt.key === "F9") {
    evt.preventDefault();
    if (ui.timedRunHandle != null || !hasStrictExecutionBlock()) {
      void toggleTimedExecution();
    }
    return;
  }
  if (evt.key === "F10") {
    evt.preventDefault();
    resetExecution();
    return;
  }

  if (evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && !isTypingTarget(evt.target)) {
    if (isExecutionFrozen() && ["1", "2", "3", "4"].includes(evt.key)) {
      evt.preventDefault();
      return;
    }
    if (evt.key === "1") {
      evt.preventDefault();
      runAction(() => {
        addNode("rect");
      });
      setStatusKey("status.nodeCreated");
      return;
    }
    if (evt.key === "2") {
      evt.preventDefault();
      runAction(() => {
        addNode("ellipse");
      });
      setStatusKey("status.nodeCreated");
      return;
    }
    if (evt.key === "3") {
      evt.preventDefault();
      runAction(() => {
        addNode("diamond");
      });
      setStatusKey("status.nodeCreated");
      return;
    }
    if (evt.key === "4") {
      evt.preventDefault();
      runAction(() => {
        addNode("submodel");
      });
      setStatusKey("status.nodeCreated");
      return;
    }
  }

  if (evt.ctrlKey || evt.metaKey) {
    const key = evt.key.toLowerCase();
    const typingTarget = isTypingTarget(evt.target);
    if (key === "a" && !typingTarget) {
      evt.preventDefault();
      selectAllNodes();
      return;
    }
    if (key === "x" && !typingTarget) {
      if (isExecutionFrozen()) {
        evt.preventDefault();
        return;
      }
      evt.preventDefault();
      cutSelectionToClipboard();
      return;
    }
    if (key === "c" && !typingTarget) {
      evt.preventDefault();
      copySelectionToClipboard();
      return;
    }
    if (key === "v" && !typingTarget) {
      if (isExecutionFrozen()) {
        evt.preventDefault();
        return;
      }
      evt.preventDefault();
      pasteFromClipboard();
      return;
    }
    if (key === "s") {
      evt.preventDefault();
      if (evt.shiftKey) {
        saveGraphJson(true);
      } else {
        saveGraphJson(false);
      }
      return;
    }
    if (key === "n") {
      evt.preventDefault();
      createNewGraph();
      return;
    }
    if (key === "f" && evt.shiftKey) {
      evt.preventDefault();
      fitToContent();
      return;
    }
    if (evt.key === "+" || evt.key === "=") {
      evt.preventDefault();
      applyZoom(ui.zoom * 1.2);
      return;
    }
    if (evt.key === "-" || evt.key === "_") {
      evt.preventDefault();
      applyZoom(ui.zoom / 1.2);
      return;
    }
    if (evt.key === "0") {
      evt.preventDefault();
      applyZoom(1);
      return;
    }
  }

  if ((evt.ctrlKey || evt.metaKey) && !evt.shiftKey && evt.key.toLowerCase() === "z") {
    if (isExecutionFrozen()) {
      evt.preventDefault();
      return;
    }
    evt.preventDefault();
    undo();
    return;
  }

  if (
    (evt.ctrlKey || evt.metaKey) &&
    (evt.key.toLowerCase() === "y" || (evt.shiftKey && evt.key.toLowerCase() === "z"))
  ) {
    if (isExecutionFrozen()) {
      evt.preventDefault();
      return;
    }
    evt.preventDefault();
    redo();
    return;
  }

  if (evt.key === "Delete") {
    if (isExecutionFrozen()) {
      evt.preventDefault();
      return;
    }
    removeSelected();
  }

  if (evt.key === "Escape") {
    hideContextMenu();
    closeTopMenus();
    if (ui.drag || ui.resize || ui.edgeCreate || ui.controlPointDrag || ui.marquee) {
      cancelTransaction();
      ui.drag = null;
      ui.resize = null;
      ui.edgeCreate = null;
      ui.edgeCreateHoverId = null;
      ui.edgeCreateLastPoint = null;
      ui.controlPointDrag = null;
      ui.marquee = null;
      stopTimedExecution(false);
      setStatusKey("status.cancelOp");
      render();
    }
  }
});

window.addEventListener("pointerdown", (evt) => {
  if (!contextMenu.contains(evt.target)) {
    hideContextMenu();
  }
  if (!topMenuBar.contains(evt.target)) {
    closeTopMenus();
  }
});

window.addEventListener("resize", () => {
  updateCanvasSize();
});

async function boot() {
  await loadI18n();
  loadRecentModelsFromStorage();
  renderRecentModelsMenu();

  runAction(() => {
    addNode("rect");
    addNode("ellipse");
    clearAllSelection();
  });
  history.undo = [];
  history.redo = [];
  updateZoomButtons();
  applyCanvasVisibility();
  markSavedSnapshot();
  updateModelRunButtons();
  setStatusKey("status.ready");
  render();
}

boot();
