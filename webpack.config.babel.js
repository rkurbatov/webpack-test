'use strict';

import Webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

import _ from 'lodash';

// Resolve all packages from package.json file
let vendorDepList = _(require('./package.json').dependencies)
    .keys()
    .pull('font-awesome', 'include-media', 'moment-timezone')  // Should be included differently
    .value();

const webpackConfig = {
    entry: {
        vendor: vendorDepList,
        app: './app.js'
    },
    output: {
        path: 'dist',
        filename: 'app-[hash].js'
    },
    module: {
        loaders: [
            {
                test: /video\.js/,      // This to avoid warnings on video.js inclusion
                loader: 'script'
            },
            {
                test: /\.jade$/,
                loader: 'jade'
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin('dist'),
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
        /*new Webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false,
                properties: true,
                sequences: true,
                dead_code: true,
                conditionals: true,
                comparisons: true,
                evaluate: true,
                booleans: true,
                unused: true,
                loops: true,
                hoist_funs: true,
                cascade: true,
                if_return: true,
                join_vars: true,
                drop_debugger: true,
                negate_iife: true,
                unsafe: true,
                hoist_vars: true
            },
            mangle: {
                except: ['exports', 'require'],
                toplevel: true,
                sort: true,
                eval: true,
                properties: true
            },
            output: {
                space_colon: false,
                comments: false
            }
        }),*/
        new Webpack.NormalModuleReplacementPlugin(/^webworkify$/, 'webworkify-webpack'),
        _.noop
    ],
    resolve: {
        modulesDirectories: ['node_modules'],
        alias: {
            // TODO: css file should also be included
            'angular-carousel': 'angular-carousel/dist/angular-carousel.js',

            // To use source instead of prebuild version and so avoid warning
            'videojs-hls.js': 'videojs-hls.js/lib/vjs-hls.js'
        }
    }
};

export default webpackConfig;