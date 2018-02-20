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
            resp ? users.showLoggedInStatus(resp) : users.showLoggedOutStatus();
        })
    },

    showLoggedInStatus(current_user) {
        this.currentUser = current_user;
        $('#login-trigger-btn').hide();
        $('#register-trigger-btn').hide();
        $('#user-greeting').text(`Welcome, ${current_user}!`).show();
        $('#logout-btn').show();
        data_handler.getCurrentUserVotes();
        $('#planets-table').find('tr').find('td:last').show();  // NEEDS FIXING
    },

    showLoggedOutStatus() {
        this.currentUser = '';
        data_handler.currentUserVotes = null;
        $('#user-greeting').text('').hide();
        $('#logout-btn').hide();
        $('#login-trigger-btn').show();
        $('#register-trigger-btn').show();
        $('#planets-table').find('tr').find('td:last').hide();
    },

    addListenerToLoginBtn() {
        $('#login-btn').click(function () {
            $.post('/login', $('#login-form').serialize(), function (resp) {
                if (resp) {
                    users.showLoggedInStatus(resp);
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