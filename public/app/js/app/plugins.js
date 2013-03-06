
App.Plugins.Minimail = {

	login: function(){
		// Login into our server

		var dfd = $.Deferred();

		var loginData = {
			access_token: App.Credentials.access_token
		};

		var ajaxOptions = {
			url: App.Credentials.minimail_server + '/api/login',
			type: 'POST',
			cache: false,
			data: loginData,
			dataType: 'json',
			// headers: {"Content-Type" : "application/json"},
			error: function(err){
				// Failed for some reason
				// - probably not on the internet
				if(!App.Data.online){
					alert('Unable to load a data connection (placeholder)');
				}
			},
			success: function(jData){
				// Result via Minimail server
				// - sets cookie?

				if(jData.code != 200){
					//Failed logging in
					clog('==failed logging in');
					dfd.reject(false);
					return;
				}


				App.Credentials.app_user = jData.data.user;
				


			}
		};

		if(useForge){
			clog('FORGE AJAX');
			window.forge.ajax(ajaxOptions);
		} else {
			$.ajax(ajaxOptions);
		}

		return dfd.promise();

	}

};