data_handler = {

    init() {
        if (users.currentUser) {
            data_handler.getCurrentUserVotes();
        }
        this._loadData(this._planetsKey, this._planetsData);
        this._loadData(this._residentsKey, this._residentsData);
    },

    _planetsKey: 'planets',
    _planetsData: {},

    _residentsKey: 'residents',
    _residentsData : {},

    currentUserVotes: null,

    _loadData(source, target) {
        if (sessionStorage.getItem(source)) {
            target = JSON.parse(sessionStorage.getItem(source));
        }
    },

    _saveData(target, source) {
        sessionStorage.setItem(target, JSON.stringify(source));
    },

    getCurrentUserVotes() {
        $.getJSON('/current-user-votes', {username: users.currentUser}, resp => data_handler.currentUserVotes = resp)
    },

    getPlanetsPage(url, callback) {
        if (this._planetsData.hasOwnProperty(url)) {
            callback(data_handler._planetsData[url]);
        } else {
            $.getJSON(url, function (planets) {
                data_handler._planetsData[url] = planets;
                data_handler._saveData(data_handler._planetsKey, data_handler._planetsData);
                callback(planets);
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
    }

};