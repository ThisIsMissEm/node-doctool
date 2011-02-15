// Author: Micheil Smith <micheil@votizen.com>
// Based heavily off work by TJ Holowaychuk <tj@vision-media.ca>

var Lexer = module.exports = function Lexer(str) {
  this.input = str.replace(/\r\n|\r/g, '\n').replace(/\t/g, '  ');
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
      val: val
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

  get stashed() {
    return this.stash.length && this.stash.shift();
  },


  get eos() {
    if (this.input.length) return;
    return this.tok('eos');
  },

  get method() {
    return this.scan(/^### ([^\(|\n]+)(\([^\)]+\))/, 'method');
  },

  get event() {
    return this.scan(/^### Event: ([^\n]+)/, 'event');
  },

  get property() {
    return this.scan(/^### ([^\n]+)/, 'property');
  },

  get cls() {
    return this.scan(/^## ([^\n]+)/, 'class');
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
    return this.scan(/^    ([^\n]*)/, 'code');
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
        this.cls ||
        this.method ||
        this.event ||
        this.property ||
        this.param ||
        this.code ||
        this.text ||
        this.newline;
  }
};
