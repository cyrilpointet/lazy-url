module.exports = {
    entry: {
        main: [
            '@babel/polyfill',
            './src/index.js',
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};
