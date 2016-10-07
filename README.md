#Timeseries Datastore

This is a timeseries datastore for the databox

the datastore exposes a http based api on port 8080 withe following end points

    Method: POST
    URL: /api/reading
    Parameters: Raw JSON body containing elements as follows {sensor_id: <sensor ID>, vendor_id: <vendor ID>, value:  <sensor value>}
    Notes: The vendor_id and sensor_id must be valid and related entries in the databox directory in order for the reading to be accepted
    
    Method: POST
    URL: /api/reading/latest
    Parameters: Raw JSON body containing elements as follows {sensor_id: <sensor ID>
    Notes: will return the latest reading based on the databox wide sensor id
    
    Method: POST
    URL: /api/reading/latest
    Parameters: Raw JSON body containing elements as follows {sensor_id: <sensor ID>}
    Notes: will return the latest reading based on the databox wide sensor_id
    
    Method: POST
    URL: /api/reading/range
    Parameters: Raw JSON body containing elements as follows {sensor_id: <sensor ID>, start: <start timestamp>, end: <end timestamp>}
    Notes: will return the range of readings between start and end based on the databox wide sensor_id
    
TODO: 

1. Implement checking of sensor id presence within databox directory for posting sensor readings
2. Implement checking of valid macaroon data to allow for access to latest and range data
3. Implement aggregated range reading so for example one could specify the reslution at which to return data (assuming complicance with SLA). This needs some thinking as not all timeseries data lends itself to all types of aggregation, i.e. state on and off cannot be averaged over time, likely that sensor meta data will be needed to added to the directory which describes the types of aggregation that are supported by the sensors data stream. 
    
    
    
