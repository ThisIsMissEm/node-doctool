// Author: Micheil Smith <micheil@brandedcode.com>
// Based heavily off work by TJ Holowaychuk <tj@vision-media.ca>

var Lexer = module.exports = function Lexer(str) {
  this.input = str.replace(/\r\n|\r/gm, '\n').replace(/\t/gm, '  ');
  this.lineno = 1;
  this._lines = str.match(/\n/g).length;
};


/**
 * Lexer prototype.
 */
Lexer.prototype = {
  tok: function(type, len, values) {
    return {
      type: type,
      line: this.lineno,
      values: values,
      len: len
    };
  },

  consume: function(len) {
    this.input = this.input.substr(len);
  },

  scan: function(regexp, type) {
    var captures;
    if (captures = regexp.exec(this.input)) {
      return this.tok(type, captures[0].length, captures.slice(1));
    }
  },

  get eos() {
    if (this.lineno <= this._lines) return;
    return this.tok('eos', 0);
  },

  get module() {
    return this.scan(/^Module\: ([^\(|^$]+)\s*(\([^\)]*\))/, 'module');
  },

  get method() {
    return this.scan(/^Method: ([^\(|\n]+)(\([^\)]+\))/, 'method');
  },

  get event() {
    return this.scan(/^Event: ([^\n]+)/, 'event');
  },

  get param() {
    return this.scan(/^Param: (\w+) \{([^\}]+)\} (.+)/, 'param');
  },

  get property() {
    return this.scan(/^Property: ([^\n]+)/, 'property');
  },


	get constructor() {
    return this.scan(/^Constructor\: ([^\n]+)/, 'constructor');
  },

	get inherits() {
		return this.scan(/^Inherits\: ([^\n]+)/, 'inherits');
	},

	// get heading() {
	//   return this.scan(/^([#]{1,6})\s*(.+)/, 'heading');
	// },
	// 
	// get list() {
	// 	return this.scan(/^([ \t]*)([\*-]|\d\.)\s+([^\n]*)\n/, 'listitem');
	// }

	get code() {
    return this.scan(/^(\t|[ ]{4})(\t|[ ]{2})*([^\n]*)/, 'code');
  },

  get text() {
    return this.scan(/^([^\n]+)/, 'text');
  },

  get newline() {
    return this.scan(/^\n/, 'newline');
  },

	// LEGACY:
	get klass() {
    return this.scan(/^Class\: ([^\n]+)/, 'klass');
  },

  /**
   * Return the next token object, or those
   * previously stashed by lookahead.
   */
  advance: function() {
    var next = this.next;

    if(next.type === 'newline') {
      next.line = ++this.lineno;
    }

    this.consume(next.len);

    return next;
  },

  /**
   * Return the next token object.
   */
  get next() {
    return this.eos ||
				this.module ||
        this.constructor ||
				this.klass || // <- deprecated
				this.inherits ||
        this.method ||
        this.event ||
        this.property ||
        this.param ||
        this.code ||
        this.text ||
        this.newline;
  }
};
