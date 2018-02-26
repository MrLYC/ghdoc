const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "style.[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

var plugins = [
    new HtmlWebpackPlugin({
        template: './src/html/index.html',
        hash: true,
    }),
    extractSass,
]
if (process.env.NODE_ENV !== "development") {
    plugins.push(new MinifyPlugin());
    plugins.push(new UglifyJsPlugin());
    plugins.push(new OptimizeCssAssetsPlugin());
}

module.exports = {
    entry: [
        './src/js/index.js',
        './src/css/index.scss',
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: './dist',
        host: process.env.IP || 'localhost',
        port: process.env.PORT || 8080,
        allowedHosts: [process.env.ALLOWED_HOST || "localhost"],
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js'
        }
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader",
                    options: {
                        minimize: true,
                    },
                }, {
                    loader: "sass-loader",
                    options: {
                        includePaths: [
                            path.resolve(__dirname, 'node_modules'),
                        ],
                    },
                }],
                fallback: "style-loader",
            }),
        }],
    },
    plugins: plugins,
};