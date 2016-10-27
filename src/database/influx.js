var influx = require('influx')

var client = influx({
	  host: 'localhost',
	  port: 8086,
	  protocol: 'http',
	  database: 'databox'
	})

exports.get = function() {
  	return client;
}

