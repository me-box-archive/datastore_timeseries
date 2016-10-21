var express = require('express');
var router = express.Router();
var influxClient = require('../database/influx.js');
var interceptOutput = require("intercept-stdout");
var databox_directory = require("../utils/databox_directory.js");
var request = require('request');

//Capture std out for later use in the /debug endpoint 
var log = [];
var unhook_intercept = interceptOutput(function(txt) {
    log.push(txt);
    if(log.length > 100) {
        log.shift();
    }

});

router.post('/actuate', function(req, res, next) {
    var actuator_id = req.body.actuator_id;     
    databox_directory.get_driver_hostname_from_actuator_id(actuator_id)
    .then((hostname) =>{
        var options = {
            uri: 'http://'+hostname+':8080/api/actuate',
            method: 'POST',
            json: {
                actuator_id: actuator_id,
                method:req.body.method,
                data:req.body.data
            }
        };
        console.log("Passing through call to /actuate", options);
        request(options, function (error, response, body) {
            if (error) {
                res.send(error);
                return;
            }
            res.send(body);
        });
    })
    .catch((err)=>{ console.log('[ERROR] /actuate ', err); res.send(error);})
});

router.get("/", function(req, res, next) {
    res.send({"message":"test"});
 
});

router.get("/debug", function(req, res, next) {
    res.send(JSONstringify(log));
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
