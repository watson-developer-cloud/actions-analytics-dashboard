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
import { Roles } from '../../interfaces';
import { Tools } from '../../tools';
var StackedScatter = /** @class */ (function (_super) {
    __extends(StackedScatter, _super);
    function StackedScatter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'scatter-stacked';
        return _this;
    }
    StackedScatter.prototype.render = function (animate) {
        var _this = this;
        var isScatterEnabled = Tools.getProperty(this.getOptions(), 'points', 'enabled');
        if (!isScatterEnabled) {
            return;
        }
        // Grab container SVG
        var svg = this.getContainerSVG({ withinChartClip: true });
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var percentage = Object.keys(options.axes).some(function (axis) { return options.axes[axis].percentage; });
        var stackedData = this.model.getStackedData({
            groups: this.configs.groups,
            percentage: percentage,
        });
        // Update data on dot groups
        var circleGroups = svg
            .selectAll('g.dots')
            .data(stackedData, function (d) { return Tools.getProperty(d, 0, groupMapsTo); });
        // Remove dot groups that need to be removed
        circleGroups.exit().attr('opacity', 0).remove();
        // Add the dot groups that need to be introduced
        var circleGroupsEnter = circleGroups
            .enter()
            .append('g')
            .classed('dots', true)
            .attr('role', Roles.GROUP);
        // Update data on all circles
        var circles = circleGroupsEnter
            .merge(circleGroups)
            .selectAll('circle.dot')
            .data(function (d) { return d; });
        // Remove circles that need to be removed
        circles.exit().attr('opacity', 0).remove();
        // Add the dot groups that need to be introduced
        var enteringCircles = circles
            .enter()
            .append('circle')
            .classed('dot', true)
            .attr('opacity', 0);
        // Apply styling & position
        var circlesToStyle = enteringCircles.merge(circles).datum(function (d) {
            var _a;
            var group = d[groupMapsTo];
            var domainIdentifier = _this.services.cartesianScales.getDomainIdentifier(d);
            var rangeIdentifier = _this.services.cartesianScales.getRangeIdentifier(d);
            return _a = {},
                _a[groupMapsTo] = group,
                _a[domainIdentifier] = d['data']['sharedStackKey'],
                _a[rangeIdentifier] = d[1],
                _a;
        });
        this.styleCircles(circlesToStyle, animate);
        // Add event listeners to elements drawn
        this.addEventListeners();
    };
    StackedScatter.prototype.getTooltipData = function (hoveredX, hoveredY) {
        var _this = this;
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var percentage = Object.keys(options.axes).some(function (axis) { return options.axes[axis].percentage; });
        var stackedData = this.model.getStackedData({
            groups: this.configs.groups,
            percentage: percentage,
        });
        var tooltipData = [];
        stackedData.forEach(function (groupData, groupDataIndex) {
            groupData.forEach(function (datum, dataIndex) {
                var _a;
                var group = datum[groupMapsTo];
                var domainValue = datum['data']['sharedStackKey'];
                var rangeValue = datum['data'][group];
                var stackedRangeValue = datum[1];
                var domainIdentifier = _this.services.cartesianScales.getDomainIdentifier(datum);
                var rangeIdentifier = _this.services.cartesianScales.getRangeIdentifier(datum);
                if (rangeValue !== null &&
                    rangeValue !== undefined &&
                    hoveredX ===
                        _this.services.cartesianScales.getDomainValue(domainValue) &&
                    hoveredY ===
                        _this.services.cartesianScales.getRangeValue(stackedRangeValue)) {
                    if (percentage) {
                        rangeValue = _this.model.getStackedData({
                            groups: _this.configs.groups,
                        })[groupDataIndex][dataIndex]['data'][group];
                    }
                    if (rangeValue !== null) {
                        tooltipData.push((_a = {},
                            _a[groupMapsTo] = group,
                            _a[domainIdentifier] = domainValue,
                            _a[rangeIdentifier] = rangeValue,
                            _a));
                    }
                }
            });
        });
        return this.model
            .getDisplayData(this.configs.groups)
            .filter(function (datapoint) {
            var domainIdentifier = _this.services.cartesianScales.getDomainIdentifier(datapoint);
            var rangeIdentifier = _this.services.cartesianScales.getRangeIdentifier(datapoint);
            return (tooltipData.find(function (tooltipDatapoint) {
                return (tooltipDatapoint[groupMapsTo] ==
                    datapoint[groupMapsTo] &&
                    tooltipDatapoint[domainIdentifier] ==
                        datapoint[domainIdentifier] &&
                    tooltipDatapoint[rangeIdentifier] ==
                        datapoint[rangeIdentifier]);
            }) !== undefined);
        });
    };
    return StackedScatter;
}(Scatter));
export { StackedScatter };
//# sourceMappingURL=../../../src/components/graphs/scatter-stacked.js.map