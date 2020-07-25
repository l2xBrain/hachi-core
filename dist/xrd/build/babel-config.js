"use strict";exports.__esModule=true;exports.babelServerOpts=exports.babelClientOpts=void 0;const babelClientOpts={presets:['@babel/preset-typescript',['@babel/preset-env',{// modules: 'commonjs',
//   targets: {
//     esmodules: true,
//   },
//   bugfixes: true,
//   loose: true,
// exclude: [
//   'transform-typeof-symbol',
//   'transform-async-to-generator',
//   'transform-spread',
// ],
}],['@babel/preset-react',{useBuiltIns:true}]],plugins:[// workaround for @taskr/esnext bug replacing `-import` with `-require(`
// eslint-disable-next-line no-useless-concat
'react-loadable/babel','@babel/plugin-syntax-dynamic-import',['@babel/plugin-proposal-class-properties',{loose:true}]]};exports.babelClientOpts=babelClientOpts;const babelServerOpts={presets:['@babel/preset-typescript',['@babel/preset-react',{useBuiltIns:true}],['@babel/preset-env',{modules:'commonjs',targets:{node:'8.3'},loose:true,exclude:['transform-typeof-symbol','transform-async-to-generator','transform-spread']}]],plugins:['react-loadable/babel','@babel/plugin-proposal-optional-chaining','@babel/plugin-proposal-nullish-coalescing-operator','dynamic-import-node',['@babel/plugin-proposal-class-properties',{loose:true}]]};exports.babelServerOpts=babelServerOpts;