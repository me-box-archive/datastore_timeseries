var express = require('express');
var router = express.Router();
var influxClient = require('../database/influx.js');

router.get("/", function(req, res, next) {
    res.send({"message":"test"});
 
});


router.post('/vendor/register', function(req, res, next) {
  var vendor_description = req.body.description;
  vendor.register(vendor_description,function(err, data) {
    if(err) {
      console.log("there has been an error");
      res.send(err);
    }
    else {
      res.send(data);
    }
  });
});   

router.post("/reading", function(req, res, next) {
   
    console.log(req.body);
    var sensor_value = req.body.value;
    var sensor_id = req.body.sensor_id;
    var vendor_id = req.body.vendor_id;

    //varify that ID is global databox id and is assocaited with vendor id

    influxClient.get().writePoint("databox", {time: new Date(), value: sensor_value}, {sensorId: sensor_id}, function(err,response) { 
        res.send({"message": "all is ok"});
    });
 
});

router.post('/reading/latest', function(req, res, next) {
    var sensor_id = req.body.sensor_id;

    //varify that ID is global databox id and is assocaited with vendor id

    var query = "select last(value) as value from databox where sensorId='"+sensor_id+"'";
    influxClient.get().query(query, function (err, results) { 
        res.send(results);
    })
});

router.post('/reading/range', function(req, res, next) {
    var sensor_id = req.body.sensor_id;
    var start = req.body.start;
    var end = req.body.end;
    
    //varify that ID is global databox id and is assocaited with vendor id

    var query = "select value from databox where sensorId='"+sensor_id+"' AND time > \"" + start + "\" AND time < \""+end+"\"";
    console.log(query);
    influxClient.get().query(query, function (err, results) { 
        res.send(results);
    })
});

module.exports = router;
