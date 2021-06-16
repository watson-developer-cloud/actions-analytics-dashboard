import { BaseChartOptions, AxisChartOptions, ScatterChartOptions, LollipopChartOptions, LineChartOptions, BarChartOptions, StackedBarChartOptions, BoxplotChartOptions, AreaChartOptions, PieChartOptions, GaugeChartOptions, DonutChartOptions, BubbleChartOptions, BulletChartOptions, RadarChartOptions, ComboChartOptions, TreemapChartOptions, CirclePackChartOptions, WorldCloudChartOptions, GridOptions, RulerOptions, TimeScaleOptions, TooltipOptions, MeterChartOptions } from './interfaces';
/**
 * Grid options
 */
export declare const grid: GridOptions;
/**
 * Ruler options
 */
export declare const ruler: RulerOptions;
/**
 * Tooltip options
 */
export declare const baseTooltip: TooltipOptions;
export declare const timeScale: TimeScaleOptions;
export declare const options: {
    chart: BaseChartOptions;
    axisChart: AxisChartOptions;
    simpleBarChart: BarChartOptions;
    groupedBarChart: BarChartOptions;
    stackedBarChart: StackedBarChartOptions;
    boxplotChart: BoxplotChartOptions;
    bubbleChart: BubbleChartOptions;
    bulletChart: BulletChartOptions;
    lineChart: LineChartOptions;
    areaChart: AreaChartOptions;
    stackedAreaChart: AreaChartOptions;
    scatterChart: ScatterChartOptions;
    lollipopChart: LollipopChartOptions;
    pieChart: PieChartOptions;
    donutChart: DonutChartOptions;
    meterChart: MeterChartOptions;
    radarChart: RadarChartOptions;
    gaugeChart: GaugeChartOptions;
    comboChart: ComboChartOptions;
    treemapChart: TreemapChartOptions;
    circlePackChart: CirclePackChartOptions;
    wordCloudChart: WorldCloudChartOptions;
};
export * from './configuration-non-customizable';
