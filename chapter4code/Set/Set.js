
var Set = Class.create({
  initialize: function () {
    this.rawArray = [];
  },
  add: function (object) {
    if (this.contains(object) == undefined) {
      this.rawArray.push(object);
    }
  },
  get: function (index) {
    return this.rawArray[index];
  },
  remove: function (object) {
    var index = this.contains(object);
    if (index != undefined)
      this.rawArray.remove(index);
  },
  contains: function (obj) {
    for (var i = 0; i < this.rawArray.length; i++) {
      var obj2 = this.rawArray[i];
      if (obj.equals(obj2))
        return i;
    }
    return undefined;
  }
});

Number.prototype.equals = function (obj) {
  return this == obj;
}