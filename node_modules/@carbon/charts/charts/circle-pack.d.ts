import { Chart } from '../chart';
import { CirclePackChartModel } from './../model-circle-pack';
import { ChartConfig, CirclePackChartOptions } from '../interfaces/index';
export declare class CirclePackChart extends Chart {
    model: CirclePackChartModel;
    constructor(holder: Element, chartConfigs: ChartConfig<CirclePackChartOptions>);
    getComponents(): any[];
}
