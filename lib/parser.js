

var Lexer = require('./lexer');
var Nodes = require('./nodes');

function saveNode(tree, node) {
  if (node && typeof node === 'object') {
    if (tree instanceof Nodes.Class) {
      switch (node._type) {
        case 'method':
          tree.methods.push(node);
          break;
        case 'property':
          tree.properties.push(node);
          break;
        case 'event':
          tree.events.push(node);
          break;
        default:
          tree.other.push(node);
          break;
      }
    } else {
      tree.push(node);
    }
  }
}


var Parser = module.exports = function Parser(str, filename) {
  this.filename = filename;
  this.input = str;
  this.lexer = new Lexer(str);
};


Parser.prototype = {
  get advance() {
    return this.lexer.advance;
  },

  get peek() {
    return this.lookahead(1);
  },

  get line() {
    return this.lexer.lineno;
  },

  lookahead: function(n) {
    return this.lexer.lookahead(n);
  },

  parse: function() {
    var node, token, args,
        currentElement = '',
        currentTree,
        tree = [],
        captures;

    while (this.peek.type !== 'eos') {
      switch (this.peek.type) {
        case 'newline':
          this.advance;
          break;
        case 'class':
          currentElement = 'class';

          saveNode(currentTree, node);
          saveNode(tree, currentTree);

          token = this.advance.val;
          currentTree = new Nodes.Class(token[0]);
          break;
        case 'property':
          saveNode(currentTree, node);

          token = this.advance.val;

          currentElement = 'property';
          node = new Nodes.Property(token[0]);

          break;
        case 'event':
          saveNode(currentTree, node);

          token = this.advance.val;

          currentElement = 'event';
          node = new Nodes.Event(token[0]);

          break;
        case 'method':
          saveNode(currentTree, node);

          token = this.advance.val;

          currentElement = 'method';
          node = new Nodes.Method(token[0], token[1]);

          args = token[1].match(/((?:\[)?([a-zA-Z0-9_]+)(?:\])?)/gmi);

          args.forEach(function(arg) {
            name = arg.replace(/[\[\]]/g, '');
            node.params[name] = new Nodes.Param(
                (name === 'callback' ? ['Function'] : []),
                /[\[\]]/g.test(arg));
          });

          break;
        case 'param':
          token = this.advance.val;

          if (node._type === 'method' || node._type === 'event') {
            param = token[0];
            if (node.params[param] === undefined) {
              node.params[param] = new Nodes.Param(token[1], false, token[2]);
            } else {
              node.params[param].type = token[1];
              node.params[param].description = token[2];
            }
          }
          break;
        case 'text':
        case 'code':
          if (currentElement === 'method' ||
              currentElement === 'property' ||
              currentElement === 'event') {
            node.description.push(this.parseTextOrCode());
          } else {
            currentTree.description.push(this.parseTextOrCode());
          }

          break;
        default:
          this.advance;
          break;
      }
    }

    saveNode(currentTree, node);
    saveNode(tree, currentTree);

    return tree;
  },

  parseTextOrCode: function() {
    var token = this.advance;
    var node = {
      type: token.type,
      val: [token.val[0]]
    };

    while (
        (this.peek.type === 'newline' &&
        this.lookahead(2).type === token.type) ||
        this.lookahead(1).type === token.type
    ) {
      if (this.peek.type === 'newline') {
        this.advance;
      } else {
        node.val.push(this.advance.val[0]);
      }
    }

    return node;
  },

  expect: function(type) {
    if (this.peek.type === type) {
      return this.advance;
    } else {
      throw new Error(
          'expected "' + type + '", but got "' + this.peek.type + '"'
      );
    }
  },

  accept: function(type) {
    if (this.peek.type === type) {
      return this.advance;
    }
  }
};
