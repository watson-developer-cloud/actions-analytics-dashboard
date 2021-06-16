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
import { ChartModelCartesian } from './model-cartesian-charts';
import * as Configuration from './configuration';
import { Tools } from './tools';
// D3 Imports
import { ascending, min, max, quantile } from 'd3-array';
import { scaleOrdinal } from 'd3-scale';
/** The charting model layer which includes mainly the chart data and options,
 * as well as some misc. information to be shared among components */
var BoxplotChartModel = /** @class */ (function (_super) {
    __extends(BoxplotChartModel, _super);
    function BoxplotChartModel(services) {
        return _super.call(this, services) || this;
    }
    BoxplotChartModel.prototype.getBoxQuartiles = function (d) {
        return {
            q_25: quantile(d, 0.25),
            q_50: quantile(d, 0.5),
            q_75: quantile(d, 0.75),
        };
    };
    BoxplotChartModel.prototype.getBoxplotData = function () {
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var groupedData = this.getGroupedData();
        // Prepare the data for the box plots
        var boxplotData = [];
        var _loop_1 = function (group, data) {
            var _a;
            var rangeIdentifier = this_1.services.cartesianScales.getRangeIdentifier();
            var values = data.map(function (d) { return d[rangeIdentifier]; }).sort(ascending);
            var record = (_a = {},
                _a[groupMapsTo] = group,
                _a.counts = values,
                _a.quartiles = this_1.getBoxQuartiles(values),
                _a.outliers = null,
                _a.whiskers = null,
                _a);
            var q1 = record.quartiles.q_25;
            var q3 = record.quartiles.q_75;
            var iqr = (q3 - q1) * 1.5;
            var irq1 = q1 - iqr;
            var irq3 = q3 + iqr;
            var outliers = [];
            var normalValues = [];
            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                var value = values_1[_i];
                if (value < irq1) {
                    outliers.push(value);
                }
                else if (value > irq3) {
                    outliers.push(value);
                }
                else {
                    normalValues.push(value);
                }
            }
            record.outliers = outliers;
            var minNormalValue = min(normalValues);
            var maxNormalValue = max(normalValues);
            record.whiskers = {
                min: minNormalValue
                    ? minNormalValue
                    : min([
                        record.quartiles.q_25,
                        record.quartiles.q_50,
                        record.quartiles.q_75,
                    ]),
                max: maxNormalValue
                    ? maxNormalValue
                    : max([
                        record.quartiles.q_25,
                        record.quartiles.q_50,
                        record.quartiles.q_75,
                    ]),
            };
            boxplotData.push(record);
        };
        var this_1 = this;
        for (var _i = 0, groupedData_1 = groupedData; _i < groupedData_1.length; _i++) {
            var _a = groupedData_1[_i], group = _a.name, data = _a.data;
            _loop_1(group, data);
        }
        return boxplotData;
    };
    BoxplotChartModel.prototype.setColorClassNames = function () {
        // monochrome
        var numberOfColors = 1;
        var colorPairingOptions = Tools.getProperty(this.getOptions(), 'color', 'pairing');
        var pairingOption = Tools.getProperty(colorPairingOptions, 'option');
        var colorPairingCounts = Configuration.color.pairingOptions;
        // Use default palette if user choice is not in range
        pairingOption =
            pairingOption <= colorPairingCounts[numberOfColors + "-color"]
                ? pairingOption
                : 1;
        // Create color classes for graph, tooltip and stroke use
        var colorPairing = this.allDataGroups.map(function (dataGroup, index) { return numberOfColors + "-" + pairingOption + "-1"; });
        // Create default color classnames
        this.colorClassNames = scaleOrdinal()
            .range(colorPairing)
            .domain(this.allDataGroups);
    };
    return BoxplotChartModel;
}(ChartModelCartesian));
export { BoxplotChartModel };
//# sourceMappingURL=../src/model-boxplot.js.map