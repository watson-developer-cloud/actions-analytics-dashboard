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
var BaseChart = /** @class */ (function (_super) {
    __extends(BaseChart, _super);
    function BaseChart(props) {
        var _this = _super.call(this, props) || this;
        var options = props.options, data = props.data;
        if (!options) {
            console.error('Missing options!');
        }
        if (!data) {
            console.error('Missing data!');
        }
        _this.data = props.data || [];
        _this.options = props.options || {};
        Object.assign(_this, _this.chart);
        return _this;
    }
    BaseChart.prototype.shouldComponentUpdate = function (nextProps) {
        return (this.props.data !== nextProps.data ||
            this.props.options !== nextProps.options);
    };
    BaseChart.prototype.componentDidUpdate = function () {
        this.chart.model.setData(this.props.data);
        this.chart.model.setOptions(this.props.options);
    };
    return BaseChart;
}(react_1.default.Component));
exports.default = BaseChart;
