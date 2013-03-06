/**
 * Module dependencies.
 */

// Promises
var Q = require('q');

// validator
var validator = require('validator');
var sanitize = validator.sanitize;

exports.loginUser = function(bodyObj){
	// Check emailbox for a user based on the submitted credentials

	var defer = Q.defer();

	process.nextTick(function(){

		var user = {};

		user.access_token = bodyObj.access_token;
		console.log('u');
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

