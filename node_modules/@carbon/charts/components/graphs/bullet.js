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
import { Events, Roles, ColorClassNameTypes } from '../../interfaces';
import { Tools } from '../../tools';
import { DOMUtils } from '../../services';
// D3 Imports
import { select } from 'd3-selection';
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'bullet';
        _this.handleLegendOnHover = function (event) {
            var hoveredElement = event.detail.hoveredElement;
            var groupMapsTo = _this.getOptions().data.groupMapsTo;
            _this.parent
                .selectAll('path.bar')
                .transition(_this.services.transitions.getTransition('legend-hover-simple-bar'))
                .attr('opacity', function (d) {
                return d[groupMapsTo] !== hoveredElement.datum()['name'] ? 0.3 : 1;
            });
        };
        _this.handleLegendMouseOut = function (event) {
            _this.parent
                .selectAll('path.bar')
                .transition(_this.services.transitions.getTransition('legend-mouseout-simple-bar'))
                .attr('opacity', 1);
        };
        return _this;
    }
    Bullet.prototype.init = function () {
        var eventsFragment = this.services.events;
        // Highlight correct circle on legend item hovers
        eventsFragment.addEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        // Un-highlight circles on legend item mouseouts
        eventsFragment.addEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    Bullet.prototype.render = function (animate) {
        var _this = this;
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        // Grab container SVG
        var svg = this.getContainerSVG({ withinChartClip: true });
        var data = this.model.getDisplayData(this.configs.groups);
        var rangeScale = this.services.cartesianScales.getRangeScale();
        var rangeIdentifier = this.services.cartesianScales.getRangeIdentifier();
        var _a = rangeScale.range(), rangeScaleStart = _a[0], rangeScaleEnd = _a[1];
        var _b = rangeScale.domain(), rangeScaleDomainMin = _b[0], rangeScaleDomainMax = _b[1];
        var renderRangeBoxes = function () {
            var rangeBoxData = [];
            data.forEach(function (datum) {
                if (datum.ranges) {
                    datum.ranges.forEach(function (range, i) {
                        if (range !== null &&
                            range !== undefined &&
                            range < rangeScaleDomainMax) {
                            rangeBoxData.push({
                                datum: datum,
                                value: range,
                                order: i + 1,
                            });
                        }
                    });
                }
                else {
                    rangeBoxData.push({
                        datum: datum,
                        order: 1,
                    });
                }
            });
            // Update data on all lines
            var rangeBoxes = DOMUtils.appendOrSelect(svg, 'g.range-boxes')
                .selectAll('path.range-box')
                .data(rangeBoxData, function (datum) { return datum[groupMapsTo] + "-" + datum.order; });
            // Remove lines that are no longer needed
            rangeBoxes.exit().attr('opacity', 0).remove();
            // Add the paths that need to be introduced
            var rangeBoxesEnter = rangeBoxes
                .enter()
                .append('path')
                .attr('opacity', 0);
            rangeBoxesEnter
                .merge(rangeBoxes)
                .attr('class', function (d) { return "range-box order-" + d.order; })
                .transition(_this.services.transitions.getTransition('bullet-range-box-update-enter', animate))
                .attr('d', function (d, i) {
                /*
                 * Orientation support for horizontal/vertical bar charts
                 * Determine coordinates needed for a vertical set of paths
                 * to draw the bars needed, and pass those coordinates down to
                 * generateSVGPathString() to decide whether it needs to flip them
                 */
                var lineHeight = 16;
                var x0, x1, y0, y1;
                if (d.order === 1) {
                    x0 =
                        _this.services.cartesianScales.getDomainValue(d.datum, i) -
                            lineHeight / 2;
                    x1 = x0 + lineHeight;
                    y0 = rangeScaleEnd - 2;
                    y1 = rangeScaleStart + 1;
                }
                else {
                    x0 =
                        _this.services.cartesianScales.getDomainValue(d.datum, i) -
                            lineHeight / 2;
                    x1 = x0 + lineHeight;
                    y0 = _this.services.cartesianScales.getRangeValue(d.value, i);
                    y1 = rangeScaleEnd;
                }
                return Tools.generateSVGPathString({ x0: x0, x1: x1, y0: y0, y1: y1 }, _this.services.cartesianScales.getOrientation());
            })
                .attr('opacity', 1);
        };
        var renderBars = function () {
            // Update data on all bars
            var bars = DOMUtils.appendOrSelect(svg, 'g.bars')
                .selectAll('path.bar')
                .data(data, function (datum) { return datum[groupMapsTo]; });
            // Remove bars that are no longer needed
            bars.exit().attr('opacity', 0).remove();
            // Add the paths that need to be introduced
            var barsEnter = bars.enter().append('path').attr('opacity', 0);
            barsEnter
                .merge(bars)
                .classed('bar', true)
                .transition(_this.services.transitions.getTransition('bullet-bar-update-enter', animate))
                .attr('class', function (d) {
                return _this.model.getColorClassName({
                    classNameTypes: [ColorClassNameTypes.FILL],
                    dataGroupName: d[groupMapsTo],
                    originalClassName: 'bar',
                });
            })
                .style('fill', function (d) { return _this.model.getFillColor(d[groupMapsTo]); })
                .attr('d', function (d, i) {
                /*
                 * Orientation support for horizontal/vertical bar charts
                 * Determine coordinates needed for a vertical set of paths
                 * to draw the bars needed, and pass those coordinates down to
                 * generateSVGPathString() to decide whether it needs to flip them
                 */
                var barWidth = 8;
                var x0 = _this.services.cartesianScales.getDomainValue(d, i) -
                    barWidth / 2;
                var x1 = x0 + barWidth;
                var y0 = _this.services.cartesianScales.getRangeValue(0) + 1;
                var y1 = _this.services.cartesianScales.getRangeValue(d, i);
                return Tools.generateSVGPathString({ x0: x0, x1: x1, y0: y0, y1: y1 }, _this.services.cartesianScales.getOrientation());
            })
                .attr('opacity', 1)
                // a11y
                .attr('role', Roles.GRAPHICS_SYMBOL)
                .attr('aria-roledescription', 'bar')
                .attr('aria-label', function (d) { return d.value; });
        };
        var renderTargetLines = function () {
            // Update data on all lines
            var lines = DOMUtils.appendOrSelect(svg, 'g.markers')
                .selectAll('path.marker')
                .data(data.filter(function (d) { return Tools.getProperty(d, 'marker') !== null; }), function (datum) { return datum[groupMapsTo]; });
            // Remove lines that are no longer needed
            lines.exit().attr('opacity', 0).remove();
            // Add the paths that need to be introduced
            var linesEnter = lines.enter().append('path').attr('opacity', 0);
            linesEnter
                .merge(lines)
                .classed('marker', true)
                .transition(_this.services.transitions.getTransition('bullet-marker-update-enter', animate))
                .attr('d', function (d, i) {
                /*
                 * Orientation support for horizontal/vertical bar charts
                 * Determine coordinates needed for a vertical set of paths
                 * to draw the bars needed, and pass those coordinates down to
                 * generateSVGPathString() to decide whether it needs to flip them
                 */
                var lineHeight = 24;
                var x0 = _this.services.cartesianScales.getDomainValue(d, i) -
                    lineHeight / 2;
                var x1 = x0 + lineHeight;
                var y0 = _this.services.cartesianScales.getRangeValue(d.marker, i);
                var y1 = y0;
                return Tools.generateSVGPathString({ x0: x0, x1: x1, y0: y0, y1: y1 }, _this.services.cartesianScales.getOrientation());
            })
                .attr('opacity', 1);
        };
        var renderTargetQuartiles = function () {
            var quartilesData = [];
            data.filter(function (d) { return Tools.getProperty(d, 'marker') !== null; }).forEach(function (d) {
                var value = d.marker;
                var barValue = d[rangeIdentifier];
                quartilesData = quartilesData.concat([
                    { datum: d, value: value * 0.25, barValue: barValue },
                    { datum: d, value: value * 0.5, barValue: barValue },
                    { datum: d, value: value * 0.75, barValue: barValue },
                ]);
            });
            // Update data on all lines
            var lines = DOMUtils.appendOrSelect(svg, 'g.quartiles')
                .selectAll('path.quartile')
                .data(quartilesData, function (datum) { return datum[groupMapsTo]; });
            // Remove lines that are no longer needed
            lines.exit().attr('opacity', 0).remove();
            // Add the paths that need to be introduced
            var linesEnter = lines.enter().append('path').attr('opacity', 0);
            linesEnter
                .merge(lines)
                .attr('class', function (d) {
                return "quartile " + (d.value <= d.barValue ? 'over-bar' : '');
            })
                .transition(_this.services.transitions.getTransition('bullet-quartile-update-enter', animate))
                .attr('d', function (_a, i) {
                var d = _a.datum, value = _a.value;
                /*
                 * Orientation support for horizontal/vertical bar charts
                 * Determine coordinates needed for a vertical set of paths
                 * to draw the bars needed, and pass those coordinates down to
                 * generateSVGPathString() to decide whether it needs to flip them
                 */
                var lineHeight = 4;
                // if it lines up with a performance area border
                // make the line taller
                if (d.ranges && d.ranges.indexOf(value) !== -1) {
                    lineHeight = 8;
                }
                var x0 = _this.services.cartesianScales.getDomainValue(d, i) -
                    lineHeight / 2;
                var x1 = x0 + lineHeight;
                var y0 = _this.services.cartesianScales.getRangeValue(value, i);
                var y1 = y0;
                return Tools.generateSVGPathString({ x0: x0, x1: x1, y0: y0, y1: y1 }, _this.services.cartesianScales.getOrientation());
            })
                .attr('opacity', 1);
        };
        renderRangeBoxes();
        renderBars();
        renderTargetLines();
        renderTargetQuartiles();
        // Add event listeners to elements drawn
        this.addEventListeners();
    };
    Bullet.prototype.getMatchingRangeIndexForDatapoint = function (datum) {
        var matchingRangeIndex;
        for (var i = datum.ranges.length - 1; i > 0; i--) {
            var range = datum.ranges[i];
            if (datum.value >= range) {
                matchingRangeIndex = i;
                return matchingRangeIndex;
            }
        }
        return 0;
    };
    Bullet.prototype.addEventListeners = function () {
        var self = this;
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var rangeIdentifier = this.services.cartesianScales.getRangeIdentifier();
        this.parent
            .selectAll('path.bar')
            .on('mouseover', function (datum) {
            var hoveredElement = select(this);
            hoveredElement.classed('hovered', true);
            hoveredElement.transition(self.services.transitions.getTransition('graph_element_mouseover_fill_update'));
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Bar.BAR_MOUSEOVER, {
                element: hoveredElement,
                datum: datum,
            });
            var performanceAreaTitles = Tools.getProperty(options, 'bullet', 'performanceAreaTitles');
            var matchingRangeIndex = self.getMatchingRangeIndexForDatapoint(datum);
            self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                hoveredElement: hoveredElement,
                items: [
                    {
                        label: options.tooltip.groupLabel || 'Group',
                        value: datum[groupMapsTo],
                        class: self.model.getColorClassName({
                            classNameTypes: [ColorClassNameTypes.TOOLTIP],
                            dataGroupName: datum[groupMapsTo],
                        }),
                    },
                    {
                        label: 'Value',
                        value: datum[rangeIdentifier],
                    },
                    {
                        label: 'Target',
                        value: datum.marker,
                    },
                    {
                        label: 'Percentage',
                        value: Math.floor((datum[rangeIdentifier] / datum.marker) * 100) + "%",
                    },
                    {
                        label: 'Performance',
                        value: performanceAreaTitles[matchingRangeIndex],
                    },
                ],
            });
        })
            .on('mousemove', function (datum) {
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Bar.BAR_MOUSEMOVE, {
                element: select(this),
                datum: datum,
            });
            self.services.events.dispatchEvent(Events.Tooltip.MOVE);
        })
            .on('click', function (datum) {
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Bar.BAR_CLICK, {
                element: select(this),
                datum: datum,
            });
        })
            .on('mouseout', function (datum) {
            var hoveredElement = select(this);
            hoveredElement.classed('hovered', false);
            hoveredElement.transition(self.services.transitions.getTransition('graph_element_mouseout_fill_update'));
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Bar.BAR_MOUSEOUT, {
                element: hoveredElement,
                datum: datum,
            });
            // Hide tooltip
            self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
                hoveredElement: hoveredElement,
            });
        });
    };
    Bullet.prototype.destroy = function () {
        // Remove event listeners
        this.parent
            .selectAll('path.bar')
            .on('mouseover', null)
            .on('mousemove', null)
            .on('mouseout', null);
        // Remove legend listeners
        var eventsFragment = this.services.events;
        eventsFragment.removeEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        eventsFragment.removeEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    return Bullet;
}(Component));
export { Bullet };
//# sourceMappingURL=../../../src/components/graphs/bullet.js.map