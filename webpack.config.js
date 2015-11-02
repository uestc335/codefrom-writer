module.exports = {
    entry: [
        './src/editor.es6'
    ],
    output: {
        filename: 'main.js',
        publicPath: 'build/',
        path: './build'
    },
    module: {
        loaders: [
            {
                test: /\.(jsx|es6)$/,
                loader: 'babel-loader'
            }, {
                test: /\.less/,
                loader: 'style-loader!css-loader!less-loader'
            }, {
                test: /\.(css)$/,
                loader: 'style-loader!css-loader'
            }, {
                test: /\.(png|jpg|woff|woff2|eot|ttf|svg)[\?.*$]?/,
                loader: 'url-loader?limit=8192'
            }
        ]
    }
};