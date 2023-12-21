/**
 * Snizzle is advance feature-rich CSS Selector Engine v1.3.0
 * https://snizzlejs.com/
 * 
 * @version 1.3.0
 * 
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * @license MIT
 * https://github.com/jqrony/snizzle/LICENSE
 * 
 * Date: 28 November 2023 02:30 GMT+0530 (India Standard Time)
 */
(function(window) {
var i, support, unique, Expr, getText, isXML, tokenize, select,
	contains, copy, flat, access,

	// Instance-specific data
	expando = "snizzle" + 1 * Date.now(),
	preferredDoc = window.document,

	// Local document vars
	setDocument, document, docElem, documentIsHTML,

	version = "1.3.0",

	// Instance methods
	hasOwn 	= ({}).hasOwnProperty,
	arr 		= [],
	indexOf = arr.indexOf,
	push 		= arr.push,
	pop 		= arr.pop,
	slice 	= arr.slice,
	concat	= arr.concat,

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped|muted",

	// Support: SVG [VECTOR]
	// HTML Vector [NS] TAGS and Attributes
	nstags	 = "svg|g|defs|desc|symbol|use|image|switch|set|circle|ellipse|line|polyline|" +
		"animatetransform|mpath|foreignobject|linegradient|radialgradient|stop|pattern|" +
		"polygon|path|text|tspan|textpath|tref|marker|view|rect|animatemotion|font|" +
		"clippath|mask|filter|cursor|hkern|vkern|(?:font-(face)(?:.*|src|uri|format|name))",

	theme = "theme-color|apple-mobile-web-app-status-bar-style|msapplication-TileColor|" +
		"msapplication-navbutton-color",

	// HTML Singleton TAGS with no closing TAG
	nctags 	 = "img|input|meta|area|keygen|base|link|br|hr|command|col|param|track|wbr",

	nsattributes = "clip|color|cursor|direction|display|fill|filter|font|kerning|marker|" +
		"mask|stroke|zoomandpan|xml:(?:lang|space|base)|clip-(?:path|rule)|lighting-color|" +
		"points|d|viewbox|enable-background|fill-(?:opacity|rule)|flood-(?:color|opacity)|" +
		"glyph-orientation-(?:horizontal|vertical)|image-rendering|stop-(?:color|opacity)|" +
		"dominant-baseline|x1|x2|y1|y2|cx|cy|r|ry|" +
		"stroke-(?:dasharray|dashoffset|linecap|linejoin|miterlimit|opacity|width)|text-rendering",

	// Regular expressions
	whitespace = "[\\x20\\t\\r\\n\\f]",
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		"*([*^$|!~]?=)" + whitespace +
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" + ".*" + ")\\)|)",

	rinputs			 = /^(?:input|select|textarea|button)/i,
	rjsonp			 = /\bapplication\/json\b/,
	// detect rcomma and lcomma and whitespaces
	rcomma			 = /(^\s*,|,$|\s+)/g,
	rcombine 		 = /^[>+~=<]+$/,
	rheader			 = /^h\d$/i,
	rmonofont		 = /monospace/i,
	rtheme		 	 = new RegExp("^(?:" + theme + ")$", "i"),
	rhtml 		 	 = /HTML$/i,
	rnative		 	 = /^[^{]+\{\s*\[native \w/,
	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr 	 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	rnoAnimation = /^(none)\s*(0s)\s*(ease)\s*(0s).*(running)/,
		
	rtrim = new RegExp("^"+whitespace +"+|((?:^|[^\\\\])(?:\\\\.)*)"+whitespace+"+$", "g"),
	rcombinators = new RegExp("^"+ whitespace+"*([>+~=<]|"+whitespace+")"+whitespace+ "*"),
	ridentifier = new RegExp( "^" + identifier + "$" ),
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	matchExpr  = {
		inlineTag: new RegExp("^(?:" + nctags + ")$", "i"),
		bool: new RegExp("^(?:" + booleans + ")$", "i"),
		"ID": new RegExp("^#(" + identifier + ")"),
		"CLASS": new RegExp("^\\.(" + identifier + ")"),
		"TAG": new RegExp("^(" + identifier + "|[*])"),
		"ATTR": new RegExp("^" + attributes),
		"PSEUDO": new RegExp("^" + pseudos),
		"nstag": new RegExp("^(?:" + nstags + ")$", "i"),
		"nsattr": new RegExp("^(?:" + nsattributes + ")$"),
		"CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp("^" + whitespace +
			"*[>+~=<]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
	};

/**
 * Snizzle main Returnable Function
 * --------------------------------
 * main returnable snizzle function like export/expose and returns
 */
function Snizzle(selector, context, results, seed) {
	var expm, match, elem, newContext = context && context.ownerDocument,
		nodeType = context ? context.nodeType : 9;
		results  = results||[];
	
	// Return early from calls with invalid selector or context
	if (typeof selector!=="string" || !selector ||
		nodeType!==1 && nodeType!==9 && nodeType!==11) {
		return document;
	}

	if (!seed) {
		(newContext||context||preferredDoc)!==document&&setDocument(context);
		context=context||document;
		if (documentIsHTML) {
			if (nodeType!==11 && (match=rquickExpr.exec(selector))) {
				if (expm=match[1]) {
					if ((nodeType===9 && (elem=context.getElementById(expm))) ||
						(newContext && (elem=newContext.getElementById(expm)))) {
						results.push(elem);
						return results;
					}
				}
				if (((expm=match[3]) && (elem=context.getElementsByClassName(expm)))||
					((expm=match[2]) && (elem=context.getElementsByTagName(selector)))){
					push.apply(results, elem);
					return results;
				}
			}
		}
	}

	return select(selector.replace(rtrim, "$1"), context, results, seed);
}

/**
 * specialFunction
 * ---------------
 * specialFunction a function for special use by Snizzle
 */
function specialFunction(fn) {
	fn[expando]=true;
	return fn;
}

// Expose support vars for convenience
support=Snizzle.support	= {};
Snizzle.version					= version;
Snizzle.expando					= expando;

/**
 * complex clone array objects values in newly-arrays
 */
copy=function(results) {
	var clone=[], i=0, len=results.length;
	for(; i < len; i++) clone.push(results[i]);
	return clone;
};

flat=Snizzle.flat=(function(isFlat) {
	return function(array) {
		return isFlat ? arr.flat.call(array) : concat.apply([], array);
	};
})(arr.flat);

/**
 * Assert method use for support
 * -----------------------------
 * assert method will be use for snizzle support
 */
function assert(fn) {
	var elem=document.createElement("fieldset");
	try {
		return !!fn(elem);
	}
	catch(e) {
		return false;
	}
	finally {
		elem.parentNode &&
			elem.parentNode.removeChild(elem);
		elem=null;
	}
}

// Utility function for retrieving the text value of an array of DOM nodes
getText=Snizzle.getText=function(elem) {
	var node, text="", i=0, nodeType=elem.nodeType,
		rnodeType=/(?:1|9|11)/;

	if (!nodeType) {
		while((node=elem[i++])) { text+=getText(node) }
	} else if (rnodeType.test(nodeType)) {
		// Use textContent for elements
		if (typeof elem.textContent==="string") {
			return elem.textContent;
		} else {
			// Traverse its children
			for(elem=elem.firstChild; elem; elem=elem.nextSibling) {
				text+=getText(elem);
			}
		}
	} else if (nodeType===3||nodeType===4) {
		return elem.nodeValue;
	}

	return text;
};

/**
 * Element Enabled/Disabled Pseudo
 * -------------------------------
 * Returns a function to use in pseudos for :enabled/:disabled
 */
function createDisabledPseudo(disabled) {
	return access(function(elem) {
		if ("form" in elem) {
			if (elem.parentNode&&elem.disabled===false) {
				if ("label" in elem) {
					return ("label" in elem.parentNode) ?
						elem.parentNode.disabled===disabled :
						elem.disabled===disabled;
				}
				
				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to
				// check for disabled fieldset ancestors
				return elem.disabled === disabled || elem.disabled !== !disabled;
			}

			return elem.disabled===disabled;
		} else if ("label" in elem) {
			return elem.disabled===disabled;
		}
		return false;
	});
}

/**
 * Element eq Indexed Pseudo Handler
 * ---------------------------------
 * createIndexedPseudo method returns indexed elements like
 * use :first, :last, :odd, :even, etc. pseudos selectors
 */
function createIndexedPseudo(func) {
	return function(seed) {
		var j, matches = [],
			matchIndexes = func([], seed.length, seed),
			i = matchIndexes.length;

		while(i--) {
			(seed[(j = matchIndexes[i])]) && (matches[i] = seed[j]);
		}

		return matches;
	};
}

function attrFilter(elem, attr, attrType) {
	attrType=attrType||"getAttribute";
	var value = (elem[attrType] && (elem[attrType](attr)) || elem[attr]);
	return (value||"").nodeType===2 ? value.nodeValue : value;
}

/**
 * Pseudos access each Elements
 * ----------------------------
 * access each elements returns callback or each elements
 */
access=Snizzle.access=function(ismap, fn) {
	return function(obj) {
		var i=0, len=obj.length, value, ret=[];

		if (typeof ismap==="function") {
			fn=fn||ismap;
			ismap=undefined;
		}

		for(; i < len; i++) {
			value = fn(obj[i], i, obj, length, []);
			value && (ismap ? ret.push(value) : ret.push(obj[i]));
		}

		return flat(ret);
	};
}

/**
 * Snizzle in Detects the XML nodes
 * --------------------------------
 * isXML method returns only xml nodes with Boolean value true/false
 */
isXML=Snizzle.isXML=function(elem) {
	var namespace = elem && elem.namespaceURI,
		docElem = elem && (elem.ownerDocument || elem).documentElement;
	return !rhtml.test(namespace||docElem && docElem.nodeName||"HTML");
};

/**
 * SetDocument set the global document
 * -----------------------------------
 * Sets document-related variables once based on the current document
 */
setDocument=Snizzle.setDocument=function(node) {
	var hasCompare,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if (doc===document||doc.nodeType!==9||!doc.documentElement) {
		return document;
	}

	// Update global variables
	document			 = doc;
	docElem				 = document.documentElement;
	documentIsHTML = !isXML(document);

	/**
	 * Create Selectors Snizzle Supports:
	 * ----------------------------------
	 * Snizzle selectors supports Like scope, attributes, getElementsByTagName etc.
	 */
	support.scope=assert(function(el) {
		docElem.appendChild(el).appendChild(document.createElement("div"));
		return typeof el.querySelectorAll!=="undefined" &&
			!el.querySelectorAll(":scope fieldset div").length;
	});
	support.attributes=assert(function(el) {
		el.className="j";
		return !el.getAttribute("className");
	});
	support.getElementsByTagName=assert(function(el) {
		el.appendChild(document.createComment(""));
		return !el.getElementsByTagName("*").length;
	});
	support.getElementsByClassName=rnative.test(document.getElementsByClassName);
	support.qsa=rnative.test(document.querySelectorAll);
	support.getById=assert(function(el) {
		docElem.appendChild(el).id=expando;
		return !document.getElementsByName||!document.getElementsByName(expando).length;
	});

	/**
	 * Extend ID method in Expr Filter
	 * -------------------------------
	 */
	Expr.filter["ID"]=specialFunction(function(id) {
		return access(function(elem) {
			var value = attrFilter(elem, "id")||attrFilter(elem, "id", "getAttributeNode");
			return value===id;
		});
	});

	/**
	 * Extend TAG method in Expr Find
	 * ------------------------------
	 */
	Expr.find["TAG"]=support.getElementsByTagName ?
		function(tag, context) {
			var gEBTN = context.getElementsByTagName;
			return typeof gEBTN!=="undefined" ?
				context.getElementsByTagName(tag) : context.querySelectorAll(tag);
		} :
		function(tag, context) {
			var elem, i=0, tmp=[],
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName(tag);

			// HANDLE: If tag is equal to "*"
			if (tag==="*") {
				while((elem=results[i++])) {
					elem.nodeType===1 && tmp.push(elem);
				}
				return tmp;
			}
			return results;
		};

	/**
	 * Extend CLASS mehtod in Expr Find
	 * --------------------------------
	 */
	Expr.find["CLASS"]=function(cls /* className */, context) {
		if (documentIsHTML) {
			var gEBCN = context.getElementsByClassName;
			return typeof gEBCN!=="undefined" ?
				context.getElementsByClassName(cls) : context.querySelectorAll(cls);
		}
	};

	/**
	 * ADD Combinators method " " in Expr
	 * ----------------------------------
	 */
	Expr.combinators[" "]=access(true, function(elem) {
		return slice.call(Expr.find["TAG"]("*", elem));
	});

	/**
	 * ADD Combinators method ">" in Expr
	 * ----------------------------------
	 */
	Expr.combinators[">"]=access(true, function(elem) {
		return slice.call(elem.children.length && elem.children);
	})
	
	/* Contains
	------------------------------------------------------------------------*/
	hasCompare = rnative.test(document.compaireDocumentPosition);

	/**
	 * ---------------------------
	 * Element contains another
	 * Purposefully self-exclusive
	 * As in, an element does not contain itself
	 */
	contains	 = hasCompare || rnative.test(docElem.contains) ?
		function(context, elem) {
			var cdown = context.nodeType===9 ? context.documentElement : context,
				epn			= elem && elem.parentNode,
				cDP			= context.compaireDocumentPosition;

			return cdown===epn||!!(epn && epn.nodeType===1&&(
				context.contains ? context.contains(elem) : cDP && cDP(elem)
			));
		} :
		function(context, elem) {
			if (elem) {
				while((elem=elem.parentNode)) {
					if (context===elem) {
						return true;
					}
				}
			}
			return false;
		};

	return document;
};

/**
 * Element GET/POST Form Pseudo Func
 * ---------------------------------
 * createFormPseudo method returns get/post form elements.
 */
function createFormPseudo(method) {
	return access(function(elem) {
		return elem.nodeName==="FORM" && (attrFilter(elem, "method")===method);
	});
}

(function() {
	var canva = window.document.createElement("canvas"),
		context = canva.getContext("2d");
	support.getContext	= ("canvas" in context);
	support.getComputed = rnative.test(window.getComputedStyle);
})();

function getComputed(elem, style) {
	return elem.style[style]||window.getComputedStyle(elem)[style];
}

/**
 * Element Positional Pseudo Handler
 * ---------------------------------
 * createPositionalPseudo method returns the position elements.
 */
function createPositionalPseudo(method) {
	return access(function(elem) {
		var pos = {abs: "absolute", stick: "sticky", fixed: "fix"};
		return getComputed(elem, "position")===pos[method];
	});
}

/**
 * Element Button/Input Pseudo Handler
 * -----------------------------------
 * createInputOrButtonPseudo method returns the input elements.
 */
function createInputOrButtonPseudo(type, tag) {
	return access(function(elem) {
		var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
		return nodeName===tag && elem.type===type;
	});
}

/**
 * Element Hidden Pseudo Handler Fun
 * ---------------------------------
 * createHiddenPseudo method returns the visible/hidden elements
 */
function createHiddenPseudo(hidden) {
	return access(function(elem) {
		return (getComputed(elem, "visibility")==="hidden"||elem.hidden)===hidden;
	});
}

/**
 * Snizzle Expression Matches Method
 * ---------------------------------
 * Snizzle select the expression matches chainable elements
 */
Snizzle.matches=function(expr, elements) {
	return Snizzle(expr, null, null, elements);
};

/**
 * SET document if vars needed
 * ---------------------------
 * IE/Edge sometimes throw a "Permission denied" error when
 * strict-comparing two documents; shallow comparisons work.
 * eslint-disable-next-line eqeqeq
 */
Snizzle.contains=function(context, elem) {
	(context.ownerDocument||context)!==document&&setDocument(context);
	return contains(context, elem);
};

Snizzle.attr=function(elem, name) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when
	// strict-comparing two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ((elem.ownerDocument||elem)!==document) {
		setDocument(elem);
	}

	var fn = Expr.attrHandle[name.toLowerCase()],
	// Don't get fooled by Object.prototype properties (jQrony #13807)
		val	 = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ?
		fn(elem) : undefined;

	return val!==undefined ?
		val :
		support.attributes||!documentIsHTML ?
			elem.getAttribute(name) :
			(val=elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Snizzle.error=function(message) {
	throw new Error("Syntax error, Unrecognized expression: "+message);
};

/**
 * Snizzle Select the Unique Elements
 * ----------------------------------
 * unique method will be remove duplicates value and select the unique
 * value and returns with modified array
 */
unique=Snizzle.unique=function(results) {
	var i=0, copyArray, len=results.length;
	results=results||[];
	copyArray=copy(results);
	results.length=0;
	results.splice(0, len);

	for(; i < len; i++) {
		if (slice.call(copyArray).indexOf(copyArray[i])===i) {
			results.push(copyArray[i]);
		}
	}

	return results;
};

/**
 * Snizzle Multi PSEUDOS Selectors and Methods
 * -------------------------------------------
 */
Expr=Snizzle.selectors={
	createPseudo: specialFunction,
	combinators: {},
	preFilter: {},
	attrHandle: {},
	find: {},
	match: matchExpr,
	// Can be adjusted by the user
	cacheLength: 50,
	arithmetic: {
		" ": true,
		">": true,
		"+": true,
		"~": true,
		"<": true,
		"?": true
	},
	relative: {
		"+": {dir: "nextElementSibling", first: true},
		"?": {dir: "previousElementSibling"},
		"~": {dir: "nextElementSibling"},
		"<": {dir: "previousElementSibling", first: true}
	},
	filter: {
		"TAG": specialFunction(function(selector) {
			return access(function(elem) {
				return selector==="*" ? true : elem.nodeName.toLowerCase()===selector.toLowerCase();
			});
		}),
		"CLASS": specialFunction(function(className) {
			return access(function(elem) {
				var pattern;

				return (pattern=new RegExp("(^|" + whitespace + ")" +
					className + "(" + whitespace + "|$)")) &&
						pattern.test(attrFilter(elem, "className") || attrFilter(elem, "class") || "");
			});
		}),
		"ATTR": specialFunction(function(name, operator, check) {
			return access(function(elem) {
				var result = Snizzle.attr(elem, name) || elem.hasAttribute(name) && name || "";

				if (result==null) {
					return operator==="!=";
				}

				if (!operator) {
					return !!result;
				}

				result += ""; // toString result

				/* eslint-disable max-len */
				return operator==="=" ? result===check :
					operator==="!=" ? result!==check :
					operator==="^=" ? check && result.indexOf(check)===0 :
					operator==="*=" ? check && result.indexOf(check) >-1 :
					operator==="$=" ? check && result.slice(-check.length)===check :
					operator==="~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) >-1 :

					operator==="|=" ? result===check||result.slice(0, check.length+1)===check+"-" :false;
				/* eslint-enable max-len */
			});
		}),
		"CHILD": specialFunction(function(type, what, _argument) {
			if (support.qsa) {
				var pseudo = ":" + type + "-" + what;
				if (_argument) {
					pseudo += "(" + _argument + ")";
				}
				var results = [];
				return access(function(elem) {
					push.apply(results, elem.parentElement.querySelectorAll(pseudo));
					return [].indexOf.call(results, elem) > -1;
				});
			}
		}),
		"PSEUDO": function(pseudo, arguemnt) {

			// pseudo-class names are case-insensitive
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo] || Expr.attrHandle[pseudo] ||
				Snizzle.error("Unsupport pseudo: Compilation failed your'"+pseudo+"' is not supported.");

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Snizzle does
			if (fn[expando]) {
				return fn(arguemnt);
			}

			// Return none-special pseudos function
			return fn;
		}
	},
	pseudos: {
		"not": specialFunction(function(selector) {
			var target=Snizzle.matches(selector);
			return access(function(elem) {
				return (indexOf.call(target, elem) > -1)===false;
			});
		}),
		"has": specialFunction(function(selector) {
			return access(function(elem) {
				return Snizzle(selector, elem).length > 0;
			});
		}),
		"filter": specialFunction(function(selector) {
			var target=Snizzle.matches(selector);
			return access(function(elem) {
				return (indexOf.call(target, elem) > -1)===true;
			});
		}),
		"theme": access(function(elem) {
			return elem.nodeName.toLowerCase()==="meta" && rtheme.test(attrFilter(elem, "name"));
		}),
		"contains": specialFunction(function(text) {
			return access(function(elem) {
				return (elem.textContent||getText(elem)).indexOf(text) > -1;
			});
		}),
		"lang": specialFunction(function(lang) {

			// lang value must be a valid identifier
			if (!ridentifier.test(lang||"")) {
				Snizzle.error("Unsupport Language: " + lang);
			}

			// change case lang toLowerCase
			lang=(lang + "").toLowerCase();

			return access(function(elem) {
				do {
					var langElem;
					if((langElem=documentIsHTML ? elem.lang :
						(elem.getAttribute("xml:lang")||elem.getAttribute("lang")))) {

						// change case langElem toLowerCase
						langElem=langElem.toLowerCase();
						return langElem===lang||langElem.indexOf(lang + "-")===0;
					}
				}
				while((elem=elem.parentNode) && elem.nodeType===1);
				return false;
			});
		}),
		// Miscellaneous
		"target": access(function(elem) {
			var hash=window.location&&window.location.hash;
			return hash && hash.slice(1)===elem.id;
		}),
		"root": access(function(elem) {
			return elem===docElem;
		}),
		"focus": access(function(elem) {
			return elem===elem.activeElement&&
				(!document.hasFocus||document.hasFocus()) && !!(elem.type||elem.href||~elem.tabIndex);
		}),
		"checked": access(function(elem) {
			var nodeName=elem.nodeName&&elem.nodeName.toLowerCase();
			return (nodeName==="input" && elem.checked) || (nodeName==="option" && !!elem.selected);
		}),
		"selected": access(function(elem) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			elem.parentNode&&elem.parentNode.selectedIndex;
			return elem.selected===true;
		}),
		"empty": access(function(elem) {
			// :empty is negated by element (1) or content nodes (text:3; cdata:4; Clazzer ref:5),
			// but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for(elem=elem.firstChild; elem; elem=elem.nextSibling) {
				if (elem.nodeType < 6) {
					return false;
				}
			}
			return true;
		}),
		"disabled": createDisabledPseudo(true),
		"visible": createHiddenPseudo(false),
		"post": createFormPseudo("post"),
		"get": createFormPseudo("get"),
		"hidden": createHiddenPseudo(true),
		"enabled": createDisabledPseudo(false),
		"parent": function(seed) {
			return access(function(elem) {
				return indexOf.call(Expr.pseudos["empty"](seed), elem)===-1;
			})(seed);
		},
		"header": access(function(elem) {
			return rheader.test(elem.nodeName);
		}),
		"input": access(function(elem) {
			return rinputs.test(elem.nodeName);
		}),
		"button": access(function(elem) {
			var nodeName=elem.nodeName&&elem.nodeName.toLowerCase();
			return (nodeName==="button"||(nodeName==="input" && elem.type==="button"));
		}),
		"text": access(function(elem) {
			var attr;
			return elem.nodeName.toLowerCase()==="input" &&
				elem.type==="text" &&
				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with type==="text"
				((attr=elem.getAttribute("type"))!=null || attr.toLowerCase()==="text");
		}),
		"src": access(function(elem) {
			return elem.src;
		}),
		// Position-in-collection pseudos
		"eq": specialFunction(function(i) {
			return createIndexedPseudo(function(_matchesIndex, length) {
				return [i < 0 ? i + length : i];
			});
		}),
		"first": createIndexedPseudo(function() {
			return [0];
		}),
		"last": createIndexedPseudo(function(_matchesIndex, length) {
			return [length - 1];
		}),
		"center": createIndexedPseudo(function(_matchesIndex, length) {
			var remainder = length % 2,
				remaining = Math.floor(length / 2);
			return [remaining, !!remainder && remaining + remainder];
		}),
		"odd": access(function(_elem, i) {
			return i % 2;
		}),
		"even": access(function(_elem, i) {
			return (i + 1) % 2;
		}),
		"lt": specialFunction(function(i) {
			return createIndexedPseudo(function(matchesIndex, length) {
				i = +(i < 0 ? i + length : i > length ? length : i);
				for(; --i >= 0;) {
					matchesIndex.push(i);
				}
				return matchesIndex.reverse();
			});
		}),
		"gt": specialFunction(function(i) {
			return createIndexedPseudo(function(matchesIndex, length) {
				i = +(i < 0 ? i + length : i > length ? length : i);
				for(; ++i < length;) {
					matchesIndex.push(i);
				}
				return matchesIndex;
			});
		}),
		"data": specialFunction(function(name) {
			return access(function(elem) {
				return elem.dataset && elem.dataset[name] || attrFilter(elem, "data-" + name);
			});
		}),
		"offset": access(function(elem) {
			return getComputed(elem, "position")!=="static" || elem===docElem;
		}),
		"animated": access(function(elem) {
			return !rnoAnimation.test(getComputed(elem, "animation")) || elem.nodeName==="MARQUEE";
		}),
		"json": access(function(elem) {
			var nodeName=elem.nodeName&&elem.nodeName.toLowerCase();
			return nodeName==="script" && rjsonp.test(attrFilter(elem, "type"));
		}),
		"nonce": access(function(elem) {
			var nodeName=elem.nodeName&&elem.nodeName.toLowerCase();
			return nodeName==="script" && (elem.nonce || !!attrFilter(elem, "nonce"));
		}),
		"module": access(function(elem) {
			var nodeName=elem.nodeName&&elem.nodeName.toLowerCase();
			return nodeName==="script" && !!attrFilter(elem, "type")==="module";
		}),
		"manifest": access(function(elem) {
			return elem.nodeName.toLowerCase()==="link" && attrFilter(elem, "rel")==="manifest";
		}),
		"translate": access(function(elem) {
			return elem.translate || attrFilter(elem, "translate")===true;
		}),
		"code": access(function(elem) {
			return rmonofont.test(getComputed(elem, "fontFamily"));
		}),
		"context": access(function(elem) {
			return elem.nodeName.toLowerCase()==="canvas" && support.getContext;
		}),
		"intscript": access(function(elem) {
			return elem.nodeName.toLowerCase()==="script" && !attrFilter(elem, "src");
		}),
		"extscript": access(function(elem) {
			return elem.nodeName.toLowerCase()==="script" && attrFilter(elem, "src");
		}),
		"custom": specialFunction(function(attr) {
			return access(function(elem) {
				return !!attrFilter(elem, attr);
			});
		}),
		"tabindex": access(function(elem) {
			return elem.tabIndex > -1 || attrFilter(elem, "tabIndex") > -1;
		}),
		"access": specialFunction(function(name) {
			return access(function(elem) {
				var access = attrFilter(elem, "accessKey").slice(0, 1).toLowerCase();
				if (elem.nodeName.toLowerCase()==="a") {
					return (name ? access===name.toLowerCase() : !!access);
				}
			});
		}),
		"inline": access(function(elem) {
			return matchExpr.inlineTag.test(elem.nodeName);
		}),
		"canonical": access(function(elem) {
			return elem.nodeName.toLowerCase()==="meta" && attrFilter(elem, "rel")==="canonical";
		}),
		"robots": access(function(elem) {
			return elem.nodeName.toLowerCase()==="meta" && attrFilter(elem, "name")==="robots";
		})
	}
};

Expr.pseudos["is"]	= Expr.pseudos["filter"];
Expr.pseudos["nth"]	= Expr.pseudos["eq"];
Expr.pseudos["ctx"] = Expr.pseudos["context"];

for(i in {abs: true, stick: true, fixed: true, block: true}) {
	Expr.pseudos[i]=createPositionalPseudo(i);
}

for(i in {description:true, keywords:true}) {
	Expr.pseudos[i]=10;
}

for (i in Expr.relative) {
	Expr.combinators[i]=addCombinators(Expr.relative[i]);
}

for(i in {submit:true, reset:true, menu:true}) {
	Expr.pseudos[i]=createInputOrButtonPseudo(i, "button");
}

for(i in {radio:true, checkbox:true, file:true, password:true, image:true,
	search:true, range:true, url:true}) {
	Expr.pseudos[i]=createInputOrButtonPseudo(i, "input");
}

access(function(attr) {
	Expr.attrHandle[attr]=access(function(elem) {
		return attrFilter(elem, attr, "hasAttribute");
	});
})(booleans.concat("|" + nsattributes).match(/\w+/g));

/**
 * setFilters
 * Easy API for creating new setFilters for Expr
 */
function setFilters() {}
setFilters.prototype=Expr.filters=Expr.pseudos;
Expr.setFilters=new setFilters();

/**
 * Getting all document Elements
 * -----------------------------
 * getDefaultAllDocumentElements method is getting all document
 * elements globaly
 */
function getDefaultAllDocumentElements(results, outermost) {
	var elem, seed=results||[], i=0,
		elems = outermost&&Expr.find["TAG"]("*", outermost),
		len	 	= elems.length;

	// Add elements passing elementMatchers directly to results
	// Support: IE<9, Safari
	for(; i!=len && (elem=elems[i])!=null; i++) {
		if (elem && elem.nodeType) {
			seed.push(elem);
		}
	}
	return seed;
}

/**
 * Adjust selectors with comma seprated
 * ------------------------------------
 * adjust the selectors with comma seprated and create array from
 * multi selectors
 */
function adjustFromGroupMatcher(selectors) {
	return (selectors+"").replace(rcomma, " ").trim().split(/\s*,\s*/);
}

/**
 * Tokenize Expr Complex advance selectors
 * ---------------------------------------
 * tokenize all selectors object format with attached identifier
 */
tokenize=Snizzle.tokenize=function(selector) {
	var matched, match, groups=[], type;
	while(selector) {
		matched=false;
		if ((match=rcombinators.exec(selector))) {
			matched=match.shift();
			groups.push({value: matched, type: match[0].replace(rtrim, " ")});
			selector=selector.slice(matched.length);
		}
		for(type in Expr.filter) {
			if ((match=matchExpr[type].exec(selector))) {
				matched=match.shift();
				groups.push({
					type: type, value: matched, matches: match, unique: match[0]
				});
				selector=selector.slice(matched.length);
			}
		}
		if (!matched) {
			break;
		}
	}
	return selector.length ?
		Snizzle.error(selector) : groups.slice(0);
};

/**
 * ADD: Snizzle css Combinators
 * ----------------------------
 * addCombinators add the css combinators [>+=~<] in Expr, selectors
 */
function addCombinators(combine) {
	return access(true, function(elem) {
		if (combine.first) {
			return elem[combine.dir];
		}
		var ret=[];
		while((elem=elem[combine.dir])) {
			ret.push(elem);
		}
		return ret;
	});
}

/**
 * Select Complex chainable Expr selector
 * --------------------------------------
 * Select the complex chainable expression selector like pseudos,
 * tag, class, child, advance complex selectors
 */
select=Snizzle.select=function(selector, context, results, seed) {
	var i=0, j, tokens, token, match, seedLen, feed, matched;
	results  = results||[];
	seed     = seed||[];
	seedLen  = seed.length;
	selector = adjustFromGroupMatcher(selector);
	while((tokens=selector[i++])) {
		feed=seedLen && seed || [];
		if (!seedLen) {
			getDefaultAllDocumentElements(feed, context || preferredDoc);
		}
		match=tokenize(tokens);
		j=0;
		while((token=match[j++])) {
			if ((matched=rcombine.exec(tokens))) {
				feed=Expr.combinators[matched[0]]([context]);
			} else if (Expr.combinators[token.type]) {
				feed=Expr.combinators[token.type](feed);
			} else {
				feed=Expr.filter[token.type](token.matches[0], token.matches[1],
					token.matches[2] || token.matches[3] || token.matches[4]
				)(feed);
			}
		}
		push.apply(results, feed);
	}
	return unique(results);
};

// one time assignments
Snizzle.uniqueSort=function(results) {
	return unique(results.sort());
};

// Initialize against the default document
setDocument();

/**
 * EXPOSE and noConflict Snizzle
 * -----------------------------
 */
var _snizzle = window.Snizzle;
Snizzle.noConflict=function() {
	window.Snizzle===Snizzle && (window.Snizzle=_snizzle);
	return Snizzle;
};
if (typeof define==="function" && define.amd) {
	define(function() { return Snizzle; });
} else if (typeof module==="object" && module.exports) {
	module.exports=Snizzle;
} else {
	window.Snizzle=Snizzle;
}
// EXPOSE
})(window);