const path = require('path');
const {babelClientOpts, babelServerOpts} = require('./babel-config');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
import BuildManifestPlugin from '../webpack/plugins/build-manifest-plugin';
import PagesManifestPlugin from '../webpack/plugins/pages-manifest-plugin';
import RoutesManifestPlugin from '../webpack/plugins/routes-manifest-plugin';
const { REACT_LOADABLE_MANIFEST } = require('../lib/constants');

export default async function getBaseWebpackConfig(
    dir,
    {
        config,
        target = 'server',
        entrypoints
    }
) {
    const distDir = path.join(dir, config.distDir)
    const plugins = [];
    const output = {}
    const optimization = {};
    if (target === 'server') {
        output.libraryTarget = 'commonjs2'
        output.path = path.join(distDir, 'server');
        plugins.push(new CleanWebpackPlugin())
        // plugins.push(new PagesManifestPlugin())
        plugins.push(new CopyPlugin({
            patterns: [
                {from: path.join(__dirname, '../server/pages'), to: output.path}
            ]
        }))
    } else {
        output.path = distDir;
        plugins.push(new CleanWebpackPlugin())
        // plugins.push(new BuildManifestPlugin())
        optimization.splitChunks = {
            maxAsyncRequests: 1,
            cacheGroups: {
                vendor: {
                    chunks: "all",
                    name: "vendor",
                    priority: 10,
                    enforce: true,
                },
            }
        };
        optimization.runtimeChunk = {
            name: 'manifest'
        };
    }
    
    return {
        entry: {
            ...entrypoints
        },
        target: target === 'server' ? 'node' : 'web',
        output: {
            filename: '[name].js',
            ...output
        },
        resolve: {
            alias: {
                ha: process.cwd()
            },
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
        mode: 'development',
        externals: {
        },
        module: {
            rules: [{
                    test: /\.jsx?$/,
                    exclude: [/node_modules/],
                    use: [
                        // 'thread-loader',
                        {
                            loader: 'babel-loader',
                            options: target === 'server' ? babelServerOpts : babelClientOpts
                        },
                    ]
                }, {
                    test: /\.less$/,
                    use: [
                        // 'thread-loader',
                        'style-loader', 'css-loader', 
                        {
                            loader: 'less-loader',
                            options: {
                                javascriptEnabled: true
                            }
                        }
                    ]
                }, {
                    test: /\.(png|jpg|gif|ico)$/,
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[hash:7].[ext]'
                    }
                }, {
                    test: /\.(woff|eot|ttf|woff2|svg)(\?.*)?$/,
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[hash:7].[ext]'
                    }
                }]
        },
        plugins: [
            ...plugins,
        ],
        optimization,
    }
}