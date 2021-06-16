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
import { Scatter } from './scatter';
import { DOMUtils } from '../../services';
import { Roles, ColorClassNameTypes } from '../../interfaces';
import { Tools } from '../../tools';
import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
var Bubble = /** @class */ (function (_super) {
    __extends(Bubble, _super);
    function Bubble() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'bubble';
        return _this;
    }
    Bubble.prototype.getRadiusScale = function (selection) {
        var options = this.getOptions();
        var radiusMapsTo = options.bubble.radiusMapsTo;
        var data = selection.data();
        // Filter out any null/undefined values
        var allRadii = data
            .map(function (d) { return d[radiusMapsTo]; })
            .filter(function (radius) { return radius; });
        var chartSize = DOMUtils.getSVGElementSize(this.services.domUtils.getMainSVG(), { useAttr: true });
        // We need the ternary operator here in case the user
        // doesn't provide radius values in data
        var radiusDataIsValid = allRadii.length > 0;
        var domain = radiusDataIsValid ? extent(allRadii) : [1, 1];
        return scaleLinear()
            .domain(domain)
            .range(radiusDataIsValid
            ? options.bubble.radiusRange(chartSize, data)
            : [4, 4]);
    };
    Bubble.prototype.styleCircles = function (selection, animate) {
        var _this = this;
        // Chart options mixed with the internal configurations
        var options = this.getOptions();
        var radiusMapsTo = options.bubble.radiusMapsTo;
        var radiusScale = this.getRadiusScale(selection);
        var groupMapsTo = options.data.groupMapsTo;
        var cartesianScales = this.services.cartesianScales;
        var getDomainValue = function (d, i) { return cartesianScales.getDomainValue(d, i); };
        var getRangeValue = function (d, i) { return cartesianScales.getRangeValue(d, i); };
        var _a = Tools.flipDomainAndRangeBasedOnOrientation(getDomainValue, getRangeValue, cartesianScales.getOrientation()), getXValue = _a[0], getYValue = _a[1];
        selection
            .raise()
            .classed('dot', true)
            .attr('role', Roles.GRAPHICS_SYMBOL)
            .transition(this.services.transitions.getTransition('bubble-update-enter', animate))
            .attr('cx', getXValue)
            .attr('cy', getYValue)
            // We need `|| 1` here in case the user doesn't provide radius values in data
            .attr('r', function (d) { return radiusScale(d[radiusMapsTo] || 1); })
            .attr('class', function (d) {
            return _this.model.getColorClassName({
                classNameTypes: [
                    ColorClassNameTypes.FILL,
                    ColorClassNameTypes.STROKE,
                ],
                dataGroupName: d[groupMapsTo],
                originalClassName: 'dot',
            });
        })
            .style('fill', function (d) {
            var domainIdentifier = _this.services.cartesianScales.getDomainIdentifier(d);
            return _this.model.getFillColor(d[groupMapsTo], d[domainIdentifier], d);
        })
            .style('stroke', function (d) {
            var domainIdentifier = _this.services.cartesianScales.getDomainIdentifier(d);
            return _this.model.getStrokeColor(d[groupMapsTo], d[domainIdentifier], d);
        })
            .attr('fill-opacity', options.bubble.fillOpacity)
            .attr('opacity', 1);
    };
    return Bubble;
}(Scatter));
export { Bubble };
//# sourceMappingURL=../../../src/components/graphs/bubble.js.map