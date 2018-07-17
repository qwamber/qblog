let handlebars = require('handlebars');
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

    let subdomain = window.location.host.split('.')[0] || '';

    requests.makeAPIGetRequest(
        `/api/get-blog?subdomain=${subdomain}`,
        {},
        false,
    ).then((blog) => {
        let postKeys = Object.keys(blog.posts || {});
        let notFeaturedPosts = {};

        for (let i = 0; i < postKeys.length; i++) {
            if (postKeys[i] !== blog.featuredPostKey) {
                notFeaturedPosts[postKeys[i]] = blog.posts[postKeys[i]];
            }
        }

        let blogWithProperties = Object.assign({}, blog, { notFeaturedPosts });

        document.getElementById('body').innerHTML = bodyInnerTemplate(
            blogWithProperties,
        );
        document.title = titleInnerTemplate(blogWithProperties);
    }).catch((error) => {
        document.getElementById('body').innerHTML = error.message;
    });
};
