var express = require("express");
var bodyParser = require("body-parser");
var databox_directory = require("./utils/databox_directory.js");
var influxClient = require('./database/influx.js');

var timeseriesRouter = require('./timeseries.js');
var oldTimeseriesRouter = require('./timeseries-old.js');

var actuateRouter = require('./actuate.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//TODO app.use(Macaroon checker);

app.get("/status", function(req, res) {
    res.send("active");
});

app.use('/api/actuate',actuateRouter(app));

//the new TS API compatible with the blob store
app.use('/:var(api/data|api/ts)?',timeseriesRouter(app));

//support apps using the old api for now
app.use('/api/reading',oldTimeseriesRouter(app));


//Websocket connection to live stream data
var server = require('http').createServer(app);
var WebSocketServer = require('ws').Server
app.wss = new WebSocketServer({ server: server })
app.broadcastDataOverWebSocket = require('./broadcastDataOverWebSocket.js')(app)

//make the influx DB
influxClient.get().createDatabase("databox", function (err, result) { })
    server.listen(8080 , function(){
    console.log("Server listening on: http://localhost:%s", 8080);
});

databox_directory.register_datastore('datastore-timeseries', ':8080/api')
  .then( (ids)=>{
	   
  })
  .catch((err) => {
  	console.log(err)
  });

 module.exports = app;

