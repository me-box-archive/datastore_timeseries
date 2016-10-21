var request = require('request');

var databox_directory_url = process.env.DATABOX_DIRECTORY_ENDPOINT

//var databox_directory_url = "http://localhost:3000/api"

exports.register_datastore = function(hostname, api_url, done) { // requires a description which is most liekely the vendor name and must be unique, will return databox global vendor id
	var options = {
  		uri: databox_directory_url+'/datastore/register',
  		method: 'POST',
  		json: 
  		{
    		"hostname": hostname,
    		"api_url": api_url
  		}
	};

	request(options, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    	 return done(error,body);
  		}
  		return done(error,body);
	});
}

exports.check_sensor_id = function(sensor_id, done) { // requires a description which is most liekely the vendor name and must be unique, will return databox global vendor id
  var options = {
      uri: databox_directory_url+'/sensor/check_id',
      method: 'POST',
      json: 
      {
        "sensor_id": sensor_id
      }
  };

  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
       return done(body);
      }
      return done(error);
  });
}

exports.get_driver_hostname_from_actuator_id = function(actuator_id) { // requires a description which is most liekely the vendor name and must be unique, will return databox global vendor id
  return new Promise((resolve, reject) => {

	var options = {
		uri: databox_directory_url+'/actuator/'+actuator_id+'/driver_hostname',
		method: 'get',
	};

	request(options, function (error, response, body) {
		console.log("get_driver_hostname_from_actuator_id", error, body, typeof body);
		if (error) {
			reject(body);
			return;
		}
		body = JSON.parse(body);
		console.log("body.hostname = " + body.hostname);
		resolve(body.hostname);
	});

  });
}
