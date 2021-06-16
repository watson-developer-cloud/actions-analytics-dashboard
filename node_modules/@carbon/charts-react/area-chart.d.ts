import { AreaChart as AC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, AreaChartOptions } from '@carbon/charts/interfaces';
declare type AreaChartProps = ChartConfig<AreaChartOptions>;
export default class AreaChart extends BaseChart<AreaChartOptions> {
    chartRef: HTMLDivElement;
    props: AreaChartProps;
    chart: AC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
