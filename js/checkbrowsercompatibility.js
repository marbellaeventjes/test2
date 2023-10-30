var browserCheckCookie = "ConnectMVCTemplateCheckBrowserDisabled";

$(document).ready(function () {

    // Check the browser of the user, unless the user disabled this check (setting set in a cookie).
    if (readCookie(browserCheckCookie) !== "true") {

        // Check the browser, its version and if the user is surfing on a "mobile" (touchscreen) device.
        var navigatorCompatible = true;

        BrowserDetect.init();
        var OSDetected = BrowserDetect.platform;

        var isMobile = Modernizr.touch;

        if (BrowserDetect.browser === 'Chrome') {
            if (BrowserDetect.version < 57) {
                navigatorCompatible = false;
            }
        }
        else if (BrowserDetect.browser === 'Explorer') {
            if ((!isMobile && BrowserDetect.version < 9)
                || (isMobile && BrowserDetect.version < 10)) {
                navigatorCompatible = false;
            }
        }
        else if (BrowserDetect.browser === 'Firefox') {
            if (BrowserDetect.version < 52) {
                navigatorCompatible = false;
            }
        }
        else if (BrowserDetect.browser === 'Safari') {
            if (BrowserDetect.version < 8) {
                navigatorCompatible = false;
            }
        }
        else if (BrowserDetect.browser === 'MS Edge') {
            navigatorCompatible = true;
        }
        else { // Opera etc.
            navigatorCompatible = false;
        }

        // Showing the popup if the browser is not supported:

        if (!navigatorCompatible) {
            var $container = $("div#browserCheck");
            $container.load(
                // The URL of the content page to be loaded:
                $container.attr("data-contentUrl"),
                // The data to be sent to this URL:
                {
                    "culture": currentLanguage,
                    "isMobile": isMobile,
                    "OSDetected": OSDetected
                }
            );
        }
        else {
            createCookie(browserCheckCookie, "true", 30);
        }
    }
});

function IgnoreOutdatedBrowserWarning() {
    $('#CheckBrowserCompatibilityPopUp').modal('hide');
    // Do not show the check browser popup anymore, well... at least for 30 days:
    // (Note: in our site, the user cannot refuse to have cookies, he's only notified about the fact that we use them. So we set a cookie here whatever.)
    createCookie(browserCheckCookie, "true", 30);
}
var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "Other";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
        this.platform = navigator.platform;
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) !== -1) {
                return data[i].identity;
            }
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index === -1) {
            return;
        }

        var rv = dataString.indexOf("rv:");
        if (this.versionSearchString === "Trident" && rv !== -1) {
            return parseFloat(dataString.substring(rv + 3));
        } else {
            return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
        }
    },

    dataBrowser: [
        { string: navigator.userAgent, subString: "Edge", identity: "MS Edge" },
        { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
        { string: navigator.userAgent, subString: "MSIE", identity: "Explorer" },
        { string: navigator.userAgent, subString: "Trident", identity: "Explorer" },
        { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
        { string: navigator.userAgent, subString: "Safari", identity: "Safari" },
        { string: navigator.userAgent, subString: "Opera", identity: "Opera" }
    ]
};