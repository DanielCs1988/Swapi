effects = {

    init() {
        this.addMusicToggleBtn();
        this.initTieInterceptor();
    },

    loadingAnimationTimer: null,
    tieAnimationTimer: null,

    prepareModal(modalId) {
        let modal = $(modalId);
        modal.find('h5').text('Loading...');
        modal.find('table').hide();
        modal.find('tbody').empty();
        modal.modal();
        $('body').css('cursor', 'progress');
    },

    renderLoadingIndicator() {
        let indicator = $('#loading-indicator');
        $('body').css('cursor', 'progress');
        indicator.removeClass('d-none').addClass('d-block');
        indicator.fadeOut(250).fadeIn(250);
        effects.loadingAnimationTimer = setInterval(function () {
            indicator.fadeOut(250).fadeIn(250);
        }, 500)
    },

    hideLoadingIndicator() {
        let indicator = $('#loading-indicator');
        $('body').css('cursor', 'auto');
        indicator.removeClass('d-block').addClass('d-none');
        clearInterval(effects.loadingAnimationTimer);
    },

    addMusicToggleBtn() {
        let music = document.getElementById("music");
        let btn = $("#play-btn");
        btn.click(function(){
            music.paused ? music.play() : music.pause();
            btn.find('svg').toggle();
        })
    },

    initTieInterceptor() {
        this.tieAnimationTimer = setInterval(this.releaseTieInterceptor, 5000);
        let tie = $('#tie-interceptor');
        tie.click(function () {
            clearInterval(effects.tieAnimationTimer);
            tie.off('click').stop().attr('src', '/static/boom.png');
            tie.animate({opacity: '0'}, 500, () => tie.remove());
        });
    },

    releaseTieInterceptor() {
        let tie = $('#tie-interceptor');
        tie.show().animate({
            left: '90%',
            top: `${effects.randInt(20, 80)}%`
        }, 3000, function () {
            tie.hide();
            tie.css('left', `5%`).css('top', `${effects.randInt(20, 80)}%`);
        });
    },

    randInt(from, to) {
        return Math.floor(Math.random() * (to-from+1) + from );
    }

};