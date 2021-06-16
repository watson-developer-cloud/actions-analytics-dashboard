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
import { Scatter } from './scatter';
import { Tools } from '../../tools';
import { CartesianOrientations, ColorClassNameTypes, Events, } from '../../interfaces';
import * as Configuration from '../../configuration';
var Lollipop = /** @class */ (function (_super) {
    __extends(Lollipop, _super);
    function Lollipop() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'lollipop';
        // on hover, bolden the line associated with the scatter
        _this.handleScatterOnHover = function (event) {
            var hoveredElement = event.detail;
            var options = _this.getOptions();
            var groupMapsTo = options.data.groupMapsTo;
            _this.parent.selectAll('line.line').attr('stroke-width', function (d) {
                if (d[groupMapsTo] !== hoveredElement.datum[groupMapsTo]) {
                    return Configuration.lines.weight.unselected;
                }
                // apply selected weight
                return Configuration.lines.weight.selected;
            });
        };
        // on mouse out remove the stroke width assertion
        _this.handleScatterOnMouseOut = function (event) {
            _this.parent
                .selectAll('line.line')
                .attr('stroke-width', Configuration.lines.weight.unselected);
        };
        _this.handleLegendOnHover = function (event) {
            var hoveredElement = event.detail.hoveredElement;
            var options = _this.getOptions();
            var groupMapsTo = options.data.groupMapsTo;
            _this.parent
                .selectAll('line.line')
                .transition(_this.services.transitions.getTransition('legend-hover-line'))
                .attr('opacity', function (d) {
                if (d[groupMapsTo] !== hoveredElement.datum()['name']) {
                    return Configuration.lines.opacity.unselected;
                }
                return Configuration.lines.opacity.selected;
            });
        };
        _this.handleLegendMouseOut = function (event) {
            _this.parent
                .selectAll('line.line')
                .transition(_this.services.transitions.getTransition('legend-mouseout-line'))
                .attr('opacity', Configuration.lines.opacity.selected);
        };
        return _this;
    }
    Lollipop.prototype.init = function () {
        var events = this.services.events;
        // Highlight correct line legend item hovers
        events.addEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        // Un-highlight lines on legend item mouseouts
        events.addEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    Lollipop.prototype.render = function (animate) {
        var _this = this;
        // Grab container SVG
        var svg = this.getContainerSVG({ withinChartClip: true });
        var options = this.model.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var cartesianScales = this.services.cartesianScales;
        var mainXScale = cartesianScales.getMainXScale();
        var mainYScale = cartesianScales.getMainYScale();
        var domainIdentifier = cartesianScales.getDomainIdentifier();
        var getDomainValue = function (d, i) { return cartesianScales.getDomainValue(d, i); };
        var getRangeValue = function (d, i) { return cartesianScales.getRangeValue(d, i); };
        var orientation = cartesianScales.getOrientation();
        var _a = Tools.flipDomainAndRangeBasedOnOrientation(getDomainValue, getRangeValue, orientation), getXValue = _a[0], getYValue = _a[1];
        // Update data on lines
        var lines = svg
            .selectAll('line.line')
            .data(this.getScatterData(), function (datum) { return datum[groupMapsTo] + "-" + datum[domainIdentifier]; });
        // Remove lines that are no longer needed
        lines.exit().attr('opacity', 0).remove();
        // Remove lines that need to be removed
        var enteringLines = lines.enter().append('line').attr('opacity', 0);
        var allLines = enteringLines
            .merge(lines)
            .classed('line', true)
            .attr('class', function (d) {
            return _this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.STROKE],
                dataGroupName: d[groupMapsTo],
                originalClassName: 'line',
            });
        })
            .transition(this.services.transitions.getTransition('lollipop-line-update-enter', animate))
            .style('stroke', function (d) {
            return _this.model.getFillColor(d[groupMapsTo], d[domainIdentifier], d);
        })
            .attr('opacity', 1);
        if (orientation === CartesianOrientations.HORIZONTAL) {
            allLines
                .attr('y1', getYValue)
                .attr('y2', getYValue)
                .attr('x1', mainXScale.range()[0])
                .attr('x2', function (d, i) { return getXValue(d, i) - options.points.radius; });
        }
        else {
            allLines
                .attr('x1', getXValue)
                .attr('x2', getXValue)
                .attr('y1', mainYScale.range()[0])
                .attr('y2', function (d, i) { return getYValue(d, i) + options.points.radius; });
        }
        this.addScatterPointEventListeners();
    };
    // listen for when individual datapoints are hovered
    Lollipop.prototype.addScatterPointEventListeners = function () {
        // Highlight correct line associated when hovering on a scatter point
        this.services.events.addEventListener(Events.Scatter.SCATTER_MOUSEOVER, this.handleScatterOnHover);
        // unbolden the line when not hovered on the lollipop scatter point
        this.services.events.addEventListener(Events.Scatter.SCATTER_MOUSEOUT, this.handleScatterOnMouseOut);
    };
    Lollipop.prototype.destroy = function () {
        // Remove event listeners
        this.parent
            .selectAll('line.line')
            .on('mousemove', null)
            .on('mouseout', null);
        // Remove legend listeners
        var eventsFragment = this.services.events;
        eventsFragment.removeEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        eventsFragment.removeEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
        // remove scatter listeners
        eventsFragment.removeEventListener(Events.Scatter.SCATTER_MOUSEOVER, this.handleScatterOnHover);
        eventsFragment.removeEventListener(Events.Scatter.SCATTER_MOUSEOUT, this.handleScatterOnMouseOut);
    };
    return Lollipop;
}(Scatter));
export { Lollipop };
//# sourceMappingURL=../../../src/components/graphs/lollipop.js.map