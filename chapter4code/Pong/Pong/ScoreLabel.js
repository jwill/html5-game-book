var Label = SGF.require('Label');

var ScoreLabel = Class.create(Label, {
    initialize: function($super, font){
        $super();
        this.width = 50;
        this.height = 50;
        this.font = font;
        this.setText("0");
        this.color = "FFFFFF"
        this.size = 40;
    },
    setPosition: function(x, y){
        this.x = x;
        this.y = y;
    },
    incrementScore: function(){
        var num = new Number(this.getText());
        this.setText("" + (num + 1));
    }
});
