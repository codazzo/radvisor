radvisor.Dj = Backbone.Model.extend({
    urlBase: '/dj/',

    url: function(){
        return this.urlBase + this.get("name");
    },

    getUserTracks: function(callback){
        var me = this;
        var modelJSON = this.toJSON();
        var scLink;
        _.each(modelJSON.links, function(link, type){
            if(type == "soundcloud") scLink = link;
        });
        var djTokens = scLink.split("/");
        var djName = djTokens[djTokens.length-1];

        //TODO use promises?
        this.fetchSCUser(djName, function(userID){
            me.fetchSCTracks(userID, function(tracksArray){
                var resTracks = new radvisor.TrackCollection;
                resTracks.add(tracksArray);
                callback(resTracks);
            });
        });
    },

    fetchSCUser: function(name, callback){
        var me = this;
        if (this.get("sc_userID")) {
            callback(this.get("sc_userID")); //we already fetched the user, invoke the callback synchronously
            return;
        }
        $.ajax({
            url: 'http://api.soundcloud.com/users.json',
            dataType: 'jsonp',
            data: {
                q: name,
                client_id: SC.options.client_id
            },
            error: function(res, status, xhr){
                //TODO
            },
            success:function(res, status, xhr){
                if(!res) {
                    return; //no users found TODO do this better
                }
                var userID = res[0].id; //TODO better check?
                me.set("sc_userID", userID);
                callback(userID);
            }
        });
    },

    fetchSCTracks: function(id, callback){
        var me = this;
        if (this.get("sc_tracks")) {
            callback(this.get("sc_tracks"));
        }
        $.ajax({
            url: 'http://api.soundcloud.com/users/'+id+'/tracks.json',
            dataType: 'jsonp',
            data: {
                client_id: SC.options.client_id
            },
            error: function(res, status, xhr){
                //TODO
            },
            success:function(res, status, xhr){
                if(!res) {
                    return; //no tracks found TODO do this better
                }
                me.set("sc_tracks", res);
                callback(res);
            }
        });
     
    }
});