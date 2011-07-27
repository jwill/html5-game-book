// Paddle.js
var Paddle = Class.create(Rectangle, {
    initialize: function($super){
        $super();
        this.height = 100;
        this.width = 20;
        this.color = "0011FF";
        this.isPlayerOne = true;
    },
    setPosition: function(x, y){
        this.x = x;
        this.y = y;
    },
    getPosition: function(){
        return {
            'x': this.x,
            'y': this.y
        }
    },
    setIsPlayerOne: function(bool){
        this.isPlayerOne = bool;
    },
    checkInput: function(){
        if (this.isPlayerOne == false) {
            if (myInput.isKeyDown(Input.KEY_UP)) {
                if (this.y > 0) {
                    this.y = this.y - 10;
                }
            }
            else 
                if (myInput.isKeyDown(Input.KEY_DOWN)) {
                    // x,y are taken from the left corner
                    if (this.y < game_height - this.height) 
                        this.y = this.y + 10;
                }
            
        }
        else {
            if (myInput.isKeyDown(65)) { // 'A'
                if (this.y > 0) {
                    this.y = this.y - 10;
                }
            }
            else 
                if (myInput.isKeyDown(90)) { // 'Z'
                    // x,y are taken from the left corner
                    if (this.y < game_height - this.height) 
                        this.y = this.y + 10;
                }
        }
    },
    update: function(){
        this.checkInput();
    }
});
