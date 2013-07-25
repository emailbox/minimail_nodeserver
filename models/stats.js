/**
 * Module dependencies.
 */

// Promises
var Q = require('q');

// xtend
var extend = require('xtend')

require('date-utils');

// validator
var validator = require('validator');
var sanitize = validator.sanitize;

exports.sent_vs_received = function(bodyObj, timezone_offset){
	// Returns sent vs. received emails for each day in the past week
	// - the app can show the data in different ways

	// Convert timezone_offset to seconds
	timezone_offset = timezone_offset * 60;
	console.log(timezone_offset);

	console.log('model sent_vs_received');

	var defer = Q.defer();

	process.nextTick(function(){

		var user = {};

		var lastWeekSeconds = new Date(),
			weekInSec = 60*60*24*7;
		lastWeekSeconds = parseInt(lastWeekSeconds.getTime() / 1000, 10) - weekInSec; // exactly one week, to the second

		// Email would have \\\\Sent label
		var searchData = {
			model: 'Email',
			conditions: {},
			fields: ['common.date_sec'],
			limit: 10000
		};
		var withSent = extend(searchData,{
			conditions: {
				'original.labels' : '\\\\Sent',
				'common.date_sec' : {
					'$gt' : lastWeekSeconds
				}
			}
		});

		var withoutSent = extend(searchData,{
			conditions: {
				'original.labels' : {
					"$ne" : '\\\\Sent'
				},
				'common.date_sec' : {
					'$gt' : lastWeekSeconds
				}
			}
		});

		var resultsDeferred = [];

		// 0 - sent
		resultsDeferred.push(models.Emailbox.search(withSent, bodyObj.auth));

		// 1 - received
		resultsDeferred.push(models.Emailbox.search(withoutSent, bodyObj.auth));


		// Wait for all searches to have been performed
		Q.allResolved(resultsDeferred)
			.then(function(promises){

				console.log('Finished promises');

				// All searches complete
				// - get all of them and return along with indexKey

				// Get expected days
				var expected_days = {};
				var today = new Date(),
					today_real = parseInt(today.getTime() / 1000, 10) - timezone_offset; // in seconds

				[0,1,2,3,4,5,6].forEach(function(val, index){
					var tmp_date = new Date((today_real - (val * 24 * 60 * 60)) * 1000),
						// day_of_month = tmp_date.getDate();
						day_of_month = tmp_date.toFormat('D-') + tmp_date.toFormat('DDD').substr(0,2);
					expected_days[ day_of_month ] = 0;
				});

				var sentDateArray = extend({},expected_days),
					receivedDateArray = extend({},expected_days);

				promises.forEach(function (promise, index) {
					var tmp_val = promise.valueOf();
					// console.log('tmp_val');
					// console.log(tmp_val);

					// Iterate over emails and add to correct date in array
					tmp_val.forEach(function(emailModel){
						// Get date for email
						// console.log(emailModel.Email.common.date_sec * 1000);
						var old = emailModel.Email.common.date_sec,
							newtime = old - timezone_offset;
						
						var tmp_date = new Date(newtime * 1000),
							// day_of_month = tmp_date.getDate();
							day_of_month = tmp_date.toFormat('D-') + tmp_date.toFormat('DDD').substr(0,2);

						if(index == 0){
							// Sent
							if(sentDateArray[day_of_month] == undefined){
								return; // already set possible days
							}
							sentDateArray[day_of_month]++;
						} else {
							// Received
							if(receivedDateArray[day_of_month] == undefined){
								return; // already set possible days
							}
							receivedDateArray[day_of_month]++

						}

					});

				});

				// Resolve deferred
				defer.resolve({
					sent: sentDateArray, 
					received: receivedDateArray}
				);
			})
			.fail(function(errData){
				console.log('Fail');
				console.log(errData);
				defer.reject(errData);
			});

	});

	return defer.promise;

};
