const path = require('path');
const common = require('./webpack.common');
const {merge} = require('webpack-merge');

module.exports = merge(common, {
    mode: 'production',
    entry: './src/app.js',
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
    },
})