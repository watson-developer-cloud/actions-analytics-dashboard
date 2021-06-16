import { Component } from '../component';
import { ChartModel } from '../../model';
import Position from '@carbon/utils-position';
export declare class Tooltip extends Component {
    type: string;
    isEventListenerAdded: boolean;
    tooltip: any;
    positionService: Position;
    constructor(model: ChartModel, services: any, configs?: any);
    handleShowTooltip: (e: any) => void;
    handleHideTooltip: () => void;
    addTooltipEventListener(): void;
    removeTooltipEventListener(): void;
    getItems(e: CustomEvent): any;
    formatItems(items: any): any;
    getTooltipHTML(e: CustomEvent): any;
    valueFormatter(value: any, label: string): any;
    render(): void;
    positionTooltip(e: CustomEvent): void;
}
