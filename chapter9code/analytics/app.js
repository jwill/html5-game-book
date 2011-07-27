
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();
var nowjs = require('now')
var everyone = nowjs.initialize(app)
// Configuration
app.register('.coffee', require('coffeekup'))


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'coffee');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
