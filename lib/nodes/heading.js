var Node = require('./node');

var Heading = module.exports = function Heading(level, value) {
  this._type = 'heading';
  this.value = value;
  this.level = level.length;
};

Heading.prototype.__proto__ = Node.prototype;
