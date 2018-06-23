let db = require('../util/db.js');
let { FieldError } = require('../util/errors.js');
let { respondWithErrorJSON } = require('../util/responses.js');

const MIN_NAME_LENGTH = 1;
const EMAIL_ADDRESS_REGEX = /^.+@.+\..+$/;
const MIN_PASSWORD_LENGTH = 6;

/**
 * Creates a user account by creating an authentication account and adding
 * details to the database.
 *
 * @param {Object} req The Express.js request object.
 * @param {string} req.body.name The user's desired name.
 * @param {string} req.body.emailAddress The user's desired email address.
 * @param {string} req.body.password The user's desired password.
 * @param {Object} res The Express.js response object.
 */
module.exports.createUser = function apiCreateUserAccount(req, res) {
    let {
        name,
        emailAddress,
        password,
    } = req.body;

    if (!name || name.length < MIN_NAME_LENGTH) {
        respondWithErrorJSON(res, new FieldError(
            'name',
            `Your name must be at least ${MIN_NAME_LENGTH} ${MIN_NAME_LENGTH === 1 ? 'character' : 'characters'} long.`,
        ));
        return;
    }

    if (!emailAddress || !EMAIL_ADDRESS_REGEX.test(emailAddress)) {
        respondWithErrorJSON(res, new FieldError(
            'emailAddress',
            'Your email address must be in the correct format.',
        ));
        return;
    }

    if (!password || password.length < MIN_PASSWORD_LENGTH) {
        respondWithErrorJSON(res, new FieldError(
            'emailAddress',
            `Your password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
        ));
        return;
    }

    db.checkChildTaken(
        'users/',
        'emailAddress',
        emailAddress,
    ).then((isTaken) => {
        if (isTaken) {
            throw new FieldError(
                'emailAddress',
                'That email address is already taken.',
            );
        }

        return db.createAuthUser(emailAddress, password);
    }).then((uid) => {
        return db.write(`users/${uid}/`, {
            name,
            emailAddress,
            accountCreated: Math.floor(Date.now() / 1000),
        });
    }).then((uid) => {
        res.status(200).json({ uid });
    }).catch((fieldError) => {
        respondWithErrorJSON(res, fieldError);
    });
};
