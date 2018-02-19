dom = {

    init() {
        this.loadPlanetsPage('https://swapi.co/api/planets/?page=1');
    },

    loadPlanetsPage(page) {
        data_handler.getPlanetsPage(page, this.renderPage);
    },

    renderPage(planets) {
        let table = $('#planets-table').find('tbody');
        table.empty();

        $.each(planets.results, function (index, planet) {
            let planetHTML = `
                <tr>
                    <td>${planet.name}</td>
                    <td>${planet.diameter}</td>
                    <td>${planet.climate}</td>
                    <td>${planet.terrain}</td>
                    <td>${planet.surface_water}</td>
                    <td>${planet.population}</td>
                </tr>
            `;
            $(planetHTML).appendTo(table);
        });

        $('#pagination-prev').click(function () {
            if (planets.previous) {
                $(this).off('click');
                $('#pagination-next').off('click');
                $(this).removeClass('disabled');
                data_handler.getPlanetsPage(planets.previous, dom.renderPage);
            } else {
                $(this).addClass('disabled');
            }
        });

        $('#pagination-next').click(function () {
            if (planets.next) {
                $(this).off('click');
                $('#pagination-prev').off('click');
                $(this).removeClass('disabled');
                data_handler.getPlanetsPage(planets.next, dom.renderPage);
            } else {
                $(this).addClass('disabled');
            }
        });
    }

};