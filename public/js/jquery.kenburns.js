;(function(factory){
   
  factory(jQuery);
 
})(function($){ 

	var KenBurns = (function(element, settings){
     
	  var instanceUid = 0;
	  var timerId;

		function _KenBurns(element, settings){
			this.defaults = {};

			this.settings = $.extend({},this,this.defaults,settings);

			this.$el = $(element);

			this.instanceUid = instanceUid++;
	  	}
	   
	  return _KenBurns;
	   
	})();

	KenBurns.prototype.start = function(){
		var _this = this;
		_this.update();
		this.timerId = setInterval(function(){
			_this.update();
		}, 5000)
	}

	KenBurns.prototype.stop = function(){
		clearInterval(this.timerId);
	}

	KenBurns.prototype.update = function(){
		var panel = this.$el;

		var slides = panel.find('.ken-burns-image-slide');
		var index = slides.index('.active');

		if(index < slides.length){
			index++;
		}else{
			index = 0;
		}


		slides.filter('.active').removeClass('active');
		$(slides.get(index)).addClass('active').find('.ken-burns-image').addClass('zoomed');

		window.setTimeout(function(){
			panel.find('.ken-burns-image-slide').not('.active').find('.ken-burns-image').removeClass('zoomed');
		}, 1000);
	}


    var methods = {
        init : function(options) {
        	this.KenBurns = new KenBurns(this, options);
        },
        start : function( ) {
        	this.KenBurns.start(); 
        },
        stop : function( ) {
        	this.KenBurns.stop(); 
        }
    };

	$.fn.KenBurns = function(methodOrOptions){
     
     	return this.each(function(index,el){

     		// el.data
       
      	// 	el.KenBurns = new KenBurns(el,options);

	      	if ( methods[methodOrOptions] ) {
	            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
	            // Default to "init"
	            return methods.init.apply( el, arguments );
	        } else {
	            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.tooltip' );
	        } 
       
    	});
    }
});