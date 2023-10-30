!function(a,b){"use strict";"function"==typeof define&&define.amd?define("mediator-js",[],function(){return a.Mediator=b(),a.Mediator}):"undefined"!=typeof exports?exports.Mediator=b():a.Mediator=b()}(this,function(){"use strict";function a(){var a=function(){return(0|65536*(1+Math.random())).toString(16).substring(1)};return a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a()}function b(c,d,e){return this instanceof b?(this.id=a(),this.fn=c,this.options=d,this.context=e,this.channel=null,void 0):new b(c,d,e)}function c(a,b){return this instanceof c?(this.namespace=a||"",this._subscribers=[],this._channels={},this._parent=b,this.stopped=!1,void 0):new c(a)}function d(){return this instanceof d?(this._channels=new c(""),void 0):new d}return b.prototype={update:function(a){a&&(this.fn=a.fn||this.fn,this.context=a.context||this.context,this.options=a.options||this.options,this.channel&&this.options&&void 0!==this.options.priority&&this.channel.setPriority(this.id,this.options.priority))}},c.prototype={addSubscriber:function(a,c,d){var e=new b(a,c,d);return c&&void 0!==c.priority?(c.priority=c.priority>>0,c.priority<0&&(c.priority=0),c.priority>=this._subscribers.length&&(c.priority=this._subscribers.length-1),this._subscribers.splice(c.priority,0,e)):this._subscribers.push(e),e.channel=this,e},stopPropagation:function(){this.stopped=!0},getSubscriber:function(a){var b=0,c=this._subscribers.length;for(c;c>b;b++)if(this._subscribers[b].id===a||this._subscribers[b].fn===a)return this._subscribers[b]},setPriority:function(a,b){var e,f,g,h,c=0,d=0;for(d=0,h=this._subscribers.length;h>d&&this._subscribers[d].id!==a&&this._subscribers[d].fn!==a;d++)c++;e=this._subscribers[c],f=this._subscribers.slice(0,c),g=this._subscribers.slice(c+1),this._subscribers=f.concat(g),this._subscribers.splice(b,0,e)},addChannel:function(a){this._channels[a]=new c((this.namespace?this.namespace+":":"")+a,this)},hasChannel:function(a){return this._channels.hasOwnProperty(a)},returnChannel:function(a){return this._channels[a]},removeSubscriber:function(a){var b=this._subscribers.length-1;if(!a)return this._subscribers=[],void 0;for(b;b>=0;b--)(this._subscribers[b].fn===a||this._subscribers[b].id===a)&&(this._subscribers[b].channel=null,this._subscribers.splice(b,1))},publish:function(a){var e,g,h,b=0,c=this._subscribers.length,d=!1;for(c;c>b;b++)d=!1,e=this._subscribers[b],this.stopped||(g=this._subscribers.length,void 0!==e.options&&"function"==typeof e.options.predicate?e.options.predicate.apply(e.context,a)&&(d=!0):d=!0),d&&(e.options&&void 0!==e.options.calls&&(e.options.calls--,e.options.calls<1&&this.removeSubscriber(e.id)),e.fn.apply(e.context,a),h=this._subscribers.length,c=h,h===g-1&&b--);this._parent&&this._parent.publish(a),this.stopped=!1}},d.prototype={getChannel:function(a,b){var c=this._channels,d=a.split(":"),e=0,f=d.length;if(""===a)return c;if(d.length>0)for(f;f>e;e++){if(!c.hasChannel(d[e])){if(b)break;c.addChannel(d[e])}c=c.returnChannel(d[e])}return c},subscribe:function(a,b,c,d){var e=this.getChannel(a||"",!1);return c=c||{},d=d||{},e.addSubscriber(b,c,d)},once:function(a,b,c,d){return c=c||{},c.calls=1,this.subscribe(a,b,c,d)},getSubscriber:function(a,b){var c=this.getChannel(b||"",!0);return c.namespace!==b?null:c.getSubscriber(a)},remove:function(a,b){var c=this.getChannel(a||"",!0);return c.namespace!==a?!1:(c.removeSubscriber(b),void 0)},publish:function(a){var b=this.getChannel(a||"",!0);if(b.namespace!==a)return null;var c=Array.prototype.slice.call(arguments,1);c.push(b),b.publish(c)}},d.prototype.on=d.prototype.subscribe,d.prototype.bind=d.prototype.subscribe,d.prototype.emit=d.prototype.publish,d.prototype.trigger=d.prototype.publish,d.prototype.off=d.prototype.remove,d.Channel=c,d.Subscriber=b,d.version="0.9.8",d});

/*!
* Analyticstracker.js Library
*/
(function (root, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // define(['mediator-js'], factory);
        define(["mediator-js"], function (Mediator) {
            return (root.analyticstracker = factory(Mediator, window));
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('mediator-js').Mediator, window);
    } else {
        // Browser globals
        root.analyticstracker = factory(root.Mediator, window);
    }

}(this, function (Mediator, window) {
    // UMD Definition above, do not remove this line
    'use strict';
    var _instance;

    var document = window.document;
    var navigator = window.navigator;

    var HTMLSelector = function HTMLSelector(selectorSettings) {
        if (!(this instanceof HTMLSelector)) {
            return new HTMLSelector();
        }

        this.eventSelector = (selectorSettings.hasOwnProperty("eventSelector")) ? selectorSettings.eventSelector : "data-tracking-event";
        this.infoSelector = (selectorSettings.hasOwnProperty("infoSelector")) ? selectorSettings.infoSelector : "data-tracking-info";
        this.commerceSelector = (selectorSettings.hasOwnProperty("commerceSelector")) ? selectorSettings.commerceSelector : "data-tracking-commerce";
        this.pageSelector = (selectorSettings.hasOwnProperty("pageSelector")) ? selectorSettings.pageSelector : "page-impression";
        this.doneSelector = (selectorSettings.hasOwnProperty("doneSelector")) ? selectorSettings.doneSelector : "data-tracking-done";
        this.extendPageInfo = (selectorSettings.hasOwnProperty("extendPageInfo")) ? selectorSettings.extendPageInfo : ['url', 'userAgent', 'platform', 'domain', 'referrer', 'title', 'path', 'timestamp', 'params'];
        this.formSubmitSelector = (selectorSettings.hasOwnProperty("formSubmitSelector")) ? selectorSettings.formSubmitSelector : "form-submit";

        this.headerSelector = (selectorSettings.hasOwnProperty("headerSelector")) ? selectorSettings.headerSelector : "header";
    }

    HTMLSelector.prototype._splitUri = function (uri) {
        var splitRegExp = new RegExp(
            '^' +
                '(?:' +
                '([^:/?#.]+)' +                         // scheme - ignore special characters
                                                        // used by other URL parts such as :,
                                                        // ?, /, #, and .
                ':)?' +
                '(?://' +
                '(?:([^/?#]*)@)?' +                     // userInfo
                '([\\w\\d\\-\\u0100-\\uffff.%]*)' +     // domain - restrict to letters,
                                                        // digits, dashes, dots, percent
                                                        // escapes, and unicode characters.
                '(?::([0-9]+))?' +                      // port
                ')?' +
                '([^?#]+)?' +                           // path
                '(?:\\?([^#]*))?' +                     // query
                '(?:#(.*))?' +                          // fragment
                '$');

        var split;
        split = uri.match(splitRegExp);

        return {
            'protocol': split[1],
            'user_info': split[2],
            'domain': split[3],
            'port': split[4],
            'pathname': split[5],
            'search': split[6],
            'hash': split[7]
        }
    }

    HTMLSelector.prototype.setPageInfoField = function (info, field) {
        function pad(n) {
            return n < 10 ? '0' + n : n;
        }

        // if info.url is predefined, use this one
        var overWriteUrl = (info.url) ? this._splitUri(info.url) : false;

        switch (field) {
            case "url":
                info.url = (overWriteUrl !== false) ? info.url : document.URL;
                break;
            case "domain": info.domain = (overWriteUrl !== false) ? overWriteUrl.domain : document.domain;
                break;
            case "referrer": info.referrer = document.referrer;
                break;
            case "title": info.title = document.title;
                break;
            case "userAgent": info.userAgent = navigator.userAgent;
                break;
            case "platform": info.platform = navigator.platform;
                break;
            case "path": info.path = (overWriteUrl !== false) ? overWriteUrl.pathname : document.location.pathname;
                break;
            case "hash":
                if (document.location.hash) {
                    info.hash = document.location.hash;
                } else {
                    info.hash = (overWriteUrl !== false) ? overWriteUrl.hash : "";
                }
                break;
            case "timestamp": var d = new Date();
                info.timestamp = d.getFullYear() + "-" + pad((d.getMonth() + 1)) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
                break;
            case "params":
                info.params = {};
                if (document.location.search) {
                    document.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
                        info.params[key] = value;
                    }
                    );
                } else {
                    if (overWriteUrl !== false) {
                        if (overWriteUrl.search) {
                            overWriteUrl.search.replace(/([^&=]+)=?([^&]*)(?:&+|$)/g, function (match, key, value) {
                                info.params[key] = value;
                            });
                        }
                    }
                }
                break;
        }

        return info;
    }

    HTMLSelector.prototype.isRadio = function (elem) {
        return elem.type == "radio" && $(elem).closest('.radio, .radio-inline').length > 0;
    }

    HTMLSelector.prototype.isCheckbox = function (elem) {
        return elem.type == "checkbox" && $(elem).closest('.checkbox, .checkbox-inline').length > 0;
    }

    HTMLSelector.prototype.isRadioParent = function (pointContainer, elem) {
        return elem.type == "radio" && $(pointContainer).is('.radio, .radio-inline') && $.contains(pointContainer, elem);
    }

    HTMLSelector.prototype.isCheckboxParent = function (pointContainer, elem) {
        return elem.type == "checkbox" && $(pointContainer).is('.checkbox, .checkbox-inline') && $.contains(pointContainer, elem);
    }

    HTMLSelector.prototype.isVisible = function (elem) {
        var style = getComputedStyle(elem);
        if (style.display === 'none') return false;
        if (style.visibility !== 'visible') return false;
        if (style.opacity < 0.1 && !(this.isRadio(elem) || this.isCheckbox(elem))) return false;
        if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
            elem.getBoundingClientRect().width === 0) {
            return false;
        }

        var windowHeight = document.documentElement.clientHeight || window.innerHeight;
        var elemCenter = {
            x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
            y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
        };

        if (elemCenter.x < 0) return false;
        if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;

        if (elem.offsetHeight > windowHeight) {

            var offset = 40; // TODO how much of the element should be visible?
            var headerHeight = this.headerSelector ? $(this.headerSelector).outerHeight(true) : 0;

            if (elem.getBoundingClientRect().top > (windowHeight - offset)) return false;
            if (elem.getBoundingClientRect().top + elem.getBoundingClientRect().height < (offset + headerHeight)) return false;

            if (elem.getBoundingClientRect().top < 0) {
                elemCenter.y = headerHeight + 1
            }
            else {
                elemCenter.y = windowHeight - 1;
            }
        }
        else {
            if (elemCenter.y < 0) return false;
            if (elemCenter.y > windowHeight) return false;
        }

        var pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
        do {
            if (pointContainer === elem || this.isRadioParent(pointContainer, elem) || this.isCheckboxParent(pointContainer, elem)) return true;
        } while (pointContainer = pointContainer.parentNode);

        return false;
    }

    HTMLSelector.prototype._selectElements = function (selector) {
        return document.querySelectorAll(selector);
    }

    HTMLSelector.prototype._getItemType = function (item) {
        var event = item.getAttribute(this.eventSelector);
        if (event == this.pageSelector) return "page-impression";
        if (event.match(/impression/g)) return "impression";
        return "interaction";
    }

    HTMLSelector.prototype._getFormFieldData = function (formItem) {
        switch (formItem.tagName) {
            case 'INPUT':
                if (formItem.hasAttribute("type") && ((formItem.getAttribute("type") == "radio") || (formItem.getAttribute("type") == "checkbox"))) {
                    return (formItem.checked) ? formItem.value : "";
                } else {
                    return formItem.value;
                }
                break;
            case 'TEXTAREA':
                return formItem.value;
                break;
            case 'SELECT':
                return formItem.value;
                break;
        }
    }

    HTMLSelector.prototype._inArray = function (item, collectList) {
        for (var i = 0, ilen = collectList.length; i < ilen; i++) {
            if (item == collectList[i]) return true;
        }
        return false;
    }

    HTMLSelector.prototype._getFormData = function (item, collectList) {
        var formData = {};
        if (item.tagName == "FORM") {
            var formElements = item.elements;
            for (var j = 0, jlen = formElements.length; j < jlen; j++) {
                var formItem = formElements[j];
                if (formItem.hasAttribute(this.infoSelector)) {
                    //var formInfo = JSON.parse(formItem.getAttribute(this.infoSelector));
                    var formInfo = this._parseAttribute(formItem.getAttribute(this.infoSelector));
                    var fieldName = formInfo.field;
                    if (this._inArray("all", collectList) || this._inArray(fieldName, collectList)) {
                        formData[fieldName] = formData[fieldName] || "";
                        formData[fieldName] += ((this._getFormFieldData(formItem) == "") ? "" : this._getFormFieldData(formItem) + ",");
                    }
                }
            }
            for (var anItem in formData) {
                if (formData.hasOwnProperty(anItem)) {
                    formData[anItem] = formData[anItem].slice(0, -1);
                }
            }
        }
        else {
            //var formInfo = JSON.parse(item.getAttribute(this.infoSelector));
            var formInfo = this._parseAttribute(item.getAttribute(this.infoSelector));
            var fieldName = formInfo.field;
            if (this._inArray("all", collectList) || this._inArray(fieldName, collectList)) {
                formData[fieldName] = this._getFormFieldData(item);
            }
        }

        return formData;
    }

    HTMLSelector.prototype._parseAttribute = function (value) {
        if (value) {
            return JSON.parse(value.replace(/'/g, '"').replace(/&#x27;/g, '\''));
        }
        return '';
    }

    /**
     * Initialize the analyticstracker
     *
     *    the module returns a Singleton instance of the analyticstracker class
     *
     * @constructor analyticstracker();
     * @version 0.1.0
     * @author Stefan Maris
     * @copyright 2017 - MIT Licensed (http://www.opensource.org/licenses/mit-license.php)
     */
    var analyticstracker = function analyticstracker() {
        if (!(this instanceof analyticstracker)) {
            return new analyticstracker();
        }

        this.mediator = new Mediator();
        this._trackingSubscribers = [];
        this._internalTrackingQueue = [];
        this._internalTrackingHistory = [];
        this._htmlSelector = new HTMLSelector({});
        this._errorList = [];
        this._eventList = [];

        this.pageInfo = null;
    };

    analyticstracker.prototype.getInstance = function () {
        if (!_instance) {
            _instance = analyticstracker();
        }
        return _instance;
    }

    /**
     * Impression tracking handler
     *
     * @function
     * @param {string} selectorSettings selector Settings
     */
    analyticstracker.prototype.setHTMLSelectors = function (selectorSettings) {
        this._htmlSelector = new HTMLSelector(selectorSettings);
    }

    /* support for test environment */
    analyticstracker.prototype.resetTracker = function () {
        this._internalTrackingQueue = [];
        this._internalTrackingHistory = [];
        this._errorList = [];
        this._eventList = [];
        this.pageInfo = null;
    }

    analyticstracker.prototype.clone = function (a) {
        return JSON.parse(JSON.stringify(a));
    }

    analyticstracker.prototype.subscribe = function (subscribername, callback) {
        if (typeof callback === "function") {
            this._runHistory(subscribername, callback);
            this._trackingSubscribers.push({ "name": subscribername, "subscriber": this.mediator.subscribe("tracking", callback) });
        }
        return false;
    };

    analyticstracker.prototype._runHistory = function (subscribername, callback) {
        /* playback tracking history if subscriber was added later on */
        if (this._internalTrackingHistory.length == 0) return;

        var predicate = function (eventname, data, id) { return id === subscriber.id };
        var subscriber = this.mediator.subscribe("tracking_history", callback, { "predicate": predicate });

        for (var i = 0, len = this._internalTrackingHistory.length; i < len; i++) {
            var item = this._internalTrackingHistory[i];
            this.mediator.publish("tracking_history", item.event, item, subscriber.id);
        }

        this.mediator.remove("tracking_history", subscriber.id);
    }

    analyticstracker.prototype._runQueue = function () {
        for (var i = 0, len = this._internalTrackingQueue.length; i < len; i++) {
            var item = this._internalTrackingQueue.shift();
            if (item.pageInfo == null) item.pageInfo = this.pageInfo;
            this.mediator.publish("tracking", item.event, item);
        }
    }

    analyticstracker.prototype._track = function (trackEventData) {
        var eventdata = this.clone(trackEventData);
        var preEmptiveQueue = false;

        if (eventdata.event == this._htmlSelector.pageSelector) {
            this.pageInfo = this.clone(eventdata.info);
            delete eventdata.info;
        }
        else {
            preEmptiveQueue = true;
        }

        if (this.pageInfo == null) {
            // cannot track without page info - queue the event for later consumption
            // Queue the event
            this._internalTrackingQueue.push(eventdata);
            return false;
        }

        eventdata.pageInfo = this.pageInfo;

        if (preEmptiveQueue) this._runQueue();

        this.mediator.publish("tracking", eventdata.event, eventdata);
        this._internalTrackingHistory.push(eventdata);

        if (!preEmptiveQueue) this._runQueue();
    }

    analyticstracker.prototype._isObject = function (obj) {
        return obj !== null && typeof obj === 'object';
    }

    analyticstracker.prototype._isPlainObject = function (obj) {
        return this._isObject(obj) && (
            obj.constructor === Object  // obj = {}
            || obj.constructor === undefined // obj = Object.create(null)
        );
    }

    analyticstracker.prototype._mergeDeep = function (target, sources) {
        if (!Array.isArray(sources)) {
            sources = [sources];
        }

        if (!sources.length) return target;
        var source = sources.shift();

        if (Array.isArray(target)) {
            if (Array.isArray(source)) {
                for (var i = 0, len = source.length; i < len; i++) {
                    target.push(source[i]);
                }
            } else {
                target.push(source);
            }
        } else if (this._isPlainObject(target)) {
            if (this._isPlainObject(source)) {
                for (var key in source) {
                    if (source.hasOwnProperty(key)) {
                        if (!target[key]) {
                            target[key] = source[key];
                        } else if (this._isPlainObject(target[key]) && this._isPlainObject(source[key])) {
                            this._mergeDeep(target[key], source[key]);
                        }
                        else {
                            target[key] = source[key];
                        }
                    }
                }
            } else {
                throw new Error("Cannot merge object with non-object");
            }
        } else {
            target = source;
        }
        return this._mergeDeep(target, sources);
    };

    /*
     * Public
     */

    analyticstracker.prototype.getErrors = function () {
        return this._errorList;
    }

    analyticstracker.prototype.getEventFromElement = function (theElements) {
        var theEvent = "";
        for (var i = 0, len = theElements.length; i < len; i++) {
            var item = theElements[i];
            if (item.hasAttribute(this._htmlSelector.eventSelector)) {
                theEvent = item.getAttribute(this._htmlSelector.eventSelector);
                return theEvent;
            }
        }
        return theEvent;
    }

    analyticstracker.prototype.trackElement = function (theElements, options) {
        try {
            var collector = [];

            if (typeof options === "undefined") { options = null; }
            /* check options */
            var addData = ((options !== null) && options.hasOwnProperty("addData")) ? options.addData : null;
            var checkVisibility = ((options !== null) && options.hasOwnProperty("checkVisibility")) ? options.checkVisibility : true;
            var doCollect = ((options !== null) && options.hasOwnProperty("doCollect")) ? options.doCollect : false;
            var extendPageInfo = ((options !== null) && options.hasOwnProperty("extendPageInfo")) ? options.extendPageInfo : true;
            var changeEvent = ((options !== null) && options.hasOwnProperty("changeEvent")) ? options.changeEvent : null;
            var newPage = ((options !== null) && options.hasOwnProperty("newPage")) ? options.newPage : false;
            var collectFormData = ((options !== null) && options.hasOwnProperty("collectFormData")) ? options.collectFormData : false;

            var trackOnce = ((options !== null) && options.hasOwnProperty('trackOnce')) ? options.trackOnce : false;

            if (newPage) {
                /* indicates tracking of a new page - first clear all "DONE" trackImpressions */
                var elements = this._htmlSelector._selectElements('[' + this._htmlSelector.eventSelector + '$=-impression]');
                for (var i = 0, len = elements.length; i < len; i++) {
                    var item = elements[i];
                    if (this._htmlSelector._getItemType(item) == "impression") {
                        item.removeAttribute(this._htmlSelector.doneSelector);
                    }
                }
            }

            for (var i = 0, len = theElements.length; i < len; i++) {
                var item = theElements[i];
                if (checkVisibility && (this._htmlSelector._getItemType(item) == "impression" || trackOnce) && (!this._htmlSelector.isVisible(item))) {
                    continue;
                }

                var eventElement = { "event": (changeEvent === null) ? item.getAttribute(this._htmlSelector.eventSelector) : changeEvent };

                if ((eventElement.event.match(/impression/g) || trackOnce) && (eventElement.event != this._htmlSelector.pageSelector) && item.getAttribute(this._htmlSelector.doneSelector)) {
                    /* element already tracked */
                    continue;
                }

                if (item.getAttribute(this._htmlSelector.infoSelector)) { eventElement.info = this._htmlSelector._parseAttribute(item.getAttribute(this._htmlSelector.infoSelector)); }
                if (item.getAttribute(this._htmlSelector.commerceSelector)) { eventElement.commerce = this._htmlSelector._parseAttribute(item.getAttribute(this._htmlSelector.commerceSelector)); }

                if ((eventElement.event == this._htmlSelector.pageSelector) && extendPageInfo && (this._htmlSelector.extendPageInfo.length > 0)) {
                    for (var k = 0, klen = this._htmlSelector.extendPageInfo.length; k < klen; k++) {
                        var infoField = this._htmlSelector.extendPageInfo[k];
                        if (!eventElement.info.hasOwnProperty(infoField)) {
                            eventElement.info = this._htmlSelector.setPageInfoField(eventElement.info, infoField);
                        }
                    }
                }

                if (addData !== null) {
                    eventElement = this._mergeDeep(eventElement, addData);
                }

                if (collectFormData !== false) {
                    var formData = { "info": { "formdata": this._htmlSelector._getFormData(item, collectFormData) } };
                    eventElement = this._mergeDeep(eventElement, formData);
                }

                if (!doCollect) {
                    this._track(eventElement);
                } else {
                    collector.push(eventElement);
                }

                /* indicate that the element is tracked */
                if (this._htmlSelector._getItemType(item) == "impression" || trackOnce) {
                    item.setAttribute(this._htmlSelector.doneSelector, 'true');
                }
            }

            if (doCollect) {
                if (collector.length > 0) {
                    var collectedEvent = { "event": collector[0].event, "info": [], "commerce": [] };

                    for (var n = 0, len = collector.length; n < len; n++) {
                        var item = collector.shift();
                        if (item.info) {
                            collectedEvent.info.push(item.info);
                        }
                        if (item.commerce) {
                            collectedEvent.commerce.push(item.commerce);
                        }
                    }

                    if (collectedEvent.info.length == 0) { delete collectedEvent.info; }
                    if (collectedEvent.commerce.length == 0) { delete collectedEvent.commerce; }

                    this._track(collectedEvent);
                }
            }
        } catch (e) {
            this._errorList.push(e);
            return false;
        }

        return true;
    }

    /**
     * Get current visible impressions
     * @function
     * @param {string} eventSelector impression data selector
     * @example analyticstracker.getVisibleImpressions("contentblock-impression");
     * return array of visible impressions items
     */
    analyticstracker.prototype.getVisibleImpressions = function (eventSelector) {
        try {
            var selector = '[' + this._htmlSelector.eventSelector + '="' + eventSelector + '"]:not([' + this._htmlSelector.doneSelector + '="true"])';
            var selectedElements = this._htmlSelector._selectElements(selector);
            var visibleElements = [];
            if (selectedElements.length) {
                for (var i = 0, len = selectedElements.length; i < len; i++) {
                    var item = selectedElements[i];
                    if ((this._htmlSelector._getItemType(item) == "impression") && (this._htmlSelector.isVisible(item))) {
                        visibleElements.push(item);
                    }
                }
            }
        } catch (e) {
            this._errorList.push(e);
            return false;
        }

        return visibleElements;
    }

    /**
     * Impression tracking handler
     * @function
     * @param {string} eventSelector impression data selector
     * @param {object} options optional tracking options (see {@link trackingOptions})
     * @example analyticstracker.trackImpression("page-impression");
     * @example analyticstracker.trackImpression("product-impression", {"doCollect" : true});
     */
    analyticstracker.prototype.trackImpression = function (eventSelector, options) {
        try {
            var selector = '[' + this._htmlSelector.eventSelector + '="' + eventSelector + '"]:not([' + this._htmlSelector.doneSelector + '="true"])';
            var selectedElements = this._htmlSelector._selectElements(selector);
            if (selectedElements.length) {
                this.trackElement(selectedElements, options);
            }
        } catch (e) {
            this._errorList.push(e);
            return false;
        }

        return true;
    }

    /**
     * Track event by passing event object
     * @function
     * @param {object} eventData event data object
     * @example analyticstracker.trackEvent({"event": "product-impression", "commerce" : {"id" : "12233", "name" : "someproduct", "price" : 1234.45}})
     */
    analyticstracker.prototype.trackEvent = function (eventData) {
        this._track(eventData);
        return true;
    }

    /**
     * Interaction tracking handlers
     *
     *    this function can directly be referenced in an event handler
     * @function
     * @param {object} event the browser event
     * @param {object} options optional tracking options (see {@link trackingOptions})
     * @example $('[data-tracking-event=product-click]').click(analyticstracker.trackInteraction)
     * @example $('[data-tracking-event=navigation-click]').click(function(e) {analyticstracker.trackInteraction(e, {"changeEvent" : "page-impression", "newPage" : true});});
     */
    analyticstracker.prototype.trackInteraction = function (event, options) {
        return _instance.trackElement([event.currentTarget], options);
    }

    analyticstracker.prototype.register = function (eventList) {
        this._eventList = eventList;
    }

    analyticstracker.prototype.trackingSubscribe = analyticstracker.prototype.subscribe;

    return analyticstracker.prototype.getInstance;
}));

var ag = ag || {};
ag.template = ag.template || {};

ag.template.tracking = function ($) {
    var _impressionsToIgnore = [];
    var _atrack = analyticstracker();

    $(function () {
        _atrack.trackImpression("page-impression");
        trackOtherImpressions();
        initDefaultEventTracking();
        initFormTracking();
    });

    function initDefaultEventTracking() {
        $(document).on('click', '[data-tracking-event$=-click]', function (e) {

            var info = {};

            AddButtonTrackingValues(info, $(e.currentTarget));

            var options = {
                addData: {
                    info: info
                }
            };

            _atrack.trackInteraction(e, options);
        });

        $(document).on('dropdown-click', '[data-tracking-event$=-click]', function (e) {
            _atrack.trackInteraction(e);
        });

        $(document).on('change', '[data-tracking-event$=-change]', function (e) {
            _atrack.trackInteraction(e);
        });

        $(document).on('focus dropdown-focus', '[data-tracking-event$="-focus"]', function (e) {
            _atrack.trackInteraction(e);
        });

        $(document).on('submit', '[data-tracking-event$=-submit]', function (e) {
            _atrack.trackInteraction(e);
        });
    }

    function getTarget($element) {
        if ($element.is('[onclick^="location.href="]')) {
            var onclick = $element.attr('onclick');
            return onclick.substring(15, onclick.length - 1);
        }
    }

    function trackOtherImpressions() {
        // track when an element get's into the viewport (visibility check is done by the 'trackElement'-method)
        var $elements = $('[data-tracking-event$="-impression"]').not('[data-tracking-event="page-impression"]').not('[data-tracking-done="true"]');

        $.each(_impressionsToIgnore, function () {
            $elements = $elements.not('[data-tracking-event="' + this + '"]');
        });

        if ($elements.length > 0) {
            _atrack.trackElement($elements);
        }

        setTimeout(trackOtherImpressions, 1000);
    }

    function initFormTracking() {
        trackFormImpressions();

        $(document).on('submit', 'form[data-tracking-event="form-step"]', function (e) {
            var $form = $(this);
            if ($form.valid()) {
                var options = {
                    addData: { event: 'form-submitstep' }
                };

                var stepoption = getStepOption($form);

                if (stepoption) {
                    options.addData.info = {
                        stepoption: stepoption
                    };
                }

                trackElement($form, options);
            }
        });

        // Does not work on document => not bubbled
        $('form[data-tracking-event="form-step"]').on('submit', function (e) {
            var $form = $(this);
            if (!$form.valid()) {
                var errorList = $form.validate().errorList;

                if (errorList) {
                    var message = errorList.map(function (element) { return element.message; }).join('/');

                    logFormError($form, message);
                }
            }
        });
    }

    function getStepOption($form) {
        var stepoption = $form.attr('data-tracking-stepoption');

        if (stepoption) {
            var $radio = $(':radio[name="' + stepoption + '"]:checked');

            if ($radio.length > 0) {
                return getRadioLabel($radio, stepoption);
            }

            var $dropdown = $('select[name="' + stepoption + '"]');

            if ($dropdown.length > 0) {
                return $dropdown.find('option:selected').text();
            }

            var $checkboxes = $(':checkbox[name="' + stepoption + '"]:checked');

            if ($checkboxes.length > 0) {
                var label = $checkboxes.map(function () { return getCheckboxLabel(this, stepoption); }).join('/');
                return label;
            }
        }
    }

    function getRadioLabel($radio, stepoption) {
        return getControlLabel($radio, stepoption, ':radio');
    }

    function getCheckboxLabel($checkbox, stepoption) {
        return getControlLabel($checkbox, stepoption, ':checkbox');
    }

    function getControlLabel($element, stepoption, type) {
        var label = $element.attr('data-tracking-stepoption-label');

        if (label) {
            return label;
        }

        var $labelFor = $('label[for="' + $element.attr('id') + '"]');

        if ($labelFor.length === 0) {
            $labelFor = $element.closest('label');
        }

        if ($labelFor.length > 0) {
            if ($labelFor.find(':not(' + type + '):not(input[type="hidden"])').length === 0) {
                return $labelFor.text();
            }
        }

        return $element.val();
    }

    function trackFormImpressions() {
        var $forms = $('[data-tracking-event="form-step"]').not('[data-tracking-done="true"]');

        if ($forms.length > 0) {
            var options = {
                addData: { event: 'form-startstep' },
                trackOnce: true
            };

            trackElement($forms, options);
        }

        setTimeout(trackFormImpressions, 1000);
    }

    function AddButtonTrackingValues(info, $elem) {
        if (info, $elem && $elem.length > 0) {

            $elem.each(function (e, i) {
                var $element = $(this);
                var url = $element.attr('href') || getTarget($element) || '';
                var label = $element.text().trim() || $element.val().trim() || '';

                if (url) {
                    info['target'] = url;
                }

                if (label) {
                    info['name'] = label;
                }
            });
        }
    }

    /*
     * Public
     */

    /**
     * Configure the tracking-service.
     * @function
     * @param {object} config The tracking configuration options (automaticButtonTracking / headerSelector)
     * @example ag.template.tracking.configure({ automaticButtonTracking: true, headerSelector: '#alternativeHeader' })
     */
    function configure(config) {
        if (config) {
            if (config.automaticButtonTracking) {
                $(document).on('click', 'a:not([data-tracking-ignore="true"]):not([data-tracking-event$="-click"]), input[type="button"]:not([data-tracking-ignore="true"]):not([data-tracking-event$="-click"]), input[type="submit"]:not([data-tracking-ignore="true"]):not([data-tracking-event$="-click"]), button:not([data-tracking-ignore="true"]):not(.dropdown-toggle):not([data-tracking-event$="-click"])', function (e) {
                    try {
                        var $element = $(e.currentTarget);
                        var info = {};

                        AddButtonTrackingValues(info, $element);

                        log('button-click', info);
                    }
                    catch (e) {
                        console.log(e.message);
                    }
                });
            }

            if (config.headerSelector) {
                var selectorSettings = {
                    headerSelector: config.headerSelector
                }

                _atrack.setHTMLSelectors(selectorSettings);
            }
        }
    }

    /**
     * Manually log an event to the tracking-service.
     * @function
     * @param {string} event The name of the event to log.
     * @param {object} info The info that should be logged for the event.
     * @example ag.template.tracking.log('button-click', { logged: 'manual', button: 'myButton', extra: { foo: 'bar' } })
     */
    function log(event, info) {
        var trackingEvent = {
            'event': event,
            'info': info
        }

        _atrack.trackEvent(trackingEvent);
    }

    function setImpressionsToIgnore(impressions) {
        if (impressions) {
            if (typeof impressions === 'string') {
                _impressionsToIgnore.push(impressions);
            }
            else if ($.isArray(impressions)) {
                _impressionsToIgnore = _impressionsToIgnore.concat(impressions);
            }
            else {
                console.log('Parameter "impressions" has an invalid type');
            }
        }
    }

    /**
     * Track the interaction with an element based on the values in the data-tracking-event & data-tracking-info attributes.
     * @function
     * @param {object} event The browser eventObject.
     * @param {object} options Optional tracking options.
     * @example $('button[data-tracking-event="element-blur"]').on('blur', function (e) { ag.template.tracking.trackInteraction(e) })
     */
    function trackInteraction(event, options) {
        _atrack.trackInteraction(event, options);
    }

    /**
     * Track an element based on the values in the data-tracking-event & data-tracking-info attributes.
     * @function
     * @param {jQuery} $elements The elements to track.
     * @param {object} options Optional tracking options.
     * @example ag.template.tracking.trackElement($('#myElement'))
     */
    function trackElement($elements, options) {
        _atrack.trackElement($elements, options);
    }

    /**
     * Add or change a key-value pair in the data-tracking-info attribute of an element.
     * @function
     * @param {jQuery} $elem The element to add the info to.
     * @param {string} key The key of the info to add/change.
     * @param {*} value The value to add/change.
     * @example ag.template.tracking.setInfo($('#myElement'), 'currentDate', new Date())
     */
    function setInfo($elem, key, value) {
        if ($elem) {
            $.each($elem, function () {
                var elem = this;

                var info = elem.getAttribute('data-tracking-info');

                if (info) {
                    info = JSON.parse(info.replace(/'/g, '"'));

                    if (info) {


                        info[key] = value;

                        elem.setAttribute('data-tracking-info', JSON.stringify(info).replace(/"/g, "'"));
                    }
                }
            });
        }
    }

    /**
     * Log an error for a form.
     * @function
     * @param {jQuery} $form The form to log the error for.
     * @param {string} message The error message.
     * @example ag.template.tracking.logFormError($('#myForm'), "You're doing something wrong!");
     */
    function logFormError($form, message) {
        var options = {
            addData: {
                event: 'form-error',
                info: {
                    message: message,
                    type: 'user error'
                }
            }
        };

        trackElement($form, options);
    }

    /**
     * Log the last step of a form(-flow).
     * @function
     * @param {object} The info to log.
     * @example ag.template.tracking.logFormLaststep({ formname: 'tracking-form', stepname: 'confirmation' });
     */
    function logFormLaststep(info) {
        log('form-laststep', info);
    }

    return {
        configure: configure,
        log: log,
        setImpressionsToIgnore: setImpressionsToIgnore,
        trackInteraction: trackInteraction,
        trackElement: trackElement,
        setInfo: setInfo,
        logFormError: logFormError,
        logFormLaststep: logFormLaststep
    }
}(jQuery);