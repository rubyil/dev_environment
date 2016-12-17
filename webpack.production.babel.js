import BitBarWebpackProgressPlugin from 'bitbar-webpack-progress-plugin';
import path from 'path';
import autoprefixer from 'autoprefixer';
import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';
import NoErrorsPlugin from 'webpack/lib/NoErrorsPlugin';
import HotModuleReplacementPlugin from 'webpack/lib/HotModuleReplacementPlugin';
import DefinePlugin from 'webpack/lib/DefinePlugin';
import UglifyJsPlugin from 'webpack/lib/optimize/UglifyJsPlugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ShellPlugin from 'webpack-shell-plugin';

export default {
    context: path.join(__dirname, 'src'),
    entry: {
        init: './init.js',
        vendor: []
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]-[hash].min.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: /src/,
                loaders: ['ng-annotate', 'babel-loader']
            },
            {
                test: /\.scss$/,
                include: /(src|node_modules)/,
                loader: ExtractTextPlugin.extract(
                    'style-loader',
                    'css-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]!' +
                    'postcss-loader' +
                    '!sass-loader?outputStyle=expanded&' +
                    'includePaths[]=' + path.join(__dirname, 'node_modules')
                )
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                loader: "url-loader?limit=100000"
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                // loader: 'raw'
                loader: 'html?attrs=false'
            },
        ]
    },
    postcss: [
        autoprefixer({ browsers: ['last 2 versions'] })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        inline: true,
        stats: 'errors-only'
    },
    plugins: [
        new BitBarWebpackProgressPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
            hash: true
        }),
        new ExtractTextPlugin('[name]-[hash].min.css'),
        new HotModuleReplacementPlugin(),
        new NoErrorsPlugin(),
        new CommonsChunkPlugin({
            minChunks: 2,
            name: ['commons', 'vendor', 'bootstrap']
        }),
        new ExtractTextPlugin('[name].css'),
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
            compress: {
                drop_console: true
            },
            mangle: true
        })
    ],
    debug: false,
    devtool: 'source-map'
}