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
import { Component } from '../component';
import { AxisPositions } from '../../interfaces';
import { Axis } from './axis';
import { Tools } from '../../tools';
import { DOMUtils } from '../../services';
import { Events } from './../../interfaces';
var TwoDimensionalAxes = /** @class */ (function (_super) {
    __extends(TwoDimensionalAxes, _super);
    function TwoDimensionalAxes() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = '2D-axes';
        _this.children = {};
        _this.thresholds = [];
        _this.margins = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        };
        return _this;
    }
    TwoDimensionalAxes.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = false; }
        var axes = {};
        var axisPositions = Object.keys(AxisPositions);
        var axesOptions = Tools.getProperty(this.getOptions(), 'axes');
        axisPositions.forEach(function (axisPosition) {
            var axisOptions = axesOptions[AxisPositions[axisPosition]];
            if (axisOptions) {
                axes[AxisPositions[axisPosition]] = true;
            }
        });
        this.configs.axes = axes;
        // Check the configs to know which axes need to be rendered
        axisPositions.forEach(function (axisPositionKey) {
            var axisPosition = AxisPositions[axisPositionKey];
            if (_this.configs.axes[axisPosition] &&
                !_this.children[axisPosition]) {
                var axisComponent = new Axis(_this.model, _this.services, {
                    position: axisPosition,
                    axes: _this.configs.axes,
                    margins: _this.margins,
                });
                // Set model, services & parent for the new axis component
                axisComponent.setModel(_this.model);
                axisComponent.setServices(_this.services);
                axisComponent.setParent(_this.parent);
                _this.children[axisPosition] = axisComponent;
            }
        });
        Object.keys(this.children).forEach(function (childKey) {
            var child = _this.children[childKey];
            child.render(animate);
        });
        var margins = {};
        Object.keys(this.children).forEach(function (childKey) {
            var child = _this.children[childKey];
            var axisPosition = child.configs.position;
            // Grab the invisibly rendered axis' width & height, and set margins
            // Based off of that
            // We draw the invisible axis because of the async nature of d3 transitions
            // To be able to tell the final width & height of the axis when initiaing the transition
            // The invisible axis is updated instantly and without a transition
            var invisibleAxisRef = child.getInvisibleAxisRef();
            var _a = DOMUtils.getSVGElementSize(invisibleAxisRef, { useBBox: true }), width = _a.width, height = _a.height;
            var offset;
            if (child.getTitleRef().empty()) {
                offset = 0;
            }
            else {
                offset = DOMUtils.getSVGElementSize(child.getTitleRef(), {
                    useBBox: true,
                }).height;
                if (axisPosition === AxisPositions.LEFT ||
                    axisPosition === AxisPositions.RIGHT) {
                    offset += 5;
                }
            }
            switch (axisPosition) {
                case AxisPositions.TOP:
                    margins.top = height + offset;
                    break;
                case AxisPositions.BOTTOM:
                    margins.bottom = height + offset;
                    break;
                case AxisPositions.LEFT:
                    margins.left = width + offset;
                    break;
                case AxisPositions.RIGHT:
                    margins.right = width + offset;
                    break;
            }
        });
        // If the new margins are different than the existing ones
        var isNotEqual = Object.keys(margins).some(function (marginKey) {
            return _this.margins[marginKey] !== margins[marginKey];
        });
        if (isNotEqual) {
            this.margins = Object.assign(this.margins, margins);
            // also set new margins to model to allow external components to access
            this.model.set({ axesMargins: this.margins }, { skipUpdate: true });
            this.services.events.dispatchEvent(Events.ZoomBar.UPDATE);
            Object.keys(this.children).forEach(function (childKey) {
                var child = _this.children[childKey];
                child.margins = _this.margins;
            });
            this.render(true);
        }
    };
    return TwoDimensionalAxes;
}(Component));
export { TwoDimensionalAxes };
//# sourceMappingURL=../../../src/components/axes/two-dimensional-axes.js.map