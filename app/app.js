
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var influxClient = require('./database/influx.js');
var databox_directory = require("./utils/databox_directory.js");

var api = require('./routes/api');


var debug = require('debug')('datastore_timeseries:server');
var http = require('http');


var app = express();

const PORT = 8080; 
app.set('port', PORT);


var jsonParser = bodyParser.json()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes setup
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers for app 

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = http.createServer(app);


// Event listener functions for HTTP server
 

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on('error', onError);
server.on('listening', onListening);

// register datastore with directory
var registerCallback = function (err, result) {
  if(err) {
    console.log(err);
    console.log("Can not register datastore with directory! waiting 5s before retrying");
    setTimeout(register,5000)
    return;
  }
  influxClient.get().createDatabase("databox", function (err, result) { })
  server.listen(PORT , function(){
    console.log("Server listening on: http://localhost:%s", PORT);
  });
}

var register = function() {
  databox_directory.register_datastore("datastore-timeseries", ":8080/api", registerCallback);
}
//
register();

module.exports = app;
