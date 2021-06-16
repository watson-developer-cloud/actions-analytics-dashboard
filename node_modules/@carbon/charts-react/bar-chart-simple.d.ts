import { SimpleBarChart as SBC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, BarChartOptions } from '@carbon/charts/interfaces';
declare type SimpleBarChartProps = ChartConfig<BarChartOptions>;
export default class SimpleBarChart extends BaseChart<BarChartOptions> {
    chartRef: HTMLDivElement;
    props: SimpleBarChartProps;
    chart: SBC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
