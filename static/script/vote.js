vote = {

    init() {

    },

    addListenerToVoteBtn(planet) {
        $(`.vote-btn[data-planet-name="${planet}"]`).click(function () {
            let voteData = {
                username: users.currentUser,
                planetName: planet,
                planetId: $(this).data('planetId')
            };
            $(this).off('click').addClass('disabled');
            $.post('/vote', $.param(voteData), function (resp) {
                if (resp) {
                    console.log(resp);
                }
            })
        })
    }

};