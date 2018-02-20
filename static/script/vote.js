vote = {

    init() {
        this.addListenerToVoteStatBtn();
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
    },

    addListenerToVoteStatBtn() {
        $('#vote-stat-btn').click(function () {
            let modal = $('#vote-statistics');
            modal.find('h5').text('Loading...');
            modal.find('table').hide();
            modal.find('tbody').empty();
            modal.modal();
            data_handler.getVoteStatistics(vote.renderVoteStatistics);
        })
    },

    renderVoteStatistics(stats) {
        let modal = $('#vote-statistics');
        modal.find('h5').text('Vote Statistics');
        modal.find('table').show();

        $.each(stats, function (index, entry) {
            let entryHTML = `
                <tr>
                    <td>${entry.planet_name}</td>
                    <td>${entry.count}</td>
                </tr> 
            `
            $(entryHTML).appendTo(modal.find('tbody'));
        })
    }

};