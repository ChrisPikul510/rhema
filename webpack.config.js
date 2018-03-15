var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, "src/index.js"),
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, "lib"),
        filename: 'rhema.js',
        library: 'rhema',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    modules: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ]
    },
    resolve: {
        root: path.resolve(__dirname, 'src'),
        extensions: ['.js']
    }
};