import { AxisChart } from '../axis-chart';
import { ChartConfig, ComboChartOptions } from '../interfaces/index';
export declare class ComboChart extends AxisChart {
    constructor(holder: Element, chartConfigs: ChartConfig<ComboChartOptions>);
    getGraphComponents(): any;
    getComponents(): any[];
}
