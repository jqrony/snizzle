/**
 * Snizzle is a advance feature-rich CSS Selector Engine v1.6.1
 * https://github.com/jqrony/snizzle
 * 
 * @releases +10 releases
 * @version 1.6.1
 * 
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * @license MIT
 * https://github.com/jqrony/snizzle/blob/main/LICENSE
 * 
 * @author Shahzada Modassir <codingmodassir@gmail.com>
 * Date: 20 January 2024 12:25 GMT+0530 (India Standard Time)
 */
(function(window) {

/**
 * Inject [use strict] Mode
 * ------------------------
 * Throw ReferenceError when pass undeclare variables
 */
"use strict";

var i, support, unique, Expr, getText, isXML, tokenize, select,
	contains, copy, flat, _snizzle, access, doAdjust, compile,

	// Instance-specific data
	expando = "Snizzle" + 1 * Date.now(),
	preferredDoc = window.document,

	// The current version of Snizzle
	version = "1.6.1",

	// Instance array-obj methods
	arr     = [],
	concat  = arr.concat,
	push    = arr.push,
	_flat   = arr.flat,
	isFlat  = !!_flat,
	slice   = arr.slice,
	indexOf = arr.indexOf,
	hasOwn  = ({}).hasOwnProperty,

	// Instance iterator and toStringTag
	iterator  = Symbol.iterator,
	stringTag = Symbol.toStringTag,

	// Local document vars
	setDocument, document, docElem, pseudoHooks, documentIsHTML,

	// Define jsconsole Fix minifier bugs
	jsconsole = window.console || console,

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	// Used for QSA Elements
	// Selecting all elements using context.querySelectorAll()
	// Returns NodeList[]
	selectAll = function(selector, context) {
		return (context || document).querySelectorAll(selector);
	},

	// Used for Snizzle support
	// use checks()
	// checks a global window with document for Snizzle support
	// throw new Error
	checks = function() {
		if (!preferredDoc) {
			throw new Error("Snizzle requires window with document");
		}
	},

	// Regular expressions sources
	// HTML Singleton TAGS with no closing TAG
	nctags = "img|input|meta|area|keygen|base|link|br|hr|source|col|param|track|wbr|embed|"+
		"command",

	// Input type value used for :pseudos
	types = "radio|email|number|checkbox|file|tel|password|image|search|color|range|url",

	// Collapse noeditable tags to Singleton tags
	// Define none-editable HTML TAG
	noeditable = nctags + "|script|style|audio|video|head|button|textarea|select|details|"+
		"optgroup",

	notypes = "button|datetime\\-local|checkbox|color|file|radio|image|reset|submit|date|"+
		"month|range|time|hidden|week",

	// Self booleans attributes
	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|"+
	  "ismap|loop|multiple|open|readonly|required|scoped|muted",

	themes = "theme-color|apple-mobile-web-app-status-bar-style|msapplication-TileColor|" +
	  "msapplication-navbutton-color",

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	// Pseudos selectors: https://www.w3.org/TR/selectors/#pseudo-classes
	pseudos = ":(" + identifier + ")(?:\\((" +

		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" + ")\\)|)",

	// 1. TAG (capture 1),   2. :nth-child (capture 2),   3. Slash (capture 3)
	xpOrdDesc = "((-?\\w)+(\\["+ whitespace + "*(\\d+)" + whitespace + "*\\])*(\\/|))+",

	xpAttributes = "",

	xpAxises = "(?:ancestor|descendant)(\\-(or\\-self))?|((?:following|preceding))(\\-(sibling))?"+
		"\\:\\:",

	// Regular expressions
	// https://www.w3.org/TR/CSS2/text.html#egbidiwscollapse
	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp(whitespace + "+", "g"),

	rcombinators = new RegExp("^" + whitespace+ "*([>+^~<]|" +whitespace+ ")" + whitespace + "*"),
	rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),

	ridentifier = new RegExp("^" + identifier + "$"),

	rthemes = new RegExp("^(?:" + themes + ")$", "i"),
	rnative = /^[^{]+\{\s*\[native \w/,
	rinputs = /^(?:input|select|textarea|button)/i,
	rjson   = /^\bapplication\/json\b$/i,
	rmodule = /^\bmodule\b$/i,
	rvalid  = /^(?:input|select|form|textarea)$/i,
	rxpnth  = /\[(\d+)]/g,
	rhtml   = /HTML$/i,
	rheader = /^h[1-6]$/i,
	rslash  = /\//g,
	rtypes  = /^|\|(?:(date|time\\-local)|time|month|week)+/g,
	rcomma  = new RegExp("^" + whitespace + "*," + whitespace + "*"),

	rnctags = new RegExp("^(?:" + nctags + ")$", "i"),
	rnotype = new RegExp("^(?:" + notypes + ")$"),

	// nodeType testing Element or Document or DocumentFragment
	rprimaryNodeType = /^(?:1|9|11)$/,
	rdashAlpha = /-([a-z])/g,

	rXpOrdDesc = new RegExp("^" + xpOrdDesc),
	rXpAxises = new RegExp("^" + xpAxises),

	// Used for :readonly pseudo
	rReadableType = new RegExp(notypes.replace(rtypes, "")),

	// nodeType testing TextNode or CDATASection
	rsecondryNodeType = /^(?:3|4)$/,

	rtrimComma = new RegExp(whitespace + "*," + whitespace + "*$"),

	// None animation => (none 0s ease 0s 1 normal none running)
	rnoneanimation = /^(none)\s*(0s)\s*(ease)\s*(0s).*(running)/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	// None editable TAGS
	rnoeditable = new RegExp("^(?:" + noeditable + ")$", "i"),

	// Left triming //* or / or // And right triming only /
	rxptrim = new RegExp("^[\\/]{1,2}\\**|\/$" + whitespace + "*", "g"),

	//
	exprMatcher = {
		"ID": new RegExp("^#(" + identifier + ")"),
		"CLASS": new RegExp("^\\.(" + identifier + ")"),
		"TAG": new RegExp("^(" + identifier + "|[*])"),
		"ATTR": new RegExp("^" + attributes),
		"PSEUDO": new RegExp("^" + pseudos),
		"CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
		"XPATH": /^([\/]{1,2}[^\/].*?(?:\/\w|\]|\],|[^, ]+,|))(\s|$)/
	};

// Checks Snizzle support or block code executation silently
try {checks()}
catch(e) {jsconsole.error(e.message); return}

/**
 * Internal specialFunction
 * ------------------------
 * specialFunction Mark a function for special use by Snizzle
 */
function specialFunction(fn) {
	fn[expando]=true;
	return fn;
}

/**
 * Create trueCond single use method
 * ---------------------------------
 * Check true condition with String Boolean 'true' parse true
 * @returns {Boolean} true/false
 */
function trueCond(editable) {
	return editable==="true" ? true : false;
}

flat = function(array) {
	return isFlat ? _flat.call(array) : concat.apply([], array);
};

/**
 * Create Snizzle external public API
 * ----------------------------------
 */
function Snizzle(selector, context, results, seed) {
	var match, nodeList, matched, elem,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if (typeof selector!== "string" || !selector ||
		(nodeType!==1 && nodeType!==9 && nodeType!==11)) {
		return document;
	}
	
	// Try to shortcut find operations (as opposed) in HTML documents
	if (!seed) {
		setDocument(context);
		context = context || document;
		if (!documentIsHTML ||
			!(nodeType!==11 && (match = rquickExpr.exec(selector)))
		) return;

		// QSA Support
		// Take advantage of querySelectorAll if support QSA method.
		if (support.qsa && match) {
			nodeList = selectAll(match[0], context);
			push.apply(results, match[1] ?
				[(nodeList[0] || selectAll(match[0], newContext)[0])||[]] :
				nodeList);
			return flat(results);
		}

		// Others Support
		// If the QSA not support, try using a "get*By*" DOM method
		if (match && (matched=match[1])) {
			// Support: IE, Opera, Webkit
			// TODO: identify versions
			// getElementById can match elements by name instead of ID
			// *Document context
			elem=nodeType===9 ? (context.getElementById(matched)) :
			
			// Support: IE, Opera, Webkit
			// TODO: identify versions
			// getElementById can match elements by name instead of ID
			// *Element context
			newContext && newContext.getElementById(matched);
			elem && results.push(elem);
			return results;
		} else if (match) {
			// Type/TAG Selector
			// Support: Chrome, IE, Opera, Webkit
			// TODO: identify versions
			// getElementById can match elements by name instead of TAG
			elem=match[2] ? context.getElementsByTagName(selector) :

			// CLASS Selector
			// Support: Chrome, IE, Opera, Webkit
			// TODO: identify versions
			// getElementById can match elements by name instead of CLASS
			match[3] && context.getElementsByClassName(match[3]);
			push.apply(results, elem);
			return results;
		}
	}
	
	// All others complex selectors
	return select(selector.replace(rtrim, "$1"), context, results, seed);
}


// Expose support vars for convenience
support = Snizzle.support = {};

// Expose version vars for convenience
Snizzle.version = version;

// Add toStringTag and iterator method
if (typeof Symbol==="function") {
	Snizzle[stringTag] = Snizzle.name;
	Snizzle[iterator]  = arr[iterator];
}

/**
 * Internal assert used for support
 * --------------------------------
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert(fn) {
	var elem = document.createElement("fieldset");
	try {
		return !!fn(elem);
	}
	catch(e) {
		return false;
	}
	finally {
		elem.parentNode && elem.parentNode.removeChild(elem);
		elem = null;
	}
}

/**
 * @param {Array|Object} results An copyable array object
 * @returns newly-cloned Array
 */
copy = Snizzle.copy = function(results) {
	var clone = [], i = 0, len = results.length;
	for(; i < len; i++) clone.push(results[i]);
	return flat(clone);
};

/**
 * Sets document-related variables once based on the current document
 * @returns {Object} Returns the current document
 */
setDocument = Snizzle.setDocument = function(node) {
	var hasCompare, subWindow,
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
	document 			 = doc;
	docElem				 = document.documentElement;
	documentIsHTML = !isXML(document);

	if (preferredDoc!==doc &&
		(subWindow=document.defaultView) && subWindow.top!==subWindow) {
		// Support: IE 11, Edge
		subWindow.addEventListener &&
		subWindow.addEventListener("unload", unloadHandler, false),
		// Support: IE 9 - 10 only
		subWindow.attachEvent && subWindow.attachEvent("onunload", unloadHandler);
	}

	/*
	 * Create supports of ATTR or CLASS or TAG or ID or SCOPE
	 * ------------------------------------------------------
	 */
	support.getElementsByClassName=rnative.test(document.getElementsByClassName);
	support.qsa=rnative.test(document.querySelectorAll);

	support.dataset=assert(function(el) {
		el.dataset["snizzle"] = expando;
		return !!(el.dataset["snizzle"] || el.dataset);
	});

	support.scope=assert(function(el) {
		docElem.appendChild(el).appendChild(document.createElement("div"));
		return init(el, "querySelectorAll", ":scope fieldset div").length;
	});

	support.attributes=assert(function(el) {
		el.className = "s";
		return !el.getAttribute("className");
	});

	support.children=assert(function(el) {
		el.appendChild(document.createElement("div"));
		return el.children && !!el.children.length;
	});

	support.getElementsByTagName=assert(function(el) {
		el.appendChild(document.createComment(""));
		return !el.getElementsByTagName("*").length;
	});

	support.xPathExpression = document.evaluate && rnative.test(document.evaluate);

	support.getById=assert(function(el) {
		docElem.appendChild(el).id = expando;
		return !document.getElementsByName||!document.getElementsByName(expando).length;
	});

	/*
	 * Assign filter in ID method
	 * ------------------------------------------------------------------
	 */
	Expr.filter["ID"] = specialFunction(function(id) {
		return access(function(elem) {
			return (elem.id || attrVal(elem, "id", "getAttributeNode")) === id;
		});
	});

	/*
	 * Assign find in CLASS method
	 * ------------------------------------------------------------------
	 */
	Expr.find["CLASS"] = function(className, context) {
		if (documentIsHTML) {
			return init(context, "getElementsByClassName", className) ||
				selectAll(className, context);
		}
	};

	/*
	 * Assign find in CHILDREN method
	 * ------------------------------------------------------------------
	 */
	Expr.find["CHILDREN"] = !support.children ?
		function(context) {
			return slice.call(context.children);
		} : function(context) {
			var results = context.childNodes;
			return access(function(elem) {return elem.nodeType===1})(results);
		};

	/*
	 * Assign find in TAG method
	 * ------------------------------------------------------------------
	 */
	Expr.find["TAG"] = support.getElementsByTagName ?
		function(tag, context) {
			return init(context, "getElementsByTagName", tag) || selectAll(tag, context);
		} :
		function(tag, context) {
			var tmp = [],
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes
				results = context.getElementsByTagName(tag);

			// HANDLE: If tag is equal to "*"
			if (tag==="*") {
				return access(function(elem) {
					elem.nodeType===1 && tmp.push(elem);
				})(results), tmp;
			}
			return results;
		};

	/*
	 * Assign find in ELEMENTS method
	 * ------------------------------------------------------------------
	 */
	Expr.find["ELEMENTS"] = function(elem) {
		return slice.call(Expr.find["TAG"]("*", elem));
	};

	/*
	 * Assign find in ID method
	 * ------------------------------------------------------------------
	 */
	Expr.find["ID"] = function(id, context) {
		var elems, i,
			elem = documentIsHTML && init(context, "getElementById", id);

		if (elem) {

			// Verify the id attribute
			if (attrVal(elem, "id", "getAttributeNode")===id) {
				return [elem];
			}

			// Fall back on getElementsByName
			elems = elem.getElementsByName(id);
			i = 0;
			while((elem = elems[i++])) {
				// Verify the id attribute
				if (attrVal(elem, "id", "getAttributeNode")===id) {
					return [elem];
				}
			}
			return [];
		}
	};

	Expr.find["ID"] = support.getById ?
		function(id, context) {
			var elem = documentIsHTML && init(context, "getElementById", id);
			return elem ? [elem] : [];
		} : Expr.find["ID"];


	/* Contains
	-------------------------------------------------------------------*/
	hasCompare = rnative.test(document.compaireDocumentPosition);

	/*
	 * Create contains method
	 * ----------------------
	 * Element contains another Purposefully self-exclusive
	 * As in, an element does not contain itself
	 */
	contains = hasCompare || rnative.test(docElem.contains) ?
		function(context, elem) {
			var html = context.nodeType === 9 ?
				context.documentElement : context,
				pnode = elem && elem.parentNode,
				compare = context.compaireDocumentPosition;

			return html===pnode||!!(pnode && pnode.nodeType===1 &&
				(init(context, "contains", elem) || compare(elem))
			);
		} :
		function(context, elem) {
			if (elem) {
				while((elem=elem.parentNode)) {
					if (elem===context) {
						return true;
					}
				}
			}
			return false;
		};

	return document;
};

/**
 * Create Internal Private init method
 * -----------------------------------
 * Check constructor or property and Initialize it with arg
 */
function init(owner, constructor, arg) {
	return owner[constructor] && owner[constructor](arg);
}

/**
 * Create expr matches public API
 * ------------------------------
 * @param {String} expr An String CSS Selectors
 * @param {Element} elements HTML list elements
 * @returns matched expr selectors HTML Elements with array
 */
Snizzle.matches = function(expr, elements) {
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

Snizzle.attr = function(elem, name) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when
	// strict-comparing two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ((elem.ownerDocument||elem)!==document) {
		setDocument(elem);
	}

	name = (name || "").toLowerCase();

	var fn = Expr.attrHandle[name],
		// Don't get fooled by Object.prototype properties
		val = fn && hasOwn.call(Expr.attrHandle, name) ?
		fn(elem) : undefined;

	return val!==undefined ?
		val :
		support.attributes||!documentIsHTML ?
		elem.getAttribute(name) :
		(val=elem.getAttributeNode(elem)) && val.specified ?
			val.value :
			null;
};

Snizzle.error = function(message) {
	throw new SyntaxError("Unrecognized expression: " + message);
};

/**
 * Create unique public API
 * ------------------------
 * Remove the all duplicates value of array-object
 * @returns A unique Array
 */
unique = Snizzle.unique = function(results) {
	var i = 0, cloneArray, len = results.length;
	results = results || [];
	cloneArray = copy(results);
	// 
	results.length = 0;
	results.splice(0, len);

	for(; i < len; i++) {
		if (slice.call(cloneArray).indexOf(cloneArray[i])===i) {
			results.push(cloneArray[i]);
		}
	}

	return results;
};

/**
 * One time assignments uniqueSort
 * -------------------------------
 * Document sorting and removing duplicates and
 * @param {ArrayLike} results An ArrayLike array
 * @returns A sorted unique Array
 */
Snizzle.uniqueSort = function(results) {
	return unique(results).slice(0).sort();
};

// Utility function for retrieving the text value of an array of DOM nodes
getText = Snizzle.getText = function(elem) {
	var text = "", nodeType = elem.nodeType;

	// Handle none-element object
	if (!nodeType) {
		// If no nodeType, this is expected to be an array
		access(function(elem) {text+=getText(elem)})(elem);
	} else if (rprimaryNodeType.test(nodeType)) {
		// Handle Element or Document or DocumentFragment
		// Use textContent for elements
		if (typeof elem.textContent==="string") {
			return elem.textContent;
		} else {
			// Otherwise Traverse its children
			for(elem=elem.firstChild; elem; elem=elem.nextSibling) {
				text += getText(elem);
			}
		}
	} else if (rsecondryNodeType.test(nodeType)) {
		// Handle TextNode or CDATASection
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes
	return text;
};

/**
 * Create Internal attrVal Private method
 * --------------------------------------
 * Returns the custom AttributeNode value or Attribute value
 * attrVal can be check exists or none-exists attr
 * @returns Output: Due String or Boolean
 */
function attrVal(elem, attr, getProp) {
	var value = init(elem, getProp || "getAttribute", attr);
	return value && value.nodeType === 2 ? value.nodeValue : value;
}

// Used by camelCase as callback to replace()
function fcamelCase(_all, letter) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; Used by aria :pseudo
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase(string) {
	return (string||"").replace(rdashAlpha, fcamelCase);
}

/**
 * Create Internal/External isXML method
 * -------------------------------------
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True if elem is non-HTML XML node
 */
isXML = Snizzle.isXML = function(elem) {
	var namespace = elem && elem.namespaceURI,
		docElem = elem && (elem.ownerDocument||elem).documentElement;
	return !rhtml.test(namespace||docElem && docElem.nodeName||"HTML");
};

/**
 * Create Internal/External access method
 * ------------------------------------
 * Bind with outerMap function
 * Execute a callback for every element in the matched set.
 */
access = Snizzle.access = function(isMap, fn) {
	return function(obj) {
		var i=0, len=obj.length, value, ret=[];

		if (typeof isMap==="function") {
			fn = fn || isMap;
			isMap = undefined;
		}

		for(; i < len; i++) {
			value = fn(obj[i], i, obj, length, []);
			value && (isMap ? ret.push(value) : ret.push(obj[i]));
		}

		return unique(flat(ret));
	};
};

/**
 * Create addCombinators Internal Method
 * -------------------------------------
 * Handler Combinators [>+^~<] with compaire element.
 */
function addCombinators(src) {
	var tmp = [], dir = src.dir, type = src.type,
		_with = src.with, once = !!src.once;
	return access(true, function(elem) {
		if (once || _with) {
			return once ? elem[dir] : Expr[_with][type](elem);
		} else {
			while((elem = elem[dir]) && elem.nodeType===1) {
				tmp.push(elem);
			}
			return tmp;
		}
	});
}

/**
 * Create multi External :pseudos Handler Hooks
 * --------------------------------------------
 * pseudoHooks to be used Boolean or Inline properties for pseudo
 */
pseudoHooks = Snizzle.pseudoHooks = {
	/**
	 * Create External positionalPseudo Handler
	 * ----------------------------------------
	 * Returns a function to use in pseudos for :eq, :lt, :gt etc.
	 */
	positionalPseudo: function(fn) {
		return function(results) {
			var j, matches = [],
				matchesIndex = fn([], results.length, results),
				i = matchesIndex.length;
			while(i--) {
				if (results[(j=matchesIndex[i])]) {
					matches[i] = results[j];
				}
			}
			return matches;
		};
	},

	/**
	 * Create External inputOrButtonPseudo Handler
	 * -------------------------------------------
	 * Returns a function to use in pseudos for input or button :type/:button
	 */
	inputOrButtonPseudo: function(type, isButton) {
		var tag = isButton ? "button" : "input";
		return access(function(elem) {
			return (nodeName(elem)===tag||!!isButton && nodeName(elem)==="input")&&elem.type===type;
		});
	},

	/**
	 * Create External hiddenPseudo Handler
	 * ------------------------------------
	 * Returns a function to use in pseudos for :visible/:hidden
	 */
	hiddenPseudo: function(hidden) {
		return access(function(elem) {
			var visibility = getStyle(elem, "visibility"),
				display = getStyle(elem, "display");
			return (visibility==="hidden"||display==="none"||elem.hidden)===hidden;
		});
	},

	/**
	 * Create External disabledPseudo Handler
	 * --------------------------------------
	 * Returns a function to use in Snizzle pseudos for :enabled/:disabled
	 * @param {Boolean} disabled true for :disabled; false for :enabled
	 */
	disabledPseudo: function(disabled) {
		// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
		return access(function(elem) {

			// Only certain elements can match :enabled or :disabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
			if (("form" in elem) &&

				// * listed form-associated elements in a disabled fieldset
				// * option elements in a disabled optgroup
				// All such elements have a "form" property.
				elem.parentNode && elem.disabled===false) {
				// Option elements defer to a parent optgroup if present
				if ("label" in elem) {
					return ("label" in elem.parentNode) ?
						elem.parentNode.disabled===disabled :elem.disabled===disabled;
				}
				
				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to
				// check for disabled fieldset ancestors
				return elem.disabled === disabled || elem.disabled !== !disabled;
			}
			return (("label" in elem)||("form" in elem) && elem.disabled===disabled)||false;
		});
	},

	/**
	 * Create External scriptPseudo Handler
	 * ------------------------------------
	 * Returns a function to use in pseudos for :module/:json :intscript/:extscript
	 */
	scriptPseudo: function(external) {
		return access(function(elem) {
			if (typeof external!=="boolean") {
				return external.test(elem.type||attrVal(elem, "type"));
			} else {
				return nodeName(elem)==="script" && elem.hasAttribute("src")===external;
			}
		});
	},

	/**
	 * Create External formPseudo Handler
	 * ----------------------------------
	 * Returns a function to use in pseudos for :get/:post
	 */
	formPseudo: function(method) {
		return access(function(elem) {
			return nodeName(elem)==="form"&&((elem.method||attrVal(elem, "method"))===method);
		});
	}
};

/**
 * Create getStyle Internal Method
 * -------------------------------
 * Returns elem of computed or inline style using prop
 */
function getStyle(elem, prop) {
	var value = elem.style[prop] || window.getComputedStyle(elem)[prop];
	return parseInt(value) || value;
}

/**
 * Create Expr and selectors source
 * --------------------------------
 * Assign multi objects methods and Handlers Like :pseudo, preFilter,
 * filter, relative, combinators and createPseudo, find etc. Methods.
 */
Expr = Snizzle.selectors = {
	// createPseudo to create arg based markable :pseudo
	createPseudo: specialFunction,
	combinators: {},
	attrHandle: {},
	find: {},
	__external: {},
	match: exprMatcher,
	// Can be adjusted cacheLen by the user
	cacheLen: 80,
	extendPseudo: extend,
	relative: {
		"$": {dir: "previousElementSibling", once: true},
		" ": {type: "ELEMENTS", with: "find"},
		">": {type: "CHILDREN", with: "find"},
		"~": {dir: "nextElementSibling"},
		"^": {dir: "parentNode"},
		"<": {dir: "parentNode", once: true},
		"?": {dir: "previousElementSibling"},
		"+": {dir: "nextElementSibling", once: true},
	},
	preFilter: {
		"XPATH": function(match) {
			// Trim or slice rComma like expression(,) to expression
			match[1] = (match[1]).replace(rtrimComma, "");
			
			// Move the given value to match[3] and trim whitespaces
			match[0] = (match[1] || match[0].trim()).toLowerCase();
			return match.slice(0, 2);
		},
		"CLASS": function(match) {
			return match.slice(0, 2);
		},
		"ATTR": function(match) {
			// Move the given value to match[3] whether quoted or unquoted
			match[3] = (match[3] || match[4] || match[5] || "");
			return match.slice(0, 4);
		},
		"TAG": function(match) {
			return match.slice(0, 2);
		},
		"ID": function(match) {
			return match.slice(0, 2);
		},
		"CHILD": function(match) {

			/* matches from matchExpr["CHILD"]
			  1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();
			match[6] = match[0].toLowerCase();

			return match;
		},
		"PSEUDO": function(match) {

			// Accept quoted ['|"] arguments as-is
			if (match[3]) {
				match[2] = match[4] || match[5] || "";
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice(0, 3);
		}
	},
	filter: {
		// Support: Chrome, FireFox, Safari 3.1, Edge, IE
		// https://developer.mozilla.org/en-US/docs/Web/XPath
		"XPATH": specialFunction(function(xPathExpression) {
			return access(function(elem) {
				var results, i, tmp=[], snapType =XPathResult.ORDERED_NODE_SNAPSHOT_TYPE;
				results = document.evaluate(xPathExpression, elem, null, snapType, null);
				i = results.snapshotLength;

				// Iterate through the matched elements
				while(i--) {
					// Let's push with each matched element
					tmp.push(results.snapshotItem(i));
				}

				return indexOf.call(tmp, elem) > -1;
			});
		}),
		"TAG": specialFunction(function(tagName) {
			tagName = (tagName + "").toLowerCase();
			return access(function(elem) {
				return tagName==="*" ? true : nodeName(elem) === tagName;
			});
		}),
		"CLASS": specialFunction(function(className) {
			return access(function(elem) {
				var pattern;
				return (pattern=new RegExp("(^|" + whitespace + ")" +
					className + "(" + whitespace + ")|$")) &&
					pattern.test(
						elem.className ||
						attrVal(elem, "class")||""
					);
			});
		}),
		"ATTR": specialFunction(function(name, operator, check) {
			return access(function(elem) {
				var result = Snizzle.attr(elem, name) || attrVal(elem, name);

				if (result==null) {
					return operator==="!=";
				}

				if (!operator) {
					return !!result;
				}

				// toString result
				result += "";

				/* eslint-disable max-len */

				return operator==="=" ? result===check :
					operator==="^=" ? check && result.indexOf(check)===0 :
					operator==="*=" ? check && result.indexOf(check) >-1 :
					operator==="!=" ? result!==check :
					operator==="$=" ? check && result.slice(-check.length)===check :
					operator==="~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) >-1 :

					operator==="|=" ? result===check||result.slice(0, check.length+1)===check + "-" :
					false;
				/* eslint-enable max-len */
			});
		}),
		"CHILD": specialFunction(function(type, what, _arg, first, last, expr) {

			/* matches from exprMatcher["CHILD"]
			 * Deal the CSS3 pseudo
			  01 :nth-last-of-type(n)
			  02 :nth-of-type(n)
			  03 :first-of-type
			  04 :first-child
			  05 :last-child
			  06 :last-of-type
			  07 :nth-child(n)
			  08 :only-child
			  09 :only-of-type
			  10 :nth-last-child(n)
			*/
			// For QSA Support
			// Take advantage of querySelectorAll if support QSA method.
			// TODO: Need to improve and enhance CHILD Handler selector
			return support.qsa ? access(function(elem) {
				return indexOf.call(slice.call(selectAll(expr)), elem) > -1;
			}) :

			// Otherwise always run
			// TODO: Need to improve and enhance CHILD Handler selector
			access(function(elem) {

			});
		}),
		"PSEUDO": specialFunction(function(pseudo, arguemnt) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var fn = combine(pseudo) ||
				Snizzle.error("Unsupport pseudo: Compilation failed '" + pseudo + "' not supported!");

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Snizzle does
			return fn[expando] ?
				fn(arguemnt) :
				fn;
		})
	},
	_pseudos: {
		"required": access(function(elem) {
			return nodeName(elem)==="input" && (!!elem.required || attrVal(elem, "required"));
		}),
		"link": access(function(elem) {
			return nodeName(elem)==="a" && attrVal(elem, "href") != null;
		}),
		"active": access(function(elem) {
			return elem.activeElement;
		}),
		"default": function(elem) {
			return Expr.pseudos.checked(elem);
		},
		"optional": access(function(elem) {
			return nodeName(elem)==="input" && (!elem.required || attrVal(elem, "required")==null);
		}),
		"valid": access(function(elem) {
			return rvalid.test(nodeName(elem)) && elem.checkValidity && elem.checkValidity();
		}),
		"invalid": access(function(elem) {
			return rvalid.test(nodeName(elem)) && elem.checkValidity && !elem.checkValidity();
		}),
		"readonly": access(function(elem) {
			return nodeName(elem)==="input" && !rReadableType.test(elem.type) && !!elem.readOnly;
		})
	},
	pseudos: {
		"theme": access(function(elem) {
			return nodeName(elem)==="meta" && rthemes.test(elem.name||attrVal(elem, "name"));
		}),
		"not": specialFunction(function(selector) {
			var target = Snizzle.matches(selector);
			return access(function(elem) {
				return indexOf.call(target, elem) === -1;
			})
		}),
		"has": specialFunction(function(selector) {
			var target = Snizzle.matches(selector);
			return access(function(elem) {
				return indexOf.call(target, elem) > -1;
			});
		}),
		"filter": specialFunction(function(selector) {
			var target = Snizzle.matches(selector);
			return access(function(elem) {
				return indexOf.call(target, elem) > -1;
			});
		}),
		"contains": specialFunction(function(text) {
			return access(function(elem) {
				return (elem.textContent||getText(elem)).indexOf(text) > -1;
			});
		}),
		"icontains": specialFunction(function(text) {
			return access(function(elem) {
				return (
					elem.textContent ||
					elem.innerText ||
					getText(elem) || ""
				).toLowerCase().indexOf((text + "").toLowerCase()) > -1;
			});
		}),
		"rcontains": specialFunction(function(regex) {
			return access(function(elem) {
				regex = new RegExp(regex);
				return regex.test(elem.textContent||getText(elem));
			});
		}),
		"ircontains": specialFunction(function(regex) {
			return access(function(elem) {
				regex = new RegExp(regex, "i");
				return regex.test(elem.textContent||getText(elem));
			});
		}),
		// Miscellaneous
		"target": access(function(elem) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice(1) === elem.id;
		}),
		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": specialFunction(function(lang) {

			// lang value must be a valid identifier
			if (!ridentifier.test(lang || "")) {
				Snizzle.error("Unsupported lang: " + lang);
			}

			// change case lang toLowerCase
			lang = (lang||"").toLowerCase();

			return access(function(elem) {
				do {
					var elemLang;
					if ((elemLang=documentIsHTML ?
						elem.lang :
						attrVal(elem, "xml:lang")||attrVal(elem, "lang"))) {

						// change case elemLang toLowerCase
						elemLang = elemLang.toLowerCase();
						return elemLang===lang ||
							elemLang.indexOf(lang + "-")===0;
					}
				} while((elem = elem.parentNode) && elem.nodeType === 1);
				return false;
			});
		}),
		/* Boolean and Inline properties */
		"intscript": pseudoHooks.scriptPseudo(false),
		"disabled": pseudoHooks.disabledPseudo(true),
		"post": pseudoHooks.formPseudo("POST"),
		"visible": pseudoHooks.hiddenPseudo(false),
		"json": pseudoHooks.scriptPseudo(rjson),
		"get": pseudoHooks.formPseudo("GET"),
		"hidden": pseudoHooks.hiddenPseudo(true),
		"enabled": pseudoHooks.disabledPseudo(false),
		"extscript": pseudoHooks.scriptPseudo(true),
		"module": pseudoHooks.scriptPseudo(rmodule),
		/* end */
		"inline": access(function(elem) {
			return rnctags.test(nodeName(elem));
		}),
		"context": function(context) {
			return flat([context]);
		},
		"root": access(function(elem) {
			return elem === docElem;
		}),
		"focus": access(function(elem) {
			return elem===elem.activeElement &&
				(!document.hasFocus||document.hasFocus()) && !!(elem.type||elem.href||~elem.tabIndex);
		}),
		"checked": access(function(elem) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = Snizzle.nodeName(elem);
			return (nodeName==="input" && elem.checked) || (nodeName==="option" && !!elem.selected);
		}),
		"offset": access(function(elem) {
			return getStyle(elem, "position")!=="static"||elem===docElem;
		}),
		"selected": access(function(elem) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			// eslint-disable-next-line no-unused-expressions
			elem.parentNode && elem.parentNode.selectedIndex;
			return elem.selected === true;
		}),
		"editable": access(function(elem) {
			return !rnoeditable.test(nodeName(elem)) && trueCond(
				(elem.contentEditable||attrVal(elem, "contenteditable"))
			);
		}),
		"writable": access(function(elem) {
			var writable = !(elem.readOnly||elem.disabled);
			return writable &&
				(nodeName(elem)==="textarea" || nodeName(elem)==="input"&&!rnotype.test(elem.type));
		}),
		"viewport": access(function(elem) {
			return nodeName(elem)==="meta" && ((elem.name || attrVal(elem, "name"))==="viewport");
		}),
		"parent": function(seed) {
			return access(function(elem) {
				return indexOf.call(Expr.pseudos.empty(seed), elem)===-1;
			})(seed);
		},
		// Contents
		"empty": access(function(elem) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
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
		// Element/input types and Headers
		"header": access(function(elem) {
			return rheader.test(elem.nodeName || nodeName(elem));
		}),
		"input": access(function(elem) {
			return rinputs.test(elem.nodeName || nodeName(elem));
		}),
		"button": access(function(elem) {
			var nodeName = Snizzle.nodeName(elem);
			return (nodeName==="button")||(nodeName==="input" && elem.type==="button");
		}),
		"text": access(function(elem) {
			var attr;
			return nodeName(elem)==="input" &&
				elem.type==="text" &&
				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with type==="text"
				((attr=attrVal(elem, "type")) != null || attr.toLowerCase() === "text");
		}),
		"name": specialFunction(function(name) {
			return access(function(elem) {
				return (elem.name||attrVal(elem, "name", "getAttributeNode")) === name;
			});
		}),
		"animated": access(function(elem) {
			return nodeName(elem)==="marquee" ||
				!rnoneanimation.test(getStyle(elem, "animation"));
		}),
		// Position-in-collection pseudos
		"eq": specialFunction(function(i) {
			return pseudoHooks.positionalPseudo(function(_, length) {
				return [i < 0 ? i + length : i];
			});
		}),
		"first": pseudoHooks.positionalPseudo(function() {
			return [ 0 ];
		}),
		"last": pseudoHooks.positionalPseudo(function(_, length) {
			return [ length - 1 ];
		}),
		"center": pseudoHooks.positionalPseudo(function(_, length) {
			var remainder = length % 2,
				i = length >= 3 && Math.ceil(length / 2) - 1;
			return [i, !remainder && i !== false && i + 1];
		}),
		"skip": specialFunction(function(i) {
			return access(function(_elem, j) {
				return !(j % (i + 1));
			});
		}),
		"odd": access(function(_elem, i) {
			return i % 2;
		}),
		"even": access(function(_elem, i) {
			return (i + 1) % 2;
		}),
		"lt": specialFunction(function(i) {
			return pseudoHooks.positionalPseudo(function(matchesIndex, length) {
				i = i < 0 ? ~~i + length : i > length ? length : i;
				for(; --i >= 0;) matchesIndex.push(i);
				return matchesIndex.reverse();
			});
		}),
		"gt": specialFunction(function(i) {
			return pseudoHooks.positionalPseudo(function(matchesIndex, length) {
				i = i < 0 ? ~~i + length : i > length ? length : i;
				for(; ++i < length;) matchesIndex.push(i);
				return matchesIndex;
			});
		}),
		"role": specialFunction(function(name) {
			return access(function(elem) {
				return (elem.role || attrVal(elem, "role")) === name;
			});
		}),
		"aria": specialFunction(function(name) {
			name = "aria-" + name.toLowerCase();
			return access(function(elem) {
				return elem[camelCase(name)] != null||attrVal(elem, name) != null;
			});
		}),
		"data": specialFunction(function(name) {
			return access(function(elem) {
				return hasOwn.call(elem.dataset, name) || attrVal(elem, "data-" + name) != null;
			});
		})
	}
};

Expr.pseudos["match"] = Expr.pseudos["rcontains"];
Expr.pseudos["ctx"]	= Expr.pseudos["context"];
Expr.pseudos["nth"]	= Expr.pseudos["eq"];
Expr.pseudos["is"]	= Expr.pseudos["filter"];
Expr.pseudos["imatch"] = Expr.pseudos["ircontains"];

// Add button/input type pseudos
for(i in {submit:true, reset:true, menu:true}) {
	Expr.pseudos[i]=pseudoHooks.inputOrButtonPseudo(i, true);
}

// Add Expr.relative Combinators
for(i in Expr.relative) {
	Expr.combinators[i]=addCombinators(Expr.relative[i]);
}

/**
 * Create Input type :PSEUDO
 * -------------------------
 * A multi input types :pseudo Like :file, :password, :url
 */
access(function(type) {
	Expr.pseudos[type]=pseudoHooks.inputOrButtonPseudo(type);
})(types.match(/\w+/g));

/**
 * Create tokenize selectors parser Method
 * ---------------------------------------
 * Tokenize multi chainable or comma seprated selectors
 */
tokenize=Snizzle.tokenize=function(selector) {
	var soFar, matched, match, groups, tokens,
		type, preFilters, rXPath;

	rXPath = exprMatcher.XPATH;
	soFar = selector.trim();
	groups = [];
	preFilters = Expr.preFilter;

	while(soFar) {
		// Adjust multi comma selectors tokens
		// Comma and first run
		if (!matched || (match = rcomma.exec(soFar))) {
			match && (soFar=soFar.slice(match[0].length)||soFar);
			groups.push((tokens = []));
		}

		matched = false;

		// Tokenize Combinators tokens [>~+<]
		if ((match = rcombinators.exec(soFar))) {
			matched = match.shift();
			tokens.push({
				value: matched,
				type: match[0].replace(rtrim, " ")
			});
			soFar = soFar.slice(matched.length);
		}

		// Tokenize :PSEUDO or TAG or ID or CLASS or ATTR
		for(type in Expr.filter) {
			if ((match = exprMatcher[type].exec(soFar)) &&
				(match = preFilters[type](match))) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match,
					xpath: rXPath.test(matched)
				});
				soFar = soFar.slice(matched.length);
			}
		}

		// If matched false, Stop/Break while loop
		if (!matched) {break};
	}

	// throw an error or return tokens
	return soFar ? Snizzle.error(soFar) : groups.slice(0);
};

/**
 * Create compile External/Internal with public API
 * ------------------------------------------------
 * Select only single XPathExpression selenium selectors elements
 * @param {String} expression Single XPath selenium expression
 * @param {Element|ArrayLike} context An element or elements list
 * @returns {Array} matched seed results
 */
compile = Snizzle.compile = function(expression, context) {
	var selector = doAdjust(expression);
	context = select(selector, context);
	return context;
};

/**
 * Create Internal XPathCache Method
 * ---------------------------------
 * Cached self XPath expression or throwing the XPath RangeError
 * @returns Self cached expression string
 */
function XPathCache(expression) {
	var match = tokenize(expression.trim()), token = match.shift(),
		{value} = token[0];

	value = value.replace(rxptrim, "");

	if (token.length > 1 || match.length) {
		throw new RangeError("Allow only single XPath Expression!");
	}

	// Rreturns cached expression
	return value;
}

/**
 * Create doAdjust XPath Adjuster Method
 * -------------------------------------
 * Adjust XPath Expression to CSS3 or Javascript selector
 * TODO: Need to improve and enhance XPath Adjuster
 */
doAdjust = Snizzle.doAdjust = function(expression) {
	var soFar, match, matched, tokens;
	
	soFar = XPathCache(expression);
	tokens = "";

	while(soFar) {

		// Descendant and Order Expression /html/div[2]
		if ((match = rXpOrdDesc.exec(soFar))) {
			matched = match.shift();
			soFar = soFar.slice(matched.length);
			matched = matched.replace(rslash, " > ").replace(rxpnth, ":nth-child($1)");
			tokens += matched;
		}

		matched = false;

		// Simple Childrens "*" Handling
		if ((match = /^\*/.exec(soFar))) {
			matched = match.shift();
			tokens += matched;
			soFar = soFar.slice(matched.length);
		}

		// :: separates an axis name from a node test in an XPath expression
		if ((match = rXpAxises.exec(soFar))) {
			matched = match.shift();
			console.log(matched);
			soFar = soFar.slice(matched.length);
		}

		if (!matched) {break}
	}

	return soFar.length ? Snizzle.error(soFar) : tokens;
};

/**
 * Create Internal combine Method
 * ------------------------------
 * @param {String} pseudos 
 * Returns matched pseudos handler, Force pseudo to be an pseudo
 * @returns pseudo Function
 */
function combine(pseudos) {
	return Expr.pseudos[pseudos] || Expr._pseudos[pseudos] ||
		Expr.__external[pseudos] || Expr.setFilters[pseudos] ||
		Expr.attrHandle[pseudos];
}

/**
 * Create select Internal or public API
 * ------------------------------------
 * select the chainable and multi complex selector to be easily
 * TODO: Can be improve and enhance select method Handler
 */
select = Snizzle.select = function(selector, context, results) {
	var j, tokens, token, type, seed, fn,
		compiled = typeof selector === "function" && selector,
		match = tokenize((selector = compiled.selector || selector)),
		i = match.length;

	// Force results to be an empry Array
	results = results || [];

	while(i--) {
		tokens = match[i];
		seed = !context.nodeType&&typeof context==="object" ? context :
			slice.call(Expr.find["TAG"]("*", context || document));
		j = 0;

		// Switch seed for single combinator
		if (tokens.length === 1 && rcombinators.test(tokens[0].type)) {
			seed = [context || preferredDoc];
		}

		while((token = tokens[j++])) {
			type = token.type;

			// Compile xPathExpression convert XPath to PSEUDO selector
			if (!!token.xpath && !support.xPathExpression) {
				seed = compile(token.value, seed);

			// Handle: All combinators [>+~<] selectors
			} else if ((fn = Expr.combinators[type])) {
				seed = fn(seed);

			// Otherwise select the all types of selectors
			} else {
				seed = Expr.filter[type].apply(null, token.matches)(seed);
			}
		}

		push.apply(results, seed);
	}
	return unique(results);
};

/**
 * setFilters
 * Easy API for creating new setFilters for Expr
 */
function setFilters() {}
setFilters.prototype=Expr.filters=Expr.pseudos;
Expr.setFilters=new setFilters();

/**
 * Populate public attrHandle map
 * ------------------------------
 * TODO: Need to more improve Populate attrHandle
 */
access(function(attr) {
	Expr.attrHandle[attr] = access(function(elem) {
		return attrVal(elem, attr, "hasAttribute");
	});
})(booleans.match(/\w+/g));

function nodeName(elem) {
	return elem.nodeName && elem.nodeName.toLowerCase();
}

Snizzle.nodeName = nodeName;

/**
 * Create extend External public API
 * ---------------------------------
 * Extend none-existable custom unique :pseudo from out side
 * @param {Boolean} mark true for args base, default false
 * @param {String} name A none-existable unique :pseudo name
 * @param {Function} fnHandler A callback function
 */
function extend(mark, name, fnHandler) {
	// Force arguments
	if (typeof mark==="string") {
		fnHandler = name;
		name = mark;
		mark = false;
	}

	hasOwn.call(Object.assign({},
		Expr.__external,
		Expr.pseudos,
		Expr._pseudos,
		Expr.attrHandle,
		Expr.setFilters
	), name) && (function() {
		throw new TypeError("Cannot set ':" + name + "' already exists.");
	})();

	Expr.__external[name]=mark ? specialFunction(fnHandler) : fnHandler;
}

// Initialize against the default document
setDocument();

/**
 * EXPOSE Snizzle Externally
 * -------------------------
 * expose snizzle externally public API set as globally
 */
_snizzle = window.Snizzle;
Snizzle.noConflict = function() {
	window.Snizzle===Snizzle && (window.Snizzle=_snizzle);
	return Snizzle;
}

// Register as named AMD module, since Codecore can be concatenated with other
// files that may use define
if (typeof define==="function" && define.amd) {
	define(function() {return Snizzle});

// For CommonJS and CommonJS-like environments
// (such as Node.js) expose a factory as module.exports
} else if (typeof module==="object" && module.exports) {
	module.exports = Snizzle;

// Attach layoutResizer in `window` with Expose layoutResizer Identifiers, AMD
// CommonJS for browser emulators (trac-13566)
} else {
	window.Snizzle = Snizzle;
}

// EXPOSE

})(this);