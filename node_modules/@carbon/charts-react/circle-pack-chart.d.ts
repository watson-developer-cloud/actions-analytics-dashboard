import { CirclePackChart as CPC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, CirclePackChartOptions } from '@carbon/charts/interfaces';
declare type CirclePackChartProps = ChartConfig<CirclePackChartOptions>;
export default class CirclePackChart extends BaseChart<CirclePackChartOptions> {
    chartRef: HTMLDivElement;
    props: CirclePackChartProps;
    chart: CPC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
