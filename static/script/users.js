users = {

    init() {
        this.queryCurrentUser();
        this.addListenerToLoginBtn();
        this.addListenerToLogoutBtn();
        this.addListenerToRegBtn();
        this.addListenerToCloseAlerts();
    },

    currentUser: '',

    queryCurrentUser() {
        $.get('/login-status', function (resp) {
            resp ? users.handleLogin(resp) : users.handleLogout();
        })
    },

    handleLogin(current_user) {
        this.currentUser = current_user;
        $('.alert').hide();
        $('#login-trigger-btn').hide();
        $('#register-trigger-btn').hide();
        $('#user-greeting').text(`Welcome, ${current_user}!`).show();
        $('#logout-btn').show();
        data_handler.getPlanetsPage(dom.firstPage, dom.renderPage);
    },

    handleLogout() {
        this.currentUser = '';
        data_handler.currentUserVotes = [];
        $('.alert').hide();
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
                    $('#login-error-message').show().find('span').text('Invalid credentials!');
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
                        $('#reg-error-message').show().find('span').text('Username already taken!');
                    }
                })
            } else {
                $('#reg-error-message').show().find('span').text('Passwords do not match!');
            }
        })
    },

    addListenerToCloseAlerts() {
        $('.alert').find('.close').click(function () {
            $(this).parent().hide();
        })
    }

};