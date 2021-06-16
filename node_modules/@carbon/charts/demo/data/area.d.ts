export declare const areaTimeSeriesData: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const areaTimeSeriesOptions: {
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
};
export declare const areaDiscreteDomain: {
    group: string;
    value: number;
    key: string;
}[];
export declare const areaDiscreteDomainOptions: {
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
};
export declare const areaTimeSeriesCurvedData: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const sparklineTimeSeriesData: {
    group: string;
    date: number;
    value: number;
}[];
export declare const areaTimeSeriesCurvedOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            scaleType: string;
        };
        left: {
            mapsTo: string;
            scaleType: string;
        };
    };
    curve: string;
};
export declare const sparklineOptions: {
    title: string;
    height: string;
    grid: {
        x: {
            enabled: boolean;
        };
        y: {
            enabled: boolean;
        };
    };
    axes: {
        bottom: {
            visible: boolean;
            title: string;
            mapsTo: string;
            scaleType: string;
        };
        left: {
            visible: boolean;
            mapsTo: string;
            scaleType: string;
        };
    };
    color: {
        gradient: {
            enabled: boolean;
        };
    };
    points: {
        enabled: boolean;
    };
    legend: {
        enabled: boolean;
    };
};
export declare const stackedAreaTimeSeriesData: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const stackedAreaTimeSeriesOptions: {
    title: string;
    axes: {
        left: {
            stacked: boolean;
            scaleType: string;
            mapsTo: string;
        };
        bottom: {
            scaleType: string;
            mapsTo: string;
        };
    };
    curve: string;
};
export declare const stackedAreaTimeSeriesUnevenData: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const stackedAreaTimeSeriesUnevenDataOptions: {
    title: string;
    axes: {
        left: {
            stacked: boolean;
        };
        bottom: {
            scaleType: string;
            mapsTo: string;
        };
    };
    curve: string;
};
export declare const stackedAreaPercentageTimeSeriesOptions: {
    title: string;
    axes: {
        left: {
            stacked: boolean;
            percentage: boolean;
            ticks: {
                formatter: (d: any) => string;
            };
        };
        bottom: {
            scaleType: string;
            mapsTo: string;
        };
    };
    curve: string;
};
export declare const boundedAreaTimeSeriesData: {
    group: string;
    date: Date;
    value: number;
    min: number;
    max: number;
}[];
export declare const boundedAreaTimeSeriesOptions: {
    title: string;
    legend: {
        enabled: boolean;
    };
    bounds: {
        upperBoundMapsTo: string;
        lowerBoundMapsTo: string;
    };
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            scaleType: string;
        };
        left: {
            mapsTo: string;
            scaleType: string;
        };
    };
    curve: string;
};
export declare const areaEmptyData: any[];
export declare const areaEmptyOptions: {
    title: string;
    axes: {
        left: {};
        bottom: {
            scaleType: string;
        };
    };
};
export declare const areaSkeletonData: {
    group: string;
    date: Date;
    value: number;
    min: number;
    max: number;
}[];
export declare const areaSkeletonOptions: {
    title: string;
    bounds: {
        upperBoundMapsTo: string;
        lowerBoundMapsTo: string;
    };
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            scaleType: string;
        };
        left: {
            mapsTo: string;
            scaleType: string;
        };
    };
    curve: string;
    data: {
        loading: boolean;
    };
};
