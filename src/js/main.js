require('../style/master.less');
require('../style/main.less');
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
        let evenBlogs = {};
        let oddBlogs = {};
        let isCurrentlyEven = true;

        Object.keys(blogs).forEach((key) => {
            if (isCurrentlyEven) {
                evenBlogs[key] = blogs[key];
            } else {
                oddBlogs[key] = blogs[key];
            }

            isCurrentlyEven = !isCurrentlyEven;
        });

        document.getElementById('blog-list').innerHTML = blogListTemplate(
            { evenBlogs, oddBlogs },
        );
    }).catch((error) => {
        document.getElementById('blog-list').innerHTML = error.message;
    });
};
