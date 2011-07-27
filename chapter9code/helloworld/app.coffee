express = require 'express'
app = express.createServer()
util = require 'util'
io = require 'socket.io'
sys = require 'sys'

app.configure ->
	app.use(express.logger());
	app.use(express.staticProvider(__dirname + '/public'));


# Set directory for views to render
app.set 'views', __dirname + '/views'

app.register '.coffee', require('coffeekup')
app.set 'view engine', 'coffee'

app.get "/", (req, res) ->
    res.render('index');
	#res.send("Hello, World");

app.get "/getTime", (req, res) ->
    res.render 'getTime', context:{title:'Get Time' }
	#res.send("Hello, World");

util.log 'Starting server on http://localhost:3000'
app.listen 3000


# Setup socket.io
socket = io.listen app
socket.on 'connection', (client) ->
	sys.puts "new client connected."
	client.on 'message', (data) ->
		sys.puts data
		client.send data 
	client.on 'disconnect', -> 

