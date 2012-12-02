$(document).ready(function(){

    $(document).on("click", ".goback", function(){
        window.history.back(); //back buttons go back in history
    });

    radvisor.router = new AppRouter;
    Backbone.history.start();
});