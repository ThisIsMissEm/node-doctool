var Node = require('./node');

var Text = module.exports = function Text(value) {
  this._type = 'text';
  this.values = [value];
};

Text.prototype.__proto__ = Node.prototype;
