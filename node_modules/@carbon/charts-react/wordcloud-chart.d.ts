import { WordCloudChart as WCC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, WorldCloudChartOptions } from '@carbon/charts/interfaces';
declare type WordCloudChartProps = ChartConfig<WorldCloudChartOptions>;
export default class WordCloudChart extends BaseChart<WorldCloudChartOptions> {
    chartRef: HTMLDivElement;
    props: WordCloudChartProps;
    chart: WCC;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
