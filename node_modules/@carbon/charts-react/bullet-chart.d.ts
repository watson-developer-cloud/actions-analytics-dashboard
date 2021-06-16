import { BulletChart as BC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, BulletChartOptions } from '@carbon/charts/interfaces';
declare type BulletChartProps = ChartConfig<BulletChartOptions>;
export default class BulletChart extends BaseChart<BulletChartOptions> {
    chartRef: HTMLDivElement;
    props: BulletChartProps;
    chart: BC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
