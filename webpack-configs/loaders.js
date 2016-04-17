let wpLoaders = [
    {
        // This to avoid warnings on video.js or fubo-vjs-hls.js inclusion
        test: /(video\.js)|(fubo-vjs-hls\.js)/,
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
        loader: 'babel!eslint'

    }
];

export default wpLoaders;