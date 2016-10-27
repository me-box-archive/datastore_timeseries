var app = require("../src/main.js");
app.locals.debug = true;
var supertest = require("supertest")(app);
var assert = require('assert');


var recordSet = []; // store res from can POST /data/since to test /data/range
var lastRecord = {};

describe('tests /api/data/since', function() {
	var data = {
	    	"data": 42,
	    	"sensor_id": 11,
	    	"vendor_id": 1
		}; 
	
	it("Adds records posted to /api/data", function(done) {
		var data = {
	    	"data": 51,
	    	"sensor_id": 11,
	    	"vendor_id": 1
		}; 
		supertest
			.post("/api/data")
			.send(data)
			.expect(200)
			.end(function(err,result){
				assert.deepEqual(result.body.data, 51);
				done()
			});
	});

	it('can get lastRecord',function(done){
		supertest
				.post("/api/data/latest")
				.send(data)
				.expect(200)
				.end(function(err,result){
					if(err) {
						assert.fail("","",err);
						done()
					}
					assert.deepEqual(result.body[0].data, 51);
					lastRecord = result.body[0]
					done()
					console.log(lastRecord.timestamp);
				});
	});

	it("Adds records posted to /api/data", function(done) {
		var data = {
	    	"data": 45,
	    	"sensor_id": 11,
	    	"vendor_id": 1
		}; 
		supertest
			.post("/api/data")
			.send(data)
			.expect(200)
			.end(function(err,result){
				assert.deepEqual(result.body.data, 45);
				done()
			});
	});

	it("Adds records posted to /api/data", function(done) {
		var data = {
	    	"data": 46,
	    	"sensor_id": 11,
	    	"vendor_id": 1
		}; 
		supertest
			.post("/api/data")
			.send(data)
			.expect(200)
			.end(function(err,result){
				assert.deepEqual(result.body.data, 46);
				done()
			});
	});

	it("Adds records posted to /api/data", function(done) {
		var data = {
	    	"data": 47,
	    	"sensor_id": 11,
	    	"vendor_id": 1
		}; 
		supertest
			.post("/api/data")
			.send(data)
			.expect(200)
			.end(function(err,result){
				assert.deepEqual(result.body.data, 47);
				done()
			});
	});

	it("Adds records posted to /api/data", function(done) {
		var data = {
	    	"data": 48,
	    	"sensor_id": 11,
	    	"vendor_id": 1
		}; 
		supertest
			.post("/api/data")
			.send(data)
			.expect(200)
			.end(function(err,result){
				assert.deepEqual(result.body.data, 48);
				done()
			});
	});

	it("Adds records posted to /api/data", function(done) {
		var data = {
	    	"data": 49,
	    	"sensor_id": 11,
	    	"vendor_id": 1
		}; 
		supertest
			.post("/api/data")
			.send(data)
			.expect(200)
			.end(function(err,result){
				assert.deepEqual(result.body.data, 49);
				done()
			});
	});

	it("Adds records posted to /api/data", function(done) {
		var data = {
	    	"data": 50,
	    	"sensor_id": 11,
	    	"vendor_id": 1
		}; 
		supertest
			.post("/api/data")
			.send(data)
			.expect(200)
			.end(function(err,result){
				assert.deepEqual(result.body.data, 50);
				done()
			});
	});

	it('can POST /data/since ' + lastRecord.timestamp  + ' and returns 6 items',function(done){
		
		data = {
					"timestamp": lastRecord.timestamp,
					"sensor_id": 11
				};

		supertest
				.post("/api/data/since")
				.send(data)
				.expect(200)
				.end(function(err,result){
					if(err) {
						assert.fail("","",err);
						done()
					}
					assert.equal(result.body.length, 6);
					recordSet = result.body
					done()
				});
	});

});

describe('tests /api/data/range', function() {
	
		it('can POST /api/data/range and retrieve data ',function(done){
		
			var data = {
	    	"start": recordSet[1].timestamp,
	    	"end": recordSet[4].timestamp,
	    	"sensor_id": 11,
	    	"vendor_id": 1
			}; 

			supertest
					.post("/api/data/range")
					.send(data)
					.expect(200)
					.end(function(err,result){
						if(err) {
							assert.fail("","",err);
							done()
						}
						assert.equal(result.body.length, 4);
						recordSet = result.body
						done()
					});
		});
});