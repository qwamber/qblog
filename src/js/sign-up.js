let requests = require('../util/requests');

let nameInputError = document.getElementById('name-input-error');
let usernameInputError = document.getElementById('username-input-error');
let emailAddressInputError
    = document.getElementById('email-address-input-error');
let passwordInputError = document.getElementById('password-input-error');

let handleFieldError = function handleFieldErrorByUpdatingHTML(fieldError) {
    let errorToSet;

    switch (fieldError.field) {
    case 'name':
        errorToSet = nameInputError;
        break;
    case 'username':
        errorToSet = usernameInputError;
        break;
    case 'emailAddress':
        errorToSet = emailAddressInputError;
        break;
    case 'password':
        errorToSet = passwordInputError;
        break;
    default:
        errorToSet = passwordInputError;
        break;
    }

    errorToSet.innerHTML = fieldError.message;
};

window.onClickSubmitSignUp = function onClickSubmitSignUpFromInputs() {
    /*
        Reset errors so that a fixed error does not get "stuck" if it is
        checked after another error.
     */
    nameInputError.innerHTML = '';
    usernameInputError.innerHTML = '';
    emailAddressInputError.innerHTML = '';
    passwordInputError.innerHTML = '';

    let name = document.getElementById('name-input').value;
    let username = document.getElementById('username-input').value;
    let emailAddress = document.getElementById('email-address-input').value;
    let password = document.getElementById('password-input').value;

    requests.makeAPIPostRequest('/api/sign-up', {
        name,
        username,
        emailAddress,
        password,
    }).then(() => {
        // TODO: Go to the main page.
    }).catch((fieldError) => {
        handleFieldError(fieldError);
    });
};