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
var Bar = /** @class */ (function (_super) {
    __extends(Bar, _super);
    function Bar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Gets the correct width for bars based on options & configurations
    Bar.prototype.getBarWidth = function (allDataLabels) {
        var options = this.getOptions();
        if (options.bars.width) {
            return options.bars.width;
        }
        var numberOfDatapoints = this.model.getDisplayData().length;
        var mainXScale = this.services.cartesianScales.getMainXScale();
        var chartWidth = DOMUtils.getSVGElementSize(this.parent, {
            useAttrs: true,
        }).width;
        if (!mainXScale.step) {
            return Math.min(options.bars.maxWidth, (chartWidth * 0.25) / numberOfDatapoints);
        }
        return Math.min(options.bars.maxWidth, mainXScale.step() / 2);
    };
    Bar.prototype.isOutsideZoomedDomain = function (x0, x1) {
        var dataCount = this.model.getDisplayData().length;
        // if only one data point, never out of zoom domain
        // or it becomes a blank chart
        if (dataCount <= 1) {
            return false;
        }
        var zoomDomain = this.model.get('zoomDomain');
        if (zoomDomain !== undefined) {
            var domainScale = this.services.cartesianScales.getDomainScale();
            return (x0 < domainScale(zoomDomain[0]) ||
                x1 > domainScale(zoomDomain[1]));
        }
        return false;
    };
    return Bar;
}(Component));
export { Bar };
//# sourceMappingURL=../../../src/components/graphs/bar.js.map