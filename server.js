var express = require('express');
var http = require('http');
var env = require('./env');
var browserify = require('browserify-middleware');

var app = express();

app.configure(function () {
  this.use(express.static(__dirname + '/public'));
});

app.get('/main.js', browserify('./client_side/index.js', {
  transform: ['ejsify']
}));

http.createServer(app).listen(env.PORT, function (err) {
  if (err) {
    console.log(err.message);
    return process.exit(1);
  }
  console.log('listening http://localhost:' + env.PORT);
});