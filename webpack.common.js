const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
            ],
        })
    ],
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