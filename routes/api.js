
// http requests
var request = require('request');

// defer
var Q = require('q');

// Querystring
var querystring = require('querystring');

// uuid
var uuid = require('node-uuid');

// Urban Airship Push Notifications
var UA = require('urban-airship');
ua = new UA(creds.ua_app_key, creds.ua_app_secret, creds.ua_app_master_secret);

// Handle a ping from an event
function ping(req,res){
	// Handle a Ping request
	// - just respond with a true
	// - doesn't deal with auth at all? 

	// Set response Content-Type
	if(req.body.obj == 'ping'){
		res.contentType('json');
		res.send({
			ping: true
		});
		console.log('pinged');
		return true;
	}

	return false;
}

exports.test_register = function(req, res){
	// testing push notifications

	// Triggered by an Event from emailbox
	// - send a Push Notification with arbitrary text to a device we're using. 

	// Register device
	var test_token;
	ua.registerDevice(test_token, function(err) {
		if(err){
			console.log('Error w/ Push Test');
			console.log(err);
			return;
		}
		console.log('No errors registerDevice!');
	});

};

exports.test_push = function(req, res){

	var test_token = "APA91bHNcKn5YXUsAy4tONQEk7HqCKzE8vqvw-hCbtzP3BR1xyj4ZBj55uzwXT-GNBA3n6s_NiQCHvPE7SmCU3YNB7qs9nC2--GNF2ReUSB-jahZCEgZBwrCsvUSLljANqqvjJr3E605z6vrAwB0r73qeuQC-Lcuig";

	console.log('Starting registration');

	// Test pushing to User
	// exports.pushToAndroid = function(registration_id, data, collapseKey, timeToLive, numRetries){
	models.Api.pushToAndroid(test_token, {p1: 'test1'}, 'Test Collapse', null, null)
		.then(function(pushResult){
			console.log('Result');
			console.log(pushResult.result);
			if(pushResult.err){
				console.log('Error with result');
				console.log(pushResult.err);
			}
			if(!pushResult.result.success){
				// Seems to have had an error
				console.log('--result.success not 1');
			}
		});

	// ua.registerDevice(test_token, {'alias' : 'test1'}, function(err) {
	// 	if(err){
	// 		console.log('Error w/ Push Test');
	// 		console.log(err);
	// 		return;
	// 	}
	// 	console.log('No errors registerDevice!');
	// });

	res.send('done test');
	return;

	// // Send Push Notification
	// var pushData = {
	// 	"apids": [
	// 		test_token,
	// 	],
	// 	"android": {
	// 		 "alert": "Hello from Urban Airship!",
	// 		 "extra": {"a_key":"a_value"}
	// 	}
	// };
	// console.log('sending');
	// ua.pushNotification("/api/push", pushData, function(error) {
	// 	console.log('err');
	// 	console.log(error);
	// });
	// console.log('after sending');

	// res.send('done');

};

exports.login = function(req, res){
	// A user is trying to login using an emailbox access_token

	console.log('exports.login');

	// Set response Content-Type
	res.contentType('json');

	var bodyObj = req.body;
	
	if(typeof bodyObj != "object"){
		jsonError(res, 101, "Expecting object");
		return;
	}
	if(typeof bodyObj.access_token != "string"){
		jsonError(res, 101, "Expecting access_token",bodyObj);
		return;
	}

	// Request updated credentials from Emailbox
	// - via /api/user
	models.Api.loginUser(bodyObj)
		.then(function(user){
			// Succeeded in logging in the user
			// - log this person in using a cookie

			req.session.user = user; // user is OUR version of the user

			// Return success
			jsonSuccess(res,'Logged in',{
				user: {
					id: user.id
				}
			});

		})
		.fail(function(result){
			// Failed to log the user in
			jsonError(res,101,'Unable to log this user in', result);
		});

	// Do we already have this User ID?
	// - update or insert if we do

};

// exports.create_defaults = function(req, res){
// 	// A user is trying to update some local parameters

// 	console.log('exports.login');

// 	// Set response Content-Type
// 	res.contentType('json');

// 	var bodyObj = req.body;
	
// 	if(typeof bodyObj != "object"){
// 		jsonError(res, 101, "Expecting object");
// 		return;
// 	}
// 	if(typeof bodyObj.access_token != "string"){
// 		jsonError(res, 101, "Expecting access_token",bodyObj);
// 		return;
// 	}

// 	// Request updated credentials from Emailbox
// 	// - via /api/user
// 	models.Api.updateUser(bodyObj)
// 		.then(function(user){
// 			// Succeeded updated user
// 			// 
// 			req.session.user = user; // user is OUR version of the user

// 			// Return success
// 			jsonSuccess(res,'Updated user',{
// 				user: {
// 					id: user.id
// 				}
// 			});

// 		})
// 		.fail(function(result){
// 			// Failed to log the user in
// 			jsonError(res,101,'Unable to log this user in', result);
// 		});

// 	// Do we already have this User ID?
// 	// - update or insert if we do

// };

exports.logout = function(req, res){
	req.session.user = null;
	jsonSuccess(res,'Logged out');
};

exports.incoming_email = function(req, res){
	// Figure out if we need to alert (Push Notify) the person affected
	
	// Uses an interval to alert the person, but only within the next hour

	// Should have notify_on_* in the person's Settings (stored on emailbox?)
	// - by default, send push notifications to everybody who is signed up! 

	var bodyObj = req.body;

	if(ping(req,res)){
		return;
	}

	// Just return immediately
	res.send('Triggered incoming_email');

	// Validate request
	// - todo...

	// Wait a few seconds for email to be fully parsed by Thread, etc.
	// - 2 seconds
	setTimeout(function(){

		// Get the Email
		// - make a request to the API with the _id
		var email = bodyObj.obj;

		var searchData = {
			model: 'Email',
			conditions: {
				_id: email._id
			},
			fields: ['app.AppPkgDevMinimail',
					 'attributes.thread_id',
					 'common.date_sec',
					 'original.TextBody',
					 'original.labels',
					 'original.headers.From',
					 'original.headers.Subject',
					 'original.ParsedData.[0]',
					 'original.ParsedData.0'
					 ],
			limit: 1
		};
		var userSearchData = {
			model: 'AppMinimailSettings', // Settings for the App
			conditions: {
				_id: 1 // set the _id to 1 to guarantee the same settings retrieved (not sort and limit)
			},
			fields: [],
			limit: 1
		};

		console.log('Searching');

		// Create deferred for gathering user information from local db and emailbox (settings, email received, etc.)
		var getUser = Q.defer();

		// Get the local user_id, and the Emailbox User
		models.User.get_local_by_emailbox_id(bodyObj.auth.user_id)
			.then(function(local_user){
				// console.log('User');
				// console.log(local_user);

				// console.log('auth');
				// console.log(bodyObj.auth);
				// console.log('--');

				// Get settings stored on Emailbox
				models.Emailbox.search(userSearchData,bodyObj.auth)
					.then(function(eUserSettings){
						// console.log('eUserSettings');
						// console.log(eUserSettings);
						// eUserSettings[0].AppPkgDevMinimailSettings
						
						// Got the emailbox User settings?
						if(eUserSettings.length != 1){
							// Not created yet
							// - create them?

							// Create the emailbox_user_settings
							models.User.create_emailbox_settings(bodyObj.auth)
								.then(function(err, emailbox_user_settings_after_created){
									// Back from creating/updating emailbox_settings
									// - have data
									if(err){
										// Damnit, something broke
										// - continue, but not gonna be sending Push Notifications I guess
										console.log('Err create_emailbox_settings');
										getUser.resolve([local_user, null]);
										return;
									}
									// Resolve promise with new emailbox settings for user
									getUser.resolve([local_user, emailbox_user_settings_after_created]);
								});
							return; // don't continue to resolving promise
						}

						// Got the local and emailbox user settings, continue on
						// console.log('Emailbox User Settings');
						// console.log(eUserSettings[0]);
						getUser.resolve([local_user, eUserSettings[0]]);
					});
			});

		getUser.promise.then(function(user){

			var local_user = user[0],
				emailbox_user_settings = user[1];

			models.Emailbox.search(searchData,bodyObj.auth)
				.then(function(emails){

					console.log('New Incoming');

					if(emails.length != 1){
						// Couldn't find the email
						console.log('Unable to find matching email');
						return;
					}

					var email = emails[0];
					// console.log('e');
					// console.log(email.Email.original.ParsedData);

					// Parse links
					// - this regex actually works
					var links = email.Email.original.TextBody.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g);

					// Update Email
					// try {
					// 	links.forEach(function(item){
					// 		console.log(item);
					//		var parsed = url.parse(item);
					// 	});
					// } catch(err){

					// }
					var updateEmailData = {
						model: 'Email',
						id: email.Email._id,
						paths: {
							"$set" : {
								"app.AppPkgDevMinimail.links" : links
							}
						}
					};
					models.Emailbox.update(updateEmailData, bodyObj.auth)
						.then(function(dataResponse){
							if(dataResponse != 1){
								console.log('Failed updating links');
								console.log(dataResponse);
								return;
							}
							console.log('Updated email links');
						});

					// Get labels
					var labels = email.Email.original.labels;

					// Sent or Received?
					if(labels.indexOf('\\\\Sent') == -1){
						// Received (continue on)
					} else {
						// Sent (stop here)
						// - should at least update the App?
						// - listening for a Sent event on the websocket?
						console.log('Sent Email, no notification necessary');
						return false;
					}

					// console.log('Email');
					// console.log(email);

					// Do NOT send notifications for Leisure emails
					var isleisure = false;

					// Determine if Leisure email
					// - get list from Emailbox
					// - cached?
					var leisureSearchData = {
						model: 'AppMinimailLeisureFilter', // list of Leisure filters (key + regex)
						conditions: {},
						fields: [],
						limit: 100
					};
					models.Emailbox.search(leisureSearchData,bodyObj.auth)
						.then(function(leisureData){
							// See if any of the leisureData entries match the criteria

							var isleisure = false;
							var leisureFilters = []; // List of filters belongs to
							var leisureFilterIds = []; // List of filters belongs to
							// console.log('leisureData');
							// console.log(leisureData);
							leisureData.forEach(function(leisure){
								// Check type
								// if(isleisure){
								// 	return; // already matched, just continue
								// }
								var matched_filter = false;
								leisure.AppMinimailLeisureFilter.filters.forEach(function(lFilter){

									if(matched_filter){
										// Already matched this filter
										return;
									}
									switch(lFilter.type){
										case 'keyregex1':
											// Using the key+regex type of filtering
											// See if it matches

											// Valid key?
											if(typeof lFilter.key != 'string' || lFilter.key.length < 1){
												console.log('failed regex1 key missing');
												break;
											}
											// Valid regex?
											if(typeof lFilter.regex != 'string' || lFilter.regex.length < 1){
												console.log('failed regex1 regex missing');
												break;
											}
											// Valid modifiers?
											if(typeof lFilter.modifiers != 'string' || lFilter.modifiers.length < 1){
												lFilter.modifiers = '';
											}

											// Follow the key into the email
											var email_value = models.Emailbox.value_from_key_path(email.Email,lFilter.key);
											try {
												var regex = new RegExp(lFilter.regex,lFilter.modifiers);
												if(regex.test(email_value) == true){
													isleisure = true;
													matched_filter = true;
													leisureFilterIds.push(leisure.AppMinimailLeisureFilter._id);
													leisureFilters.push({
														_id: leisure.AppMinimailLeisureFilter._id,
														name: leisure.AppMinimailLeisureFilter.name
													});
												}
											} catch (err){
												// Failed regex.test
												console.log('failed regex2');
												console.log(err);
												break;
											}

											break;
										default:
											console.log('break');
											break;
									}
								});

							});
							
							if(isleisure){
								// This is a leisure email
								// - now what do I do with it? 
								// - NO push notification

								// console.log('Leisure email, not sending a Push Notification');

								// Modify the email to include Leisure info
								// - move to the correct Leisure collection? 

								// set on Email: label as Leisure, 
								// set on Thread: move to Leisure status (take out of undecided)
								// add to AppMinimailLeisureCollections
								// - give Name and ID to AppMinimailLeisureFilters

								// Set the filters it corresponds to
								// - leisureFilters

								console.log('Is leisure');

								var updatePathsData = {
									"$set" : {
										"app.AppPkgDevMinimail.leisure_filters" : leisureFilters
									}
								};
								var updateData = {
									model: 'Email',
									id: email.Email._id,
									paths: updatePathsData
								};
								var updateThreadData = {
									model: 'Thread',
									id: email.Email.attributes.thread_id,
									paths: updatePathsData // overwrite? seems extreme...
								};

								// console.log(updateData);

								// Update Email
								models.Emailbox.update(updateData,bodyObj.auth)
									.then(function(dataResponse){
										if(dataResponse != 1){
											console.log('Failed updating email leisure filter');
											console.log(dataResponse);
											return;
										}
										console.log('Updated email leisure_filters');
									});

								// Update Thread
								models.Emailbox.update(updateThreadData,bodyObj.auth)
									.then(function(dataResponse){
										if(dataResponse != 1){
											console.log('Failed updating thread leisure filter');
											console.log(dataResponse);
											return;
										}
										console.log('Updated thread leisure_filters');
									});

								// Update LeisureFilter with latest email datetime
								var last_message = new Date();
								last_message = last_message.getTime() / 1000;
								last_message = parseInt(last_message);
								var updateLeisurePathsData = {
									"$set" : {
										"attributes.last_message_datetime_sec" : email.Email.common.date_sec
									}
								};
								console.log(last_message);
								var updateLeisureData = {
									model: 'AppMinimailLeisureFilter',
									conditions: {
										"_id" : {
											"$in" : leisureFilterIds
										}
									},
									paths: updateLeisurePathsData,
									multi: true
								};
								models.Emailbox.update(updateLeisureData,bodyObj.auth)
									.then(function(dataResponse){
										if(dataResponse < 1){
											console.log('Failed updating leisure threads with latest email');
											console.log(dataResponse);
											return;
										}
										console.log('Updated leisure_filters with latest');
									});

								// Update gmail inbox
								// - label
								// - archive

								// Archive and Label
								// - do it all in one!
								// - uh, seems to be archiving FUCKING EVERYTHING??
								var archiveEventData = {
									event: 'Thread.action',
									obj: {
										'_id' : email.Email.attributes.thread_id,
										action : 'archive',
										label: 'leisure', //leisureFilters[0].name
									}
								};
								console.log('Emitting archive and label');
								models.Emailbox.event(archiveEventData,bodyObj.auth)
									.then(function(dataResponse){
										// Should be an event_id
										console.log('11-Emitted archive and label event');
									});


							} else {
								// Not a leisure email
								console.log('NOT a leasure email');


								// Send Push Notification
								// console.log('WOULD HAVE SENT PUSH NOTIFICATION');
								// return;

								// Update the "done" status to 0 for the Thread
								var updateThreadData = {
									model: 'Thread',
									id: email.Email.attributes.thread_id,
									paths: {
										"$set" : {
											"app.AppPkgDevMinimail.done" : 0
										}
									}
								};
								// Update Thread
								models.Emailbox.update(updateThreadData,bodyObj.auth)
									.then(function(dataResponse){
										if(dataResponse != 1){
											console.log('Failed updating thread done status');
											console.log(dataResponse);
											return;
										}
										console.log('Updated thread done status');
									});

								try {
									// Get android_reg_id
									var android_reg_id = emailbox_user_settings.AppMinimailSettings.android_reg_id;
									if(android_reg_id && android_reg_id.length > 10){

										var dataToPush = {
											alert: email.Email.original.TextBody.substr(0,100),
											threadid: email.Email.attributes.thread_id,
											summary: email.Email.original.TextBody.substr(0,100),
											title: email.Email.original.headers.Subject,

											message: email.Email.original.TextBody.substr(0,100), // displayed in notification bar
											msgcnt: 2
										};

										// // Push to Android
										// models.Api.pushToAndroid(android_reg_id, dataToPush, 'New Emails', null, null)
										// 	.then(function(pushResult){
										// 		console.log('Result');
										// 		console.log(pushResult.result);
										// 		if(pushResult.err){
										// 			console.log('Error with result');
										// 			console.log(pushResult.err);
										// 		}
										// 		if(!pushResult.result.success){
										// 			// Seems to have had an error
										// 			console.log('--result.success not 1');
										// 		}
										// 	});

									}

								} catch(err){
									// Failed sending Push for some reason
									console.log("Failed sending Push when we really wanted to");
									console.log(err);
								}

								// // Send Push Notification
								// var parseRequest = {
								// 	channels: ['c_' + local_user.id],
								// 	push_time: new Date(),
								// 	expiration_interval: 60,
								// 	data: {
								// 		alert: email.Email.original.TextBody.substr(0,100),
								// 		threadid: email.Email.attributes.thread_id,
								// 		summary: email.Email.original.TextBody.substr(0,100),
								// 		title: email.Email.original.headers.Subject
								// 	}
								// };

								// models.Parse.pushNotification(parseRequest,function(e, r, outRes){
								// 	// result
								// 	if(e){
								// 		console.log('==Failed pushNotification');
								// 		console.log(e);
								// 		return;
								// 	}
								// 	console.log('Parse Result');
								// 	console.log(outRes);
								// });

							}


						});


				});
			});

	},2000);

};

exports.wait_until_fired = function(req, res){
	// Figure out if we should be firing a Push Notification to the person affected! 

	var bodyObj = req.body;


	if(ping(req,res)){
		return;
	}

	console.log('triggered');
	
	res.send('Triggered wait_until_fired');
	
	// Testing out sending Push Notifications
	// - through Parse

	var getUser = Q.defer();

	// Get the local user_id, and the Emailbox User
	models.User.get_local_by_emailbox_id(bodyObj.auth.user_id)
		.then(function(local_user){

			var userSearchData = {
				model: 'AppMinimailSettings', // Settings for the App
				conditions: {
					_id: 1 // set the _id to 1 to guarantee the same settings retrieved (not sort and limit)
				},
				fields: [],
				limit: 1
			};

			// Get settings stored on Emailbox
			models.Emailbox.search(userSearchData,bodyObj.auth)
				.then(function(eUserSettings){
					// Got the emailbox User settings?
					if(eUserSettings.length != 1){
						// Not created yet
						// - create them?

						// Create the emailbox_user_settings
						models.User.create_emailbox_settings(bodyObj.auth)
							.then(function(err, emailbox_user_settings_after_created){
								// Back from creating/updating emailbox_settings
								// - have data
								if(err){
									// Damnit, something broke
									// - continue, but not gonna be sending Push Notifications I guess
									console.log('Err create_emailbox_settings');
									getUser.resolve([local_user, null]);
									return;
								}
								// Resolve promise with new emailbox settings for user
								getUser.resolve([local_user, emailbox_user_settings_after_created]);
							});
						return; // don't continue to resolving promise
					}

					getUser.resolve([local_user, eUserSettings[0]]);
				});
		});


	getUser.promise
		.then(function(user){

			var local_user = user[0],
				emailbox_user_settings = user[1];

			// Get the Threads that are now Due
			// - emit an event that says they are now in the \\Inbox

			// This doesn't tell us which Threads have already been sent to other clients (redoes all of them)
			// - todo... (add box that says it has already been acted on)

			var dfdPushNotification = Q.defer();

			var now = new Date(),
				now_sec = parseInt(now.getTime() / 1000) + 200; // + 120 seconds // this should be the time of the request, according to Emailbox

			// Run search
			// console.log('Running search');
			// console.log('conditions');
			// console.log(JSON.stringify({
			// 				'$and' : [
			// 					{
			// 						'app.AppPkgDevMinimail.wait_until' : {
			// 							'$lte' : now_sec
			// 						}
			// 					},
			// 					{
			// 						'app.AppPkgDevMinimail.done' : {
			// 							"$ne" : 1
			// 						}
			// 					}
			// 				]
			// 			}));
			try {
				models.Emailbox.search({
						model: 'Thread',
						conditions: {
							'$and' : [
								{
									'app.AppPkgDevMinimail.wait_until' : {
										'$lte' : now_sec
									}
								},
								{
									'app.AppPkgDevMinimail.done' : {
										"$ne" : 1
									}
								}
							]
						},
						fields: ['_id'],
						limit: 20 // 20 due at once?
					}, bodyObj.auth)
					.then(function(threadObj){
						// Emit event for each Thread that is due

						console.log('threadObj2');
						console.log(threadObj);

						// Any actually due?
						// - trigger Push Notifications if it is the case
						if(threadObj.length > 0){
							ignitePush();
						}

						// Iterate over threads
						// console.log('Iterating over Threads');
						// console.log(threadObj);
						threadObj.forEach(function(tmp_threadObj){
							console.log('Emitting Thread:' + tmp_threadObj.Thread._id);
							models.Emailbox.event({
									event: 'Thread.action',
									obj: {
										'_id' : tmp_threadObj.Thread._id,
										action: 'inbox'
									}
								}, bodyObj.auth);
						});


					});
			} catch(err){
				console.log('err');
				console.log(err);
			}

			var ignitePush = function(){
				try {
					// Get android_reg_id
					var android_reg_id = emailbox_user_settings.AppMinimailSettings.android_reg_id;
					if(android_reg_id && android_reg_id.length > 10){

						var dataToPush = {
							threadid: bodyObj.obj.threadid,
							alert: bodyObj.obj.text,
							title: "Email Reminder"
						};

						// Push to Android
						models.Api.pushToAndroid(android_reg_id, dataToPush, 'Email Reminders', null, null)
							.then(function(pushResult){
								console.log('Result');
								console.log(pushResult.result);
								if(pushResult.err){
									console.log('Error with result');
									console.log(pushResult.err);
								}
								if(!pushResult.result.success){
									// Seems to have had an error
									console.log('--result.success not 1');
								}
							});

					}

				} catch(err){
					// Failed sending Push for some reason
					console.log("Failed sending Push when we really wanted to (for a wait)");
					console.log(err);
				}
			};


			/*
						// If none are due, then don't send an Android Push
						if(threadObj.length > 0){
							// Some are due now
							// - at least 1

							console.log('Trying Android push');

							try {
								// Get android_reg_id
								var android_reg_id = emailbox_user_settings.AppMinimailSettings.android_reg_id;
								if(android_reg_id && android_reg_id.length > 10){

									var dataToPush = {
										threadid: bodyObj.obj.threadid || '',
										alert: bodyObj.obj.text,
										title: "Email Reminder",
										message: "Email(s) Due",
										msgcnt: threadObj.length // how many are actually due?
									};

									// Push to Android
									models.Api.pushToAndroid(android_reg_id, dataToPush, 'Email Reminders', null, null)
										.then(function(pushResult){
											console.log('Result');
											console.log(pushResult.result);
											if(pushResult.err){
												console.log('Error with result');
												console.log(pushResult.err);
											}
											if(!pushResult.result.success){
												// Seems to have had an error
												console.log('--result.success not 1');
											}
										});

								}

							} catch(err){
								// Failed sending Push for some reason
								console.log("Failed sending Push when we really wanted to (for a wait)");
								console.log(err);
							}

						} else {
							console.log('None Due, so not sending a Push Notification');
						}

					});
			} catch(err){
				console.log('err');
				console.log(err);
			}
>>>>>>> c1b3656ea6fba27179bdc6ec06451a3e48dd67ab
			*/


			// // Send Push Notification
			// var parseRequest = {
			// 	channels: ['c_' + local_user.id],
			// 	push_time: new Date(),
			// 	expiration_interval: 60,
			// 	data: {
			// 		alert: bodyObj.obj.text,
			// 		title: "Email Reminder"
			// 	}
			// };

			// // REST API request to send Push Notification
			// models.Parse.pushNotification(parseRequest,function(e, r, outRes){
			// 	// result
			// 	if(e){
			// 		console.log('==Failed pushNotification');
			// 		console.log(e);
			// 		return;
			// 	}
			// 	console.log('Parse Result');
			// 	console.log(outRes);
			// });

			return false;



		});

};

exports.incoming_email_action = function(req, res){
	// Handle an action from another client
	// - like Gmail web interface

	// Handles:
	// - Email.action
	// - Thread.action

	// console.log('incoming action');

	// res.send('Triggered wait_until_fired');

	if(ping(req,res)){
		return;
	}

	var bodyObj = req.body;
	
	if(typeof bodyObj != "object"){
		jsonError(res, 101, "Expecting object");
		return;
	}
	if(typeof bodyObj.auth.user_id != "string"){
		jsonError(res, 101, "Expecting user_id",bodyObj);
		return;
	}

	// If coming from ourselves, ignore it (already made the changes!)
	if(bodyObj.auth.app == creds.app_key){
		console.log('Emitted by ourselves, our data (app.AppPkgDevMinimail.done) already changed');
		jsonSuccess(res, 'Emitted by ourselves');
		return;
	}

	// User is passed along with the request

	// Validate actions to take
	if(typeof bodyObj.obj.action != 'string'){
		console.log('Failed, expecting .action');
		jsonError(res, 101, 'Expecting .action');
		return;
	}
	if(typeof bodyObj.obj._id != 'string'){
		console.log('Failed, expecting .action');
		jsonError(res, 101, 'Expecting .action');
		return;
	}

	var useLabel = false;
	switch(bodyObj.obj.action){
		case 'archive':
			if(typeof bodyObj.obj.label != 'undefined'){
				if(typeof bodyObj.obj.label != 'string'){
					// Must be a string
					console.log('Missing string for .label');
					jsonError(res, 101, 'Missing string for .label');
					return;
				} else {
					useLabel = true;
				}
			}
		case 'inbox':
		case 'star':
		case 'unstar':
		case 'read':
		case 'unread':
			break;

		case 'label':
		case 'unlabel':
			useLabel = true;
			if(typeof bodyObj.obj.label != 'string'){
				console.log('Missing .label');
				jsonError(res, 101, 'Missing .label');
				return;
			}
			if(bodyObj.obj.label.length < 1){
				console.log('Missing .label at least 1 character');
				jsonError(res, 101, 'Missing .label at least 1 character');
				return;
			}
			break;
		default:
			console.log('Invalid .action');
			jsonError(res, 101, 'Invalid .action');
			return;
	}


	// Email or Thread?
	// - by default: bodyObj.event == 'Email.action'
	var searchData = {
		model: 'Email',
		conditions: {
			_id: bodyObj.obj._id // only difference with above (refactor)
		},
		fields: ['attributes.thread_id'],
		limit: 1,
		sort: {
			_id : -1
		}
	};

	if(bodyObj.event == 'Thread.action'){
		// Using a thread, need to get an email for that/each Thread!

		// Should get an Email foreach Thread
		// - could be passing alot of Threads?
		searchData['conditions'] = {
			'attributes.thread_id': bodyObj.obj._id
		};
		searchData['limit'] = 100 // 100 emails per thread allowed to be changed (fixed issue with not all Threads being affected?)

	}
	


	// We only really care about a few events
	// - archive, inbox : correlate to done and delays
	switch(bodyObj.obj.action){
		case 'archive':
			// Moving Thread to 'done' status
			// Get the Thread for this email
			console.log('Archive');

			// Get Email with Thread._id
			models.Emailbox.search(searchData,bodyObj.auth)
				.then(function(emailObj){

					// console.log(emailObj);

					// Check length of emailObj
					if(emailObj.length < 1){
						jsonError(res, 101, 'bad length1',emailObj);
						return false;
					}
					if(emailObj.length > 100){
						jsonError(res, 101, 'bad length2',emailObj);
						return false;
					}

					// Update Thread
					// console.log('Update Thread');
					// console.log(emailObj[0].Email.attributes.thread_id);
					models.Emailbox.update({
						model: 'Thread',
						id: emailObj[0].Email.attributes.thread_id,
						paths: {
							'$set' : {
								'app.AppPkgDevMinimail.done' : 1
							}
						}
					},bodyObj.auth);
				});

			break;
		case 'inbox':
			// Moving back to the inbox
			// - treat this as a "due now!" type of event?
			// - don't emit any events though, or any Push Notifications
			console.log('Inbox');

			// Get Email with Thread._id
			models.Emailbox.search(searchData,bodyObj.auth)
				.then(function(emailObj){

					// Check length of emailObj
					if(emailObj.length < 1){
						jsonError(res, 101, 'bad length1',emailObj);
						return false;
					}
					if(emailObj.length > 100){
						jsonError(res, 101, 'bad length2',emailObj);
						return false;
					}

					// Update Thread
					models.Emailbox.update({
						model: 'Thread',
						id: emailObj[0].Email.attributes.thread_id,
						paths: {
							'$set' : {
								'app.AppPkgDevMinimail.done' : 0
							}
						}
					},bodyObj.auth);
				});
			break;
		default:
			console.log('nothing');
			break;
	}

	jsonSuccess(res, 'Returning');


};



exports.incoming_minimail_action = function(req, res){
	// Figure out if we should be firing a Push Notification to the person affected! 

	var bodyObj = req.body;

	console.log('bodyObj');
	console.log(bodyObj);

	if(ping(req,res)){
		return;
	}

	res.send('Triggered wait_until_fired');
	
	// Testing out sending Push Notifications
	// - through Parse

	var getUser = Q.defer();

	// Get the local user_id
	models.User.get_local_by_emailbox_id(bodyObj.auth.user_id)
		.then(function(local_user){
			console.log('User');
			console.log(local_user);
			getUser.resolve(local_user);
		});

	getUser.promise
		.then(function(local_user){

			// Send Push Notification
			var parseRequest = {
				channels: ['c_' + local_user.id],
				push_time: new Date(),
				expiration_interval: 60,
				data: {
					alert: bodyObj.obj.text,
					title: "Email Reminder"
				}
			};

			// REST API request to send Push Notification
			models.Parse.pushNotification(parseRequest,function(e, r, outRes){
				// result
				if(e){
					console.log('==Failed pushNotification');
					console.log(e);
					return;
				}
				console.log('Parse Result');
				console.log(outRes);
			});

			return false;



		});

};



exports.stats = function(req, res){
	// Gets stats for a person
	// - does a realtime lookup, doesn't cache anything

	var bodyObj = req.body;

	if(ping(req,res)){
		return;
	}

	var getUser = Q.defer();

	// Get the local user_id
	models.User.get_local_by_emailbox_id(bodyObj.auth.user_id)
		.then(function(local_user){;
			getUser.resolve(local_user);
		})
		.fail(function(errData){
			jsonError(res, 101, 'Failed authorizing user');
		});

	getUser.promise
		.then(function(local_user){

			console.log('Perform each search');

			// Timezone offset
			var timezone_offset = parseInt(bodyObj.obj.timezone_offset, 10) || 0;

			// Perform each search
			// - not in parallel against the user's DB
			var resultsDeferred = [];
			
			// 0 - sent vs received
			resultsDeferred.push(models.Stats.sent_vs_received(bodyObj, timezone_offset));

			// Wait for all searches to have been performed
			Q.allResolved(resultsDeferred)
				.then(function(promises){

					// All searches complete
					// - get all of them and return along with indexKey
					var endResults = {};
					promises.forEach(function (promise, index) {
						var tmp_val = promise.valueOf();

						if(index == 0){
							endResults['sent_vs_received'] = tmp_val;
						}

					});
					jsonSuccess(res, '', endResults);
				})
				.fail(function(data){
					// data == [ indexKey, errCode, errMsg, errData ]
					console.log('fail runEventCreate multiple');
					console.log(data);
					jsonError(res, 101, "Failed creating multiple events");
				});


		});

};


exports.fullcontact = function(req, res){
	// Gets fullcontact data for a person
	// - does a realtime lookup, doesn't cache anything

	var bodyObj = req.body;

	if(ping(req,res)){
		return;
	}
	

	var getUser = Q.defer();

	// Get the local user_id
	models.User.get_local_by_emailbox_id(bodyObj.auth.user_id)
		.then(function(local_user){;
			getUser.resolve(local_user);
		})
		.fail(function(errData){
			jsonError(res, 101, 'Failed authorizing user');
		});

	getUser.promise
		.then(function(local_user){

			console.log('Gathering FullContact data');

			// Get the email to test
			if(typeof bodyObj.obj.email != "string"){
				jsonError(res, 101, "Invalid email provided");
				return;
			}

			var email = bodyObj.obj.email.toLowerCase();

			var url = 'https://api.fullcontact.com/v2/person.json?email=' + email + '&apiKey=' + creds.fullcontact_api_key;

			var options = {
				url: url,
				port: 80,
				method: 'GET'
			};

			var outReq = request.post(options, function(e, r, outRes) {

				// Got response from fullContact
				console.log('Got response from FullContact');

				try {
					if(typeof outRes == "string"){
						outRes = JSON.parse(outRes);
					}
					
					res.send({
						code: 200,
						fullcontact_data: outRes
					});

				} catch(err){
					console.log('FullContact parsing error');
					console.log(err);
				}

			});

		});

};


exports.textteaser = function(req, res){
	// Gets fullcontact data for a person
	// - does a realtime lookup, doesn't cache anything

	var bodyObj = req.body;

	if(ping(req,res)){
		return;
	}
	

	var getUser = Q.defer();

	// Get the local user_id
	models.User.get_local_by_emailbox_id(bodyObj.auth.user_id)
		.then(function(local_user){;
			getUser.resolve(local_user);
		})
		.fail(function(errData){
			jsonError(res, 101, 'Failed authorizing user');
		});

	getUser.promise
		.then(function(local_user){

			console.log('Gathering TextTeaser data');

			// Get the email to test
			if(typeof bodyObj.obj.text != "string"){
				jsonError(res, 101, "Invalid text provided");
				return;
			}
			if(typeof bodyObj.obj.title != "string"){
				jsonError(res, 101, "Invalid title provided");
				return;
			}

			var url = 'http://www.textteaser.com/api/';

			var options = {
				url: url,
				port: 80,
				method: 'POST',
				body: {
					token: creds.textteaser_api_token,
					text: bodyObj.obj.text,
					title: bodyObj.obj.title
				}
			};

			console.log(options);

			var outReq = request.post(options, function(e, r, outRes) {

				// Got response from TextTeaser
				console.log('Got response from TextTeaser');

				try {
					if(typeof outRes == "string"){
						outRes = JSON.parse(outRes);
					}
					
					res.send({
						code: 200,
						textteaser_data: outRes
					});

				} catch(err){
					console.log('Textteaser parsing error');
					console.log(err);
				}

			});

		});

};

