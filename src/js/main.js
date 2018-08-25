require('../style/master.less');
require('../style/main-or-edit-blog.less');
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
        // The even-odd system is used to create two colums of blogs.
        let sortedEvenBlogKeys = [];
        let sortedOddBlogKeys = [];
        let isCurrentlyEven = true;

        let sortedKeys = Object.keys(blogs).sort((blogKeyA, blogKeyB) => {
            return (blogs[blogKeyB].lastEdited || 0)
                - (blogs[blogKeyA].lastEdited || 0);
        });

        console.log(blogs, sortedKeys);

        sortedKeys.forEach((key) => {
            if (isCurrentlyEven) {
                sortedEvenBlogKeys.push(key);
            } else {
                sortedOddBlogKeys.push(key);
            }

            isCurrentlyEven = !isCurrentlyEven;
        });

        document.getElementById('blog-list').innerHTML = blogListTemplate(
            { sortedEvenBlogKeys, sortedOddBlogKeys, blogs },
        );
    }).catch((error) => {
        document.getElementById('blog-list').innerHTML = error.message;
    });
};
