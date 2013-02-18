/**
 * Module dependencies.
 */

// Promises
var Q = require('q');

// HTTP Requests
var request = require('request');


exports.pushNotification = function(parseRequest, callback){
	// Send a Push Notification

	// Returns a search promise
	var defer = Q.defer();

	var options = {
		url: 'https://api.parse.com/1/push',
		port: 80,
		method: 'POST',
		json: true,
		body: JSON.stringify(parseRequest),
		headers: {
			"X-Parse-Application-Id" : creds.parse_application_id,
			"X-Parse-REST-API-Key" : creds.parse_rest_api_key
		}
	};

	console.log('OPTIONS');
	console.log(options);

	var outReq = request.post(options, function(e, r, outRes) {

		callback(e, r, outRes);
		defer.resolve(e, r, outRes);

	});

	return defer.promise;

};

