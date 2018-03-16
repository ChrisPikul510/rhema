var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, "src/index.js"),
    target: 'node',
    devtool: 'source-map',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, "lib"),
        filename: 'rhema.js',
        library: 'rhema',
        libraryTarget: 'umd',
        //umdNamedDefine: true
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }
        ]
    },
    resolve: {
        modules: [ path.resolve(__dirname, 'src'), "node_modules"],
        extensions: ['.js']
    }
};