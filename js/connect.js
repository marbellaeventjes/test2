var menuSpeed = 150,
    detailsSpeed = 150;

$(function () {
    $('#gdpr-banner .closeIcon').on('click', function (e) {
        e.preventDefault();
        $('#gdpr-banner').removeClass('open');
    });

    $('#buttonNavigation').on('click', function () {
        //debugger;
        var $menuContainer = $('#navbar');

        $menuContainer.promise().done(function () {
            var winWidth = $(window).width();
            var isOpen = $menuContainer.is(':visible');

            if (isOpen) {
                closeMenu();
            }
            else {
                openMenu();
            }
        });
    });

    $(window).resize(function () {
        var $menuContainer = $('#navbar');

        $menuContainer.promise().done(function () {
            if ($('#navbar').is(':visible')) {
                closeMenu();
            }
        });
    });

    $(window).on("scroll", function () {
        if ($(this).scrollTop() > 24) {
            $('.navbar').addClass('navbar-scrolling');
            $('header').addClass('scrolling');
            $('.contentContainer').css('margin-top', '86px');
        }
        else {
            $('.navbar').removeClass('navbar-scrolling');
            $('header').removeClass('scrolling');
            $('.contentContainer').css('margin-top', '');
        }
    });

    $('.link-expand').on('click', function () {
        var $link = $(this);
        var $details = $(this).closest('.contractBoxContent').find('.details, .infos2');

        if ($details.length > 0) {
            $details.promise().done(function () {

                if ($details.is(':visible')) {
                    $details.slideUp(detailsSpeed);
                    $link.removeClass('expanded');
                }
                else {
                    $details.slideDown(detailsSpeed);
                    $link.addClass('expanded');
                }
            });
        }
    });

    $('.upsell .close').on('click', function () {
        var $container = $(this).closest('.upsell');
        $container.hide(detailsSpeed);
    });
});

function closeMenu() {
    var $menuContainer = $('#navbar');
    var winWidth = $(window).width();

    if (winWidth < 768) {
        $menuContainer.slideUp(menuSpeed, function () {
            $('.navbar-toggle').removeClass('active');
        });
    }
    else if (winWidth <= 992) {
        $menuContainer.animate({
            'width': '0'
        }, menuSpeed, function () {
            $menuContainer.hide().css('width', '');
            $('#menuOverlay').remove();
            $('.navbar-toggle').removeClass('active');
        });
    }
}

function openMenu() {
    var $menuContainer = $('#navbar');
    var winWidth = $(window).width();
    var normalWidth = $menuContainer.width();

    if (winWidth < 768) {
        $menuContainer.slideDown(menuSpeed, function () {
            $('.navbar-toggle').addClass('active');
        });
    }
    else if (winWidth <= 992) {
        $('#menuOverlay').remove();
        $("body").prepend('<div id="menuOverlay"></div>');
        $menuContainer.css('width', '0px').show().animate({
            'width': normalWidth + 'px'
        }, menuSpeed, function () {
            $menuContainer.css('width', '');
            $('.navbar-toggle').addClass('active');
        });
    }
}



