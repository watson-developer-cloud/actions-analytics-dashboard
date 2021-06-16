import { ScatterChart as SC } from '@carbon/charts';
import { ChartConfig, ScatterChartOptions } from '@carbon/charts/interfaces';
import BaseChart from './base-chart';
declare type ScatterChartProps = ChartConfig<ScatterChartOptions>;
export default class ScatterChart extends BaseChart<ScatterChartOptions> {
    chartRef: HTMLDivElement;
    props: ScatterChartProps;
    chart: SC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
