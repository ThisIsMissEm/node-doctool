
var Node = require('./node');
var Param = require('./param');

var Method = module.exports = function Method(name, args) {
  this._type = 'method';
  this.name = name;
  this.args = args;
  this.params = {};
  this.description = [];
};

Method.prototype.__proto__ = Node.prototype;
