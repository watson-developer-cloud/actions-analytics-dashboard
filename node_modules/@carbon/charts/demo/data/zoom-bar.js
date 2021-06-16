var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as areaChart from './area';
import * as barChart from './bar';
import * as bubbleChart from './bubble';
import * as lineChart from './line';
import * as scatterChart from './scatter';
import * as stepChart from './step';
import * as timeSeriesAxisChart from './time-series-axis';
var initialZoomDomain = [
    new Date(2020, 11, 10, 23, 59, 25),
    new Date(2020, 11, 11, 0, 0, 25),
];
var definedZoomBarData = [
    { date: new Date(2019, 0, 1), value: 10000 },
    { date: new Date(2019, 0, 2), value: 10 },
    { date: new Date(2019, 0, 3), value: 75000 },
    { date: new Date(2019, 0, 5), value: 65000 },
    { date: new Date(2019, 0, 6), value: 57312 },
    { date: new Date(2019, 0, 8), value: 10000 },
    { date: new Date(2019, 0, 13), value: 49213 },
    { date: new Date(2019, 0, 15), value: 70323 },
    { date: new Date(2019, 0, 17), value: 51213 },
    { date: new Date(2019, 0, 19), value: 21300 },
];
// utility function to update title and enable zoomBar option
export var addZoomBarToOptions = function (options, configs) {
    if (configs === void 0) { configs = { includeDefinedZoomBarData: false }; }
    options['experimental'] = true;
    if (configs.includeDefinedZoomBarData) {
        options.title += ' - Defined zoom bar enabled';
        options.zoomBar = {
            top: __assign({ enabled: true, data: definedZoomBarData }, (configs.sliderView
                ? {
                    type: 'slider_view',
                }
                : null)),
        };
    }
    else {
        options.title += ' - Zoom bar enabled';
        options.zoomBar = {
            top: __assign({ enabled: true }, (configs.sliderView
                ? {
                    type: 'slider_view',
                }
                : null)),
        };
    }
    return options;
};
export var zoomBarStackedAreaTimeSeriesData = areaChart.stackedAreaTimeSeriesData;
export var zoomBarStackedAreaTimeSeriesOptions = addZoomBarToOptions(Object.assign({}, areaChart.stackedAreaTimeSeriesOptions));
export var zoomBarSimpleBarTimeSeriesData = barChart.simpleBarTimeSeriesData;
export var zoomBarSimpleBarTimeSeriesOptions = addZoomBarToOptions(Object.assign({}, barChart.simpleBarTimeSeriesOptions), { sliderView: true });
export var zoomBarStackedBarTimeSeriesData = barChart.stackedBarTimeSeriesData;
export var zoomBarStackedBarTimeSeriesOptions = addZoomBarToOptions(Object.assign({}, barChart.stackedBarTimeSeriesOptions));
export var definedZoomBarStackedBarTimeSeriesData = barChart.stackedBarTimeSeriesData;
export var definedZoomBarStackedBarTimeSeriesOptions = addZoomBarToOptions(Object.assign({}, barChart.stackedBarTimeSeriesOptions), { includeDefinedZoomBarData: true });
export var zoomBarBubbleTimeSeriesData = bubbleChart.bubbleTimeSeriesData;
export var zoomBarBubbleTimeSeriesOptions = addZoomBarToOptions(Object.assign({}, bubbleChart.bubbleTimeSeriesOptions), { sliderView: true });
export var zoomBarLineTimeSeriesData = lineChart.lineTimeSeriesData;
export var zoomBarLineTimeSeriesOptions = addZoomBarToOptions(Object.assign({}, lineChart.lineTimeSeriesOptions));
export var zoomBarScatterTimeSeriesData = scatterChart.scatterTimeSeriesData;
export var zoomBarScatterTimeSeriesOptions = addZoomBarToOptions(Object.assign({}, scatterChart.scatterTimeSeriesOptions));
export var zoomBarStepTimeSeriesData = stepChart.stepTimeSeriesData;
export var zoomBarStepTimeSeriesOptions = addZoomBarToOptions(Object.assign({}, stepChart.stepTimeSeriesOptions), { sliderView: true });
export var zoomBarLineTimeSeries15secondsData = timeSeriesAxisChart.lineTimeSeriesData15seconds;
export var zoomBarLineTimeSeries15secondsOptions = addZoomBarToOptions(Object.assign({}, timeSeriesAxisChart.lineTimeSeries15secondsOptions));
export var zoomBarLineTimeSeriesInitDomainData = timeSeriesAxisChart.lineTimeSeriesData15seconds;
export var zoomBarLineTimeSeriesInitDomainOptions = addZoomBarToOptions(Object.assign({}, timeSeriesAxisChart.lineTimeSeries15secondsOptions), { sliderView: true });
zoomBarLineTimeSeriesInitDomainOptions.title += ' (initial zoomed domain)';
zoomBarLineTimeSeriesInitDomainOptions.zoomBar.top.initialZoomDomain = initialZoomDomain;
export var zoomBarStringDateData = {
    labels: ['Qty'],
    datasets: [
        {
            label: 'Dataset 1',
            data: [
                {
                    date: '2020-12-10T15:59:15.000Z',
                    value: 10,
                },
                {
                    date: '2020-12-10T15:59:30.000Z',
                    value: 15,
                },
                {
                    date: '2020-12-10T15:59:45.000Z',
                    value: 7,
                },
                {
                    date: '2020-12-10T16:00:00.000Z',
                    value: 2,
                },
                {
                    date: '2020-12-10T16:00:15.000Z',
                    value: 9,
                },
                {
                    date: '2020-12-10T16:00:30.000Z',
                    value: 13,
                },
                {
                    date: '2020-12-10T16:00:45.000Z',
                    value: 8,
                },
            ],
        },
    ],
};
export var zoomBarStringDateOptions = addZoomBarToOptions({
    title: 'String dates',
    axes: {
        left: {},
        bottom: {
            scaleType: 'time',
        },
    },
});
zoomBarStringDateOptions.zoomBar.top.initialZoomDomain = [
    '2020-12-10T15:59:25.000Z',
    '2020-12-10T16:00:25.000Z',
];
zoomBarStringDateOptions.zoomBar.top.data = [
    {
        date: '2020-12-10T15:59:15.000Z',
        value: 15,
    },
    {
        date: '2020-12-10T15:59:30.000Z',
        value: 10,
    },
    {
        date: '2020-12-10T15:59:45.000Z',
        value: 2,
    },
    {
        date: '2020-12-10T16:00:00.000Z',
        value: 15,
    },
    {
        date: '2020-12-10T16:00:15.000Z',
        value: 13,
    },
    {
        date: '2020-12-10T16:00:30.000Z',
        value: 3,
    },
    {
        date: '2020-12-10T16:00:45.000Z',
        value: 10,
    },
];
export var zoomBarLockedData = [];
export var zoomBarLockedOptions = addZoomBarToOptions(Object.assign({
    data: {
        loading: true,
    },
}, barChart.stackedBarTimeSeriesOptions), { includeDefinedZoomBarData: true });
zoomBarLockedOptions.title = 'Zoom bar (Locked)';
zoomBarLockedOptions.zoomBar.top.locked = true;
zoomBarLockedOptions.zoomBar.top.initialZoomDomain = [
    new Date(2019, 0, 3),
    new Date(2019, 0, 15),
];
// assume no data set while loading is true
export var zoomBarSkeletonData = [];
export var zoomBarSkeletonOptions = addZoomBarToOptions(Object.assign({
    data: {
        loading: true,
    },
}, barChart.stackedBarTimeSeriesOptions));
zoomBarSkeletonOptions['title'] = 'Zoom bar (skeleton)';
zoomBarSkeletonOptions.zoomBar.top.loading = true;
//# sourceMappingURL=../../../demo/data/zoom-bar.js.map