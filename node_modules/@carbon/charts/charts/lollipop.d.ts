import { AxisChart } from '../axis-chart';
import { ChartConfig, LollipopChartOptions } from '../interfaces/index';
export declare class LollipopChart extends AxisChart {
    constructor(holder: Element, chartConfigs: ChartConfig<LollipopChartOptions>);
    getComponents(): any[];
}
