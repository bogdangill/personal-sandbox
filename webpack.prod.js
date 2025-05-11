const path = require('path');
const common = require('./webpack.common');
const {merge} = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {PurgeCSSPlugin} = require('purgecss-webpack-plugin');
const glob = require('glob');

const PATHS = {
    build: path.join(__dirname, "build"),
};

module.exports = merge(common, {
    mode: 'production',
    entry: './src/app.js',
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.[contenthash].css'
        }),
        new PurgeCSSPlugin({
            paths: glob.sync(`${PATHS.build}/**/*`, { nodir: true }),
            safelist: [
                /^hljs-/
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader, //2 извлекает цсс в файл
                    'css-loader' //1 превращает цсс в cjs
                ]
            },
        ]
    },
})