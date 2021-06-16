export declare const doubleLinearScatterData: {
    group: string;
    employees: number;
    sales: number;
}[];
export declare const doubleLinearScatterOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            scaleType: string;
        };
        left: {
            title: string;
            mapsTo: string;
            scaleType: string;
        };
    };
};
export declare const scatterDiscreteData: {
    group: string;
    key: string;
    value: number;
}[];
export declare const scatterDiscreteOptions: {
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
};
export declare const scatterTimeSeriesData: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const scatterTimeSeriesOptions: {
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
};
export declare const scatterEmptyStateData: any[];
export declare const scatterEmptyStateOptions: {
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
};
export declare const scatterSkeletonData: any[];
export declare const scatterSkeletonOptions: {
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
    data: {
        loading: boolean;
    };
};
export declare const scatterDualAxesData: ({
    group: string;
    date: string;
    orderCount: number;
    productCount?: undefined;
} | {
    group: string;
    date: string;
    productCount: number;
    orderCount?: undefined;
})[];
export declare const scatterDualAxesOptions: {
    title: string;
    axes: {
        bottom: {
            mapsTo: string;
            scaleType: string;
        };
        left: {
            title: string;
            mapsTo: string;
            scaleType: string;
        };
        right: {
            title: string;
            mapsTo: string;
            scaleType: string;
            correspondingDatasets: string[];
        };
    };
};
