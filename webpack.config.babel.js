import BitBarWebpackProgressPlugin from 'bitbar-webpack-progress-plugin';
import path from 'path';
import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';
import NoErrorsPlugin from 'webpack/lib/NoErrorsPlugin';
import HotModuleReplacementPlugin from 'webpack/lib/HotModuleReplacementPlugin';
import DefinePlugin from 'webpack/lib/DefinePlugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ShellPlugin from 'webpack-shell-plugin';

export default {
    context: path.join(__dirname, 'src'),
    entry: {
        init: './init.js',
        vendor: []
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
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
                include: /src/,
                loaders: [
                    'style-loader',
                    'css-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]',
                    'sass-loader?outputStyle=expanded&' +
                    'includePaths[]=' + path.join(__dirname + 'node_modules')
                ]
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
            }
        ]
    },
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
        new HotModuleReplacementPlugin(),
        new NoErrorsPlugin(),
        new CommonsChunkPlugin({
            minChunks: 2,
            name: ['commons', 'vendor', 'bootstrap']
        }),
        new ShellPlugin({
            onBuildStart: ['echo "Starting Webpack..."', 'echo "Cleaning build folder..."', 'rm -rf dist']
        }),
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    debug: true,
    devtool: 'eval-source-map'
}