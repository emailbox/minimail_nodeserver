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

		// init Router
		// - not sure if this actually launches the "" position...
		App.router = new App.Router();


		// Get access_token if it exists
		var oauthParams = App.Utils.getOAuthParamsInUrl();
		if(typeof oauthParams.access_token == "string"){

			// Have an access_token
			// - save it to localStorage
			App.Utils.Storage.set(App.Credentials.prefix_access_token + 'user', oauthParams.user_identifier);
			App.Utils.Storage.set(App.Credentials.prefix_access_token + 'access_token', oauthParams.access_token);
			

			// Reload page, back to #home
			
			window.location = [location.protocol, '//', location.host, location.pathname].join('');
			return;
		}

		// Continue loading router
		Backbone.history.start({silent: true}); // Launches "" router
		App.router.navigate('',true);

		// Validate credentials

		var dfd = $.Deferred();

		// user from storage
		App.Utils.Storage.get(App.Credentials.prefix_access_token + 'user')
			.then(function(user){
				App.Credentials.user = user;
			});

		// access_token from storage
		App.Utils.Storage.get(App.Credentials.prefix_access_token + 'access_token')
			.then(function(access_token){
				App.Credentials.access_token = access_token;

				// Login against our server
				var loginData = {
					access_token: App.Credentials.access_token
				};

				if(!App.Credentials.access_token || App.Credentials.access_token.length < 1){
					//Failed logging in
					App.Utils.Storage.set(App.Credentials.prefix_access_token + 'user', null);
					App.Utils.Storage.set(App.Credentials.prefix_access_token + 'access_token', null);
					Backbone.history.loadUrl('body_login')
					return;			
				}

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
							App.Utils.Storage.set(App.Credentials.prefix_access_token + 'user', null);
							App.Utils.Storage.set(App.Credentials.prefix_access_token + 'access_token', null);
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
									// localStorage.setItem('user_token',null);
									// App.Credentials.user_token = null;
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

								// Listen for css update event
								Api.Event.on({
									event: 'AppMinimailDebugCss.phone_update'
								},function(result){
									// alert('update to css from remote');
									css_editor.getSession().setValue(result.data.css);

								});
								// Listen for html update event
								Api.Event.on({
									event: 'AppMinimailDebugHtml.phone_update'
								},function(result){
									// alert('update to css from remote');
									html_editor.getSession().setValue(result.data.html);
								});

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


			});


	}

	
};


