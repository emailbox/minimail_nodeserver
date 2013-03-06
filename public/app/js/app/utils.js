App.Utils = {

	MD5 : function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]|(G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()},

	S4: function() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	},

	Storage: {
		// Always use a promise

		get: function(key){

			var dfd = $.Deferred();

			if(useForge){

				forge.prefs.get(key,function(value){

					try {
						value = JSON.parse(value);
					} catch(err){
						dfd.resolve(null);
						return;
					}

					dfd.resolve(value);

				},
				function(error){
					dfd.resolve(null);
				});

			} else if(usePg){

				// Open database
				// - switch Phonegap/cordova to Database instead of localStorage?
				// - persistent? 
				// var dbShell = window.openDatabase('minimail', "1.0", database_displayname, "Minimail", 1000000);

				setTimeout(function(){
					var value = window.localStorage.getItem(key);

					try {
						value = JSON.parse(value);
					} catch(err){
						dfd.resolve(null);
						return;
					}

					dfd.resolve(value);

				},1);

			} else {

				setTimeout(function(){
					var value = localStorage.getItem(key);

					try {
						value = JSON.parse(value);
					} catch(err){
						dfd.resolve(null);
						return;
					}

					dfd.resolve(value);

				},1);

			}

			return dfd.promise();

		},

		set: function(key, value){

			var dfd = $.Deferred();

			if(useForge){
				
				forge.prefs.set(key, JSON.stringify(value), function(){

					dfd.resolve(true);

				},
				function(error){
					clog('set error');
					clog('key: ' + key);
					clog(error);
					dfd.resolve(null);
				});

			} else if(usePg){

				setTimeout(function(){
					var tmp = window.localStorage.setItem(key,JSON.stringify(value));

					dfd.resolve(tmp);

				},1);

			} else {
				
				setTimeout(function(){
					var tmp = localStorage.setItem(key,JSON.stringify(value));

					dfd.resolve(tmp);

				},1);
			}

			return dfd.promise();
		}

	},

	// Validation
	validate: {
		// https://github.com/jzaefferer/jquery-validation/tree/master/demo
		email: function(value){
			return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
		}

	},

	guid: function() {
		return (App.Utils.S4()+App.Utils.S4()+"-"+App.Utils.S4()+"-"+App.Utils.S4()+"-"+App.Utils.S4()+"-"+App.Utils.S4()+App.Utils.S4()+App.Utils.S4());
	},

	// copy
	cp: function(old_obj){
		var tmp = JSON.stringify(old_obj);
		if(typeof(tmp) == "undefined"){
			return null;
		}
		return JSON.parse(tmp);
	},


	// Compile a Handlebars Template
	template: function (elem_id){
		
		var source = $('#'+elem_id).html();
		
		var template = Handlebars.compile(source);

		return template;
	},

	CSVToArray: function ( strData, strDelimiter ){
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");
 
		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp(
			(
				// Delimiters.
				"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
 
				// Quoted fields.
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
 
				// Standard fields.
				"([^\"\\" + strDelimiter + "\\r\\n]*))"
			),
			"gi"
			);
 
 
		// Create an array to hold our data. Give the array
		// a default empty first row.
		var arrData = [[]];
 
		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;
 
 
		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec( strData )){
 
			// Get the delimiter that was found.
			var strMatchedDelimiter = arrMatches[ 1 ];
 
			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			if (
				strMatchedDelimiter.length &&
				(strMatchedDelimiter != strDelimiter)
				){
 
				// Since we have reached a new row of data,
				// add an empty row to our data array.
				arrData.push( [] );
 
			}
 
 
			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[ 2 ]){
 
				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				var strMatchedValue = arrMatches[ 2 ].replace(
					new RegExp( "\"\"", "g" ),
					"\""
					);
 
			} else {
 
				// We found a non-quoted value.
				var strMatchedValue = arrMatches[ 3 ];
 
			}
 
 
			// Now that we have our value string, let's add
			// it to the data array.
			arrData[ arrData.length - 1 ].push( strMatchedValue );
		}
 
		// Return the parsed data.
		return( arrData );
	},


	fake_image: function(){
		// Give fake images for requested placeholders
		$('.fake_image').each(function(i,v){
			if(!$(this).attr('data-size').length){
				return;
			}
			var s = $(this).attr('data-size');
			var tmp = s.split('x');
			$(this).css('width',tmp[0] + 'px');
			$(this).css('height',tmp[1] + 'px');
		});
	},

		// MD5 (Message-Digest Algorithm) by WebToolkit
	// http://www.webtoolkit.info/javascript-md5.html
	 
	
	gravatar: function (email,size){
		var size = size || 80;
		var alt = encodeURI('www.gravatar.com/avatar/00000000000000000000000000000000?d=mm');
		return 'http://www.gravatar.com/avatar/' + App.Utils.MD5(email) + '.jpg?s=' + size + '&d='+alt;
	},


	urldecode: function(url){
		return decodeURIComponent((url+'').replace(/\+/g, '%20'));
	},


	// Sort by ASC, DESC, on a pre-defined field in an obj
	sortBy: function (arr, path, direction, type){

		// arr: the stuff we're sorting
		// path: the object path to sort based on
		//		- not sure how to actually do this? (could just only allow first-level elements to be named? That doesn't work where cuz Thread.latest..)
		// direction: 'asc' or 'desc'
		// type: of sorting to do (number, string, date, auto)

		direction = $.trim(direction.toLowerCase());
		type = $.trim(type.toLowerCase());

		// Determine what type is (if auto)
		if(type == undefined || type == null || type == 'auto'){
			type = 'number';
		}

		// If path == null, then don't sort on a path?
		// - automatically happens by skipping $.each (below)

		path = path.split('.');

		// Put humptydumpty back together
		// - [ and ] designate start/end
		var to_unset = [];
		var waiting_for_end = false;
		var extended_string = [];
		$.each(path,function(i,v){
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
		});
		$.each(to_unset,function(u_i,u_v){
			path.splice(u_v,1);
		});

		// If not an array, convert to one
		var tmp = [];
		if(typeof(arr) != 'array'){
			// iterate through and convert to an array
			$.each(arr,function(i,v){
				tmp.push(v);
			});
			// reset to original obj
			arr = tmp;
		}


		if(direction == 'asc' || direction == 'desc'){
			// Can I pass things into this array?
			// - basic scope question for Robert

			arr.sort(function(a,b){

				// Convert the path into something useful
				
				$.each(path,function(i,v){
					a = a[v];
					b = b[v];
				});


				if(type == 'date' || type == 'datetime' || type == 'time'){
					var a_tmp = new Date(a);
					var b_tmp = new Date(b);

					// Try iso dates
					if(a_tmp.toString() == 'Invalid Date'){
						a_tmp.setISO8601(a);
					}
					if(b_tmp.toString() == 'Invalid Date'){
						b_tmp.setISO8601(b);
					}

					a_tmp = a_tmp.getTime();
					b_tmp = b_tmp.getTime();
				}
				if(type == 'number'){
					var a_tmp = a;
					var b_tmp = b;
				}
				if(type == 'string'){
					var a_tmp = a;
					var b_tmp = b;
				}

				
				if(a_tmp > b_tmp){
					return direction == 'asc' ? -1 : 1;
				} else if(a_tmp < b_tmp){
					return direction == 'asc' ? 1 : -1;
				} else {
					// Equal
					return 0;
				}

			});

		} else {
			console.log('Sorting without asc or desc');
		}

		return arr;

	},

	base64: {

		encode: function(text){
			return $.base64.encode(text);
		},

		decode: function(text){
			return $.base64.decode(text);
		}

	},

	getUrlVars: function(){
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	},

	getOAuthParamsInUrl: function(){
		
		var oauthParams = {},
			queryString = location.hash.substring(1),
			regex = /([^&=]+)=([^&]*)/g,
			m;

		while (m = regex.exec(queryString)){
			oauthParams[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}

		return oauthParams;
	},

	nl2br: function(str, is_xhtml) {
		// http://kevin.vanzonneveld.net
		// - nl2br() => php.js
		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>';
		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
	},

	extract: {
		
		PhoneNumber: function(haystack_array) {
			//purpose:
			// extracts the first phone number found in haystack, returns false if none are found.
			//args: haystack = string that may contain phone number
			//returns:
			//phone number (string), formatted as xxx-xxx-xxxx, false if no number found

			var phones = [];

			if(typeof(haystack_array) !== 'object'){
				haystack_array = [haystack_array];
			}

			for (x in haystack_array){
				var haystack = haystack_array[x];

				if (typeof haystack !== 'string') {
					return false;
				}
				var phone_regex1 = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/;
				var phone_regex2 = /(\d{1}\s\(\d{3}\)\s\d{3}-\d{4})/;
				var phone_regex3 = /^(1\s*[-\/\.]?)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT])\.?\s*(\d+))*$/;
				var phone_regex4 = /(((\(\d{3}\)|\d{3})[-\s]*)?\d{3}[-\s]*\d{4}|\d{10}|\d{7})/;
				//hack: facebook sometimes formats phone numbers as 1 (555) 555-5555 which is not matched by the first regex


				phone1 = phone_regex1.exec(haystack);
				phone2 = phone_regex2.exec(haystack);
				phone3 = phone_regex3.exec(haystack);
				phone4 = phone_regex4.exec(haystack);

				phones = phones.concat(phone1,phone2,phone3,phone4);

			}

			// Normalize the phone numbers
			phones = _.uniq(phones);
			phones = _.without(phones,null,undefined,"");

			$.each(phones,function(i,phone){

				// Must be above a certain length (6 chars)
				if(phone.length < 7){
					delete phones[i];
				}

			});

			return phones;

		},
	
		Shipping: function(haystack_array) {
			//purpose:
			// extracts the first phone number found in haystack, returns false if none are found.
			//args: haystack = string that may contain phone number
			//returns:
			//phone number (string), formatted as xxx-xxx-xxxx, false if no number found
			
			// http://answers.google.com/answers/threadview/id/207899.html

			var shipping = [];
			var found_numbers = [];

			if(typeof(haystack_array) !== 'object'){
				haystack_array = [haystack_array];
			}

			for (x in haystack_array){
				var haystack = haystack_array[x];

				if (typeof haystack !== 'string') {
					return false;
				}

				var carriers = {
					'ups' : {
						'name' : 'UPS',
						'regex' : [ /\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/ ],
					},
					'fedex' : {
						'name' : 'FedEx',
						'regex' : [ /(\b96\d{20}\b)|(\b\d{15}\b)|(\b\d{12}\b)/,
									/\b((98\d\d\d\d\d?\d\d\d\d|98\d\d) ?\d\d\d\d ?\d\d\d\d( ?\d\d\d)?)\b/,
									/^[0-9]{15}$/
									]
					},
					'usps' : {
						'name' : 'USPS',
						'regex' : [ /^E\D{1}\d{9}\D{2}$|^9\d{15,21}$/,
									/^91[0-9]+$/,
									/^[A-Za-z]{2}[0-9]+US$/
									]
					}
				};

				// Run regex

				$.each(carriers,function(i,carrier){
					// Run regex against the haystack
					$.each(carrier['regex'],function(i,regex){
						var tracking_nums = regex.exec(haystack);
						
						if(typeof tracking_nums === 'object' && tracking_nums != null){

							// Remove bad entries
							tracking_nums = _.uniq(tracking_nums);
							tracking_nums = _.without(tracking_nums,null,undefined,"");

							$.each(tracking_nums,function(i,tracking_num){ 
								// Already found that num?
								if($.inArray(tracking_num,found_numbers) == -1){
									// Not found

									// Add to shipping
									shipping.push({
										'number' : tracking_num,
										'service' : carrier['name'],
										'url' : '#'
									});
									found_numbers.push(tracking_num);
								}
							});
						}

					});
				});

			}

			return shipping;

		}

	}, 

	explore: function(obj){

		Api.search({
			data: {
				'model' : obj.model,
				'fields' : [],
				'conditions' : {
					'_id' : obj._id
				},
				'limit' : 1
			},
			success: function(response){

				// Parse
				try {
					var json = $.parseJSON(response);
				} catch (err){
					alert("Failed parsing JSON");
					return;
				}

				// Check the validity
				if(json.code != 200){
					// Expecting a 200 code returned
					console.log('200 not returned');
					return;
				}

				// 1 entry?
				if(json.data.length != 1){
					alert('Had trouble gathering info');
					return;
				}

				// Get the Email data
				var data = json.data[0];

				// Remove any previous version
				$('#modalExplorer').remove();

				var template = App.Utils.template('t_modal_explorer');
				$('body').append(template());
				
				//response = {"hello" : "hi"};
				JSONFormatter.format(data, {'appendTo' : '#modalExplorer',
											'collapse' : true});

				$('#modalExplorer').modal();

				// Getting path to highlighted element
				
				$('#modalExplorer .key').each(function(i,that){
					var paths = [];
					$($(that).parents('ul:not(#json)').get().reverse()).each(function(i,elem){
						paths.push($(elem).parent().find('> span.key').text());
					});
						
					var path;

					if(paths.length == 0){
						path = $(that).text();
					} else {
						path = paths.join('.');
						path += '.' + $(that).text();
					}

					$(that).attr('title',path);

				});

				$('#modalExplorer .key').after('<span class="colon">:</span>');

				$('#modalExplorer .key').tooltip();
				

			}
		});
	},

	exploreModal: function(opts){
		$('#mainModal').modal(opts)
	},

	noty: function(opts){

		// Would be fun to use http://soulwire.github.com/Makisu/

		var defaults = {

			text: "",
			layout: 'topRight',
			type: 'alert',
			timeout: 5000, // delay for closing event. Set false for sticky notifications
			closeWith: ['click'], // ['click', 'button', 'hover']
			animation: {
				open:{
					opacity: "toggle"
				},
				close:{
					opacity: "toggle"
				},
				easing:'swing',
				speed:500
			},

		};

		opts = $.extend(defaults,opts);

		return noty(opts);

	}

	// https://github.com/collective/icalendar/blob/master/src/icalendar/parser.py
	// def q_split(st, sep=','):
	// 	"""
	// 	Splits a string on char, taking double (q)uotes into considderation
	// 	>>> q_split('Max,Moller,"Rasmussen, Max"')
	// 	['Max', 'Moller', '"Rasmussen, Max"']
	// 	"""
	// 	result = []
	// 	cursor = 0
	// 	length = len(st)
	// 	inquote = 0
	// 	for i in range(length):
	// 		ch = st[i]
	// 		if ch == '"':
	// 			inquote = not inquote
	// 		if not inquote and ch == sep:
	// 			result.append(st[cursor:i])
	// 			cursor = i + 1
	// 		if i + 1 == length:
	// 			result.append(st[cursor:])
	// 	return result

	// def q_join(lst, sep=','):
	// 	"""
	// 	Joins a list on sep, quoting strings with QUOTABLE chars
	// 	>>> s = ['Max', 'Moller', 'Rasmussen, Max']
	// 	>>> q_join(s)
	// 	'Max,Moller,"Rasmussen, Max"'
	// 	"""
	// 	return sep.join([dQuote(itm) for itm in lst])


}



////////////////////////////////////
// API calls
////////////////////////////////////

var Api = {

	defaults: {
			cache: false,
			type: 'POST',
			data: '',
			dataType: 'html',
			contentType: "application/json; charset=utf-8",
	},

	queue: $.manageAjax.create('cacheQueue', {
	    queue: true, 
	    cacheResponse: false
	}),

	loadApps: function(){
		// Already have credentials and whatnot
		// - determine if we should load local values or not
		
		var dfd = $.Deferred();
		
		Api.query('/api/apps',{
			data: {},
			success: function(response){

				try {
					var json = $.parseJSON(response);
				} catch (err){
					alert("Failed parsing JSON");
					return;
				}

				// Check the validity
				if(json.code != 200){
					// Expecting a 200 code returned
					console.log('200 not returned');
					return;
				}

				var apps = json.data;

				$.each(apps,function(i,app){

					// Load app scripts
					// - load from dev, if specified in localStorage

					var tmp = localStorage.getItem('app_' + app.id + '_dev');
					if(tmp == 1){
						// Load locally, get a new manifest.json

						console.log('DEV');
						console.log(app);

						// Load manifest
						$.ajax({
							url: './apps/' + app.id + '/manifest.json',
							cache: false,
							error: function(err){
								// Unable to find manifest.json
								console.log('Unable to find manifest.json locally');
								console.log(err);
							},
							success: function(rManifest){

								// Parse manifest

								// Inject assets
								console.log('Manifest');
								console.log(rManifest);
								console.log(rManifest.id);

								// CSS
								$.each(rManifest.scripts.css,function(i,script){
									$("head").append("<link>");
									var css = $("head").children(":last");
									css.attr({
										rel:  "stylesheet",
										type: "text/css",
										href: "./apps/" + rManifest.id + '/css/' + script
									});
								});

								// JS
								$.each(rManifest.scripts.js,function(i,script){
									var script_url = "./apps/" + rManifest.id + '/js/' + script;
									$.getScript(script_url, function(){
										// finished loading script (or failed)
									});
								});

							}
						});

					} else {

						console.log('PROD');
						console.log(app);

						if(app.scripts && app.scripts.length > 0){

							// CSS
							$.each(app.scripts.css,function(i,script){
								$("head").append("<link>");
								var css = $("head").children(":last");
								css.attr({
									rel:  "stylesheet",
									type: "text/css",
									href: App.Credentials.s3_bucket + App.Credentials.user_token + "/apps/" + app.id + '/css/' + script
								});
							});

							// JS
							$.each(app.scripts.js,function(i,script){
								var script_url = App.Credentials.s3_bucket + App.Credentials.user_token + "/apps/" + app.id + '/js/' + script;
								$.getScript(script_url, function(){
									// finished loading script (or failed)
								});
							});
						}

					}

				});

				// Resolve after loaded scripts
				dfd.resolve({
					success: apps
				});

			}
		});

		// Return search function
		return dfd.promise();

	},

	search: function(queryOptions, cacheOptions){

		// Caching is only half-written. Got out of control thinking about how to do it correctly

		// Search does caching, no other functions use it (why would they?)
		if(typeof(cacheOptions) == 'object'){
			if(cacheOptions.cache == true){
				// cache is ON

				// 2 functions required: 
				// - create: new records retrieved, either from cache or query
				// - update: new records retrieved, from query

				// Records will be returned in 2 primary types
				// - searching using a query: LIKE, or other conditions
				//		- cache search parameters, see if we have that query stored
				//		- run the search occasionally, or when triggered somehow (clicking 'Inbox' again)
				// - searching for exact models: id: 201
				//		- models listen on a Firebase channel for updates to that model's version number, then do a new Search accordingly

				// Types:
				// - search
				// - ids (array using IN, or a single id)
				//		- paths must match?

				if(cacheOptions.type == 'search'){
					// todo..., not caching this stuff yet
				}

				if(cacheOptions.type == 'id'){
					// What id's are we trying to get cached values for?

					try {
						var tmpData = queryOptions.data;
						var tmpModel = tmpData.model;
						var tmpIds = tmpData.conditions.id;
						var tmpPaths = App.Utils.MD5(JSON.stringify(tmpData.paths));

						// Parse Ids
						if(typeof(tmpIds) == 'array'){
							tmpIds = tmpIds[1]; // contains IN as first value in array
						} else {
							tmpIds = [tmpIds.toString()];	// only a single id
						}

					} catch(err){
						// Failed caching
						// - should gracefully fuck up
						console.log('Failed Caching!');
					}

					// Do we have these values cached?
					// - iterate through each
					var cached = [];
					var uncached = [];
					$.each(tmpIds,function(i,id){
						// Get item from localstorage
						var tmpPath = tmpModel+'.'+id;
						console.log('Looking for: '+tmpPath);
						var tmpItem = localStorage.getItem(tmpPath);
						if(typeof(tmpItem) == 'undefined'){
							// Unable to find
							console.log('Failed to find');
							uncached.push(id);
						} else {
							// Found it in the cache!
							
							// Do we have each of the paths cached?
							// - this doesn't handle missing paths (like original.Attachments)!! 
							//		- renders it virtually useless because of this...
							tmpItem = JSON.parse(tmpItem);
							


							cached.push(tmpItem);
						}
					});

					// Any not cached?
					// - we will search for those again
					if(cached.length != tmpIds.length){

						// Run search like normal, cache the results
						// - todo, only run the search for the non-cached values



					}


				}

				// Try to get records from Cache
				var records = recordsFromCache();

				// Any records exist?
				if(records.code == 200){
					// We were returned some records from the cache
					// - going to fire both create and update

					// Fire create with cached data


				} else {

				}

			}
		}

		// Normal search query
		return Api.query('/api/search',queryOptions);

	},

	count: function(queryOptions){

		return Api.query('/api/count',queryOptions);

	},

	update: function(queryOptions){

		return Api.query('/api/update',queryOptions);

	},

	write: function(queryOptions){

		return Api.query('/api/write',queryOptions);

	},

	event: function(queryOptions){

		// Start listeners


		var _return = Api.query('/api/event',queryOptions);

		// Chain to _return
		if(queryOptions.response){

			_return
				.then(function(bodyResponse){
					
					bodyResponse = JSON.parse(bodyResponse);
					var job_id = bodyResponse.data.job_id;

					// Should check if bodyRepsonse.data.triggered has a pkg we are creating listeners for (if they didn't match)

					// Iterate over response listeners to create
					$.each(queryOptions.response,function(pkg,callback){
						Api.Event.on({
							event: queryOptions.data.event + ".Response"
						},function(result){
							// Check for package match
							if(result.type == 'response' && result.data.response_to == job_id){

								// Any or specific
								if(result.data.app  == pkg || result.data.app  == 'any'){
									// Handle any response
									// console.log('callback');
									callback(result.data); // only return the result.data
									return;
								}

								// All (mapreduce?)
								// - todo...

							}
							
						});
					});
				});
		}


		return _return;

	},

	query: function(url,queryOptions){
		// Almost the exact same as Api.search

		var use_queue = false;
		if(typeof queryOptions.queue == 'boolean'){
			use_queue = queryOptions.queue;
			delete queryOptions.queue;
		}

		var queryDefaults = {
			data: {},
			headers: {"Content-Type" : "application/json"},
			success: function(response){
				console.log('API request succeeded');
				// console.log(response);
			},
			error: function(e){
				console.log('API failed');
				console.log(e);
			}
		};
		
		queryOptions = $.extend(queryDefaults,queryOptions);

		// Check online status
		if(!App.Data.online){
			window.setTimeout(function(){
				queryOptions.error.call('Not connected to internet')
			},1);
			return;
		}

		// Merge data with auth
		var data = $.extend({},queryOptions.data);
		queryOptions.data = {
							auth: {
									app: App.Credentials.app_key,
									access_token: App.Credentials.access_token
								},
							data: data
							};

		queryOptions.data = JSON.stringify(queryOptions.data);
		
		if(url == '/api/search'){
			url = App.Credentials.base_api_url + url;
		} else {
			url = App.Credentials.base_api_url + url;
		}

		var ajaxOptions = $.extend(Api.defaults, {url: url});

		ajaxOptions = $.extend(ajaxOptions, queryOptions);

		if(use_queue){
			return Api.queue.add(ajaxOptions);
		} else {
			return $.ajax(ajaxOptions);
		}

	}, 

	login: function(queryOptions){

		var url = '/api/login';

		var queryDefaults = {
			data: {},
			headers: {},
			success: function(response){
				// Succeeded
			},
			error: function(e){
				console.log(e);
				console.log('Search API failed');
			}
		};
		
		queryOptions = $.extend(queryDefaults,queryOptions);

		// Merge data with auth
		var data = $.extend({},queryOptions.data);
		queryOptions.data = {
							auth: {
									app: App.Credentials.app_key,
									//access_token: Api.access_token // just missing this field vs. a normal request
								},
							data: data
							};

		queryOptions.data = JSON.stringify(queryOptions.data);
		
		var ajaxOptions = $.extend(Api.defaults, {url: App.Credentials.base_api_url + url});

		ajaxOptions = $.extend(ajaxOptions, queryOptions);

		if(useForge){
			return window.forge.ajax(ajaxOptions);
		} else {
			return $.ajax(ajaxOptions);
		}

	},


	Event: {

		listener: null,
		listen_on: {},
		ignore_next: true, // Ignore the first incoming one
		start_listening: function(){
			// Start listening on the socket.io feed
			// return false;
			console.log('Starting to listen...');
			var socket = io.connect(App.Credentials.base_api_url + '/'); // SSL
			var room_login = {
				app: App.Credentials.app_key,
				access_token: App.Credentials.access_token,
				user: App.Credentials.user
			};
			socket.on('disconnect',function(){
				// alert('disconnected');
			});
			socket.on('connect',function(){
				socket.emit('room', JSON.stringify(room_login)); // log into room
			});
			socket.on('event', function (new_event) {

				// See if Event.name exists
				if(typeof(new_event.event) != 'string'){
					// Missing
					console.log('Missing new_event.event');
					return;
				}

				// Log that we received a new Event
				console.log('Event Received:' + new_event.event);
				// console.log(new_event);
				console.log(new_event);

				// Go through each plugin and fire the callback (with firebase data) if it matches
				var fired = 0;
				$.each(Api.Event.listen_on,function(i,listener){
					// console.log('listen_on');
					
					// See if listener is on many different events
					if(typeof(listener.data.event) != 'object'){
						listener.data.event = [listener.data.event];
					}

					$.each(listener.data.event, function(i,lEvent){
						if(lEvent != new_event.event){
							//console.log('Listener plugin not match Event (utils.js)');
							return;
						}

						// Events match, check the id (if necessary
						if(listener.data.id != new_event.id){
							// Don't match
							// - null would have also matched
							//console.log('Listerner plugin did not match ID (utils.js)');
							// console.log(new_event.id);
							if(typeof listener.data.id != 'undefined'){
								return;
							}
						}

						// Looks good, fire the callback
						// - async
						// console.log('Firing callback');
						listener.callback(new_event);
						fired++;
					});

				});

				// console.log('Fired '+fired+' callbacks');


			});

		},


		on: function(data,callback){
			// Adds another channel of data to listen for

			// Model, Event.name, Data
			// - can also include an id

			var id = App.Utils.guid();
			Api.Event.listen_on[id] = {
				data: data,
				callback: callback
			};

			return id;

		},

		off: function(id){
			// Turn off a listener
			// - delete out of object

			if(typeof(Api.Event.listen_on[id]) == 'undefined'){
				return true;
			}

			delete Api.Event.listen_on[id];

			return true;

		}

	}
	
};

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return !(a.indexOf(i) > -1);});
};
