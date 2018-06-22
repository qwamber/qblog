let rp = require('request-promise-native');

// TODO: Change this once the service is published.
const API_LOCATION = 'http://localhost:8080';

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
