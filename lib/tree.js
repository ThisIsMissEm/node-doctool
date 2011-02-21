module.exports = function Tree() {
  var currentNode = root = {};
  var lastNode;
  
  return {
    add: function(name, value, type) {
      console.error("add",name, value);
      if(currentNode[name] === undefined){
        currentNode[name] = (value !== undefined ? value : {});
        if (typeof currentNode[name] === 'object' && !currentNode[name].parent) {
          Object.defineProperty(currentNode[name], 'parent', {value: currentNode});
        }
      } else if(value !== undefined && Array.isArray(currentNode[name])) {
        currentNode[name].push(value);
      } else if(value !== undefined) {
        currentNode[name] = [currentNode[name], value];
      }
      
      if(currentNode[name].name === undefined) currentNode[name].name = name;
      if(currentNode[name]._type === undefined) currentNode[name]._type = type || "object";
      
      lastNode = currentNode[name];
    },
    
    addAndDescend: function(name, value) {
      this.add(name, value);
      this.down(name);
    },
    
    contains: function(name) {
      return currentNode && name in currentNode;
    },
    
    up: function() {
      lastNode = currentNode;
      return currentNode = currentNode.parent;
      console.error("up", currentNode && currentNode._type ? currentNode._type : '', currentNode);
    },
    
    down: function(name) {
      lastNode = currentNode;
      return currentNode = currentNode[name];
      console.error("down", currentNode && currentNode._type ? currentNode._type : '', currentNode);
    },
    
    current: function() {
      return new Node(currentNode);
    },
        
    last: function() {
      return new Node(this.current().data[this.current().length - 1].data);
    },
    
    root: function() {
      currentNode = root;
      console.error("up root");
    },
    
    toJSON: function() {
      return root;
    },
    
    inspect: function() {
      return sys.inspect(root);
    }
  }
}

function Node(object) {
  return {
    data: object,
    isType: function(types) {
      if (typeof types === 'string') {
        return object._type === types;
      } else if (Array.isArray(types)) {
        return (types.indexOf(object._type) !== -1)
      }
    },
    
    expectType: function(types) {
      var type = object._type;
      if (!Array.isArray(types)) types = [types];
      if (types.indexOf(type) === -1) {
        var lastType = types.pop();
        throw new Error('Expected Current Node to be of type: ' + types.join(', ') + ' or ' + lastType + '; but got '+ type);
      }
    }
  }
}