import { BoxplotChartModel } from '../model-boxplot';
import { AxisChart } from '../axis-chart';
import { BoxplotChartOptions, ChartConfig } from '../interfaces/index';
export declare class BoxplotChart extends AxisChart {
    model: BoxplotChartModel;
    constructor(holder: Element, chartConfigs: ChartConfig<BoxplotChartOptions>);
    getComponents(): any[];
}
