import { AxisChart } from '../axis-chart';
import { ChartConfig, BulletChartOptions } from '../interfaces/index';
export declare class BulletChart extends AxisChart {
    constructor(holder: Element, chartConfigs: ChartConfig<BulletChartOptions>);
    getComponents(): any[];
}
