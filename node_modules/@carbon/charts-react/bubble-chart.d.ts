import { BubbleChart as BC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, BubbleChartOptions } from '@carbon/charts/interfaces';
declare type BubbleChartProps = ChartConfig<BubbleChartOptions>;
export default class BubbleChart extends BaseChart<BubbleChartOptions> {
    chartRef: HTMLDivElement;
    props: BubbleChartProps;
    chart: BC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
