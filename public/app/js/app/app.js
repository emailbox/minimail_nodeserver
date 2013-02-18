//forge.debug = true;

var clog = function(v){
	window.console.log(v);
};

var App = {
	Models:      {},
	Collections: {},
	Views:       {},
	Utils:       {},
	Plugins:     {},
	Data: 		 {
		online: true,
		parsed_csvdata: [],
		Keys: {},
		UserEmailAccounts: {}
	},
	Credentials: tmp_credentials,

	// Called once, at app startup
	init: function () {

		var currentUrl = window.location.href;

		// Filepicker
		// filepicker.setKey(App.Credentials.filepicker_key);

		App.Data.Keys.ctrl = false;
		$(window).keydown(function(evt) {
			if (evt.ctrlKey) { // ctrl
				App.Data.Keys.ctrl = true;
			}
			if (evt.shiftKey) { // shift
				App.Data.Keys.shift = true;
			}
			if (evt.altKey) { // alt
				App.Data.Keys.alt = true;
			}
			if (evt.metaKey) { // meta/command
				App.Data.Keys.meta = true;
			}
		}).keyup(function(evt) {
			if (evt.ctrlKey) { // ctrl
				App.Data.Keys.ctrl = true;
			} else {
				App.Data.Keys.ctrl = false;
			}
			if (evt.shiftKey) { // shift
				App.Data.Keys.shift = true;
			} else {
				App.Data.Keys.shift = false;
			}
			if (evt.altKey) { // alt
				App.Data.Keys.alt = true;
			} else {
				App.Data.Keys.alt = false;
			}
			if (evt.metaKey) { // meta/command
				App.Data.Keys.meta = true;
			} else {
				App.Data.Keys.meta = false;
			}
		});

		// Load apps
		// - including development apps (default?)

		// init Router
		// - not sure if this actually launches the "" position...
		App.router = new App.Router();
		Backbone.history.start({silent: true}); // Launches "" router
		App.router.navigate('',true);

		var ui_user_token = localStorage.getItem('ui_user_token');
		App.Credentials.ui_user_token = ui_user_token;

		if(typeof App.Credentials.ui_user_token != 'string' || App.Credentials.ui_user_token.length < 1){
			// App.router.navigate("body_login", true);
			Backbone.history.loadUrl('body_login')
			return;
		}

		// Validate credentials

		var dfd = $.Deferred();

		return false;

		// Login against our server
		var loginData = {
			user_token: App.Credentials.ui_user_token
		};

		$.ajax({
			url: '/api/login',
			type: 'POST',
			cache: false,
			data: JSON.stringify(loginData),
			// dataType: 'html',
			headers: {"Content-Type" : "application/json"},
			success: function(jData){
				// Result via Sponsored server
				// - sets cookie
				if(jData.code != 200){
					//Failed logging in
					localStorage.setItem('ui_user_token',null);
					App.Credentials.ui_user_token = null;
					Backbone.history.loadUrl('body_login')
					return;
				}

				App.Credentials.app_user = jData.data.user;
				// console.log('App.Credentials.app_user');
				// console.log(App.Credentials.app_user);

				// dfd.resolve();

				// Backbone.history.loadUrl('body');
				

				Api.search({
					data: {
						model: 'UserGmailAccounts',
						fields: [],
						conditions: {},
						limit: 1
					},
					success: function(res){
						var res = JSON.parse(res);
						if(res.code != 200){
							dfd.reject();
							// localStorage.setItem('ui_user_token',null);
							// App.Credentials.ui_user_token = null;
							// // App.router.navigate("body_login", true);
							// Backbone.history.loadUrl('body_login')
							// return;
						}

						if(res.code != 200){
							//Failed logging in
							dfd.reject();
							return;
						}

						// At least 1 email account?
						if(res.data.length < 1){
							console.log('Error: Not any UserGmailAccounts');
						}

						// Save email accounts
						App.Data.UserEmailAccounts = res.data[0].UserGmailAccounts;

						// Start listening
						Api.Event.start_listening();

						// Load body
						Backbone.history.loadUrl('body');
						


						// Api.count({
						// 	data: {
						// 		model: 'Email',
						// 		conditions: {

						// 		}
						// 	},
						// 	success: function(res){
						// 		var res = JSON.parse(res);
						// 		if(res.code != 200){
						// 			// error
						// 			console.log(res);
						// 			return;
						// 		}

						// 		// How many emails have we processed?
						// 		if(res.data < 100){
						// 			// Backbone.history.loadUrl('intro');
						// 			var page = new App.Views.Modal.Intro();
						// 			page.render();

						// 		}
						// 	}
						// });

					}
				});
			}
		});

	}

	
};


