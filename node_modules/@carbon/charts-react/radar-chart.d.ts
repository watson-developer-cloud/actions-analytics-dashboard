import { RadarChart as RC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, RadarChartOptions } from '@carbon/charts/interfaces';
declare type RadarChartProps = ChartConfig<RadarChartOptions>;
export default class RadarChart extends BaseChart<RadarChartOptions> {
    chartRef: HTMLDivElement;
    props: RadarChartProps;
    chart: RC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
