var text = "";
var ltBlue = "#0099FF", medBlue = "#0033CC", darkBlue = "#00005C";
var green = "#0F0", red = "#F00", black = "#000";
$(document).ready(function() {
  $("tbody td").click(function(e) {
    var currentCell = $(this);
  
    if (currentCell.attr("bgColor")=="") {
      currentCell.attr("bgColor", ltBlue);
    } else if (currentCell.attr("bgColor") == ltBlue) {
      currentCell.attr("bgColor", medBlue);
    } else if (currentCell.attr("bgColor") == medBlue){
      currentCell.attr("bgColor", darkBlue);
    } else if (currentCell.attr("bgColor") == darkBlue) {
      currentCell.attr("bgColor", green);  
    } else if (currentCell.attr("bgColor") == green) {
      currentCell.attr("bgColor", red);
    } else if (currentCell.attr("bgColor") == red) {
      currentCell.attr("bgColor", black);  
    } else if (currentCell.attr("bgColor") == black) {
      currentCell.attr("bgColor", "");
    } else {
      currentCell.attr("bgColor", "");
    }

    $("#makeMap").click();
  });
  
  
$("#darker").click(function(evt) {
  var elements = $("tbody td");
  elements.click();    
});
  
$("#makeMap").click(function(evt) {
  text = "";

  var elements = $("tbody td");

  $.each (elements, function(index,value) {
    if (elements[index].bgColor =="") {
      text += "U";
    } else if (elements[index].bgColor == ltBlue) {
      text += "1";
    } else if (elements[index].bgColor == medBlue){
      text += "2";
    } else if (elements[index].bgColor == darkBlue) {
      text += "3";
    } else if (elements[index].bgColor == green) {
      text += "G";
    } else if (elements[index].bgColor == red) {
      text += "R";
    } else if (elements[index].bgColor == black) {
      text += "B";
    }
  });

  $("#map").text("{'levelData':"+text+"}");
});

});