"use strict";exports.__esModule=true;exports.htmlEscapeJsonString=htmlEscapeJsonString;exports.middleware=middleware;exports.HaScript=exports.Main=exports.Head=exports.Html=exports.default=exports.DocumentComponentContext=void 0;var _propTypes=_interopRequireDefault(require("prop-types"));var _react=_interopRequireWildcard(require("react"));function _getRequireWildcardCache(){if(typeof WeakMap!=="function")return null;var cache=new WeakMap();_getRequireWildcardCache=function(){return cache;};return cache;}function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}if(obj===null||typeof obj!=="object"&&typeof obj!=="function"){return{default:obj};}var cache=_getRequireWildcardCache();if(cache&&cache.has(obj)){return cache.get(obj);}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc);}else{newObj[key]=obj[key];}}}newObj.default=obj;if(cache){cache.set(obj,newObj);}return newObj;}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const ESCAPE_LOOKUP={'&':'\\u0026','>':'\\u003e','<':'\\u003c','\u2028':'\\u2028','\u2029':'\\u2029'};const ESCAPE_REGEX=/[&><\u2028\u2029]/g;function htmlEscapeJsonString(str){return str.replace(ESCAPE_REGEX,match=>ESCAPE_LOOKUP[match]);}const DocumentComponentContext=/*#__PURE__*/_react.default.createContext();exports.DocumentComponentContext=DocumentComponentContext;async function middleware({req,res}){}function dedupe(bundles){const files=new Set();const kept=[];for(const bundle of bundles){if(files.has(bundle.file))continue;files.add(bundle.file);kept.push(bundle);}return kept;}/**
 * `Document` component handles the initial `document` markup and renders only on the server side.
 * Commonly used for implementing server side rendering for `css-in-js` libraries.
 */class Document extends _react.Component{/**
   * `getInitialProps` hook returns the context object with the addition of `renderPage`.
   * `renderPage` callback executes `React` rendering logic synchronously to support server-rendering wrappers
   */static async getInitialProps(ctx){const enhanceApp=App=>{return props=>/*#__PURE__*/_react.default.createElement(App,props);};const{html,head}=await ctx.renderPage({enhanceApp});const styles=[];return{html,head,styles};}static renderDocument(Document,props){return/*#__PURE__*/_react.default.createElement(DocumentComponentContext.Provider,{value:{_documentProps:props,// In dev we invalidate the cache by appending a timestamp to the resource URL.
// This is a workaround to fix https://github.com/zeit/ha.js/issues/5860
// TODO: remove this workaround when https://bugs.webkit.org/show_bug.cgi?id=187726 is fixed.
_devOnlyInvalidateCacheQueryString:process.env.NODE_ENV!=='production'?'?ts='+Date.now():''}},/*#__PURE__*/_react.default.createElement(Document,props));}render(){return/*#__PURE__*/_react.default.createElement(Html,null,/*#__PURE__*/_react.default.createElement(Head,null),/*#__PURE__*/_react.default.createElement("body",null,/*#__PURE__*/_react.default.createElement(Main,null),/*#__PURE__*/_react.default.createElement(HaScript,null)));}}exports.default=Document;class Html extends _react.Component{render(){const{htmlProps}=this.context._documentProps;return/*#__PURE__*/_react.default.createElement("html",Object.assign({},htmlProps,this.props));}}exports.Html=Html;Html.contextType=DocumentComponentContext;Html.propTypes={children:_propTypes.default.node.isRequired};class Head extends _react.Component{getCssLinks(){const{files}=this.context._documentProps;const cssFiles=files&&files.length?files.filter(f=>/\.css$/.test(f)):[];const cssLinkElements=[];cssFiles.forEach(file=>{cssLinkElements.push(/*#__PURE__*/_react.default.createElement("link",{key:`${file}-preload`,nonce:this.props.nonce,rel:"preload",href:`${encodeURI(file)}`,as:"style",crossOrigin:this.props.crossOrigin||process.crossOrigin}),/*#__PURE__*/_react.default.createElement("link",{key:file,nonce:this.props.nonce,rel:"stylesheet",href:`${encodeURI(file)}`,crossOrigin:this.props.crossOrigin||process.crossOrigin}));});return cssLinkElements.length===0?null:cssLinkElements;}render(){const{styles,assetPrefix,page,headTags,unstable_runtimeJS}=this.context._documentProps;const disableRuntimeJS=unstable_runtimeJS===false;const{_devOnlyInvalidateCacheQueryString}=this.context;let{head}=this.context._documentProps;let children=this.props.children;// show a warning if Head contains <title> (only in development)
if(process.env.NODE_ENV!=='production'){children=_react.default.Children.map(children,child=>{var _child$props;const isReactHelmet=child===null||child===void 0?void 0:(_child$props=child.props)===null||_child$props===void 0?void 0:_child$props['data-react-helmet'];if((child===null||child===void 0?void 0:child.type)==='title'&&!isReactHelmet){console.warn("Warning: <title> should not be used in _document.js's <Head>. https://err.sh/ha.js/no-document-title");}return child;});if(this.props.crossOrigin)console.warn('Warning: `Head` attribute `crossOrigin` is deprecated. https://err.sh/ha.js/doc-crossorigin-deprecated');}let hasAmphtmlRel=false;let hasCanonicalRel=false;// show warning and remove conflicting amp head tags
head=_react.default.Children.map(head||[],child=>{if(!child)return child;const{type,props}=child;// non-amp mode
if(type==='link'&&props.rel==='amphtml'){hasAmphtmlRel=true;}return child;});// try to parse styles from fragment for backwards compat
const curStyles=Array.isArray(styles)?styles:[];return/*#__PURE__*/_react.default.createElement("head",this.props,this.context._documentProps.isDevelopment&&/*#__PURE__*/_react.default.createElement(_react.default.Fragment,null,/*#__PURE__*/_react.default.createElement("style",{"data-next-hide-fouc":true,dangerouslySetInnerHTML:{__html:`body{display:none}`}}),/*#__PURE__*/_react.default.createElement("noscript",{"data-next-hide-fouc":true},/*#__PURE__*/_react.default.createElement("style",{dangerouslySetInnerHTML:{__html:`body{display:block}`}}))),children,head,/*#__PURE__*/_react.default.createElement("meta",{name:"next-head-count",content:_react.default.Children.count(head||[]).toString()}),this.getCssLinks(),this.context._documentProps.isDevelopment&&/*#__PURE__*/ // this element is used to mount development styles so the
// ordering matches production
// (by default, style-loader injects at the bottom of <head />)
_react.default.createElement("noscript",{id:"__next_css__DO_NOT_USE__"}),styles||null,/*#__PURE__*/_react.default.createElement(_react.default.Fragment,{},...(headTags||[])));}}exports.Head=Head;Head.contextType=DocumentComponentContext;Head.propTypes={nonce:_propTypes.default.string,crossOrigin:_propTypes.default.string};class Main extends _react.Component{render(){const{children}=this.context._documentProps;return/*#__PURE__*/_react.default.createElement("div",{id:"__ha",dangerouslySetInnerHTML:{__html:children}});}}exports.Main=Main;Main.contextType=DocumentComponentContext;class HaScript extends _react.Component{// Source: https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc
getScripts(){const{files}=this.context._documentProps;const normalScripts=files.filter(file=>file&&file.publicPath.endsWith('.js')).map(file=>file.publicPath);return Array.from(new Set(normalScripts)).map(publicPath=>{return/*#__PURE__*/_react.default.createElement("script",{key:publicPath,src:`${encodeURI(publicPath)}`,nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin});});}render(){const{PRELOADED_STATE}=this.context._documentProps;const preloadedState=JSON.stringify(encodeURIComponent(JSON.stringify(PRELOADED_STATE||{})));if(process.env.NODE_ENV!=='production'){if(this.props.crossOrigin)console.warn('Warning: `HaScript` attribute `crossOrigin` is deprecated. https://err.sh/ha.js/doc-crossorigin-deprecated');}return/*#__PURE__*/_react.default.createElement(_react.default.Fragment,null,/*#__PURE__*/_react.default.createElement("script",{nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin,noModule:true,dangerouslySetInnerHTML:{__html:HaScript.safariNomoduleFix}}),/*#__PURE__*/_react.default.createElement("script",{nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.crossOrigin,dangerouslySetInnerHTML:{__html:'var __PRELOADED_STATE__ ='+preloadedState}}),this.getScripts());}}exports.HaScript=HaScript;HaScript.contextType=DocumentComponentContext;HaScript.propTypes={nonce:_propTypes.default.string,crossOrigin:_propTypes.default.string};HaScript.safariNomoduleFix='!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();';function getPageFile(page,buildId){const startingUrl=page==='/'?'/index':page;return buildId?`${startingUrl}.${buildId}.js`:`${startingUrl}.js`;}