let tokens = require('../util/tokens.js');
let db = require('../util/db.js');
let errors = require('../util/errors.js');

const UNTITLED_POST_TITLE = 'Untitled Post';

/**
 * Creates a new blog post in the database, or edits an existing blog post.
 *
 * @param {Object} req The Express.js request object.
 * @param {string} req.body.blogKey The blog's key to make the post in.
 * @param {string} req.body.postKeyIfEditing The post key to edit, if this
 *                                           should be an edit.
 * @param {string} req.body.title The title to be used for the new post.
 * @param {string} req.body.body The post body to be used for the new post.
 * @param {string} req.headers.authorization The auth header, including the
 *                                           user's ID token as a bearer token.
 * @param {Object} res The Express.js response object.
 */
module.exports.newPostOrEditPost = function apiCreateNewBlogPostOrEditBlogPost(
    req,
    res,
) {
    let {
        blogKey,
        postKeyIfEditing,
        title,
        body,
    } = req.body;

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
        let newPostObject = {
            title: finalTitle,
            body,
            writer: uid,
            created: Math.floor(Date.now() / 1000),
        };

        if (postKeyIfEditing) {
            return db.write(
                `blogs/${blogKey}/posts/${postKeyIfEditing}`,
                newPostObject,
            );
        }

        return db.push(
            `blogs/${blogKey}/posts/`,
            newPostObject,
        );
    }).then((key) => {
        res.status(200).json({ postKey: key });
    }).catch((error) => {
        errors.respondWithErrorJSON(res, error);
    });
};

/**
 * Gets a post object.
 *
 * @param {Object} req The Express.js request object.
 * @param {string} req.query.blogKey The blog key.
 * @param {string} req.query.postKey The post key.
 * @param {Object} res The Express.js response object.
 */
module.exports.getPost = function apiGetPostObject(req, res) {
    let { blogKey, postKey } = req.query;

    if (!blogKey) {
        errors.respondWithErrorJSON(res, new Error('A blog key is required.'));
        return;
    }

    if (!postKey) {
        errors.respondWithErrorJSON(res, new Error('A post key is required.'));
        return;
    }

    db.read(`blogs/${blogKey}/posts/${postKey}`).then((post) => {
        if (!post) {
            throw new Error('That blog could not be found.');
        }

        res.status(200).json(post);
    }).catch((error) => {
        errors.respondWithErrorJSON(res, error);
    });
};
