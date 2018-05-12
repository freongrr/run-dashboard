/* eslint-disable no-undef */

const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const FlowtypePlugin = require("flowtype-loader/plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackIncludeAssetsPlugin = require("html-webpack-include-assets-plugin");

const APP_DIR = path.resolve(__dirname, "src/main/es");
const BUILD_DIR = module.exports.BUILD_DIR = path.resolve(__dirname, "src/main/webapp");

// TODO : clean-webpack-plugin uses deprecated APIs. Replace or remove?

const copyAssets = [
    {from: "node_modules/bootstrap/dist/css", to: "css"},
    {from: "node_modules/bootstrap/dist/fonts", to: "fonts"},
    {from: "node_modules/d3/dist/d3.min.js", to: "js"},
    {from: "node_modules/c3/c3.min.js", to: "js"},
    {from: "node_modules/c3/c3.min.css", to: "css"}
];

const includeAssets = [
    "css/bootstrap.min.css",
    "js/c3.min.js",
    "js/d3.min.js",
    "css/c3.min.css"
];

module.exports = {
    entry: APP_DIR + "/main.js",
    output: {
        path: BUILD_DIR,
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    "source-map-loader",
                    "flowtype-loader"
                ],
                enforce: "pre"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    "babel-loader",
                    "eslint-loader"
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader?sourceMap",
                    "css-loader?sourceMap",
                    "sass-loader?sourceMap"
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([BUILD_DIR + "/*.*"]),
        new FlowtypePlugin(),
        new CopyWebpackPlugin(copyAssets, {ignore: [".DS_Store"]}),
        new HtmlWebpackPlugin({template: APP_DIR + "/index.html"}),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: includeAssets,
            append: false
        })
    ],
    devServer: {
        host: "0.0.0.0",
        port: 8282,
        disableHostCheck: true,
        proxy: [{
            context: ["/api"],
            target: "http://localhost:8080"
        }]
    }
};
