let db = require('../util/db.js');
let tokens = require('../util/tokens.js');
let util = require('../util/util.js');
let { respondWithErrorJSON } = require('../util/errors.js');

const MIN_NAME_LENGTH = 1;
const MIN_SUBDOMAIN_LENGTH = 3;
const SUBDOMAIN_REGEX = /^[a-z0-9_-]+$/i;

// `www` will be the subdomain for the main website, so it cannot be allowed.
let RESERVED_SUBDOMAINS = [/^www$/i];

/**
 * Creates a new blog in the database.
 *
 * @param {Object} req The Express.js request object.
 * @param {string} req.body.name The desired name for the blog.
 * @param {string} req.body.subdomain The desired subdomain for the blog.
 * @param {string} req.headers.authorization The auth header, including the
 *                                           user's ID token as a bearer token.
 * @param {Object} res The Express.js response object.
 */
module.exports.createNewBlog = function apiCreateNewBlogPage(req, res) {
    let { name, subdomain } = req.body;
    let idToken = tokens.getBearerToken(req);

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

    for (let i = 0; i < RESERVED_SUBDOMAINS.length; i++) {
        if (RESERVED_SUBDOMAINS[i].test(subdomain)) {
            respondWithErrorJSON(res, new Error(
                'That subdomain is not available.',
            ));
            return;
        }
    }

    let uid;
    let blogKey;

    db.verifyIDToken(idToken).then((decodedUID) => {
        uid = decodedUID;
        return db.checkChildTaken('blogs/', 'subdomain', subdomain);
    }).then((isTaken) => {
        if (isTaken) {
            throw new Error('That subdomain is already taken.');
        }
    }).then(() => {
        return db.push('blogs/', {
            name,
            subdomain,
            userUID: uid,
            blogCreated: Math.floor(Date.now() / 1000),
        });
    }).then((key) => {
        blogKey = key;
        return db.write(`users/${uid}/blogs/${key}`, true);
    }).then(() => {
        res.status(200).json({ key: blogKey });
    }).catch((error) => {
        respondWithErrorJSON(res, error);
    });
};

/**
 * Gets the current user's blog objects.
 *
 * @param {Object} req The Express.js request object.
 * @param {string} req.headers.authorization The auth header, including the
 *                                           user's ID token as a bearer token.
 * @param {Object} res The Express.js response object.
 */
module.exports.getBlogs = function apiGetBlogObjects(req, res) {
    let idToken = tokens.getBearerToken(req);

    let truthyUserBlogKeys;

    db.verifyIDToken(idToken).then((uid) => {
        return db.read(`users/${uid}/blogs/`);
    }).then((userBlogKeys) => {
        truthyUserBlogKeys = util.getTruthyKeys(userBlogKeys);

        return Promise.all(truthyUserBlogKeys.map((blogKey) => {
            return db.read(`blogs/${blogKey}`);
        }));
    }).then((blogObjectsArray) => {
        return util.makeKeysAndValues(
            truthyUserBlogKeys,
            blogObjectsArray,
        );
    }).then((blogObjects) => {
        res.status(200).json(blogObjects);
    }).catch((error) => {
        respondWithErrorJSON(res, error);
    });
};

/**
 * Gets a blog object.
 *
 * @param {Object} req The Express.js request object.
 * @param {string} req.query.key The blog key.
 * @param {Object} res The Express.js response object.
 */
module.exports.getBlog = function apiGetBlogObjects(req, res) {
    let { key } = req.query;

    if (!key) {
        respondWithErrorJSON(res, new Error('A blog key is required.'));
        return;
    }

    db.read(`blogs/${key}`).then((blog) => {
        if (!blog) {
            throw new Error('That blog could not be found.');
        }

        res.status(200).json(blog);
    }).catch((error) => {
        respondWithErrorJSON(res, error);
    });
};
