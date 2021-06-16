import { GaugeChart as GC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, GaugeChartOptions } from '@carbon/charts/interfaces';
declare type GaugeChartProps = ChartConfig<GaugeChartOptions>;
export default class GaugeChart extends BaseChart<GaugeChartOptions> {
    chartRef: HTMLDivElement;
    props: GaugeChartProps;
    chart: GC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
