const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDevEnv = process.env.NODE_ENV === "development";

const extractSass = new ExtractTextPlugin({
    filename: isDevEnv ? '[name].style.css' : '[name].min.css',
    disable: isDevEnv,
});

var plugins = [
    extractSass,
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/html/index.html',
        hash: true,
        title: process.env.TITLE || 'Ghdoc',
        favicon: process.env.FAVICON || 'favicon.ico',
    }),
    new webpack.optimize.CommonsChunkPlugin({
        async: true,
        names: ["app"],
    })
]
if (!isDevEnv) {
    plugins.push(new MinifyPlugin());
    plugins.push(new UglifyJsPlugin());
    plugins.push(new OptimizeCssAssetsPlugin());
}

module.exports = {
    entry: {
        app: './src/js/index.js',
        style: './src/css/index.scss',
    },
    output: {
        filename: isDevEnv ? '[name].bundle.js' : '[name].min.js',
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
