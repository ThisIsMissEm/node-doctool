var Node = require('./node');

var Class = module.exports = function Class(name) {
  this._type = 'module';
  this.name = name;
  this.description = [];
};

Class.prototype.__proto__ = Node.prototype;
