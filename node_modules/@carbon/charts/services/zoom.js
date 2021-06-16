var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Internal Imports
import { AxisPositions, Events, ScaleTypes } from '../interfaces';
import { Service } from './service';
import { Tools } from '../tools';
import * as Configuration from '../configuration';
// D3 imports
import { extent } from 'd3-array';
var Zoom = /** @class */ (function (_super) {
    __extends(Zoom, _super);
    function Zoom() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Zoom.prototype.isZoomBarEnabled = function () {
        // CartesianScales service is only available in axis charts
        if (!this.services.cartesianScales) {
            return false;
        }
        // @todo - need to update this if zoom bar in other position (bottom, left, right) is supported
        // check configuration
        if (!Tools.getProperty(this.model.getOptions(), 'zoomBar', 'top', 'enabled')) {
            return false;
        }
        // @todo - Zoom Bar only supports main axis at BOTTOM axis and time scale for now
        this.services.cartesianScales.findDomainAndRangeAxes(); // need to do this before getMainXAxisPosition()
        var mainXAxisPosition = this.services.cartesianScales.getMainXAxisPosition();
        var mainXScaleType = Tools.getProperty(this.model.getOptions(), 'axes', mainXAxisPosition, 'scaleType');
        return (mainXAxisPosition === AxisPositions.BOTTOM &&
            mainXScaleType === ScaleTypes.TIME);
    };
    // get display data for zoom bar
    // basically it's sum of value grouped by time
    Zoom.prototype.getZoomBarData = function () {
        var customZoomBarData = this.model.getZoomBarData();
        // if user already defines zoom bar data, use it
        if (customZoomBarData && customZoomBarData.length > 1) {
            return customZoomBarData;
        }
        else {
            // use displayData if not defined
            return this.model.getDisplayData();
        }
    };
    Zoom.prototype.getDefaultZoomBarDomain = function (zoomBarData) {
        var allZoomBarData = zoomBarData || this.services.zoom.getZoomBarData();
        var cartesianScales = this.services.cartesianScales;
        var mainXAxisPosition = cartesianScales.getMainXAxisPosition();
        var domainIdentifier = cartesianScales.getDomainIdentifier();
        // default to full range with extended domain
        return cartesianScales.extendsDomain(mainXAxisPosition, extent(allZoomBarData, function (d) { return d[domainIdentifier]; }));
    };
    Zoom.prototype.handleDomainChange = function (newDomain, configs) {
        if (configs === void 0) { configs = { dispatchEvent: true }; }
        this.model.set({ zoomDomain: newDomain }, { animate: false });
        if (configs.dispatchEvent) {
            this.services.events.dispatchEvent(Events.ZoomDomain.CHANGE, {
                newDomain: newDomain,
            });
        }
    };
    Zoom.prototype.getZoomRatio = function () {
        return Tools.getProperty(this.model.getOptions(), 'zoomBar', 'zoomRatio');
    };
    // filter out data not inside zoom domain
    // to get better range value for axis label
    Zoom.prototype.filterDataForRangeAxis = function (displayData, configs) {
        var zoomDomain = this.model.get('zoomDomain');
        var mergedConfigs = Object.assign({ stacked: false }, // default configs
        configs);
        var shouldUpdateRangeAxis = Tools.getProperty(this.model.getOptions(), 'zoomBar', 'updateRangeAxis');
        if (this.isZoomBarEnabled() && shouldUpdateRangeAxis && zoomDomain) {
            var domainIdentifier_1 = mergedConfigs.stacked
                ? 'sharedStackKey'
                : this.services.cartesianScales.getDomainIdentifier();
            var filteredData = displayData.filter(function (datum) {
                return new Date(datum[domainIdentifier_1]) >= zoomDomain[0] &&
                    new Date(datum[domainIdentifier_1]) <= zoomDomain[1];
            });
            // if no data in zoom domain, use all data to get full range value
            // so only return filteredData if length > 0
            if (filteredData.length > 0) {
                return filteredData;
            }
        }
        // return original data by default
        return displayData;
    };
    Zoom.prototype.zoomIn = function (zoomRatio) {
        if (zoomRatio === void 0) { zoomRatio = this.getZoomRatio(); }
        // get current zoomDomain
        var currentZoomDomain = this.model.get('zoomDomain');
        var handleWidth = Configuration.zoomBar.handleWidth;
        var xScale = this.services.cartesianScales.getMainXScale().copy();
        xScale.domain(this.getDefaultZoomBarDomain()); // reset domain to default full domain
        // use scale range (rather than domain) to calculate
        // current zoom bar handle x position
        var currentX0 = xScale(currentZoomDomain[0]);
        var currentX1 = xScale(currentZoomDomain[1]);
        // zoom bar handles are already too close
        if (currentX1 - currentX0 < handleWidth + 1) {
            return;
        }
        var fullRange = xScale.range();
        var gap = currentX1 - currentX0;
        var diff = Math.min(((fullRange[1] - fullRange[0]) / 2) * (zoomRatio / 2), gap / 2);
        // new zoom bar handle x position
        var newX0 = currentX0 + diff;
        var newX1 = currentX1 - diff;
        // if left handle becomes right side of right handle, just make them close to each other
        if (newX0 >= newX1) {
            newX0 = currentX0 + gap / 2 - handleWidth / 2;
            newX1 = currentX1 - gap / 2 + handleWidth / 2;
        }
        var newDomain = [xScale.invert(newX0), xScale.invert(newX1)];
        // only if zoomDomain needs update
        if (currentZoomDomain[0].valueOf() !== newDomain[0].valueOf() ||
            currentZoomDomain[1].valueOf() !== newDomain[1].valueOf()) {
            this.handleDomainChange(newDomain);
        }
    };
    Zoom.prototype.zoomOut = function (zoomRatio) {
        if (zoomRatio === void 0) { zoomRatio = this.getZoomRatio(); }
        // get current zoomDomain
        var currentZoomDomain = this.model.get('zoomDomain');
        var xScale = this.services.cartesianScales.getMainXScale().copy();
        xScale.domain(this.getDefaultZoomBarDomain()); // reset domain to default full domain
        // use scale range (rather than domain) to calculate
        // current zoom bar handle x position
        var currentX0 = xScale(currentZoomDomain[0]);
        var currentX1 = xScale(currentZoomDomain[1]);
        var fullRange = xScale.range();
        var diff = ((fullRange[1] - fullRange[0]) / 2) * (zoomRatio / 2);
        // new zoom bar handle x position
        // max to full range
        var newX0 = Math.max(currentX0 - diff, fullRange[0]);
        var newX1 = Math.min(currentX1 + diff, fullRange[1]);
        var newDomain = [xScale.invert(newX0), xScale.invert(newX1)];
        // only if zoomDomain needs update
        if (currentZoomDomain[0].valueOf() !== newDomain[0].valueOf() ||
            currentZoomDomain[1].valueOf() !== newDomain[1].valueOf()) {
            this.handleDomainChange(newDomain);
        }
    };
    Zoom.prototype.resetZoomDomain = function () {
        // get current zoomDomain
        var currentZoomDomain = this.model.get('zoomDomain');
        var newDomain = this.getDefaultZoomBarDomain();
        // only if zoomDomain needs update
        if (currentZoomDomain[0].valueOf() !== newDomain[0].valueOf() ||
            currentZoomDomain[1].valueOf() !== newDomain[1].valueOf()) {
            this.handleDomainChange(newDomain);
        }
    };
    // check if current zoom domain is already the min zoom domain
    // when toolbar is rendered, we don't render chart yet
    // don't depend on scale range
    Zoom.prototype.isMinZoomDomain = function () {
        // get current zoomDomain
        var currentZoomDomain = this.model.get('zoomDomain');
        // assume the max zoom domain is the default zoom bar domain
        var maxZoomDomain = this.getDefaultZoomBarDomain();
        if (!currentZoomDomain || !maxZoomDomain) {
            return false;
        }
        var currentZoomDomainPeriod = currentZoomDomain[1].valueOf() - currentZoomDomain[0].valueOf();
        var maxZoomDomainPeriod = maxZoomDomain[1].valueOf() - maxZoomDomain[0].valueOf();
        var minZoomRatio = Tools.getProperty(this.model.getOptions(), 'zoomBar', 'minZoomRatio');
        // if current zoom domain is already smaller than minZoomRatio
        if (currentZoomDomainPeriod / maxZoomDomainPeriod < minZoomRatio) {
            return true;
        }
        return false;
    };
    // check if current zoom domain is already the max zoom domain
    Zoom.prototype.isMaxZoomDomain = function () {
        // get current zoom domain
        var currentZoomDomain = this.model.get('zoomDomain');
        // assume the max zoom domain is the default zoom bar domain
        var maxZoomDomain = this.getDefaultZoomBarDomain();
        if (currentZoomDomain &&
            maxZoomDomain &&
            currentZoomDomain[0].valueOf() === maxZoomDomain[0].valueOf() &&
            currentZoomDomain[1].valueOf() === maxZoomDomain[1].valueOf()) {
            return true;
        }
        return false;
    };
    Zoom.prototype.isEmptyState = function () {
        return this.getZoomBarData().length === 0;
    };
    Zoom.prototype.isZoomBarLoading = function (position) {
        return Tools.getProperty(this.model.getOptions(), 'zoomBar', position, 'loading');
    };
    Zoom.prototype.isZoomBarLocked = function (position) {
        return Tools.getProperty(this.model.getOptions(), 'zoomBar', position, 'locked');
    };
    return Zoom;
}(Service));
export { Zoom };
//# sourceMappingURL=../../src/services/zoom.js.map