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
import { CartesianOrientations, ColorClassNameTypes, Events, Roles, } from '../../interfaces';
import { Tools } from '../../tools';
import * as Configuration from '../../configuration';
// D3 Imports
import { select } from 'd3-selection';
var Boxplot = /** @class */ (function (_super) {
    __extends(Boxplot, _super);
    function Boxplot() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'boxplot';
        return _this;
    }
    Boxplot.prototype.render = function (animate) {
        var _this = this;
        // Grab container SVG
        var svg = this.getContainerSVG({ withinChartClip: true });
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var dataGroupNames = this.model.getDataGroupNames();
        /*
         * Get graphable dimensions
         */
        var mainXScale = this.services.cartesianScales.getMainXScale();
        var mainYScale = this.services.cartesianScales.getMainYScale();
        var _a = mainXScale.range(), xScaleStart = _a[0], xScaleEnd = _a[1];
        var _b = mainYScale.range(), yScaleEnd = _b[0], yScaleStart = _b[1];
        var width = xScaleEnd - xScaleStart;
        var height = yScaleEnd - yScaleStart;
        if (width === 0) {
            return;
        }
        // Get orientation of the chart
        var cartesianScales = this.services.cartesianScales;
        var orientation = cartesianScales.getOrientation();
        var isInVerticalOrientation = orientation === CartesianOrientations.VERTICAL;
        var _c = Tools.flipDomainAndRangeBasedOnOrientation(function (d, i) { return _this.services.cartesianScales.getDomainValue(d, i); }, function (d, i) { return _this.services.cartesianScales.getRangeValue(d, i); }, orientation), getXValue = _c[0], getYValue = _c[1];
        var gridSize = Math.floor((isInVerticalOrientation ? width : height) / dataGroupNames.length);
        var boxWidth = Math.min(gridSize / 2, 16);
        var boxplotData = this.model.getBoxplotData();
        /*
         * update or initialize all box groups
         */
        var boxGroups = svg.selectAll('.box-group').data(boxplotData);
        boxGroups.exit().remove();
        var boxGroupsEnter = boxGroups
            .enter()
            .append('g')
            .attr('class', 'box-group');
        var allBoxGroups = boxGroups.merge(boxGroupsEnter);
        /*
         * draw the 2 range lines for each box
         */
        // Start range line
        boxGroupsEnter
            .append('path')
            .merge(boxGroups.select('path.vertical-line.start'))
            .attr('class', function () {
            return _this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.STROKE],
                originalClassName: 'vertical-line start',
            });
        })
            .attr('stroke-width', Configuration.boxplot.strokeWidth.default)
            .attr('fill', 'none')
            .transition(this.services.transitions.getTransition('boxplot-update-verticalstartline', animate))
            .attr('d', function (d) {
            var x0 = cartesianScales.getDomainValue(d[groupMapsTo]);
            var x1 = x0;
            var y0 = cartesianScales.getRangeValue(d.whiskers.min);
            var y1 = cartesianScales.getRangeValue(d.quartiles.q_25);
            return Tools.generateSVGPathString({ x0: x0, x1: x1, y0: y0, y1: y1 }, orientation);
        });
        // End range line
        boxGroupsEnter
            .append('path')
            .merge(boxGroups.select('path.vertical-line.end'))
            .attr('class', function () {
            return _this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.STROKE],
                originalClassName: 'vertical-line end',
            });
        })
            .attr('stroke-width', Configuration.boxplot.strokeWidth.default)
            .attr('fill', 'none')
            .transition(this.services.transitions.getTransition('boxplot-update-verticalendline', animate))
            .attr('d', function (d) {
            var x0 = cartesianScales.getDomainValue(d[groupMapsTo]);
            var x1 = x0;
            var y0 = cartesianScales.getRangeValue(d.whiskers.max);
            var y1 = cartesianScales.getRangeValue(d.quartiles.q_75);
            return Tools.generateSVGPathString({ x0: x0, x1: x1, y0: y0, y1: y1 }, orientation);
        });
        /*
         * Draw out and update the boxes
         */
        boxGroupsEnter
            .append('path')
            .merge(boxGroups.select('path.box'))
            .attr('class', function () {
            return _this.model.getColorClassName({
                classNameTypes: [
                    ColorClassNameTypes.FILL,
                    ColorClassNameTypes.STROKE,
                ],
                originalClassName: 'box',
            });
        })
            .attr('fill-opacity', Configuration.boxplot.box.opacity.default)
            .attr('stroke-width', Configuration.boxplot.strokeWidth.default)
            .attr('role', Roles.GRAPHICS_SYMBOL)
            .attr('aria-roledescription', 'box')
            .transition(this.services.transitions.getTransition('boxplot-update-quartiles', animate))
            .attr('d', function (d) {
            var x0 = cartesianScales.getDomainValue(d[groupMapsTo]) -
                boxWidth / 2;
            var x1 = x0 + boxWidth;
            var y0 = cartesianScales.getRangeValue(Math[isInVerticalOrientation ? 'max' : 'min'](d.quartiles.q_75, d.quartiles.q_25));
            var y1 = y0 +
                Math.abs(cartesianScales.getRangeValue(d.quartiles.q_75) -
                    cartesianScales.getRangeValue(d.quartiles.q_25));
            return Tools.generateSVGPathString({ x0: x0, x1: x1, y0: y0, y1: y1 }, orientation);
        });
        /*
         * Draw out and update highlight areas
         */
        boxGroupsEnter
            .append('path')
            .merge(boxGroups.select('path.highlight-area'))
            .attr('class', 'highlight-area')
            .attr('opacity', 0)
            .attr('d', function (d) {
            var x0 = cartesianScales.getDomainValue(d[groupMapsTo]) -
                boxWidth / 2;
            var x1 = x0 + boxWidth;
            var y0 = cartesianScales.getRangeValue(d.whiskers.min);
            var y1 = cartesianScales.getRangeValue(d.whiskers.max);
            return Tools.generateSVGPathString({ x0: x0, x1: x1, y0: y0, y1: y1 }, orientation);
        });
        /*
         * Draw out and update the starting whisker
         */
        boxGroupsEnter
            .append('path')
            .merge(boxGroups.select('path.whisker.start'))
            .attr('class', function () {
            return _this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.STROKE],
                originalClassName: 'whisker start',
            });
        })
            .attr('stroke-width', Configuration.boxplot.strokeWidth.thicker)
            .attr('fill', 'none')
            .transition(this.services.transitions.getTransition('boxplot-update-startingwhisker', animate))
            .attr('d', function (d) {
            var x0 = cartesianScales.getDomainValue(d[groupMapsTo]) -
                boxWidth / 4;
            var x1 = x0 + boxWidth / 2;
            var y0 = cartesianScales.getRangeValue(d.whiskers.min);
            var y1 = cartesianScales.getRangeValue(d.whiskers.min);
            return Tools.generateSVGPathString({ x0: x0, x1: x1, y0: y0, y1: y1 }, orientation);
        });
        /*
         * Draw out and update the median line
         */
        boxGroupsEnter
            .append('path')
            .merge(boxGroups.select('path.median'))
            .attr('fill', 'none')
            .attr('class', function () {
            return _this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.STROKE],
                originalClassName: 'median',
            });
        })
            .attr('stroke-width', 2)
            .transition(this.services.transitions.getTransition('boxplot-update-median', animate))
            .attr('d', function (d) {
            var x0 = cartesianScales.getDomainValue(d[groupMapsTo]) -
                boxWidth / 2;
            var x1 = x0 + boxWidth;
            var y0 = cartesianScales.getRangeValue(d.quartiles.q_50);
            var y1 = y0;
            return Tools.generateSVGPathString({ x0: x0, x1: x1, y0: y0, y1: y1 }, orientation);
        });
        /*
         * Draw out and update the ending whisker
         */
        boxGroupsEnter
            .append('path')
            .merge(boxGroups.select('path.whisker.end'))
            .attr('class', function () {
            return _this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.STROKE],
                originalClassName: 'whisker end',
            });
        })
            .attr('stroke-width', Configuration.boxplot.strokeWidth.thicker)
            .attr('fill', 'none')
            .transition(this.services.transitions.getTransition('boxplot-update-endingwhisker', animate))
            .attr('d', function (d) {
            var x0 = cartesianScales.getDomainValue(d[groupMapsTo]) -
                boxWidth / 4;
            var x1 = x0 + boxWidth / 2;
            var y0 = cartesianScales.getRangeValue(d.whiskers.max);
            var y1 = cartesianScales.getRangeValue(d.whiskers.max);
            return Tools.generateSVGPathString({ x0: x0, x1: x1, y0: y0, y1: y1 }, orientation);
        });
        /*
         * Draw out and update the outlier circles
         */
        var circles = allBoxGroups.selectAll('circle.outlier').data(function (d) {
            return d.outliers.map(function (outlier) {
                var _a;
                return _a = {
                        min: d.whiskers.min,
                        max: d.whiskers.max
                    },
                    _a[groupMapsTo] = d[groupMapsTo],
                    _a.value = outlier,
                    _a;
            });
        });
        circles.exit().remove();
        var circlesEnter = circles.enter().append('circle');
        circles
            .merge(circlesEnter)
            .attr('r', Configuration.boxplot.circle.radius)
            .attr('class', function () {
            return _this.model.getColorClassName({
                classNameTypes: [
                    ColorClassNameTypes.FILL,
                    ColorClassNameTypes.STROKE,
                ],
                originalClassName: 'outlier',
            });
        })
            .attr('fill-opacity', Configuration.boxplot.circle.opacity.default)
            .attr('cx', getXValue)
            .transition(this.services.transitions.getTransition('boxplot-update-circles', animate))
            .attr('cy', getYValue);
        this.addBoxEventListeners();
        this.addCircleEventListeners();
    };
    Boxplot.prototype.addBoxEventListeners = function () {
        var self = this;
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        this.parent
            .selectAll('path.highlight-area')
            .on('mouseover', function (datum) {
            var hoveredElement = select(this);
            var parentElement = select(this.parentNode);
            parentElement
                .select('path.box')
                .classed('hovered', true)
                .attr('fill-opacity', Configuration.boxplot.box.opacity.hovered);
            // Show tooltip for single datapoint
            self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                hoveredElement: hoveredElement,
                items: [
                    {
                        label: options.tooltip.groupLabel,
                        value: datum[groupMapsTo],
                        class: self.model.getColorClassName({
                            classNameTypes: [ColorClassNameTypes.TOOLTIP],
                        }),
                    },
                    {
                        label: 'Minimum',
                        value: datum.whiskers.min,
                    },
                    {
                        label: 'Q1',
                        value: datum.quartiles.q_25,
                    },
                    {
                        label: 'Median',
                        value: datum.quartiles.q_50,
                    },
                    {
                        label: 'Q3',
                        value: datum.quartiles.q_75,
                    },
                    {
                        label: 'Maximum',
                        value: datum.whiskers.max,
                    },
                    {
                        label: 'IQR',
                        value: datum.quartiles.q_75 - datum.quartiles.q_25,
                    },
                ],
            });
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Boxplot.BOX_MOUSEOVER, {
                element: hoveredElement,
                datum: datum,
            });
        })
            .on('mousemove', function (datum) {
            var hoveredElement = select(this);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Boxplot.BOX_MOUSEMOVE, {
                element: hoveredElement,
                datum: datum,
            });
            self.services.events.dispatchEvent(Events.Tooltip.MOVE);
        })
            .on('click', function (datum) {
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Boxplot.BOX_CLICK, {
                element: select(this),
                datum: datum,
            });
        })
            .on('mouseout', function (datum) {
            var hoveredElement = select(this);
            var parentElement = select(this.parentNode);
            parentElement
                .select('path.box')
                .classed('hovered', false)
                .attr('fill-opacity', Configuration.boxplot.box.opacity.default);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Boxplot.BOX_MOUSEOUT, {
                element: hoveredElement,
                datum: datum,
            });
            // Hide tooltip
            self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
                hoveredElement: hoveredElement,
            });
        });
    };
    Boxplot.prototype.addCircleEventListeners = function () {
        var self = this;
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var rangeIdentifier = this.services.cartesianScales.getRangeIdentifier();
        this.parent
            .selectAll('circle')
            .on('mouseover', function (datum) {
            var hoveredElement = select(this);
            hoveredElement
                .classed('hovered', true)
                .attr('fill-opacity', Configuration.boxplot.circle.opacity.hovered)
                .classed('unfilled', false);
            // Show tooltip for single datapoint
            self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                hoveredElement: hoveredElement,
                items: [
                    {
                        label: options.tooltip.groupLabel,
                        value: datum[groupMapsTo],
                        class: self.model.getColorClassName({
                            classNameTypes: [ColorClassNameTypes.TOOLTIP],
                        }),
                    },
                    {
                        label: 'Outlier',
                        value: datum[rangeIdentifier],
                    },
                ],
            });
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Boxplot.OUTLIER_MOUSEOVER, {
                element: hoveredElement,
                datum: datum,
            });
        })
            .on('mousemove', function (datum) {
            var hoveredElement = select(this);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Boxplot.OUTLIER_MOUSEMOVE, {
                element: hoveredElement,
                datum: datum,
            });
            self.services.events.dispatchEvent(Events.Tooltip.MOVE);
        })
            .on('click', function (datum) {
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Boxplot.OUTLIER_CLICK, {
                element: select(this),
                datum: datum,
            });
        })
            .on('mouseout', function (datum) {
            var hoveredElement = select(this);
            hoveredElement
                .classed('hovered', false)
                .attr('fill-opacity', Configuration.boxplot.circle.opacity.default);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Boxplot.OUTLIER_MOUSEOUT, {
                element: hoveredElement,
                datum: datum,
            });
            // Hide tooltip
            self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
                hoveredElement: hoveredElement,
            });
        });
    };
    return Boxplot;
}(Component));
export { Boxplot };
//# sourceMappingURL=../../../src/components/graphs/boxplot.js.map