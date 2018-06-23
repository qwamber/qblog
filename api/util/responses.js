let serializeError = require('serialize-error');

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
