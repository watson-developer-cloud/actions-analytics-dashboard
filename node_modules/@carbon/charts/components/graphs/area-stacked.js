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
import * as Configuration from '../../configuration';
import { Roles, Events, ColorClassNameTypes } from '../../interfaces';
// D3 Imports
import { area } from 'd3-shape';
var StackedArea = /** @class */ (function (_super) {
    __extends(StackedArea, _super);
    function StackedArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'area-stacked';
        _this.handleLegendOnHover = function (event) {
            var hoveredElement = event.detail.hoveredElement;
            var options = _this.getOptions();
            var groupMapsTo = options.data.groupMapsTo;
            _this.parent
                .selectAll('path.area')
                .transition(_this.services.transitions.getTransition('legend-hover-area'))
                .attr('opacity', function (d) {
                if (Tools.getProperty(d, 0, groupMapsTo) !==
                    hoveredElement.datum().name) {
                    return Configuration.area.opacity.unselected;
                }
                return Configuration.area.opacity.selected;
            });
        };
        _this.handleLegendMouseOut = function () {
            _this.parent
                .selectAll('path.area')
                .transition(_this.services.transitions.getTransition('legend-mouseout-area'))
                .attr('opacity', Configuration.area.opacity.selected);
        };
        return _this;
    }
    StackedArea.prototype.init = function () {
        var eventsFragment = this.services.events;
        // Highlight correct area on legend item hovers
        eventsFragment.addEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        // Un-highlight area on legend item mouseouts
        eventsFragment.addEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    StackedArea.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        var svg = this.getContainerSVG({ withinChartClip: true });
        var self = this;
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var percentage = Object.keys(options.axes).some(function (axis) { return options.axes[axis].percentage; });
        var stackedData = this.model.getStackedData({
            percentage: percentage,
            groups: this.configs.groups,
        });
        var firstDatum = Tools.getProperty(stackedData, 0, 0);
        // area doesnt have to use the main range and domain axes - they can be mapped to the secondary (in the case of a combo chart)
        // however area _cannot_ have multiple datasets that are mapped to _different_ ranges and domains so we can use the first data item
        var domainAxisPosition = this.services.cartesianScales.getDomainAxisPosition({ firstDatum: firstDatum });
        var rangeAxisPosition = this.services.cartesianScales.getRangeAxisPosition({ firstDatum: firstDatum });
        var mainYScale = this.services.cartesianScales.getScaleByPosition(rangeAxisPosition);
        var areas = svg
            .selectAll('path.area')
            .data(stackedData, function (d) { return Tools.getProperty(d, 0, groupMapsTo); });
        // D3 area generator function
        this.areaGenerator = area()
            .x(function (d, i) {
            return _this.services.cartesianScales.getValueThroughAxisPosition(domainAxisPosition, d.data.sharedStackKey, i);
        })
            .y0(function (d) { return mainYScale(d[0]); })
            .y1(function (d) { return mainYScale(d[1]); })
            .curve(this.services.curves.getD3Curve());
        areas.exit().attr('opacity', 0).remove();
        var enteringAreas = areas.enter().append('path').attr('opacity', 0);
        enteringAreas
            .merge(areas)
            .data(stackedData, function (d) { return Tools.getProperty(d, 0, groupMapsTo); })
            .attr('class', 'area')
            .attr('class', function (d) {
            return _this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.FILL],
                dataGroupName: Tools.getProperty(d, 0, groupMapsTo),
                originalClassName: 'area',
            });
        })
            .style('fill', function (d) {
            return self.model.getFillColor(Tools.getProperty(d, 0, groupMapsTo));
        })
            .attr('role', Roles.GRAPHICS_SYMBOL)
            .attr('aria-roledescription', 'area')
            .transition(this.services.transitions.getTransition('area-update-enter', animate))
            .attr('opacity', Configuration.area.opacity.selected)
            .attr('d', this.areaGenerator);
    };
    StackedArea.prototype.destroy = function () {
        // Remove event listeners
        this.parent
            .selectAll('path.area')
            .on('mouseover', null)
            .on('mousemove', null)
            .on('mouseout', null);
    };
    return StackedArea;
}(Component));
export { StackedArea };
//# sourceMappingURL=../../../src/components/graphs/area-stacked.js.map