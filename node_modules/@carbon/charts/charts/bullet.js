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
import { AxisChart } from '../axis-chart';
import * as Configuration from '../configuration';
import { Tools } from '../tools';
import { Skeletons } from '../interfaces/enums';
// Components
import { Bullet, Grid, TwoDimensionalAxes, Skeleton, } from '../components/index';
var BulletChart = /** @class */ (function (_super) {
    __extends(BulletChart, _super);
    function BulletChart(holder, chartConfigs) {
        var _this = _super.call(this, holder, chartConfigs) || this;
        // Merge the default options for this chart
        // With the user provided options
        _this.model.setOptions(Tools.mergeDefaultChartOptions(Configuration.options.bulletChart, chartConfigs.options));
        // Initialize data, services, components etc.
        _this.init(holder, chartConfigs);
        return _this;
    }
    BulletChart.prototype.getComponents = function () {
        // Specify what to render inside the graph-frame
        var graphFrameComponents = [
            new TwoDimensionalAxes(this.model, this.services),
            new Grid(this.model, this.services),
            new Bullet(this.model, this.services),
            new Skeleton(this.model, this.services, {
                skeleton: Skeletons.GRID,
            }),
        ];
        var components = this.getAxisChartComponents(graphFrameComponents);
        return components;
    };
    return BulletChart;
}(AxisChart));
export { BulletChart };
//# sourceMappingURL=../../src/charts/bullet.js.map