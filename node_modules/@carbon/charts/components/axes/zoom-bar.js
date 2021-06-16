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
import { Tools } from '../../tools';
import { AxisPositions, Events, ScaleTypes, ZoomBarTypes, } from '../../interfaces';
import { DOMUtils } from '../../services';
import * as Configuration from '../../configuration';
// D3 Imports
import { extent } from 'd3-array';
import { brushX } from 'd3-brush';
import { area, line } from 'd3-shape';
import { event } from 'd3-selection';
var ZoomBar = /** @class */ (function (_super) {
    __extends(ZoomBar, _super);
    function ZoomBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'zoom-bar';
        // The minimum selection x range to trigger handler update
        // Smaller number may introduce a handler flash during initialization
        // Bigger number may not trigger handler update while selection area on chart is very small
        _this.MIN_SELECTION_DIFF = 9e-10;
        // needs to match the style in _zoom-bar.scss
        _this.brushSelector = 'g.zoom-bar-brush';
        // Give every zoomBarClip a distinct ID
        // so they don't interfere the other zoom bars in a page
        _this.clipId = 'zoomBarClip-' + Math.floor(Math.random() * 99999999999);
        _this.brush = brushX();
        return _this;
    }
    ZoomBar.prototype.init = function () {
        this.services.events.addEventListener(Events.ZoomBar.UPDATE, this.render.bind(this));
        // check if pre-defined zoom bar data exists
        var definedZoomBarData = Tools.getProperty(this.getOptions(), 'zoomBar', AxisPositions.TOP, 'data');
        // load up the zoomBarData into this model
        this.model.setZoomBarData(definedZoomBarData);
    };
    ZoomBar.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        var svg = this.getContainerSVG();
        var isTopZoomBarLoading = this.services.zoom.isZoomBarLoading(AxisPositions.TOP);
        var isTopZoomBarLocked = this.services.zoom.isZoomBarLocked(AxisPositions.TOP);
        var zoombarType = Tools.getProperty(this.getOptions(), 'zoomBar', AxisPositions.TOP, 'type');
        var zoombarHeight = Configuration.zoomBar.height[zoombarType];
        var width = DOMUtils.getSVGElementSize(this.parent, {
            useAttrs: true,
        }).width;
        // initialization is not completed yet
        if (width === 0) {
            return;
        }
        // get axes margins
        var axesLeftMargin = 0;
        var axesMargins = this.model.get('axesMargins');
        if (axesMargins && axesMargins.left) {
            axesLeftMargin = axesMargins.left;
        }
        var container = DOMUtils.appendOrSelect(svg, 'svg.zoom-container')
            .attr('width', '100%')
            .attr('height', zoombarHeight)
            .attr('opacity', 1);
        var spacer = DOMUtils.appendOrSelect(svg, 'rect.zoom-spacer')
            .attr('x', 0)
            .attr('y', zoombarHeight)
            .attr('width', '100%')
            .attr('height', Configuration.zoomBar.spacerHeight)
            .attr('opacity', 1)
            .attr('fill', 'none');
        if (zoombarType === ZoomBarTypes.GRAPH_VIEW) {
            // Draw zoombar background rectangle
            DOMUtils.appendOrSelect(container, 'rect.zoom-bg')
                .attr('x', axesLeftMargin)
                .attr('y', 0)
                .attr('width', width - axesLeftMargin)
                .attr('height', '100%')
                .classed('zoom-bg-skeleton', isTopZoomBarLoading);
        }
        else if (zoombarType === ZoomBarTypes.SLIDER_VIEW) {
            // Draw zoombar background line
            DOMUtils.appendOrSelect(container, 'rect.zoom-slider-bg')
                .attr('x', axesLeftMargin)
                .attr('y', zoombarHeight / 2 - 1)
                .attr('width', width - axesLeftMargin)
                .attr('height', 2)
                .classed('zoom-slider-bg-skeleton', isTopZoomBarLoading);
        }
        if (isTopZoomBarLoading) {
            this.renderSkeleton(container, axesLeftMargin, width);
            return;
        }
        var cartesianScales = this.services.cartesianScales;
        var mainXScale = cartesianScales.getMainXScale();
        var mainYScale = cartesianScales.getMainYScale();
        var mainXScaleType = cartesianScales.getMainXScaleType();
        if (mainXScale && mainXScaleType === ScaleTypes.TIME) {
            var zoomBarData = this.services.zoom.getZoomBarData();
            if (Tools.isEmpty(zoomBarData)) {
                // if there's no zoom bar data we can't do anything
                return;
            }
            this.xScale = mainXScale.copy();
            this.yScale = mainYScale.copy();
            var defaultDomain = this.services.zoom.getDefaultZoomBarDomain(zoomBarData);
            // add value 0 to the extended domain for zoom bar area graph
            zoomBarData = this.compensateDataForDefaultDomain(zoomBarData, defaultDomain);
            // get old initialZoomDomain from model
            var oldInitialZoomDomain = this.model.get('initialZoomDomain');
            // get new initialZoomDomain from option
            var newInitialZoomDomain = Tools.getProperty(this.getOptions(), 'zoomBar', AxisPositions.TOP, 'initialZoomDomain');
            // change string date to Date object if necessary
            if (newInitialZoomDomain &&
                newInitialZoomDomain[0] &&
                newInitialZoomDomain[1]) {
                newInitialZoomDomain[0] = new Date(newInitialZoomDomain[0]);
                newInitialZoomDomain[1] = new Date(newInitialZoomDomain[1]);
            }
            // update initialZoomDomain and set zoomDomain in model only if the option is changed
            // not the same object, and both start date and end date are not equal
            if (newInitialZoomDomain &&
                !(oldInitialZoomDomain &&
                    oldInitialZoomDomain[0].valueOf() ===
                        newInitialZoomDomain[0].valueOf() &&
                    oldInitialZoomDomain[1].valueOf() ===
                        newInitialZoomDomain[1].valueOf())) {
                this.model.set({
                    // use a new object instead of newInitialZoomDomain
                    initialZoomDomain: Tools.merge([], newInitialZoomDomain),
                    zoomDomain: newInitialZoomDomain
                        ? Tools.merge([], newInitialZoomDomain)
                        : defaultDomain,
                }, { skipUpdate: true });
            }
            else if (newInitialZoomDomain === null &&
                oldInitialZoomDomain != null) {
                // if newInitialZoomDomain is set to null (when oldInitialZoomDomain is not null)
                // save initialZoomDomain and reset zoom domain to default domain
                this.model.set({
                    initialZoomDomain: null,
                    zoomDomain: Tools.merge([], defaultDomain),
                }, { skipUpdate: true });
            }
            this.xScale.range([axesLeftMargin, width]).domain(defaultDomain);
            // keep max selection range
            this.maxSelectionRange = this.xScale.range();
            this.yScale
                .range([0, zoombarHeight - 6])
                .domain(extent(zoomBarData, function (d) { return d.value; }));
            var zoomDomain = this.model.get('zoomDomain');
            if (zoombarType === ZoomBarTypes.GRAPH_VIEW) {
                this.renderZoomBarArea(container, 'path.zoom-graph-area-unselected', zoomBarData, null);
                this.updateClipPath(svg, this.clipId, 0, 0, 0, 0);
                this.renderZoomBarArea(container, 'path.zoom-graph-area', zoomBarData, this.clipId);
                // Draw the zoom bar base line
                this.renderZoomBarBaseline(container, axesLeftMargin, width);
            }
            // Attach brushing event listeners
            this.addBrushEventListener(zoomDomain, axesLeftMargin, width);
            // Draw the brushing area
            var brushArea = DOMUtils.appendOrSelect(svg, this.brushSelector).call(this.brush);
            if (zoomDomain === undefined) {
                // do nothing, initialization not completed yet
                // don't update brushHandle to avoid flash
            }
            else if (zoomDomain[0].valueOf() === zoomDomain[1].valueOf()) {
                brushArea.call(this.brush.move, this.xScale.range()); // default to full range
                this.updateBrushHandle(this.getContainerSVG(), this.xScale.range(), this.xScale.domain());
            }
            else {
                var selected = zoomDomain.map(function (domain) {
                    return _this.xScale(domain);
                });
                if (selected[1] - selected[0] < this.MIN_SELECTION_DIFF) {
                    // initialization not completed yet
                    // don't update brushHandle to avoid flash
                }
                else {
                    brushArea.call(this.brush.move, selected); // set brush to correct position
                    this.updateBrushHandle(this.getContainerSVG(), selected, zoomDomain);
                }
            }
            if (isTopZoomBarLocked) {
                this.brush.filter(function () {
                    return false;
                });
                // reset all cursor to auto
                brushArea.selectAll('rect').attr('cursor', 'auto');
            }
        }
    };
    ZoomBar.prototype.addBrushEventListener = function (zoomDomain, axesLeftMargin, width) {
        var _this = this;
        var brushEventListener = function () {
            var selection = event.selection;
            // follow d3 behavior: when selection is null, reset default full range
            // select behavior is completed, but nothing selected
            if (selection === null) {
                _this.handleBrushedEvent(zoomDomain, _this.xScale, _this.xScale.range());
            }
            else if (selection[0] === selection[1]) {
                // select behavior is not completed yet, do nothing
            }
            else {
                _this.handleBrushedEvent(zoomDomain, _this.xScale, selection);
            }
        };
        var zoombarType = Tools.getProperty(this.getOptions(), 'zoomBar', AxisPositions.TOP, 'type');
        var zoombarHeight = Configuration.zoomBar.height[zoombarType];
        // Initialize the d3 brush
        this.brush
            .extent([
            [axesLeftMargin, 0],
            [width, zoombarHeight],
        ])
            .on('start brush end', null) // remove old listener first
            .on('start brush end', brushEventListener);
    };
    // brush event listener
    ZoomBar.prototype.handleBrushedEvent = function (zoomDomain, scale, selection) {
        var newDomain = [
            scale.invert(selection[0]),
            scale.invert(selection[1]),
        ];
        // update brush handle position
        this.updateBrushHandle(this.getContainerSVG(), selection, newDomain);
        // be aware that the value of d3.event changes during an event!
        // update zoomDomain only if the event comes from mouse/touch event
        if (event.sourceEvent != null &&
            (event.sourceEvent.type === 'mousemove' ||
                event.sourceEvent.type === 'mouseup' ||
                event.sourceEvent.type === 'mousedown' ||
                event.sourceEvent.type === 'touchstart' ||
                event.sourceEvent.type === 'touchmove' ||
                event.sourceEvent.type === 'touchend')) {
            // only if zoomDomain is never set or needs update
            if (zoomDomain === undefined ||
                zoomDomain[0] !== newDomain[0] ||
                zoomDomain[1] !== newDomain[1]) {
                // don't dispatch event for all event types
                // let the following code to dispatch necessary events
                this.services.zoom.handleDomainChange(newDomain, {
                    dispatchEvent: false,
                });
            }
            // dispatch selection events
            var zoomBarEventType = void 0;
            if (event.type === 'start') {
                zoomBarEventType = Events.ZoomBar.SELECTION_START;
            }
            else if (event.type === 'brush') {
                zoomBarEventType = Events.ZoomBar.SELECTION_IN_PROGRESS;
            }
            else if (event.type === 'end') {
                zoomBarEventType = Events.ZoomBar.SELECTION_END;
                // only dispatch zoom domain change event for triggering api call when event type equals to end
                this.services.events.dispatchEvent(Events.ZoomDomain.CHANGE, {
                    newDomain: newDomain,
                });
            }
            this.services.events.dispatchEvent(zoomBarEventType, {
                selection: selection,
                newDomain: newDomain,
            });
        }
    };
    ZoomBar.prototype.updateBrushHandle = function (svg, selection, domain) {
        var self = this;
        var handleWidth = Configuration.zoomBar.handleWidth;
        var zoombarType = Tools.getProperty(this.getOptions(), 'zoomBar', AxisPositions.TOP, 'type');
        var handleHeight = Configuration.zoomBar.height[zoombarType];
        var handleXDiff = -handleWidth / 2;
        var handleBarWidth = Configuration.zoomBar.handleBarWidth;
        var handleBarHeight = zoombarType === ZoomBarTypes.GRAPH_VIEW
            ? Configuration.zoomBar.handleBarHeight
            : 6;
        var handleBarXDiff = -handleBarWidth / 2;
        var handleYBarDiff = (handleHeight - handleBarHeight) / 2;
        // handle
        svg.select(this.brushSelector)
            .selectAll('rect.handle')
            .data([{ type: 'w' }, { type: 'e' }])
            .attr('x', function (d) {
            if (d.type === 'w') {
                // handle should not exceed zoom bar range
                return Math.max(selection[0] + handleXDiff, self.maxSelectionRange[0]);
            }
            else if (d.type === 'e') {
                // handle should not exceed zoom bar range
                return Math.min(selection[1] + handleXDiff, self.maxSelectionRange[1] - handleWidth);
            }
        })
            .attr('y', 0)
            .attr('width', handleWidth)
            .attr('height', handleHeight)
            .attr('cursor', 'ew-resize')
            .style('display', null); // always display
        // handle-bar
        var handleBars = svg
            .select(this.brushSelector)
            .selectAll('rect.handle-bar')
            .data([{ type: 'w' }, { type: 'e' }]);
        // create rect if not exists
        handleBars
            .enter()
            .append('rect')
            .attr('class', function (d) {
            return 'handle-bar handle-bar--' + d.type;
        });
        // update positions
        handleBars
            .attr('x', function (d) {
            if (d.type === 'w') {
                return Math.max(selection[0] + handleBarXDiff, self.maxSelectionRange[0] - handleXDiff + handleBarXDiff);
            }
            else if (d.type === 'e') {
                return Math.min(selection[1] + handleBarXDiff, self.maxSelectionRange[1] + handleXDiff + handleBarXDiff);
            }
        })
            .attr('y', handleYBarDiff)
            .attr('width', handleBarWidth)
            .attr('height', handleBarHeight)
            .attr('cursor', 'ew-resize');
        // Update slider selected area
        if (zoombarType === ZoomBarTypes.SLIDER_VIEW) {
            this.updateSliderSelectedArea(selection);
        }
        this.updateClipPath(svg, this.clipId, selection[0], 0, selection[1] - selection[0], handleHeight);
    };
    ZoomBar.prototype.updateSliderSelectedArea = function (selection) {
        var zoombarType = Tools.getProperty(this.getOptions(), 'zoomBar', AxisPositions.TOP, 'type');
        var zoombarHeight = Configuration.zoomBar.height[zoombarType];
        var width = DOMUtils.getSVGElementSize(this.parent, {
            useAttrs: true,
        }).width;
        // get axes margins
        var axesLeftMargin = 0;
        var axesMargins = this.model.get('axesMargins');
        if (axesMargins && axesMargins.left) {
            axesLeftMargin = axesMargins.left;
        }
        var svg = this.getContainerSVG();
        var container = svg.select('svg.zoom-container');
        // Draw zoombar background line
        DOMUtils.appendOrSelect(container, 'rect.zoom-slider-selected-area')
            .attr('x', selection[0])
            .attr('y', zoombarHeight / 2 - 1)
            .attr('width', selection[1] - selection[0])
            .attr('height', 2);
    };
    ZoomBar.prototype.renderZoomBarArea = function (container, querySelector, data, clipId) {
        var cartesianScales = this.services.cartesianScales;
        var mainXAxisPosition = cartesianScales.getMainXAxisPosition();
        var mainYAxisPosition = cartesianScales.getMainYAxisPosition();
        var mainXScaleType = cartesianScales.getMainXScaleType();
        var mainYScaleType = cartesianScales.getMainYScaleType();
        var accessorFunction = function (scale, scaleType, axisPosition) {
            return function (d, i) {
                return cartesianScales.getValueFromScale(scale, scaleType, axisPosition, d, i);
            };
        };
        var xAccessor = accessorFunction(this.xScale, mainXScaleType, mainXAxisPosition);
        var yAccessor = accessorFunction(this.yScale, mainYScaleType, mainYAxisPosition);
        var zoombarType = Tools.getProperty(this.getOptions(), 'zoomBar', AxisPositions.TOP, 'type');
        var zoombarHeight = Configuration.zoomBar.height[zoombarType];
        var areaGenerator = area()
            .x(function (d, i) { return xAccessor(d, i); })
            .y0(zoombarHeight)
            .y1(function (d, i) { return zoombarHeight - yAccessor(d, i); });
        var areaGraph = DOMUtils.appendOrSelect(container, querySelector)
            .datum(data)
            .attr('d', areaGenerator);
        if (clipId) {
            areaGraph.attr('clip-path', "url(#" + clipId + ")");
        }
    };
    ZoomBar.prototype.updateClipPath = function (svg, clipId, x, y, width, height) {
        var zoomBarClipPath = DOMUtils.appendOrSelect(svg, "clipPath").attr('id', clipId);
        DOMUtils.appendOrSelect(zoomBarClipPath, 'rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', height);
    };
    // assume the domains in data are already sorted
    ZoomBar.prototype.compensateDataForDefaultDomain = function (data, defaultDomain) {
        if (!data || data.length < 2) {
            return;
        }
        var zoomBarData = Tools.clone(data);
        var domainIdentifier = this.services.cartesianScales.getDomainIdentifier();
        var rangeIdentifier = this.services.cartesianScales.getRangeIdentifier();
        // if min domain is extended
        if (Number(defaultDomain[0]) < Number(zoomBarData[0][domainIdentifier])) {
            var newDatum = {};
            newDatum[domainIdentifier] = defaultDomain[0];
            newDatum[rangeIdentifier] = 0;
            zoomBarData.unshift(newDatum);
        }
        // if max domain is extended
        if (Number(defaultDomain[1]) >
            Number(zoomBarData[zoomBarData.length - 1][domainIdentifier])) {
            var newDatum = {};
            newDatum[domainIdentifier] = defaultDomain[1];
            newDatum[rangeIdentifier] = 0;
            zoomBarData.push(newDatum);
        }
        return zoomBarData;
    };
    ZoomBar.prototype.renderZoomBarBaseline = function (container, startX, endX, skeletonClass) {
        if (skeletonClass === void 0) { skeletonClass = false; }
        var zoombarType = Tools.getProperty(this.model.getOptions(), 'zoomBar', AxisPositions.TOP, 'type');
        var zoombarHeight = Configuration.zoomBar.height[zoombarType];
        var baselineGenerator = line()([
            [startX, zoombarHeight],
            [endX, zoombarHeight],
        ]);
        DOMUtils.appendOrSelect(container, 'path.zoom-bg-baseline')
            .attr('d', baselineGenerator)
            .classed('zoom-bg-baseline-skeleton', skeletonClass);
    };
    ZoomBar.prototype.renderSkeleton = function (container, startX, endX) {
        // need to clear current zoom bar area
        this.renderZoomBarArea(container, 'path.zoom-graph-area-unselected', [], null);
        this.renderZoomBarArea(container, 'path.zoom-graph-area', [], this.clipId);
        // remove brush listener
        this.brush.on('start brush end', null);
        // clear d3 brush
        DOMUtils.appendOrSelect(this.getContainerSVG(), this.brushSelector).html(null);
        // re-render baseline because no axis labels in skeleton so the baseline length needs to change
        var zoombarType = Tools.getProperty(this.getOptions(), 'zoomBar', AxisPositions.TOP, 'type');
        if (zoombarType === ZoomBarTypes.GRAPH_VIEW) {
            this.renderZoomBarBaseline(container, startX, endX, true);
        }
    };
    ZoomBar.prototype.destroy = function () {
        this.brush.on('start brush end', null); // remove event listener
        this.services.events.removeEventListener(Events.ZoomBar.UPDATE, this.render.bind(this));
    };
    return ZoomBar;
}(Component));
export { ZoomBar };
//# sourceMappingURL=../../../src/components/axes/zoom-bar.js.map