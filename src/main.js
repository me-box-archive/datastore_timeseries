var express = require("express");
var bodyParser = require("body-parser");
var databox_directory = require("./utils/databox_directory.js");

var timeseriesRouter = require('./timeseries.js');
var actuateRouter = require('./actuate.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//TODO app.use(Macaroon checker);

app.get("/status", function(req, res) {
    res.send("active");
});

app.use('/api/actuate',actuateRouter(app));

app.use('/:var(api/data|api/ts|api/reading)?',timeseriesRouter(app));

//Websocket connection to live stream data
var server = require('http').createServer(app);
var WebSocketServer = require('ws').Server
app.wss = new WebSocketServer({ server: server })
app.broadcastDataOverWebSocket = require('./broadcastDataOverWebSocket.js')(app)

databox_directory.register_datastore('datastore-timeseries', ':8080/api')
  .then( (ids)=>{
	   server.listen(8080);
  })
  .catch((err) => {
  	console.log(err)
  });

 module.exports = app;

