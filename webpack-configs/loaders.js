import ExtractTextPlugin from 'extract-text-webpack-plugin';

let wpLoaders = [
    {
        // This to avoid warnings on video.js or fubo-vjs-hls.js inclusion
        test: /(video\.js)|(fubo-vjs-hls\.js)/, loader: 'script'
    },
    {
        test: /\.(pug|jade)$/, loader: 'jade'
    },
    {
        test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
    },
    {
        test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap')
    },
    {
        test: /\.js$/, exclude: /node_modules/, loader: 'babel!eslint'

    },
    {
        test: /\.(png|jpg)$/, loader: 'url?limit=25000'
    },
    {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"
    },
    {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"
    },
    {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"
    },
    {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"
    },
    {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"
    }
];

export default wpLoaders;