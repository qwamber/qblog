let rp = require('request-promise-native');
let db = require('./db.js');

// TODO: Change this once the service is published.
const API_LOCATION = 'http://localhost:8080';

/**
 * Makes a request to the API at a specified endpoint.
 *
 * @param {string} apiEndpoint The endpoint to make a request to (which should
 *                             begin with a `/`, e.g., `/api/sign-up`).
 * @param {string} method The request method, which will usually be either
 *                        `'GET'` or `'POST'`.
 * @param {Object} body The request body, which will be converted to a JSON
 *                      string.
 * @param {boolean} needsIDToken Whether or not the current user's auth ID
 *                               token should be added as the `idToken`
 *                               property of the request body.
 * @return {Promise.<Object>} A promise that resolves with the response body,
 *                            or rejects with an `Error` if there is one.
 */
let makeAPIRequest = function makeAPIRequestWithJSON(
    apiEndpoint,
    method,
    body,
    needsIDToken,
) {
    let idTokenPromise = (
        needsIDToken ? db.getIDToken() : Promise.resolve(null)
    );

    return idTokenPromise.then((idTokenOrNull) => {
        return rp({
            method,
            uri: API_LOCATION + apiEndpoint,
            body,
            auth: {
                bearer: idTokenOrNull,
            },
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
        });
    }).then((response) => {
        if (response.statusCode < 200 || 300 <= response.statusCode) {
            throw response.body;
        }

        return response.body;
    });
};

/**
 * Makes a POST request to the API at a specified endpoint.
 *
 * @param {string} apiEndpoint The endpoint to make a request to (which should
 *                             begin with a `/`, e.g., `/api/sign-up`).
 * @param {Object} body The request body, which will be converted to a JSON
 *                      string.
 * @param {boolean} needsIDToken Whether or not the current user's auth ID
 *                               token should be added as a bearer token.
 * @return {Promise.<Object>} A promise that resolves with the response body,
 *                            or rejects with an `Error` if there is one.
 */
module.exports.makeAPIPostRequest = function makeAPIPostRequestWithJSON(
    apiEndpoint,
    body,
    needsIDToken,
) {
    return makeAPIRequest(apiEndpoint, 'POST', body, needsIDToken);
};

/**
 * Makes a GET request to the API at a specified endpoint.
 *
 * @param {string} apiEndpoint The endpoint to make a request to (which should
 *                             begin with a `/`, e.g., `/api/sign-up`).
 * @param {Object} body The request body, which will be converted to a JSON
 *                      string.
 * @param {boolean} needsIDToken Whether or not the current user's auth ID
 *                               token should be added as a bearer token.
 * @return {Promise.<Object>} A promise that resolves with the response body,
 *                            or rejects with an `Error` if there is one.
 */
module.exports.makeAPIGetRequest = function makeAPIPostRequestWithJSON(
    apiEndpoint,
    body,
    needsIDToken,
) {
    return makeAPIRequest(apiEndpoint, 'GET', body, needsIDToken);
};
