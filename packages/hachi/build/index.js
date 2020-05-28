import path from 'path';
import chalk from 'chalk';
import loadConfig from '../server/config';
import {
    findPagesMapDir,
    collectPages
} from './utils'
import { createEntrypoints } from './entries';
import getBaseWebpackConfig from './webpack-config';
import { runCompiler } from './compiler';
import { SERVER_DIRECTORY, PAGES_MANIFEST } from '../lib/constants';
import formatWebpackMessages from './format-webpack-messages';

export default async function build(dir) {
    const config = loadConfig(dir);
    const distDir = path.join(dir, config.distDir)
    const pagesMapDir = findPagesMapDir(dir);
    
    const mappedPages = await collectPages(pagesMapDir, dir);
    const entrypoints = createEntrypoints(false, mappedPages, 'server', config);
    console.log('entrypoints', entrypoints);
    const webpackConfigs = await Promise.all([
        getBaseWebpackConfig(dir, {config, target: 'client', entrypoints: entrypoints.client}),
        getBaseWebpackConfig(dir, {config, target: 'server', entrypoints: entrypoints.server}),
    ])
    let result = await runCompiler(webpackConfigs);
    result = formatWebpackMessages(result)
    if (result.errors.length > 0) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (result.errors.length > 1) {
          result.errors.length = 1
        }
        const error = result.errors.join('\n\n')
    
        console.error(chalk.red('Failed to compile.\n'))
        console.error(error)
        throw new Error('> Build failed because of webpack errors')
    } else {
        if (result.warnings.length > 0) {
          console.warn(chalk.yellow('Compiled with warnings.\n'))
          console.warn(result.warnings.join('\n\n'))
          console.warn()
        } else {
          console.log(chalk.green('Compiled successfully.\n'))
        }
    }
    // const manifestPath = path.join(distDir, SERVER_DIRECTORY, PAGES_MANIFEST)

    
    
}