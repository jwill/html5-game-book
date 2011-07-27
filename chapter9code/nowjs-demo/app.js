var express = require('express');
var sys = require('sys');
var nowjs = require("now");

var app = express.createServer();
var everyone = nowjs.initialize(app);

app.configure(function () {
	app.use(express.logger());
	app.use(express.static(__dirname + '/public'));
});

everyone.now.getPlayerList = function(callback) {
	players = ['Jake','John','Cathy'];
	callback(players);
}


// Set directory for views to render
app.set('views', __dirname + '/views');

app.register('.coffee', require('./utils/coffeekup'));
app.set('view engine', 'coffee');

app.get("/", function (req, res) {
    res.render('index');
});
    
console.log('Starting server on http://localhost:3000');
app.listen(3000);
