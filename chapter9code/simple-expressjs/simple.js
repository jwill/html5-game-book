var express = require('express');
var app = express.createServer();
var sys = require('sys');

app.get('/', function (req, res) {
    res.send('Hello World');
});

sys.puts("Server started on http://localhost:3000");
app.listen(3000);
