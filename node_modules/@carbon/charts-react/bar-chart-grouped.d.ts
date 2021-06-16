import { GroupedBarChart as GBC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, BarChartOptions } from '@carbon/charts/interfaces';
declare type GroupedBarChartProps = ChartConfig<BarChartOptions>;
export default class GroupedBarChart extends BaseChart<BarChartOptions> {
    chartRef: HTMLDivElement;
    props: GroupedBarChartProps;
    chart: GBC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
