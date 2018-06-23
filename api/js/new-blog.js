let serializeError = require('serialize-error');
let db = require('../util/db.js');

const MIN_NAME_LENGTH = 1;
const MIN_SUBDOMAIN_LENGTH = 3;
const SUBDOMAIN_REGEX = /^[a-z0-9_-]+$/i;

module.exports.createNewBlog = function apiCreateNewBlogPage(req, res) {
    let { name, subdomain } = req.body;

    if (!name || name.length < MIN_NAME_LENGTH) {
        res.status(400).json(serializeError(new Error(
            `Your blog's name must be at least ${MIN_NAME_LENGTH} ${MIN_NAME_LENGTH === 1 ? 'character' : 'characters'} long.`,
        )));
        return;
    }

    if (!subdomain || subdomain.length < MIN_SUBDOMAIN_LENGTH) {
        res.status(400).json(serializeError(new Error(
            `Your blog's subdomain must be at least ${MIN_SUBDOMAIN_LENGTH} ${MIN_SUBDOMAIN_LENGTH === 1 ? 'character' : 'characters'} long.`,
        )));
        return;
    }

    if (!SUBDOMAIN_REGEX.test(subdomain)) {
        res.status(400).json(serializeError(new Error(
            'Your blog\'s subdomain can only contain letters, numbers, underscores, and hyphens.',
        )));
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
        res.status(400).json(serializeError(error));
    });
};
