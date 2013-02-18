
// http requests
var request = require('request');

// defer
var Q = require('q');

// Querystring
var querystring = require('querystring');

// uuid
var uuid = require('node-uuid');

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

		return true;
	}

	return false;
}

exports.login = function(req, res){
	// A user is trying to login using an emailbox user_token

	console.log('exports.login');

	// Set response Content-Type
	res.contentType('json');
	// jsonError(res, 101, 'test');

	var bodyObj = req.body;
	
	if(typeof bodyObj != "object"){
		jsonError(res, 101, "Expecting object");
		return;
	}
	if(typeof bodyObj.user_token != "string"){
		jsonError(res, 101, "Expecting user_token",bodyObj);
		return;
	}

	console.log('data OK');

	// Request updated credentials from Emailbox
	// - via /api/user
	models.Api.loginUser(bodyObj)
		.then(function(user){
			console.log('logged in');
			// Succeeded in logging in the user
			// - log this person in using a cookie (expected to be on filemess.com, not anywhere else)

			console.log('login ok');

			req.session.user = user; // user is OUR version of the user

			console.log('added to session');
			console.log(user);

			// Return success
			jsonSuccess(res,'Logged in',{
				user: {
					id: user.id
				}
			});

		})
		.fail(function(result){
			// Failed to log the user in
			
			console.log('failed login2');

			console.log(result);
			jsonError(res,101,'Unable to log this user in', result);
		});

	// Do we already have this User ID?
	// - update or insert if we do

};

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
					 'original.TextBody',
					 'original.labels',
					 'original.headers.From',
					 'original.headers.Subject',
					 'original.ParsedData.[0]',
					 'original.ParsedData.0'
					 ],
			limit: 1
		};

		console.log('Searching');

		var getUser = Q.defer();

		// Get the local user_id
		models.User.get_local_by_emailbox_id(bodyObj.auth.user_id)
			.then(function(local_user){
				// console.log('User');
				// console.log(local_user);
				getUser.resolve(local_user);
			});

		getUser.promise.then(function(local_user){

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

								// console.log('Leasure email, not sending a Push Notification');

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

								// Update gmail inbox
								// - label
								// - archive

								// Archive and Label
								// - do it all in one!
								// - uh, seems to be archiving FUCKING EVERYTHING
								var archiveEventData = {
									event: 'Email.action',
									obj: {
										'_id' : email.Email._id,
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
								console.log('NOT leasure email');

								// Send Push Notification
								var parseRequest = {
									channels: ['c_' + local_user.id],
									push_time: new Date(),
									expiration_interval: 60,
									data: {
										alert: email.Email.original.TextBody.substr(0,100),
										threadid: email.Email.attributes.thread_id,
										summary: email.Email.original.TextBody.substr(0,100),
										title: email.Email.original.headers.Subject
									}
								};

								// Send Push Notification
								// console.log('WOULD HAVE SENT PUSH NOTIFICATION');
								// return;
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
