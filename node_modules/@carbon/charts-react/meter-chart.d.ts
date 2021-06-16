import { MeterChart as MC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, MeterChartOptions } from '@carbon/charts/interfaces';
declare type MeterChartProps = ChartConfig<MeterChartOptions>;
export default class MeterChart extends BaseChart<MeterChartOptions> {
    chartRef: HTMLDivElement;
    props: MeterChartProps;
    chart: MC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
