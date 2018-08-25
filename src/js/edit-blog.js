require('../style/master.less');
require('../style/main-or-edit-blog.less');
let handlebars = require('handlebars');
let queryString = require('query-string');
let requests = require('../util/requests');

/**
 * Initializes the page by making an API request and compiling and rendering
 * the Handlebars template.
 */
window.onLoadInit = function onLoadBodyInit() {
    let bodyInnerTemplate = handlebars.compile(
        document.getElementById('body-inner-template').innerHTML,
    );
    let titleInnerTemplate = handlebars.compile(
        document.getElementById('title-inner-template').innerHTML,
    );

    let key = queryString.parse(window.location.search).key || '';

    requests.makeAPIGetRequest(
        `/api/get-blog?key=${key}`,
        {},
        true,
    ).then((blog) => {
        let sortedPostKeys = Object.keys(blog.posts || {}).sort(
            (postKeyA, postKeyB) => {
                return (blog.posts[postKeyB].created || 0)
                    - (blog.posts[postKeyA].created || 0);
            },
        );

        let blogWithProperties = Object.assign(
            {},
            blog,
            { key, sortedPostKeys },
        );

        /*
            Posts do not need to be sorted because the keys are already ordered
            by creation date.
         */
        document.getElementById('body').innerHTML = bodyInnerTemplate(
            blogWithProperties,
        );
        document.title = titleInnerTemplate(blogWithProperties);
    }).catch((error) => {
        document.getElementById('body').innerHTML = error.message;
    });
};
