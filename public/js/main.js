var pageTransitions = false;
// var isFirst = true;
var lastPage = null;


//

function async(callback){
	window.setTimeout(function(){
		callback();
	}, 0)
}



//Page Routes
var routes = {
	onExit:function(context, next){
		console.log('onExit');
		pageTransitions = true;
		lastPage = context;
		context.foobar = "foobar";
		// console.log('foo', context)

		next();
	},

	onHome:function(){
		console.log('showing index page');
		showHomepage();
	},

	onWork:function(context){
		console.log('showing work page', context, lastPage);
		
		//If this is the first page, we won't need to load, the template should already contain the content.

		//This logic is all fucked up, I should abstract the transition types and handle w a single function call
		if(lastPage){
			loadWorkDetailIfNeeded($('.work-container#'+context.params.workTitle), context.params.workTitle);

			//Check what kind of transition we need
			if(~lastPage.path.indexOf('works')){
				console.log('last was a work page');
				showSectionFromSection($('.work-container#'+context.params.workTitle), $('.work-container#'+lastPage.params.workTitle), pageTransitions);
				return;
			}
		}

		showSection($('.work-container#'+context.params.workTitle), pageTransitions);
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

	//TODO onAnimationEnd doesn't seem to fire reliably, so... timeouts? :/
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



function showSectionFromSection(section, lastSection, animated){
	//open the section, and move it off screen.


	//check if transition should be slide up or down
	console.log(section.data('index'), lastSection.data('index'))
	// var transition = 'slide-down'

	if(section.data('index') > lastSection.data('index')){
		section.addClass('offset-down');
		showSection(section, false);

		//delay a tick

		async(function(){
			section.addClass('animated').removeClass('offset-down');
			lastSection.addClass('animated offset-up');
			
			//TODO Eugh, nested timeouts - find a better way of doing this
			window.setTimeout(function(){
				//clean up
				closeSection(lastSection, false);

				section.removeClass('animated');
				lastSection.removeClass('animated');
				async(function(){
					lastSection.removeClass('offset-up');
				})
			}, 400);
		})

	}else{
		section.addClass('offset-up');
		showSection(section, false);

		//delay a tick
		async(function(){
			section.addClass('animated').removeClass('offset-up');
			lastSection.addClass('animated offset-down');
			
			//TODO Eugh, nested timeouts - find a better way of doing this
			window.setTimeout(function(){
				//clean up
				closeSection(lastSection, false);

				section.removeClass('animated');
				lastSection.removeClass('animated');
				async(function(){
					lastSection.removeClass('offset-down');
				})
			}, 400);
		})
	}
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

	console.log('FUCK', section.attr('id'))

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

		section.animate({ scrollTop: 0}, duration, 'linear', function(){
			section.removeClass('opening');
			section.removeClass('opened');
			$("body").scrollTop(section.find('.work-title').offset().top-196);

			//If all sections are closed, let the body scroll again
			if($('.opened, .opening').length == 0){
				$('body').removeClass('scrollLock');
			}
			
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

	$('.work-link').hover(function(){
		hoverSection($('#'+$(this).data('section')))
	}, function(){
		unhoverSection($('#'+$(this).data('section')))
	});

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




    $('.ken-burns-panel').KenBurns();


});


function inviewPanelStart(panel){
	panel.find('.ken-burns-panel').each(function(){
		$(this).KenBurns('start');
	});
}

function inviewPanelEnd(panel){
	panel.find('.ken-burns-panel').each(function(){
		$(this).KenBurns('stop');
	});
}


function hoverSection(section){
	section.addClass('hovered');
}

function unhoverSection(section){
	section.removeClass('hovered');
}



