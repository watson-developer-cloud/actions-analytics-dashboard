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
import { Service } from './service';
import { Events } from './../interfaces/enums';
import * as Configuration from '../configuration';
// Services
import { DOMUtils } from './index';
import { select } from 'd3-selection';
var CanvasZoom = /** @class */ (function (_super) {
    __extends(CanvasZoom, _super);
    function CanvasZoom() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * focal:  object to zoom into
     * canvasElements: all the elements to translate and zoom on the chart area
     * zoomSettings: object containing duration, easing and zoomlevel for the zoom behaviours
     *  */
    CanvasZoom.prototype.zoomIn = function (focal, canvasElements, zoomSettings) {
        var x;
        var y;
        var zoomLevel;
        var settings = zoomSettings
            ? zoomSettings
            : Configuration.canvasZoomSettings;
        if (focal) {
            x = focal.x;
            y = focal.y;
            zoomLevel = 2;
        }
        // the 'viewport' size of the chart
        var _a = DOMUtils.getSVGElementSize(this.services.domUtils.getHolder(), {
            useClientDimensions: true,
        }), width = _a.width, height = _a.height;
        canvasElements
            .transition()
            .duration(settings.duration)
            .ease(settings.ease)
            .attr('transform', "translate(" + width / 2 + ", " + height / 2 + ") scale(" + zoomLevel + ") translate(" + -x + "," + -y + ")");
        // Dispatch canvas zoom in event
        this.services.events.dispatchEvent(Events.CanvasZoom.CANVAS_ZOOM_IN, {
            element: select(focal),
        });
    };
    CanvasZoom.prototype.zoomOut = function (canvasElements, zoomSettings) {
        var settings = zoomSettings
            ? zoomSettings
            : Configuration.canvasZoomSettings;
        canvasElements
            .transition()
            .duration(settings.duration)
            .ease(settings.ease)
            .attr('transform', '');
        // Dispatch canvas zoom out event
        this.services.events.dispatchEvent(Events.CanvasZoom.CANVAS_ZOOM_OUT);
    };
    return CanvasZoom;
}(Service));
export { CanvasZoom };
//# sourceMappingURL=../../src/services/canvas-zoom.js.map