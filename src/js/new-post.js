let handlebars = require('handlebars');
let queryString = require('query-string');
let requests = require('../util/requests');

let newPostError = document.getElementById('new-post-error');

/**
 * Is called when the body loads. Initializes the page.
 */
window.onLoadInit = function onLoadBodyInit() {
    let newPostHeadingInnerTemplate = handlebars.compile(
        document.getElementById('new-post-heading-inner-template').innerHTML,
    );
    let titleInnerTemplate = handlebars.compile(
        document.getElementById('title-inner-template').innerHTML,
    );

    let blogKey = queryString.parse(window.location.search).blogKey || '';

    requests.makeAPIGetRequest(
        `/api/get-blog?key=${blogKey}`,
        {},
        true,
    ).then((blog) => {
        let blogWithKey = Object.assign({}, blog, { key: blogKey });

        document.getElementById(
            'new-post-heading-inner-template',
        ).innerHTML = newPostHeadingInnerTemplate(blogWithKey);
        document.title = titleInnerTemplate(blogWithKey);
    }).catch((error) => {
        newPostError.innerHTML = error.message;
    });
};

/**
 * Submits the current new post HTML inputs by making an API request. Updates
 * the error message after submitting, if there is an error.
 */
window.onClickSubmitNewPost = function onClickSubmitNewPostFromInputs() {
    let title = document.getElementById('title-input').value;
    let body = document.getElementById('body-input').value;

    let blogKey = queryString.parse(window.location.search).blogKey || '';

    requests.makeAPIPostRequest(
        '/api/new-post',
        { blogKey, title, body },
        true,
    ).then(() => {
        // TODO: Go to the blog page.
    }).catch((error) => {
        newPostError.innerHTML = error.message;
    });
};
