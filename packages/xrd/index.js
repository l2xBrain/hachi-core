#!/usr/bin/env node
import arg from 'arg';
import comBuild from './cli/build';
import comDev from './cli/dev';
import comStart from './cli/start';
import comInit from './cli/init';


const args = arg(
    {
        // Types
        '--version': Boolean,
        '--help': Boolean,
        '--inspect': Boolean,
    
        // Aliases
        '-v': '--version',
        '-h': '--help',
    },
    {
        permissive: true,
    }
);


const commands = {
    build: comBuild,
    dev: comDev,
    start: comStart,
    init: comInit
}

const defaultCommand = 'dev';
const foundCommand = Boolean(commands[args._[0]])

const command = foundCommand ? args._[0] : defaultCommand;
const forwardedArgs = foundCommand ? args._.slice(1) : args._;
const defaultEnv = command === 'dev' ? 'development' : 'production';
process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv

commands[command](forwardedArgs);

