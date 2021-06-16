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
import { Events, Roles, ToolbarControlTypes } from '../../interfaces';
import { Tools } from '../../tools';
import { DOMUtils } from '../../services';
import * as Configuration from '../../configuration';
// D3 Imports
import { event, select } from 'd3-selection';
// import the settings for the css prefix
import settings from 'carbon-components/es/globals/js/settings';
var Toolbar = /** @class */ (function (_super) {
    __extends(Toolbar, _super);
    function Toolbar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'toolbar';
        // x, y coordinate of overflow menu
        _this.overflowMenuX = 0;
        _this.overflowMenuY = 0;
        // Use a random number to create overflow menu item unique ID
        // so they don't interfere the other overflow menu item in a page
        _this.overflowMenuItemId = Math.floor(Math.random() * 99999999999);
        return _this;
    }
    Toolbar.prototype.init = function () {
        var _this = this;
        var options = this.getOptions();
        // Grab the tooltip element
        var holder = select(this.services.domUtils.getHolder());
        var chartPrefix = Tools.getProperty(options, 'style', 'prefix');
        this.overflowMenu = DOMUtils.appendOrSelect(holder, "div." + settings.prefix + "--" + chartPrefix + "--overflowMenu");
        this.overflowMenu.style('max-width', null);
        // listen to show overflow menu event to render the overflow menu
        this.services.events.addEventListener(Events.Toolbar.SHOW_OVERFLOW_MENU, function () {
            _this.overflowMenu.html(_this.getOverflowMenuHTML());
        });
        // listen to hide overflow menu event to hide the overflow menu
        this.services.events.addEventListener(Events.Toolbar.HIDE_OVERFLOW_MENU, function () {
            _this.overflowMenu.html(null);
        });
        // hide overflow menu if user clicks on somewhere in web page
        document.body.addEventListener('click', function () {
            return _this.updateOverflowMenu(false);
        });
    };
    Toolbar.prototype.render = function (animate) {
        if (animate === void 0) { animate = true; }
        var isDataLoading = Tools.getProperty(this.getOptions(), 'data', 'loading');
        // size of toolbar button with background
        var buttonSize = Configuration.toolbar.buttonSize;
        var parentY = parseFloat(this.parent.node().getAttribute('y'));
        var svg = this.getContainerSVG();
        // TODO -- adjust toolbar Y position to align title component
        // before layout component supports vertical alignment center
        var Y_OFFSET = -6;
        svg.attr('transform', "translate(0, " + (parentY + Y_OFFSET) + ")");
        var width = DOMUtils.getSVGElementSize(this.services.domUtils.getMainSVG(), {
            useAttrs: true,
        }).width;
        // overflow menu width is 160px
        // it's set by Carbon component
        var overflowMenuWidth = 160;
        // no good solution to get correct Toolbar position
        // parent x doesn't work well
        // assume the overflow icon has right alignment in layout
        this.overflowMenuX = width - overflowMenuWidth;
        this.overflowMenuY = parentY + Y_OFFSET + buttonSize;
        var container = DOMUtils.appendOrSelect(svg, 'svg.toolbar-container')
            .attr('width', '100%')
            .attr('height', Configuration.toolbar.height)
            .attr('opacity', 1);
        // clean children first
        container.html(null);
        // get the toolbar buttons
        var _a = this.getControlConfigs(), buttonList = _a.buttonList, overflowMenuItemList = _a.overflowMenuItemList;
        // overflow button is required only if overflow menu item list is valid
        if (!!overflowMenuItemList) {
            buttonList.push(this.getOverflowButtonConfig());
        }
        // loading or empty state
        if (isDataLoading || buttonList.length === 0) {
            // put an empty rect to keep space unchanged
            DOMUtils.appendOrSelect(container, 'svg.toolbar-loading-spacer')
                .append('rect')
                .attr('height', Configuration.toolbar.height)
                .attr('width', buttonSize * 3) // value doesn't matter but can't be empty
                .attr('opacity', 0);
        }
        else {
            // render toolbar buttons sequentially
            var buttonXPosition_1 = 0;
            buttonList.forEach(function (button) {
                // button container
                var buttonContainer = DOMUtils.appendOrSelect(container, "svg." + button.id).classed('toolbar-button', true);
                // add button background rect
                var buttonBackground = DOMUtils.appendOrSelect(buttonContainer, 'rect.toolbar-button-background')
                    .attr('x', buttonXPosition_1)
                    .attr('y', 0)
                    .attr('width', buttonSize)
                    .attr('height', buttonSize);
                var buttonIcon = DOMUtils.appendOrSelect(buttonContainer, 'svg.toolbar-button-icon')
                    .attr('x', buttonXPosition_1 + Configuration.toolbar.iconPadding)
                    .attr('y', Configuration.toolbar.iconPadding)
                    .attr('width', Configuration.toolbar.iconSize)
                    .attr('height', Configuration.toolbar.iconSize)
                    .attr('viewBox', '0 0 32 32')
                    .attr('role', Roles.IMG);
                buttonIcon.html(button.iconSVGContent);
                if (button.shouldBeDisabled()) {
                    buttonContainer
                        .classed('toolbar-button--disabled', true)
                        .classed('toolbar-button--focusable', false)
                        .attr('tabindex', -1)
                        .attr('role', null);
                    buttonIcon.classed('toolbar-button-icon--disabled', true);
                    buttonBackground.classed('toolbar-button-background--disabled', true);
                    buttonContainer.on('click', null).on('keyup', null);
                }
                else {
                    buttonContainer
                        .classed('toolbar-button--disabled', false)
                        .classed('toolbar-button--focusable', true)
                        .attr('tabindex', 0)
                        .attr('role', Roles.BUTTON);
                    buttonIcon.classed('toolbar-button-icon--disabled', false);
                    buttonBackground.classed('toolbar-button-background--disabled', false);
                    buttonContainer
                        .on('click', button.clickFunction)
                        .on('keyup', function () {
                        if ((event.key && event.key === 'Enter') ||
                            event.key === ' ') {
                            event.preventDefault();
                            button.clickFunction();
                        }
                    });
                }
                buttonXPosition_1 += buttonSize;
            });
            this.overflowButton = this.getContainerSVG().select('svg.toolbar-overflow-menu');
            if (this.isOverflowMenuOpen()) {
                // keep overflow menu displayed
                this.updateOverflowMenu(true);
            }
        }
    };
    Toolbar.prototype.isOverflowMenuOpen = function () {
        return (this.overflowMenu
            .selectAll('ul.bx--overflow-menu-options--open')
            .size() > 0);
    };
    // show/hide overflow menu
    Toolbar.prototype.updateOverflowMenu = function (show) {
        // update overflow button background
        if (this.overflowButton) {
            this.overflowButton.classed('toolbar-button--hovered', show);
        }
        if (show) {
            this.services.events.dispatchEvent(Events.Toolbar.SHOW_OVERFLOW_MENU);
        }
        else {
            this.services.events.dispatchEvent(Events.Toolbar.HIDE_OVERFLOW_MENU);
        }
    };
    Toolbar.prototype.focusOnPreviousEnabledMenuItem = function (currentItemIndex) {
        var overflowMenuItems = this.getOverflowMenuItems();
        var previousItemIndex = overflowMenuItems.length;
        for (var i = currentItemIndex - 1; i >= 0; i--) {
            var previousOverflowMenuItem = overflowMenuItems[i];
            if (!previousOverflowMenuItem.shouldBeDisabled()) {
                previousItemIndex = i;
                break;
            }
        }
        // only if previous enabled menu item found
        if (previousItemIndex < overflowMenuItems.length) {
            var previousItemNode = select('#' +
                overflowMenuItems[previousItemIndex].id +
                this.overflowMenuItemId).node();
            if ('focus' in previousItemNode) {
                previousItemNode.focus();
            }
        }
    };
    Toolbar.prototype.focusOnNextEnabledMenuItem = function (currentItemIndex) {
        var overflowMenuItems = this.getOverflowMenuItems();
        var nextItemIndex = -1;
        for (var i = currentItemIndex + 1; i < overflowMenuItems.length; i++) {
            var nextOverflowMenuItem = overflowMenuItems[i];
            if (!nextOverflowMenuItem.shouldBeDisabled()) {
                nextItemIndex = i;
                break;
            }
        }
        // only if next enabled menu item found
        if (nextItemIndex > -1) {
            var nextItemNode = select('#' +
                overflowMenuItems[nextItemIndex].id +
                this.overflowMenuItemId).node();
            if ('focus' in nextItemNode) {
                nextItemNode.focus();
            }
        }
    };
    Toolbar.prototype.toggleOverflowMenu = function () {
        var _this = this;
        if (this.isOverflowMenuOpen()) {
            // hide overflow menu
            this.updateOverflowMenu(false);
        }
        else {
            // show overflow menu
            this.updateOverflowMenu(true);
            // setup overflow menu item event listener
            var self_1 = this;
            var overflowMenuItems = this.getOverflowMenuItems();
            overflowMenuItems.forEach(function (menuItem, index) {
                var element = select('#' + menuItem.id + _this.overflowMenuItemId);
                if (element !== null) {
                    element.on('click', function () {
                        // call the specified function
                        menuItem.clickFunction();
                        // hide overflow menu
                        self_1.updateOverflowMenu(false);
                    });
                    element.on('keyup', function () {
                        if (event.key === 'Enter') {
                            // call the specified function
                            menuItem.clickFunction();
                        }
                        else if (event.key === 'ArrowUp') {
                            // focus on previous menu item
                            self_1.focusOnPreviousEnabledMenuItem(index);
                        }
                        else if (event.key === 'ArrowDown') {
                            // focus on next menu item
                            self_1.focusOnNextEnabledMenuItem(index);
                        }
                        // Not hide overflow menu by keyboard arrow up/down event
                    });
                }
            });
            // default to focus on the first enabled menu item
            self_1.focusOnNextEnabledMenuItem(-1);
        }
        event.stopImmediatePropagation();
    };
    Toolbar.prototype.getOverflowMenuHTML = function () {
        var _this = this;
        var overflowMenuItems = this.getOverflowMenuItems();
        // don't render whole overflow menu if no overflow menu item
        if (!overflowMenuItems || overflowMenuItems.length === 0) {
            return '';
        }
        var overflowMenuHtml;
        overflowMenuHtml = "<div data-floating-menu-container=\"true\" data-floating-menu-direction=\"bottom\" role=\"main\">\n\t\t\t<ul class=\"bx--overflow-menu-options bx--overflow-menu--flip bx--overflow-menu-options--open\"\n\t\t\t\ttabindex=\"-1\" role=\"" + Roles.MENU + "\" aria-label=\"Menu\" data-floating-menu-direction=\"bottom\"\n\t\t\t\tstyle=\"left:" + this.overflowMenuX + "px; top:" + this.overflowMenuY + "px;\">";
        // generate html for each overflow menu items
        overflowMenuItems.forEach(function (menuItem, index) {
            var menuItemClasses = 'bx--overflow-menu-options__option'.concat(menuItem.shouldBeDisabled()
                ? ' bx--overflow-menu-options__option--disabled' // class for disabled menu item
                : '');
            overflowMenuHtml += "<li class=\"" + menuItemClasses + "\" role=\"" + Roles.MENU_ITEM + "\">\n\t\t\t\t<button class=\"bx--overflow-menu-options__btn\"\n\t\t\t\t\tdata-floating-menu-primary-focus=\"" + (index === 0) + "\"\n\t\t\t\t\ttabindex=\"-1\" index=\"" + index + "\" title=\"" + menuItem.text + "\"\n\t\t\t\t\tid=\"" + (menuItem.id + _this.overflowMenuItemId) + "\">\n\t\t\t\t\t<div class=\"bx--overflow-menu-options__option-content\">\n\t\t\t\t\t\t" + menuItem.text + "\n\t\t\t\t\t</div>\n\t\t\t\t</button>\n\t\t\t</li>";
        });
        overflowMenuHtml += "</ul></div>";
        return overflowMenuHtml;
    };
    Toolbar.prototype.getControlConfigs = function () {
        var _this = this;
        var numberOfIcons = Tools.getProperty(this.getOptions(), 'toolbar', 'numberOfIcons');
        var controls = Tools.getProperty(this.getOptions(), 'toolbar', 'controls');
        var controlList = [];
        controls.forEach(function (control) {
            var controlConfig = _this.getControlConfigByType(control.type);
            // add to list if config is valid
            if (controlConfig) {
                controlConfig.text = control.text ? control.text : control.type;
                controlList.push(controlConfig);
            }
        });
        if (controlList.length <= numberOfIcons) {
            return {
                buttonList: controlList,
            };
        }
        return {
            // leave one button for overflow button
            buttonList: controlList.splice(0, numberOfIcons - 1),
            overflowMenuItemList: controlList,
        };
    };
    Toolbar.prototype.getOverflowMenuItems = function () {
        var overflowMenuItemList = this.getControlConfigs().overflowMenuItemList;
        if (!!overflowMenuItemList) {
            return overflowMenuItemList;
        }
        else {
            return [];
        }
    };
    // special button config for overflow button
    Toolbar.prototype.getOverflowButtonConfig = function () {
        var _this = this;
        return {
            id: 'toolbar-overflow-menu',
            shouldBeDisabled: function () { return false; },
            iconSVGContent: "<circle cx=\"16\" cy=\"8\" r=\"2\"></circle>\n\t\t\t\t\t\t\t <circle cx=\"16\" cy=\"16\" r=\"2\"></circle>\n\t\t\t\t\t\t\t <circle cx=\"16\" cy=\"24\" r=\"2\"></circle>",
            clickFunction: function () { return _this.toggleOverflowMenu(); },
        };
    };
    Toolbar.prototype.getControlConfigByType = function (controlType) {
        var _this = this;
        var isZoomBarEnabled = this.services.zoom.isZoomBarEnabled() &&
            !this.services.zoom.isEmptyState();
        var controlConfig;
        switch (controlType) {
            case ToolbarControlTypes.ZOOM_IN:
                if (isZoomBarEnabled) {
                    controlConfig = {
                        id: 'toolbar-zoomIn',
                        shouldBeDisabled: function () {
                            return _this.services.zoom.isMinZoomDomain();
                        },
                        iconSVGContent: this.getControlIconByType(controlType),
                        clickFunction: function () { return _this.services.zoom.zoomIn(); },
                    };
                }
                break;
            case ToolbarControlTypes.ZOOM_OUT:
                if (isZoomBarEnabled) {
                    controlConfig = {
                        id: 'toolbar-zoomOut',
                        shouldBeDisabled: function () {
                            return _this.services.zoom.isMaxZoomDomain();
                        },
                        iconSVGContent: this.getControlIconByType(controlType),
                        clickFunction: function () { return _this.services.zoom.zoomOut(); },
                    };
                }
                break;
            case ToolbarControlTypes.RESET_ZOOM:
                if (isZoomBarEnabled) {
                    controlConfig = {
                        id: 'toolbar-resetZoom',
                        shouldBeDisabled: function () {
                            return _this.services.zoom.isMaxZoomDomain();
                        },
                        iconSVGContent: this.getControlIconByType(controlType),
                        clickFunction: function () {
                            return _this.services.zoom.resetZoomDomain();
                        },
                    };
                }
                break;
            // add more toolbar control configuration here
            default:
                throw Error('Not supported toolbar control type: ' + controlType);
        }
        return controlConfig;
    };
    Toolbar.prototype.getControlIconByType = function (controlType) {
        switch (controlType) {
            case ToolbarControlTypes.ZOOM_IN:
                return "<polygon points=\"19 13 15 13 15 9 13 9 13 13 9 13 9 15 13 15 13 19 15 19 15 15 19 15 19 13\"/>\n    \t\t\t\t\t<path d=\"M22.45,21A10.87,10.87,0,0,0,25,14,11,11,0,1,0,14,25a10.87,10.87,0,0,0,7-2.55L28.59,30,30,28.59ZM14,23a9,9,0,1,1,9-9A9,9,0,0,1,14,23Z\"/>";
            case ToolbarControlTypes.ZOOM_OUT:
                return "<rect x=\"9\" y=\"13\" width=\"10\" height=\"2\"/>\n\t\t\t\t\t\t<path d=\"M22.45,21A10.87,10.87,0,0,0,25,14,11,11,0,1,0,14,25a10.87,10.87,0,0,0,7-2.55L28.59,30,30,28.59ZM14,23a9,9,0,1,1,9-9A9,9,0,0,1,14,23Z\"/>";
            case ToolbarControlTypes.RESET_ZOOM:
                return "<path d=\"M22.4478,21A10.855,10.855,0,0,0,25,14,10.99,10.99,0,0,0,6,6.4658V2H4v8h8V8H7.332a8.9768,8.9768,0,1,1-2.1,8H3.1912A11.0118,11.0118,0,0,0,14,25a10.855,10.855,0,0,0,7-2.5522L28.5859,30,30,28.5859Z\"/>";
            // add more icons here
            // svg icon must be with 32x32 viewBox
            default:
                throw Error('Not supported toolbar control type: ' + controlType);
        }
    };
    return Toolbar;
}(Component));
export { Toolbar };
//# sourceMappingURL=../../../src/components/axes/toolbar.js.map