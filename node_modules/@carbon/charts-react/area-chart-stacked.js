"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var charts_1 = require("@carbon/charts");
var base_chart_1 = __importDefault(require("./base-chart"));
var StackedAreaChart = /** @class */ (function (_super) {
    __extends(StackedAreaChart, _super);
    function StackedAreaChart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackedAreaChart.prototype.componentDidMount = function () {
        this.chart = new charts_1.StackedAreaChart(this.chartRef, {
            data: this.props.data,
            options: this.props.options,
        });
    };
    StackedAreaChart.prototype.render = function () {
        var _this = this;
        return (react_1.default.createElement("div", { ref: function (chartRef) { return (_this.chartRef = chartRef); }, className: "chart-holder" }));
    };
    return StackedAreaChart;
}(base_chart_1.default));
exports.default = StackedAreaChart;
