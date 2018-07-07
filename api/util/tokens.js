const AUTH_TOKEN_PREFIX = 'Bearer ';

/**
 * Gets the bearer token from an Express.js request.
 *
 * @param {Object} req The Express.js request.
 * @return {string} The bearer token, or an empty string if there is none.
 */
module.exports.getBearerToken = function getBearerTokenFromRequest(req) {
    let authHeader = req.get('Authorization');

    if (authHeader.startsWith(AUTH_TOKEN_PREFIX)) {
        return authHeader.slice(AUTH_TOKEN_PREFIX.length);
    }

    return '';
};
