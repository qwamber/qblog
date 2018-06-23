let firebase = require('firebase');
let firebaseConfig = require('../config/firebase-config.json');

let hasInitedDatabase = false;

/**
 * Initializes the Firebase database using credentials found in
 * `src/config/firebase-config.json`.
 * .
 * @return {boolean} Whether or not the initialization was successful.
 */
let initDatabase = function initDatabaseSession() {
    if (firebase.initializeApp(firebaseConfig)) {
        hasInitedDatabase = true;
        return true;
    }

    return false;
};

/**
 * Possibly initializes the Firebase database using credentials found in
 * `src/config/firebase-config.json`, depending on whether or not it has
 * already been initialized.
 *
 * @return {boolean} Whether or not the initialization was successful or it was
 *                   already initialized.
 */
module.exports.maybeInitDatabase = function maybeInitDatabaseSession() {
    if (hasInitedDatabase) {
        return true;
    }

    return initDatabase();
};

/**
 * Locally authenticates a user through Firebase Auth.
 *
 * @param {string} emailAddress The user's email address.
 * @param {string} password The user's password.
 * @return {Promise.<string>} A promise that resolves with the user's user ID,
 *                            or rejects with an `Error`, if there is one.
 */
module.exports.logIn = function locallyLogInToAuthSession(
    emailAddress,
    password,
) {
    module.exports.maybeInitDatabase();

    return firebase.auth().signInWithEmailAndPassword(
        emailAddress,
        password,
    ).then((user) => {
        return user.uid;
    }).catch((error) => {
        switch (error.code) {
        case 'auth/invalid-email':
            throw new Error(
                'Your email address must be in the correct format.',
            );
        case 'auth/user-disabled':
            throw new Error('That account has been disabled.');
        case 'auth/user-not-found':
            throw new Error('That email address has not been registered.');
        case 'auth/wrong-password':
            throw new Error('That password is incorrect.');
        default:
            throw new Error(
                'An unexpected error occurred. Please try again later.',
            );
        }
    });
};
