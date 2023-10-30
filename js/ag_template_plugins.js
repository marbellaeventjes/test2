function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
$(function () {
    if (window.AG && AG.VC && AG.VC.Configuration && AG.VC.Configuration.UseBootstrapDropdowns === true){
        $('select:not([data-no-selectpicker="true"])').selectpicker();
    }

    $(window).on("scroll", function () {
        checkScrollPosition();
    });

    registerPopOvers();
    registerToolTips();

    //Prevent scroll up when clicking on the i-icon
    $(document).on('click', 'a.tooltip-trigger, a.popover-trigger', function (e) {
        e.preventDefault();
    });
});

function checkScrollPosition() {
    if ($(window).scrollTop() > 0 && $(window).width() >= 991) {
        //if ($('.contentContainer').css('padding-bottom') == 0) {
        if (!$('body').hasClass('scrolling')) {
            checkGap();
        }
        $('body').addClass('scrolling');
    }
    else {
        if ($(window).width() >= 991
            && $(window).scrollTop() > 0
            && ($('header').outerHeight() + $('.contentContainer').outerHeight() < $(window).height())) {
            return;
        }

        var difference = isInGapForScrolling();

        if (difference >= 0) {
            $('.contentContainer').css('padding-bottom', '');
            $('body').removeClass('scrolling');
        }
    }
}

function checkGap() {
    var difference = isInGapForScrolling();
    var gap = 44; // difference in height of header when scrolling or not;

    if (difference > 0 && difference <= gap) {
        $('.contentContainer').css('padding-bottom', (gap - difference + 1));
    }
}

function isInGapForScrolling() {
    var contentHeight = $('header').outerHeight() + $('.contentContainer').outerHeight();
    var windowHeight = $(window).height();
    var difference = contentHeight - windowHeight;

    return difference;
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

function AddAjaxMessage(message) {
    var $notifContainer = $('ul.toplist-alerts');

    if ($notifContainer.length === 0) {
        $notifContainer = $('<ul />').addClass('toplist-alerts').prependTo($('main.content'));
    }

    var $notification = $('<li />').addClass('clearfix').attr('data-fromAjax', 'true').text(message);

    $notifContainer.append($notification);

    $("html, body").animate({ scrollTop: 0 });
}

function ClearAjaxMessages() {
    var $notifContainer = $('ul.toplist-alerts');

    $notifContainer.find('li[data-fromAjax="true"]').remove();

    if ($notifContainer.find('li').length === 0) {
        $('ul.toplist-alerts').remove();
    }
}

function ClearMessages() {
    ClearNotifications();
    ClearAlerts();
}
function ClearNotifications() {
    var $notifContainer = $('ul.toplist-notifications');
    $notifContainer.remove();
}
function ClearAlerts() {
    var $alertContainer = $('ul.toplist-alerts');
    $alertContainer.remove();
}

function ShowModalPopup(id) {
    $("#" + id).modal('show');
}

function registerPopOvers() {
    var $popovers = $('[data-toggle="popover"]:not([data-popover-initialized="true"])');

    $popovers.attr('data-popover-initialized', 'true');
    $popovers.popover();
}

function registerToolTips() {
    var $tooltips = $('[data-toggle="tooltip"]:not([data-tooltip-initialized="true"])');

    $tooltips.attr('data-tooltip-initialized', 'true');
    $tooltips.tooltip();
}

// Fix for the bootstrap modals when they are stacked on top of eachother: (from http://stackoverflow.com/a/24914782 )
$(document).on('show.bs.modal', '.modal', function () {
    var zIndex = 1040 + (10 * $('.modal:visible').length);
    $(this).css('z-index', zIndex);
    setTimeout(function () {
        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
});
function setSorryViewAnalytics(origin) {
    var parentWindow;

    if (window.parent.location.href !== window.location.href) {
        // This sorry page is in an iframe
        parentWindow = window.parent;
    }
    else {
        // This sorry page is not in an iframe
        parentWindow = window;
    }

    parentWindow.ag.template.tracking.log('load', {
        'category': 'Error_Loading',
        'action': origin
    });
}
var ag = ag || {};
ag.template = ag.template || {};

ag.template.gdpr = function ($) {

    $(function () {
        initializeGdpr();

        if (areCookiesDisabled()) {
            $('#gdpr-cookies-disabled').removeClass('hidden');
        }
    });

    function initializeGdpr() {
        $('#gdpr-banner .closeIcon').on('click', function (e) {
            e.preventDefault();
            closeBanner();
        });

        $(document).on('click', '#gdpr-accept', function (e) {
            $('#gdpr-banner').addClass('accepting');
            gdprCreateCookie();
            propagateConsent();
        });
    }

    function propagateConsent() {
        var url = $('#gdpr-banner').attr('data-propagation-action');

        $.getJSON(url)
            .done(function (result) {
                if (result.status == "success") {
                    $('#gdpr-images-container').append(result.data);
                }
            })
            .always(function () {
                closeBanner();
            });
    }

    function closeBanner() {
        $('#gdpr-banner')
            .removeClass('open')
            .removeClass('accepting');

        setTimeout(function () {
            $('#gdpr-banner').remove();
        }, 200);
    }

    function areCookiesDisabled() {
        try {
            document.cookie = 'cookietest=1';
            var cookiesEnabled = document.cookie.indexOf('cookietest=') !== -1;
            document.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
            return !cookiesEnabled;
        } catch (e) {
            return true;
        }
    }
}(jQuery);
