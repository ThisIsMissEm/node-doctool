
var Node = require('./node');

var Param = module.exports = function Param(name, type, optional, description) {
  this.name = name;
  this.type = type;
  this.optional = optional;
  this.description = description;
};

Param.prototype.__proto__ = Node.prototype;
