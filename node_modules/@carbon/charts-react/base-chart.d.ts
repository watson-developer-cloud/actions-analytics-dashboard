import React from 'react';
import { Chart as BaseChartType } from '@carbon/charts/chart';
import { ChartTabularData, BaseChartOptions } from '@carbon/charts/interfaces';
declare type Props<Options> = {
    options?: Options;
    data?: ChartTabularData;
};
export default class BaseChart<Options = BaseChartOptions> extends React.Component<Props<Options>> {
    data: ChartTabularData | [];
    options: Options | {};
    props: Props<Options>;
    chart: BaseChartType;
    constructor(props: Props<Options>);
    shouldComponentUpdate(nextProps: Props<Options>): boolean;
    componentDidUpdate(): void;
}
export {};
