let serializeError = require('serialize-error');

/**
 * An error that occurs during authentication, containing the field that it
 * relates to.
 *
 * @property {string} field The field that the error relates to. It should be
 *                          one of the following: `name`, `username`,
 *                          `emailAddress`, or `password`.
 * @property {string} message The error message.
 * @property {Date} date When the error occurred.
 */
module.exports.FieldError = class AuthFieldError {
    /**
     * Constructs a `FieldError`.
     *
     * @param {string} field The field that the error relates to. See the class
     *                       description for the list of possible fields.
     * @param {[type]} message The error message.
     */
    constructor(field, message) {
        this.field = field;
        this.message = message;
        this.date = new Date();
    }
};

/**
 * Throws a generic error for when a user's ID token cannot be verified.
 *
 * @throws {Error} The ID token error.
 */
module.exports.throwIDTokenVerificationError
    = function throwGenericIDTokenVerificationError() {
        throw new Error('The current user could not be authenticated.');
    };

/**
 * Handles an unexpected server error by writing it to the console and throwing
 * a constant, less descriptive error message that can be used on the frontend.
 *
 * @param {Error} error The error.
 * @throws {Error} The less descriptive error.
 */
module.exports.handleUnexpectedError = function handleUnexpectedPromiseError(
    error,
) {
    // eslint-disable-next-line no-console
    console.warn(`An unexpected error occurred: ${error}`);

    throw new Error('An unexpected error occurred.');
};

module.exports.respondWithErrorJSON = function respondWithErrorWithExpressJSON(
    res,
    error,
) {
    let errorObject;

    if (error instanceof Error) {
        errorObject = serializeError(error);
    } else {
        errorObject = error;
    }

    res.status(400).json(errorObject);
};
