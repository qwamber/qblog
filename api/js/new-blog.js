let db = require('../util/db.js');
let { respondWithErrorJSON } = require('../util/responses.js');

const MIN_NAME_LENGTH = 1;
const MIN_SUBDOMAIN_LENGTH = 3;
const SUBDOMAIN_REGEX = /^[a-z0-9_-]+$/i;

/**
 * Creates a new blog in the database.
 *
 * @param {Object} req The Express.js request object.
 * @param {string} req.body.name The desired name for the blog.
 * @param {string} req.body.subdomain The desired subdomain for the blog.
 * @param {Object} res The Express.js response object.
 */
module.exports.createNewBlog = function apiCreateNewBlogPage(req, res) {
    let { name, subdomain } = req.body;

    if (!name || name.length < MIN_NAME_LENGTH) {
        respondWithErrorJSON(res, new Error(
            `Your blog's name must be at least ${MIN_NAME_LENGTH} ${MIN_NAME_LENGTH === 1 ? 'character' : 'characters'} long.`,
        ));
        return;
    }

    if (!subdomain || subdomain.length < MIN_SUBDOMAIN_LENGTH) {
        respondWithErrorJSON(res, new Error(
            `Your blog's subdomain must be at least ${MIN_SUBDOMAIN_LENGTH} ${MIN_SUBDOMAIN_LENGTH === 1 ? 'character' : 'characters'} long.`,
        ));
        return;
    }

    if (!SUBDOMAIN_REGEX.test(subdomain)) {
        respondWithErrorJSON(res, new Error(
            'Your blog\'s subdomain can only contain letters, numbers, underscores, and hyphens.',
        ));
        return;
    }

    db.checkChildTaken('blogs/', 'subdomain', subdomain).then((isTaken) => {
        if (isTaken) {
            throw new Error('That subdomain is already taken.');
        }
    }).then(() => {
        return db.push('blogs/', { name, subdomain });
    }).then((key) => {
        res.status(200).json({ key });
    }).catch((error) => {
        respondWithErrorJSON(res, error);
    });
};
