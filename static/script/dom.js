dom = {

    init() {
        this.loadPlanetsPage('https://swapi.co/api/planets/?page=1');
        this.initPagination();
    },

    pageLoading: false,
    prevPlanet: null,
    nextPlanet: null,

    loadPlanetsPage(page) {
        data_handler.getPlanetsPage(page, this.renderPage);
    },

    renderPage(planets) {
        let table = $('#planets-table').find('tbody');
        table.empty();
        dom.changeBtnStatus(planets.next, planets.previous);

        $.each(planets.results, function (index, planet) {
            let residents;
            if (planet.residents.length) {
                residents = `<button type="button" class="btn btn-primary" data-planet-name="${planet.name}">
                                ${planet.residents.length} resident(s)
                             </button>`
            } else {
                residents = 'No known residents';
            }

            let planetHTML = `
                <tr>
                    <td>${planet.name}</td>
                    <td>${planet.diameter}</td>
                    <td>${planet.climate}</td>
                    <td>${planet.terrain}</td>
                    <td>${planet.surface_water}</td>
                    <td>${planet.population}</td>
                    <td>${residents}</td>
                </tr>
            `;
            $(planetHTML).appendTo(table);
            if (planet.residents.length) {
                dom.addListenerToResidentsBtn(planet.name, planet.residents);
            }
        });

    },

    addListenerToResidentsBtn(planetName, residents) {
        $(`[data-planet-name="${planetName}"]`).click(function () {
            let modal = $('#residents');
            modal.find('h5').text('Loading...');
            modal.find('table').hide();
            modal.find('tbody').empty();
            modal.modal();
            data_handler.getResidents(planetName, residents, dom.renderModal);
        })
    },

    renderModal(planet, residents) {
        let modal = $('#residents');
        modal.find('h5').text('Residents of ' + planet);
        modal.find('table').show();

        $.each(residents, function (index, resident) {
            let residentHTML = `
                <tr>
                    <td>${resident.name}</td>
                    <td>${resident.height}</td>
                    <td>${resident.mass}</td>
                    <td>${resident.hair_color}</td>
                    <td>${resident.skin_color}</td>
                    <td>${resident.eye_color}</td>
                    <td>${resident.birth_year}</td>
                    <td>${resident.gender}</td>
                </tr> 
            `
            $(residentHTML).appendTo(modal.find('tbody'));
        })
    },

    changeBtnStatus(nextPlanet, prevPlanet) {
        this.nextPlanet = nextPlanet;
        this.prevPlanet = prevPlanet;
        let nextBtn = $('#pagination-next');
        let prevBtn = $('#pagination-prev');

        nextPlanet ? nextBtn.removeClass('disabled') : nextBtn.addClass('disabled');
        prevPlanet ? prevBtn.removeClass('disabled') : prevBtn.addClass('disabled');
    },

    initPagination() {
        $('#pagination-next').click(function () {
            if (dom.nextPlanet) {
                let tempNextPlanet = dom.nextPlanet;
                dom.nextPlanet = null;
                dom.prevPlanet = null;
                data_handler.getPlanetsPage(tempNextPlanet, dom.renderPage);
            }
        });

        $('#pagination-prev').click(function () {
            if (dom.prevPlanet) {
                let tempPrevPlanet = dom.prevPlanet;
                dom.nextPlanet = null;
                dom.prevPlanet = null;
                data_handler.getPlanetsPage(tempPrevPlanet, dom.renderPage);
            }
        });
    }

};