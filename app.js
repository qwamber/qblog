let path = require('path');
let express = require('express');
let bodyParser = require('body-parser');
let webpack = require('webpack');
let webpackDevMiddleware = require('webpack-dev-middleware');
let webpackCompiler = webpack(require('./.webpack.config.js'));
let templates = require('./api/util/templates.js');
let api = require('./api/util/api-exports.js');

let app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(templates.get('index'));
});

app.get('/log-in', (req, res) => {
    res.send(templates.get('log-in'));
});

app.get('/sign-up', (req, res) => {
    res.send(templates.get('sign-up'));
});

app.get('/main', (req, res) => {
    res.send(templates.get('main'));
});

app.get('/new-blog', (req, res) => {
    res.send(templates.get('new-blog'));
});

app.get('/edit-blog', (req, res) => {
    res.send(templates.get('edit-blog'));
});

app.get('/new-post-or-edit-post', (req, res) => {
    res.send(templates.get('new-post-or-edit-post'));
});

app.post('/api/sign-up', (req, res) => {
    api.signUp.createUser(req, res);
});

app.post('/api/new-blog', (req, res) => {
    api.blogs.createNewBlog(req, res);
});

app.get('/api/get-blogs', (req, res) => {
    api.blogs.getBlogs(req, res);
});

app.get('/api/get-blog', (req, res) => {
    api.blogs.getBlog(req, res);
});

app.post('/api/new-post-or-edit-post', (req, res) => {
    api.posts.newPostOrEditPost(req, res);
});

app.get('/api/get-post', (req, res) => {
    api.posts.getPost(req, res);
});

if (!process.env.DEV) {
    app.use('/dist/js/', express.static(path.join(__dirname, 'dist/js/')));
} else {
    app.use('/dist/js/', webpackDevMiddleware(webpackCompiler, {
        publicPath: '',
    }));
}

let port = process.env.PORT || 8080;

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Qblog is listening on port ${port}.`);
});
