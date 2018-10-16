/* eslint-disable */
const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'vue-smooth-reflow.min.js',
        library:'SmoothReflow',
        libraryTarget: 'umd',
        libraryExport: 'default',
        // Workaround for webpack 4 umd bug (Ref: https://github.com/webpack/webpack/issues/6522)
        globalObject: "typeof self !== 'undefined' ? self : this"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', {
                            targets: {
                                browsers: ['last 2 versions', 'safari >= 9', '> 1%', 'IE 11']
                            },
                            useBuiltIns: 'usage'
                        }]],
                        babelrc: false
                    }
                }
            }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            generateStatsFile: true,
            openAnalyzer: false,
            reportFilename: '../dist-report/webpack-report.html',
            statsFilename: '../dist-report/webpack-stats.json',
        })
    ]
}

module.exports = config
