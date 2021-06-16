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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { Tooltip } from './tooltip';
import { AxisPositions, ColorClassNameTypes } from '../../interfaces';
import { Tools } from '../../tools';
var AxisChartsTooltip = /** @class */ (function (_super) {
    __extends(AxisChartsTooltip, _super);
    function AxisChartsTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AxisChartsTooltip.prototype.getItems = function (e) {
        var _this = this;
        if (e.detail.items) {
            return e.detail.items;
        }
        var data = e.detail.data;
        if (!data.length || !data[0]) {
            return [];
        }
        var options = this.getOptions();
        var cartesianScales = this.services.cartesianScales;
        var domainAxisOptions = cartesianScales.getDomainAxisOptions();
        var domainIdentifier = cartesianScales.getDomainIdentifier();
        // Generate default tooltip
        var groupMapsTo = options.data.groupMapsTo;
        var domainLabel = domainAxisOptions.title;
        if (!domainLabel) {
            var domainAxisPosition = cartesianScales.getDomainAxisPosition();
            if (domainAxisPosition === AxisPositions.BOTTOM ||
                domainAxisPosition === AxisPositions.TOP) {
                domainLabel = 'x-value';
            }
            else {
                domainLabel = 'y-value';
            }
        }
        var domainValue = data[0][domainIdentifier];
        var items;
        if (data.length === 1) {
            var datum = data[0];
            var rangeAxisPosition = cartesianScales.getRangeAxisPosition({
                datum: datum,
            });
            var rangeIdentifier = cartesianScales.getRangeIdentifier(datum);
            var rangeAxisOptions = cartesianScales.getAxisOptions(rangeAxisPosition);
            var value = datum[rangeIdentifier];
            var rangeLabel = rangeAxisOptions.title;
            if (!rangeLabel) {
                if (rangeAxisPosition === AxisPositions.LEFT ||
                    rangeAxisPosition === AxisPositions.RIGHT) {
                    rangeLabel = 'y-value';
                }
                else {
                    rangeLabel = 'x-value';
                }
            }
            items = __spreadArrays([
                {
                    label: domainLabel,
                    value: domainValue,
                }
            ], (Array.isArray(value) && value.length === 2
                ? [
                    {
                        label: 'Start',
                        value: value[0],
                    },
                    {
                        label: 'End',
                        value: value[1],
                    },
                ]
                : [
                    {
                        label: rangeLabel,
                        value: datum[rangeIdentifier],
                    },
                ]));
            if (e.detail.additionalItems) {
                e.detail.additionalItems.forEach(function (additionalItem) {
                    return items.push({
                        label: additionalItem.label,
                        value: additionalItem.value,
                    });
                });
            }
            items.push({
                label: options.tooltip.groupLabel,
                value: datum[groupMapsTo],
                color: this.model.getFillColor(datum[groupMapsTo]),
                class: this.model.getColorClassName({
                    classNameTypes: [ColorClassNameTypes.TOOLTIP],
                    dataGroupName: datum[groupMapsTo],
                }),
            });
        }
        else if (data.length > 1) {
            items = [
                {
                    label: domainLabel,
                    value: domainValue,
                },
            ];
            items = items.concat(data
                .map(function (datum) { return ({
                label: datum[groupMapsTo],
                value: datum[cartesianScales.getRangeIdentifier(datum)],
                color: _this.model.getFillColor(datum[groupMapsTo]),
                class: _this.model.getColorClassName({
                    classNameTypes: [ColorClassNameTypes.TOOLTIP],
                    dataGroupName: datum[groupMapsTo],
                }),
            }); })
                .sort(function (a, b) { return b.value - a.value; }));
            var dualAxes = cartesianScales.isDualAxes();
            if (!dualAxes &&
                Tools.getProperty(options, 'tooltip', 'showTotal') === true) {
                // use the primary/only range id
                var rangeIdentifier_1 = cartesianScales.getRangeIdentifier();
                items.push({
                    label: options.tooltip.totalLabel || 'Total',
                    value: data.reduce(function (accumulator, datum) {
                        return accumulator + datum[rangeIdentifier_1];
                    }, 0),
                    bold: true,
                });
            }
        }
        return items;
    };
    return AxisChartsTooltip;
}(Tooltip));
export { AxisChartsTooltip };
//# sourceMappingURL=../../../src/components/essentials/tooltip-axis.js.map