import { PieChart as PC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, PieChartOptions } from '@carbon/charts/interfaces';
declare type PieChartProps = ChartConfig<PieChartOptions>;
export default class PieChart extends BaseChart<PieChartOptions> {
    chartRef: HTMLDivElement;
    props: PieChartProps;
    chart: PC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
