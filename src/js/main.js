let handlebars = require('handlebars');
let requests = require('../util/requests');

/**
 * Initializes the page by making an API request and compiling and rendering
 * the Handlebars template.
 */
window.onLoadInit = function onLoadBodyInit() {
    let blogListTemplate = handlebars.compile(
        document.getElementById('blog-list-items-template').innerHTML,
    );

    requests.makeAPIGetRequest(
        '/api/get-blogs',
        {},
        true,
    ).then((blogs) => {
        document.getElementById('blog-list').innerHTML = blogListTemplate(
            { blogs },
        );
    }).catch((error) => {
        document.getElementById('blog-list').innerHTML = error.message;
    });
};
