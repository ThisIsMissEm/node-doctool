var Node = require('./node');

var Class = module.exports = function Class(name) {
  this._type = 'class';
  this.name = name;
  this.description = [];
  this.methods = [];
  this.events = [];
  this.properties = [];
  this.other = [];
};

Class.prototype.__proto__ = Node.prototype;
