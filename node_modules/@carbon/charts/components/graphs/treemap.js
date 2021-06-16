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
import { DOMUtils } from '../../services';
import { Events, ColorClassNameTypes } from '../../interfaces';
import { Tools } from '../../tools';
// D3 Imports
import { hierarchy as d3Hierarchy, treemap as d3Treemap } from 'd3-hierarchy';
import { sum } from 'd3-array';
import { hsl, color } from 'd3-color';
import { select } from 'd3-selection';
// Carbon colors
import { colors } from '@carbon/colors';
var findColorShade = function (hex) {
    if (!hex) {
        return null;
    }
    for (var _i = 0, _a = Object.keys(colors); _i < _a.length; _i++) {
        var colorName = _a[_i];
        var colorShades = colors[colorName];
        for (var _b = 0, _c = Object.keys(colorShades); _b < _c.length; _b++) {
            var colorShadeLevel = _c[_b];
            var colorShade = colorShades[colorShadeLevel];
            if (colorShade === hex) {
                return colorShadeLevel;
            }
        }
    }
    return null;
};
var textFillColor = function () {
    var correspondingLeaf = select(this.parentNode).select('rect.leaf');
    var correspondingLeafFill = getComputedStyle(correspondingLeaf.node(), null).getPropertyValue('fill');
    var cl = color(correspondingLeafFill);
    var colorShade;
    if (cl) {
        colorShade = findColorShade(cl ? cl.hex() : null);
    }
    if (colorShade === null || colorShade === undefined) {
        var lightness = hsl(cl).l;
        colorShade = Math.abs(lightness * 100 - 100);
    }
    return colorShade > 50 ? 'white' : 'black';
};
var uidCounter = 0;
var Treemap = /** @class */ (function (_super) {
    __extends(Treemap, _super);
    function Treemap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'treemap';
        _this.handleLegendOnHover = function (event) {
            var hoveredElement = event.detail.hoveredElement;
            _this.parent
                .selectAll("g[data-name='leaf']")
                .transition(_this.services.transitions.getTransition('legend-hover-treemap'))
                .attr('opacity', function (d) {
                return d.parent.data.name === hoveredElement.datum()['name'] ? 1 : 0.3;
            });
        };
        _this.handleLegendMouseOut = function (event) {
            _this.parent
                .selectAll("g[data-name='leaf']")
                .transition(_this.services.transitions.getTransition('legend-mouseout-treemap'))
                .attr('opacity', 1);
        };
        return _this;
    }
    Treemap.prototype.init = function () {
        var events = this.services.events;
        // Highlight correct circle on legend item hovers
        events.addEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        // Un-highlight circles on legend item mouseouts
        events.addEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    Treemap.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        var svg = this.getContainerSVG();
        var allData = this.model.getData();
        var displayData = this.model.getDisplayData();
        var options = this.model.getOptions();
        var windowLocation = Tools.getProperty(window, 'location');
        var _a = DOMUtils.getSVGElementSize(this.parent, {
            useAttrs: true,
        }), width = _a.width, height = _a.height;
        var hierarchy = d3Hierarchy({
            name: options.title || 'Treemap',
            children: displayData,
        })
            .sum(function (d) { return d.value; })
            .sort(function (a, b) { return b.value - a.value; });
        var total = sum(allData, function (d) {
            return sum(d.children, function (child) { return child.value; });
        });
        var root = d3Treemap()
            .size([width, height])
            .paddingInner(1)
            .paddingOuter(0)
            .round(true)(hierarchy);
        var transitions = this.services.transitions;
        var leafGroups = svg
            .selectAll("g[data-name='leaf']")
            .data(root.leaves(), function (leaf) { return leaf.data.name; });
        // Remove leaf groups that need to be removed
        leafGroups.exit().attr('opacity', 0).remove();
        // Add the leaf groups that need to be introduced
        var enteringLeafGroups = leafGroups
            .enter()
            .append('g')
            .attr('data-name', 'leaf')
            .attr('data-uid', function () { return uidCounter++; });
        var allLeafGroups = enteringLeafGroups.merge(leafGroups);
        allLeafGroups
            .attr('data-name', 'leaf')
            .transition(transitions.getTransition('treemap-group-update', animate))
            .attr('transform', function (d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });
        var rects = allLeafGroups.selectAll('rect.leaf').data(function (d) { return [d]; });
        rects.exit().attr('width', 0).attr('height', 0).remove();
        var enteringRects = rects
            .enter()
            .append('rect')
            .classed('leaf', true);
        enteringRects
            .merge(rects)
            .attr('width', 0)
            .attr('height', 0)
            .attr('id', function () {
            var uid = select(this.parentNode).attr('data-uid');
            return options.style.prefix + "-leaf-" + uid;
        })
            .attr('class', function (d) {
            while (d.depth > 1)
                d = d.parent;
            return _this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.FILL],
                dataGroupName: d.data.name,
                originalClassName: 'leaf',
            });
        })
            .transition(this.services.transitions.getTransition('treemap-leaf-update-enter', animate))
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style('fill', function (d) {
            while (d.depth > 1)
                d = d.parent;
            return _this.model.getFillColor(d.data.name);
        });
        // Update all clip paths
        allLeafGroups
            .selectAll('clipPath')
            .data(function (d) {
            if (d.data.showLabel !== true) {
                return [];
            }
            return [1];
        }, function (d) { return d; })
            .join(function (enter) {
            enter
                .append('clipPath')
                .attr('id', function () {
                var uid = select(this.parentNode).attr('data-uid');
                return options.style.prefix + "-clip-" + uid;
            })
                .append('use')
                .attr('xlink:href', function () {
                var uid = select(this.parentNode.parentNode).attr('data-uid');
                var leafID = options.style.prefix + "-leaf-" + uid;
                return new URL("#" + leafID, windowLocation) + '';
            });
        }, function (update) { return null; }, function (exit) { return exit.remove(); });
        // Update all titles
        allLeafGroups
            .selectAll('text')
            .data(function (d) {
            if (d.data.showLabel !== true) {
                return [];
            }
            var parent = d;
            while (parent.depth > 1)
                parent = parent.parent;
            var color = hsl(_this.model.getFillColor(parent.data.name));
            return [
                {
                    text: d.data.name,
                    color: color.l < 0.5 ? 'white' : 'black',
                },
            ];
        }, function (d) { return d; })
            .join(function (enter) {
            var addedText = enter
                .append('text')
                .text(function (d) { return d.text; })
                .style('fill', textFillColor)
                .attr('x', 7)
                .attr('y', 18);
            if (windowLocation) {
                addedText.attr('clip-path', function () {
                    var uid = select(this.parentNode).attr('data-uid');
                    var clipPathID = options.style.prefix + "-clip-" + uid;
                    return "url(" + (new URL("#" + clipPathID, windowLocation) + '') + ")";
                });
            }
        }, function (update) {
            return update.text(function (d) { return d.text; }).style('fill', textFillColor);
        }, function (exit) { return exit.remove(); });
        // Add event listeners to elements drawn
        this.addEventListeners();
    };
    Treemap.prototype.addEventListeners = function () {
        var self = this;
        this.parent
            .selectAll('rect.leaf')
            .on('mouseover', function (datum) {
            var hoveredElement = select(this);
            var fillColor = getComputedStyle(this, null).getPropertyValue('fill');
            var parent = datum;
            while (parent.depth > 1)
                parent = parent.parent;
            hoveredElement
                .transition(self.services.transitions.getTransition('graph_element_mouseover_fill_update'))
                .style('fill', function (d) {
                var customColor = self.model.getFillColor(d.parent.data.name);
                if (customColor) {
                    fillColor = customColor;
                }
                return color(fillColor).darker(0.7).toString();
            });
            // Show tooltip
            self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                hoveredElement: hoveredElement,
                items: [
                    {
                        color: fillColor,
                        label: parent.data.name,
                        bold: true,
                    },
                    {
                        label: datum.data.name,
                        value: datum.data.value,
                    },
                ],
            });
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Treemap.LEAF_MOUSEOVER, {
                element: hoveredElement,
                datum: datum,
            });
        })
            .on('mousemove', function (datum) {
            var hoveredElement = select(this);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Treemap.LEAF_MOUSEMOVE, {
                element: hoveredElement,
                datum: datum,
            });
            self.services.events.dispatchEvent(Events.Tooltip.MOVE);
        })
            .on('click', function (datum) {
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Treemap.LEAF_CLICK, {
                element: select(this),
                datum: datum,
            });
        })
            .on('mouseout', function (datum) {
            var hoveredElement = select(this);
            hoveredElement.classed('hovered', false);
            var parent = datum;
            while (parent.depth > 1)
                parent = parent.parent;
            hoveredElement
                .transition(self.services.transitions.getTransition('graph_element_mouseout_fill_update'))
                .style('fill', function (d) {
                return self.model.getFillColor(d.parent.data.name);
            });
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Treemap.LEAF_MOUSEOUT, {
                element: hoveredElement,
                datum: datum,
            });
            // Hide tooltip
            self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
                hoveredElement: hoveredElement,
            });
        });
    };
    return Treemap;
}(Component));
export { Treemap };
//# sourceMappingURL=../../../src/components/graphs/treemap.js.map