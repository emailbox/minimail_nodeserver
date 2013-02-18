
$(document).ready(function(){


	filepicker.setKey('ANmCrulqRQcympGJ9kxmEz');

	$('.save').on('click',function(){
		filepicker.exportFile(
			$(this).attr('href'),
			{mimetype:$(this).attr('data-mimetype')},
			function(FPFile){
				console.log(FPFile.url);
			});
		return false;
	});

	$('.preview').on('click',function(){
		// Show the preview
		
	});


	$('.share').on('click',function(){

		if($(this).hasClass('btn-success')){
			// Hide share links
			$(this).removeClass('btn-success');
			$(".share_div").animate({top:-80, opacity:"hide"}, 100);
		} else {
			// Show share links
			$(this).addClass('btn-success');
			// $('.share_div').removeClass('nodisplay');
			// $('.share_div').fadeIn();
			$(".share_div").animate({top:-20, opacity:"show"}, 200);
		}

		return false;

	});

});