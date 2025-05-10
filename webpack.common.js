const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    plugins: [new HtmlWebpackPlugin({
        template: './src/template.html',
    })],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.md$/,
                use: ['html-loader', 'markdown-loader'],
            },
        ]
    },
}