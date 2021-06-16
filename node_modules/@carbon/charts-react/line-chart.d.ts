import { LineChart as LC } from '@carbon/charts';
import { ChartConfig, LineChartOptions } from '@carbon/charts/interfaces';
import BaseChart from './base-chart';
declare type LineChartProps = ChartConfig<LineChartOptions>;
export default class LineChart extends BaseChart<LineChartOptions> {
    chartRef?: HTMLDivElement;
    props: LineChartProps;
    chart: LC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
