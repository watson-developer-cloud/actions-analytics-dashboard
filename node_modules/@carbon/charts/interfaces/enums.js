import * as EventEnums from './events';
export var Events = EventEnums;
/**
 * enum of all supported chart themes
 */
export var ChartTheme;
(function (ChartTheme) {
    ChartTheme["DEFAULT"] = "default";
    ChartTheme["G100"] = "g100";
    ChartTheme["G90"] = "g90";
    ChartTheme["G10"] = "g10";
})(ChartTheme || (ChartTheme = {}));
/**
 * enum of all color classname types
 */
export var ColorClassNameTypes;
(function (ColorClassNameTypes) {
    ColorClassNameTypes["FILL"] = "fill";
    ColorClassNameTypes["STROKE"] = "stroke";
    ColorClassNameTypes["TOOLTIP"] = "tooltip";
})(ColorClassNameTypes || (ColorClassNameTypes = {}));
/**
 * enum of all possible axis positions
 */
export var AxisPositions;
(function (AxisPositions) {
    AxisPositions["LEFT"] = "left";
    AxisPositions["RIGHT"] = "right";
    AxisPositions["TOP"] = "top";
    AxisPositions["BOTTOM"] = "bottom";
})(AxisPositions || (AxisPositions = {}));
/**
 * enum of all possible axis positions
 */
export var ZoomBarTypes;
(function (ZoomBarTypes) {
    ZoomBarTypes["GRAPH_VIEW"] = "graph_view";
    ZoomBarTypes["SLIDER_VIEW"] = "slider_view";
})(ZoomBarTypes || (ZoomBarTypes = {}));
/**
 * enum of all possible truncation types
 */
export var TruncationTypes;
(function (TruncationTypes) {
    TruncationTypes["END_LINE"] = "end_line";
    TruncationTypes["MID_LINE"] = "mid_line";
    TruncationTypes["FRONT_LINE"] = "front_line";
    TruncationTypes["NONE"] = "none";
})(TruncationTypes || (TruncationTypes = {}));
/**
 * enum of all possible cartesian orientations
 * to be used for determining the orientation
 * of graphs being draw over
 * cartesian scales
 */
export var CartesianOrientations;
(function (CartesianOrientations) {
    CartesianOrientations["VERTICAL"] = "vertical";
    CartesianOrientations["HORIZONTAL"] = "horizontal";
})(CartesianOrientations || (CartesianOrientations = {}));
/**
 * enum of all possible scale types
 */
export var ScaleTypes;
(function (ScaleTypes) {
    ScaleTypes["TIME"] = "time";
    ScaleTypes["LINEAR"] = "linear";
    ScaleTypes["LOG"] = "log";
    ScaleTypes["LABELS"] = "labels";
    ScaleTypes["LABELS_RATIO"] = "labels-ratio";
})(ScaleTypes || (ScaleTypes = {}));
/**
 * enum of all possible legend positions
 */
export var LegendPositions;
(function (LegendPositions) {
    LegendPositions["RIGHT"] = "right";
    LegendPositions["LEFT"] = "left";
    LegendPositions["TOP"] = "top";
    LegendPositions["BOTTOM"] = "bottom";
})(LegendPositions || (LegendPositions = {}));
/**
 * enum of all possible alignments
 */
export var Alignments;
(function (Alignments) {
    Alignments["LEFT"] = "left";
    Alignments["CENTER"] = "center";
    Alignments["RIGHT"] = "right";
})(Alignments || (Alignments = {}));
/**
 * enum of all possible legend orientations
 */
export var LegendOrientations;
(function (LegendOrientations) {
    LegendOrientations["HORIZONTAL"] = "horizontal";
    LegendOrientations["VERTICAL"] = "vertical";
})(LegendOrientations || (LegendOrientations = {}));
/**
 * enum of all possible layout directions
 */
export var LayoutDirection;
(function (LayoutDirection) {
    LayoutDirection["ROW"] = "row";
    LayoutDirection["COLUMN"] = "column";
    LayoutDirection["ROW_REVERSE"] = "row-reverse";
    LayoutDirection["COLUMN_REVERSE"] = "column-reverse";
})(LayoutDirection || (LayoutDirection = {}));
/**
 * enum of all possible layout growth values
 */
export var LayoutGrowth;
(function (LayoutGrowth) {
    LayoutGrowth["FIXED"] = "fixed";
    LayoutGrowth["PREFERRED"] = "preferred";
    LayoutGrowth["STRETCH"] = "stretch";
})(LayoutGrowth || (LayoutGrowth = {}));
/**
 * enum of all possible callout directions
 */
export var CalloutDirections;
(function (CalloutDirections) {
    CalloutDirections["LEFT"] = "left";
    CalloutDirections["RIGHT"] = "right";
})(CalloutDirections || (CalloutDirections = {}));
/**
 * enum of all possible skeleton/empty state types
 */
export var Skeletons;
(function (Skeletons) {
    Skeletons["GRID"] = "grid";
    Skeletons["VERT_OR_HORIZ"] = "vertOrHoriz";
    Skeletons["PIE"] = "pie";
    Skeletons["DONUT"] = "donut";
})(Skeletons || (Skeletons = {}));
/**
 * enum of all possible attributes used to aling text horizontally
 */
export var TextAnchor;
(function (TextAnchor) {
    TextAnchor["START"] = "start";
    TextAnchor["MIDDLE"] = "middle";
    TextAnchor["END"] = "end";
})(TextAnchor || (TextAnchor = {}));
/**
 * enum of all possible attributes used to aling text vertically
 */
export var DominantBaseline;
(function (DominantBaseline) {
    DominantBaseline["BASELINE"] = "baseline";
    DominantBaseline["MIDDLE"] = "middle";
    DominantBaseline["HANGING"] = "hanging";
})(DominantBaseline || (DominantBaseline = {}));
export var GaugeTypes;
(function (GaugeTypes) {
    GaugeTypes["SEMI"] = "semi";
    GaugeTypes["FULL"] = "full";
})(GaugeTypes || (GaugeTypes = {}));
/**
 * enum of all possible callout directions
 */
export var ArrowDirections;
(function (ArrowDirections) {
    ArrowDirections["UP"] = "up";
    ArrowDirections["DOWN"] = "down";
})(ArrowDirections || (ArrowDirections = {}));
/**
 * enum of carbon statuses
 */
export var Statuses;
(function (Statuses) {
    Statuses["SUCCESS"] = "success";
    Statuses["WARNING"] = "warning";
    Statuses["DANGER"] = "danger";
})(Statuses || (Statuses = {}));
/**
 * enum of axis ticks rotation
 */
export var TickRotations;
(function (TickRotations) {
    TickRotations["ALWAYS"] = "always";
    TickRotations["AUTO"] = "auto";
    TickRotations["NEVER"] = "never";
})(TickRotations || (TickRotations = {}));
/**
 * enum of chartTypes that work with combo chart
 */
export var ChartTypes;
(function (ChartTypes) {
    ChartTypes["SCATTER"] = "scatter";
    ChartTypes["LINE"] = "line";
    ChartTypes["SIMPLE_BAR"] = "simple-bar";
    ChartTypes["STACKED_BAR"] = "stacked-bar";
    ChartTypes["GROUPED_BAR"] = "grouped-bar";
    ChartTypes["AREA"] = "area";
    ChartTypes["STACKED_AREA"] = "stacked-area";
})(ChartTypes || (ChartTypes = {}));
/**
 * enum of supported toolbar control types
 */
export var ToolbarControlTypes;
(function (ToolbarControlTypes) {
    ToolbarControlTypes["ZOOM_IN"] = "Zoom in";
    ToolbarControlTypes["ZOOM_OUT"] = "Zoom out";
    ToolbarControlTypes["RESET_ZOOM"] = "Reset zoom";
})(ToolbarControlTypes || (ToolbarControlTypes = {}));
/**
 * enum of title orientations for _vertical axes_
 */
export var AxisTitleOrientations;
(function (AxisTitleOrientations) {
    AxisTitleOrientations["LEFT"] = "left";
    AxisTitleOrientations["RIGHT"] = "right";
})(AxisTitleOrientations || (AxisTitleOrientations = {}));
/**
 * enum of legend item type
 */
export var LegendItemType;
(function (LegendItemType) {
    LegendItemType["CHECKBOX"] = "checkbox";
    LegendItemType["RADIUS"] = "radius";
    LegendItemType["AREA"] = "area";
    LegendItemType["SIZE"] = "size";
    LegendItemType["LINE"] = "line";
    LegendItemType["QUARTILE"] = "quartile";
    LegendItemType["ZOOM"] = "zoom";
})(LegendItemType || (LegendItemType = {}));
//# sourceMappingURL=../../src/interfaces/enums.js.map