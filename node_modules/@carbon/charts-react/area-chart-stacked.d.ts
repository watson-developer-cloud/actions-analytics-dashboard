import { StackedAreaChart as SAC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, StackedAreaChartOptions } from '@carbon/charts/interfaces';
declare type StackedAreaChartProps = ChartConfig<StackedAreaChartOptions>;
export default class StackedAreaChart extends BaseChart<StackedAreaChartOptions> {
    chartRef: HTMLDivElement;
    props: StackedAreaChartProps;
    chart: SAC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
