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
import { Tools } from '../../tools';
import { DOMUtils } from '../../services';
// D3 Imports
import { axisBottom, axisLeft } from 'd3-axis';
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    function Grid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'grid';
        return _this;
    }
    Grid.prototype.render = function (animate) {
        if (animate === void 0) { animate = true; }
        var isXGridEnabled = Tools.getProperty(this.getOptions(), 'grid', 'x', 'enabled');
        var isYGridEnabled = Tools.getProperty(this.getOptions(), 'grid', 'y', 'enabled');
        // Draw the backdrop
        this.drawBackdrop(isXGridEnabled, isYGridEnabled);
        if (!isXGridEnabled && !isYGridEnabled) {
            return;
        }
        if (isXGridEnabled) {
            DOMUtils.appendOrSelect(this.backdrop, 'g.x.grid');
            this.drawXGrid(animate);
        }
        if (isYGridEnabled) {
            DOMUtils.appendOrSelect(this.backdrop, 'g.y.grid');
            this.drawYGrid(animate);
        }
    };
    Grid.prototype.drawXGrid = function (animate) {
        var svg = this.parent;
        var height = this.backdrop.attr('height');
        var mainXScale = this.services.cartesianScales.getMainXScale();
        var xGrid = axisBottom(mainXScale)
            .tickSizeInner(-height)
            .tickSizeOuter(0);
        // if the main range axis has a custom domain, align the gridlines to the ticks
        var alignToTicks = Tools.getProperty(this.getOptions(), 'grid', 'x', 'alignWithAxisTicks');
        if (alignToTicks) {
            var mainXPosition = this.services.cartesianScales.getDomainAxisPosition();
            var customDomain = Tools.getProperty(this.getOptions(), 'axes', mainXPosition, 'ticks', 'values');
            // use custom domain if there is one
            // otherwise d3 defaults to using one gridline per tick
            if (customDomain) {
                xGrid.tickValues(customDomain);
            }
        }
        else {
            // Determine number of ticks
            var numberOfTicks = Tools.getProperty(this.getOptions(), 'grid', 'x', 'numberOfTicks');
            xGrid.ticks(numberOfTicks);
        }
        var g = svg
            .select('.x.grid')
            .attr('transform', "translate(" + -this.backdrop.attr('x') + ", " + height + ")");
        if (animate) {
            var transition = this.services.transitions.getTransition('grid-update');
            g.transition(transition).call(xGrid);
        }
        else {
            g.call(xGrid);
        }
        this.cleanGrid(g);
    };
    Grid.prototype.drawYGrid = function (animate) {
        var svg = this.parent;
        var width = this.backdrop.attr('width');
        var mainYScale = this.services.cartesianScales.getMainYScale();
        var yGrid = axisLeft(mainYScale)
            .tickSizeInner(-width)
            .tickSizeOuter(0);
        // if the main range axis has a custom domain, align the gridlines to the ticks
        var alignToTicks = Tools.getProperty(this.getOptions(), 'grid', 'y', 'alignWithAxisTicks');
        if (alignToTicks) {
            var mainYPosition = this.services.cartesianScales.getRangeAxisPosition();
            var customDomain = Tools.getProperty(this.getOptions(), 'axes', mainYPosition, 'ticks', 'values');
            // use custom domain if there is one
            // otherwise d3 defaults to using one gridline per tick
            if (customDomain) {
                yGrid.tickValues(customDomain);
            }
        }
        else {
            // Determine number of ticks
            var numberOfTicks = Tools.getProperty(this.getOptions(), 'grid', 'y', 'numberOfTicks');
            yGrid.ticks(numberOfTicks);
        }
        var g = svg
            .select('.y.grid')
            .attr('transform', "translate(0, " + -this.backdrop.attr('y') + ")");
        if (animate) {
            var transition = this.services.transitions.getTransition('grid-update');
            g.transition(transition).call(yGrid);
        }
        else {
            g.call(yGrid);
        }
        this.cleanGrid(g);
    };
    /**
     * Returns the threshold for the gridline tooltips based on the mouse location.
     * Calculated based on the mouse position between the two closest gridlines or edges of chart.
     */
    Grid.prototype.getGridlineThreshold = function (mousePos) {
        // use the space between axis grid ticks to adjust the threshold for the tooltips
        var svg = this.parent;
        // sort in ascending x translation value order
        var gridlinesX = svg
            .selectAll('.x.grid .tick')
            .nodes()
            .sort(function (a, b) {
            return (Number(Tools.getTranslationValues(a).tx) -
                Number(Tools.getTranslationValues(b).tx));
        });
        // find the 2 gridlines on either side of the mouse
        var floor = -1;
        var ceiling;
        if (!gridlinesX.length) {
            return;
        }
        gridlinesX.forEach(function (line, i) {
            if (mousePos[0] >= +Tools.getTranslationValues(line).tx) {
                floor++;
            }
        });
        ceiling = floor + 1 < gridlinesX.length ? floor + 1 : gridlinesX.length;
        // get the 'step' between chart gridlines
        var line1 = gridlinesX[floor];
        var line2 = gridlinesX[ceiling];
        var lineSpacing;
        // if the mouse is on edge of charts (mouseX < first gridline || mouseX > last gridline)
        // we can use the chart edge to determind the threshold for the gridlines
        if (!line1) {
            // we are between the first gridline and the chart edge
            lineSpacing = +Tools.getTranslationValues(line2).tx;
        }
        else if (!line2) {
            // we need to use the chart right bounds in case there isnt a domain axis
            var gridElement = svg.select('rect.chart-grid-backdrop').node();
            var width = DOMUtils.getSVGElementSize(gridElement).width;
            lineSpacing = width - +Tools.getTranslationValues(line1).tx;
        }
        else {
            // there are two gridlines to use
            lineSpacing =
                +Tools.getTranslationValues(line2).tx -
                    +Tools.getTranslationValues(line1).tx;
        }
        var threshold = this.getOptions().tooltip.gridline.threshold;
        // return the threshold
        return lineSpacing * threshold;
    };
    /**
     * Returns the active gridlines based on the gridline threshold and mouse position.
     * @param position mouse positon
     */
    Grid.prototype.getActiveGridline = function (position) {
        var userSpecifiedThreshold = Tools.getProperty(this.getOptions, 'tooltip', 'gridline', 'threshold');
        var threshold = userSpecifiedThreshold
            ? userSpecifiedThreshold
            : this.getGridlineThreshold(position);
        var svg = this.parent;
        var xGridlines = svg.selectAll('.x.grid .tick').filter(function () {
            var translations = Tools.getTranslationValues(this);
            // threshold for when to display a gridline tooltip
            var bounds = {
                min: Number(translations.tx) - threshold,
                max: Number(translations.tx) + threshold,
            };
            return bounds.min <= position[0] && position[0] <= bounds.max;
        });
        return xGridlines;
    };
    Grid.prototype.drawBackdrop = function (isXGridEnabled, isYGridEnabled) {
        var svg = this.parent;
        var mainXScale = this.services.cartesianScales.getMainXScale();
        var mainYScale = this.services.cartesianScales.getMainYScale();
        var _a = mainXScale.range(), xScaleStart = _a[0], xScaleEnd = _a[1];
        var _b = mainYScale.range(), yScaleEnd = _b[0], yScaleStart = _b[1];
        // Get height from the grid
        this.backdrop = DOMUtils.appendOrSelect(svg, 'svg.chart-grid-backdrop');
        var backdropRect = DOMUtils.appendOrSelect(this.backdrop, isXGridEnabled || isYGridEnabled
            ? 'rect.chart-grid-backdrop.stroked'
            : 'rect.chart-grid-backdrop');
        this.backdrop
            .merge(backdropRect)
            .attr('x', xScaleStart)
            .attr('y', yScaleStart)
            .attr('width', Math.abs(xScaleEnd - xScaleStart))
            .attr('height', Math.abs(yScaleEnd - yScaleStart))
            .lower();
        backdropRect.attr('width', '100%').attr('height', '100%');
    };
    Grid.prototype.cleanGrid = function (g) {
        // Remove extra elements
        g.selectAll('text').remove();
        g.select('.domain').remove();
    };
    return Grid;
}(Component));
export { Grid };
//# sourceMappingURL=../../../src/components/axes/grid.js.map