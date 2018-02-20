users = {

    init() {
        this.queryCurrentUser();
        this.addListenerToLoginBtn();
        this.addListenerToLogoutBtn();
        this.addListenerToRegBtn();
    },

    currentUser: '',

    queryCurrentUser() {
        $.get('/login-status', function (resp) {
            resp ? users.handleLogin(resp) : users.handleLogout();
        })
    },

    handleLogin(current_user) {
        this.currentUser = current_user;
        $('#login-trigger-btn').hide();
        $('#register-trigger-btn').hide();
        $('#user-greeting').text(`Welcome, ${current_user}!`).show();
        $('#logout-btn').show();
        data_handler.getPlanetsPage(dom.firstPage, dom.renderPage);
    },

    handleLogout() {
        this.currentUser = '';
        data_handler.currentUserVotes = [];
        $('#user-greeting').text('').hide();
        $('#logout-btn').hide();
        $('#login-trigger-btn').show();
        $('#register-trigger-btn').show();
        data_handler.getPlanetsPage(dom.firstPage, dom.renderPage);
    },

    addListenerToLoginBtn() {
        $('#login-btn').click(function () {
            $.post('/login', $('#login-form').serialize(), function (resp) {
                if (resp) {
                    users.handleLogin(resp);
                    $('#login').modal('hide');
                    $('#login-form').find('input').val('');
                } else {
                    console.log('Wrong credentials!')  // PLACEHOLDER
                }
            })
        })
    },

    addListenerToLogoutBtn() {
        $('#logout-btn').click(function () {
            $.get('/logout', () => users.handleLogout())
        })
    },

    addListenerToRegBtn() {
        $('#reg-btn').click(function () {
            if ($('#reg-password').val() === $('#reg-password-control').val()) {
                $.post('/register', $('#register-form').serialize(), function (resp) {
                    if (resp) {
                        users.handleLogin(resp);
                        $('#register').modal('hide');
                        $('#register-form').find('input').val('');
                    } else {
                        console.log('Username already taken!')  // PLACEHOLDER
                    }
                })
            } else {
                console.log('Passwords dont match!')  // PLACEHOLDER
            }
        })
    }

};