/* Behavior for forms, this include how forms will behave and a part of the automatic setup about client validation and logging for analytics purpose */

//these variables will store functions from specifics page and act like a C# delegate
var delegateValidateFormSuccess = [];
var delegateValidateFormError = [];
var delegateBeforeValidation = [];
(function (window, document, $, undefined) {

    /* enable submit of forms with all element of type "submit" that are not necesserally inside the form */



    /* enable action with "enter" key to navigate and activate element 
     * Listen for the enter key press. If target is input field, submit form at "enter"
     * if not, convert "enter" action into "click" action to activate element currently focused
     */


   /* Prevent a second submit by click because of the "ValidateState( x => () ...)" protection inside controllers
    * (ValidState help the server by keeping trace of users steps. That is why sending a second validation can cause server steps to move "backward" on Home page just after a successfull first submit)
    * Added Array of function that will serve as delegate for forms that need extra actions performed before submit or if validation failed
    */


   /* Enable tooltips on page when their element is detected. 
    * Note: It's a bootstrap plugin 
    */
    function setTooltips() {

        window.addEventListener("DOMContentLoaded", function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    }

    //publishing the functions "public"


    window.setTooltips = setTooltips;

})(window, document, jQuery);




/** Filter input characters: **/
(function (window, document, $, undefined) {

    //regex check
    function filterKeyPresses(allowedCharactersRegex, keyPressEvent) {
        var regex = new RegExp(allowedCharactersRegex);
        var key = String.fromCharCode(!keyPressEvent.charCode ? keyPressEvent.which : keyPressEvent.charCode);
        if (!regex.test(key)) {
            keyPressEvent.preventDefault();
            return false;
        }
    }

    //a wrap to pass any JQuery element and apply the filter to it
    function FilterEnrolmentIdKeyPresses(jQueryElement, allowedCharactersRegex) {
        jQueryElement.bind('keypress', function (event) {
            filterKeyPresses(allowedCharactersRegex, event);
        });
    }

    //publishing the functions "public"
    window.filterKeyPresses = filterKeyPresses;
    window.FilterEnrolmentIdKeyPresses = FilterEnrolmentIdKeyPresses;

})(window, document, jQuery);




/** Generic configuration for input fields: **/
(function (window, document, $, undefined) {

   /* Remove leading and trailing spaces from entered (via keyboard) or pasted values in the input fields 
    */
    function enableInputTrim() {

        window.addEventListener("DOMContentLoaded", function (e) {
            $(":input").blur(function () { // for entered (via keyboard) values
                var control = $(this);
                var trimmedValue = control.val().trim();
                control.val(trimmedValue);
            }).on('paste', function () { // for pasted values
                var control = $(this);
                setTimeout(function () {
                    var trimmedValue = control.val().trim();
                    control.val(trimmedValue);
                }, 10);
            });
        });
    }

    function setFocusInFirstEditableField() {
        window.addEventListener("load", function () {
            if (window.document.querySelectorAll(".g-recaptcha")) {
                return false;
            }

            var isInputPresent = window.document.querySelectorAll(".formInput .form-control");

            if (isInputPresent != null && isInputPresent.length > 0) {
                isInputPresent[0].focus(); //add focus in vanilla js
            }
        });
    }

    //publishing the functions "public"
    window.enableInputTrim = enableInputTrim;
    window.setFocusInFirstEditableField = setFocusInFirstEditableField;

})(window, document, jQuery);




String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};




/** Generic modal configuration: **/
(function (window, document, $, undefined) {

    /* On the helpZone (button "?" in footer) there are multiple tab or dropdones possible at a time
     * Get the list of element and set the first one as active to have it open when user browse here
     */
    function helpModalSetup() {

        window.addEventListener("DOMContentLoaded", function () {
            var button = window.document.querySelector("#helpButton");
            if (button == undefined || button == null) {
                return;
            }

            if (button.tagName == 'A' || button.tagName == 'a') {
                return;
            }

            button.addEventListener("click", function () {
                var isModalLoaded = window.document.querySelector("#helpModel");
                if (isModalLoaded == null || isModalLoaded == undefined) {
                    getModalPartialView();
                }
            });
        });


        function getModalPartialView() {
            $.ajax({
                type: 'POST',
                url: modalUrl,  //comes from MasterLayout
                data: {
                    'model': popOverModel //comes from MasterLayout
                },
                dataType: 'html',
                error: function (jqXHR, textStatus, errorThrown) {
                },
                //async: true, //mandatory for the re-draw
                success : function (data) {
                    var e = document.querySelector('#interactiveZone');
                    e.insertAdjacentHTML('beforeend', data);

                    $('#helpModel').modal({
                        keyboard: false,
                        show: true
                    });

                    openfirstTab();
                    videoPlayerBehavior();
                    desktopTabActiveOnClick();
                }
            })
        }

        function desktopTabActiveOnClick() {
            var navLinkList = document.getElementsByClassName("nav-link");

            for (y = 0; y < navLinkList.length; y++) {

                navLinkList[y].addEventListener("click", function () {

                    this.parentNode.classList.add("active");

                    let prevSibling = this.parentNode.previousElementSibling;
                    let nextSibling = this.parentNode.nextElementSibling;

                    while (prevSibling) {
                        prevSibling.classList.remove("active");
                        prevSibling = prevSibling.previousElementSibling;
                    }

                    while (nextSibling) {
                        nextSibling.classList.remove("active");
                        nextSibling = nextSibling.nextElementSibling;
                    }
                });
            };
            
        }

        //little hack to make the deprecated froogaloop library to work
        function videoPlayerBehavior() {
            var players, playersmobile, isexist;

            isexist = window.document.querySelector('#video');
            if (isexist != null && isexist != undefined) {
                players = isexist.querySelector('iframe');

                //froogaloop do not support "object" so force the iframe to get an id to be findable by it
                if (players != null && players != undefined) {
                    players.setAttribute('id', 'videoplayer');
                }
            }

            isexist = window.document.querySelector('#videoDropdown');
            if (isexist != null && isexist != undefined) {
                playersmobile = isexist.querySelector('iframe');

                //froogaloop do not support "object" so force the iframe to get an id to be findable by it
                if (playersmobile != null && playersmobile != undefined) {
                    playersmobile.setAttribute('id', 'videoplayermobile');
                }
            }

            if ((players == null && playersmobile == null)
                ||
                (players == undefined && playersmobile == undefined)) {
                return false;
            }

         
            //attach "pause" event to closure of modal
            var modal = window.document.querySelector('#helpModel');
            var btnclose = modal.querySelector('.close');
            btnclose.addEventListener('click', function () {
                //$f is the window variable published to call froogaloop, NOT related to jquery
                var vPlayerMobile = window.document.getElementById("videoplayermobile");
                if (vPlayerMobile != null && vPlayerMobile != undefined) {
                    $f("videoplayermobile").api('pause');
                }

                var vPlayer = window.document.getElementById("videoplayer");
                if (vPlayer != null && vPlayer != undefined) {
                    $f("videoplayer").api('pause');
                }
            });         
        }

        function openfirstTab() {
            //desktop
            var navItemList = document.getElementsByClassName("nav-item");
            
            if (navItemList.length > 0) {
                navItemList[0].classList.add("active");
                navItemList[0].firstElementChild.classList.add("active");
                navItemList[0].firstElementChild.setAttribute("aria-selected", "true");
            
                var tabPanList = document.getElementsByClassName("tab-pane");
                if (tabPanList.length > 0) {
                    tabPanList[0].classList.add("active");
                    tabPanList[0].classList.add("show");
                }
            }
           
           //mobile
            var panelItemList = document.getElementsByClassName("dropdownMenuMobile");
            
            if (panelItemList.length > 0) {
                panelItemList[0].firstElementChild.classList.remove("collapsed");
                panelItemList[0].firstElementChild.setAttribute('aria-expanded', 'true');
                panelItemList[0].parentNode.querySelector(".panel-to-collapse").classList.add("show");
            }
           
        }
    }

   /* Modal is displayed after a valid form is submitted to server
    * Show a "An SMS is being sent..." message
    */
    function sendSMSModal() {

        $('#SendingSMSPopup').modal({ backdrop: 'static', keyboard: false });
        $("#SendingSMSPopup").modal('show');
    }

    /* Modal is displayed after a valid form is submitted to server
    * Show a "An Mail is being sent..." message
    */
    function sendMailModal() {
        
        $('#SendingMailPopup').modal({ backdrop: 'static', keyboard: false });
        $("#SendingMailPopup").modal('show');
    }

    window.sendMailModal = sendMailModal;
    window.sendSMSModal = sendSMSModal;
    window.setHelpModal = helpModalSetup;

})(window, document, jQuery);




/** Generic behavior configuration: **/
(function (window, document, $, undefined) {

   /* To prevent user to click multiple time on a link (double click) and risk to throw the context out of balance
    * Same thing that with the prevention with double submit
    */
    function setPreventDoubleClick() {

        window.addEventListener("DOMContentLoaded", function () {
            $("a.noDoubleClick").on("click", function (event) {
                var $link = $(this);
                if ($link.data("timesclicked") == undefined) { // first click
                    $link.data("timesclicked", 1);
                }
                else { // later clicks
                    var clicks = parseInt($link.data("timesclicked"));
                    $link.data("timesclicked", clicks + 1);
                }
                // only execute default action on first click:
                return ($link.data("timesclicked") <= 1);
            });
        });
    }


    /*
     *  Anti-overflow protection. Screens are normally centered in middle of the page but sometime they are too long and flex do not expend
     */
    function heightOverflowProtection() {
        window.addEventListener("load", function () {
            if (window.document.body.scrollWidth > 767) {
                calculateHeight();
            }
        });

        window.addEventListener("orientationchange", function () {
            if (window.document.body.scrollWidth > 767) {
                calculateHeight();
            }
        });

        var resizeWindow;
        window.addEventListener("resize", function () {
                window.document.body.style.height = "100%"; //force browser to compute element size
            if (window.document.body.scrollWidth > 767) {
                clearTimeout(resizeWindow);
                resizeWindow = setTimeout(function () {
                    calculateHeight();
                }, 250);
            }
            else {
                window.document.body.style.height = "100%";
            }
        });

        function calculateHeight() {
            var content = document.getElementById('interactiveZone');     
            var bodyContainer = window.document.body;
        
            if (bodyContainer.scrollHeight - content.scrollHeight < 0) {
                bodyContainer.style.height = content.scrollHeight + "px";
            }
            else {                
                bodyContainer.style.height = "100%";
            }
        }
    }


    /*
     * Prevent animation for helpbutton to launch at each page
     */
    function helpButtonAnimation() {
        window.document.addEventListener("DOMContentLoaded", function () {
            var animationPartA = window.document.querySelector("#helpButtonExtended");
            var animationPartB = window.document.querySelector("#helpButtonLeft");

            //if we come from outside MSA navigation, play helpbutton animation
            if (window.document.referrer != ""
                && animationPartA != null
                && animationPartB != null)
            {
                animationPartA.style.display = "none";
                animationPartB.style.display = "none";
            } 
        });
    }

    window.heightOverflowProtection = heightOverflowProtection;
    window.setPreventDoubleClick = setPreventDoubleClick;
    window.helpButtonAnimation = helpButtonAnimation;

})(window, document, jQuery);




/** Configuration for Expertise Center analytics **/
(function (window, document, $, undefined) {

    function configureAnalytics() {
        if (ag != undefined && ag.template != undefined && ag.template.tracking != undefined) {

            initAutomaticButtonTracking();
            initAutomaticTrackingOnPageLoad();
            delegateValidateFormSuccess.push(initAutomaticSubmitOnSuccess);
         
        }
    }
    window.configureAnalytics = configureAnalytics;
    window.gatherTrackingInfoData = gatherTrackingInfoData; //see low below
    window.submitLastStepTracking = lastStepTracking;

    /*
     * Privates method below
     */
    function initAutomaticTrackingOnPageLoad() {
        window.addEventListener('load', function () {
            //business requirement : all page should log a "startstep" with exception for:

            //1.return page from server, user is already on a form, entered a wrong data and server return the same page with an error message on top
            if (serverErrorTracking()) {
                return false; //exit
            }

            //2.automated error page like wrongURL or general issue technicaly related
            if (technicalErrorTracking()) {
                return false; //exit
            }

            //3.message page that are error or last step page
            if (messagePageTracking()) {
                return false; //exit
            }

            //default, track a normal startstep 
            if (ag.template.tracking != null && ag.template.tracking != undefined) {
                ag.template.tracking.log("form-startstep", gatherTrackingInfoData());
            }
        });
    }

    //submit the form error template for page fired by controller Error
    function technicalErrorTracking() {
        var controllerName = getControllerNameFromPath();
        //in case error page (message page or default error page), surbmit error form and exit
        if (controllerName == "Error") {
            errorPageTracking();
            return true;
        }

        return false;
    }

    //submit the error OR last step template for message page
    function messagePageTracking() {
        var messagePage = window.document.querySelector(".messagePage");
        var status;

        //not a message page, so exit
        if (messagePage == null || messagePage == undefined) {
            return false;
        }

        status = messagePage.querySelector("#messagePageTitle").classList;

        if (status == "red") {
            errorPageTracking();
            return true;
        }
        if (status == "green") {
            lastStepTracking();
            return true; 
        }

        return false; //in case of status "grey" which is an informative page, not an end step ?
    }

    //submit the form error template in case of business error returned from server (will log the red message on top of form page)
    function serverErrorTracking() {
        if (window.document.querySelector("#notifications.toplist-alerts") != null &&
            window.document.querySelector("#notifications.toplist-alerts") != undefined) {

            var messages = window.document.querySelectorAll(".notificationText");

            var data = gatherTrackingInfoData();
            if (messages.length > 0 && (ag.template.tracking != null && ag.template.tracking != undefined)) {
                for (var i = 0; i < messages.length; i++) {
                    data["message"] = messages[i].textContent.trim();
                    data["type"] = "user error";
                    ag.template.tracking.log("form-error", data);
                }
            }

            return true;
        }

        return false;
    }



    //submit the formerror template in case of error page or message page with red headline
    function errorPageTracking() {
        var messagePageInfo = window.document.querySelector("#messagePageTitle");
        var bodyError = window.document.querySelector("#messagePageBody");
        var errorText = "";

        if (messagePageInfo != null && messagePageInfo != undefined) {
            errorText = messagePageInfo.textContent + " ";
        }

        if (bodyError != null && bodyError != undefined) {
            if (bodyError.querySelector('.title') != null) {
                errorText += bodyError.querySelector('.title').textContent.trim() + ". ";
            }
            if (bodyError.querySelector('p') != null) {
                errorText += bodyError.querySelector('p').textContent.trim();
            }
        }

        if (trackingInfo != null && trackingInfo != undefined) {
            var data = {
                "formname": "MSA - " + trackingInfo.Flow + "",
                "msaauthentication": "" + trackingInfo.CurrentAuthenticationType + "",
                "stepname": "" + getPageNameFromPath() + "",
                "message": "" + errorText + "",
                "formmsatype": "" + trackingInfo.Application + ""
            };
        }
        else {
            var data = {
                "formname": "MSA - unknown flow",
                "msaauthentication": "unknown",
                "stepname": "" + getPageNameFromPath() + "",
                "message": "" + errorText + "",
                "formmsatype": "unknown application"
            }
        }

        if (getControllerNameFromPath() == "Error") {
            data["type"] = "technical error";
        }

        if (ag.template.tracking != null && ag.template.tracking != undefined) {
            ag.template.tracking.log("form-error", data);
        }
    }

    //submit the last step template for pages that are at the end of flow
    function lastStepTracking() {
        if (ag.template.tracking != null && ag.template.tracking != undefined) {
            ag.template.tracking.log("form-laststep", gatherTrackingInfoData());
        }
    }

   

    //submit a form-submit-step to the analytic each time a button or input of type "submit" is hit
    function initAutomaticSubmitOnSuccess() {
        if (ag.template.tracking != null && ag.template.tracking != undefined) {
            ag.template.tracking.log("form-submitstep", gatherTrackingInfoData());
        }

    }

    //init automatic tracking for button, link and other standard elements
    function initAutomaticButtonTracking() {
        if (ag.template.tracking != null && ag.template.tracking != undefined) {
            ag.template.tracking.configure({
                automaticButtonTracking: true
            });
        }
    }




    //cut the view path to get the view name at the end
    function getPageNameFromPath() {
        if (trackingInfo == null || trackingInfo == undefined) {
            return null;
        }

        var pageName;
        var pathArray = trackingInfo.Page.split('/');
        if (pathArray.length > 0) {
            pageName = pathArray[pathArray.length - 1].replace('.cshtml', '');
        }

        return pageName;
    }

    //cut the view path to get the controller name
    function getControllerNameFromPath() {

        if (trackingInfo == null && trackingInfo == undefined) {
            return null;
        }

        var controllerName;
        var pathArray = trackingInfo.Page.split('/');
        if (pathArray.length > 0) {
            controllerName = pathArray[pathArray.length - 2];
        }

        return controllerName;
    }

    //get the trackingInfo object (from master layout) info and create a json ready to be posted
    function gatherTrackingInfoData() {

        if (trackingInfo == null && trackingInfo == undefined) {
            return null;
        }

        var page = getPageNameFromPath();
        analyticsRetrocompatibilityMapping(page);

        var data = {
            "formname": "MSA - " + trackingInfo.Flow + "",
            "msaauthentication": "" + trackingInfo.CurrentAuthenticationType + "",
            "stepname": "" + page + "",
            "formmsatype": "" + trackingInfo.Application + ""
        };

        if (trackingInfo.Option != null) {
            data['stepoption'] = trackingInfo.Option;
        }

        return data;
    }

    function analyticsRetrocompatibilityMapping(page) {
        //change only for the part of flow that consist to send the otp number by a paper letter to the client
        if (trackingInfo.CurrentAuthenticationType == "OTP") {
            trackingInfo.CurrentAuthenticationType = "SMS";

            if (trackingInfo.Flow == "registration") {
                trackingInfo.CurrentAuthenticationType = "request code by letter";
            }
        }
    }

})(window, document, jQuery);




// ------------------- public functions with parameters ------------------- //

/**
 * mirror the error class from a masked (hidden) element to a visible element so user is aware
 * @param {any} element
 * @param {any} elementMasked
 */
function AddErrorClassForField(element, elementMasked) {
    var isValid = element.valid();

    if (!isValid) {
        elementMasked.addClass("error");
    }
    else {
        if (elementMasked.hasClass("error")) {
            elementMasked.removeClass("error");
        }
    }
}




/**
 * add on the fly a custom error-rules on element that can be controlled as a toggle
 * @param {any} element
 * @param {any} errorMessage
 */
function forceError(element, errorMessage) {
    $(element).rules("add", {
        forcibleerror: true,
        messages: {
            forcibleerror: function () { return errorMessage; }
        }
    });
    var isForced = false;
    if (errorMessage) {
        isForced = true;
    }
    $(element)[0].dataset.isForced = isForced;
    $(element).valid();
}
$.validator.addMethod("forcibleerror", function (value, element) {
    return $(element)[0].dataset.isForced !== "true";
});




/**
 *  Validation and inputmask behavior
 *  forced this way because the "unmask" feature conflict in event order with form validation
 * @param {any} maskedField
 * @param {any} hiddenField
 */
function copyValueinMaskedField(maskedField, hiddenField) {
    var valueToCopy;
    if (maskedField.inputmask('unmaskedvalue') == null || maskedField.inputmask('unmaskedvalue') === undefined) {
        hiddenField.val('');
    }
    else {
        valueToCopy = maskedField.inputmask('unmaskedvalue').trim();
        valueToCopy.replace(/ /g, '');
        hiddenField.val(valueToCopy);
    }
}

enableInputTrim();
setPreventDoubleClick();
setHelpModal();
helpButtonAnimation();
setTooltips();
heightOverflowProtection();
setFocusInFirstEditableField();


$(document).ready(function () {

    /* from AG.Configuration.Bundle.js : this need to be enabled at launch */
    configureAnalytics();

    //I have no idea why this was here, letting it for now until I decide if worth it
    var cacheInput = null;
    var timer = null;

    $(document).on('focus', 'input', function (e) {
        cacheInput = e.target;
    });

    $(document).on('focus', 'textarea', function (e) {
        cacheInput = e.target;
    });

    $(document).on('touchend', function (e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            if (cacheInput !== null) {
                timer = setTimeout(function () {
                    cacheInput.blur();
                    clearTimeout(timer);
                }, 300)
            }
        }
    });
});
// Init style shamelessly stolen from jQuery http://jquery.com
var Froogaloop = (function () {
    // Define a local copy of Froogaloop
    function Froogaloop(iframe) {
        // The Froogaloop object is actually just the init constructor
        return new Froogaloop.fn.init(iframe);
    }

    var eventCallbacks = {},
        hasWindowEvent = false,
        isReady = false,
        slice = Array.prototype.slice,
        playerDomain = '';

    Froogaloop.fn = Froogaloop.prototype = {
        element: null,

        init: function (iframe) {
            if (typeof iframe === "string") {
                iframe = document.getElementById(iframe);
            }

            this.element = iframe;

            // Register message event listeners
            playerDomain = getDomainFromUrl(this.element.getAttribute('src'));

            return this;
        },

        /*
         * Calls a function to act upon the player.
         *
         * @param {string} method The name of the Javascript API method to call. Eg: 'play'.
         * @param {Array|Function} valueOrCallback params Array of parameters to pass when calling an API method
         *                                or callback function when the method returns a value.
         */
        api: function (method, valueOrCallback) {
            if (!this.element || !method) {
                return false;
            }

            var self = this,
                element = self.element,
                target_id = element.id !== '' ? element.id : null,
                params = !isFunction(valueOrCallback) ? valueOrCallback : null,
                callback = isFunction(valueOrCallback) ? valueOrCallback : null;

            // Store the callback for get functions
            if (callback) {
                storeCallback(method, callback, target_id);
            }

            postMessage(method, params, element);
            return self;
        },

        /*
         * Registers an event listener and a callback function that gets called when the event fires.
         *
         * @param eventName (String): Name of the event to listen for.
         * @param callback (Function): Function that should be called when the event fires.
         */
        addEvent: function (eventName, callback) {
            if (!this.element) {
                return false;
            }

            var self = this,
                element = self.element,
                target_id = element.id !== '' ? element.id : null;


            storeCallback(eventName, callback, target_id);

            // The ready event is not registered via postMessage. It fires regardless.
            if (eventName != 'ready') {
                postMessage('addEventListener', eventName, element);
            }
            else if (eventName == 'ready' && isReady) {
                callback.call(null, target_id);
            }

            return self;
        },

        /*
         * Unregisters an event listener that gets called when the event fires.
         *
         * @param eventName (String): Name of the event to stop listening for.
         */
        removeEvent: function (eventName) {
            if (!this.element) {
                return false;
            }

            var self = this,
                element = self.element,
                target_id = element.id !== '' ? element.id : null,
                removed = removeCallback(eventName, target_id);

            // The ready event is not registered
            if (eventName != 'ready' && removed) {
                postMessage('removeEventListener', eventName, element);
            }
        }
    };

    /**
     * Handles posting a message to the parent window.
     *
     * @param method (String): name of the method to call inside the player. For api calls
     * this is the name of the api method (api_play or api_pause) while for events this method
     * is api_addEventListener.
     * @param params (Object or Array): List of parameters to submit to the method. Can be either
     * a single param or an array list of parameters.
     * @param target (HTMLElement): Target iframe to post the message to.
     */
    function postMessage(method, params, target) {
        if (!target.contentWindow.postMessage) {
            return false;
        }

        var url = target.getAttribute('src').split('?')[0],
            data = JSON.stringify({
                method: method,
                value: params
            });

        target.contentWindow.postMessage(data, url);
    }

    /**
     * Event that fires whenever the window receives a message from its parent
     * via window.postMessage.
     */
    function onMessageReceived(event) {
        var data, method;

        try {
            data = JSON.parse(event.data);
            method = data.event || data.method;
        }
        catch (e) {
            //fail silently... like a ninja!
        }

        if (method == 'ready' && !isReady) {
            isReady = true;
        }

        // Handles messages from moogaloop only
        if (event.origin != playerDomain) {
            return false;
        }

        var value = data.value,
            eventData = data.data,
            target_id = target_id === '' ? null : data.player_id,

            callback = getCallback(method, target_id),
            params = [];

        if (!callback) {
            return false;
        }

        if (value !== undefined) {
            params.push(value);
        }

        if (eventData) {
            params.push(eventData);
        }

        if (target_id) {
            params.push(target_id);
        }

        return params.length > 0 ? callback.apply(null, params) : callback.call();
    }


    /**
     * Stores submitted callbacks for each iframe being tracked and each
     * event for that iframe.
     *
     * @param eventName (String): Name of the event. Eg. api_onPlay
     * @param callback (Function): Function that should get executed when the
     * event is fired.
     * @param target_id (String) [Optional]: If handling more than one iframe then
     * it stores the different callbacks for different iframes based on the iframe's
     * id.
     */
    function storeCallback(eventName, callback, target_id) {
        if (target_id) {
            if (!eventCallbacks[target_id]) {
                eventCallbacks[target_id] = {};
            }
            eventCallbacks[target_id][eventName] = callback;
        }
        else {
            eventCallbacks[eventName] = callback;
        }
    }

    /**
     * Retrieves stored callbacks.
     */
    function getCallback(eventName, target_id) {
        if (target_id) {
            return eventCallbacks[target_id][eventName];
        }
        else {
            return eventCallbacks[eventName];
        }
    }

    function removeCallback(eventName, target_id) {
        if (target_id && eventCallbacks[target_id]) {
            if (!eventCallbacks[target_id][eventName]) {
                return false;
            }
            eventCallbacks[target_id][eventName] = null;
        }
        else {
            if (!eventCallbacks[eventName]) {
                return false;
            }
            eventCallbacks[eventName] = null;
        }

        return true;
    }

    /**
     * Returns a domain's root domain.
     * Eg. returns http://vimeo.com when http://vimeo.com/channels is sbumitted
     *
     * @param url (String): Url to test against.
     * @return url (String): Root domain of submitted url
     */
    function getDomainFromUrl(url) {
        var url_pieces = url.split('/'),
            domain_str = '';

        for (var i = 0, length = url_pieces.length; i < length; i++) {
            if (i < 3) { domain_str += url_pieces[i]; }
            else { break; }
            if (i < 2) { domain_str += '/'; }
        }

        return domain_str;
    }

    function isFunction(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    function isArray(obj) {
        return toString.call(obj) === '[object Array]';
    }

    // Give the init function the Froogaloop prototype for later instantiation
    Froogaloop.fn.init.prototype = Froogaloop.fn;

    // Listens for the message event.
    // W3C
    if (window.addEventListener) {
        window.addEventListener('message', onMessageReceived, false);
    }
        // IE
    else {
        window.attachEvent('onmessage', onMessageReceived, false);
    }

    // Expose froogaloop to the global object
    return (window.Froogaloop = window.$f = Froogaloop);

})();