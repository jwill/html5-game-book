express = require('express')
sys = require('sys')
nowjs = require("now")

app = express.createServer()
everyone = nowjs.initialize(app)

app.configure(() ->
	app.use(express.logger())
	app.use(express.static(__dirname + '/public'))
)

everyone.now.getPlayerList = (callback) ->
	players = ['Jake','John','Cathy']
	callback(players)



# Set directory for views to render
app.set('views', __dirname + '/views')

app.register('.coffee', require('./utils/coffeekup'))
app.set('view engine', 'coffee')

app.get("/", (req, res) ->
    res.render('index')
)
    
console.log('Starting server on http://localhost:3000')
app.listen(3000)
