/**
 * Throws a generic error for when an action cannot be performed because no
 * user is currently authenticated.
 *
 * @throws {Error} The no-authenticated-user error.
 */
module.exports.throwNoAuthenticatedUserError
    = function throwGenericNoAuthenticatedUserError() {
        throw new Error('No user is currently logged in.');
    };
