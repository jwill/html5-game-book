express = require 'express'
app = express.createServer()
sys = require 'sys'

app.get '/', (req, res) ->
    res.send('Hello World')

sys.puts "Server started on http://localhost:3000"
app.listen(3000);
