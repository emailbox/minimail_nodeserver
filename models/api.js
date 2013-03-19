/**
 * Module dependencies.
 */

// Promises
var Q = require('q');

// Node-gcm (Google Cloud Messaging)
var gcm = require('node-gcm');
var gcm_sender = new gcm.Sender('AIzaSyComNH2V2K3GErqbMkriU3obkunpVzv5Wo');

// validator
var validator = require('validator');
var sanitize = validator.sanitize;

exports.loginUser = function(bodyObj){
	// Check emailbox for a user based on the submitted credentials

	var defer = Q.defer();

	process.nextTick(function(){

		var user = {};

		user.access_token = bodyObj.access_token;

		console.log('access_token:');
		console.log(bodyObj.access_token);

		models.Emailbox.user(user)

			.then(function(result){
				// Did we get authenticated with Emailbox?

				if(typeof result.id != 'string'){
					defer.reject(2);
					return;
				}

				// Sweet, we have a valid user

				// Update the user_token for this user
				// - or if they don't exist in the DB, add them

				var created = new Date();
				created = created.getTime();

				// Try and insert the user and key
				models.mysql.acquire(function(err, client) {
					if (err) {
						defer.reject({code:404,msg:'mysql failure'});
						return;
					}
					client.query(
						'INSERT INTO f_users (id, emailbox_id, access_token, created) ' +
						'VALUES (?, ?, ?, ?) ' +
						'ON DUPLICATE KEY UPDATE ' +
						'access_token=?'
						,[null, result.id, bodyObj.access_token, created, bodyObj.access_token]
						, function(error, info, fields) {

							models.mysql.release(client);

							if (error) {
								defer.reject({code:101,msg:'Failed INSERT or UPDATE'});
								return false;
							}

							// Inserted anybody?
							if(info.insertId > 0){
								// Yes
							} else {
								// No
							}

							// Get the full person
							models.Api.getUser(result.id)
								.then(function(user){
									defer.resolve(user);
								})
								.fail(function(){
									defer.reject();
								});

							// Build the newUser
							// var newUser = {
							// 	id : info.insertId,
							// 	username : obj.email,
							// 	developer: developer
							// };

							// defer.resolve(info);

						}
					);

				});


			})

			.fail(function(result){
				console.log('result');
				console.log(result);
				defer.reject({code:404,msg:result});
				// jsonError(res,101,'Failed logging in user');
			});

	});

	return defer.promise;

};


exports.updateUser = function(userObj){
	// Check emailbox for a user based on the submitted credentials

	var defer = Q.defer();

	process.nextTick(function(){

		// Build user object
		var user = {
			access_token: bodyObj.access_token // used for requesting Emailbox user (later)
		};

		// Only updating:
		// - android_reg_id
		// - ios_something (todo...)
		var updating = {};

		user.android_reg_id = bodyObj.android_reg_id || null;

		// console.log('android_reg_id:');
		// console.log(bodyObj.android_reg_id);

		if(user.android_reg_id){
			// Updating android_reg_id

			// Validate android_reg_id
			if(typeof user.android_reg_id != 'string'){
				defer.reject({code: 404, msg: 'Invalid android_reg_id'});
				return;
			} else {
				updating['android_reg_id'] = user.android_reg_id;
			}
		}

		// Updating anything??
		if(!_.size(updating)){
			defer.reject({code: 404, msg:'No valid update requests provided'});
			return;
		}

		// Get the User from Emailbox
		models.Emailbox.user(user)

			.then(function(result){
				// Did we get authenticated with Emailbox?

				if(typeof result.id != 'string'){
					defer.reject(2);
					return;
				}

				// Sweet, we have a valid user

				// Update the user_token for this user
				// - or if they don't exist in the DB, add them

				var created = new Date();
				created = created.getTime();

				// Get keys to update
				var keys = [];
				for(var k in obj) keys.push(k);

				// Add user's id


				// Try and update the user's things
				models.mysql.acquire(function(err, client) {
					if (err) {
						defer.reject({code:404,msg:'mysql failure'});
						return;
					}
					client.query(
						'UPDATE * FROM f_users ' +
						'SET android_reg_id=? ' +
						'WHERE id=?'
						,[bodyObj.android_reg_id, result.id]
						, function(error, info, fields) {

							models.mysql.release(client);

							if (error) {
								defer.reject({code:101,msg:'Failed INSERT or UPDATE'});
								return false;
							}

							// Inserted anybody?
							console.log('info');
							console.log(info);

							// Check if updated
							// - expect a single entry to be updated
							defer.resolve(true);

						}
					);

				});


			})

			.fail(function(result){
				console.log('result');
				console.log(result);
				defer.reject({code:404,msg:result});
				// jsonError(res,101,'Failed logging in user');
			});

	});

	return defer.promise;

};


exports.getUser = function(emailbox_id){
	// Return a User
	var defer = Q.defer();

	// Search for the User
	// - only return a single person
	models.mysql.acquire(function(err, client) {
		if (err) {
			defer.reject({code:404,msg:'mysql failure'});
			return;
		}
		client.query(
			'SELECT * FROM f_users ' +
			'WHERE f_users.emailbox_id=?'
			,[emailbox_id]
			, function(error, rows, fields) {

				models.mysql.release(client);

				if (error) {
					defer.reject({code:101,msg:'Failed INSERT or UPDATE'});
					return false;
				}

				if(rows.length < 1){
					// Unable to find User
					defer.reject();
					return;
				}

				// Resolve with single user
				defer.resolve(rows[0]);
			}
		)
	});

	return defer.promise;


};

exports.pushToAndroid = function(registration_id, data, collapseKey, timeToLive, numRetries){
	// Send a Push Message to a user

	// Create deferred
	var defer = Q.defer();

	data = data || {};
	collapseKey = collapseKey || 'New Alerts';
	timeToLive = timeToLive || 10;
	numRetries = numRetries || 4;

	// Android Push
	// - everybody, for now
	var message = new gcm.Message();
	var registrationIds = [];

	// Optional
	Object.keys(data).forEach(function(key) {
		message.addData(key, data[key]);
	});
	message.collapseKey = collapseKey;
	// message.delayWhileIdle = true; // delay if not visible on the app? 
	message.timeToLive = timeToLive;

	// Add to registrationIds array
	// - at least one required
	registrationIds.push(registration_id);

	// Parameters: message-literal, registrationIds-array, No. of retries, callback-function
	gcm_sender.send(message, registrationIds, numRetries, function (err, result) {

		// console.log('GCM result');
		// console.log(result);

		/*
		Example result:
		{ multicast_id: 6673058968507728000,
		  success: 1,
		  failure: 0,
		  canonical_ids: 0,
		  results: [ { message_id: '0:1363393659420351%b678d5c0002efde3' } ] }
		 */

		// Result deferred
		defer.resolve({
			err: err,
			result: result
		});

	});

	// Return promise
	return defer.promise;

};


// exports.getEmailboxUserSettings = function(emailbox_id){
// 	// Return a User
// 	var defer = Q.defer();

// 	var searchData = {
// 		model: 'Email',
// 		conditions: {
// 			_id: email._id
// 		},
// 		fields: ['app.AppPkgDevMinimail',
// 				 'attributes.thread_id',
// 				 'original.TextBody',
// 				 'original.labels',
// 				 'original.headers.From',
// 				 'original.headers.Subject',
// 				 'original.ParsedData.[0]',
// 				 'original.ParsedData.0'
// 				 ],
// 		limit: 1
// 	};

// 	console.log('Searching');

// 	var getUser = Q.defer();

// 	// Get the local user_id
// 	models.User.get_local_by_emailbox_id(bodyObj.auth.user_id)
// 		.then(function(local_user){
// 			// console.log('User');
// 			// console.log(local_user);
// 			getUser.resolve(local_user);
// 		});

// 	getUser.promise.then(function(local_user){

// 		models.Emailbox.search(searchData,bodyObj.auth)
// 			.then(function(emails){


// 	return defer.promise;


// };

