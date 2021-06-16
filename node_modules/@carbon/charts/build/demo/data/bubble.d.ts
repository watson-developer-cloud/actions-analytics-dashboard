export declare const bubbleDoubleLinearData: {
    group: string;
    sales: number;
    profit: number;
    surplus: number;
}[];
export declare const bubbleDoubleLinearOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            includeZero: boolean;
        };
        left: {
            title: string;
            mapsTo: string;
            includeZero: boolean;
        };
    };
    bubble: {
        radiusMapsTo: string;
        radiusLabel: string;
    };
    legend: {
        additionalItems: {
            type: string;
            name: string;
        }[];
    };
};
export declare const bubbleDiscreteData: {
    group: string;
    key: string;
    value: number;
    surplus: number;
}[];
export declare const bubbleDiscreteOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            scaleType: string;
            mapsTo: string;
        };
        left: {
            mapsTo: string;
        };
    };
    bubble: {
        radiusMapsTo: string;
    };
};
export declare const bubbleTimeSeriesData: ({
    group: string;
    date: Date;
    value: number;
} & {
    surplus: number;
})[];
export declare const bubbleTimeSeriesOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            scaleType: string;
            mapsTo: string;
        };
        left: {
            mapsTo: string;
        };
    };
    bubble: {
        radiusMapsTo: string;
    };
};
export declare const bubbleEmptyStateData: any[];
export declare const bubbleEmptyStateOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            includeZero: boolean;
        };
        left: {
            title: string;
            mapsTo: string;
            includeZero: boolean;
        };
    };
    bubble: {
        radiusMapsTo: string;
    };
};
export declare const bubbleSkeletonData: any[];
export declare const bubbleSkeletonOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            includeZero: boolean;
        };
        left: {
            title: string;
            mapsTo: string;
            includeZero: boolean;
        };
    };
    bubble: {
        radiusMapsTo: string;
    };
    data: {
        loading: boolean;
    };
};
export declare const bubbleDualDiscreteData: {
    group: string;
    product: string;
    value: number;
    problem: string;
}[];
export declare const bubbleDualDiscreteOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            scaleType: string;
            mapsTo: string;
        };
        left: {
            scaleType: string;
            mapsTo: string;
            title: string;
        };
    };
    bubble: {
        radiusMapsTo: string;
    };
};
