import { BoxplotChart as BC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, BoxplotChartOptions } from '@carbon/charts/interfaces';
declare type BoxplotChartProps = ChartConfig<BoxplotChartOptions>;
export default class BoxplotChart extends BaseChart<BoxplotChartOptions> {
    chartRef: HTMLDivElement;
    props: BoxplotChartProps;
    chart: BC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
