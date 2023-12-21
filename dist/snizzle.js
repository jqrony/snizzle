/**
 * Snizzle is advance feature-rich CSS Selector Engine v1.2.3
 * https://snizzlejs.com/
 * 
 * @version 1.2.3
 * 
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * @license MIT
 * https://github.com/jqrony/snizzle/LICENSE
 * 
 * Date: 28 November 2023 02:30 GMT+0530 (India Standard Time)
 */
(function (window) {
var i,
	support,
	unique,
	Expr,
	getText,
	isXML,
	tokenize,
	select,
	contains,

	// Instance-specific data
	expando = "Snizzle" + 1 * Date.now(),
	preferredDoc = window.document,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,

	// Snizzle Engine of version
	version = "1.2.3",

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	indexOf = arr.indexOf,
	push = arr.push,
	slice = arr.slice,

	flat = arr.flat ? function (array) {
		return arr.flat.call(array);
	} : function (array) {
		return arr.concat.apply([], array);
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// HTML Singleton TAGS with no closing TAG
	nctags = "img|input|meta|area|keygen|base|link|br|hr|command|col|param|track|wbr",

	// Regular expressions

	whitespace = "[\\x20\\t\\r\\n\\f]",

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

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp(whitespace + "+", "g"),
	rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g"),

	rcombinators = new RegExp("^" + whitespace + "*([>+~=<]|" + whitespace + ")" + whitespace +
		"*"),
	ridentifier = new RegExp("^" + identifier + "$"),

	matchExpr = {
		"ID": new RegExp("^#(" + identifier + ")"),
		"CLASS": new RegExp("^\\.(" + identifier + ")"),
		"TAG": new RegExp("^(" + identifier + "|[*])"),
		"ATTR": new RegExp("^" + attributes),
		"PSEUDO": new RegExp("^" + pseudos),
		"CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
		bool: new RegExp("^(?:" + booleans + ")$", "i"),
		nocloseTags: new RegExp("^(?:" + nctags + ")$", "i"),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp("^" + whitespace +
			"*[>+~=<]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)/i,
	rheader = /^h\d$/i,
	reditable = /^(?:input|textarea)/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	runiqueRelative = /^[>+~=<]+$/,

	// camelCase Handling regular expression
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// dashed Handling regular expression
	rmsPrefilter = /^ms/,
	rmultiAlpha = /([A-Z])/g,

	// detect rcomma and lcomma and whitespaces
	rcomma = /(^,|,$|\s+)/g,

	rnoneAnimation = /^(none)\s*(0s)\s*(ease)\s*(0s).*(running)/;

function Snizzle(selector, context, results, seed) {
	var m, match, elem,
		newContext = context && context.ownerDocument,

		nodeType = context ? context.nodeType : 9;

	results = results || [];

	if (nodeType !== 1 && nodeType !== 11 && nodeType !== 9 ||
		typeof selector !== "string" || !selector) {
		return document;
	}

	// HANDLE: If not seed[]
	if (!seed) {

		setDocument(context);
		context = context || document;

		if (documentIsHTML) {
			if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {

				// HANDLE: ID matcher (#id)
				if ((m = match[1])) {
					if (nodeType === 9) {
						if ((elem = context.getElementById(m))) {
							results.push(elem);
							return results;
						}
					} else {
						if (newContext && (elem = newContext.getElementById(m))) {
							results.push(elem);
							return results;
						}
					}
					// HANDLE: TAG matcher (h1)
				} else if ((m = match[2])) {
					if ((elem = context.getElementsByTagName(selector))) {
						push.apply(results, elem);
						return results;
					}
					// HANDLE: CLASS matcher (.class)
				} else if ((m = match[3])) {
					if ((elem = context.getElementsByClassName(m))) {
						push.apply(results, elem);
						return results;
					}
				}
			}
		}
	}

	// All others
	return select(selector.replace(rtrim, "$1"), context, results, seed);
}

/**
 * specialFunction method for use special  by Sizzzles
 * @param {Function} fn The function to special target
 * @returns expended fn
 */
function specialFunction(fn) {
	fn[expando] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert(fn) {
	var elem = document.createElement("fieldset");
	try {
		return !!fn(elem);
	}
	catch (e) {
		return false;
	}
	finally {
		if (elem.parentNode) {
			elem.parentNode.removeChild(elem);
		}
		elem = null;
	}
}

/**
 * unique function remove multiple duplicates value
 * @param {Array} obj who do you want to unique arr
 * @returns unique array
 */
function unique(obj) {
	var i = 0,
		elem,
		noDuplicates = [];

	// Don't make unique array if obj !array
	if (!(Array.isArray(obj) || obj.version)) {
		return obj;
	}

	for (; i < obj.length; i++) {
		elem = obj[i];
		if (slice.call(obj).indexOf(elem) === i) {
			noDuplicates.push(elem);
		}
	}

	// empty obj array in deeply and convert empty []
	obj.splice(0, obj.length);

	// Fixes bugs (#empty) Array []
	obj.length = 0;

	// push unique data
	// applying unique data in name of obj #argument
	[].push.apply(obj, noDuplicates);
	return obj || noDuplicates;
}


// Expose support vars for convenience
support = Snizzle.support = {};

Snizzle.dashed = dashed;
Snizzle.camelCase = camelCase;

// SET: current version of Snizzle @VERSION
Snizzle.version = version;

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Snizzle.isXML = function (elem) {
	var namespace = elem && elem.namespaceURI,
		docElem = elem && (elem.ownerDocument || elem).documentElement;

	return !rhtml.test(namespace || docElem && docElem.nodeName || "HTML");
};

/**
 * Snizzle.matches returns expr string to find DOM-Elements
 * @param {String} expr selector matcher with expr :eq(0), :odd, :first etc.
 * @param {Object} elements array of elements
 * @returns matcher DOM-Elements
 */
Snizzle.matches = function (expr, elements) {
	return Snizzle(expr, null, null, elements);
};

// Snizzle error Throwers function
Snizzle.error = function (msg) {
	throw new Error("Syntax Error: unrecognized expression: " + msg);
};

Snizzle.contains = function (context, elem) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ((context.ownerDocument || context) !== document) {
		setDocument(context);
	}

	return contains(context, elem);
};

Snizzle.attr = function (elem, name) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ((elem.ownerDocument || elem) !== document) {
		setDocument(elem);
	}

	var fn = Expr.attrHandle[name.toLowerCase()],
		val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ?
			fn(elem) : undefined;

	return val !== undefined && val.length ?
		val :
		support.attributes || !documentIsHTML ?
			checker(elem, "getAttribute", name) :
			((val = checker(elem, "getAttributeNode", name))) && val.specified ?
				val.value : null;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Snizzle.setDocument = function (node) {
	var hasCompare,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if (doc == document || doc.nodeType !== 9 || !doc.documentElement) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML(document);

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert(function (el) {
		docElem.appendChild(el).appendChild(document.createElement("div"));
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll(":scope fieldset div").length;
	});

	/* Attributes
	--------------------------------------------------------------------------- */
	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function (el) {
		el.className = "j";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	--------------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function (el) {
		el.appendChild(document.createComment(""));
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<=9
	support.getElementsByClassName = rnative.test(document.getElementsByClassName);

	/* QSA/matchesSelector
	--------------------------------------------------------------------------- */

	// QSA and matchesSelector support
	support.qsa = rnative.test(document.querySelectorAll);

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function (el) {
		docElem.appendChild(el).id = expando;
		return !document.getElementsByName || document.getElementsByName(expando).length;
	});

	/* #ID
	--------------------------------------------------------------------------- */
	if (support.getById) {
		Expr.filter["ID"] = specialFunction(function (id) {
			return access(function (elem) {
				return elem && elem.id === id || attrchecker(elem, "id") === id;
			});
		});
	} else {
		Expr.filter["ID"] = specialFunction(function (id) {
			return access(function (elem) {
				var node = checker(elem, "getAttributeNode", "id");
				return node && node.nodeValue === id;
			});
		});
	}


	/* TAG
	--------------------------------------------------------------------------- */
	Expr.find["TAG"] = support.getElementsByTagName ?
		function (tag, context) {
			if (typeof context.getElementsByTagName !== "undefined") {
				return context.getElementsByTagName(tag);

				// DocumentFragment nodes don't have gEBTN
			} else if (support.qsa) {
				return context.querySelectorAll(tag);
			}
		} :

		function (tag, context) {
			var elem, tmp = [], i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName(tag);

			// HANDLE: If tag is equal to "*"
			if (tag === "*") {
				while ((elem = results[i++])) {
					if (elem.nodeType === 1) {
						tmp.push(elem);
					}
				}

				return tmp; // return only nodeType 1 elements
			}

			return results;
		}

	/* CLASS
	--------------------------------------------------------------------------- */
	Expr.find["CLASS"] = support.getElementsByClassName &&
		function (className, context) {
			if (documentIsHTML &&
				typeof context.getElementsByClassName(className)) {
				return context.getElementsByClassName(className);

				// DocumentFragment nodes don't have gEBCN
			} else if (support.qsa) {
				return context.querySelectorAll(className);
			}
		}

	/* contains
	--------------------------------------------------------------------------- */
	hasCompare = rnative.test(docElem.compaireDocumentPosition);

	contains = hasCompare || rnative.test(docElem.contains) ?
		function (context, elem) {

			htmlNode = context.nodeType === 9 ? context.documentElement : context,
				elemPnode = elem && elem.parentNode;

			return htmlNode === elemPnode || !!(elemPnode &&
				elemPnode.nodeType === 1 && (context.contains ? context.contains(elem) :
					context.compaireDocumentPosition && context.compaireDocumentPosition(elem)
				));
		} :
		function (context, elem) {
			if (elem) {
				while ((elem = elem.parentNode)) {
					if (context === elem) {
						return true;
					}
				}
			}
			return false;
		};

	/* DOCUMENT
	--------------------------------------------------------------------------- */
	return document;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @return {Array|Element} elem
 */
getText = Snizzle.getText = function (elem) {
	var node,
		text = "",
		i = 0,
		nodeType = elem.nodeType;

	if (!nodeType) {
		while ((node = elem[i++])) {
			text += getText(node);
		}

	} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {

		// Use textContent for elements
		if (typeof elem.textContent === "string") {
			return elem.textContent;
		}
		else {
			// Traverse its children
			for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
				text += getText(elem);
			}
		}

		// HANDLE: textNode <= nt===3, any <= nt===4
	} else if (nodeType === 3 || nodeType === 4) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes
	return text;
};

/**
 * makeParam function basically used on arguments setup. argument setup
 * in include object, length or object, empty array [], only
 * @param {Function} callback Pass function whereas you want to called
 * @returns arged caller Function value
 */
function makeParam(each, callback) {
	if (each === true) {

		return function (obj) {
			var extend = [], i = 0, val,
				length = obj.length;

			for (; i < length; i++) {
				val = callback(obj[i], obj, obj.length);
				val && extend.push(val);
			}

			return extend;
		}
	}

	// Force callback to be an Function
	callback = each || callback;

	return function (obj) {
		return callback(obj, obj.length, []) || [];
	};
}

/**
 * access method work as like each and map method 2 in 1 function mutual
 * @param {Boolean} mapped true | false By default SET: false, if you are
 * pass true value so access method work as map methods
 * @param {Function} callback Pass a function whereas you want to called
 * @returns main function
 */
access = Snizzle.access = function (mapped, callback) {
	/**
	 * @param {HTMLElement|Object} obj
	 * @returns matched Elements of array
	 */
	return function (obj) {
		var i = 0, length = obj.length,
			value,
			ret = [];

		// shift arguments for to be Boolean
		if (typeof mapped === "function") {
			callback = callback || mapped;
			mapped = false;
		}

		for (; i < length; i++) {
			value = callback(obj[i], i, obj, length);
			(mapped === true && value != null) &&
				ret.push(value) || (value && ret.push(obj[i]));
		}

		return unique(flat(ret));
	};
};

/**
 * schunk split or break string from comma and adjust whitespce
 * @param {String} expr Selector expr string with comma
 * @returns chunked-spered string array
 */
function schunk(expr) {
	return expr.replace(rcomma, " ").trim().split(",");
}

/**
 * checker function check support element attribute and sort-hand method
 * @param {Object|HTML} elem HTML Elements object with object or array
 * @param {String} methods function in Elements method
 * @param {String} value access final direct short hand method
 * @returns matched value
 */
function checker(elem, methods, value) {
	return elem[methods] && elem[methods](value) || elem[value];
}

/**
 * Retuns createHiddenPseudo only hidden or visible Elements
 * @param {Boolean} isHidden true for Hidden | false for Visible
 * @returns HTMLElements
 */
function createHiddenPseudo(isHidden) {
	return access(function (elem) {
		var visibility = window.getComputedStyle(elem).visibility === "hidden";
		return (visibility || elem.hidden) === isHidden;
	});
}

/**
 * createFormsPseudo method identify form tag in GET/POST method
 * @param {String} method GET | POST
 * @returns HTMLElements
 */
function createFormsPseudo(method) {
	// Know :GET only detect the method get in form elements and :POST only get method post form elements
	return access(function (elem) {
		var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
		return nodeName === "form" &&
			checker(elem, "getAttribute", "method").toUpperCase() === method;
	});
}

/**
 * Returns createInputPseudo only <input /> Elements with type="target"
 * @param {String} type input type [type="yourtype"]
 * @returns createInputPseudo
 */
function createInputPseudo(type) {
	return access(function (elem) {
		var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
		return nodeName === "input" && elem.type === type;
	});
}

/**
 * Returns createButtonPseudo method only button Elements
 * @param {String} type Button of type
 * @returns createButtonPseudo
 */
function createButtonPseudo(type) {
	return access(function (elem) {
		var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
		return nodeName === "button" && elem.type === type;
	});
}

/**
 * Returns createURLPseudo method SRC/HREF Elements
 * @param {String} attr SRC | HREF
 * @returns createURLPseudo
 */
function createURLPseudo(attr) {
	return access(function (elem) {
		return elem && !!checker(elem, "getAttribute", attr);
	});
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 * @returns Boolean
 */
function createDisabledPseudo(disabled) {
	return access(function (elem) {
		if ("form" in elem) {
			if (elem.parentNode && elem.disabled === false) {

				if ("label" in elem) {
					if ("label" in elem.parentNode) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.disabled === disabled ||
					elem.disabled !== !disabled;
			}

			return elem.disabled === disabled;

		} else if ("label" in elem) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	});
}

// Used by dashed as callback to replace()
function fdashed(_all, letter) {
	return ("-" + letter).toLowerCase();
}

// Used by camelCase as callback to replace()
function fcamelCase(_all, letter) {
	return letter.toUpperCase();
}

// Convert camelCase to dashed; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function dashed(string) {
	return string.replace(rmsPrefilter, "-ms").replace(rmultiAlpha, fdashed);
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase(string) {
	return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
}

// attrchecker Check the multiple attribute (id, class, data-attr)
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function attrchecker(elem, attr, isDataAttr) {
	if (isDataAttr === true) {
		attr = ("data-" + attr);
	}
	return elem.getAttribute && elem.getAttribute(dashed(attr)) != null;
}


Expr = Snizzle.selectors = {

	pseudosLength: this.length,

	match: matchExpr,

	attrHandle: {},

	find: {},

	preFilter: {},

	createPseudo: specialFunction,

	filter: {

		"TAG": specialFunction(function (tnSelector) {
			return access(function (elem) {
				tnSelector = tnSelector && tnSelector.toLowerCase();
				return tnSelector === "*" ? true :
					elem.nodeName.toLowerCase() === tnSelector;
			});
		}),

		"CLASS": specialFunction(function (cnSelector) {
			return access(function (elem) {
				var pattern;

				return (pattern = new RegExp("(^|" + whitespace + ")" +
					cnSelector + "(" + whitespace + "|$)")) &&
					pattern.test(
						typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || ""
					);
			});
		}),

		"ATTR": specialFunction(function (name, operator, check) {
			return access(function (elem) {
				var result = Snizzle.attr(elem, name) || elem.hasAttribute(name) && name || "";

				if (result == null) {
					return operator = "!=";
				}

				if (!operator) {
					return !!result;
				}

				result += "";

				/* eslint-disable max-len */
				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf(check) === 0 :
							operator === "*=" ? check && result.indexOf(check) > -1 :
								operator === "$=" ? check && result.slice(-check.length) === check :
									operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 :

										operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" :
											false;
				/* eslint-enable max-len */
			});
		}),

		"CHILD": specialFunction(function (child) {
			return access(true, function (elem) {
				return !!(elem.querySelectorAll(child) || []).length;
			});
		}),

		"PSEUDO": function (pseudo, argument) {

			// pseudo-class names are case-insensitive
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] ||
				Snizzle.error("Unsupported pseudo: Compilation failed your '" + pseudo + "' is not supported.");

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Snizzle does
			if (fn[expando]) {
				return fn(argument);
			}


			// Return none-special pseudos function
			return fn;
		}
	},

	exprRelative: {
		" ": access(true, function (elem) {
			return slice.call(Expr.find["TAG"]("*", elem));
		}),

		">": access(true, function (elem) {
			return slice.call(elem.children.length && elem.children);
		}),

		"+": access(true, function (elem) {
			var sibling;
			if ((sibling = elem.nextElementSibling)) {
				return sibling;
			}
		}),

		"~": access(true, function (elem) {
			var ret = [];
			while ((elem = elem.nextElementSibling)) {
				ret.push(elem);
			}
			return ret;
		}),

		"=": access(true, function (elem) {
			var sibling;
			if ((sibling = elem.previousElementSibling)) {
				return sibling;
			}
		}),

		"<": access(true, function (elem) {
			var ret = [];
			while ((elem = elem.previousElementSibling)) {
				ret.push(elem);
			}
			return ret;
		})
	},

	pseudos: {

		"not": specialFunction(function (selector) {
			var target = jQrony(selector);
			return access(function (elem) {
				return (indexOf.call(target, elem) > -1) === false;
			});
		}),

		"has": specialFunction(function (selector) {
			return access(function (elem) {
				return Snizzle(selector, elem).length > 0;
			});
		}),

		"filter": specialFunction(function (selector) {
			return access(function (elem) {
				var target = jQrony(selector);
				return (indexOf.call(target, elem) > -1) === true;
			});
		}),

		"theme": access(function (elem) {
			var ctv = checker(elem, "getAttributeNode", "name") || elem.name,
				nodeName = elem.nodeName;
			if (ctv && nodeName === "META") {
				return (ctv.nodeValue || ctv) === "theme-color";
			}
		}),

		"iscript": access(function (elem) {
			return elem.nodeName === "SCRIPT" &&
				(!checker(elem, "getAttribute", "src") || !elem.src);
		}),

		"guard": access(function (elem) {
			return elem.nodeName === "BODY" || window.document.body === elem;
		}),

		// "nocloser" pseudos find only no closing tags <input /> <img />
		"nocloser": access(function (elem) {
			return elem.nodeName && matchExpr.nocloseTags.test(elem.nodeName);
		}),

		// "closer" pseudos find only closing tags <div></div>,<p></p>
		"closer": access(function (elem) {
			return elem.nodeName && !matchExpr.nocloseTags.test(elem.nodeName);
		}),

		"title": access(function (elem) {
			return checker(elem, "hasAttribute", "title");
		}),

		"contains": specialFunction(function (text) {
			return access(function (elem) {
				return (elem.textContent || getText(elem)).indexOf(text) > -1;
			});
		}),

		// "lang" work only lang attribute Elements By default select <html lang="en">
		"lang": specialFunction(function (lang) {

			// lang value must be a valid identifier
			if (!ridentifier.test(lang || "")) {
				Snizzle.error("Unsupported Language: " + lang);
			}

			// change case lang toLowerCase
			lang = (lang + "").toLocaleLowerCase();

			return access(function (elem) {
				do {
					var langElem;
					if ((langElem = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {

						// change case langElem toLowerCase
						langElem = langElem.toLowerCase();
						return langElem === lang || langElem.indexOf(lang + "-") === 0;
					}
				}
				while ((elem = elem.parentNode) && elem.nodeType === 1);
				return false;
			})
		}),

		// Miscellaneous
		"target": access(function (elem) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice(1) === elem.id;
		}),

		"root": access(function (elem) {
			return elem === docElem;
		}),

		"focus": access(function (elem) {
			return elem === elem.activeElement &&
				(!document.hasFocus || document.hasFocus()) ||
				!!(elem.type || elem.href || ~elem.tabIndex);
		}),

		// Boolean properties
		"visible": createHiddenPseudo(false),
		"hidden": createHiddenPseudo(true),

		"get": createFormsPseudo("GET"),
		"post": createFormsPseudo("POST"),

		"enabled": createDisabledPseudo(false),
		"disabled": createDisabledPseudo(true),

		"checked": access(function (elem) {
			var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) ||
				(nodeName === "option" && !!elem.selected);
		}),

		"selected": access(function (elem) {

			if (elem.parentNode) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		}),

		// Contents
		// empty Elements
		"empty": access(function (elem) {

			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; Clazzer ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
				if (elem.nodeType < 6) {
					return false;
				}
			}
			return true;
		}),

		"parent": access(function (_elem, i, seed) {
			return !Expr.pseudos["empty"](seed)[i];
		}),

		// Search none-disabled, readonly and contenteditable=true Elements
		// Find specific editable Elements input/textarea, "editable=true";
		"editable": access(function (elem) {
			return (reditable.test(elem.nodeName) && !elem.disabled && !elem.readOnly) ||
				(checker(elem, "getAttribute", "contenteditable"));
		}),

		// Elements/input types pseudos
		"header": access(function (elem) {
			return rheader.test(elem.nodeName);
		}),

		"input": access(function (elem) {
			return rinputs.test(elem.nodeName);
		}),

		"button": access(function (elem) {
			var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
			return (nodeName === "button" || (nodeName === "input" && elem.type === "button"));
		}),

		"text": access(function (elem) {
			var attr,
				nodeName = elem.nodeName && elem.nodeName.toLowerCase();
			return nodeName === "input" && elem.type === "text" &&
				((attr = elem.getAttribute("type")) == null ||
					attr.toLowerCase() === "text");
		}),

		"ctx": makeParam(true, function (elem) {
			return rnative.test(elem.getContext) && elem.getContext("2d");
		}),

		// Position-in-collection pseudos
		"eq": specialFunction(function (i) {
			return makeParam(function (seed, length) {
				return [seed[+i < 0 ? +i + length : +i]];
			});
		}),

		"first": function (seed) {
			return Expr.pseudos["eq"](0)(seed);
		},

		"last": function (seed) {
			return Expr.pseudos["eq"](-1)(seed);
		},

		"center": makeParam(function (seed, length) {
			return Expr.pseudos["eq"](parseInt(length / 2))(seed);
		}),

		"even": access(function (_elem, i) {
			return (i + 1) % 2;
		}),

		"odd": access(function (_elem, i) {
			return i % 2;
		}),

		"lt": specialFunction(function (paire) {
			return makeParam(function (seed, length, matchIndexes) {
				var i = +paire < 0 ? +paire + length : +paire > length ? length : +paire;
				for (; --i >= 0;) {
					matchIndexes.push(seed[i]);
				}
				return matchIndexes.reverse();
			});
		}),

		"gt": specialFunction(function (paire) {
			return makeParam(function (seed, length, matchIndexes) {
				var i = +paire < 0 ? +paire + length : + paire;
				for (; ++i < length;) {
					matchIndexes.push(seed[i]);
				}
				return matchIndexes;
			});
		}),

		"skip": specialFunction(function (paire) {
			return makeParam(function (seed, length, matchIndexes) {
				var i = 0;
				paire = +paire < length && +paire > 0 ? +paire : length;
				for (; i < length; i += paire) {
					matchIndexes.push(seed[i]);
				}
				return matchIndexes;
			});
		}),

		"offset": access(function (elem) {
			return elem.nodeType && elem.nodeType !== 9 &&
				window.getComputedStyle(elem).position !== "static" || elem === docElem;
		}),

		"data": specialFunction(function (data) {
			return access(function (elem) {
				return elem.dataset[data] != null || attrchecker(elem, data, true);
			});
		}),

		"animated": access(function (elem) {
			var animation = elem.nodeType && window.getComputedStyle(elem).animation;
			return !rnoneAnimation.test(animation) || elem.nodeName === "MARQUEE";
		}),
	}
};

Expr.pseudos["ignore"] = Expr.pseudos["skip"];
Expr.pseudos["middle"] = Expr.pseudos.center;
Expr.pseudos["is"] = Expr.pseudos["filter"];
Expr.pseudos["nth"] = Expr.pseudos["eq"];
Expr.pseudos["context"] = Expr.pseudos["get2d"] = Expr.pseudos["ctx"];

// Add button/input type pseudos
for (i in {
	radio: true, checkbox: true,
	file: true, password: true, image: true, search: true, url: true, range: true
}) {
	Expr.pseudos[i] = createInputPseudo(i);
}

for (i in { submit: true, reset: true, menu: true }) {
	Expr.pseudos[i] = createButtonPseudo(i);
}

// Add src/href attribute pseudos
for (i in { src: true, href: true }) {
	Expr.pseudos[i] = createURLPseudo(i);
}


access(function (attr) {
	Expr.attrHandle[attr] = access(function (elem) {
		return !!checker(elem, "hasAttribute", attr);
	});
})(booleans.match(/\w+/g));


// Easy API for creating new setFilters
function setFilters() { }
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();


tokenize = Snizzle.tokenize = function (selector) {
	var matched, soFar, match, groups, type;

	soFar = selector.trim();
	groups = [];

	while (soFar) {

		matched = false;

		if ((match = rcombinators.exec(soFar))) {
			matched = match.shift();

			groups.push({
				value: matched,
				type: match[0].replace(rtrim, " ")
			});
			soFar = soFar.slice(matched.length);
		}

		for (type in Expr.filter) {
			if ((match = matchExpr[type].exec(soFar))) {
				matched = match.shift();
				groups.push({
					type: type,
					value: matched,
					matches: match,
					unique: match[0]
				});
				soFar = soFar.slice(matched.length);
			}
		}

		if (!matched) {
			break;
		}
	}

	return soFar.length && soFar ?
		Snizzle.error(soFar) :
		groups.slice(0);
};

function getDefaultAllDocumentElements(results, outermost) {
	var elem, seed = results || [],
		i = 0,

		// We must always have either seed elements or outermost context
		elems = outermost && Expr.find["TAG"]("*", outermost),
		len = elems.length;

	// Add elements passing elementMatchers directly to results
	// Support: IE<9, Safari
	for (; i != len && (elem = elems[i]) != null; i++) {
		if (elem && elem.nodeType) {
			seed.push(elem);
		}
	}

	return seed;
}

select = Snizzle.select = function (selector, context, results, seed) {

	var i = 0, tokens, match, j, token, matched, seedAdjusted;

	// chunk/split selector at pos (,) and trim whitespace
	selector = schunk(selector);

	// Force results to be an empty [array]
	results = results || [];

	while ((tokens = selector[i++])) {

		// HANDLE: If seed is empty and not exists or array (#seed)
		// FORCE: force a seed to be an seed Elements object
		seedAdjusted = seed;
		if (seed == null) {
			seedAdjusted = [];
			getDefaultAllDocumentElements(seedAdjusted, context || preferredDoc);
		}

		match = tokenize(tokens);
		j = 0;

		while ((token = match[j++])) {

			// FIND: Only single combination none-expr char [>+~] symbol
			// TARGET: context node @return [context] elements
			if ((matched = runiqueRelative.exec(tokens))) {
				seedAdjusted = Expr.exprRelative[matched[0]]([context]);
			}

			// RUN: Execute exprRelative pseudos [>+~] symbol in deepth
			else if (Expr.exprRelative[token.type]) {
				seedAdjusted = Expr.exprRelative[token.type](seedAdjusted);

				// ALWAYS: Execute all type PSEUDO (TAG|ID|ATTR|CLASS) expr
			} else {
				seedAdjusted = Expr.filter[token.type](
					token.matches[0], token.matches[1],
					(token.matches[2] || token.matches[3] || token.matches[4])
				)(seedAdjusted);
			}
		}

		push.apply(results, seedAdjusted);
	}

	// unique( results ); // UNIQUE: results object
	return results;
};

// one time assignments
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