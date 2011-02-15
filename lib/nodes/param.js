
var Node = require('./node');

var Param = module.exports = function Param(type, optional, description) {
  this.type = type || '';
  this.optional = optional || false;
  this.description = description || '';
};

Param.prototype.__proto__ = Node.prototype;
