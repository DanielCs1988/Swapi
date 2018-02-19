users = {

    init() {
        this.queryCurrentUser();
        this.addListenerToLoginBtn();
        this.addListenerToLogoutBtn();
        this.addListenerToRegBtn();
    },

    queryCurrentUser() {
        $.get('/login-status', function (resp) {
            resp ? users.showLoggedInStatus(resp) : users.showLoggedOutStatus();
        })
    },

    showLoggedInStatus(current_user) {
        $('#login-trigger-btn').hide();
        $('#register-trigger-btn').hide();
        $('#user-greeting').text(`Welcome, ${current_user}!`).show();
        $('#logout-btn').show();
    },

    showLoggedOutStatus() {
        $('#user-greeting').text('').hide();
        $('#logout-btn').hide();
        $('#login-trigger-btn').show();
        $('#register-trigger-btn').show();
    },

    addListenerToLoginBtn() {
        $('#login-btn').click(function () {
            $.post('/login', $('#login-form').serialize(), function (resp) {
                if (resp) {
                    users.showLoggedInStatus(resp);
                    $('#login').modal('hide');
                } else {
                    console.log('Wrong credentials!')  // PLACEHOLDER
                }
            })
        })
    },

    addListenerToLogoutBtn() {
        $('#logout-btn').click(function () {
            $.get('/logout', () => users.showLoggedOutStatus())
        })
    },

    addListenerToRegBtn() {
        $('#reg-btn').click(function () {
            if ($('#reg-password').val() === $('#reg-password-control').val()) {
                $.post('/register', $('#register-form').serialize(), function (resp) {
                    if (resp) {
                        users.showLoggedInStatus(resp);
                        $('#register').modal('hide');
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