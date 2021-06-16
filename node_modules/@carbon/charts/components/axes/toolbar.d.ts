import { Component } from '../component';
import { ToolbarControlTypes } from '../../interfaces';
export declare class Toolbar extends Component {
    type: string;
    overflowButton: any;
    overflowMenu: any;
    overflowMenuX: number;
    overflowMenuY: number;
    overflowMenuItemId: number;
    init(): void;
    render(animate?: boolean): void;
    isOverflowMenuOpen(): boolean;
    updateOverflowMenu(show: boolean): void;
    focusOnPreviousEnabledMenuItem(currentItemIndex: any): void;
    focusOnNextEnabledMenuItem(currentItemIndex: any): void;
    toggleOverflowMenu(): void;
    getOverflowMenuHTML(): any;
    getControlConfigs(): {
        buttonList: any[];
        overflowMenuItemList?: undefined;
    } | {
        buttonList: any[];
        overflowMenuItemList: any[];
    };
    getOverflowMenuItems(): any[];
    getOverflowButtonConfig(): {
        id: string;
        shouldBeDisabled: () => boolean;
        iconSVGContent: string;
        clickFunction: () => void;
    };
    getControlConfigByType(controlType: ToolbarControlTypes): any;
    getControlIconByType(controlType: ToolbarControlTypes): "<polygon points=\"19 13 15 13 15 9 13 9 13 13 9 13 9 15 13 15 13 19 15 19 15 15 19 15 19 13\"/>\n    \t\t\t\t\t<path d=\"M22.45,21A10.87,10.87,0,0,0,25,14,11,11,0,1,0,14,25a10.87,10.87,0,0,0,7-2.55L28.59,30,30,28.59ZM14,23a9,9,0,1,1,9-9A9,9,0,0,1,14,23Z\"/>" | "<rect x=\"9\" y=\"13\" width=\"10\" height=\"2\"/>\n\t\t\t\t\t\t<path d=\"M22.45,21A10.87,10.87,0,0,0,25,14,11,11,0,1,0,14,25a10.87,10.87,0,0,0,7-2.55L28.59,30,30,28.59ZM14,23a9,9,0,1,1,9-9A9,9,0,0,1,14,23Z\"/>" | "<path d=\"M22.4478,21A10.855,10.855,0,0,0,25,14,10.99,10.99,0,0,0,6,6.4658V2H4v8h8V8H7.332a8.9768,8.9768,0,1,1-2.1,8H3.1912A11.0118,11.0118,0,0,0,14,25a10.855,10.855,0,0,0,7-2.5522L28.5859,30,30,28.5859Z\"/>";
}
