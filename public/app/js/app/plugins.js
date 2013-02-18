// Simpler functions for plugins (like Models/components)

App.Plugins.Sponsored = {

	emails: function(){
		
		var dfd = $.Deferred();

		$.ajax({
			url: '/api/emails',
			type: 'POST',
			cache: false,
			data: JSON.stringify({}),
			// dataType: 'html',
			headers: {"Content-Type" : "application/json"},
			success: function(jData){
				// Result via Sponsored server
				
				if(jData.code != 200){
					//Failed logging in
					dfd.reject();
					return;
				}

				dfd.resolve(jData.data);
				
			}
		});


		return dfd.promise();


	}

}