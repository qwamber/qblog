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
