let path = require('path');
let express = require('express');
let bodyParser = require('body-parser');
let webpack = require('webpack');
let webpackDevMiddleware = require('webpack-dev-middleware');
let webpackCompiler = webpack(require('./.webpack.config.js'));
let templates = require('./api/util/templates.js');
let api = require('./api/util/api-exports.js');

let app = express();
let wwwRouter = express.Router();
let blogRouter = express.Router();
let anyRouter = express.Router();

anyRouter.use(bodyParser.json());

wwwRouter.get('/', (req, res) => {
    res.send(templates.get('index'));
});

wwwRouter.get('/log-in', (req, res) => {
    res.send(templates.get('log-in'));
});

wwwRouter.get('/sign-up', (req, res) => {
    res.send(templates.get('sign-up'));
});

wwwRouter.get('/main', (req, res) => {
    res.send(templates.get('main'));
});

wwwRouter.get('/new-blog', (req, res) => {
    res.send(templates.get('new-blog'));
});

wwwRouter.get('/edit-blog', (req, res) => {
    res.send(templates.get('edit-blog'));
});

wwwRouter.get('/new-post-or-edit-post', (req, res) => {
    res.send(templates.get('new-post-or-edit-post'));
});

blogRouter.get('', (req, res) => {
    res.send(templates.get('view-blog'));
});

anyRouter.post('/api/sign-up', (req, res) => {
    api.signUp.createUser(req, res);
});

anyRouter.post('/api/new-blog', (req, res) => {
    api.blogs.createNewBlog(req, res);
});

anyRouter.get('/api/get-blogs', (req, res) => {
    api.blogs.getBlogs(req, res);
});

anyRouter.get('/api/get-blog', (req, res) => {
    api.blogs.getBlog(req, res);
});

anyRouter.post('/api/new-post-or-edit-post', (req, res) => {
    api.posts.newPostOrEditPost(req, res);
});

anyRouter.get('/api/get-post', (req, res) => {
    api.posts.getPost(req, res);
});

if (!process.env.DEV) {
    anyRouter.use(
        '/dist/js/',
        express.static(path.join(__dirname, 'dist/js/')),
    );
} else {
    anyRouter.use('/dist/js/', webpackDevMiddleware(webpackCompiler, {
        publicPath: '',
    }));
}

let port = process.env.PORT || 8080;

/*
    `www` should be the main page, and everything else should be a blog
    subdomain.
 */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    next();
});
app.use(anyRouter);
app.use((req, res, next) => {
    if (req.subdomains[0] === 'www') {
        wwwRouter(req, res, next);
    } else {
        next();
    }
});
app.use((req, res, next) => {
    if (req.subdomains[0] !== 'www') {
        blogRouter(req, res, next);
    } else {
        next();
    }
});

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Qblog is listening on port ${port}.`);
});
