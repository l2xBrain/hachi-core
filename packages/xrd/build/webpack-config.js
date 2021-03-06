const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge')
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
import BuildEntryPlugin from '../webpack/plugins/build-entry-plugin';
const { REACT_LOADABLE_MANIFEST } = require('../lib/constants');

export default async function getBaseWebpackConfig(
    dir,
    {
        config,
        target = 'server',
        entrypoints,
        dev = false
    }
) {
    const distDir = path.join(dir, config.distDir)
    const customeWebpackConfig = config.webpack({dev, target});
    if (target === 'server') {
        return merge(getCommonConfig(entrypoints, target, dev), getServerConfig(distDir, dev), customeWebpackConfig)
    }
    return merge(getCommonConfig(entrypoints, target, dev), getClientConfig(distDir, dev), customeWebpackConfig);
}

function getCommonConfig(entrypoints, target, dev) {
    return {
        entry: entrypoints,
        target: target === 'server' ? 'node' : 'web',
        output: {
            filename: dev ? '[name].js' : target === 'server' ? '[name].js' : '[name].[chunkhash].js',
            publicPath: '/dist/',
        },
        resolve: {
            alias: {
                __root: process.cwd(),
                'xrd/document': path.resolve(__dirname, '../server/pages/_document')
            },
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
        node: {
            __dirname: true
        },
        mode: dev ? 'development' : 'production',
        
    }
}

function getServerConfig(distDir) {
    const outputPath = path.join(distDir, 'server');
    return {
        output: {
            libraryTarget: 'commonjs2',
            path: outputPath
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyPlugin({
                patterns: [
                    {from: path.join(__dirname, '../server/pages'), to: outputPath}
                ]
            }),
            new webpack.DefinePlugin({
                __IS_SERVER__: JSON.stringify(true)
            })
        ]
    }
}

function getClientConfig(distDir, dev) {
    const config = {
        output: {
            path: distDir
        },
        plugins: [
            new CleanWebpackPlugin(),
            new BuildEntryPlugin(),
            new webpack.DefinePlugin({
                __IS_SERVER__: JSON.stringify(false)
            }),
            new ReactLoadablePlugin({
                filename: path.resolve(distDir, REACT_LOADABLE_MANIFEST),
            })
        ],
        optimization: {
            runtimeChunk: {
                name: 'runtime'
            }
        }
    }
    if (dev) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin())
    }
    return config;
}