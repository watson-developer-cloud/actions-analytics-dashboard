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
import { Skeleton } from '../graphs/skeleton';
import { DOMUtils } from '../../services';
import { Tools } from '../../tools';
var SkeletonLines = /** @class */ (function (_super) {
    __extends(SkeletonLines, _super);
    function SkeletonLines() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'skeleton-lines';
        return _this;
    }
    SkeletonLines.prototype.render = function () {
        var svg = this.parent;
        var parent = svg.node().parentNode;
        var _a = DOMUtils.getSVGElementSize(parent, {
            useAttrs: true,
        }), width = _a.width, height = _a.height;
        svg.attr('width', width).attr('height', height);
        var isDataLoading = Tools.getProperty(this.getOptions(), 'data', 'loading');
        var isSparkline = !Tools.getProperty(this.getOptions(), 'grid', 'x', 'enabled') &&
            !Tools.getProperty(this.getOptions(), 'grid', 'y', 'enabled') &&
            !Tools.getProperty(this.getOptions(), 'axes', 'bottom', 'visible') &&
            !Tools.getProperty(this.getOptions(), 'axes', 'left', 'visible');
        // display a skeleton if there is no chart data or the loading flag is set to true
        if (isDataLoading && !isSparkline) {
            _super.prototype.renderGridSkeleton.call(this, isDataLoading);
        }
        else if (isDataLoading && isSparkline) {
            this.renderSparklineSkeleton(isDataLoading);
        }
        else {
            this.removeSkeleton();
        }
    };
    SkeletonLines.prototype.renderSparklineSkeleton = function (showShimmerEffect) {
        this.setScales();
        this.drawBackdrop(showShimmerEffect);
        this.drawSparkline(showShimmerEffect);
        this.updateBackdropStyle();
        if (showShimmerEffect) {
            this.setShimmerEffect('shimmer-lines');
        }
    };
    SkeletonLines.prototype.drawSparkline = function (showShimmerEffect) {
        var width = this.backdrop.attr('width');
        var ticksValues = [100];
        var sparklineSkeleton = DOMUtils.appendOrSelect(this.backdrop, 'g.y.skeleton');
        var update = sparklineSkeleton.selectAll('line').data(ticksValues);
        update
            .enter()
            .append('line')
            .merge(update)
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', function (d) { return d; })
            .attr('y2', function (d) { return d; });
        sparklineSkeleton
            .selectAll('line')
            .classed('shimmer-effect-lines', showShimmerEffect)
            .classed('empty-state-lines', !showShimmerEffect);
    };
    SkeletonLines.prototype.updateBackdropStyle = function () {
        var svg = this.parent;
        this.backdrop = DOMUtils.appendOrSelect(svg, 'svg.chart-skeleton.DAII');
        var backdropRect = DOMUtils.appendOrSelect(this.backdrop, 'rect.chart-skeleton-backdrop');
        backdropRect.classed('shimmer-effect-lines', false);
        backdropRect.classed('shimmer-effect-sparkline', true);
    };
    return SkeletonLines;
}(Skeleton));
export { SkeletonLines };
//# sourceMappingURL=../../../src/components/graphs/skeleton-lines.js.map