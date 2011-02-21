var Node = require('./node');

var Code = module.exports = function Code(value) {
  this._type = 'code';
  this.values = [value];
};

Code.prototype.__proto__ = Node.prototype;
