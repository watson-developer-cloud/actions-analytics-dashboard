import { lineData, lineOptions, lineTimeSeriesData, lineTimeSeriesOptions, } from './line';
export var stepOptions = Object.assign({}, lineOptions, {
    title: 'Step (discrete)',
    curve: 'curveStepAfter',
});
export var stepData = lineData;
export var stepTimeSeriesOptions = Object.assign({}, lineTimeSeriesOptions, {
    title: 'Step (time series)',
    curve: 'curveStepAfter',
});
export var stepTimeSeriesData = lineTimeSeriesData;
// step - empty state
export var stepEmptyStateData = [];
export var stepEmptyStateOptions = Object.assign({}, lineTimeSeriesOptions, {
    title: 'Step (empty state)',
    curve: 'curveStepAfter',
});
// step - skeleton
export var stepSkeletonData = [];
export var stepSkeletonOptions = Object.assign({}, lineTimeSeriesOptions, {
    title: 'Step (skeleton)',
    curve: 'curveStepAfter',
    data: {
        loading: true,
    },
});
//# sourceMappingURL=../../../demo/data/step.js.map