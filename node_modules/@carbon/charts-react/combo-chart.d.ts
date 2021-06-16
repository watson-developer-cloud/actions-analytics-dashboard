import { ComboChart as CC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, ComboChartOptions } from '@carbon/charts/interfaces';
declare type ComboChartProps = ChartConfig<ComboChartOptions>;
export default class ComboChart extends BaseChart<ComboChartOptions> {
    chartRef: HTMLDivElement;
    props: ComboChartProps;
    chart: CC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
