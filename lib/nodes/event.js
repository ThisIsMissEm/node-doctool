
var Node = require('./node');

var Event = module.exports = function Event(name) {
  this._type = 'event';
  this.name = name;
  this.description = [];
  this.params = {};
};

Event.prototype.__proto__ = Node.prototype;
