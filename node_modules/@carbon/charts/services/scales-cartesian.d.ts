import { Service } from './service';
import { AxisPositions, CartesianOrientations, ScaleTypes, ThresholdOptions } from '../interfaces';
export declare class CartesianScales extends Service {
    protected scaleTypes: {
        top: any;
        right: any;
        bottom: any;
        left: any;
    };
    protected scales: {
        top: any;
        right: any;
        bottom: any;
        left: any;
    };
    protected domainAxisPosition: AxisPositions;
    protected rangeAxisPosition: AxisPositions;
    protected secondaryDomainAxisPosition: AxisPositions;
    protected secondaryRangeAxisPosition: AxisPositions;
    protected dualAxes: Boolean;
    protected orientation: CartesianOrientations;
    getDomainAxisPosition({ datum }?: {
        datum?: any;
    }): AxisPositions;
    getRangeAxisPosition({ datum, groups }?: {
        datum?: any;
        groups?: any;
    }): AxisPositions;
    getAxisOptions(position: AxisPositions): any;
    getDomainAxisOptions(): any;
    getRangeAxisOptions(): any;
    update(animate?: boolean): void;
    findDomainAndRangeAxes(): void;
    determineOrientation(): void;
    isDualAxes(): Boolean;
    determineAxisDuality(): void;
    getOrientation(): CartesianOrientations;
    getScaleByPosition(axisPosition: AxisPositions): any;
    getScaleTypeByPosition(axisPosition: AxisPositions): any;
    getDomainAxisScaleType(): any;
    getRangeAxisScaleType(): any;
    getDomainScale(): any;
    getRangeScale(): any;
    getMainXAxisPosition(): AxisPositions;
    getMainYAxisPosition(): AxisPositions;
    getMainXScale(): any;
    getMainYScale(): any;
    getValueFromScale(scale: any, scaleType: ScaleTypes, axisPosition: AxisPositions, datum: any, index?: number): any;
    getBoundedScaledValues(datum: any, index?: number): any[];
    getValueThroughAxisPosition(axisPosition: AxisPositions, datum: any, index?: number): any;
    getDomainValue(d: any, i: any): any;
    getRangeValue(d: any, i: any): any;
    getMainXScaleType(): any;
    getMainYScaleType(): any;
    getDomainIdentifier(datum?: any): any;
    getRangeIdentifier(datum?: any): any;
    extendsDomain(axisPosition: AxisPositions, domain: any): Date[] | number[];
    protected findVerticalAxesPositions(): {
        primary: AxisPositions;
        secondary: AxisPositions;
    };
    protected findHorizontalAxesPositions(): {
        primary: AxisPositions;
        secondary: AxisPositions;
    };
    protected findDomainAndRangeAxesPositions(verticalAxesPositions: any, horizontalAxesPositions: any): {
        primaryDomainAxisPosition: any;
        secondaryDomainAxisPosition: any;
        primaryRangeAxisPosition: any;
        secondaryRangeAxisPosition: any;
    };
    protected getScaleDomain(axisPosition: AxisPositions): any;
    protected createScale(axisPosition: AxisPositions): any;
    protected getHighestDomainThreshold(): null | {
        threshold: ThresholdOptions;
        scaleValue: number;
    };
    protected getHighestRangeThreshold(): null | {
        threshold: ThresholdOptions;
        scaleValue: number;
    };
}
