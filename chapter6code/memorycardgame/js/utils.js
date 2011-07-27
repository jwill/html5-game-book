Array.prototype.shuffle = function() {
    // Clone this array.        
    var result = this.slice(0);

    // Swap each element with another randomly selected one.
    for (var i = 0; i < result.length; i++) {
        var j = i;
        while (j == i) {
            j = Math.floor(Math.random() * result.length);
        }
        var temp = result[i];
        result[i]    = result[j];
        result[j]    = temp;
    }    
    return result;
};

//Source:http://stackoverflow.com/questions/27030/comparing-arrays-of-objects-in-javascript
Object.prototype.equals = function (y) {
   var objectsAreSame = true;
   for(var propertyName in this) {
      if(this[propertyName] !== y[propertyName]) {
         objectsAreSame = false;
         break;
      }
   }
   return objectsAreSame;
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};