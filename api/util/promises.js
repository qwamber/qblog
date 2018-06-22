module.exports.handleUnexpectedError = function handleUnexpectedPromiseError(
    error,
) {
    // eslint-disable-next-line no-console
    console.warn(`An unexpected error occurred: ${error}`);

    throw new Error('An unexpected error occurred.');
};
