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
import { Chart } from '../chart';
import { CirclePackChartModel } from './../model-circle-pack';
import * as Configuration from '../configuration';
import { Tools } from '../tools';
// Components
import { CirclePack, } from '../components/index';
var CirclePackChart = /** @class */ (function (_super) {
    __extends(CirclePackChart, _super);
    function CirclePackChart(holder, chartConfigs) {
        var _this = _super.call(this, holder, chartConfigs) || this;
        _this.model = new CirclePackChartModel(_this.services);
        // Merge the default options for this chart
        // With the user provided options
        _this.model.setOptions(Tools.mergeDefaultChartOptions(Configuration.options.circlePackChart, chartConfigs.options));
        // Initialize data, services, components etc.
        _this.init(holder, chartConfigs);
        return _this;
    }
    CirclePackChart.prototype.getComponents = function () {
        // Specify what to render inside the graph-frame
        var graphFrameComponents = [
            new CirclePack(this.model, this.services),
        ];
        // get the base chart components and export with tooltip
        var components = this.getChartComponents(graphFrameComponents);
        return components;
    };
    return CirclePackChart;
}(Chart));
export { CirclePackChart };
//# sourceMappingURL=../../src/charts/circle-pack.js.map