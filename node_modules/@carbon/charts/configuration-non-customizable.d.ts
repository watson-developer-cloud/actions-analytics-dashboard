import { ZoomBarTypes } from './interfaces';
import { easeCubicInOut } from 'd3-ease';
export declare const area: {
    opacity: {
        unselected: number;
        selected: number;
    };
};
export declare const axis: {
    ticks: {
        number: number;
        rotateIfSmallerThan: number;
        verticalSpaceRatio: number;
        horizontalSpaceRatio: number;
    };
    ratio: {
        reference: string;
        compareTo: string;
    };
    paddingRatio: number;
};
export declare const canvasZoomSettings: {
    duration: number;
    ease: typeof easeCubicInOut;
    zoomLevel: number;
};
export declare const circlePack: {
    circles: {
        fillOpacity: number;
    };
    padding: {
        mainGroup: number;
        children: number;
    };
    hierarchyLevel: number;
};
export declare const color: {
    pairingOptions: {
        '1-color': number;
        '2-color': number;
        '3-color': number;
        '4-color': number;
        '5-color': number;
        '14-color': number;
    };
};
export declare const boxplot: {
    circle: {
        radius: number;
        opacity: {
            hovered: number;
            default: number;
        };
    };
    box: {
        opacity: {
            hovered: number;
            default: number;
        };
    };
    strokeWidth: {
        default: number;
        thicker: number;
    };
};
export declare const legend: {
    items: {
        status: {
            ACTIVE: number;
            DISABLED: number;
        };
        horizontalSpace: number;
        verticalSpace: number;
        textYOffset: number;
        spaceAfter: number;
    };
    checkbox: {
        radius: number;
    };
    radius: {
        iconData: {
            cx: number;
            cy: number;
            r: number;
        }[];
        fill: any;
        stroke: string;
    };
    line: {
        yPosition: number;
        width: number;
        strokeWidth: number;
        fill: any;
        stroke: string;
    };
    area: {
        width: number;
        height: number;
        fill: string;
        stroke: any;
    };
    size: {
        iconData: {
            width: number;
            height: number;
        }[];
        fill: any;
        stroke: string;
    };
    quartile: {
        iconData: {
            x: number;
            y: number;
            width: number;
            height: number;
        }[];
    };
    zoom: {
        iconData: {
            x: number;
            y: number;
            width: number;
            height: number;
        }[];
        color: string;
    };
};
export declare const lines: {
    opacity: {
        unselected: number;
        selected: number;
    };
    weight: {
        selected: number;
        unselected: number;
    };
};
export declare const meter: {
    statusBar: {
        paddingRight: number;
    };
    status: {
        indicatorSize: number;
        paddingLeft: number;
    };
};
export declare const pie: {
    radiusOffset: number;
    innerRadius: number;
    padAngle: number;
    hoverArc: {
        outerRadiusOffset: number;
    };
    xOffset: number;
    yOffset: number;
    yOffsetCallout: number;
    callout: {
        minSliceDegree: number;
        offsetX: number;
        offsetY: number;
        horizontalLineLength: number;
        textMargin: number;
    };
};
export declare const radar: {
    opacity: {
        unselected: number;
        selected: number;
    };
    xLabelPadding: number;
    yLabelPadding: number;
    yTicksNumber: number;
    minRange: number;
    xAxisRectHeight: number;
    dotsRadius: number;
};
export declare const spacers: {
    default: {
        size: number;
    };
};
export declare const tooltips: {
    horizontalOffset: number;
};
/**
 * Base transition configuration
 */
export declare const transitions: {
    default: {
        duration: number;
    };
    pie_slice_mouseover: {
        duration: number;
    };
    pie_chart_titles: {
        duration: number;
    };
    graph_element_mouseover_fill_update: {
        duration: number;
    };
    graph_element_mouseout_fill_update: {
        duration: number;
    };
};
export declare const toolbar: {
    buttonSize: number;
    iconSize: number;
    height: number;
    spacerHeight: number;
    iconPadding: number;
};
export declare const zoomBar: {
    height: {
        [ZoomBarTypes.GRAPH_VIEW]: number;
        [ZoomBarTypes.SLIDER_VIEW]: number;
    };
    spacerHeight: number;
    handleWidth: number;
    handleBarWidth: number;
    handleBarHeight: number;
};
