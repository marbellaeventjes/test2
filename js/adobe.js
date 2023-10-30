/*!
* AnalyticsTransGTMEE.js Library v0.9.0
*
* Copyright 2017, Stefan Maris
* MIT Licensed (http://www.opensource.org/licenses/mit-license.php)
*
*
* Last update: December 5, 2017
*/
(function (root, factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['analyticstracker'], function (analyticstracker) {
        return root.analyticsTransDTM = factory(analyticstracker, window)
	});
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('analyticstracker'), window);
  } else {
    // Browser globals
    root.analyticsTransDTM = factory(root.analyticstracker, window);
  }

}(this, function (analyticstracker, w) {
// UMD Definition above, do not remove this line
  'use strict';
  var _instance;


  if ((typeof w != "undefined") && (w != null)) {
    /*
     * Internet Explorer 9-11 does not have CustomEvent
     * Using polyfill to create CustomEvent in window scope
     * (documented solution)
     */
    (function () {
    	if ( typeof w.CustomEvent === "function" ) return false;

    	function CustomEvent ( event, params ) {
    		params = params || { bubbles: false, cancelable: false, detail: undefined };
    		var evt = document.createEvent( 'CustomEvent' );
    		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    		return evt;
    	}

    	CustomEvent.prototype = w.Event.prototype;

    	w.CustomEvent = CustomEvent;
    })();
  }

  var analyticsTransDTM = function analyticsTransDTM() {
    if (!(this instanceof analyticsTransDTM)) {
      return new analyticsTransDTM();
    }

    this.tracker = analyticstracker();
    this._subscribe();
  }

  analyticsTransDTM.prototype.getInstance = function() {
    if (!_instance) {
        _instance = analyticsTransDTM();
    }
    return _instance;
  }

  analyticsTransDTM.prototype.getTracker = function() {
    return this.tracker;
  }

  analyticsTransDTM.prototype._subscribe = function() {
    try {
      this.tracker.trackingSubscribe("DTM", function (event, data) {
    	//console.log("DTM tracker: " + event);
      	//console.log(data);
      	//console.log("********");

        if ((typeof w != "undefined") && (w != null)) {
          var cEvent = new w.CustomEvent(event, { detail : data, bubbles: true });
            w.document.body.dispatchEvent(cEvent);
        }
      });
    } catch (e) {
      console.log("DTM tracker ERROR: " + e.name + ": " + e.message);
    }
  }

  _instance = analyticsTransDTM();
  return analyticsTransDTM.prototype.getInstance;
}));
