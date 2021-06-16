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
import { Bar } from './bar';
import { Events, Roles, ColorClassNameTypes, CartesianOrientations, } from '../../interfaces';
import { Tools } from '../../tools';
// D3 Imports
import { select } from 'd3-selection';
var SimpleBar = /** @class */ (function (_super) {
    __extends(SimpleBar, _super);
    function SimpleBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'simple-bar';
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
    SimpleBar.prototype.init = function () {
        var eventsFragment = this.services.events;
        // Highlight correct circle on legend item hovers
        eventsFragment.addEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        // Un-highlight circles on legend item mouseouts
        eventsFragment.addEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    SimpleBar.prototype.render = function (animate) {
        var _this = this;
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        // Grab container SVG
        var svg = this.getContainerSVG({ withinChartClip: true });
        var data = this.model.getDisplayData(this.configs.groups);
        var orientation = this.services.cartesianScales.getOrientation();
        // Update data on all bars
        var bars = svg
            .selectAll('path.bar')
            .data(data, function (datum) { return datum[groupMapsTo]; });
        // Remove bars that are no longer needed
        bars.exit().attr('opacity', 0).remove();
        // Add the paths that need to be introduced
        var barsEnter = bars.enter().append('path').attr('opacity', 0);
        barsEnter
            .merge(bars)
            .classed('bar', true)
            .attr('width', this.getBarWidth.bind(this))
            .transition(this.services.transitions.getTransition('bar-update-enter', animate))
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
            var rangeIdentifier = _this.services.cartesianScales.getRangeIdentifier();
            var barWidth = _this.getBarWidth();
            var value = d[rangeIdentifier];
            var x0 = _this.services.cartesianScales.getDomainValue(d, i) -
                barWidth / 2;
            var x1 = x0 + barWidth;
            var y0, y1;
            if (Array.isArray(value) && value.length === 2) {
                y0 = _this.services.cartesianScales.getRangeValue(value[0]);
                y1 = _this.services.cartesianScales.getRangeValue(value[1], i);
            }
            else {
                y0 = _this.services.cartesianScales.getRangeValue(0);
                y1 = _this.services.cartesianScales.getRangeValue(d, i);
            }
            var difference = Math.abs(y1 - y0);
            // Set a min-2px size for the bar
            if (difference !== 0 && difference < 2) {
                if ((value > 0 &&
                    orientation === CartesianOrientations.VERTICAL) ||
                    (value < 0 &&
                        orientation === CartesianOrientations.HORIZONTAL)) {
                    y1 = y0 - 2;
                }
                else {
                    y1 = y0 + 2;
                }
            }
            // don't show if part of bar is out of zoom domain
            if (_this.isOutsideZoomedDomain(x0, x1)) {
                return;
            }
            return Tools.generateSVGPathString({ x0: x0, x1: x1, y0: y0, y1: y1 }, orientation);
        })
            .attr('opacity', 1)
            // a11y
            .attr('role', Roles.GRAPHICS_SYMBOL)
            .attr('aria-roledescription', 'bar')
            .attr('aria-label', function (d) { return d.value; });
        // Add event listeners to elements drawn
        this.addEventListeners();
    };
    SimpleBar.prototype.addEventListeners = function () {
        var self = this;
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
            self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                hoveredElement: hoveredElement,
                data: [datum],
            });
        })
            .on('mousemove', function (datum) {
            var hoveredElement = select(this);
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
    SimpleBar.prototype.destroy = function () {
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
    return SimpleBar;
}(Bar));
export { SimpleBar };
//# sourceMappingURL=../../../src/components/graphs/bar-simple.js.map