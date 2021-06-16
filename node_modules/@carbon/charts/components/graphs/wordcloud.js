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
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import cloud from 'd3-cloud';
var WordCloud = /** @class */ (function (_super) {
    __extends(WordCloud, _super);
    function WordCloud() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'wordcloud';
        // Highlight elements that match the hovered legend item
        _this.handleLegendOnHover = function (event) {
            var hoveredElement = event.detail.hoveredElement;
            var groupMapsTo = _this.getOptions().data.groupMapsTo;
            _this.parent
                .selectAll('text.word')
                .transition(_this.services.transitions.getTransition('legend-hover-wordcloud'))
                .attr('opacity', function (d) {
                return d[groupMapsTo] !== hoveredElement.datum()['name'] ? 0.3 : 1;
            });
        };
        // Un-highlight all elements
        _this.handleLegendMouseOut = function (event) {
            _this.parent
                .selectAll('text.word')
                .transition(_this.services.transitions.getTransition('legend-mouseout-wordcloud'))
                .attr('opacity', 1);
        };
        return _this;
    }
    WordCloud.prototype.init = function () {
        var eventsFragment = this.services.events;
        // Highlight correct words on legend item hovers
        eventsFragment.addEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        // Un-highlight words on legend item mouseouts
        eventsFragment.addEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    WordCloud.prototype.getFontSizeScale = function (data) {
        var options = this.getOptions();
        var fontSizeMapsTo = options.wordCloud.fontSizeMapsTo;
        // Filter out any null/undefined values
        var allOccurences = data
            .map(function (d) { return d[fontSizeMapsTo]; })
            .filter(function (size) { return size; });
        var chartSize = DOMUtils.getSVGElementSize(this.services.domUtils.getMainSVG(), { useAttr: true });
        // We need the ternary operator here in case the user
        // doesn't provide size values in data
        var sizeDataIsValid = allOccurences.length > 0;
        var domain = sizeDataIsValid ? extent(allOccurences) : [1, 1];
        return scaleLinear()
            .domain(domain)
            .range(sizeDataIsValid
            ? options.wordCloud.fontSizeRange(chartSize, data)
            : [4, 4]);
    };
    WordCloud.prototype.render = function (animate) {
        if (animate === void 0) { animate = true; }
        var self = this;
        var svg = this.getContainerSVG();
        var displayData = this.model.getDisplayData();
        var fontSizeScale = this.getFontSizeScale(displayData);
        var options = this.getOptions();
        var _a = options.wordCloud, fontSizeMapsTo = _a.fontSizeMapsTo, wordMapsTo = _a.wordMapsTo;
        var groupMapsTo = options.data.groupMapsTo;
        var _b = DOMUtils.getSVGElementSize(this.parent, {
            useAttrs: true,
        }), width = _b.width, height = _b.height;
        if (width === 0 || height === 0) {
            return;
        }
        var layout = cloud()
            .size([width, height])
            .words(displayData.map(function (d) {
            var _a;
            return _a = {},
                _a[groupMapsTo] = d[groupMapsTo],
                _a.text = d[wordMapsTo],
                _a.size = d[fontSizeMapsTo],
                _a.value = d[fontSizeMapsTo],
                _a;
        }))
            .padding(5)
            .rotate(0)
            .fontSize(function (d) { return fontSizeScale(d.size); })
            .on('end', draw);
        layout.start();
        function draw(words) {
            var textGroup = DOMUtils.appendOrSelect(svg, 'g.words');
            textGroup.attr('transform', "translate(" + layout.size()[0] / 2 + ", " + layout.size()[1] / 2 + ")");
            var allText = textGroup
                .selectAll('text')
                .data(words, function (d) { return d[groupMapsTo] + "-" + d.text; });
            // Remove texts that are no longer needed
            allText.exit().attr('opacity', 0).remove();
            var enteringText = allText
                .enter()
                .append('text')
                .attr('opacity', 0);
            enteringText
                .merge(allText)
                .style('font-size', function (d) { return d.size + "px"; })
                .text(function (d) {
                return d.text;
            })
                .attr('class', function (d) {
                return self.model.getColorClassName({
                    classNameTypes: [ColorClassNameTypes.FILL],
                    dataGroupName: d[groupMapsTo],
                    originalClassName: "word " + (d.size > 32 ? 'light' : ''),
                });
            })
                .style('fill', function (d) {
                return self.model.getFillColor(d[groupMapsTo], d.text, d);
            })
                .attr('text-anchor', 'middle')
                .transition(self.services.transitions.getTransition('wordcloud-text-update-enter', animate))
                .attr('transform', function (d) { return "translate(" + d.x + ", " + d.y + ")"; })
                .attr('opacity', 1);
        }
        // Add event listeners
        this.addEventListeners();
    };
    WordCloud.prototype.addEventListeners = function () {
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        // Highlights 1 word or unhighlights all
        var debouncedHighlight = Tools.debounce(function (word) {
            var allWords = self.parent
                .selectAll('text.word')
                .transition(self.services.transitions.getTransition('wordcloud-word-mouse-highlight'));
            if (word === null) {
                allWords.attr('opacity', 1);
            }
            else {
                allWords.attr('opacity', function () {
                    if (word === this) {
                        return 1;
                    }
                    return 0.3;
                });
            }
        }, 6);
        var self = this;
        this.parent
            .selectAll('text.word')
            .on('mouseover', function (datum) {
            var hoveredElement = this;
            debouncedHighlight(hoveredElement);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.WordCloud.WORD_MOUSEOVER, {
                element: select(this),
                datum: datum,
            });
            // Show tooltip
            self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                hoveredElement: hoveredElement,
                items: [
                    {
                        label: options.tooltip.wordLabel,
                        value: datum.text,
                    },
                    {
                        label: options.tooltip.valueLabel,
                        value: datum.value,
                    },
                    {
                        label: options.tooltip.groupLabel,
                        value: datum[groupMapsTo],
                        class: self.model.getColorClassName({
                            classNameTypes: [ColorClassNameTypes.TOOLTIP],
                            dataGroupName: datum[groupMapsTo],
                        }),
                    },
                ],
            });
        })
            .on('mousemove', function (datum) {
            var hoveredElement = select(this);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.WordCloud.WORD_MOUSEMOVE, {
                element: hoveredElement,
                datum: datum,
            });
            // Show tooltip
            self.services.events.dispatchEvent(Events.Tooltip.MOVE);
        })
            .on('click', function (datum) {
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.WordCloud.WORD_CLICK, {
                element: select(this),
                datum: datum,
            });
        })
            .on('mouseout', function (datum) {
            var hoveredElement = select(this);
            debouncedHighlight(null);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.WordCloud.WORD_MOUSEOUT, {
                element: hoveredElement,
                datum: datum,
            });
            // Hide tooltip
            self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
                hoveredElement: hoveredElement,
            });
        });
    };
    return WordCloud;
}(Component));
export { WordCloud };
//# sourceMappingURL=../../../src/components/graphs/wordcloud.js.map