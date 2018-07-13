let handlebars = require('handlebars');
let queryString = require('query-string');
let requests = require('../util/requests');

let postError = document.getElementById('post-error');
let postKeyIfEditing;

/**
 * Is called when the body loads. Initializes the page.
 */
window.onLoadInit = function onLoadBodyInit() {
    let newPostHeadingInnerTemplate = handlebars.compile(
        document.getElementById('post-heading-inner-template').innerHTML,
    );
    let titleInnerTemplate = handlebars.compile(
        document.getElementById('title-inner-template').innerHTML,
    );
    let submitButtonInnerTemplate = handlebars.compile(
        document.getElementById('submit-button-inner-template').innerHTML,
    );

    let blogKey = queryString.parse(window.location.search).blogKey || '';
    postKeyIfEditing = queryString.parse(window.location.search).postKey;

    Promise.all([
        requests.makeAPIGetRequest(
            `/api/get-blog?key=${blogKey}`,
            {},
            true,
        ),
        new Promise((resolve) => {
            if (!postKeyIfEditing) {
                resolve();
                return;
            }

            resolve(
                requests.makeAPIGetRequest(
                    `/api/get-post?blogKey=${blogKey}&postKey=${postKeyIfEditing}`,
                    {},
                    true,
                ),
            );
        }),
    ]).then(([blog, postIfEditing]) => {
        let blogWithKey = Object.assign({}, blog, { key: blogKey });

        document.getElementById(
            'post-heading-inner-template',
        ).innerHTML = newPostHeadingInnerTemplate(blogWithKey);
        document.title = titleInnerTemplate(blogWithKey);
        document.getElementById(
            'submit-button',
        ).innerHTML = submitButtonInnerTemplate({
            isEditing: postKeyIfEditing,
        });

        console.log(postIfEditing);

        if (postIfEditing) {
            document.getElementById('title-input').value = postIfEditing.title;
            document.getElementById('body-input').value = postIfEditing.body;
        }
    }).catch((error) => {
        postError.innerHTML = error.message;
    });
};

/**
 * Submits the current new post HTML inputs by making an API request. Updates
 * the error message after submitting, if there is an error.
 */
window.onClickSubmitPost = function onClickSubmitNewPostFromInputs() {
    let title = document.getElementById('title-input').value;
    let body = document.getElementById('body-input').value;

    let blogKey = queryString.parse(window.location.search).blogKey || '';

    requests.makeAPIPostRequest(
        '/api/new-post-or-edit-post',
        {
            blogKey,
            postKeyIfEditing,
            title,
            body,
        },
        true,
    ).then(() => {
        // TODO: Go to the blog page.
    }).catch((error) => {
        postError.innerHTML = error.message;
    });
};
