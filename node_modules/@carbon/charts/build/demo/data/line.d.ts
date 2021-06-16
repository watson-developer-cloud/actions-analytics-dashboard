export declare const lineData: ({
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
export declare const lineOptions: {
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
export declare const sparklineLoadingOptions: {
    title: string;
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
            title: string;
            scaleType: string;
        };
    };
    grid: {
        x: {
            enabled: boolean;
        };
        y: {
            enabled: boolean;
        };
    };
    legend: {
        enabled: boolean;
    };
    tooltip: {
        enabled: boolean;
    };
    points: {
        enabled: boolean;
    };
    data: {
        loading: boolean;
    };
};
export declare const lineLongLabelData: ({
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
export declare const lineLongLabelOptions: {
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
export declare const lineCustomDomainOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            scaleType: string;
            domain: string[];
        };
        left: {
            domain: number[];
            mapsTo: string;
            title: string;
            scaleType: string;
        };
    };
};
export declare const lineSelectedGroupsData: ({
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
export declare const lineSelectedGroupsOptions: {
    title: string;
    data: {
        selectedGroups: string[];
    };
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
export declare const lineCustomColorOptions: {
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
    color: {
        scale: {
            'Dataset 1': string;
            'Dataset 2': string;
            'Dataset 3': string;
            'Dataset 4': string;
        };
    };
};
export declare const lineTimeSeriesData: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const lineTimeSeriesOptions: {
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
};
export declare const lineTimeSeriesWithThresholdsOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            scaleType: string;
            thresholds: {
                value: Date;
                label: string;
                valueFormatter: (date: Date) => string;
            }[];
        };
        left: {
            mapsTo: string;
            title: string;
            scaleType: string;
            thresholds: ({
                value: number;
                label: string;
                fillColor: string;
            } | {
                value: number;
                fillColor: string;
                label?: undefined;
            })[];
        };
    };
    curve: string;
};
export declare const lineTimeSeriesDenseData: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const lineTimeSeriesDenseOptions: {
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
};
export declare const lineTimeSeriesDataRotatedTicks: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const lineTimeSeriesRotatedTicksOptions: {
    title: string;
    width: string;
    axes: {
        bottom: {
            scaleType: string;
            mapsTo: string;
            ticks: {
                rotation: string;
            };
        };
        left: {
            mapsTo: string;
        };
    };
    legend: {
        clickable: boolean;
    };
};
export declare const lineEmptyStateData: any[];
export declare const lineEmptyStateOptions: {
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
};
export declare const lineSkeletonData: any[];
export declare const lineSkeletonOptions: {
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
    data: {
        loading: boolean;
    };
};
export declare const lineTimeSeriesDualAxesData: ({
    group: string;
    date: Date;
    temp: number;
    rainfall?: undefined;
} | {
    group: string;
    date: Date;
    rainfall: number;
    temp?: undefined;
})[];
export declare const dualLine: {
    title: string;
    axes: {
        left: {
            title: string;
            mapsTo: string;
        };
        bottom: {
            scaleType: string;
            mapsTo: string;
            title: string;
        };
        right: {
            title: string;
            mapsTo: string;
            correspondingDatasets: string[];
        };
    };
    curve: string;
};
export declare const lineOptionsLegendOrientation: {
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
    legend: {
        position: string;
        orientation: string;
    };
};
