export declare const stepOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            scaleType: string;
        };
        left: {
            mapsTo: string;
            title: string;
            scaleType: string;
        };
    };
} & {
    title: string;
    curve: string;
};
export declare const stepData: ({
    group: string;
    key: string;
    value: number;
    audienceSize?: undefined;
} | {
    group: string;
    key: string;
    value: number;
    audienceSize: number;
})[];
export declare const stepTimeSeriesOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            scaleType: string;
        };
        left: {
            mapsTo: string;
            title: string;
            scaleType: string;
        };
    };
    curve: string;
} & {
    title: string;
    curve: string;
};
export declare const stepTimeSeriesData: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const stepEmptyStateData: any[];
export declare const stepEmptyStateOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            scaleType: string;
        };
        left: {
            mapsTo: string;
            title: string;
            scaleType: string;
        };
    };
    curve: string;
} & {
    title: string;
    curve: string;
};
export declare const stepSkeletonData: any[];
export declare const stepSkeletonOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            scaleType: string;
        };
        left: {
            mapsTo: string;
            title: string;
            scaleType: string;
        };
    };
    curve: string;
} & {
    title: string;
    curve: string;
    data: {
        loading: boolean;
    };
};
