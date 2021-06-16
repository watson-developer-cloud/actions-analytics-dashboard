/**
 * enum of all events related to the chart on the DOM
 */
export var Chart;
(function (Chart) {
    Chart["RENDER_FINISHED"] = "render-finished";
    Chart["RESIZE"] = "chart-resize";
    Chart["MOUSEOVER"] = "chart-mouseover";
    // MOUSEMOVE = "chart-mousemove",
    // CLICK = "chart-click",
    Chart["MOUSEOUT"] = "chart-mouseout";
})(Chart || (Chart = {}));
/**
 * enum of all events related to the chart model
 */
export var Model;
(function (Model) {
    Model["UPDATE"] = "model-update";
})(Model || (Model = {}));
/**
 * enum of all toolbar events
 */
export var Toolbar;
(function (Toolbar) {
    Toolbar["SHOW_OVERFLOW_MENU"] = "show-toolbar-overflow-menu";
    Toolbar["HIDE_OVERFLOW_MENU"] = "hide-toolbar-overflow-menu";
})(Toolbar || (Toolbar = {}));
/**
 * enum of all events related to the zoom-bar
 */
export var ZoomBar;
(function (ZoomBar) {
    ZoomBar["UPDATE"] = "zoom-bar-update";
    ZoomBar["SELECTION_START"] = "zoom-bar-selection-start";
    ZoomBar["SELECTION_IN_PROGRESS"] = "zoom-bar-selection-in-progress";
    ZoomBar["SELECTION_END"] = "zoom-bar-selection-end";
})(ZoomBar || (ZoomBar = {}));
/**
 * enum of all events related to the zoom domain
 */
export var ZoomDomain;
(function (ZoomDomain) {
    ZoomDomain["CHANGE"] = "zoom-domain-change";
})(ZoomDomain || (ZoomDomain = {}));
/** enum of all events related to canvas zoom *
 *
 */
export var CanvasZoom;
(function (CanvasZoom) {
    CanvasZoom["CANVAS_ZOOM_IN"] = "canvas-zoom-in";
    CanvasZoom["CANVAS_ZOOM_OUT"] = "canvas-zoom-out";
})(CanvasZoom || (CanvasZoom = {}));
/**
 * enum of all axis-related events
 */
export var Axis;
(function (Axis) {
    Axis["LABEL_MOUSEOVER"] = "axis-label-mouseover";
    Axis["LABEL_MOUSEMOVE"] = "axis-label-mousemove";
    Axis["LABEL_CLICK"] = "axis-label-click";
    Axis["LABEL_MOUSEOUT"] = "axis-label-mouseout";
})(Axis || (Axis = {}));
/**
 * enum of all area graph events
 */
export var Area;
(function (Area) {
    Area["AREA_MOUSEOVER"] = "area-mouseover";
    Area["AREA_MOUSEMOVE"] = "area-mousemove";
    Area["AREA_CLICK"] = "area-click";
    Area["AREA_MOUSEOUT"] = "area-mouseout";
})(Area || (Area = {}));
/**
 * enum of all wordcloud graph events
 */
export var WordCloud;
(function (WordCloud) {
    WordCloud["WORD_MOUSEOVER"] = "wordcloud-word-mouseover";
    WordCloud["WORD_MOUSEMOVE"] = "wordcloud-word-mousemove";
    WordCloud["WORD_CLICK"] = "wordcloud-word-click";
    WordCloud["WORD_MOUSEOUT"] = "wordcloud-word-mouseout";
})(WordCloud || (WordCloud = {}));
/**
 * enum of all pie graph events
 */
export var Pie;
(function (Pie) {
    Pie["SLICE_MOUSEOVER"] = "pie-slice-mouseover";
    Pie["SLICE_MOUSEMOVE"] = "pie-slice-mousemove";
    Pie["SLICE_CLICK"] = "pie-slice-click";
    Pie["SLICE_MOUSEOUT"] = "pie-slice-mouseout";
})(Pie || (Pie = {}));
/**
 * enum of all gauge graph events
 */
export var Gauge;
(function (Gauge) {
    Gauge["ARC_MOUSEOVER"] = "gauge-arc-mouseover";
    Gauge["ARC_MOUSEMOVE"] = "gauge-arc-mousemove";
    Gauge["ARC_CLICK"] = "gauge-arc-click";
    Gauge["ARC_MOUSEOUT"] = "gauge-arc-mouseout";
})(Gauge || (Gauge = {}));
/**
 * enum of all bar graph events
 */
export var Bar;
(function (Bar) {
    Bar["BAR_MOUSEOVER"] = "bar-mouseover";
    Bar["BAR_MOUSEMOVE"] = "bar-mousemove";
    Bar["BAR_CLICK"] = "bar-click";
    Bar["BAR_MOUSEOUT"] = "bar-mouseout";
})(Bar || (Bar = {}));
/**
 * enum of all boxplot graph events
 */
export var Boxplot;
(function (Boxplot) {
    Boxplot["BOX_MOUSEOVER"] = "box-mouseover";
    Boxplot["BOX_MOUSEMOVE"] = "box-mousemove";
    Boxplot["BOX_CLICK"] = "box-click";
    Boxplot["BOX_MOUSEOUT"] = "box-mouseout";
    Boxplot["OUTLIER_MOUSEOVER"] = "outlier-mouseover";
    Boxplot["OUTLIER_MOUSEMOVE"] = "outlier-mousemove";
    Boxplot["OUTLIER_CLICK"] = "outlier-click";
    Boxplot["OUTLIER_MOUSEOUT"] = "outlier-mouseout";
})(Boxplot || (Boxplot = {}));
/**
 * enum of all scatter graph events
 */
export var Scatter;
(function (Scatter) {
    Scatter["SCATTER_MOUSEOVER"] = "scatter-mouseover";
    Scatter["SCATTER_MOUSEMOVE"] = "scatter-mousemove";
    Scatter["SCATTER_CLICK"] = "scatter-click";
    Scatter["SCATTER_MOUSEOUT"] = "scatter-mouseout";
})(Scatter || (Scatter = {}));
/**
 * enum of all line graph events
 */
export var Line;
(function (Line) {
    Line["POINT_MOUSEOVER"] = "scatter-mouseover";
    Line["POINT_MOUSEMOVE"] = "scatter-mousemove";
    Line["POINT_CLICK"] = "scatter-click";
    Line["POINT_MOUSEOUT"] = "scatter-mouseout";
})(Line || (Line = {}));
/**
 * enum of all radar graph events
 */
export var Radar;
(function (Radar) {
    Radar["X_AXIS_MOUSEOVER"] = "radar-x-axis-mouseover";
    Radar["X_AXIS_MOUSEMOVE"] = "radar-x-axis-mousemove";
    Radar["X_AXIS_CLICK"] = "radar-x-axis-click";
    Radar["X_AXIS_MOUSEOUT"] = "radar-x-axis-mouseout";
})(Radar || (Radar = {}));
/**
 * enum of all treemap graph events
 */
export var Treemap;
(function (Treemap) {
    Treemap["LEAF_MOUSEOVER"] = "leaf-mouseover";
    Treemap["LEAF_MOUSEMOVE"] = "leaf-mousemove";
    Treemap["LEAF_CLICK"] = "leaf-click";
    Treemap["LEAF_MOUSEOUT"] = "leaf-mouseout";
})(Treemap || (Treemap = {}));
/**
 * enum of all tooltip events
 */
export var Tooltip;
(function (Tooltip) {
    Tooltip["SHOW"] = "show-tooltip";
    Tooltip["MOVE"] = "move-tooltip";
    Tooltip["HIDE"] = "hide-tooltip";
})(Tooltip || (Tooltip = {}));
/**
 * enum of all threshold events
 */
export var Threshold;
(function (Threshold) {
    Threshold["SHOW"] = "show-threshold";
    Threshold["HIDE"] = "hide-threshold";
})(Threshold || (Threshold = {}));
/**
 * enum of all legend related events
 */
export var Legend;
(function (Legend) {
    Legend["ITEM_HOVER"] = "legend-item-onhover";
    Legend["ITEM_CLICK"] = "legend-item-onclick";
    Legend["ITEM_MOUSEOUT"] = "legend-item-onmouseout";
    Legend["ITEMS_UPDATE"] = "legend-items-update";
})(Legend || (Legend = {}));
/**
 * enum of all circlepack related events
 */
export var CirclePack;
(function (CirclePack) {
    CirclePack["CIRCLE_MOUSEOVER"] = "circle-leaf-mouseover";
    CirclePack["CIRCLE_CLICK"] = "circle-leaf-click";
    CirclePack["CIRCLE_MOUSEOUT"] = "circle-leaf-mouseout";
    CirclePack["CIRCLE_MOUSEMOVE"] = "circle-leaf-mousemove";
})(CirclePack || (CirclePack = {}));
//# sourceMappingURL=../../src/interfaces/events.js.map