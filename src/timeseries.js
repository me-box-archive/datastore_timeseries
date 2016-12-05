
module.exports = function (expressApp) {
    
    var influxClient = require('./database/influx.js');
    var request = require('request');

    var router = require('express').Router();

    var app = expressApp;

    router.get("/",function (eq, res, next) {
      res.send("hello");
    });

    router.post("/", function(req, res, next) {

        var sensor_value = req.body.data;
        var sensor_id = req.body.sensor_id;

        var data = {
          "data": req.body.data,
          "sensor_id": req.body.sensor_id,
          "vendor_id": req.body.vendor_id,
        };

        influxClient.get().writePoint("databox", {time: new Date(), value: sensor_value}, {sensorId: sensor_id}, function(err,response) { 
            if (err) {
              console.log("[Error]:: /data/", data, err);
              res.send(err);
            }
            res.send(data);
        });

        app.broadcastDataOverWebSocket(sensor_id,data,'ts');
    });

    router.post('/latest', function(req, res, next) {
        var sensor_id = req.body.sensor_id;

        var query = "select last(value) as value from databox where sensorId='"+sensor_id+"'";
        influxClient.get().query(query, function (err, results) { 
            if (err) {
            console.log("[Error]:: /data/latest", sensor_id);
                res.send(err);
                return;
            }
            console.log(results);
            var doc =  results[0].map((item)=>{ 
                item.timestamp = new Date(item.time).getTime(); 
                item.data = item.value; 
                return item
              });
            res.send(doc);
        })
    });

    router.post('/since', function(req, res, next) {
        var sensor_id = req.body.sensor_id;
        var timestamp = req.body.timestamp;
        var query = "select value from databox where sensorId='"+sensor_id+"' AND time > " + timestamp + "ms";
        console.log("query:: ", query);
        influxClient.get().query(query, function (err, results) { 
            if (err) {
              console.log("[Error]:: /data/since", sensor_id, timestamp, err);
              res.send(err);
            }
            var doc =  results[0].map((item)=>{ 
                item.timestamp = new Date(item.time).getTime(); 
                item.data = item.value; 
                return item
              });
            res.send(doc);
        });
    });

    router.post('/range', function(req, res, next) {
        var sensor_id = req.body.sensor_id;
        var start = req.body.start;
        var end = req.body.end;

        var query = "select value from databox where sensorId='"+sensor_id+"' AND time >=  "+ start +"ms AND time <= " + end + "ms";
        console.log("query:: ", query);
        influxClient.get().query(query, function (err, results) { 
            if (err) {
              console.log("[Error]:: /data/range", sensor_id, start, end, err);
              res.send(err);
            }
            var doc =  results[0].map((item)=>{ 
                item.timestamp = new Date(item.time).getTime(); 
                item.data = item.value; 
                return item
              });
            res.send(doc);
        });        
      });

   return router;
} 