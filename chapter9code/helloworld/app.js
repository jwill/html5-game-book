express = require('express')
app = express.createServer()
util = require('util')
io = require('socket.io')
sys = require('sys')

app.configure(function () {
	app.use(express.logger());
	app.use(express.static(__dirname + '/public'));
});

// Set directory for views to render
app.set('views', __dirname + '/views')

app.register('.coffee', require('coffeekup'))
app.set('view engine', 'coffee')

app.get("/", function (req, res) {
    res.render('index');
});

app.get("/getTime", function (req, res) {
    res.render('getTime', {title:'Get Time' })
});
    
util.log('Starting server on http://localhost:3000')
app.listen(3000)


// Setup socket.io
socket = io.listen(app)
socket.on('connection', function (client) {
	sys.puts("new client connected.")
	client.on('message', function (data) {
			sys.puts(data)
		client.send(data) 
	});
	client.on('disconnect', function (){})
});

