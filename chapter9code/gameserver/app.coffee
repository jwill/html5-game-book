# MongoDB libs and init
mongo = require 'mongodb'
#mongoStore = require 'connect-mongodb'

# Utilities
nowjs = require 'now'
cache = require './utils/node-cache'
uuid = require('node-uuid')
util = require 'util'
sys = require 'sys'
async = require 'async'
underscore = require './utils/underscore-min'

express = require 'express'
app = express.createServer()
everyone = nowjs.initialize(app)

# Domain objects
#require('./controllers/GameRoom')()
p = require './controllers/Player'

gameRooms = []
players = []

app.configure ->
	app.use express.logger()
	app.use express.cookieParser()
	app.use express.bodyParser()
	app.use express.static(__dirname + '/public')
	
everyone.connected ->
	sys.puts "new client connected."
	everyone.now.receiveMessage("System", "#{this.user.clientId} has joined the game lobby.")
	
everyone.disconnected ->
	sys.puts "Disconnected."
	everyone.now.receiveMessage("System", "#{this.user.clientId} has disconnected.")

			
# send message to all clients
everyone.now.distributeMessage = (message) ->
	console.log("Received message:"+ message + " from: "+this.now.name)
	everyone.now.receiveMessage(this.now.name, message)

# get list of players
everyone.now.getPlayersList = () ->
	everyone.now.receiveData("playersList", players)

#everyone.now.changeName = (name) ->
#	console.log "user: " +sys.inspect this.user
#	p = underscore._.select(players, (player) -> return player.client == this.user.clientId)
#	console.log "players:"+sys.inspect players
#	players.remove(p)
#	p.name = name
#	players.push(p)
	
app.set 'views', __dirname + '/views'

app.register '.coffee', require('./utils/coffeekup')
app.set 'view engine', 'coffee'


require('./controllers/GameRoom').GameRoom(nowjs, everyone, cache)					
require('./logic/TicTacToe/TicTacToe').TicTacToe(nowjs, everyone, cache)
require('./logic/War/War').War(nowjs, everyone)
	
app.get "/", (req, res) ->
		res.render 'index'
		
#app.post "/login", (req,res) ->
	
#app.get "/register", (req, res) ->
#		res.render 'register'
		
#app.post "/register", (req, res) ->
#		# Check if user already exists
#		sys.puts sys.inspect req
#		res.send "You sent: " + sys.inspect req

util.log 'Starting server on http://localhost:3000'
app.listen 3000




