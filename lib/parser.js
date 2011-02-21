var Lexer = require('./lexer');
var Tree = require('./tree');
var nodes = require('./nodes');


function Node(name, type){
  return {
    name: name,
    _type: type
  };
}

function log(object) {
  var util = require('util');
  process.stdout.write(util.inspect(object, false, 1000, true) + '\n');
}

function addLeaf(tree, name, node) {
  if (!tree[name] || tree[name] === null) {
    if (node) {
      tree[name] = [node];
    } else {
      tree[name] = [];
    }
  } else if(node) {
    tree[name].push(node);
  }
  return tree;
}

function addLeafTree(tree, name, node) {
  return addLeaf(tree, name, node)[name];
}

function types(type) {
  switch(type) {
    case 'event':
      return 'events';
      break;
    case 'method':
      return 'methods';
      break;
    case 'class':
      return 'classes';
      break;
    case 'property':
      return 'properties';
      break;
    default:
      return 'other';
      break;
  }
}

function max(a, b) {
  return a > b ? a : b;
}


var Parser = module.exports = function Parser(str, filename) {
  this.filename = filename;
  this.input = str;
  this.lexer = new Lexer(str);

  this.tree = new Tree();
  this.tree.addAndDescend('modules', []);
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
    while (this.peek.type !== 'eos') {
      if (this.peek.type === 'newline') {
        this.advance;
      } else {
        this.parseExpr();
      }
    }

    return this.tree;
  },

  parseExpr: function() {
    var tok = this.advance;
    var optional = false;
    var args, idx, node, leaf;
    
    console.log(">>>>> ", tok.type, this.tree.current()._type);
    
    switch(tok.type) {
      case 'module':
        node = new nodes.Module(tok.vals[0]);
        this.tree.root();
        this.tree.addAndDescend('modules', node);
        
        this.tree.down(this.tree.current().length - 1);        
        break;
      case 'class':
        node = new nodes.Class(tok.vals[0], 'class');

        this.tree.root();
        this.tree.down('modules');
        this.tree.down(this.tree.current().length - 1);
        
        if(!this.tree.contains('classes')) this.tree.add('classes', []);
        this.tree.down('classes');
        this.tree.addAndDescend(this.tree.current().length, node);

        break;
      case 'inherits':
        this.tree.expectType('class');
        this.tree.add('inherits', tok.vals[0]);
        break;
      case 'method':
        this.tree.expectType(['param', 'text', 'method', 'module', 'class']);
        
        console.error(this.tree.current())
        
        if(this.tree.isType('method')) {
          this.tree.up()
        } else {
          if(!this.tree.contains('methods')) this.tree.addAndDescend('methods')
        }
        
        console.error(this.tree.current())
        //         
        //         if(this.tree.isType('method')) this.tree.up();
        //         
        //         if(!this.tree.contains('methods')) this.tree.add('methods', []);
        //         this.tree.down('methods');
        //         
        //         node = new nodes.Method(tok.vals[0], tok.vals[1]);
        //         Object.defineProperty(node, 'parent', {value: this.tree.down('methods')});
        //         
        //         // legacy args:
        //         if(tok.vals[1].indexOf('=') > -1 || tok.vals[1]) {
        //           var args = tok.vals[1].replace(/(\(|\))/gm, '');
        // 
        //           args = args.split(/\,\s*/gm);
        //           
        //           args.forEach(function(_arg){
        //             arg = _arg.split('=');
        //             name = arg[0].replace(/[\[\]]/g, '');
        //             
        //             if(arg.length > 1) node.legacy = true;
        //             
        //             node.params[name] = new nodes.Param(
        //               name,
        //               'unknown',
        //               (arg[0].indexOf('[') > -1 || node.legacy) ? true : false,
        //               node.legacy ? 'Default: ' + arg[1] : ''
        //             );
        //           }, this);
        //         }
        //         
        //         
        //         
        //         this.tree.addAndDescend(this.tree.current().length, node);
        break;
      case 'event':
        // this.tree.expectType(['event', 'module', 'class']);
        //         
        //         if (this.tree.isType('event')) {
        //           this.tree.up();
        //         } else if (this.tree.isType('module') || this.tree.isType('class')) {
        //           this.tree.addAndDescend('events', []);
        //         }
        //         
        //         node = new nodes.Event(tok.vals[0]);
        //         this.tree.addAndDescend(this.tree.current().length, node);
        break;
      case 'param':
        // this.tree.expectType(['method', 'event', 'param']);
        //         
        //         if(this.tree.isType('param')) {
        //           this.tree.up();
        //         } else if(this.tree.isType('method')) {
        //           this.tree.down('params');
        //         }
        //         
        // var args = node.args, vals = tok.vals, type = types(node._type);
        // if (args) {
        //   optional = args.indexOf('[' + tok.vals[0] + ']') > -1;
        // }
        // 
        // if (node.params[vals[0]] === undefined) {
        //  this.tree.current().params[vals[0]] = new nodes.Param(vals[0], vals[1], optional, vals[2]);
        // } else {
        //   node.params[vals[0]]
        // }
        // 
        // this.tree.add()
      //   var node = this.currentNode;
      //
      //   if(!node.legacy) {
      //     var args = node.args, vals = tok.vals, type = types(node._type);
      //
      //     if(args) {
      //       optional = args.indexOf('[' + tok.vals[0] + ']') > -1;
      //     }
      //
      //     node.params[vals[0]] = new nodes.Param(vals[0], vals[1], optional, vals[2]);
      //     this.currentTree[type] = addLeaf(this.currentTree[type], node.name, node);
      //   }
        break;
      case 'text':
        this.tree.down('description');
        if(!this.tree.last().isType('description')){
          this.tree.addAndDescend('description', new Node('values', 'description'));
        }
        
        
        break;
      //   idx = Math.max(this.currentNode.description.length - 1, 0);
      //
      //   if (this.currentNode.description[idx] &&
      //       this.currentNode.description[idx]._type === 'text') {
      //     this.currentNode.description[idx].values.push(tok.vals[0]);
      //   } else {
      //     this.currentNode.description.push(
      //       new nodes.Text(tok.vals[0])
      //     );
      //   }
      //   break;
      // case 'listitem':
      //   idx = Math.max(this.currentNode.description.length - 1, 0);
      //
      //   if (this.currentNode.description[idx] &&
      //       this.currentNode.description[idx]._type === 'list' &&
      //       this.currentNode.description[idx].type === tok.vals[1]) {
      //     this.currentNode.description[idx].items.push(tok.vals[0]);
      //   } else {
      //     this.currentNode.description.push(
      //       new nodes.List(tok.vals[1], tok.vals[0])
      //     );
      //   }
      //   break;
      // case 'heading':
      //     this.currentNode.description.push(new nodes.Heading(tok.vals[0], tok.vals[1]));
      //   break;
      // case 'code':
      //   idx = Math.max(this.currentNode.description.length - 1, 0);
      //
      //   if (this.currentNode.description[idx] &&
      //       this.currentNode.description[idx]._type == 'code') {
      //     this.currentNode.description[idx].values.push(tok.vals[1]);
      //   } else {
      //     this.currentNode.description.push(
      //       new nodes.Code(tok.vals[1])
      //     );
      //   }
      //   break;
      case 'newline':
        break;
      default:
        //console.log(tok.type, tok.vals);
        break;
    }
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
