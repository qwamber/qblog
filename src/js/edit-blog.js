let handlebars = require('handlebars');
let queryString = require('query-string');
let requests = require('../util/requests');

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
        let blogWithKey = Object.assign({}, blog, { key });

        document.getElementById('body').innerHTML = bodyInnerTemplate(
            blogWithKey,
        );
        document.title = titleInnerTemplate(blogWithKey);
    }).catch((error) => {
        document.getElementById('body').innerHTML = error.message;
    });
};
