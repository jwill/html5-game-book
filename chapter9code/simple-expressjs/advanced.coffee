express = require 'express'
app = express.createServer()
sys = require 'sys'

app.get '/about', (req, res) ->
    res.send('About Page')

app.get '/about/:id', (req, res) ->
    id = req.params.id
    res.send('About Page for '+id)
    
app.get '/profile/:id?', (req, res) ->
    id = req.params.id
    if (id is undefined)
        res.send("Profile not found")
    else res.send(id+"'s Profile")

sys.puts "Server started on http://localhost:3000"
app.listen(3000);
