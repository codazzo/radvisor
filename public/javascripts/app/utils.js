//utiity functions
radvisor.getDateStr = function(date){
    var day = date.getDate(); if(day<10) day = "0" + day;
    var month = date.getMonth() + 1; if(month<10) month = "0" + month;
    var year = date.getFullYear();
    return  "" + day + month + year;
}

/**
*   @param {String} dateStr a non-lexically-ordered date string in the format ddmmyyyy
*/
radvisor.getLexicalDate = function(dateStr){
    var day = dateStr.substr(0,2);
    var month = dateStr.substr(2,2);
    var year = dateStr.substr(4,4);
    return "" + year + month + day;
}