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
import { Chart } from './chart';
import { ChartModelCartesian } from './model-cartesian-charts';
import { LayoutDirection, LayoutGrowth, LegendOrientations, LegendPositions, AxisPositions, ScaleTypes, } from './interfaces';
import { ChartBrush, ChartClip, LayoutComponent, Legend, Threshold, Title, AxisChartsTooltip, Spacer, Toolbar, ZoomBar, } from './components';
import { Tools } from './tools';
import { CartesianScales, Curves, Zoom } from './services';
var AxisChart = /** @class */ (function (_super) {
    __extends(AxisChart, _super);
    function AxisChart(holder, chartConfigs) {
        var _this = _super.call(this, holder, chartConfigs) || this;
        _this.services = Object.assign(_this.services, {
            cartesianScales: CartesianScales,
            curves: Curves,
            zoom: Zoom,
        });
        _this.model = new ChartModelCartesian(_this.services);
        return _this;
    }
    AxisChart.prototype.getAxisChartComponents = function (graphFrameComponents, configs) {
        var options = this.model.getOptions();
        var isZoomBarEnabled = Tools.getProperty(options, 'zoomBar', AxisPositions.TOP, 'enabled');
        var toolbarEnabled = Tools.getProperty(options, 'toolbar', 'enabled');
        this.services.cartesianScales.determineAxisDuality();
        this.services.cartesianScales.findDomainAndRangeAxes(); // need to do this before getMainXAxisPosition()
        this.services.cartesianScales.determineOrientation();
        var mainXAxisPosition = this.services.cartesianScales.getMainXAxisPosition();
        var mainXScaleType = Tools.getProperty(options, 'axes', mainXAxisPosition, 'scaleType');
        // @todo - Zoom Bar only supports main axis at BOTTOM axis and time scale for now
        var zoomBarEnabled = isZoomBarEnabled &&
            mainXAxisPosition === AxisPositions.BOTTOM &&
            mainXScaleType === ScaleTypes.TIME;
        // @todo - should check if zoom bar in all axes are locked
        var isZoomBarLocked = this.services.zoom.isZoomBarLocked(AxisPositions.TOP);
        var titleAvailable = !!this.model.getOptions().title;
        var titleComponent = {
            id: 'title',
            components: [new Title(this.model, this.services)],
            growth: {
                x: LayoutGrowth.STRETCH,
                y: LayoutGrowth.FIXED,
            },
        };
        var toolbarComponent = {
            id: 'toolbar',
            components: [new Toolbar(this.model, this.services)],
            growth: {
                x: LayoutGrowth.PREFERRED,
                y: LayoutGrowth.FIXED,
            },
        };
        var headerComponent = {
            id: 'header',
            components: [
                new LayoutComponent(this.model, this.services, __spreadArrays([
                    // always add title to keep layout correct
                    titleComponent
                ], (toolbarEnabled ? [toolbarComponent] : [])), {
                    direction: LayoutDirection.ROW,
                }),
            ],
            growth: {
                x: LayoutGrowth.PREFERRED,
                y: LayoutGrowth.FIXED,
            },
        };
        var legendComponent = {
            id: 'legend',
            components: [new Legend(this.model, this.services)],
            growth: {
                x: LayoutGrowth.PREFERRED,
                y: LayoutGrowth.PREFERRED,
            },
        };
        // if all zoom bars are locked, no need to add chart brush
        if (zoomBarEnabled && !isZoomBarLocked) {
            graphFrameComponents.push(new ChartClip(this.model, this.services), new ChartBrush(this.model, this.services));
        }
        graphFrameComponents.push(new Threshold(this.model, this.services));
        var graphFrameComponent = {
            id: 'graph-frame',
            components: graphFrameComponents,
            growth: {
                x: LayoutGrowth.STRETCH,
                y: LayoutGrowth.STRETCH,
            },
        };
        var isLegendEnabled = Tools.getProperty(configs, 'legend', 'enabled') !== false &&
            this.model.getOptions().legend.enabled !== false;
        // Decide the position of the legend in reference to the chart
        var fullFrameComponentDirection = LayoutDirection.COLUMN;
        if (isLegendEnabled) {
            var legendPosition = Tools.getProperty(this.model.getOptions(), 'legend', 'position');
            if (legendPosition === LegendPositions.LEFT) {
                fullFrameComponentDirection = LayoutDirection.ROW;
                if (!this.model.getOptions().legend.orientation) {
                    this.model.getOptions().legend.orientation =
                        LegendOrientations.VERTICAL;
                }
            }
            else if (legendPosition === LegendPositions.RIGHT) {
                fullFrameComponentDirection = LayoutDirection.ROW_REVERSE;
                if (!this.model.getOptions().legend.orientation) {
                    this.model.getOptions().legend.orientation =
                        LegendOrientations.VERTICAL;
                }
            }
            else if (legendPosition === LegendPositions.BOTTOM) {
                fullFrameComponentDirection = LayoutDirection.COLUMN_REVERSE;
            }
        }
        var legendSpacerComponent = {
            id: 'spacer',
            components: [new Spacer(this.model, this.services)],
            growth: {
                x: LayoutGrowth.PREFERRED,
                y: LayoutGrowth.FIXED,
            },
        };
        var fullFrameComponent = {
            id: 'full-frame',
            components: [
                new LayoutComponent(this.model, this.services, __spreadArrays((isLegendEnabled ? [legendComponent] : []), (isLegendEnabled ? [legendSpacerComponent] : []), [
                    graphFrameComponent,
                ]), {
                    direction: fullFrameComponentDirection,
                }),
            ],
            growth: {
                x: LayoutGrowth.STRETCH,
                y: LayoutGrowth.FIXED,
            },
        };
        var zoomBarComponent = {
            id: 'zoom-bar',
            components: [new ZoomBar(this.model, this.services)],
            growth: {
                x: LayoutGrowth.PREFERRED,
                y: LayoutGrowth.FIXED,
            },
        };
        var topLevelLayoutComponents = [];
        // header component is required for either title or toolbar
        if (titleAvailable || toolbarEnabled) {
            topLevelLayoutComponents.push(headerComponent);
            var titleSpacerComponent = {
                id: 'spacer',
                components: [
                    new Spacer(this.model, this.services, toolbarEnabled ? { size: 15 } : undefined),
                ],
                growth: {
                    x: LayoutGrowth.PREFERRED,
                    y: LayoutGrowth.FIXED,
                },
            };
            topLevelLayoutComponents.push(titleSpacerComponent);
        }
        if (zoomBarEnabled) {
            topLevelLayoutComponents.push(zoomBarComponent);
        }
        topLevelLayoutComponents.push(fullFrameComponent);
        return [
            new AxisChartsTooltip(this.model, this.services),
            new LayoutComponent(this.model, this.services, topLevelLayoutComponents, {
                direction: LayoutDirection.COLUMN,
            }),
        ];
    };
    return AxisChart;
}(Chart));
export { AxisChart };
//# sourceMappingURL=../src/axis-chart.js.map