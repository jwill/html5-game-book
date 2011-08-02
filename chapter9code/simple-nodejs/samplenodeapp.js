var http = require('http')
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen( 8124, "127.0.0.1");
/* }).listen( process.env.C9_PORT, "0.0.0.0");    Uncomment to run on Cloud9IDE */
console.log('Server running at http://127.0.0.1:8124/');
