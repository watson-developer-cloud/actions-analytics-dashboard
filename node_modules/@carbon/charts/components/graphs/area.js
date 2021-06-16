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
import * as Configuration from '../../configuration';
import { CartesianOrientations, Events, ColorClassNameTypes, } from '../../interfaces';
import { GradientUtils, DOMUtils } from '../../services';
import { Tools } from '../../tools';
import settings from 'carbon-components/es/globals/js/settings';
// D3 Imports
import { area } from 'd3-shape';
import { select } from 'd3-selection';
var Area = /** @class */ (function (_super) {
    __extends(Area, _super);
    function Area() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'area';
        _this.gradient_id = 'gradient-id-' + Math.floor(Math.random() * 99999999999);
        _this.handleLegendOnHover = function (event) {
            var hoveredElement = event.detail.hoveredElement;
            _this.parent
                .selectAll('path.area')
                .transition(_this.services.transitions.getTransition('legend-hover-area'))
                .attr('opacity', function (group) {
                if (group.name !== hoveredElement.datum()['name']) {
                    return Configuration.area.opacity.unselected;
                }
                return Configuration.area.opacity.selected;
            });
        };
        _this.handleLegendMouseOut = function (event) {
            _this.parent
                .selectAll('path.area')
                .transition(_this.services.transitions.getTransition('legend-mouseout-area'))
                .attr('opacity', Configuration.area.opacity.selected);
        };
        return _this;
    }
    Area.prototype.init = function () {
        var eventsFragment = this.services.events;
        // Highlight correct area on legend item hovers
        eventsFragment.addEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        // Un-highlight area on legend item mouseouts
        eventsFragment.addEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    Area.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        var svg = this.getContainerSVG({ withinChartClip: true });
        var domain = [0, 0];
        var cartesianScales = this.services.cartesianScales;
        var orientation = cartesianScales.getOrientation();
        var areaGenerator = area()
            .curve(this.services.curves.getD3Curve())
            .defined(function (datum, i) {
            var rangeIdentifier = cartesianScales.getRangeIdentifier();
            var value = datum[rangeIdentifier];
            if (value === null || value === undefined) {
                return false;
            }
            return true;
        });
        // Update the bound data on area groups
        var groupedData = this.model.getGroupedData(this.configs.groups);
        var bounds = Tools.getProperty(this.getOptions(), 'bounds');
        var boundsEnabled = bounds && groupedData && groupedData.length === 1;
        if (!boundsEnabled && bounds) {
            console.warn("Bounds can only be shown when having 1 single datagroup, you've supplied " + groupedData.length); // eslint-disable-line no-console
        }
        var upperBound = function (d, i) {
            return boundsEnabled
                ? cartesianScales.getBoundedScaledValues(d, i)[0]
                : cartesianScales.getRangeValue(0);
        };
        var lowerBound = function (d, i) {
            return boundsEnabled
                ? cartesianScales.getBoundedScaledValues(d, i)[1]
                : cartesianScales.getRangeValue(d, i);
        };
        if (orientation === CartesianOrientations.VERTICAL) {
            domain = this.services.cartesianScales.getMainYScale().domain();
            areaGenerator
                .x(function (d, i) { return cartesianScales.getDomainValue(d, i); })
                .y0(function (d, i) { return upperBound(d, i); })
                .y1(function (d, i) { return lowerBound(d, i); });
        }
        else {
            domain = this.services.cartesianScales.getMainXScale().domain();
            areaGenerator
                .x0(function (d, i) { return upperBound(d, i); })
                .x1(function (d, i) { return lowerBound(d, i); })
                .y(function (d, i) { return cartesianScales.getDomainValue(d, i); });
        }
        // Is gradient enabled or not
        var isGradientEnabled = Tools.getProperty(this.getOptions(), 'color', 'gradient', 'enabled');
        // Should gradient style be applicable
        var isGradientAllowed = groupedData && groupedData.length === 1 && isGradientEnabled;
        if (groupedData.length > 1 && isGradientEnabled) {
            console.error('Gradients can only be enabled when having 1 single dataset');
        }
        var areas = svg
            .selectAll('path.area')
            .data(groupedData, function (group) { return group.name; });
        var chartprefix = Tools.getProperty(this.getOptions(), 'style', 'prefix');
        var chartSVG = DOMUtils.appendOrSelect(select(this.services.domUtils.getHolder()), "svg." + settings.prefix + "--" + chartprefix + "--chart-svg");
        // Remove elements that need to be exited
        // We need exit at the top here to make sure that
        // Data filters are processed before entering new elements
        // Or updating existing ones
        areas.exit().attr('opacity', 0).remove();
        // if there is no grouped data (if all data groups are turned OFF with legend which can happen in the case of combo charts)
        if (!groupedData.length) {
            return;
        }
        if (isGradientAllowed) {
            // The fill value of area has been overwritten, get color value from stroke color class instead
            var strokePathElement = chartSVG
                .select("path." + this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.STROKE],
                dataGroupName: groupedData[0].name,
            }))
                .node();
            var colorValue = void 0;
            if (strokePathElement) {
                colorValue = getComputedStyle(strokePathElement, null).getPropertyValue('stroke');
            }
            else {
                var sparklineColorObject = Tools.getProperty(this.model.getOptions(), 'color', 'scale');
                var sparklineColorObjectKeys = Object.keys(sparklineColorObject);
                colorValue = sparklineColorObject[sparklineColorObjectKeys[0]];
            }
            GradientUtils.appendOrUpdateLinearGradient({
                svg: this.parent,
                id: groupedData[0].name.replace(' ', '') +
                    '_' +
                    this.gradient_id,
                x1: '0%',
                x2: '0%',
                y1: '0%',
                y2: '100%',
                stops: GradientUtils.getStops(domain, colorValue),
            });
        }
        else {
            // make sure there is no linearGradient if no gradient is allowed
            if (!this.parent.selectAll('defs linearGradient').empty()) {
                this.parent.selectAll('defs linearGradient').each(function () {
                    this.parentNode.remove();
                });
            }
        }
        var self = this;
        // Enter paths that need to be introduced
        var enteringAreas = areas.enter().append('path');
        if (isGradientAllowed) {
            enteringAreas
                .merge(areas)
                .style('fill', function (group) {
                return "url(#" + group.name.replace(' ', '') + "_" + _this.gradient_id + ")";
            })
                .attr('class', 'area')
                .attr('class', function (group) {
                return _this.model.getColorClassName({
                    classNameTypes: [ColorClassNameTypes.FILL],
                    dataGroupName: group.name,
                    originalClassName: 'area',
                });
            })
                .attr('d', function (group) {
                var data = group.data;
                return areaGenerator(data);
            });
        }
        else {
            enteringAreas
                .attr('opacity', 0)
                .merge(areas)
                .attr('class', 'area')
                .attr('class', function (group) {
                return _this.model.getColorClassName({
                    classNameTypes: [
                        ColorClassNameTypes.FILL,
                        ColorClassNameTypes.STROKE,
                    ],
                    dataGroupName: group.name,
                    originalClassName: 'area',
                });
            })
                .style('fill', function (group) { return self.model.getFillColor(group.name); })
                .transition(this.services.transitions.getTransition('area-update-enter', animate))
                .attr('opacity', boundsEnabled ? 1 : Configuration.area.opacity.selected)
                .attr('d', function (group) {
                var data = group.data;
                return areaGenerator(data);
            });
            if (boundsEnabled) {
                enteringAreas
                    .attr('fill-opacity', Configuration.area.opacity.selected)
                    .style('stroke', function (group) {
                    return self.model.getStrokeColor(group.name);
                })
                    .style('stroke-dasharray', '2, 2')
                    .attr('stroke-width', 0.7 + 'px');
            }
        }
    };
    Area.prototype.destroy = function () {
        // Remove event listeners
        this.parent
            .selectAll('path.area')
            .on('mousemove', null)
            .on('mouseout', null);
        // Remove legend listeners
        var eventsFragment = this.services.events;
        eventsFragment.removeEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        eventsFragment.removeEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    return Area;
}(Component));
export { Area };
//# sourceMappingURL=../../../src/components/graphs/area.js.map