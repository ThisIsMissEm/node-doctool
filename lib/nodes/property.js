var Node = require('./node');

var Property = module.exports = function Property(name, value, type, desc) {
  this._type = 'property';
  this.name = name;
  this.type = type;
  this.description = [];
  this.value = value;
};

Property.prototype.__proto__ = Node.prototype;
