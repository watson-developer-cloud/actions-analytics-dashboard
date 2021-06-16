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
import { Service } from '../service';
var GradientUtils = /** @class */ (function (_super) {
    __extends(GradientUtils, _super);
    function GradientUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GradientUtils.appendOrUpdateLinearGradient = function (configs) {
        var lg = configs.svg.select("defs linearGradient#" + configs.id);
        if (lg.empty()) {
            lg = configs.svg
                .append('defs')
                .append('linearGradient')
                .attr('id', configs.id)
                .attr('x1', configs.x1)
                .attr('x2', configs.x2)
                .attr('y1', configs.y1)
                .attr('y2', configs.y2);
        }
        lg.selectAll('stop').remove();
        lg.selectAll('stop')
            .data(configs.stops)
            .enter()
            .append('stop')
            .attr('offset', function (d) { return d.offset; })
            .style('stop-color', function (d) { return d.color; })
            .style('stop-opacity', function (d) { return d.opacity; });
    };
    GradientUtils.getOffsetRatio = function (domain) {
        var offsetRatio = ((Math.abs(domain[1]) * 100) /
            Math.abs(domain[0] - domain[1])).toFixed(2) + '%';
        return offsetRatio;
    };
    GradientUtils.getStops = function (domain, color) {
        var need3Stops = domain[0] < 0 && domain[1] > 0;
        var stops = [
            {
                offset: '0%',
                color: color,
                opacity: '0.6',
            },
            {
                offset: '80%',
                color: color,
                opacity: '0',
            },
        ];
        if (need3Stops) {
            stops = [
                {
                    offset: '0%',
                    color: color,
                    opacity: '0.6',
                },
                {
                    offset: GradientUtils.getOffsetRatio(domain),
                    color: color,
                    opacity: '0',
                },
                {
                    offset: '100%',
                    color: color,
                    opacity: '0.6',
                },
            ];
        }
        return stops;
    };
    return GradientUtils;
}(Service));
export { GradientUtils };
//# sourceMappingURL=../../../src/services/essentials/gradient-utils.js.map