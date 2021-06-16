import { TreemapChart as TC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, TreemapChartOptions } from '@carbon/charts/interfaces';
declare type TreemapChartProps = ChartConfig<TreemapChartOptions>;
export default class TreemapChart extends BaseChart<TreemapChartOptions> {
    chartRef: HTMLDivElement;
    props: TreemapChartProps;
    chart: TC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
