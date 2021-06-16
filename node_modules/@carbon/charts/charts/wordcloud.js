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
import { Chart } from '../chart';
import * as Configuration from '../configuration';
import { Tools } from '../tools';
import { Skeletons } from '../interfaces/enums';
// Components
import { WordCloud, Skeleton, } from '../components/index';
var WordCloudChart = /** @class */ (function (_super) {
    __extends(WordCloudChart, _super);
    function WordCloudChart(holder, chartConfigs) {
        var _this = _super.call(this, holder, chartConfigs) || this;
        // Merge the default options for this chart
        // With the user provided options
        _this.model.setOptions(Tools.mergeDefaultChartOptions(Configuration.options.wordCloudChart, chartConfigs.options));
        // Initialize data, services, components etc.
        _this.init(holder, chartConfigs);
        return _this;
    }
    WordCloudChart.prototype.getComponents = function () {
        // Specify what to render inside the graph-frame
        var graphFrameComponents = [
            new WordCloud(this.model, this.services),
            new Skeleton(this.model, this.services, {
                skeleton: Skeletons.PIE,
            }),
        ];
        // get the base chart components and export with tooltip
        var components = this.getChartComponents(graphFrameComponents);
        return components;
    };
    return WordCloudChart;
}(Chart));
export { WordCloudChart };
//# sourceMappingURL=../../src/charts/wordcloud.js.map