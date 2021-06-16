import { DonutChart as DC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, DonutChartOptions } from '@carbon/charts/interfaces';
declare type DonutChartProps = ChartConfig<DonutChartOptions>;
export default class DonutChart extends BaseChart<DonutChartOptions> {
    chartRef: HTMLDivElement;
    props: DonutChartProps;
    chart: DC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
