
module.exports = function (expressApp) {
    
    var influxClient = require('./database/influx.js');
    var databox_directory = require("./utils/databox_directory.js");
    var request = require('request');

    var router = require('express').Router();

    var app = expressApp;

    router.get("/",function (eq, res, next) {
      res.send("hello");
    });

    router.post("/", function(req, res, next) {
      
        console.log(req.body);
        var sensor_value = req.body.value;
        var sensor_id = req.body.sensor_id;
        var vendor_id = req.body.vendor_id;

        //verify that ID is global databox id and is associated with vendor id

        influxClient.get().writePoint("databox", {time: new Date(), value: sensor_value}, {sensorId: sensor_id}, function(err,response) { 
            res.send({"message": "all is ok"});
        });

        app.broadcastDataOverWebSocket(req.body.sensor_id,sensor_value,'ts');

    });

    router.post('/latest', function(req, res, next) {
        var sensor_id = req.body.sensor_id;
       
        //verify that ID is global databox id and is associated with vendor id
        
        var query = "select last(value) as value from databox where sensorId='"+sensor_id+"'";
        influxClient.get().query(query, function (err, results) { 
            res.send(results);
        })
    });

    router.post('/since', function(req, res, next) {
        var sensor_id = req.body.sensor_id;
        var timestamp = req.body.timestamp;
        //verify that ID is global databox id and is associated with vendor id
        var query = "select value from databox where sensorId='"+sensor_id+"' AND time > \"" + timestamp + "\"";
        influxClient.get().query(query, function (err, results) { 
            res.send(results);
        });
    });

    router.post('/range', function(req, res, next) {
        var sensor_id = req.body.sensor_id;
        var start = req.body.start;
        var end = req.body.end;
        
        //verify that ID is global databox id and is associated with vendor id
        var query = "select value from databox where sensorId='"+sensor_id+"' AND time > \"" + start + "\" AND time < \""+end+"\"";
        influxClient.get().query(query, function (err, results) { 
            res.send(results);
        });
    });

   return router;
} 