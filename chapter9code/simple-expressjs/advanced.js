var express = require('express');
var app = express.createServer()
var sys = require('sys');

app.get('/about', function (req, res) {
    res.send('About Page')
});
app.get('/about/:id', function (req, res) {
    id = req.params.id
    res.send('About Page for '+id)
});
app.get('/profile/:id?', function (req, res) {
    id = req.params.id
    if (id === undefined)
        res.send("Profile not found")
    else res.send(id+"'s Profile")
});
sys.puts("Server started on http://localhost:3000");
app.listen(3000);
