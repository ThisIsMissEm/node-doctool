// Author: Micheil Smith <micheil@brandedcode.com>
// Based heavily off work by TJ Holowaychuk <tj@vision-media.ca>

var Lexer = module.exports = function Lexer(str) {
  this.input = str.replace(/\r\n|\r/gm, '\n').replace(/\t/gm, '  ');
  this.lineno = 1;
  this.stash = [];
};


/**
 * Lexer prototype.
 */
Lexer.prototype = {
  tok: function(type, val) {
    return {
      type: type,
      line: this.lineno,
      vals: val
    };
  },

  consume: function(len) {
    this.input = this.input.substr(len);
  },

  scan: function(regexp, type) {
    var captures;
    if (captures = regexp.exec(this.input)) {
      this.consume(captures[0].length);
      return this.tok(type, captures.slice(1));
    }
  },

  lookahead: function(n) {
    var fetch = n - this.stash.length;
    while (fetch-- > 0) this.stash.push(this.next);
    return this.stash[--n];
  },
  
  get peek() {
    return this.lookahead(1);
  },

  get stashed() {
    return this.stash.length && this.stash.shift();
  },


  get eos() {
    if (this.input.length) return;
    return this.tok('eos');
  },

  get method() {
    return this.scan(/^Method: ([^\(|\n]+)(\([^\)]+\))/, 'method');
  },

  get event() {
    return this.scan(/^Event: ([^\n]+)/, 'event');
  },

  get property() {
    return this.scan(/^Property: ([^\n]+)/, 'property');
  },

  get module() {
    return this.scan(/^Module\: ([^\(|^$]+)\s*(\([^\)]*\))/, 'module');
  },

	get klass() {
    return this.scan(/^Class\: ([^\n]+)/, 'class');
  },

	get inherits() {
		return this.scan(/^Inherits\: ([^\n]+)/, 'inherits');
	},


	get list() {
	  var captures, listitem = '';
	  if (captures = /^([ \t]*)([\*-]|\d\.)\s+([^\n]*)\n/.exec(this.input)) {
	    this.consume(captures[0].length);
	    listitem = captures[3];
	    
	    while(this.peek.type === 'text') {
        listitem += ' ';
        listitem += this.advance.vals[0];
	    }
	    
	    return this.tok('listitem', [
	      listitem,
	      /\d\./.test(captures[2]) ? 'ol' : 'ul',
	      captures[1].replace(/\t/g, '  ').length / 2
	    ]);
	  }
	},
	
	get heading() {
	  return this.scan(/^([#]{1,6})\s*(.+)/, 'heading');
	},

  get param() {
    var captures;
    if (captures = /^Param: (\w+) \{([^\}]+)\} (.+)/.exec(this.input)) {
      this.consume(captures[0].length);

      return this.tok('param', [
        captures[1],
        captures[2].split('|'),
        captures[3]
      ]);
    }
  },

  get code() {
    return this.scan(/^(\t|[ ]{4})([^\n]*)/, 'code');
  },

  get text() {
    return this.scan(/^([^\n]+)/, 'text');
  },

  get newline() {
    var captures;
    if (captures = /^\n/.exec(this.input)) {
      ++this.lineno;
      this.consume(captures[0].length);
      return this.tok('newline');
    }
  },

  /**
   * Return the next token object, or those
   * previously stashed by lookahead.
   */
  get advance() {
    return this.stashed || this.next;
  },

  /**
   * Return the next token object.
   */
  get next() {
    return this.eos ||
				this.module ||
        this.klass ||
				this.inherits ||
        this.method ||
        this.event ||
        this.property ||
        this.param ||
				this.list ||
				this.heading ||
        this.code ||
        this.text ||
        this.newline;
  }
};
