var Node = require('./node');

var List = module.exports = function List(type, value) {
  this._type = 'list';
  this.type = type;
  this.items = [value];
};

List.prototype.__proto__ = Node.prototype;
