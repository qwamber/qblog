let tokens = require('../util/tokens.js');
let db = require('../util/db.js');
let errors = require('../util/errors.js');

const UNTITLED_POST_TITLE = 'Untitled Post';

/**
 * Creates a new blog post in the database.
 *
 * @param {Object} req The Express.js request object.
 * @param {string} req.body.blogKey The blog's key to make the post in.
 * @param {string} req.body.title The title to be used for the new post.
 * @param {string} req.body.body The post body to be used for the new post.
 * @param {string} req.headers.authorization The auth header, including the
 *                                           user's ID token as a bearer token.
 * @param {Object} res The Express.js response object.
 */
module.exports.newPost = function apiCreateNewBlogPost(req, res) {
    let { blogKey, title, body } = req.body;
    let idToken = tokens.getBearerToken(req);

    if (!blogKey) {
        errors.respondWithErrorJSON(res, new Error('A blog key is required.'));
        return;
    }

    let finalTitle = title || UNTITLED_POST_TITLE;

    let uid;

    db.verifyIDToken(idToken).then((decodedUID) => {
        uid = decodedUID;
        return db.read(`blogs/${blogKey}`);
    }).then((blog) => {
        if (!blog) {
            throw new Error('That blog could not be found.');
        }

        if (blog.owner !== uid) {
            throw new Error('You do not have permission to create a post on this blog.');
        }
    }).then(() => {
        return db.push(`blogs/${blogKey}/posts/`, {
            title: finalTitle,
            body,
            writer: uid,
            created: Math.floor(Date.now() / 1000),
        });
    }).then((key) => {
        res.status(200).json({ postKey: key });
    }).catch((error) => {
        errors.respondWithErrorJSON(res, error);
    });
};
