const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/app.js',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html',
        }),
        new CopyPlugin({
            patterns: [
                { 
                    from: './src/training-tasks/*.md', 
                    to: 'training-tasks/[name][ext]', 
                },
                {
                    from: path.resolve(__dirname, 'node_modules/@shoelace-style/shoelace/dist/assets'),
                    to: path.resolve(__dirname, 'build/shoelace/assets')
                }
            ],
        })
    ],
    module: {
        rules: [
            {
                test: /\.md$/,
                use: ['html-loader', 'markdown-loader'],
            },
        ],
    },
}