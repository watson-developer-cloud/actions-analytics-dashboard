import { LollipopChart as LC } from '@carbon/charts';
import { ChartConfig, LollipopChartOptions } from '@carbon/charts/interfaces';
import BaseChart from './base-chart';
declare type LollipopChartProps = ChartConfig<LollipopChartOptions>;
export default class LollipopChart extends BaseChart<LollipopChartOptions> {
    chartRef?: HTMLDivElement;
    props: LollipopChartProps;
    chart: LC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
