export declare const groupedBarData: {
    group: string;
    key: string;
    value: number;
}[];
export declare const groupedBarOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
        };
        bottom: {
            scaleType: string;
            mapsTo: string;
        };
    };
};
export declare const groupedBarSelectedGroupsData: {
    group: string;
    key: string;
    value: number;
}[];
export declare const groupedBarSelectedGroupsOptions: {
    title: string;
    data: {
        selectedGroups: string[];
    };
    axes: {
        left: {
            mapsTo: string;
        };
        bottom: {
            scaleType: string;
            mapsTo: string;
        };
    };
};
export declare const groupedHorizontalBarData: {
    group: string;
    key: string;
    value: number;
}[];
export declare const groupedHorizontalBarOptions: {
    title: string;
    axes: {
        left: {
            scaleType: string;
            mapsTo: string;
        };
        bottom: {
            mapsTo: string;
        };
    };
};
export declare const simpleBarData: {
    group: string;
    value: number;
}[];
export declare const simpleBarOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
        };
        bottom: {
            mapsTo: string;
            scaleType: string;
        };
    };
};
export declare const simpleBarColorOverrideOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
        };
        bottom: {
            scaleType: string;
            mapsTo: string;
        };
    };
    color: {
        pairing: {
            option: number;
        };
        scale: {
            Qty: string;
            Misc: string;
        };
    };
};
export declare const simpleBarCustomLegendOrderOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
        };
        bottom: {
            mapsTo: string;
            scaleType: string;
        };
    };
    legend: {
        order: string[];
    };
};
export declare const simpleBarAdditionalLegendItemsOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
        };
        bottom: {
            mapsTo: string;
            scaleType: string;
        };
    };
    legend: {
        additionalItems: {
            type: string;
            name: string;
        }[];
    };
};
export declare const simpleBarDataCustomTicks: {
    group: string;
    value: number;
}[];
export declare const simpleBarOptionsCustomTicks: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            ticks: {
                values: number[];
            };
        };
        bottom: {
            mapsTo: string;
            scaleType: string;
        };
    };
};
export declare const simpleBarCenteredLegendData: {
    group: string;
    value: number;
}[];
export declare const simpleBarCenteredLegendOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
        };
        bottom: {
            mapsTo: string;
            scaleType: string;
        };
    };
    legend: {
        alignment: string;
    };
};
export declare const simpleBarFixedDomainOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            domain: number[];
        };
        bottom: {
            scaleType: string;
            mapsTo: string;
        };
    };
};
export declare const simpleHorizontalBarData: {
    group: string;
    value: number;
}[];
export declare const simpleHorizontalBarLongLabelData: {
    group: string;
    value: number;
}[];
export declare const simpleHorizontalBarOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            scaleType: string;
        };
        bottom: {
            mapsTo: string;
        };
    };
};
export declare const simpleHorizontalBarCenteredLegendData: {
    group: string;
    value: number;
}[];
export declare const simpleHorizontalBarCenteredLegendOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            scaleType: string;
        };
        bottom: {
            mapsTo: string;
        };
    };
    legend: {
        alignment: string;
    };
};
export declare const simpleHorizontalBarLongLabelOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            scaleType: string;
            truncation: {
                type: string;
                threshold: number;
                numCharacter: number;
            };
        };
        bottom: {
            mapsTo: string;
        };
    };
    legend: {
        truncation: {
            type: string;
            threshold: number;
            numCharacter: number;
        };
    };
};
export declare const simpleBarTimeSeriesData: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const simpleBarTimeSeriesDenseData: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const simpleBarTimeSeriesOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
        };
        bottom: {
            mapsTo: string;
            scaleType: string;
        };
    };
};
export declare const simpleBarTurkishLocaleData: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const simpleBarTurkishLocaleOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
        };
        bottom: {
            mapsTo: string;
            scaleType: string;
        };
    };
    timeScale: {
        localeObject: Locale;
    };
};
export declare const simpleHorizontalBarTimeSeriesOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            scaleType: string;
        };
        bottom: {
            mapsTo: string;
        };
    };
};
export declare const simpleBarTimeSeriesDenseOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
        };
        bottom: {
            mapsTo: string;
            scaleType: string;
        };
    };
    timeScale: {
        localeObject: Locale;
    };
    bars: {
        maxWidth: number;
    };
};
export declare const simpleHorizontalBarTimeSeriesData: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const floatingHorizontalBarTimeSeriesData: ({
    group: string;
    date: Date;
    value: number[];
} | {
    group: string;
    date: Date;
    value: number;
})[];
export declare const floatingHorizontalBarTimeSeriesOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            scaleType: string;
        };
        bottom: {
            mapsTo: string;
        };
    };
};
export declare const stackedBarData: {
    group: string;
    key: string;
    value: number;
}[];
export declare const stackedBarOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            stacked: boolean;
        };
        bottom: {
            mapsTo: string;
            scaleType: string;
        };
    };
};
export declare const stackedHorizontalBarData: {
    group: string;
    key: string;
    value: number;
}[];
export declare const stackedHorizontalBarOptions: {
    title: string;
    axes: {
        left: {
            scaleType: string;
        };
        bottom: {
            stacked: boolean;
        };
    };
};
export declare const stackedBarTimeSeriesData: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const stackedBarTimeSeriesOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            stacked: boolean;
        };
        bottom: {
            mapsTo: string;
            scaleType: string;
        };
    };
};
export declare const stackedBarTimeSeriesDataCustomTicks: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const stackedBarTimeSeriesOptionsCustomTicks: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            stacked: boolean;
        };
        bottom: {
            mapsTo: string;
            scaleType: string;
            ticks: {
                values: Date[];
            };
        };
    };
};
export declare const stackedHorizontalBarTimeSeriesOptions: {
    title: string;
    axes: {
        left: {
            scaleType: string;
        };
        bottom: {
            stacked: boolean;
        };
    };
};
export declare const stackedHorizontalBarTimeSeriesData: {
    group: string;
    date: Date;
    value: number;
}[];
export declare const simpleBarEmptyStateData: any[];
export declare const simpleBarEmptyStateOptions: {
    title: string;
    axes: {
        left: {};
        bottom: {
            scaleType: string;
        };
    };
};
export declare const simpleBarSkeletonData: any[];
export declare const simpleBarSkeletonOptions: {
    title: string;
    axes: {
        left: {};
        bottom: {
            scaleType: string;
        };
    };
    data: {
        loading: boolean;
    };
};
export declare const groupedBarEmptyStateData: any[];
export declare const groupedBarEmptyStateOptions: {
    title: string;
    axes: {
        left: {};
        bottom: {
            scaleType: string;
        };
    };
};
export declare const groupedBarSkeletonData: any[];
export declare const groupedBarSkeletonOptions: {
    title: string;
    axes: {
        left: {};
        bottom: {
            scaleType: string;
        };
    };
    data: {
        loading: boolean;
    };
};
export declare const stackedBarEmptyStateData: any[];
export declare const stackedBarEmptyStateOptions: {
    title: string;
    axes: {
        left: {};
        bottom: {
            scaleType: string;
        };
    };
};
export declare const stackedBarSkeletonData: any[];
export declare const stackedBarSkeletonOptions: {
    title: string;
    axes: {
        left: {};
        bottom: {
            scaleType: string;
        };
    };
    data: {
        loading: boolean;
    };
};
export declare const simpleHorizontalBarEmptyStateData: any[];
export declare const simpleHorizontalBarEmptyStateOptions: {
    title: string;
    axes: {
        left: {
            scaleType: string;
        };
        bottom: {};
    };
};
export declare const simpleHorizontalBarSkeletonData: any[];
export declare const simpleHorizontalBarSkeletonOptions: {
    title: string;
    axes: {
        left: {
            scaleType: string;
        };
        bottom: {};
    };
    data: {
        loading: boolean;
    };
};
export declare const groupedHorizontalBarEmptyStateData: any[];
export declare const groupedHorizontalBarEmptyStateOptions: {
    title: string;
    axes: {
        left: {
            scaleType: string;
        };
        bottom: {};
    };
};
export declare const groupedHorizontalBarSkeletonData: any[];
export declare const groupedHorizontalBarSkeletonOptions: {
    title: string;
    axes: {
        left: {
            scaleType: string;
        };
        bottom: {};
    };
    data: {
        loading: boolean;
    };
};
export declare const stackedHorizontalBarEmptyStateData: any[];
export declare const stackedHorizontalBarEmptyStateOptions: {
    title: string;
    axes: {
        left: {
            scaleType: string;
        };
        bottom: {};
    };
};
export declare const stackedHorizontalBarSkeletonData: any[];
export declare const stackedHorizontalBarSkeletonOptions: {
    title: string;
    axes: {
        left: {
            scaleType: string;
        };
        bottom: {};
    };
    data: {
        loading: boolean;
    };
};
export declare const floatingBarData: {
    group: string;
    value: number[];
}[];
export declare const floatingBarOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            includeZero: boolean;
        };
        bottom: {
            mapsTo: string;
            scaleType: string;
        };
    };
};
export declare const floatingHorizontalBarData: {
    group: string;
    value: number[];
}[];
export declare const floatingHorizontalBarOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            scaleType: string;
        };
        bottom: {
            mapsTo: string;
            includeZero: boolean;
        };
    };
};
