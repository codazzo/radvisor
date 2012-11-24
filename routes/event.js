
export.event = function(req, res){
    var eventId = req.params[0];
    var urlBase = "http://www.residentadvisor.net/event.aspx?";
    var url = urlBase + eventId;

    jsdom.env(
      url,
      ["http://code.jquery.com/jquery.js"],
      function (errors, window) {
        // var resStr = "there have been " + window.$("a").length + " nodejs releases!";

        //var eventDivs = window.$(".hr-dark").nextAll().filter("[onmouseover]");
        debugger
      }
    );
}