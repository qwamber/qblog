let path = require('path');
let express = require('express');
let webpack = require('webpack');
let webpackDevMiddleware = require('webpack-dev-middleware');
let webpackCompiler = webpack(require('./.webpack.config.js'));
let templates = require('./src/util/templates.js');

let app = express();

app.get('/', (req, res) => {
    res.send(templates.get('index')());
});

app.get('/log-in', (req, res) => {
    res.send(templates.get('log-in')());
});

app.get('/sign-up', (req, res) => {
    res.send(templates.get('sign-up')());
});

if (!process.env.DEV) {
    app.use('/dist/js/', express.static(path.join(__dirname, 'dist/js/')));
} else {
    app.use('/dist/js/', webpackDevMiddleware(webpackCompiler, {
        publicPath: '',
    }));
}

let port = process.env.PORT || 8080;

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Qblog is listening on port ${port}.`));
