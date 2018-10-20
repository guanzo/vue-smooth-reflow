"use strict";
const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    entry: [
        "./src/polyfills",
        "./src/vue-smooth-reflow.ts"
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "vue-smooth-reflow.min.js",
        library: "SmoothReflow",
        libraryTarget: "umd",
        libraryExport: "default",
        // Workaround for webpack 4 umd bug (Ref: https://github.com/webpack/webpack/issues/6522)
        globalObject: "typeof self !== 'undefined' ? self : this"
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            generateStatsFile: true,
            openAnalyzer: false,
            reportFilename: "../dist-report/webpack-report.html",
            statsFilename: "../dist-report/webpack-stats.json",
        })
    ]
};
