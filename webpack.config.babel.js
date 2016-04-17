'use strict';

const TARGET = process.env.npm_lifecycle_event;

import Webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

import wpLoaders from './webpack-configs/loaders';
import uglifyJsOptions from './webpack-configs/uglify-js-options';

import _ from 'lodash';

// Resolve all packages from package.json file
let vendorDepList = _(require('./package.json').dependencies)
    .keys()
    .pull('font-awesome', 'include-media', 'moment-timezone')  // Should be included differently
    .value();

let webpackConfig = {
    entry: {
        vendor: vendorDepList,
        app: './app.js'
    },
    output: {
        path: TARGET === 'serve' ? 'serve' : 'build',
        filename: 'app-[hash].js'
    },
    module: {
        loaders: wpLoaders
    },
    plugins: [
        new CleanWebpackPlugin('build'),
        new HtmlWebpackPlugin({
            inject: 'head',
            minify: false,
            template: './src/app/index.jade'
        }),
        // Needed to offload HLS.js to worker (specific wp implementation) instead of main loop
        new Webpack.NormalModuleReplacementPlugin(/^webworkify$/, 'webworkify-webpack'),
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor-[hash].js'
        }),
        new Webpack.optimize.OccurrenceOrderPlugin(true),
        new Webpack.optimize.DedupePlugin(),
        new Webpack.optimize.AggressiveMergingPlugin(),
        TARGET === 'build' ? new Webpack.optimize.UglifyJsPlugin(uglifyJsOptions) : _.noop,
        TARGET === 'serve' ? new Webpack.HotModuleReplacementPlugin() : _.noop
    ],
    resolve: {
        modulesDirectories: ['node_modules'],
        alias: {
            // TODO: css file should also be included
            'angular-carousel': 'angular-carousel/dist/angular-carousel.js'
        }
    },
    devServer: {
        contentBase: 'serve',
        // Enable history API fallback so HTML5 History API based
        // routing works. This is a good default that will come
        // in handy in more complicated setups.
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,

        // Display only errors to reduce the amount of output.
        stats: 'errors-only',

        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || 9000
    }

};

export default webpackConfig;