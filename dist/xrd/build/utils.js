"use strict";exports.__esModule=true;exports.findPagesMapDir=findPagesMapDir;exports.collectPages=collectPages;exports.collectBlockPages=collectBlockPages;var _path=_interopRequireDefault(require("path"));var _glob=_interopRequireDefault(require("glob"));var _fs=require("fs");var _constants=require("../lib/constants");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function findPagesMapDir(dir){let curDir=_path.default.join(dir,'routes.json');if((0,_fs.existsSync)(curDir))return curDir;curDir=_path.default.join(dir,'src/routes.json');if((0,_fs.existsSync)(curDir))return curDir;// Check one level up the tree to see if the pages directory might be there
if((0,_fs.existsSync)(_path.default.join(dir,'..','pages'))){throw new Error('> No `pages` directory found. Did you mean to run `ha` in the parent (`../`) directory?');}throw new Error("> Couldn't find a `routes.json` file. Please create one under the project root");}async function collectPages(pagesMapDir,dir){const pagesMap=require(pagesMapDir);const urlPagesMap={};Object.keys(pagesMap).map(key=>{if(_constants.BLOCKED_PAGES.includes(key)){urlPagesMap[key]=_path.default.join(dir,pagesMap[key]);return;}urlPagesMap[key]=_glob.default.sync(`${_path.default.join(dir,pagesMap[key])}/{aIndex,aLang,aModel}.*`);});return urlPagesMap;}async function collectBlockPages(pagesMapDir,dir){const pagesMap=require(pagesMapDir);const urlPagesMap={};Object.keys(pagesMap).map(key=>{if(_constants.BLOCKED_PAGES.includes(key)){urlPagesMap[key]=_path.default.join(dir,pagesMap[key]);}});return urlPagesMap;}