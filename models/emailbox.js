/**
 * Module dependencies.
 */

// Promises
var Q = require('q');

// HTTP Requests
var request = require('request');

// validator
var validator = require('validator');
var sanitize = validator.sanitize;

exports.search = function(data,user){
	return models.Emailbox.query('api/search',data,user);
};
exports.write = function(data,user){
	return models.Emailbox.query('api/update',data,user);
};
exports.update = function(data,user){
	return models.Emailbox.query('api/update',data,user);
};
exports.count = function(data,user){
	return models.Emailbox.query('api/count',data,user);
};
exports.event = function(data,user){
	return models.Emailbox.query('api/event',data,user);
};
exports.event_cancel = function(data,user){
	return models.Emailbox.query('api/event/cancel',data,user);
};
exports.user = function(user){
	return models.Emailbox.query('api/user',{},user);
};

exports.query = function(url,data,user){

	// Returns a search promise
	var defer = Q.defer();

	var apiRequest = {
		auth: {
			app: creds.app_key,
			user_token: user.user_token
		},
		data: data
	};

	var options = {
		url: 'https://getemailbox.com/' + url,
		port: 80,
		method: 'POST',
		json: true,
		headers: {
			'Content-type' : 'application/json'
		},
		body: JSON.stringify(apiRequest)
	};

	var outReq = request.post(options, function(e, r, outRes) {

		if(outRes.code != 200){
			defer.reject();
			return;
		}

		// Resolve defered
		defer.resolve(outRes.data);
	});


	return defer.promise;

};


exports.value_from_key_path = function(obj,path){
	// Follow an object along a dot-notation path
	// - dots work because we're using a Mongo object that doesn't allow dots in keys

	path = path.split('.');

	// Put humptydumpty back together
	// - [ and ] designate start/end
	var to_unset = [];
	var waiting_for_end = false;
	var extended_string = [];
	// $.each(path,function(i,v){
	for(var i in path){
		var v = path[i];
		if(v.substr(0,1) == '['){
			// Count until the next ']' in this array
			// - could also do some recursion if I get bored, depths of "["
			waiting_for_end = true;
			extended_string = [];
			extended_string.push(v.substr(1));
			to_unset.push(i);
		} else if(waiting_for_end && v.substr(-1,1) == ']'){
			// End is here

			waiting_for_end = false;
			extended_string.push(v.substr(0,v.length - 1));

			path[i] = extended_string.join('.');

		} else if(waiting_for_end) {
			// Need to add to_unset and extended_string
			extended_string.push(v.substr(0,v.length - 1));
			to_unset.push(i);
		} else {
			// everything else is normal
		}
	}
	for(var u_i in to_unset){
	// $.each(to_unset,function(u_i,u_v){
		u_v = to_unset[u_i];
		path.splice(u_v,1);
	}

	// Convert the path into something useful
	var validPaths = true;
	for(var i in path){
	// $.each(path,function(i,v){
		var v = path[i];
		if(typeof obj == 'undefined'){
			// missing path
			console.log('missing path for variable');
			validPaths = false;
			continue; // continue to next part
			// return;
		}

		// Continue down path
		obj = obj[v];

	}

	// Invalid paths, return a tie
	if(validPaths === false){
		return 0;
	}

	// Return end value
	return obj;
};


