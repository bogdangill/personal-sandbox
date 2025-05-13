const path = require('path');
const common = require('./webpack.common');
const {merge} = require('webpack-merge');

module.exports = merge(common, {
    mode: 'development',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    'style-loader', //3 извлекает цсс в файл
                    'css-loader', //2 превращает цсс в cjs
                    'sass-loader' //1 сасс превращается в обычный цсс
                ]
            },
        ]
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        watchFiles: ['src/**/*.html'], // следить за html-файлами
        hot: false, // отключить HMR для HTML, т.к. нужно перезагружать страницу
        liveReload: true,
    },
});