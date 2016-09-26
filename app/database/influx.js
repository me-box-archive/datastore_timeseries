var influx = require('influx')

var client = influx({
	  host: 'datastore_timeseries_database',
	  port: 8086,
	  protocol: 'http',
	  database: 'databox'
	})

exports.get = function() {
  	return client;
}

