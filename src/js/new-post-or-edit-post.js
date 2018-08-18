require('../style/master.less');
require('../style/new-post-or-edit-post.less');
let handlebars = require('handlebars');
let queryString = require('query-string');
let Quill = require('quill');
let requests = require('../util/requests');

let postError = document.getElementById('post-error');
let postKeyIfEditing;
let quill;

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
            'post-heading',
        ).innerHTML = newPostHeadingInnerTemplate(blogWithKey);
        document.title = titleInnerTemplate(blogWithKey);
        document.getElementById(
            'submit-button',
        ).innerHTML = submitButtonInnerTemplate({
            isEditing: postKeyIfEditing,
        });

        quill = new Quill('#body-input', {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'link'],
                    [{ header: [false, 1, 2] }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['blockquote', 'code-block'],
                ],
            },
            placeholder: 'Compose your post here!',
        });

        if (postIfEditing) {
            document.getElementById('title-input').value = postIfEditing.title;
            quill.setContents(postIfEditing.bodyDelta);
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

    let blogKey = queryString.parse(window.location.search).blogKey || '';

    requests.makeAPIPostRequest(
        '/api/new-post-or-edit-post',
        {
            blogKey,
            postKeyIfEditing,
            title,
            bodyDelta: quill.getContents(),
        },
        true,
    ).then(() => {
        window.location.href = `./edit-blog?key=${blogKey}`;
    }).catch((error) => {
        postError.innerHTML = error.message;
    });
};
