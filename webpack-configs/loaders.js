let wpLoaders = [
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
];

export default wpLoaders;