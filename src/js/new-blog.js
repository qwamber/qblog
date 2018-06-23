let requests = require('../util/requests');

let newBlogError = document.getElementById('new-blog-error');

/**
 * Submits the current new blog HTML inputs by making an API request. Updates
 * the error message after submitting, if there is an error.
 *
 * TODO: Go to the new blog's blog page after a successful creation.
 */
window.onClickSubmitCreateNewBlog
    = function onClickSubmitCreateNewBlogFromInputs() {
        /*
            Reset the error so that it does not get "stuck" if it is fixed
            when the newest submission hasn't been responded to yet.
         */
        newBlogError.innerHTML = '';

        let name = document.getElementById('name-input').value;
        let subdomain = document.getElementById('subdomain-input').value;

        requests.makeAPIPostRequest(
            '/api/new-blog',
            { name, subdomain },
            true,
        ).then(() => {
            // TODO: Go to the blog page.
        }).catch((error) => {
            newBlogError.innerHTML = error.message;
        });
    };
