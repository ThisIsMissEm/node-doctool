

var Node = module.exports = function Node(parent, type) {
  this._parent = parent || null;
  this._type = type || 'node';
};

Node.prototype.toJSON = function() {
  Object.keys(this).forEach(function(key) {
    // Remove keys that begin with an underscore, these are for parser use only.
    if(key[0] === '_') {
      delete this[key];
    }
  }, this);
  return this;
}