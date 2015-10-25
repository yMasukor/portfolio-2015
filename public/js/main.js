var pageTransitions = false;
var isFirst = true;

var routes = {
	onExit:function(foo, next){
		console.log('onExit');
		pageTransitions = true;
		isFirst = false;
		next();
	},

	onHome:function(){
		console.log('showing index page');
		showHomepage();
	},

	onWork:function(context){
		console.log('showing work page', context.params.workTitle);
		showSection($('.work-container#'+context.params.workTitle), pageTransitions);
		loadWorkDetailIfNeeded($('.work-container#'+context.params.workTitle), context.params.workTitle);
		if(!isFirst){
			
		}
	},

	onContact:function(){
		console.log('showing contact page')
	}
}

page.base();
page('/', routes.onHome);
page('/works/:workTitle', routes.onWork);
page('/contact', routes.onContact);
page.exit('*', routes.onExit);
page();










function showSection(section, animated){

	var duration = 0;
	if(animated){
		duration = 300;
		section.addClass('animated');
	}else{
		section.removeClass('animated');
	}

	section.removeClass('hovered');
	section.addClass('opening');
	window.setTimeout(function(){
		$("body").animate({ scrollTop: section.find('.work-title').offset().top-196 }, duration, 'linear', function(){
			$('body').addClass('scrollLock');
			console.log('open scroll', $('body').scrollTop(), $('#content-wrapper').height())
			section.addClass('opened');

			window.setTimeout(function(){
				section.find('.work-desc, .work-link-wrapper').css({'display':'none'});
				if(section.find('.work-detail')){
					section.find('.work-detail').addClass('showing');
				}
			}, duration)
		});
	}, duration)
}



function showHomepage(){	
	if($('.work-container.opened').length == 0){
		console.log('on the homepage');
		$('body').removeClass('scrollLock');
	}else{
		$('.work-container.opened').each(function(){
			console.log('foobar')
			closeSection($(this), true);
		});
	}
}



function closeSection(section, animated){
	var duration = 0;
	if(animated){
		duration = 300;
		section.addClass('animated');
	}else{
		section.removeClass('animated');
	}

	section.find('.work-detail').removeClass('showing');
	window.setTimeout(function(){

		section.find('.work-desc, .work-link-wrapper').css({'display':'block'});

		section.animate({ scrollTop: 0}, 300, 'linear', function(){
			section.removeClass('opening');
			section.removeClass('opened');
			$("body").scrollTop(section.find('.work-title').offset().top-196);
			$('body').removeClass('scrollLock');
		});
	}, duration)
}



function loadWorkDetailIfNeeded(section, sectionName){
	console.log(section.find('.work-detail'))

	if(!section.find('.work-detail').children().length > 0){
		console.log('need to load work')
		section.find('.work-detail').load('partial/'+sectionName, function(){
			console.log('section loaded');
			// section.find('.work-detail').addClass('loaded');
		});
	}

	if(!section.find('.work-detail').hasClass('loaded')){
		
	}
	
}


















$(document).ready(function(){

	$('.fixed-scroll-panel').waypoint({
		handler:function(direction){
			var e = $(this.element);
			if(direction == 'down'){
				e.find('.panel-fixed').addClass('fixed');
			}else{
				e.find('.panel-fixed').removeClass('fixed').removeClass('bottom').addClass('top');
			}
		},
    });


    $('.fixed-scroll-panel').waypoint({
		handler:function(direction){
			var e = $(this.element);
			if(direction == 'down'){
				e.find('.panel-fixed').removeClass('fixed').removeClass('top').addClass('bottom');
			}else{
				e.find('.panel-fixed').addClass('fixed');
			}
		},
		offset: 'bottom-in-view'
    });





    $('.work-container').waypoint({
		handler:function(direction){
			console.log('top of work section', direction);

			var e = $(this.element);
			if(direction == 'down'){
				e.addClass('in-view');
				inviewPanelStart(e);
			}else{
				e.removeClass('in-view');
				inviewPanelEnd(e);
			}
		},
		offset: '100%'
    });

    $('.work-container').waypoint({
		handler:function(direction){
			console.log('bottom of work section', direction);

			var e = $(this.element);
			if(direction == 'down'){
				e.removeClass('in-view');
				inviewPanelEnd(e);
			}else{
				e.addClass('in-view');
				inviewPanelStart(e);
			}
		},
		offset: '-200%'
    });
});


function inviewPanelStart(panel){
	// panel.find('.ken-burns-panel').each(function(){
	// 	$(this).KenBurns('start');
	// });
}

function inviewPanelEnd(panel){
	// panel.find('.ken-burns-panel').each(function(){
	// 	$(this).KenBurns('stop');
	// });
}




