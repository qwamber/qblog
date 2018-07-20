require('../style/master.less');
require('../style/log-in-or-sign-up.less');
let db = require('../util/db.js');

let loginError = document.getElementById('login-error');

/**
 * Submits the current login HTML inputs. Updates the error message after
 * submitting, if there is an error.
 */
window.onClickSubmitLogIn = function onClickSubmitLogInFromInputs() {
    let emailAddress = document.getElementById('email-address-input').value;
    let password = document.getElementById('password-input').value;

    /*
        Reset the error so that it does not get "stuck" if it is fixed when the
        newest submission hasn't been responded to yet.
     */
    loginError.innerHTML = '';

    db.logIn(emailAddress, password).then(() => {
        window.location.replace('./main');
    }).catch((error) => {
        loginError.innerHTML = error.message;
    });
};
