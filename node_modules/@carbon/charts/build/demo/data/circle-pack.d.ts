export declare const circlePackTwoLevelData: {
    name: string;
    children: {
        name: string;
        value: number;
    }[];
}[];
export declare const circlePackTwoLevelOptions: {
    experimental: string;
    title: string;
    canvasZoom: {
        enabled: boolean;
    };
};
export declare const circlePackSingleOptions: {
    experimental: string;
    title: string;
    canvasZoom: {
        enabled: boolean;
    };
};
export declare const circlePackSingleLevelData: {
    name: string;
    value: number;
}[];
export declare const circlePackThreeLevelOptions: {
    experimental: string;
    title: string;
    canvasZoom: {
        enabled: boolean;
    };
};
export declare const circlePackThreeLevelData: {
    name: string;
    children: ({
        name: string;
        children: {
            name: string;
            value: number;
        }[];
        value?: undefined;
    } | {
        name: string;
        value: number;
        children?: undefined;
    })[];
}[];
export declare const circlePackThreeLevelsMonochromeOptions: {
    experimental: string;
    title: string;
    canvasZoom: {
        enabled: boolean;
    };
};
export declare const circlePackThreeLevelsMonochromeData: {
    name: string;
    children: {
        name: string;
        children: ({
            name: string;
            children: {
                name: string;
                value: number;
            }[];
            value?: undefined;
        } | {
            name: string;
            value: number;
            children?: undefined;
        })[];
    }[];
}[];
export declare const circlePackThreeLevelNoZoomOptions: {
    experimental: string;
    title: string;
    circlePack: {
        hierarchyLevel: number;
    };
    canvasZoom: {
        enabled: boolean;
    };
};
