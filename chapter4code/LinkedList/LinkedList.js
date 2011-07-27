var Node = Class.create({
  initialize: function (val) {
    this.value = val;
    this.next = null;
  },
  addChild: function(node) {
    this.next = node;
  }
});

var LinkedList = Class.create({
  initialize: function () {
    this.root = new Node(null);
    this.size = 0;
  },
  add: function (object) {
    obj = this.root
    while (obj.next!= null) {
      obj = obj.next;
    }
    
    obj.next = new Node(object)
  }
  
});