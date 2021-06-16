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
import { ColorClassNameTypes, LegendItemType } from '../../interfaces/enums';
import { LegendOrientations, Roles, Events, TruncationTypes, } from '../../interfaces';
import { DOMUtils } from '../../services';
import * as Configuration from '../../configuration';
// D3 Imports
import { select, event } from 'd3-selection';
var Legend = /** @class */ (function (_super) {
    __extends(Legend, _super);
    function Legend() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'legend';
        return _this;
    }
    Legend.prototype.render = function () {
        var _this = this;
        var svg = this.getContainerSVG()
            .attr('role', Roles.GROUP)
            .attr('data-name', 'legend-items');
        var options = this.getOptions();
        var legendOptions = Tools.getProperty(options, 'legend');
        var dataGroups = this.model.getDataGroups();
        var legendOrder = Tools.getProperty(legendOptions, 'order');
        if (legendOrder) {
            dataGroups = this.sortDataGroups(dataGroups, legendOrder);
        }
        var legendItems = svg
            .selectAll('g.legend-item')
            .data(dataGroups, function (dataGroup) { return dataGroup.name; });
        var addedLegendItems = legendItems
            .enter()
            .append('g')
            .classed('legend-item', true)
            .classed('active', function (d, i) {
            return d.status === Configuration.legend.items.status.ACTIVE;
        });
        var legendClickable = Tools.getProperty(this.getOptions(), 'legend', 'clickable');
        svg.classed('clickable', legendClickable);
        var checkboxRadius = Configuration.legend.checkbox.radius;
        addedLegendItems
            .append('rect')
            .classed('checkbox', true)
            .merge(legendItems.select('rect.checkbox'))
            .attr('role', Roles.CHECKBOX)
            .attr('tabindex', legendClickable ? 0 : -1)
            .attr('aria-label', function (d) { return d.name; })
            .attr('aria-checked', function (_a) {
            var status = _a.status;
            return status === Configuration.legend.items.status.ACTIVE;
        })
            .attr('width', checkboxRadius * 2)
            .attr('height', checkboxRadius * 2)
            .attr('rx', 1)
            .attr('ry', 1)
            .attr('class', function (d, i) {
            return _this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.FILL],
                dataGroupName: d.name,
                originalClassName: 'checkbox',
            });
        })
            .style('fill', function (d) {
            return d.status === Configuration.legend.items.status.ACTIVE
                ? _this.model.getFillColor(d.name) ||
                    _this.model.getStrokeColor(d.name)
                : null;
        })
            .classed('active', function (d, i) {
            return d.status === Configuration.legend.items.status.ACTIVE;
        });
        var addedLegendItemsText = addedLegendItems
            .append('text')
            .merge(legendItems.select('text'));
        this.truncateLegendText(addedLegendItemsText);
        // Keep track of line numbers and positions
        var itemConfig = {
            startingPoint: 0,
            itemIndexInLine: 0,
            lineNumber: 0,
            lastLegendItemTextWidth: 0,
        };
        this.breakItemsIntoLines(addedLegendItems, 'legend-item', itemConfig);
        var additionalItemsOption = Tools.getProperty(options, 'legend', 'additionalItems');
        // add additional legend items
        if (additionalItemsOption && dataGroups.length) {
            var self_1 = this;
            var additionalItems = svg
                .selectAll('g.additional-item')
                .data(additionalItemsOption);
            additionalItems.exit().remove();
            var addedAdditionalItems = additionalItems
                .enter()
                .append('g')
                .merge(additionalItems)
                .classed('additional-item', true);
            // remove nested child elements that no longer needed
            addedAdditionalItems.selectAll('*').remove();
            // get index of item with same type to assign distinct classname
            var previousType_1;
            var indexOfItem_1 = 1;
            // add different type of legend items
            addedAdditionalItems
                .append('g')
                .classed('icon', true)
                .each(function (d, i) {
                var additionalItem = select(this);
                if (!previousType_1 || previousType_1 != d.type) {
                    previousType_1 = d.type;
                    indexOfItem_1 = 1;
                }
                else {
                    indexOfItem_1++;
                }
                self_1.addAdditionalItem(additionalItem, d, indexOfItem_1);
            });
            var addedAdditionalItemsText = addedAdditionalItems
                .append('text')
                .merge(addedAdditionalItems.select('text'));
            self_1.truncateLegendText(addedAdditionalItemsText);
            this.breakItemsIntoLines(addedAdditionalItems, 'additional-item', itemConfig);
        }
        // Remove old elements as needed.
        legendItems
            .exit()
            .on('mouseover', null)
            .on('click', null)
            .on('mouseout', null)
            .remove();
        if (legendClickable && addedLegendItems.size() > 0) {
            this.addEventListeners();
        }
        var alignment = Tools.getProperty(legendOptions, 'alignment');
        var alignmentOffset = DOMUtils.getAlignmentOffset(alignment, svg, this.getParent());
        svg.attr('transform', "translate(" + alignmentOffset + ", 0)");
    };
    Legend.prototype.sortDataGroups = function (dataGroups, legendOrder) {
        // Sort data in user defined order
        dataGroups.sort(function (dataA, dataB) {
            return legendOrder.indexOf(dataA.name) -
                legendOrder.indexOf(dataB.name);
        });
        // If user only defined partial ordering, ordered items are placed before unordered ones
        if (legendOrder.length < dataGroups.length) {
            var definedOrderIndex = dataGroups.length - legendOrder.length;
            var definedOrder = dataGroups.slice(definedOrderIndex);
            return definedOrder.concat(dataGroups.slice(0, definedOrderIndex));
        }
        return dataGroups;
    };
    Legend.prototype.addAdditionalItem = function (additionalItem, itemConfig, indexOfItem) {
        var _a = Configuration.legend.area, width = _a.width, height = _a.height;
        if (itemConfig.type === LegendItemType.RADIUS) {
            var _b = Configuration.legend.radius, iconData = _b.iconData, fill = _b.fill, stroke = _b.stroke;
            var circleEnter = additionalItem
                .attr('fill', 'none')
                .selectAll('circle')
                .data(iconData)
                .enter();
            circleEnter
                .append('circle')
                .classed('radius', true)
                .attr('role', Roles.IMG)
                .attr('aria-label', 'radius')
                .attr('cx', function (d) { return d.cx; })
                .attr('cy', function (d) { return d.cy; })
                .attr('r', function (d) { return d.r; })
                .style('fill', itemConfig.fill ? itemConfig.fill : fill)
                .style('stroke', itemConfig.stroke ? itemConfig.stroke : stroke);
        }
        else if (itemConfig.type === LegendItemType.LINE) {
            var lineConfig = Configuration.legend.line;
            if (additionalItem.select('line.line').empty()) {
                additionalItem
                    .append('line')
                    .classed("line-" + indexOfItem, true)
                    .attr('role', Roles.IMG)
                    .attr('aria-label', 'line')
                    .attr('x1', 0)
                    .attr('y1', lineConfig.yPosition)
                    .attr('x2', width)
                    .attr('y2', lineConfig.yPosition)
                    .style('stroke', itemConfig.stroke
                    ? itemConfig.stroke
                    : lineConfig.stroke)
                    .style('stroke-width', lineConfig.strokeWidth);
            }
        }
        else if (itemConfig.type === LegendItemType.AREA) {
            if (additionalItem.select('rect.area').empty()) {
                additionalItem
                    .append('rect')
                    .classed("area-" + indexOfItem, true)
                    .attr('role', Roles.IMG)
                    .attr('aria-label', 'area')
                    .attr('width', width)
                    .attr('height', height)
                    .style('fill', indexOfItem > 3 && !itemConfig.fill
                    ? Configuration.legend.area.fill
                    : itemConfig.fill)
                    .style('stroke', itemConfig.stroke);
            }
        }
        else if (itemConfig.type === LegendItemType.SIZE) {
            var _c = Configuration.legend.size, iconData = _c.iconData, fill = _c.fill, stroke = _c.stroke;
            var sizeEnter = additionalItem
                .attr('fill', 'none')
                .attr('role', Roles.IMG)
                .attr('aria-label', 'size')
                .selectAll('rect')
                .data(iconData)
                .enter();
            sizeEnter
                .append('rect')
                .classed('size', true)
                .attr('width', function (d) { return d.width; })
                .attr('height', function (d) { return d.height; })
                .attr('y', function (d) { return 24 - d.height; })
                .style('fill', itemConfig.fill ? itemConfig.fill : fill)
                .style('stroke', itemConfig.stroke ? itemConfig.stroke : stroke)
                .style('stroke-width', 1);
        }
        else if (itemConfig.type === LegendItemType.QUARTILE) {
            var iconData = Configuration.legend.quartile.iconData;
            var quartileEnter = additionalItem
                .selectAll('rect')
                .attr('role', Roles.IMG)
                .attr('aria-label', 'quartile')
                .data(iconData)
                .enter();
            quartileEnter
                .append('rect')
                .attr('class', function (d, i) { return "quartile-" + (i === 0 ? 'wrapper' : 'line'); })
                .attr('x', function (d) { return d.x; })
                .attr('y', function (d) { return d.y; })
                .attr('width', function (d) { return d.width; })
                .attr('height', function (d) { return d.height; });
        }
        else if (itemConfig.type === LegendItemType.ZOOM) {
            var _d = Tools.getProperty(Configuration, 'legend', 'zoom'), iconData = _d.iconData, color_1 = _d.color;
            var zoomEnter = additionalItem
                .attr('role', Roles.IMG)
                .attr('aria-label', 'zoom')
                .selectAll('g.icon')
                .data(iconData)
                .enter();
            // add '+' for the magnifying icon
            zoomEnter
                .append('g')
                .attr('x', function (d) { return d.x; })
                .attr('y', function (d) { return d.y; })
                .attr('width', function (d) { return d.width; })
                .attr('height', function (d) { return d.height; })
                .append('polygon')
                .attr('points', '7.7 4.82 5.78 4.82 5.78 2.89 4.82 2.89 4.82 4.82 2.89 4.82 2.89 5.78 4.82 5.78 4.82 7.7 5.78 7.7 5.78 5.78 7.7 5.78 7.7 4.82')
                .attr('fill', function (d) {
                return itemConfig.color ? itemConfig.color : color_1;
            });
            // add the magnifying zoom icon handle/circle
            zoomEnter
                .append('path')
                .attr('d', 'M9.36,8.67A5.22,5.22,0,0,0,10.59,5.3,5.3,5.3,0,1,0,5.3,10.59,5.22,5.22,0,0,0,8.67,9.36L12.32,13l.68-.68Zm-4.06,1A4.34,4.34,0,1,1,9.63,5.3,4.33,4.33,0,0,1,5.3,9.63Z')
                .attr('fill', function (d) {
                return itemConfig.color ? itemConfig.color : color_1;
            });
        }
    };
    Legend.prototype.truncateLegendText = function (addedLegendItemsText) {
        var trucationOptions = Tools.getProperty(this.getOptions(), 'legend', 'truncation');
        // Truncation
        // get user provided custom values for truncation
        var truncationType = Tools.getProperty(trucationOptions, 'type');
        var truncationThreshold = Tools.getProperty(trucationOptions, 'threshold');
        var truncationNumCharacter = Tools.getProperty(trucationOptions, 'numCharacter');
        // truncate the legend label if it's too long
        if (truncationType !== TruncationTypes.NONE) {
            addedLegendItemsText.html(function (d) {
                if (d.name.length > truncationThreshold) {
                    return Tools.truncateLabel(d.name, truncationType, truncationNumCharacter);
                }
                else {
                    return d.name;
                }
            });
        }
        else {
            addedLegendItemsText.html(function (d) { return d.name; });
        }
    };
    Legend.prototype.breakItemsIntoLines = function (addedLegendItems, className, itemConfig) {
        var self = this;
        var svg = this.getContainerSVG();
        // Check if there are disabled legend items
        var DISABLED = Configuration.legend.items.status.DISABLED;
        var dataGroups = this.model.getDataGroups();
        var hasDeactivatedItems = dataGroups.some(function (dataGroup) { return dataGroup.status === DISABLED; });
        addedLegendItems
            .merge(svg.selectAll("g." + className))
            .each(function (d) {
            var legendItem = select(this);
            var svgDimensions = DOMUtils.getSVGElementSize(self.parent, {
                useAttr: true,
            });
            // Set item position based on item type
            if (!d.type) {
                itemConfig.hasDeactivatedItems = hasDeactivatedItems;
                self.setLegendItemPosition(legendItem, svgDimensions, itemConfig, LegendItemType.CHECKBOX);
            }
            else {
                self.setLegendItemPosition(legendItem, svgDimensions, itemConfig, d.type);
            }
        });
    };
    Legend.prototype.setLegendItemPosition = function (legendItem, parentSVGDimension, itemConfig, itemType) {
        var legendOrientation = Tools.getProperty(this.getOptions(), 'legend', 'orientation');
        // Configs
        var legendItemsHorizontalSpacing = Configuration.legend.items.horizontalSpace;
        var legendItemsVerticalSpacing = Configuration.legend.items.verticalSpace;
        var legendTextYOffset = Configuration.legend.items.textYOffset;
        var iconWidth = itemType === LegendItemType.CHECKBOX ||
            itemType === LegendItemType.RADIUS ||
            itemType === LegendItemType.ZOOM
            ? Configuration.legend.checkbox.radius * 2
            : Configuration.legend.area.width;
        var spaceAfter = Configuration.legend.items.spaceAfter;
        var legendItemTextDimensions = DOMUtils.getSVGElementSize(legendItem.select('text'), { useBBox: true });
        var translateOffset = Configuration.legend.area.width / 2 - 1;
        // Check and update position
        if (itemConfig.itemIndexInLine === 0 ||
            itemConfig.lastLegendItemTextWidth === 0 ||
            legendOrientation === LegendOrientations.VERTICAL) {
            if (itemConfig.itemIndexInLine > 0) {
                itemConfig.lineNumber++;
            }
        }
        else {
            itemConfig.startingPoint +=
                itemConfig.lastLegendItemTextWidth +
                    iconWidth +
                    spaceAfter +
                    legendItemsHorizontalSpacing;
            // Place legends in a new line if space is not enough
            if (itemConfig.startingPoint +
                iconWidth +
                spaceAfter +
                legendItemTextDimensions.width >
                parentSVGDimension.width) {
                itemConfig.lineNumber++;
                itemConfig.startingPoint =
                    iconWidth === 24 ? translateOffset : 0;
                itemConfig.itemIndexInLine = 0;
            }
        }
        itemConfig.lastLegendItemTextWidth = legendItemTextDimensions.width;
        var yPosition = itemConfig.lineNumber * legendItemsVerticalSpacing;
        var yTextPosition = legendTextYOffset + yPosition + 3;
        if (itemType === LegendItemType.CHECKBOX) {
            legendItem
                .select('rect.checkbox')
                .attr('x', itemConfig.startingPoint)
                .attr('y', yPosition);
            // Position text
            legendItem
                .select('text')
                .attr('x', itemConfig.startingPoint + iconWidth + spaceAfter)
                .attr('y', yTextPosition);
            // Test if legendItems are placed in the correct direction
            var testHorizontal = (!legendOrientation ||
                legendOrientation === LegendOrientations.HORIZONTAL) &&
                parseInt(legendItem.select('rect.checkbox').attr('y')) % 24 ===
                    0;
            var testVertical = legendOrientation === LegendOrientations.VERTICAL &&
                legendItem.select('rect.checkbox').attr('x') === '0';
            var hasCorrectLegendDirection = testHorizontal || testVertical;
            // Render checkbox check icon
            if (itemConfig.hasDeactivatedItems &&
                legendItem.select('g.check').empty() &&
                hasCorrectLegendDirection) {
                legendItem.append('g').classed('check', true).html("\n\t\t\t\t\t\t<svg focusable=\"false\" preserveAspectRatio=\"xMidYMid meet\"\n\t\t\t\t\t\t\txmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\"\n\t\t\t\t\t\t\tviewBox=\"0 0 32 32\" aria-hidden=\"true\"\n\t\t\t\t\t\t\tstyle=\"will-change: transform;\">\n\t\t\t\t\t\t\t<path d=\"M13 21.2l-7.1-7.1-1.4 1.4 7.1 7.1L13 24 27.1 9.9l-1.4-1.5z\"></path>\n\t\t\t\t\t\t\t<title>Checkmark</title>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t");
                legendItem
                    .select('g.check svg')
                    .attr('width', iconWidth - 1)
                    .attr('height', iconWidth - 1)
                    .attr('x', parseFloat(legendItem.select('rect.checkbox').attr('x')) + 0.5)
                    .attr('y', parseFloat(legendItem.select('rect.checkbox').attr('y')) + 0.5);
            }
            else if (!itemConfig.hasDeactivatedItems &&
                !legendItem.select('g.check').empty()) {
                legendItem.select('g.check').remove();
            }
        }
        else if (itemType === LegendItemType.RADIUS) {
            legendItem
                .selectAll('circle.radius')
                .attr('cx', function (d) { return itemConfig.startingPoint + d.cx; })
                .attr('cy', function (d) { return yPosition + d.cy; });
            legendItem
                .select('text')
                .attr('x', itemConfig.startingPoint + iconWidth + spaceAfter)
                .attr('y', yTextPosition);
        }
        else if (itemType === LegendItemType.SIZE) {
            legendItem
                .selectAll('g.icon')
                .attr('transform', "translate(" + (itemConfig.startingPoint - translateOffset) + ", " + (yPosition - 12) + ")");
            legendItem
                .select('text')
                .attr('x', itemConfig.startingPoint +
                iconWidth +
                spaceAfter -
                translateOffset)
                .attr('y', yTextPosition);
        }
        else if (itemType === LegendItemType.ZOOM) {
            legendItem
                .selectAll('g.icon')
                .attr('transform', "translate(" + itemConfig.startingPoint + ", " + yPosition + ")");
            legendItem
                .select('text')
                .attr('x', itemConfig.startingPoint + iconWidth + spaceAfter)
                .attr('y', yTextPosition);
        }
        else {
            legendItem
                .selectAll('g.icon')
                .attr('transform', "translate(" + (itemConfig.startingPoint - translateOffset) + ", " + yPosition + ")");
            legendItem
                .select('text')
                .attr('x', itemConfig.startingPoint +
                iconWidth +
                spaceAfter -
                translateOffset)
                .attr('y', yTextPosition);
        }
        itemConfig.itemIndexInLine++;
    };
    Legend.prototype.addEventListeners = function () {
        var self = this;
        var svg = this.getContainerSVG();
        var options = this.getOptions();
        var legendOptions = Tools.getProperty(options, 'legend');
        var truncationThreshold = Tools.getProperty(legendOptions, 'truncation', 'threshold');
        svg.selectAll('g.legend-item')
            .on('mouseover', function () {
            self.services.events.dispatchEvent(Events.Legend.ITEM_HOVER, {
                hoveredElement: select(this),
            });
            // Configs
            var checkboxRadius = Configuration.legend.checkbox.radius;
            var hoveredItem = select(this);
            hoveredItem.select('rect.checkbox').classed('hovered', true);
            hoveredItem
                .append('rect')
                .classed('hover-stroke', true)
                .attr('x', parseFloat(hoveredItem.select('rect.checkbox').attr('x')) - 2)
                .attr('y', parseFloat(hoveredItem.select('rect.checkbox').attr('y')) - 2)
                .attr('width', checkboxRadius * 2 + 4)
                .attr('height', checkboxRadius * 2 + 4)
                .attr('rx', 3)
                .attr('ry', 3)
                .lower();
            var hoveredItemData = hoveredItem.datum();
            if (hoveredItemData.name.length > truncationThreshold) {
                self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                    hoveredElement: hoveredItem,
                    content: hoveredItemData.name,
                });
            }
        })
            .on('mousemove', function () {
            self.services.events.dispatchEvent(Events.Tooltip.MOVE);
        })
            .on('click', function () {
            self.services.events.dispatchEvent(Events.Legend.ITEM_CLICK, {
                clickedElement: select(this),
            });
            var clickedItem = select(this);
            var clickedItemData = clickedItem.datum();
            self.model.toggleDataLabel(clickedItemData.name);
        })
            .on('mouseout', function () {
            var hoveredItem = select(this);
            hoveredItem.select('rect.hover-stroke').remove();
            hoveredItem.select('rect.checkbox').classed('hovered', false);
            self.services.events.dispatchEvent(Events.Tooltip.HIDE);
            self.services.events.dispatchEvent(Events.Legend.ITEM_MOUSEOUT, {
                hoveredElement: hoveredItem,
            });
        });
        svg.selectAll('g.legend-item rect.checkbox').on('keyup', function (d) {
            if (event.key && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                self.model.toggleDataLabel(d.name);
            }
        });
        svg.selectAll('g.additional-item').on('mouseover', function () {
            var hoveredItem = select(this);
            var hoveredItemData = hoveredItem.datum();
            if (hoveredItemData.name.length > truncationThreshold) {
                self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                    hoveredElement: hoveredItem,
                    content: hoveredItemData.name,
                });
            }
        });
    };
    return Legend;
}(Component));
export { Legend };
//# sourceMappingURL=../../../src/components/essentials/legend.js.map