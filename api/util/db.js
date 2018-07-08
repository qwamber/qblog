let firebase = require('firebase-admin');
let firebaseConfig = require('../config/firebase-admin-config.json');
let firebaseDatabaseURL = require('../config/firebase-database-url.json');
let { FieldError } = require('./errors.js');
let { handleUnexpectedError } = require('./errors.js');
let { throwIDTokenVerificationError } = require('../util/errors.js');

let hasInitedDatabase = false;

/**
 * Initializes the Firebase database using credentials found in
 * `api/config/firebase-admin-config.json` and
 * `api/config/firebase-database-url.json`.
 * .
 * @return {boolean} Whether or not the initialization was successful.
 */
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

/**
 * Possibly initializes the Firebase database using credentials found in
 * `api/config/firebase-admin-config.json` and
 * `api/config/firebase-database-url.json`, depending on whether or not it has
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
 * Creates a user authentication account in Firebase Auth. Does not add
 * information to the Realtime Database.
 *
 * @param {string} emailAddress The user's email address.
 * @param {string} password The user's password.
 * @return {Promise.<string>} A promise that resolves with the new user
 *                            account's user ID, or rejects with a `FieldError`
 *                            if there is one.
 */
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
        case 'auth/email-already-exists':
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

/**
 * Checks if a value of a specified child key is taken in the Realtime Database
 * (e.g. if a username is taken in a list of users).
 *
 * @param {string} location The location in the database to check within.
 * @param {[type]} childKey The child key to check.
 * @param {[type]} value The desired value.
 * @return {Promise.<boolean>} A promise that resolves with whether or not the
 *                             value is taken, or rejects with an `Error` if
 *                             there is one.
 */
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

/**
 * Verifies a Firebase user ID token and decodes the user's UID.
 *
 * @param {string} idToken The user's auth ID token.
 * @return {Promise.<string>} A promise that resolves with the user's UID, or
 *                            rejects with an `Error` if there is one.
 */
module.exports.verifyIDToken = function verifyAuthIDTokenAnd(idToken) {
    module.exports.maybeInitDatabase();

    /*
        An empty string is used as a default to prevent an error that occurs
        when the type of `idToken` is `undefined`. This error is thrown instead
        of being returned as a rejected `Promise`, making it easier to avoid
        than to catch. See https://git.io/f4S3C for the `verifyIdToken` source
        code demonstrating this behavior.
     */
    return firebase.auth().verifyIdToken(idToken || '').then((decodedToken) => {
        if (!decodedToken.uid) {
            throwIDTokenVerificationError();
        }

        return decodedToken.uid;
    }).catch(throwIDTokenVerificationError);
};

/**
 * Writes to a location in the Realtime Database.
 *
 * @param {string} location The location in the database to write at.
 * @param {*} value The new value to use.
 * @return {Promise.<string>} The key of the location written at (e.g.
 *                            `username` in `users/example/username`), or an
 *                            `Error` if there is one.
 */
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

/**
 * Pushes to a parent location in the Realtime Database by using Firebase's
 * unique key generation.
 *
 * @param {string} parentLocation The parent location in the database to
 *                                push to.
 * @param {*} value The new value to push.
 * @return {Promise.<string>} A promise that resolves with the newly generated
 *                            push key written at (e.g. `-example` in
 *                            `blogs/-example`), or an `Error` if there is one.
 */
module.exports.push = function pushValueAtLocationInDatabase(
    parentLocation,
    value,
) {
    module.exports.maybeInitDatabase();

    let reference = firebase.database().ref(parentLocation).push();

    return reference.set(value).then(() => {
        return reference.key;
    }).catch(handleUnexpectedError);
};

/**
 * Reads at a location in the Realtime Database.
 *
 * @param {string} location The location in the database to read at.
 * @return {Promise.<*>} A promise that resolves with the data that was read,
 *                       or an `Error` if there is one.
 */
module.exports.read = function readValueAtLocationInDatabase(location) {
    module.exports.maybeInitDatabase();

    return firebase.database().ref(location).once('value').then((snapshot) => {
        return snapshot.val();
    }).catch(handleUnexpectedError);
};
