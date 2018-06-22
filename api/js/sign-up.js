let db = require('../util/db.js');
let { FieldError } = require('../util/errors.js');

const MIN_NAME_LENGTH = 1;
const MIN_USERNAME_LENGTH = 2;
const USERNAME_REGEX = /^[a-z0-9_-]+$/i;
const EMAIL_ADDRESS_REGEX = /^.+@.+\..+$/;
const MIN_PASSWORD_LENGTH = 1;

module.exports.createUser = function apiCreateUserAccount(req, res) {
    let {
        name,
        username,
        emailAddress,
        password,
    } = req.body;

    if (!name || name.length < MIN_NAME_LENGTH) {
        res.status(400).json(new FieldError(
            'name',
            `Your name must be at least ${MIN_NAME_LENGTH} ${MIN_NAME_LENGTH === 1 ? 'character' : 'characters'} long.`,
        ));
        return;
    }

    if (!username || username.length < MIN_USERNAME_LENGTH) {
        res.status(400).json(new FieldError(
            'username',
            `Your username must be at least ${MIN_USERNAME_LENGTH} ${MIN_USERNAME_LENGTH === 1 ? 'character' : 'characters'} long.`,
        ));
        return;
    }

    if (!USERNAME_REGEX.test(username)) {
        res.status(400).json(new FieldError(
            'username',
            'Usernames can only contain letters, numbers, and underscores.',
        ));
        return;
    }

    if (!emailAddress || !EMAIL_ADDRESS_REGEX.test(emailAddress)) {
        res.status(400).json(new FieldError(
            'emailAddress',
            'Your email address must be in the correct format.',
        ));
        return;
    }

    if (!password || password.length < MIN_PASSWORD_LENGTH) {
        res.status(400).json(new FieldError(
            'emailAddress',
            `Your password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
        ));
        return;
    }

    Promise.all([
        db.checkChildTaken('users/', 'username', username),
        db.checkChildTaken('users/', 'emailAddress', emailAddress),
    ]).then((takenValues) => {
        if (takenValues[0]) {
            throw new FieldError(
                'username',
                'That username is already taken.',
            );
        } else if (takenValues[1]) {
            throw new FieldError(
                'emailAddress',
                'That email address is already taken.',
            );
        }

        return db.createAuthUser(emailAddress, password);
    }).then((uid) => {
        return db.write(`users/${uid}/`, {
            name,
            username,
            emailAddress,
            accountCreated: Math.floor(Date.now() / 1000),
        });
    }).then((uid) => {
        res.status(200).json({ uid });
    }).catch((fieldError) => {
        res.status(400).json(fieldError);
    });
};
