vote = {

    init() {
        this.addListenerToVoteStatBtn();
    },

    addListenerToVoteBtn(planet) {
        $(`.vote-btn[data-planet-name="${planet}"]`).click(function () {
            let voteBtn = $(this);
            let voteData = {
                username: users.currentUser,
                planetName: planet,
                planetId: voteBtn.data('planetId')
            };
            $.post('/vote', $.param(voteData), function (resp) {
                if (resp) {
                    voteBtn.off('click').removeClass('btn-secondary').addClass('btn-success');
                    data_handler.currentUserVotes.push(planet);
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