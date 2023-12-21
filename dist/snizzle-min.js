/** Snizzle is advance feature-rich CSS Selector Engine @version 1.3.0 Date: 28 November 2023 02:30 GMT+0530 */
!function(e){var t,n,r,o,i,a,u,s,c,l,f,d,p,m,g,h,x,y,b="snizzle"+1*Date.now(),w=e.document,v={}.hasOwnProperty,N=[],C=N.indexOf,E=N.push,L=(N.pop,N.slice),T=N.concat,A="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped|muted",S="clip|color|cursor|direction|display|fill|filter|font|kerning|marker|mask|stroke|zoomandpan|xml:(?:lang|space|base)|clip-(?:path|rule)|lighting-color|points|d|viewbox|enable-background|fill-(?:opacity|rule)|flood-(?:color|opacity)|glyph-orientation-(?:horizontal|vertical)|image-rendering|stop-(?:color|opacity)|dominant-baseline|x1|x2|y1|y2|cx|cy|r|ry|stroke-(?:dasharray|dashoffset|linecap|linejoin|miterlimit|opacity|width)|text-rendering",k="[\\x20\\t\\r\\n\\f]",R="(?:\\\\[\\da-fA-F]{1,6}[\\x20\\t\\r\\n\\f]?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",$="\\[[\\x20\\t\\r\\n\\f]*("+R+")(?:"+k+"*([*^$|!~]?=)"+k+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+R+"))|)"+k+"*\\]",B=/^(?:input|select|textarea|button)/i,q=/\bapplication\/json\b/,D=/(^\s*,|,$|\s+)/g,z=/^[>+~=<]+$/,I=/^h\d$/i,O=/monospace/i,F=new RegExp("^(?:theme-color|apple-mobile-web-app-status-bar-style|msapplication-TileColor|msapplication-navbutton-color)$","i"),H=/HTML$/i,U=/^[^{]+\{\s*\[native \w/,j=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,M=/^(none)\s*(0s)\s*(ease)\s*(0s).*(running)/,P=new RegExp("^[\\x20\\t\\r\\n\\f]+|((?:^|[^\\\\])(?:\\\\.)*)[\\x20\\t\\r\\n\\f]+$","g"),G=new RegExp("^[\\x20\\t\\r\\n\\f]*([>+~=<]|[\\x20\\t\\r\\n\\f])[\\x20\\t\\r\\n\\f]*"),V=new RegExp("^"+R+"$"),K=new RegExp(k+"+","g"),Q={inlineTag:new RegExp("^(?:img|input|meta|area|keygen|base|link|br|hr|command|col|param|track|wbr)$","i"),bool:new RegExp("^(?:"+A+")$","i"),ID:new RegExp("^#("+R+")"),CLASS:new RegExp("^\\.("+R+")"),TAG:new RegExp("^("+R+"|[*])"),ATTR:new RegExp("^"+$),PSEUDO:new RegExp("^:((?:\\\\[\\da-fA-F]{1,6}[\\x20\\t\\r\\n\\f]?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+)(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|\\[[\\x20\\t\\r\\n\\f]*((?:\\\\[\\da-fA-F]{1,6}[\\x20\\t\\r\\n\\f]?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+)(?:[\\x20\\t\\r\\n\\f]*([*^$|!~]?=)[\\x20\\t\\r\\n\\f]*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|((?:\\\\[\\da-fA-F]{1,6}[\\x20\\t\\r\\n\\f]?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+))|)[\\x20\\t\\r\\n\\f]*\\])*)|.*)\\)|)"),nstag:new RegExp("^(?:svg|g|defs|desc|symbol|use|image|switch|set|circle|ellipse|line|polyline|animatetransform|mpath|foreignobject|linegradient|radialgradient|stop|pattern|polygon|path|text|tspan|textpath|tref|marker|view|rect|animatemotion|font|clippath|mask|filter|cursor|hkern|vkern|(?:font-(face)(?:.*|src|uri|format|name)))$","i"),nsattr:new RegExp("^(?:"+S+")$"),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\([\\x20\\t\\r\\n\\f]*(even|odd|(([+-]|)(\\d*)n|)[\\x20\\t\\r\\n\\f]*(?:([+-]|)[\\x20\\t\\r\\n\\f]*(\\d+)|))[\\x20\\t\\r\\n\\f]*\\)|)","i"),needsContext:new RegExp("^[\\x20\\t\\r\\n\\f]*[>+~=<]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\([\\x20\\t\\r\\n\\f]*((?:-\\d)?\\d*)[\\x20\\t\\r\\n\\f]*\\)|)(?=[^-]|$)","i")};function X(e,t,n,r){var o,i,a,u=t&&t.ownerDocument,c=t?t.nodeType:9;if(n=n||[],"string"!=typeof e||!e||1!==c&&9!==c&&11!==c)return m;if(!r&&((u||t||w)!==m&&p(t),t=t||m,h&&11!==c&&(i=j.exec(e)))){if((o=i[1])&&(9===c&&(a=t.getElementById(o))||u&&(a=u.getElementById(o))))return n.push(a),n;if((o=i[3])&&(a=t.getElementsByClassName(o))||(o=i[2])&&(a=t.getElementsByTagName(e)))return E.apply(n,a),n}return s(e.replace(P,"$1"),t,n,r)}function J(e){return e[b]=!0,e}function W(e){var t=m.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function Y(e){return d((function(t){return"form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.disabled===e||t.disabled!==!e:t.disabled===e:"label"in t&&t.disabled===e}))}function Z(e){return function(t){for(var n,r=[],o=e([],t.length,t),i=o.length;i--;)t[n=o[i]]&&(r[i]=t[n]);return r}}function _(e,t,n){var r=e[n=n||"getAttribute"]&&e[n](t)||e[t];return 2===(r||"").nodeType?r.nodeValue:r}function ee(e){return d((function(t){return"FORM"===t.nodeName&&_(t,"method")===e}))}function te(t,n){return t.style[n]||e.getComputedStyle(t)[n]}function ne(e){return d((function(t){return te(t,"position")==={abs:"absolute",stick:"sticky",fixed:"fix"}[e]}))}function re(e,t){return d((function(n){return(n.nodeName&&n.nodeName.toLowerCase())===t&&n.type===e}))}function oe(e){return d((function(t){return("hidden"===te(t,"visibility")||t.hidden)===e}))}for(t in n=X.support={},X.version="1.3.0",X.expando=b,l=function(e){for(var t=[],n=0,r=e.length;n<r;n++)t.push(e[n]);return t},f=X.flat=(x=N.flat,function(e){return x?N.flat.call(e):T.apply([],e)}),i=X.getText=function(e){var t,n="",r=0,o=e.nodeType;if(o){if(/(?:1|9|11)/.test(o)){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=i(e)}else if(3===o||4===o)return e.nodeValue}else for(;t=e[r++];)n+=i(t);return n},d=X.access=function(e,t){return function(n){var r,o=0,i=n.length,a=[];for("function"==typeof e&&(t=t||e,e=void 0);o<i;o++)(r=t(n[o],o,n,length,[]))&&(e?a.push(r):a.push(n[o]));return f(a)}},a=X.isXML=function(e){var t=e&&e.namespaceURI,n=e&&(e.ownerDocument||e).documentElement;return!H.test(t||n&&n.nodeName||"HTML")},p=X.setDocument=function(e){var t,r=e?e.ownerDocument||e:w;return r!==m&&9===r.nodeType&&r.documentElement?(g=(m=r).documentElement,h=!a(m),n.scope=W((function(e){return g.appendChild(e).appendChild(m.createElement("div")),void 0!==e.querySelectorAll&&!e.querySelectorAll(":scope fieldset div").length})),n.attributes=W((function(e){return e.className="j",!e.getAttribute("className")})),n.getElementsByTagName=W((function(e){return e.appendChild(m.createComment("")),!e.getElementsByTagName("*").length})),n.getElementsByClassName=U.test(m.getElementsByClassName),n.qsa=U.test(m.querySelectorAll),n.getById=W((function(e){return g.appendChild(e).id=b,!m.getElementsByName||!m.getElementsByName(b).length})),o.filter.ID=J((function(e){return d((function(t){return(_(t,"id")||_(t,"id","getAttributeNode"))===e}))})),o.find.TAG=n.getElementsByTagName?function(e,t){return void 0!==t.getElementsByTagName?t.getElementsByTagName(e):t.querySelectorAll(e)}:function(e,t){var n,r=0,o=[],i=t.getElementsByTagName(e);if("*"===e){for(;n=i[r++];)1===n.nodeType&&o.push(n);return o}return i},o.find.CLASS=function(e,t){if(h)return void 0!==t.getElementsByClassName?t.getElementsByClassName(e):t.querySelectorAll(e)},o.combinators[" "]=d(!0,(function(e){return L.call(o.find.TAG("*",e))})),o.combinators[">"]=d(!0,(function(e){return L.call(e.children.length&&e.children)})),t=U.test(m.compaireDocumentPosition),c=t||U.test(g.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode,o=e.compaireDocumentPosition;return n===r||!(!r||1!==r.nodeType||!(e.contains?e.contains(t):o&&o(t)))}:function(e,t){if(t)for(;t=t.parentNode;)if(e===t)return!0;return!1},m):m},y=e.document.createElement("canvas").getContext("2d"),n.getContext="canvas"in y,n.getComputed=U.test(e.getComputedStyle),X.matches=function(e,t){return X(e,null,null,t)},X.contains=function(e,t){return(e.ownerDocument||e)!==m&&p(e),c(e,t)},X.attr=function(e,t){(e.ownerDocument||e)!==m&&p(e);var r=o.attrHandle[t.toLowerCase()],i=r&&v.call(o.attrHandle,t.toLowerCase())?r(e):void 0;return void 0!==i?i:n.attributes||!h?e.getAttribute(t):(i=e.getAttributeNode(t))&&i.specified?i.value:null},X.error=function(e){throw new Error("Syntax error, Unrecognized expression: "+e)},r=X.unique=function(e){var t,n=0,r=e.length;for(t=l(e=e||[]),e.length=0,e.splice(0,r);n<r;n++)L.call(t).indexOf(t[n])===n&&e.push(t[n]);return e},o=X.selectors={createPseudo:J,combinators:{},preFilter:{},attrHandle:{},find:{},match:Q,cacheLength:50,arithmetic:{" ":!0,">":!0,"+":!0,"~":!0,"<":!0,"?":!0},relative:{"+":{dir:"nextElementSibling",first:!0},"?":{dir:"previousElementSibling"},"~":{dir:"nextElementSibling"},"<":{dir:"previousElementSibling",first:!0}},filter:{TAG:J((function(e){return d((function(t){return"*"===e||t.nodeName.toLowerCase()===e.toLowerCase()}))})),CLASS:J((function(e){return d((function(t){var n;return(n=new RegExp("(^|[\\x20\\t\\r\\n\\f])"+e+"("+k+"|$)"))&&n.test(_(t,"className")||_(t,"class")||"")}))})),ATTR:J((function(e,t,n){return d((function(r){var o=X.attr(r,e)||r.hasAttribute(e)&&e||"";return null==o?"!="===t:t?(o+="","="===t?o===n:"!="===t?o!==n:"^="===t?n&&0===o.indexOf(n):"*="===t?n&&o.indexOf(n)>-1:"$="===t?n&&o.slice(-n.length)===n:"~="===t?(" "+o.replace(K," ")+" ").indexOf(n)>-1:"|="===t&&(o===n||o.slice(0,n.length+1)===n+"-")):!!o}))})),CHILD:J((function(e,t,r){if(n.qsa){var o=":"+e+"-"+t;r&&(o+="("+r+")");var i=[];return d((function(e){return E.apply(i,e.parentElement.querySelectorAll(o)),[].indexOf.call(i,e)>-1}))}})),PSEUDO:function(e,t){var n=o.pseudos[e]||o.setFilters[e]||o.attrHandle[e]||X.error("Unsupport pseudo: Compilation failed your'"+e+"' is not supported.");return n[b]?n(t):n}},pseudos:{not:J((function(e){var t=X.matches(e);return d((function(e){return C.call(t,e)>-1==!1}))})),has:J((function(e){return d((function(t){return X(e,t).length>0}))})),filter:J((function(e){var t=X.matches(e);return d((function(e){return C.call(t,e)>-1==!0}))})),theme:d((function(e){return"meta"===e.nodeName.toLowerCase()&&F.test(_(e,"name"))})),contains:J((function(e){return d((function(t){return(t.textContent||i(t)).indexOf(e)>-1}))})),lang:J((function(e){return V.test(e||"")||X.error("Unsupport Language: "+e),e=(e+"").toLowerCase(),d((function(t){do{var n;if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}))})),target:d((function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id})),root:d((function(e){return e===g})),focus:d((function(e){return e===e.activeElement&&(!m.hasFocus||m.hasFocus())&&!!(e.type||e.href||~e.tabIndex)})),checked:d((function(e){var t=e.nodeName&&e.nodeName.toLowerCase();return"input"===t&&e.checked||"option"===t&&!!e.selected})),selected:d((function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected})),empty:d((function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0})),disabled:Y(!0),visible:oe(!1),post:ee("post"),get:ee("get"),hidden:oe(!0),enabled:Y(!1),parent:function(e){return d((function(t){return-1===C.call(o.pseudos.empty(e),t)}))(e)},header:d((function(e){return I.test(e.nodeName)})),input:d((function(e){return B.test(e.nodeName)})),button:d((function(e){var t=e.nodeName&&e.nodeName.toLowerCase();return"button"===t||"input"===t&&"button"===e.type})),text:d((function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null!=(t=e.getAttribute("type"))||"text"===t.toLowerCase())})),src:d((function(e){return e.src})),eq:J((function(e){return Z((function(t,n){return[e<0?e+n:e]}))})),first:Z((function(){return[0]})),last:Z((function(e,t){return[t-1]})),center:Z((function(e,t){var n=t%2,r=Math.floor(t/2);return[r,!!n&&r+n]})),odd:d((function(e,t){return t%2})),even:d((function(e,t){return(t+1)%2})),lt:J((function(e){return Z((function(t,n){for(e=+(e<0?e+n:e>n?n:e);--e>=0;)t.push(e);return t.reverse()}))})),gt:J((function(e){return Z((function(t,n){for(e=+(e<0?e+n:e>n?n:e);++e<n;)t.push(e);return t}))})),data:J((function(e){return d((function(t){return t.dataset&&t.dataset[e]||_(t,"data-"+e)}))})),offset:d((function(e){return"static"!==te(e,"position")||e===g})),animated:d((function(e){return!M.test(te(e,"animation"))||"MARQUEE"===e.nodeName})),json:d((function(e){return"script"===(e.nodeName&&e.nodeName.toLowerCase())&&q.test(_(e,"type"))})),nonce:d((function(e){return"script"===(e.nodeName&&e.nodeName.toLowerCase())&&(e.nonce||!!_(e,"nonce"))})),module:d((function(e){return"script"===(e.nodeName&&e.nodeName.toLowerCase())&&"module"===!!_(e,"type")})),manifest:d((function(e){return"link"===e.nodeName.toLowerCase()&&"manifest"===_(e,"rel")})),translate:d((function(e){return e.translate||!0===_(e,"translate")})),code:d((function(e){return O.test(te(e,"fontFamily"))})),context:d((function(e){return"canvas"===e.nodeName.toLowerCase()&&n.getContext})),intscript:d((function(e){return"script"===e.nodeName.toLowerCase()&&!_(e,"src")})),extscript:d((function(e){return"script"===e.nodeName.toLowerCase()&&_(e,"src")})),custom:J((function(e){return d((function(t){return!!_(t,e)}))})),tabindex:d((function(e){return e.tabIndex>-1||_(e,"tabIndex")>-1})),access:J((function(e){return d((function(t){var n=_(t,"accessKey").slice(0,1).toLowerCase();if("a"===t.nodeName.toLowerCase())return e?n===e.toLowerCase():!!n}))})),inline:d((function(e){return Q.inlineTag.test(e.nodeName)})),canonical:d((function(e){return"meta"===e.nodeName.toLowerCase()&&"canonical"===_(e,"rel")})),robots:d((function(e){return"meta"===e.nodeName.toLowerCase()&&"robots"===_(e,"name")}))}},o.pseudos.is=o.pseudos.filter,o.pseudos.nth=o.pseudos.eq,o.pseudos.ctx=o.pseudos.context,{abs:!0,stick:!0,fixed:!0,block:!0})o.pseudos[t]=ne(t);for(t in{description:!0,keywords:!0})o.pseudos[t]=10;for(t in o.relative)o.combinators[t]=ue(o.relative[t]);for(t in{submit:!0,reset:!0,menu:!0})o.pseudos[t]=re(t,"button");for(t in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0,search:!0,range:!0,url:!0})o.pseudos[t]=re(t,"input");function ie(){}function ae(e,t){for(var n,r=e||[],i=0,a=t&&o.find.TAG("*",t),u=a.length;i!=u&&null!=(n=a[i]);i++)n&&n.nodeType&&r.push(n);return r}function ue(e){return d(!0,(function(t){if(e.first)return t[e.dir];for(var n=[];t=t[e.dir];)n.push(t);return n}))}d((function(e){o.attrHandle[e]=d((function(t){return _(t,e,"hasAttribute")}))}))(A.concat("|"+S).match(/\w+/g)),ie.prototype=o.filters=o.pseudos,o.setFilters=new ie,u=X.tokenize=function(e){for(var t,n,r,i=[];e;){for(r in t=!1,(n=G.exec(e))&&(t=n.shift(),i.push({value:t,type:n[0].replace(P," ")}),e=e.slice(t.length)),o.filter)(n=Q[r].exec(e))&&(t=n.shift(),i.push({type:r,value:t,matches:n,unique:n[0]}),e=e.slice(t.length));if(!t)break}return e.length?X.error(e):i.slice(0)},s=X.select=function(e,t,n,i){var a,s,c,l,f,d,p,m=0;for(n=n||[],f=(i=i||[]).length,e=(e+"").replace(D," ").trim().split(/\s*,\s*/);s=e[m++];){for(d=f&&i||[],f||ae(d,t||w),l=u(s),a=0;c=l[a++];)d=(p=z.exec(s))?o.combinators[p[0]]([t]):o.combinators[c.type]?o.combinators[c.type](d):o.filter[c.type](c.matches[0],c.matches[1],c.matches[2]||c.matches[3]||c.matches[4])(d);E.apply(n,d)}return r(n)},X.uniqueSort=function(e){return r(e.sort())},p();var se=e.Snizzle;X.noConflict=function(){return e.Snizzle===X&&(e.Snizzle=se),X},"function"==typeof define&&define.amd?define((function(){return X})):"object"==typeof module&&module.exports?module.exports=X:e.Snizzle=X}(window);