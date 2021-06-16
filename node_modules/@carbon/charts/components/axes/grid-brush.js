var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Internal Imports
import { Component } from '../component';
import { ScaleTypes } from '../../interfaces';
import { DOMUtils } from '../../services';
// D3 Imports
import { brushX } from 'd3-brush';
import { event, mouse } from 'd3-selection';
import { scaleTime } from 'd3-scale';
// This class is used for handle brush events in chart
var ChartBrush = /** @class */ (function (_super) {
    __extends(ChartBrush, _super);
    function ChartBrush() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'grid-brush';
        _this.selectionSelector = 'rect.selection'; // needs to match the class name in d3.brush
        _this.frontSelectionSelector = 'rect.frontSelection'; // needs to match the class name in _grid-brush.scss
        return _this;
    }
    ChartBrush.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        var svg = this.parent;
        // use this area to display selection above all graphs
        var frontSelectionArea = this.getContainerSVG();
        var backdrop = DOMUtils.appendOrSelect(svg, 'svg.chart-grid-backdrop');
        // use this area to handle d3 brush events
        var brushArea = DOMUtils.appendOrSelect(backdrop, "g." + this.type);
        // set an id for rect.selection to be referred
        var d3Selection = DOMUtils.appendOrSelect(brushArea, this.selectionSelector);
        var _a = DOMUtils.getSVGElementSize(backdrop, {
            useAttrs: true,
        }), width = _a.width, height = _a.height;
        var cartesianScales = this.services.cartesianScales;
        var mainXScaleType = cartesianScales.getMainXScaleType();
        var mainXScale = cartesianScales.getMainXScale();
        var _b = mainXScale.range(), xScaleStart = _b[0], xScaleEnd = _b[1];
        frontSelectionArea.attr('transform', "translate(" + xScaleStart + ",0)");
        var frontSelection = DOMUtils.appendOrSelect(frontSelectionArea, this.frontSelectionSelector);
        if (mainXScale && mainXScaleType === ScaleTypes.TIME) {
            // get current zoomDomain
            var zoomDomain_1 = this.model.get('zoomDomain');
            if (zoomDomain_1 === undefined) {
                // default to full range with extended domain
                zoomDomain_1 = this.services.zoom.getDefaultZoomBarDomain();
                if (zoomDomain_1) {
                    this.model.set({ zoomDomain: zoomDomain_1 }, { animate: false });
                }
            }
            var updateSelectionDash_1 = function (selection) {
                // set end drag point to dash
                var selectionWidth = selection[1] - selection[0];
                var dashArray = '0,' + selectionWidth.toString(); // top (invisible)
                // right
                var dashCount = Math.floor(height / ChartBrush.DASH_LENGTH);
                var totalRightDash = dashCount * ChartBrush.DASH_LENGTH;
                for (var i = 0; i < dashCount; i++) {
                    dashArray += ',' + ChartBrush.DASH_LENGTH; // for each full length dash
                }
                dashArray += ',' + (height - totalRightDash); // for rest of the right height
                // if dash count is even, one more ",0" is needed to make total right dash pattern even
                if (dashCount % 2 === 1) {
                    dashArray += ',0';
                }
                dashArray += ',' + selectionWidth.toString(); // bottom (invisible)
                dashArray += ',' + height.toString(); // left
                frontSelection.attr('stroke-dasharray', dashArray);
            };
            var brushEventHandler = function () {
                // selection range: [0, width]
                var selection = event.selection;
                if (selection === null || selection[0] === selection[1]) {
                    return;
                }
                // copy the d3 selection attrs to front selection element
                frontSelection
                    .attr('x', d3Selection.attr('x'))
                    .attr('y', d3Selection.attr('y'))
                    .attr('width', d3Selection.attr('width'))
                    .attr('height', d3Selection.attr('height'))
                    .style('cursor', 'pointer')
                    .style('display', null);
                updateSelectionDash_1(selection);
            };
            // assume max range is [0, width]
            var updateZoomDomain_1 = function (startPoint, endPoint) {
                // create xScale based on current zoomDomain
                var xScale = scaleTime().range([0, width]).domain(zoomDomain_1);
                var newDomain = [
                    xScale.invert(startPoint),
                    xScale.invert(endPoint),
                ];
                // if selected start time and end time are the same
                // reset to default full range
                if (newDomain[0].valueOf() === newDomain[1].valueOf()) {
                    // same as d3 behavior and zoom bar behavior: set to default full range
                    newDomain = _this.services.zoom.getDefaultZoomBarDomain();
                }
                // only if zoomDomain needs update
                if (zoomDomain_1[0].valueOf() !== newDomain[0].valueOf() ||
                    zoomDomain_1[1].valueOf() !== newDomain[1].valueOf()) {
                    _this.services.zoom.handleDomainChange(newDomain);
                }
            };
            var brushed = function () {
                // max selection range: [0, width]
                var selection = event.selection;
                if (selection !== null) {
                    // updateZoomDomain assumes max range is [0, width]
                    updateZoomDomain_1(selection[0], selection[1]);
                    // clear brush selection
                    brushArea.call(brush_1.move, null);
                    // hide frontSelection
                    frontSelection.style('display', 'none');
                }
            };
            // leave some space to display selection strokes besides axis
            var brush_1 = brushX()
                .extent([
                [0, 0],
                [width - 1, height],
            ])
                .on('start brush end', brushEventHandler)
                .on('end.brushed', brushed);
            brushArea.call(brush_1);
            var zoomRatio_1 = this.services.zoom.getZoomRatio();
            backdrop.on('click', function () {
                if (event.shiftKey) {
                    // clickedX range: [0, width]
                    var clickedX = mouse(brushArea.node())[0];
                    var leftPoint = clickedX - (width * zoomRatio_1) / 2;
                    if (leftPoint < 0) {
                        leftPoint = 0;
                    }
                    var rightPoint = clickedX + (width * zoomRatio_1) / 2;
                    if (rightPoint > width) {
                        rightPoint = width;
                    }
                    // updateZoomDomain assumes max range is [0, width]
                    updateZoomDomain_1(leftPoint, rightPoint);
                }
            });
        }
    };
    ChartBrush.DASH_LENGTH = 4;
    return ChartBrush;
}(Component));
export { ChartBrush };
//# sourceMappingURL=../../../src/components/axes/grid-brush.js.map