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
