$(document).ready(function(){

    $(document).on("click", ".goback", function(){
        if (window.history.length > 2) {
            window.history.back(); //back buttons go back in history
        } else {
            //e.g. if event page was linked directly and there's no previous entry in history
            window.location.href = "#/";
        }
    });

    radvisor.locationManager = new LocationManager;
    radvisor.router = new AppRouter;
    Backbone.history.start();
});