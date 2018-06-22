let rp = require('request-promise-native');

// TODO: Change this once the service is published.
const API_LOCATION = 'http://localhost:8080';

/**
 * Makes a POST request to the API at a specified endpoint.
 *
 * @param {string} apiEndpoint The endpoint to make a request to (which should
 *                             begin with a `/`, e.g., `/api/sign-up`).
 * @param {Object} body The request body, which will be converted to a JSON
 *                      string.
 * @return {Promise.<Object>} A promise that resolves with the response body,
 *                            or rejects with an `Error` if there is one.
 */
module.exports.makeAPIPostRequest = function makeAPIPostRequestWithJSON(
    apiEndpoint,
    body,
) {
    return rp({
        method: 'POST',
        uri: API_LOCATION + apiEndpoint,
        body,
        json: true,
        simple: false,
        resolveWithFullResponse: true,
    }).catch(() => {
        /*
            Throw a simple error if something goes wrong when making the
            request itself.
         */
        throw new Error(
            'An unexpected error occurred. Please try again later.',
        );
    }).then((response) => {
        if (response.statusCode < 200 || 300 <= response.statusCode) {
            throw response.body;
        }

        return response.body;
    });
};
