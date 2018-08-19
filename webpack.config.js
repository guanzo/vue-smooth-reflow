/* eslint-disable */
const path = require('path');
const webpack = require('webpack')
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const commonConfig = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(parse-css-transition)\/).*/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        babelrc: false
                    }
                }
            }
        ]
    }
}

module.exports = [
    merge(commonConfig, {
        mode: 'production',
        output: {
            filename: 'vue-smooth-height.min.js',
            library:'SmoothHeight',
            libraryTarget: 'window',
            libraryExport: "default"
        },
        plugins:[
            new UglifyJSPlugin(),
        ]
    }),
    merge(commonConfig, {
        mode: 'development',
        devtool: 'nosources-source-map',
        output: {
            filename: 'vue-smooth-height.js',
            libraryTarget: 'umd',
            library:'vue-smooth-height',
        }
    }),
]
