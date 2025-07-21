const path = require('path');
const common = require('./webpack.common');
const {merge} = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {PurgeCSSPlugin} = require('purgecss-webpack-plugin');
const glob = require('glob');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
            ],
            variables: true //чищу от неиспользуемых переменных от разных тем фреймворков из под капота
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader, //2 извлекает цсс в файл
                    'css-loader', //2 превращает цсс в cjs
                    'sass-loader' //1 сасс превращается в обычный цсс
                ]
            },
        ]
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin({parallel: true})
        ]
    },
})