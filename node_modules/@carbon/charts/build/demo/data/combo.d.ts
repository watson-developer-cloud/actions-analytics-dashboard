export declare const comboSimpleData: ({
    group: string;
    date: string;
    value: number;
    temp?: undefined;
} | {
    group: string;
    date: string;
    temp: number;
    value?: undefined;
})[];
export declare const comboSimpleOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            scaleType: string;
            title: string;
        };
        right: {
            mapsTo: string;
            scaleType: string;
            title: string;
            correspondingDatasets: string[];
        };
        bottom: {
            title: string;
            mapsTo: string;
            scaleType: string;
        };
    };
    comboChartTypes: ({
        type: string;
        correspondingDatasets: string[];
        options?: undefined;
    } | {
        type: string;
        options: {
            points: {
                radius: number;
            };
        };
        correspondingDatasets: string[];
    })[];
};
export declare const comboHorizontalData: ({
    group: string;
    date: string;
    value: number;
    temp?: undefined;
} | {
    group: string;
    date: string;
    temp: number;
    value?: undefined;
})[];
export declare const comboHorizontalOptions: {
    title: string;
    axes: {
        top: {
            mapsTo: string;
            scaleType: string;
            title: string;
        };
        bottom: {
            mapsTo: string;
            scaleType: string;
            title: string;
            correspondingDatasets: string[];
        };
        left: {
            title: string;
            mapsTo: string;
            scaleType: string;
        };
    };
    comboChartTypes: {
        type: string;
        options: {};
        correspondingDatasets: string[];
    }[];
};
export declare const comboStackedData: ({
    group: string;
    key: string;
    value: number;
    temp?: undefined;
} | {
    group: string;
    key: string;
    temp: number;
    value?: undefined;
})[];
export declare const comboStackedOptions: {
    title: string;
    axes: {
        left: {
            title: string;
            mapsTo: string;
            stacked: boolean;
        };
        bottom: {
            title: string;
            mapsTo: string;
            scaleType: string;
        };
        right: {
            title: string;
            mapsTo: string;
            correspondingDatasets: string[];
        };
    };
    comboChartTypes: {
        type: string;
        options: {};
        correspondingDatasets: string[];
    }[];
};
export declare const comboGroupedData: ({
    group: string;
    key: string;
    value: number;
    temp?: undefined;
} | {
    group: string;
    key: string;
    temp: number;
    value?: undefined;
})[];
export declare const comboGroupedOptions: {
    title: string;
    axes: {
        left: {
            title: string;
            mapsTo: string;
        };
        bottom: {
            scaleType: string;
            mapsTo: string;
        };
        right: {
            title: string;
            mapsTo: string;
            correspondingDatasets: string[];
        };
    };
    comboChartTypes: ({
        type: string;
        correspondingDatasets: string[];
        options?: undefined;
    } | {
        type: string;
        options: {
            points: {
                filled: boolean;
                opacity: number;
            };
        };
        correspondingDatasets: string[];
    })[];
};
export declare const comboGroupedHorizontalData: ({
    group: string;
    key: string;
    value: number;
    temp?: undefined;
} | {
    group: string;
    key: string;
    temp: number;
    value?: undefined;
})[];
export declare const comboGroupedHorizontalOptions: {
    title: string;
    axes: {
        top: {
            title: string;
            mapsTo: string;
            main: boolean;
        };
        left: {
            scaleType: string;
            mapsTo: string;
        };
        bottom: {
            title: string;
            mapsTo: string;
            correspondingDatasets: string[];
        };
    };
    comboChartTypes: {
        type: string;
        correspondingDatasets: string[];
    }[];
};
export declare const comboAreaLineData: ({
    group: string;
    key: string;
    value: number;
    temp?: undefined;
} | {
    group: string;
    key: string;
    temp: number;
    value?: undefined;
})[];
export declare const comboAreaLineOptions: {
    title: string;
    points: {
        enabled: boolean;
    };
    axes: {
        left: {
            title: string;
            mapsTo: string;
        };
        bottom: {
            scaleType: string;
            mapsTo: string;
        };
        right: {
            title: string;
            mapsTo: string;
            correspondingDatasets: string[];
        };
    };
    comboChartTypes: ({
        type: string;
        options: {
            points?: undefined;
        };
        correspondingDatasets: string[];
    } | {
        type: string;
        options: {
            points: {
                enabled: boolean;
            };
        };
        correspondingDatasets: string[];
    })[];
    curve: string;
};
export declare const comboLineScatterData: ({
    group: string;
    key: string;
    temp: number;
    value?: undefined;
} | {
    group: string;
    key: string;
    value: number;
    temp?: undefined;
})[];
export declare const comboLineScatterOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            title: string;
        };
        bottom: {
            scaleType: string;
            mapsTo: string;
        };
        right: {
            title: string;
            mapsTo: string;
            scaleType: string;
            correspondingDatasets: string[];
        };
    };
    curve: string;
    comboChartTypes: {
        type: string;
        correspondingDatasets: string[];
    }[];
};
export declare const comboEmptyData: any[];
export declare const comboEmptyOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            title: string;
        };
        bottom: {
            scaleType: string;
            mapsTo: string;
        };
        right: {
            title: string;
            mapsTo: string;
            scaleType: string;
            correspondingDatasets: string[];
        };
    };
    comboChartTypes: {
        type: string;
        correspondingDatasets: string[];
    }[];
};
export declare const comboLoadingData: ({
    group: string;
    key: string;
    temp: number;
    value?: undefined;
} | {
    group: string;
    key: string;
    value: number;
    temp?: undefined;
})[];
export declare const comboLoadingOptions: {
    title: string;
    axes: {
        left: {
            mapsTo: string;
            title: string;
        };
        bottom: {
            scaleType: string;
            mapsTo: string;
        };
        right: {
            title: string;
            mapsTo: string;
            scaleType: string;
            correspondingDatasets: string[];
        };
    };
    data: {
        loading: boolean;
    };
    comboChartTypes: {
        type: string;
        correspondingDatasets: string[];
    }[];
};
export declare const comboStackedAreaLine: ({
    group: string;
    date: Date;
    value: number;
    temp?: undefined;
} | {
    group: string;
    date: Date;
    temp: number;
    value?: undefined;
})[];
export declare const comboStackedAreaLineOptions: {
    title: string;
    axes: {
        left: {
            title: string;
            stacked: boolean;
            mapsTo: string;
            titleOrientation: string;
        };
        bottom: {
            scaleType: string;
            mapsTo: string;
        };
        right: {
            title: string;
            scaleType: string;
            mapsTo: string;
            correspondingDatasets: string[];
            titleOrientation: string;
        };
    };
    curve: string;
    comboChartTypes: ({
        type: string;
        options: {
            points: {
                enabled: boolean;
            };
        };
        correspondingDatasets: string[];
    } | {
        type: string;
        correspondingDatasets: string[];
        options?: undefined;
    })[];
};
export declare const comboAreaLineTimeSeriesData: ({
    group: string;
    key: Date;
    value: number;
    temp?: undefined;
} | {
    group: string;
    key: Date;
    temp: number;
    value?: undefined;
})[];
export declare const comboAreaLineTimeSeriesOptions: {
    title: string;
    points: {
        enabled: boolean;
    };
    axes: {
        left: {
            title: string;
            mapsTo: string;
        };
        bottom: {
            scaleType: string;
            mapsTo: string;
        };
        right: {
            title: string;
            mapsTo: string;
            correspondingDatasets: string[];
        };
    };
    comboChartTypes: ({
        type: string;
        options: {
            points?: undefined;
        };
        correspondingDatasets: string[];
    } | {
        type: string;
        options: {
            points: {
                enabled: boolean;
            };
        };
        correspondingDatasets: string[];
    })[];
    curve: string;
    timeScale: {
        addSpaceOnEdges: number;
    };
};
