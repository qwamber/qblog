const path = require('path');

module.exports = {
    entry: {
        'index': './src/js/index.js',
        'sign-up': './src/js/sign-up.js',
        'log-in': './src/js/log-in.js',
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
        ],
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
};
