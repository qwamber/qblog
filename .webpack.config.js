const path = require('path');

module.exports = {
    entry: {
        'index': './src/js/index.js',
        'sign-up': './src/js/sign-up.js',
        'log-in': './src/js/log-in.js',
        'main': './src/js/main.js',
        'new-blog': './src/js/new-blog.js',
        'edit-blog': './src/js/edit-blog.js',
        'new-post-or-edit-post': './src/js/new-post-or-edit-post.js',
        'view-blog': './src/js/view-blog.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist/js/'),
        publicPath: 'dist/js/',
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'less-loader' }
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                ],
            },
        ],
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
};
