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
import { AxisPositions, Events, ScaleTypes, Roles, TruncationTypes, } from '../../interfaces';
import { Tools } from '../../tools';
import { DOMUtils } from '../../services';
import { AxisTitleOrientations, TickRotations } from '../../interfaces/enums';
import * as Configuration from '../../configuration';
import { computeTimeIntervalName, formatTick, isTickPrimary, } from '../../services/time-series';
// D3 Imports
import { select } from 'd3-selection';
import { axisBottom, axisLeft, axisRight, axisTop } from 'd3-axis';
var Axis = /** @class */ (function (_super) {
    __extends(Axis, _super);
    function Axis(model, services, configs) {
        var _this = _super.call(this, model, services, configs) || this;
        _this.type = 'axes';
        if (configs) {
            _this.configs = configs;
        }
        _this.margins = _this.configs.margins;
        return _this;
    }
    Axis.prototype.render = function (animate) {
        if (animate === void 0) { animate = true; }
        var axisPosition = this.configs.position;
        var options = this.getOptions();
        var isAxisVisible = Tools.getProperty(options, 'axes', axisPosition, 'visible');
        var svg = this.getContainerSVG();
        var _a = DOMUtils.getSVGElementSize(this.parent, {
            useAttrs: true,
        }), width = _a.width, height = _a.height;
        // Add axis into the parent
        var container = DOMUtils.appendOrSelect(svg, "g.axis." + axisPosition);
        var startPosition, endPosition;
        if (axisPosition === AxisPositions.BOTTOM ||
            axisPosition === AxisPositions.TOP) {
            startPosition = this.configs.axes[AxisPositions.LEFT]
                ? this.margins.left
                : 0;
            endPosition = this.configs.axes[AxisPositions.RIGHT]
                ? width - this.margins.right
                : width;
        }
        else {
            startPosition = height - this.margins.bottom;
            endPosition = this.margins.top;
        }
        // Grab the scale off of the Scales service
        var scale = this.services.cartesianScales.getScaleByPosition(axisPosition);
        if (this.scaleType === ScaleTypes.LABELS ||
            this.scaleType === ScaleTypes.LABELS_RATIO) {
            scale.rangeRound([startPosition, endPosition]);
        }
        else {
            scale.range([startPosition, endPosition]);
        }
        // Identify the corresponding d3 axis function
        var axisFunction;
        switch (axisPosition) {
            case AxisPositions.LEFT:
                axisFunction = axisLeft;
                break;
            case AxisPositions.BOTTOM:
                axisFunction = axisBottom;
                break;
            case AxisPositions.RIGHT:
                axisFunction = axisRight;
                break;
            case AxisPositions.TOP:
                axisFunction = axisTop;
                break;
        }
        container.attr('aria-label', axisPosition + " axis");
        var axisRefExists = !container.select("g.ticks").empty();
        var axisRef = DOMUtils.appendOrSelect(container, "g.ticks");
        if (!axisRefExists) {
            axisRef.attr('role', Roles.GRAPHICS_OBJECT + " " + Roles.GROUP);
            axisRef.attr('aria-label', axisPosition + " ticks");
        }
        // We draw the invisible axis because of the async nature of d3 transitions
        // To be able to tell the final width & height of the axis when initiaing the transition
        // The invisible axis is updated instantly and without a transition
        var invisibleAxisRef = DOMUtils.appendOrSelect(container, "g.ticks.invisible")
            .style('opacity', '0')
            .style('pointer-events', 'none')
            .attr('aria-hidden', true)
            .attr('aria-label', "invisible " + axisPosition + " ticks");
        var axisOptions = Tools.getProperty(options, 'axes', axisPosition);
        var isTimeScaleType = this.scaleType === ScaleTypes.TIME ||
            axisOptions.scaleType === ScaleTypes.TIME;
        var isVerticalAxis = axisPosition === AxisPositions.LEFT ||
            axisPosition === AxisPositions.RIGHT;
        // if zoomDomain is available, scale type is time, and axis position isBOTTOM or TOP
        // update scale domain to zoomDomain.
        var zoomDomain = this.model.get('zoomDomain');
        if (zoomDomain && isTimeScaleType && !isVerticalAxis) {
            scale.domain(zoomDomain);
        }
        if (!isAxisVisible) {
            axisRef.attr('aria-hidden', true);
            return;
        }
        var axisScaleType = Tools.getProperty(axisOptions, 'scaleType');
        var isDataLoading = Tools.getProperty(options, 'data', 'loading');
        var numberOfTicksProvided = Tools.getProperty(axisOptions, 'ticks', 'number');
        // user can provide custom ticks to be displayed
        // ticks need to be in the domain of the axis data
        var userProvidedTickValues = Tools.getProperty(axisOptions, 'ticks', 'values');
        // get user provided custom values for truncation
        var truncationType = Tools.getProperty(axisOptions, 'truncation', 'type');
        var truncationThreshold = Tools.getProperty(axisOptions, 'truncation', 'threshold');
        var truncationNumCharacter = Tools.getProperty(axisOptions, 'truncation', 'numCharacter');
        var isNumberOfTicksProvided = numberOfTicksProvided !== null;
        var timeScaleOptions = Tools.getProperty(options, 'timeScale');
        // Append to DOM a fake tick to get the right computed font height
        var fakeTick = DOMUtils.appendOrSelect(invisibleAxisRef, "g.tick");
        var fakeTickText = DOMUtils.appendOrSelect(fakeTick, "text").text('0');
        var tickHeight = DOMUtils.getSVGElementSize(fakeTickText.node(), {
            useBBox: true,
        }).height;
        fakeTick.remove();
        var scaleType = this.scaleType || axisOptions.scaleType || ScaleTypes.LINEAR;
        // Initialize axis object
        var axis = axisFunction(scale).tickSizeOuter(0);
        if (scale.ticks) {
            var numberOfTicks = void 0;
            if (isNumberOfTicksProvided) {
                numberOfTicks = numberOfTicksProvided;
            }
            else {
                numberOfTicks = Configuration.axis.ticks.number;
                if (isVerticalAxis) {
                    // Set how many ticks based on height
                    numberOfTicks = this.getNumberOfFittingTicks(height, tickHeight, Configuration.axis.ticks.verticalSpaceRatio);
                }
            }
            // scale continuous
            // remove 0 ticks for skeleton
            if (scale.ticks().length === 1 && scale.ticks()[0] === 0) {
                numberOfTicks = 0;
            }
            axis.ticks(numberOfTicks);
            if (isTimeScaleType) {
                if (!scale.ticks(numberOfTicks).length) {
                    axis.tickValues([]);
                }
                else {
                    var addSpaceOnEdges = Tools.getProperty(options, 'timeScale', 'addSpaceOnEdges');
                    var customDomain = Tools.getProperty(options, 'axes', axisPosition, 'domain');
                    var tickValues = void 0;
                    // scale.nice() will change scale domain which causes extra space near chart edge
                    // so use another scale instance to avoid impacts to original scale
                    var tempScale = scale.copy();
                    if (addSpaceOnEdges && !customDomain) {
                        tempScale.nice(numberOfTicks);
                    }
                    tickValues = tempScale.ticks(numberOfTicks);
                    // Remove labels on the edges
                    // If there are more than 2 labels to show
                    if (addSpaceOnEdges &&
                        tickValues.length > 2 &&
                        !customDomain) {
                        tickValues.splice(tickValues.length - 1, 1);
                        tickValues.splice(0, 1);
                    }
                    axis.tickValues(tickValues);
                }
            }
        }
        // create the right ticks formatter
        var formatter;
        var userProvidedFormatter = Tools.getProperty(axisOptions, 'ticks', 'formatter');
        if (isTimeScaleType) {
            var timeInterval_1 = computeTimeIntervalName(axis.tickValues());
            if (userProvidedFormatter === null) {
                formatter = function (t, i) {
                    return formatTick(t, i, axis.tickValues(), timeInterval_1, timeScaleOptions);
                };
            }
            else {
                formatter = function (t, i) {
                    var defaultFormattedValue = formatTick(t, i, axis.tickValues(), timeInterval_1, timeScaleOptions);
                    return userProvidedFormatter(t, i, defaultFormattedValue);
                };
            }
        }
        else {
            if (userProvidedFormatter === null) {
                if (scaleType === ScaleTypes.LINEAR) {
                    formatter = function (t) { return t.toLocaleString(); };
                }
            }
            else {
                formatter = userProvidedFormatter;
            }
        }
        // Set ticks formatter
        axis.tickFormat(formatter);
        // prioritize using a custom array of values rather than number of ticks
        // if both are provided. custom tick values need to be within the domain of the scale
        var _b = this.services.cartesianScales
            .getScaleByPosition(axisPosition)
            .domain(), lowerBound = _b[0], upperBound = _b[1];
        var validTicks;
        if (userProvidedTickValues) {
            if (isTimeScaleType) {
                // sanitize user-provided tick values
                userProvidedTickValues.forEach(function (userProvidedTickValue, i) {
                    if (userProvidedTickValue.getTime === undefined) {
                        userProvidedTickValues[i] = new Date(userProvidedTickValue);
                    }
                });
                // check the supplied ticks are within the time domain
                validTicks = userProvidedTickValues.filter(function (tick) {
                    var tickTimestamp = tick.getTime();
                    return (tickTimestamp >= new Date(lowerBound).getTime() &&
                        tickTimestamp <= new Date(upperBound).getTime());
                });
            }
            else if (axisScaleType === ScaleTypes.LABELS) {
                var discreteDomain_1 = this.services.cartesianScales
                    .getScaleByPosition(axisPosition)
                    .domain();
                validTicks = userProvidedTickValues.filter(function (tick) {
                    return discreteDomain_1.includes(tick);
                });
            }
            else {
                // continuous scales
                validTicks = userProvidedTickValues.filter(function (tick) { return tick >= lowerBound && tick <= upperBound; });
            }
            axis.tickValues(validTicks);
        }
        // Position and transition the axis
        switch (axisPosition) {
            case AxisPositions.LEFT:
                axisRef.attr('transform', "translate(" + this.margins.left + ", 0)");
                break;
            case AxisPositions.BOTTOM:
                axisRef.attr('transform', "translate(0, " + (height - this.margins.bottom) + ")");
                break;
            case AxisPositions.RIGHT:
                axisRef.attr('transform', "translate(" + (width - this.margins.right) + ", 0)");
                break;
            case AxisPositions.TOP:
                axisRef.attr('transform', "translate(0, " + this.margins.top + ")");
                break;
        }
        // Position the axis title
        // check that data exists, if they don't, doesn't show the title axis
        var isDataEmpty = this.model.isDataEmpty();
        if (axisOptions.title) {
            var axisTitleRef = DOMUtils.appendOrSelect(container, "text.axis-title").html(isDataEmpty || isDataLoading ? '' : axisOptions.title);
            // vertical axes can have override for title orientation
            var titleOrientation = Tools.getProperty(axisOptions, 'titleOrientation');
            switch (axisPosition) {
                case AxisPositions.LEFT:
                    if (titleOrientation === AxisTitleOrientations.RIGHT) {
                        axisTitleRef
                            .attr('transform', 'rotate(90)')
                            .attr('y', 0)
                            .attr('x', scale.range()[0] / 2)
                            .attr('dy', '-0.5em')
                            .style('text-anchor', 'middle');
                    }
                    else {
                        axisTitleRef
                            .attr('transform', 'rotate(-90)')
                            .attr('y', 0)
                            .attr('x', -(scale.range()[0] / 2))
                            .attr('dy', '0.75em')
                            .style('text-anchor', 'middle');
                    }
                    break;
                case AxisPositions.BOTTOM:
                    axisTitleRef
                        .attr('transform', "translate(" + (this.margins.left / 2 + scale.range()[1] / 2) + ", " + (height + 4) + ")")
                        .style('text-anchor', 'middle');
                    break;
                case AxisPositions.RIGHT:
                    if (titleOrientation === AxisTitleOrientations.LEFT) {
                        axisTitleRef
                            .attr('transform', 'rotate(-90)')
                            .attr('y', width)
                            .attr('x', -(scale.range()[0] / 2))
                            .style('text-anchor', 'middle');
                    }
                    else {
                        axisTitleRef
                            .attr('transform', 'rotate(90)')
                            .attr('y', -width)
                            .attr('x', scale.range()[0] / 2)
                            .attr('dy', '0.75em')
                            .style('text-anchor', 'middle');
                    }
                    break;
                case AxisPositions.TOP:
                    var titleHeight = DOMUtils.getSVGElementSize(axisTitleRef, {
                        useBBox: true,
                    }).height;
                    axisTitleRef
                        .attr('transform', "translate(" + (this.margins.left / 2 + scale.range()[1] / 2) + ", " + titleHeight / 2 + ")")
                        .style('text-anchor', 'middle');
                    break;
            }
        }
        // Apply new axis to the axis element
        if (isTimeScaleType) {
            var timeInterval_2 = computeTimeIntervalName(axis.tickValues());
            var showDayName_1 = timeScaleOptions.showDayName;
            var axisRefSelection = axisRef;
            if (animate) {
                axisRef = axisRef.transition(this.services.transitions.getTransition('axis-update', animate));
            }
            axisRef = axisRef.call(axis);
            // Manipulate tick labels to make bold those that are in long format
            var ticks = axisRefSelection
                .selectAll('.tick')
                .data(axis.tickValues(), scale)
                .order()
                .select('text');
            ticks.style('font-weight', function (tick, i) {
                return isTickPrimary(tick, i, axis.tickValues(), timeInterval_2, showDayName_1)
                    ? 'bold'
                    : 'normal';
            });
        }
        else {
            if (!animate || !axisRefExists) {
                axisRef = axisRef.call(axis);
            }
            else {
                axisRef = axisRef
                    .transition(this.services.transitions.getTransition('axis-update'))
                    .call(axis);
            }
        }
        invisibleAxisRef.call(axis);
        if (axisPosition === AxisPositions.BOTTOM ||
            axisPosition === AxisPositions.TOP) {
            var shouldRotateTicks = false;
            // user could decide if tick rotation is required during zoom domain changing
            var tickRotation = Tools.getProperty(axisOptions, 'ticks', 'rotation');
            if (tickRotation === TickRotations.ALWAYS) {
                shouldRotateTicks = true;
            }
            else if (tickRotation === TickRotations.NEVER) {
                shouldRotateTicks = false;
            }
            else if (!tickRotation || tickRotation === TickRotations.AUTO) {
                // if the option is not set or set to AUTO
                // depending on if tick rotation is necessary by calculating space
                // If we're dealing with a discrete scale type
                // We're able to grab the spacing between the ticks
                if (scale.step) {
                    var textNodes = invisibleAxisRef
                        .selectAll('g.tick text')
                        .nodes();
                    // If any ticks are any larger than the scale step size
                    shouldRotateTicks = textNodes.some(function (textNode) {
                        return DOMUtils.getSVGElementSize(textNode, {
                            useBBox: true,
                        }).width >= scale.step();
                    });
                }
                else {
                    // When dealing with a continuous scale
                    // We need to calculate an estimated size of the ticks
                    var minTickSize = Tools.getProperty(axisOptions, 'ticks', 'rotateIfSmallerThan') || Configuration.axis.ticks.rotateIfSmallerThan;
                    var ticksNumber = isTimeScaleType
                        ? axis.tickValues().length
                        : scale.ticks().length;
                    var estimatedTickSize = width / ticksNumber / 2;
                    shouldRotateTicks = isTimeScaleType
                        ? estimatedTickSize < minTickSize * 2 // datetime tick could be very long
                        : estimatedTickSize < minTickSize;
                }
            }
            if (shouldRotateTicks) {
                if (!isNumberOfTicksProvided) {
                    axis.ticks(this.getNumberOfFittingTicks(width, tickHeight, Configuration.axis.ticks.horizontalSpaceRatio));
                    invisibleAxisRef.call(axis);
                    axisRef.call(axis);
                }
                container
                    .selectAll('g.ticks g.tick text')
                    .attr('transform', "rotate(-45)")
                    .style('text-anchor', axisPosition === AxisPositions.TOP ? 'start' : 'end');
            }
            else {
                container
                    .selectAll('g.ticks g.tick text')
                    .attr('transform', null)
                    .style('text-anchor', null);
            }
        }
        // we don't need to show axes on empty state and on skeleton state
        // because the Skeleton component draws them
        if (isDataLoading) {
            container.attr('opacity', 0);
        }
        else {
            container.attr('opacity', 1);
        }
        axisRef.selectAll('g.tick').attr('aria-label', function (d) { return d; });
        invisibleAxisRef.selectAll('g.tick').attr('aria-label', function (d) { return d; });
        // truncate the label if it's too long
        // only applies to discrete type
        if (truncationType !== TruncationTypes.NONE &&
            axisScaleType === ScaleTypes.LABELS &&
            !userProvidedTickValues) {
            var axisTickLabels = this.services.cartesianScales.getScaleDomain(axisPosition);
            if (axisTickLabels.length > 0) {
                var tick_html = svg
                    .select("g.axis." + axisPosition + " g.ticks g.tick")
                    .html();
                container.selectAll('g.ticks g.tick').html(tick_html);
                container
                    .selectAll('g.tick text')
                    .data(axisTickLabels)
                    .text(function (d) {
                    if (d.length > truncationThreshold) {
                        return Tools.truncateLabel(d, truncationType, truncationNumCharacter);
                    }
                    else {
                        return d;
                    }
                });
                this.getInvisibleAxisRef()
                    .selectAll('g.tick text')
                    .data(axisTickLabels)
                    .text(function (d) {
                    if (d.length > truncationThreshold) {
                        return Tools.truncateLabel(d, truncationType, truncationNumCharacter);
                    }
                    else {
                        return d;
                    }
                });
                container
                    .selectAll('g.ticks')
                    .html(this.getInvisibleAxisRef().html());
                container.selectAll('g.tick text').data(axisTickLabels);
            }
        }
        // Add event listeners to elements drawn
        this.addEventListeners();
    };
    Axis.prototype.addEventListeners = function () {
        var svg = this.getContainerSVG();
        var axisPosition = this.configs.position;
        var container = DOMUtils.appendOrSelect(svg, "g.axis." + axisPosition);
        var options = this.getOptions();
        var axisOptions = Tools.getProperty(options, 'axes', axisPosition);
        var axisScaleType = Tools.getProperty(axisOptions, 'scaleType');
        var truncationThreshold = Tools.getProperty(axisOptions, 'truncation', 'threshold');
        var isTimeScaleType = this.scaleType === ScaleTypes.TIME ||
            axisOptions.scaleType === ScaleTypes.TIME;
        var self = this;
        container
            .selectAll('g.tick text')
            .on('mouseover', function (datum) {
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Axis.LABEL_MOUSEOVER, {
                element: select(this),
                datum: datum,
            });
            if (axisScaleType === ScaleTypes.LABELS &&
                datum.length > truncationThreshold) {
                self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                    hoveredElement: select(this),
                    content: datum,
                });
            }
        })
            .on('mousemove', function (datum) {
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Axis.LABEL_MOUSEMOVE, {
                element: select(this),
                datum: datum,
            });
            if (axisScaleType === ScaleTypes.LABELS &&
                datum.length > truncationThreshold) {
                self.services.events.dispatchEvent(Events.Tooltip.MOVE);
            }
        })
            .on('click', function (datum) {
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Axis.LABEL_CLICK, {
                element: select(this),
                datum: datum,
            });
        })
            .on('mouseout', function (datum) {
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Axis.LABEL_MOUSEOUT, {
                element: select(this),
                datum: datum,
            });
            if (axisScaleType === ScaleTypes.LABELS) {
                self.services.events.dispatchEvent(Events.Tooltip.HIDE);
            }
        });
    };
    Axis.prototype.getInvisibleAxisRef = function () {
        var axisPosition = this.configs.position;
        return this.getContainerSVG().select("g.axis." + axisPosition + " g.ticks.invisible");
    };
    Axis.prototype.getTitleRef = function () {
        var axisPosition = this.configs.position;
        return this.getContainerSVG().select("g.axis." + axisPosition + " text.axis-title");
    };
    Axis.prototype.getNumberOfFittingTicks = function (size, tickSize, spaceRatio) {
        var numberOfTicksFit = Math.floor(size / (tickSize * spaceRatio));
        return Tools.clamp(numberOfTicksFit, 2, Configuration.axis.ticks.number);
    };
    Axis.prototype.destroy = function () {
        var svg = this.getContainerSVG();
        var axisPosition = this.configs.position;
        var container = DOMUtils.appendOrSelect(svg, "g.axis." + axisPosition);
        // Remove event listeners
        container
            .selectAll('g.tick text')
            .on('mouseover', null)
            .on('mousemove', null)
            .on('mouseout', null);
    };
    return Axis;
}(Component));
export { Axis };
//# sourceMappingURL=../../../src/components/axes/axis.js.map