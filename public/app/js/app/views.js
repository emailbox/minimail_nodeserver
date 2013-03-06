Backbone.View.prototype.close = function () {
	if (this.beforeClose) {
		this.beforeClose();
	}
	// this.unbind();
	// this.remove();
	this.undelegateEvents();
	$(this).empty();
	this.unbind();
};


Backbone.View.prototype.garbage = function (view_list) {
	// Trash views that are not currently needed

	// passes in a view_list of things to trash



};


App.Views.Body = Backbone.View.extend({
	
	el: 'body',

	events: {

	},

	initialize: function() {
		_.bindAll(this, 'render');

	},

	render: function() {

		var that = this;

		// Data
		// var data = this.options.accounts.UserGmailAccounts;

		// Should start the updater for accounts
		// - have a separate view for Accounts?

		// Template
		var template = App.Utils.template('t_body');

		// Write HTML
		$(this.el).html(template(App.Credentials));

		// Step 1 subview
		// var csv_el = this.$('#body_container');

		// Render subview
		// if(that.subCsv){
		// 	that.subCsv.close();
		// }
		var subDebugCss = new App.Views.DebugCss({
			// el: csv_el
		});
		$(this.el).append(subDebugCss);
		App.router.showView('subDebugCss',subDebugCss);
		// that.subCsv.render();

		return this;
	}
});


App.Views.DebugCss = Backbone.View.extend({
	
	el: '#body_container',

	events: {
		'click #request_refresh_html' : 'request_html_refresh',
		'click #update_remote_css' : 'update_remote_css',
		'click .turn' : 'turn'
	},

	initialize: function() {
		_.bindAll(this, 'render');
		_.bindAll(this, 'render_editor');

	},

	render_editor: function(){
		var that = this;

		// HTML
		html_editor = ace.edit("html_editor");
		var HtmlMode = require("ace/mode/html").Mode;
		html_editor.getSession().setMode(new HtmlMode());
		//editor_json.getSession().setFoldStyle('markbegin'); // can't get folding to work
		html_editor.setBehavioursEnabled(false); // turn off auto-complete brackets (annoying)
		html_editor.getSession().setValue("Loading HTML (may take a minute)");

		// CSS
		css_editor = ace.edit("css_editor");
		var CssMode = require("ace/mode/css").Mode;
		css_editor.getSession().setMode(new CssMode());
		//editor_json.getSession().setFoldStyle('markbegin'); // can't get folding to work
		css_editor.setBehavioursEnabled(false); // turn off auto-complete brackets (annoying)
		css_editor.getSession().setValue("Loading CSS (may take a minute)");

	},


	turn: function(ev){
		var that = this;
			elem = ev.currentTarget;

		var text = $(elem).attr('data-turn');

		// Turn on cssdebug on the phone
		Api.event({
			data: {
				event: 'AppMinimailDebugCss.turn',
				obj: text
			},
			success: function(response){
				response = JSON.parse(response);
			}
		});

		return false;
	},

	request_html_refresh: function(ev){

		// Get and emit HtmlMode
		Api.event({
			data: {
				event: 'AppMinimailDebugHtml.request_refresh',
			},
			success: function(response){
				response = JSON.parse(response);
				console.log('PHONE RESPONSE');
				console.log(response);
			}
		});

		return false;
	},

	update_remote_css: function(ev){

		console.log('val');
		console.log(css_editor.getSession().getValue());

		// Get and emit HtmlMode
		Api.event({
			data: {
				event: 'AppMinimailDebugCss.web_update',
				obj: {
					css: css_editor.getSession().getValue()
				}
			},
			success: function(response){
				response = JSON.parse(response);
				console.log('PHONE RESPONSE');
				console.log(response);
			}
		});

		return false;
	},

	render: function() {

		var that = this;

		// Data
		// var data = this.options.accounts.UserGmailAccounts;

		// Should start the updater for accounts
		// - have a separate view for Accounts?

		// Template
		var template = App.Utils.template('t_debug_css');

		// Write HTML
		$(this.el).html(template());

		this.render_editor();

		// Track changes
		// track changes to files

		return this;
	}
});


App.Views.Csv = Backbone.View.extend({
	
	el: '#body_container',

	events: {
		'change #files' : 'upload_read',
		'click #test_sending' : 'test',
		'click #pick_csv' : 'pick_csv'
	},

	initialize: function() {
		_.bindAll(this, 'render');

	},

	test: function(){
		// Load from default

		var parsed = JSON.parse('[["name","company","email"],["personName","companyName","'+App.Data.UserEmailAccounts.accounts[0].email+'"]]');
		App.Data.parsed_csvdata = parsed;
		Backbone.history.loadUrl('recipients')

		return false;
	},

	upload_read: function(ev){
		var that = this;

		var files = ev.target.files; // FileList object

		// Loop through the FileList and render image files as thumbnails.
		for (var i = 0, f; f = files[i]; i++) {

			// Only process csv files.
			if (!f.type.match('text/csv')) {
				console.log('Tried uploading a non-csv file');
				continue;
			}

			// Open the reader
			try {
				var reader = new FileReader();
			} catch(err){
				alert('You will need to update your browser before CSV parsing works. Please check out the newest Chrome or Firefox!');
				return false;
			}

			// Closure to capture the file information.
			reader.onload = (function(theFile) {
				return function(e) {
					// Parse csv

					var parsed = App.Utils.CSVToArray(e.target.result);


					// Validate document
					// - must have email, email must be valid, etc.
					// - todo...

					// Parse csv into columns, etc.

					// Get first column
					if(parsed.length < 2){
						alert('Your CSV file must contain at least 2 rows: 1 for the column names, 1 for an email address');
						return;
					}

					// column names
					// - should sanitize and whatnot, but that can wait
					// console.log(JSON.stringify(parsed));

					// Must have "emails" as a variable
					var column_names = parsed[0];
					if(column_names.indexOf('email') == -1){
						alert('Must contain "email" as one of the column names');
						return;
					}


					// Total rows cannot exceed App.Credentials.max_rows
					if(parsed.length > App.Credentials.max_rows){
						alert('Sorry, you are limited to 15 rows per CSV file. Contact nick@getemailbox.com to increase this limit');
						return false;
					}


					// Write to data
					App.Data.parsed_csvdata = parsed;

					Backbone.history.loadUrl('recipients')

					// Done parsing CSV
					// - or at least we hope it is done

					// var span = document.createElement('span');
					// span.innerHTML = ['<img class="thumb" src="', e.target.result,
					// 				'" title="', escape(theFile.name), '"/>'].join('');
					// document.getElementById('list').insertBefore(span, null);
				};
			})(f);

			// Read in the image file as a data URL.
			reader.readAsText(f);
		}


		return false;
	},


	pick_csv: function(ev){
		// Choose a CSV file from somewhere
		// - parse the CSV

		var that = this;

		var elem = ev.currentTarget;

		// Disabled?
		if($(elem).attr('disabled') == 'disabled'){
			return false;
		}

		// Change text to "Uploading CSV" or similar
		$(elem).attr('disabled','disabled');
		$(elem).text('Uploading and Parsing CSV');

		filepicker.pick({
			extensions: ['.csv'],
			services: ['BOX',
						'COMPUTER',
						'DROPBOX',
						'GMAIL',
						'URL']
		}, function(FPFile){
			// console.log('successs');
			// console.log(FPFile);

			// Download the file
			filepicker.read(FPFile, function(fileData){

				try {
					var parsed = App.Utils.CSVToArray(fileData);
				} catch (err){

					alert('Failed parsing CSV, please try again (e1)');

					// Revert
					that.revert_btn();

					return;
				}

				// Get first column
				if(parsed.length < 2){
					alert('Your CSV file must contain at least 2 rows: 1 for the column names, 1 for an email address');

					// Revert
					that.revert_btn();
					return;
				}

				// column names
				// - should sanitize and whatnot, but that can wait
				// console.log(JSON.stringify(parsed));

				// Must have "emails" as a variable
				var column_names = parsed[0];
				if(column_names.indexOf('email') == -1){
					alert('Must contain "email" as one of the column names');

					// Revert
					that.revert_btn();
					return;
				}


				// Total rows cannot exceed App.Credentials.max_rows
				if(parsed.length > App.Credentials.max_rows){
					alert('Sorry, you are limited to 25 rows per CSV file. Contact nick@getemailbox.com to potentially increase this limit');

					// Revert
					that.revert_btn();
					return false;
				}


				// Write to data
				App.Data.parsed_csvdata = parsed;

				Backbone.history.loadUrl('recipients');

			});


		}, function(FPError){
			alert('Failed parsing CSV, please try again (e2)');

			// Revert
			that.revert_btn();
		});

		return false;
	},

	revert_btn: function(){

		// Revert elem
		$('#pick_csv').removeAttr('disabled');
		$('#pick_csv').text('Pick CSV');

	},

	render: function() {

		var that = this;

		// Data
		// var data = this.options.accounts.UserGmailAccounts;

		// Should start the updater for accounts
		// - have a separate view for Accounts?

		// Template
		var template = App.Utils.template('t_csv');

		// Write HTML
		$(this.el).html(template());

		return this;
	}
});


App.Views.Recipients = Backbone.View.extend({
	
	el: '#body_container',

	events: {
		'click .looksgood' : 'continue',
		'click #new-row' : 'new_row',
		'click .remove' : 'remove_row'
	},

	initialize: function() {
		_.bindAll(this, 'render');

	},


	new_row: function(ev){
		// Add a new row to the grid
		var elem = ev.currentTarget;

		// Get rows to use
		var variables = [];
		$('thead th').each(function(i,item){
			variables.push($.trim($(item).text()));
		});

		// Build template
		var template = App.Utils.template('t_recipients_empty_row');

		var newRowHtml = template(this.tData.variables);

		// Add new row html
		this.$('tbody').prepend(newRowHtml);

		// jEditable
		this.jeditable({
			onblur: 'submit',
			width: 'none',
			height: 'none'
		});

		return false;

	},


	remove_row: function(ev){
		// remove a row

		var elem = ev.currentTarget;

		$(elem).parents('tr').remove();

		return false;

	},


	continue: function(ev){
		// Continue to the next step
		var that = this;

		// Create unique id for each row
		// $.each(App.Data.organized_data,function(i,v){
		// 	var id = i;
		// 	App.Data.organized_data['id'] = var id;
		// });

		// Parse incoming data
		var recipients = [];
		var validated = true;
		this.$('tbody tr').removeClass('invalid');
		this.$('tbody tr').each(function(i,row){
			var tmp = {};
			$(row).find('td.editable').each(function(k,item){
				tmp[that.tData.variables[k]] = $.trim($(item).text());
			});

			// Validate Email in row
			if(!App.Utils.validate.email(tmp.email)){
				// Not valid email
				validated = false;

				// Change color of background on row
				$(row).addClass('invalid');
			}

			recipients.push({
				columns: tmp,
				email: {},
				live: true
			});
		});

		if(!validated){
			alert('1 or more email addresses are not valid');
			return false;
		}

		// Set to App.Data.organized_recipients
		// App.Data.organized_data = this.tData;

		// // Parse data into pretty format
		// var recipients = [];
		// $.each(that.tData.rows,function(i,row){
		// 	var tmp = {};
		// 	$.each(row,function(k,value){
		// 		tmp[that.tData.variables[k]] = value;
		// 	});
		// 	recipients.push({
		// 		columns: tmp,
		// 		email: {}
		// 	});
		// });

		// console.log(recipients);
		// return false;


		//App.Data.recipients = $.extend({},App.Data.organized_data);
		App.Data.variables = $.extend([],that.tData.variables);
		App.Data.recipients = recipients;

		// console.log(App.Data);

		Backbone.history.loadUrl('content');

		return false;
	},

	jeditable: function(){

		// jEditable
		this.$('td.editable').editable(function(value, settings){
			return value;
		}, {
			tooltip   : 'Click to edit...',
			width: 'none',
			height: 'none',
			onblur: 'submit'
		});

	},

	render: function() {

		var that = this;

		// Data
		// var data = this.options.accounts.UserGmailAccounts;

		// Should start the updater for accounts
		// - have a separate view for Accounts?

		that.tData = {
			variables: App.Data.parsed_csvdata[0],
			rows: App.Data.parsed_csvdata.splice(1,App.Data.parsed_csvdata.length)
		};

		// Template
		var template = App.Utils.template('t_recipients');

		// Write HTML
		$(this.el).html(template(that.tData));

		// jEditable
		this.jeditable();

		return this;
	}
});


App.Views.Content = Backbone.View.extend({
	
	el: '#body_container',

	events: {
		'click .looksgood' : 'continue',
		'click #populate_subject_and_body' : 'populate'
	},

	initialize: function() {
		_.bindAll(this, 'render');

	},

	continue: function(ev){
		// Continue to the next step
		// - save Subject and Body
		// - go through each person sending to
		var that = this;

		var elem = ev.currentTarget;

		// Save subject and body
		// console.log($(elem).parents('.dashboard').find('.content-subject').val());
		// console.log($(elem).parents('.dashboard').find('.content-body').val());
		App.Data.default_email = {
			subject: $(elem).parents('.dashboard').find('.content-subject').val(),
			body: $(elem).parents('.dashboard').find('.content-body').val()
		};

		// App.Data.organized_data = this.tData;
		Backbone.history.loadUrl('preview');

		return false;
	},

	populate: function(){
		// Populate Subject and Body with sample data
		var subject = 'Hi {{name}} from {{company}}';
		var body = 'This is a sample message to {{name}}. Thanks! ';

		this.$('#subject').val(subject);
		this.$('#body').val(body);

		return false;
	},

	render: function() {

		var that = this;

		// var tData = App.Data.organized_data;

		// Template
		var template = App.Utils.template('t_content');

		// Write HTML
		$(this.el).html(template(App.Data));

		return this;
	}
});


App.Views.Preview = Backbone.View.extend({
	
	el: '#body_container',

	events: {
		'click .preview' : 'preview',
		'click .remove' : 'remove_row',
		'click .send_all' : 'send_all'
	},

	initialize: function() {
		_.bindAll(this, 'render');

	},

	preview: function(ev){
		// Display a popup box for customizing the subject and body of the email

		// Get chosen element
		var elem = ev.currentTarget;

		var id = $(elem).parents('.preview_recipient').attr('data-id');

		Backbone.history.loadUrl('preview_sending/' + id)

		return false;
	},


	remove_row: function(ev){
		// remove a row

		var elem = ev.currentTarget;

		// Get id
		var id = $(elem).parents('tr.preview_recipient').attr('data-id');

		// Remove from html
		$(elem).parents('tr').remove();

		// Remove from memory
		App.Data.recipients[id].live = false;

		return false;

	},

	send_all: function(ev){
		// Send all the emails
		var that = this;

		// confirmation box
		var answer = prompt('Please type the word "send" (without quotes) into the text box to confirm sending');
		if(answer != 'send'){
			console.log('Sending was canceled');
			return false;
		}

		var elem = ev.currentTarget;

		// Disable button
		$(elem).text('Validating and Sending...');
		$(elem).attr('disabled','disabled');

		// Remove error message if exists
		$('#rate_limit_error').remove();

		// Hide validation for each email
		that.$('tr.preview_recipient td.validating').html('');

		var sendTo = [];
		$.each(App.Data.recipients,function(i,recipient){

			// No variables added yet?
			if($.isEmptyObject(recipient.email)){
				// Use default email
				
				// App.Data.recipients[this.options.id].email = $.extend({},App.Data.default_email);
				recipient.email = $.extend({},App.Data.default_email);
				
				// Replace values based on columns
				$.each(App.Data.variables,function(i,column_name){
					// Replace in email

					// Subject
					recipient.email.subject = recipient.email.subject.replace(new RegExp("{{"+column_name+"}}",'g'),recipient.columns[column_name]);

					// Body
					recipient.email.body = recipient.email.body.replace(new RegExp("{{"+column_name+"}}",'g'),recipient.columns[column_name]);

				});

			}

			// Email is built for this user
			sendTo.push(recipient);

		});


		// Validating sending against the Email API before emitting Email.send
		var total_sending_to = 0;
		var tmp_rate_limit = {};
		$.each(sendTo,function(i, recipient){

			if(recipient.live === false){
				return;
			}

			// Increase total_sending_to
			total_sending_to++;
			
			// Add to queue
			$(that.el).queue(function(next){

				// Change to load icon
				that.$('tr.preview_recipient[data-id="'+i+'"] td.validating').html('<i class="icon icon-refresh"> </i>');

				// Send return email
				var eventData = {
					event: 'Email.send.validate',
					delay: 0,
					obj: {
						To: recipient.columns.email,
						From: App.Data.UserEmailAccounts.accounts[0].email,
						Subject: recipient.email.subject,
						Text: recipient.email.body,
						headers: {}
					}
				};

				// Validate sending
				Api.event({
					data: eventData,
					response: {
						"pkg.native.email" : function(response){
							// Handle response (see if validated to send)
							// console.log('Response');
							// console.log(response);
							// console.log(response.body.code);

							// Update the view code
							if(response.body.code == 200){
								// Ok, validated sending this email
								that.$('tr.preview_recipient[data-id="'+i+'"] td.validating').html('<i class="icon icon-ok"> </i>');
							} else {
								// Failed, had an error
								that.$('tr.preview_recipient[data-id="'+i+'"] td.validating').html('<i class="icon icon-remove"> </i>');

							}

							// Get rate-limit info
							tmp_rate_limit = response.body.data;

							// How do I know when the queue completes?
							next();

							// if validation ok, then continue to the next one
							// - resolve or call?

						}
					}
				})
				.then(function(){
					// Done
					// console.log('Fired Email.send event');
				});
			});

		});
		
		var validationComplete = $.Deferred();

		// When validation is complete
		$.when($(that.el)).done(function(){
			// Are we over the rate limit?
			if(total_sending_to + tmp_rate_limit.current > tmp_rate_limit.rate_limit){
				
				// Build template and html for rate limit error message
				var template = App.Utils.template('t_preview_rate_limit_error');
				tmp_rate_limit['sending'] = total_sending_to;
				$('.preview_step').prepend(template(tmp_rate_limit));

				// Re-enable button
				$(elem).text('Send All Emails');
				$(elem).attr('disabled',false);
				return false;
			}

			// Ok, everything seems good for sending
			validationComplete.resolve();

		});

		// After validation is successful
		validationComplete.promise().then(function(){

			$.each(sendTo,function(i, recipient){

				if(recipient.live === false){
					return;
				}
				
				// Add to queue
				$(that.el).queue(function(next){

					// Change to sending icon
					that.$('tr.preview_recipient[data-id="'+i+'"] td.validating').html('<i class="icon icon-pencil"> </i>');

					// Send return email
					var eventData = {
						event: 'Email.send',
						delay: 0,
						obj: {
							To: recipient.columns.email,
							From: App.Data.UserEmailAccounts.accounts[0].email,
							Subject: recipient.email.subject,
							Text: recipient.email.body,
							headers: {}
						}
					};

					// Validate sending
					Api.event({
						data: eventData,
						response: {
							"pkg.native.email" : function(response){
								// Handle response (see if validated to send)
								console.log('Response');
								console.log(response);
								console.log(response.body.code);

								// Update the view code
								if(response.body.code == 200){
									// Ok, validated sending this email
									that.$('tr.preview_recipient[data-id="'+i+'"] td.validating').html('<i class="icon icon-hand-right"> </i>');
								} else {
									// Failed, had an error
									that.$('tr.preview_recipient[data-id="'+i+'"] td.validating').html('<i class="icon icon-remove"> </i>');

								}

								// Get rate-limit info
								// tmp_rate_limit = response.body.data;

								// How do I know when the queue completes?
								next();

								// if validation ok, then continue to the next one
								// - resolve or call?

							}
						}
					})
					.then(function(){
						// Done
						// console.log('Fired Email.send event');
					});
				});

			});
			
			// When sending is complete
			$.when($(that.el)).done(function(){
				// Are we over the rate limit?
				
				if(1==1){
					Backbone.history.loadUrl('review');
				} else {
					// testing
					$(elem).text('Send All Emails');
					$(elem).attr('disabled',false);
					return false;
				}

			});
		});

		// $.each(sendTo,function(i, recipient){
		
		// 	// Send return email
		// 	var eventData = {
		// 		event: 'Email.send',
		// 		delay: 0,
		// 		obj: {
		// 			To: recipient.columns.email,
		// 			From: App.Data.UserEmailAccounts.accounts[0].email,
		// 			Subject: recipient.email.subject,
		// 			Text: recipient.email.body,
		// 			headers: {}
		// 		}
		// 	};


		// 	// Send an email! 
		// 	Api.event({
		// 		data: eventData
		// 		})
		// 		.then(function(){
		// 			// Done
		// 			// console.log('Fired Email.send event');
		// 		});
		// });

		// Backbone.history.loadUrl('review');

		return false;
	},

	render: function() {

		var that = this;

		// Data
		// var tData = App.Data.recipients;

		// console.log('variables');
		// console.log(App.Data.variables);
		// console.log('recipients');
		// console.log(App.Data.recipients);

		// Template
		var template = App.Utils.template('t_preview');

		// Write HTML
		$(this.el).html(template({
			recipients: App.Data.recipients,
			variables: App.Data.variables,
			id: this.options.id
		}));

		return this;
	}
});


App.Views.PreviewSub = Backbone.View.extend({
	
	el: '#body_container',

	events: {
		'click .back' : 'back',
		'click .revert' : 'revert'
	},

	initialize: function() {
		_.bindAll(this, 'render');

	},

	back: function(ev){
		// Continue to the next step
		// - save Subject and Body
		// - go through each person sending to

		var elem = ev.currentTarget;

		// Save the current one
		var subject = $(elem).parents('.dashboard').find('.content-subject').val()
		var body = $(elem).parents('.dashboard').find('.content-body').val()

		App.Data.recipients[this.options.id].email = $.extend(App.Data.recipients[this.options.id].email, {
			subject: subject,
			body: body
		});
		console.log(App.Data.recipients);

		// Show all the possible ones
		Backbone.history.loadUrl('preview/' + this.options.id);

		// App.Data.organized_data = this.tData;
		// Backbone.history.loadUrl('content');

		return false;
	},

	save: function(ev){
		

		return false;
	},

	revert: function(ev){
		var that = this;

		// Revert to default template
		var elem = ev.currentTarget;

		var email = $.extend({},App.Data.default_email);
			
		// Replace values based on columns
		
		$.each(App.Data.variables,function(i,column_name){
			// Replace in email

			// Subject
			email.subject = email.subject.replace(new RegExp("{{"+column_name+"}}",'g'),that.options.recipient.columns[column_name]);

			// Body
			email.body = email.body.replace(new RegExp("{{"+column_name+"}}",'g'),that.options.recipient.columns[column_name]);

		});

		$(elem).parents('.dashboard').find('.content-subject').val(email.subject)
		$(elem).parents('.dashboard').find('.content-body').val(email.body)

		return false;
	},

	render: function() {

		var that = this;

		// Data
		var tData = this.options;
		tData.variables = $.extend([],App.Data.variables);


		// Email?
		if($.isEmptyObject(tData.recipient.email)){
			// Use default email
			
			// App.Data.recipients[this.options.id].email = $.extend({},App.Data.default_email);
			tData.recipient.email = $.extend({},App.Data.default_email);
			
			// Replace values based on columns
			$.each(App.Data.variables,function(i,column_name){
				// Replace in email

				// Subject
				tData.recipient.email.subject = tData.recipient.email.subject.replace(new RegExp("{{"+column_name+"}}",'g'),tData.recipient.columns[column_name]);

				// Body
				tData.recipient.email.body = tData.recipient.email.body.replace(new RegExp("{{"+column_name+"}}",'g'),tData.recipient.columns[column_name]);

			});

		}

		// Already edited?
		// - use the default, if not
		// - parse the variables

		// Template
		var template = App.Utils.template('t_preview_sub');

		// Write HTML
		$(this.el).html(template(tData));

		return this;
	}
});


App.Views.Review = Backbone.View.extend({
	
	el: '#body_container',

	events: {
		'click .home' : 'home'
	},

	initialize: function() {
		_.bindAll(this, 'render');

	},

	home: function(ev){
		// Continue to the next step
		// - save Subject and Body
		// - go through each person sending to

		alert(2);

		// App.Data.organized_data = this.tData;
		// Backbone.history.loadUrl('content');

		return false;
	},

	home: function(ev){
		// Display a popup box for customizing the subject and body of the email

		// Get chosen element
		var elem = ev.currentTarget;

		Backbone.history.loadUrl('csv')

		return false;
	},

	render: function() {

		var that = this;

		// Template
		var template = App.Utils.template('t_review');

		// Write HTML
		$(this.el).html(template({
			recipients: App.Data.recipients,
			variables: App.Data.variables
		}));

		return this;
	}
});


App.Views.BodyLogin = Backbone.View.extend({
	
	el: 'body',

	events: {
		'click .login' : 'login', // composing new email,
		'click .play_video' : 'play_video'

	},

	initialize: function() {
		_.bindAll(this, 'render');

	},

	login: function(ev){
		// Start OAuth process

		var p = {
			response_type: 'token',
			client_id : App.Credentials.app_key,
			redirect_uri : [location.protocol, '//', location.host, location.pathname].join('')
			// state // optional
			// x_user_id // optional	
		};
		var params = $.param(p);
		
		window.location = App.Credentials.base_api_url + "/apps/authorize/?" + params;


		return false;

	},

	play_video: function(ev){
		// Play video in Youtube player
		// - autoplay?

		var elem = ev.currentTarget;

		$(elem).remove();

		$('iframe.video').removeClass('nodisplay');

	},

	render: function() {

		var template = App.Utils.template('t_body_login');

		// Write HTML
		$(this.el).html(template());

		// Remove "more" link after scrolling down slightly
		$(window).on('scroll',function(){
			$(this).unbind('scroll');
			$('#more_hover').remove();
		})

		return this;
	}
});


App.Views.Modal = {

	Intro: Backbone.View.extend({
	
		el: 'body',

		events: {
		},

		initialize: function() {
			_.bindAll(this, 'render');
		},

		render: function() {

			// Remove any previous version
			$('#modalIntro').remove();

			// Build from template
			var template = App.Utils.template('t_modal_intro');

			// Write HTML
			$(this.el).append(template());

			// Display Modal
			$('#modalIntro').modal();

			return this;
		}
	}),

	Sending: Backbone.View.extend({
	
		el: 'body',

		events: {
		},

		initialize: function() {
			_.bindAll(this, 'render');
		},

		render: function() {
			
			// Remove any previous version
			$('#modalSending').remove();

			// Build from template
			var template = App.Utils.template('t_modal_sending');

			// Write HTML
			$(this.el).append(template(this.options));

			// Display Modal
			$('#modalSending').modal();

			return this;
		}
	})

};


