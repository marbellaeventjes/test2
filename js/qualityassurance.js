/*!
* AnalyticsTransQA.js Library v0.9.0
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
    define(["analyticstracker"], function (analyticstracker) {
			return (root.analyticsTransQA = factory(analyticstracker, window));
		});
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('analyticstracker'), window);
  } else {
    // Browser globals
    root.analyticsTransQA = factory(root.analyticstracker, window);
  }

}(this, function (analyticstracker, w) {
// UMD Definition above, do not remove this line
  'use strict';

  var _instance;

  var analyticsTransQA = function analyticsTransQA() {
    if (!(this instanceof analyticsTransQA)) {
      return new analyticsTransQA();
    }

    this.tracker = analyticstracker();
    this._subscribe();
  }

  analyticsTransQA.prototype.getInstance = function() {
    if (!_instance) {
        _instance = analyticsTransQA();
    }
    return _instance;
  }

  analyticsTransQA.prototype._subscribe = function() {
    try {
      this.tracker.trackingSubscribe("QA", function (event, data) {
    	//console.log("QA tracker: " + event);
        //console.log(data);
      	//console.log("********");

          try {
              if ((typeof w != "undefined") && (w != null)) {
                  var eventLog = w.sessionStorage.getItem('eventLog');
                  eventLog += "," + JSON.stringify(data);
                  w.sessionStorage.setItem('eventLog', eventLog);
                  w.postMessage('analytics-track-change', '*');
              }
          } catch (err)
          { }
    	});
    } catch (e) {
      console.log("QA tracker ERROR: " + e.name + ": " + e.message);
    }
  }

  analyticsTransQA.prototype.resetEventLog = function() {
    try {
      if ((typeof w != "undefined") && (w != null) && (typeof w != "undefined")) {
        w.sessionStorage.setItem('eventLog', "");
      }
    } catch (e) {
      console.log("QA tracker ERROR: " + e.name + ": " + e.message);
    }
  }

  analyticsTransQA.prototype.setAvailableEvents = function (eventlist) {}

  _instance = analyticsTransQA();
  return analyticsTransQA.prototype.getInstance;
}));
