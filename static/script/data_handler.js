data_handler = {

    init() {
        this._loadData(this._planetsKey, this._planetsData);
        this._loadData(this._residentsKey, this._residentsData);
    },

    _planetsKey: 'planets',
    _planetsData: {},

    _residentsKey: 'residents',
    _residentsData : {},

    currentUserVotes: [],

    _loadData(source, target) {
        if (sessionStorage.getItem(source)) {
            target = JSON.parse(sessionStorage.getItem(source));
        }
    },

    _saveData(target, source) {
        sessionStorage.setItem(target, JSON.stringify(source));
    },

    getCurrentUserVotes() {
        return $.getJSON('/current-user-votes', {username: users.currentUser}, function (userVotes) {
            data_handler.currentUserVotes = userVotes;
        })
    },

    getPlanetsPage(url, callback) {
        if (!(users.currentUser) || data_handler.currentUserVotes.length) {
            data_handler.getPlanets(url, callback);
        } else {
            data_handler.getCurrentUserVotes().then( () => data_handler.getPlanets(url, callback) );
        }
    },

    getPlanets(url, callback) {
        $('body').css('cursor', 'progress');
        if (data_handler._planetsData.hasOwnProperty(url)) {
                callback(data_handler._planetsData[url], url);
            } else {
                $.getJSON(url, function (planets) {
                    data_handler._planetsData[url] = planets;
                    data_handler._saveData(data_handler._planetsKey, data_handler._planetsData);
                    callback(planets, url);
                });
            }
    },

    getResidents(planet, residentLinks, callback) {
        if (this._residentsData.hasOwnProperty(planet)) {
            callback(planet, data_handler._residentsData[planet]);

        } else {

            let residents = [];
            let calls = [];

            $.each(residentLinks, function (index, residentURL) {
                let call = $.Deferred();
                $.getJSON(residentURL, function (resident) {
                    residents.push(resident);
                    call.resolve();
                });
                calls.push(call);
            });

            $.when.apply(null, calls).then(function () {
                data_handler._residentsData[planet] = residents;
                data_handler._saveData(data_handler._residentsKey, data_handler._residentsData);
                callback(planet, residents);
            });

        }
    },

    getVoteStatistics(callback) {
        $.getJSON('/list-votes', resp => callback(resp));
    }

};