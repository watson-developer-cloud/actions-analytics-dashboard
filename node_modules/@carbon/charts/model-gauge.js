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
import { ChartModel } from './model';
/** The gauge chart model layer */
var GaugeChartModel = /** @class */ (function (_super) {
    __extends(GaugeChartModel, _super);
    function GaugeChartModel(services) {
        return _super.call(this, services) || this;
    }
    GaugeChartModel.prototype.getDataGroups = function () {
        return _super.prototype.getDataGroups.call(this).filter(function (item) { return item.name !== 'delta'; });
    };
    return GaugeChartModel;
}(ChartModel));
export { GaugeChartModel };
//# sourceMappingURL=../src/model-gauge.js.map