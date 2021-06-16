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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var _a;
// Internal Imports
import { AxisChart } from '../axis-chart';
import * as Configuration from '../configuration';
import { ChartTypes, Skeletons, } from '../interfaces/index';
import { Tools } from '../tools';
// Components
import { Grid, GroupedBar, SimpleBar, StackedBar, Line, TwoDimensionalAxes, ZeroLine, Scatter, StackedScatter, Area, StackedArea, Ruler, StackedRuler, Skeleton, } from '../components/index';
var graphComponentsMap = (_a = {},
    _a[ChartTypes.LINE] = [Line, Scatter],
    _a[ChartTypes.SCATTER] = [Scatter],
    _a[ChartTypes.AREA] = [Area, Line, Scatter],
    _a[ChartTypes.STACKED_AREA] = [
        StackedArea,
        Line,
        StackedScatter,
        StackedRuler,
    ],
    _a[ChartTypes.SIMPLE_BAR] = [SimpleBar],
    _a[ChartTypes.GROUPED_BAR] = [GroupedBar, ZeroLine],
    _a[ChartTypes.STACKED_BAR] = [StackedBar, StackedRuler],
    _a);
var ComboChart = /** @class */ (function (_super) {
    __extends(ComboChart, _super);
    function ComboChart(holder, chartConfigs) {
        var _this = _super.call(this, holder, chartConfigs) || this;
        // Merge the default options for this chart
        // With the user provided options
        var chartOptions = Tools.mergeDefaultChartOptions(Configuration.options.comboChart, chartConfigs.options);
        // Warn user if no comboChartTypes defined
        // Use skeleton chart instead
        if (!chartConfigs.options.comboChartTypes) {
            console.error('No comboChartTypes defined for the Combo Chart!');
            // add a default chart to get an empty chart
            chartOptions.comboChartTypes = [
                { type: ChartTypes.LINE, correspondingDatasets: [] },
            ];
        }
        // set the global options
        _this.model.setOptions(chartOptions);
        // Initialize data, services, components etc.
        _this.init(holder, chartConfigs);
        return _this;
    }
    ComboChart.prototype.getGraphComponents = function () {
        var _this = this;
        var comboChartTypes = this.model.getOptions().comboChartTypes;
        var counter = 0;
        var graphComponents = comboChartTypes
            .map(function (graph) {
            var type = graph.type;
            var options;
            // initializes the components using input strings with the base configs for each chart
            if (typeof graph.type === 'string') {
                // check if it is in the components map
                // if it isn't then it is not a valid carbon chart to use in combo
                if (!Object.keys(graphComponentsMap).includes(graph.type)) {
                    console.error("Invalid chart type \"" + graph.type + "\" specified for combo chart. Please refer to the ComboChart tutorial for more guidance.");
                    return null;
                }
                var stacked_1;
                options = Tools.merge({}, Configuration.options[Tools.camelCase(graph.type) + "Chart"], _this.model.getOptions(), graph.options);
                // if we are creating a stacked area, the contained Line chart needs to know it is stacked
                if (graph.type === ChartTypes.STACKED_AREA) {
                    stacked_1 = true;
                }
                return graphComponentsMap[graph.type].map(function (Component, i) {
                    return new Component(_this.model, _this.services, {
                        groups: graph.correspondingDatasets,
                        id: counter++,
                        options: options,
                        stacked: stacked_1,
                    });
                });
            }
            else {
                // user has imported a type or custom component to instantiate
                options = Tools.merge({}, _this.model.getOptions(), graph.options);
                return new type(_this.model, _this.services, {
                    groups: graph.correspondingDatasets,
                    id: counter++,
                    options: options,
                });
            }
        })
            .filter(function (item) { return item !== null; });
        return Tools.flatten(graphComponents);
    };
    ComboChart.prototype.getComponents = function () {
        var comboChartTypes = this.model.getOptions().comboChartTypes;
        // don't add the regular ruler if stacked ruler is added
        var stackedRulerEnabled = comboChartTypes.some(function (chartObject) {
            return chartObject.type === ChartTypes.STACKED_BAR ||
                chartObject.type === ChartTypes.STACKED_AREA;
        });
        // Specify what to render inside the graph-frame
        var graphFrameComponents = __spreadArrays([
            new TwoDimensionalAxes(this.model, this.services),
            new Grid(this.model, this.services),
            new Skeleton(this.model, this.services, {
                skeleton: Skeletons.GRID,
            })
        ], (stackedRulerEnabled
            ? []
            : [new Ruler(this.model, this.services)]), this.getGraphComponents());
        var components = this.getAxisChartComponents(graphFrameComponents);
        return components;
    };
    return ComboChart;
}(AxisChart));
export { ComboChart };
//# sourceMappingURL=../../src/charts/combo.js.map