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
import { ChartClip } from './../axes/chart-clip';
import { DOMUtils } from './../../services';
// This class is used to create the clipPath to clip the chart components
// It's necessary for zoom in/out behavior
var CanvasChartClip = /** @class */ (function (_super) {
    __extends(CanvasChartClip, _super);
    function CanvasChartClip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'canvas-chart-clip';
        // Give every chart-clip a distinct ID
        // so they don't interfere each other in a page with multiple charts
        _this.chartClipId = 'canvas-chart-clip-id-' + Math.floor(Math.random() * 99999999999);
        return _this;
    }
    CanvasChartClip.prototype.createClipPath = function () {
        var svg = this.parent;
        var _a = DOMUtils.getSVGElementSize(this.parent, {
            useAttrs: true,
        }), width = _a.width, height = _a.height;
        this.chartClipPath = DOMUtils.appendOrSelect(svg, "clipPath." + this.type).attr('id', this.chartClipId);
        var clipRect = DOMUtils.appendOrSelect(this.chartClipPath, "rect." + this.type);
        clipRect
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height);
        this.chartClipPath.merge(clipRect).lower();
    };
    return CanvasChartClip;
}(ChartClip));
export { CanvasChartClip };
//# sourceMappingURL=../../../src/components/essentials/canvas-chart-clip.js.map