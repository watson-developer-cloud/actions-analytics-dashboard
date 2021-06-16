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
import { Tools } from '../../tools';
import { CartesianOrientations, ColorClassNameTypes, Events, Roles, } from '../../interfaces';
// D3 Imports
import { map } from 'd3-collection';
import { select } from 'd3-selection';
import { scaleBand } from 'd3-scale';
var GroupedBar = /** @class */ (function (_super) {
    __extends(GroupedBar, _super);
    function GroupedBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'grouped-bar';
        _this.padding = 5;
        // Highlight elements that match the hovered legend item
        _this.handleLegendOnHover = function (event) {
            var hoveredElement = event.detail.hoveredElement;
            var groupMapsTo = _this.getOptions().data.groupMapsTo;
            _this.parent
                .selectAll('path.bar')
                .transition(_this.services.transitions.getTransition('legend-hover-bar'))
                .attr('opacity', function (d) {
                return d[groupMapsTo] !== hoveredElement.datum()['name'] ? 0.3 : 1;
            });
        };
        // Un-highlight all elements
        _this.handleLegendMouseOut = function (event) {
            _this.parent
                .selectAll('path.bar')
                .transition(_this.services.transitions.getTransition('legend-mouseout-bar'))
                .attr('opacity', 1);
        };
        return _this;
    }
    GroupedBar.prototype.init = function () {
        var eventsFragment = this.services.events;
        // Highlight correct circle on legend item hovers
        eventsFragment.addEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        // Un-highlight circles on legend item mouseouts
        eventsFragment.addEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    GroupedBar.prototype.render = function (animate) {
        var _this = this;
        // Chart options mixed with the internal configurations
        var displayData = this.model.getDisplayData(this.configs.groups);
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        // Get unique labels
        this.setGroupScale();
        // Grab container SVG
        var svg = this.getContainerSVG({ withinChartClip: true });
        var allDataLabels = map(displayData, function (datum) {
            var domainIdentifier = _this.services.cartesianScales.getDomainIdentifier(datum);
            return datum[domainIdentifier];
        }).keys();
        // Update data on bar groups
        var barGroups = svg
            .selectAll('g.bars')
            .data(allDataLabels, function (label) { return label; });
        // Remove dot groups that need to be removed
        barGroups.exit().attr('opacity', 0).remove();
        // Add the bar groups that need to be introduced
        var barGroupsEnter = barGroups
            .enter()
            .append('g')
            .classed('bars', true)
            .attr('role', Roles.GROUP)
            .attr('data-name', 'bars');
        // Update data on all bars
        var allBarGroups = barGroupsEnter.merge(barGroups);
        allBarGroups
            // Transition
            .transition(this.services.transitions.getTransition('bar-group-update-enter', animate))
            .attr('transform', function (label, i) {
            var scaleValue = _this.services.cartesianScales.getDomainValue(label, i);
            var translateBy = scaleValue - _this.getGroupWidth() / 2;
            // const translateBy = scaleValue - this.getGroupWidth(null) / 2 + this.getBarWidth(null);
            if (_this.services.cartesianScales.getOrientation() ===
                CartesianOrientations.VERTICAL) {
                return "translate(" + translateBy + ", 0)";
            }
            else {
                // translate in the y direction for horizontal groups
                return "translate(0, " + translateBy + ")";
            }
        });
        var bars = allBarGroups.selectAll('path.bar').data(function (label) { return _this.getDataCorrespondingToLabel(label); }, function (d) { return d[groupMapsTo]; });
        // Remove bars that are no longer needed
        bars.exit().attr('opacity', 0).remove();
        // Add the bars that need to be introduced
        var barsEnter = bars.enter().append('path').attr('opacity', 0);
        // code for vertical grouped bar charts
        barsEnter
            .merge(bars)
            .classed('bar', true)
            .transition(this.services.transitions.getTransition('bar-update-enter', animate))
            .attr('class', function (d) {
            return _this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.FILL],
                dataGroupName: d[groupMapsTo],
                originalClassName: 'bar',
            });
        })
            .style('fill', function (d) { return _this.model.getFillColor(d[groupMapsTo]); })
            .attr('d', function (d) {
            /*
             * Orientation support for horizontal/vertical bar charts
             * Determine coordinates needed for a vertical set of paths
             * to draw the bars needed, and pass those coordinates down to
             * generateSVGPathString() to decide whether it needs to flip them
             */
            var startX = _this.groupScale(d[groupMapsTo]);
            var barWidth = _this.getBarWidth();
            var x0 = startX;
            var x1 = startX + barWidth;
            var rangeAxis = _this.services.cartesianScales.getRangeAxisPosition({ datum: d });
            var y0 = _this.services.cartesianScales.getValueThroughAxisPosition(rangeAxis, 0);
            var y1 = _this.services.cartesianScales.getRangeValue(d);
            // don't show if part of bar is out of zoom domain
            if (_this.isOutsideZoomedDomain(x0, x1)) {
                return;
            }
            return Tools.generateSVGPathString({ x0: x0, x1: x1, y0: y0, y1: y1 }, _this.services.cartesianScales.getOrientation());
        })
            .attr('opacity', 1)
            // a11y
            .attr('role', Roles.GRAPHICS_SYMBOL)
            .attr('aria-roledescription', 'bar')
            .attr('aria-label', function (d) { return d.value; });
        // Add event listeners to elements drawn
        this.addEventListeners();
    };
    GroupedBar.prototype.addEventListeners = function () {
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
            // Show tooltip
            self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                hoveredElement: hoveredElement,
                data: [datum],
            });
        })
            .on('mousemove', function (datum) {
            var hoveredElement = select(this);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Bar.BAR_MOUSEMOVE, {
                element: hoveredElement,
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
    GroupedBar.prototype.destroy = function () {
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
    GroupedBar.prototype.getDataCorrespondingToLabel = function (label) {
        var _this = this;
        var displayData = this.model.getDisplayData(this.configs.groups);
        return displayData.filter(function (datum) {
            var domainIdentifier = _this.services.cartesianScales.getDomainIdentifier(datum);
            return datum[domainIdentifier] === label;
        });
    };
    GroupedBar.prototype.getGroupWidth = function () {
        var activeData = this.model.getGroupedData(this.configs.groups);
        var totalGroupPadding = this.getTotalGroupPadding();
        return this.getBarWidth() * activeData.length + totalGroupPadding;
    };
    GroupedBar.prototype.getTotalGroupPadding = function () {
        var activeData = this.model.getGroupedData(this.configs.groups);
        if (activeData.length === 1) {
            return 0;
        }
        var domainScale = this.services.cartesianScales.getDomainScale();
        var padding = Math.min(5, 5 * (domainScale.step() / 70));
        return padding * (activeData.length - 1);
    };
    // Gets the correct width for bars based on options & configurations
    GroupedBar.prototype.getBarWidth = function () {
        var options = this.getOptions();
        var providedWidth = Tools.getProperty(options, 'bars', 'width');
        var providedMaxWidth = Tools.getProperty(options, 'bars', 'maxWidth');
        // If there's a provided width, compare with maxWidth and
        // Determine which to return
        if (providedWidth !== null) {
            if (providedMaxWidth === null ||
                providedWidth <= providedMaxWidth) {
                return providedWidth;
            }
        }
        var activeData = this.model.getGroupedData(this.configs.groups);
        var numOfActiveDataGroups = activeData.length;
        var totalGroupPadding = this.getTotalGroupPadding();
        var domainScale = this.services.cartesianScales.getDomainScale();
        return Math.min(providedMaxWidth, (domainScale.step() - totalGroupPadding) / numOfActiveDataGroups);
    };
    GroupedBar.prototype.setGroupScale = function () {
        var activeData = this.model.getActiveDataGroupNames(this.configs.groups);
        this.groupScale = scaleBand()
            .domain(activeData)
            .rangeRound([0, this.getGroupWidth()]);
    };
    return GroupedBar;
}(Bar));
export { GroupedBar };
//# sourceMappingURL=../../../src/components/graphs/bar-grouped.js.map