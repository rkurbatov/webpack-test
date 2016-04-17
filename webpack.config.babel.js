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
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor-[hash].js'
        }),
        new Webpack.optimize.OccurrenceOrderPlugin(true),
        new Webpack.optimize.DedupePlugin(),
        new Webpack.optimize.AggressiveMergingPlugin(),
        TARGET === 'build'
            ? new Webpack.optimize.UglifyJsPlugin(uglifyJsOptions)
            : _.noop,
        new Webpack.NormalModuleReplacementPlugin(/^webworkify$/, 'webworkify-webpack')
    ],
    resolve: {
        modulesDirectories: ['node_modules'],
        alias: {
            // TODO: css file should also be included
            'angular-carousel': 'angular-carousel/dist/angular-carousel.js'            
        }
    }
};

export default webpackConfig;