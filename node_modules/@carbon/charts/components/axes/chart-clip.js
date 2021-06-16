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
import { DOMUtils } from '../../services';
// This class is used to create the clipPath to clip the chart components
// It's necessary for zoom in/out behavior
var ChartClip = /** @class */ (function (_super) {
    __extends(ChartClip, _super);
    function ChartClip(model, services, configs) {
        var _this = _super.call(this, model, services, configs) || this;
        _this.type = 'chart-clip';
        // Give every chart-clip a distinct ID
        // so they don't interfere each other in a page with multiple charts
        _this.chartClipId = 'chart-clip-id-' + Math.floor(Math.random() * 99999999999);
        _this.init();
        return _this;
    }
    ChartClip.prototype.init = function () {
        // set unique chartClipId in this chart to model
        this.model.set({ chartClipId: this.chartClipId }, { skipUpdate: true });
    };
    ChartClip.prototype.render = function (animate) {
        if (animate === void 0) { animate = true; }
        // Create the clipPath
        this.createClipPath();
    };
    ChartClip.prototype.createClipPath = function () {
        var svg = this.parent;
        var cartesianScales = this.services.cartesianScales;
        var mainXScale = cartesianScales.getMainXScale();
        var mainYScale = cartesianScales.getMainYScale();
        var _a = mainXScale.range(), xScaleStart = _a[0], xScaleEnd = _a[1];
        var _b = mainYScale.range(), yScaleEnd = _b[0], yScaleStart = _b[1];
        // Get height
        this.chartClipPath = DOMUtils.appendOrSelect(svg, "clipPath." + this.type).attr('id', this.chartClipId);
        var clipRect = DOMUtils.appendOrSelect(this.chartClipPath, "rect." + this.type);
        clipRect
            .attr('x', xScaleStart)
            .attr('y', yScaleStart)
            .attr('width', xScaleEnd - xScaleStart)
            .attr('height', yScaleEnd - yScaleStart);
        this.chartClipPath.merge(clipRect).lower();
    };
    return ChartClip;
}(Component));
export { ChartClip };
//# sourceMappingURL=../../../src/components/axes/chart-clip.js.map