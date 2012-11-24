//disable jQM routing @see http://coenraets.org/blog/2012/03/using-backbone-js-with-jquery-mobile/
$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
    $('div[data-role="page"]').live('pagehide', function (event, ui) {
        $(event.currentTarget).remove();
    });
});
