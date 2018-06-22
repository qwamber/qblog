let firebase = require('firebase-admin');
let firebaseConfig = require('../config/firebase-admin-config.json');
let firebaseDatabaseURL = require('../config/firebase-database-url.json');
let { FieldError } = require('./errors.js');
let { handleUnexpectedError } = require('./promises.js');

let hasInitedDatabase = false;

let initDatabase = function initDatabaseSession() {
    if (firebase.initializeApp({
        credential: firebase.credential.cert(firebaseConfig),
        databaseURL: firebaseDatabaseURL,
    })) {
        hasInitedDatabase = true;
        return true;
    }

    return false;
};

module.exports.maybeInitDatabase = function maybeInitDatabaseSession() {
    if (hasInitedDatabase) {
        return true;
    }

    return initDatabase();
};

module.exports.createAuthUser = function createAuthUserAccountInDatabase(
    emailAddress,
    password,
) {
    module.exports.maybeInitDatabase();

    return firebase.auth().createUser({
        email: emailAddress,
        password,
    }).then((user) => {
        return user.uid;
    }).catch((error) => {
        switch (error.code) {
        case 'auth/email-already-in-use':
            throw new FieldError(
                'emailAddress',
                'That email address is already taken.',
            );
        case 'auth/invalid-email':
            throw new FieldError(
                'emailAddress',
                'Your email address must be in the correct format.',
            );
        case 'auth/weak-password':
            throw new FieldError(
                'password',
                'Your password is not strong enough.',
            );
        default:
            handleUnexpectedError(error);
        }
    });
};

module.exports.checkChildTaken = function checkChildKeyValueTakenInDatabase(
    location,
    childKey,
    value,
) {
    module.exports.maybeInitDatabase();

    return firebase.database().ref(location).orderByChild(childKey).equalTo(
        value,
    ).once('value').then((snapshot) => {
        return snapshot.exists();
    }).catch(handleUnexpectedError);
};

module.exports.write = function writeValueAtLocationInDatabase(
    location,
    value,
) {
    module.exports.maybeInitDatabase();

    let reference = firebase.database().ref(location);

    return reference.set(value).then(() => {
        return reference.key;
    }).catch(handleUnexpectedError);
};
