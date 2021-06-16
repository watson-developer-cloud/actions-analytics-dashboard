import { StackedBarChart as SBC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, StackedBarChartOptions } from '@carbon/charts/interfaces';
declare type StackedBarChartProps = ChartConfig<StackedBarChartOptions>;
export default class StackedBarChart extends BaseChart<StackedBarChartOptions> {
    chartRef: HTMLDivElement;
    props: StackedBarChartProps;
    chart: SBC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
