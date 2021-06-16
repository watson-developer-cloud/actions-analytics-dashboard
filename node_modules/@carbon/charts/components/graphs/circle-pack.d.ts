import { Component } from '../component';
export declare class CirclePack extends Component {
    type: string;
    focal: any;
    render(animate?: boolean): void;
    unhighlightChildren(childData: any): void;
    highlightChildren(childData: any, classname?: any): void;
    getZoomClass(node: any): "focal" | "non-focal";
    addLegendListeners(): void;
    removeBackgroundListeners(): void;
    setBackgroundListeners(): void;
    handleLegendOnHover: (event: CustomEvent<any>) => void;
    handleLegendMouseOut: (event: CustomEvent<any>) => void;
    getZoomIcon(): string;
    addEventListeners(): void;
    destroy(): void;
}
