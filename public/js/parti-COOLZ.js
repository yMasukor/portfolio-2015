var canvas;
var context;
var proton;
var renderer;
var emitter;
var stats;
var _mousedown = false;
var mouseObj;
var attractionBehaviour, crossZoneBehaviour;
var state = 2;
var count = 50;

var zoneRadius = 300;
var lowThreshold = 0.2;
var highThreshold = 0.65;

function setupProton(){
	canvas = document.getElementById("particles");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context = canvas.getContext('2d');
	// context.globalCompositeOperation = "overlay";

	createProton();
	createRenderer();
	tick();
	canvas.addEventListener('mousedown', mousedownHandler, false);
	canvas.addEventListener('mouseup', mouseupHandler, false);
	canvas.addEventListener('mousemove', mousemoveHandler, false);
	window.onresize = function(e) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		crossZoneBehaviour.reset(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'cross');
	}
}

function mousedownHandler(e) {
	_mousedown = true;
	// attractionBehaviour.reset(mouseObj, 200, 2000);
	mousemoveHandler(e);

	state++;
	state = state%3;

	console.log(state)
}

function mousemoveHandler(e) {
	if (_mousedown) {
		
	}

	var _x, _y;
	if (e.layerX || e.layerX == 0) {
		_x = e.layerX;
		_y = e.layerY;
	} else if (e.offsetX || e.offsetX == 0) {
		_x = e.offsetX;
		_y = e.offsetY;
	}

	mouseObj.x = _x;
	mouseObj.y = _y;
}

function mouseupHandler(e) {
	_mousedown = false;
	// attractionBehaviour.reset(mouseObj, -100, 200);
}


function createProton() {
	proton = new Proton;
	emitter = new Proton.Emitter();
	// emitter.damping = 0.2;
	// emitter.rate = new Proton.Rate(new Proton.Span(1, 1), 0.1);
	emitter.rate = new Proton.Rate(count)
	emitter.addInitialize(new Proton.Mass(new Proton.Span(1, 5)));
	emitter.addInitialize(new Proton.Radius(new Proton.Span(2, 1)));
	// emitter.addInitialize(new Proton.Life(1, 3));
	// emitter.addInitialize(new Proton.Velocity(new Proton.Span(20, 30), 0, 'polar'));
	// emitter.addInitialize(new Proton.Position(new Proton.RectZone(0, 0, canvas.width, canvas.height)));

	emitter.addInitialize(new Proton.Position(new Proton.CircleZone(canvas.width / 2, canvas.height / 2, 100)));

	mouseObj = {
		x : 1003 / 2,
		y : 610 / 2
	};
	attractionBehaviour = new Proton.Attraction(mouseObj, 0.01, 900);

	window.setInterval(function(){
		attractionBehaviour.reset({x:Math.floor(Math.random()*canvas.width), y:Math.floor(Math.random()*canvas.width)}, 0.01, 900);
	}, 5000);

	crossZoneBehaviour = new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'cross');
	emitter.addBehaviour(new Proton.Color('57F39C'));
	emitter.addBehaviour(new Proton.Alpha(new Proton.Span(0.2, 0.5),0));
	// emitter.addBehaviour(new Proton.RandomDrift(0.01, 0.01, 1));
	// emitter.addBehaviour(attractionBehaviour);

	emitter.addBehaviour({
		initialize : function(particle) {
			particle.initialRadius = particle.radius;
			particle.theta = Math.random()*Math.PI*2;
			// particle.speed = Math.random()*1000;


		},

		applyBehaviour : function(particle, time, index) {
			// particle.a.y += (0.2*(Math.sin((Date.now()-(particle.p.x*10))/2000)))*0.5;
			// console.log(particle)

			// particle.theta += Math.PI/(4000+particle.speed);

			// if(state == 0){0
			// 	if(particle.radius > 2){
			// 		particle.radius = particle.radius*0.9;
			// 	}
			// }else if(state == 1){
			// 	if(particle.radius < particle.initialRadius){
			// 		particle.radius = particle.radius*1.1;
			// 	}
			// }


			if(state == 0){
				//Ring
				particle.targetx = (canvas.width/2) + Math.cos(particle.theta)*300;
				particle.targety = (canvas.height/2) + Math.sin(particle.theta)*300;
				accelerateToTarget(particle)
			}else if(state == 1){
				//Grid
				particle.targetx = (index%Math.sqrt(count))*(canvas.width/(count/Math.sqrt(count)));
				particle.targety = (Math.floor(index/Math.sqrt(count))*(canvas.height/(count/Math.sqrt(count))));
				accelerateToTarget(particle)

			}else if(state == 2){
				//Flocking
				for(var i=0; i<emitter.particles.length; i++){

					var particle2 = emitter.particles[i];
					if(particle2!=particle){
						flockingReact(particle, particle2);
					}
					


				}
				// particle.targetx = canvas.width/2;
				// particle.targety = canvas.height/2;
			}
		

			// console.log(particle.a)
			// console.log(particle.a,"foo")
			particle.v.add(particle.a);
			
			particle.v.multiplyScalar(0.9);

			if(particle.v.length() > 10){
				particle.v.setLength(10);
			}else if(particle.v.length < 0.1){
				particle.v.setLength(0.1);
			}


			particle.p.add(particle.v);
			particle.a.x = 0;
			particle.a.y = 0;

		}
	});

	emitter.addBehaviour(crossZoneBehaviour);
	emitter.emit('once');
	proton.addEmitter(emitter);

	console.log(emitter);
}


function flockingReact(p1, p2){
	var target = new Proton.Vector2D(p2.p.x, p2.p.y);

    var dir = p1.p.clone().sub(target);
	dir.normalize();
	var distSqrd = p1.p.distanceToSquared(target);
    var zoneRadiusSqrd = zoneRadius*zoneRadius;

    // console.log(distSqrd, zoneRadiusSqrd, p1.p)

    if(distSqrd <= zoneRadiusSqrd){
    	var percent = distSqrd/zoneRadiusSqrd;

    	if(percent<lowThreshold){
    		//if within the low threshold, separate the particles
    		var force = (zoneRadiusSqrd/distSqrd - 1) * 0.003;

			dir = dir.normalize()//.multiplyScalar(force);
			// console.log('low', dir, force)
			p1.a = p1.a.add(dir.multiplyScalar(force));
			p2.a = p2.a.sub(dir.multiplyScalar(force));

    	}else if(percent < highThreshold){
    		//if within the high threshold, align

    		var thresholdDelta = 1-lowThreshold;
			var adjustedPercent = (percent-lowThreshold)/thresholdDelta;

			var force = (1-(Math.cos(adjustedPercent * Math.PI*2)* -0.5 +0.5  ) ) * 0.05;

			

			dir = dir.normalize()//.multiplyScalar(force);
			// console.log('mid', dir)
			p1.a = p1.a.add(dir.multiplyScalar(force));
			p2.a = p2.a.sub(dir.multiplyScalar(force));

    	}else{
    		//otherwise, attract
    		var thresholdDelta = 1-highThreshold;
			var adjustedPercent = (percent-highThreshold)/thresholdDelta;

			var force = (1-(Math.cos(adjustedPercent * Math.PI*2)* -0.5 +0.5  ) ) * 0.5;

			dir = dir.normalize().multiplyScalar(force);
			// console.log('high', dir)
			p1.a = p1.a.add(dir.multiplyScalar(force));
			p2.a = p2.a.sub(dir.multiplyScalar(force));
    	}
    }

}

function accelerateToTarget(particle){
	var target = new Proton.Vector2D(particle.targetx, particle.targety);

	var direction = particle.p.clone().sub(target);
	direction.normalize();

	//get dist squared
	var distSqrd = particle.p.distanceToSquared(target);

	//calculate force
	var force = distSqrd*1.2;

	particle.a = particle.a.sub(direction.multiplyScalar(force));
}


function createRenderer() {
	renderer = new Proton.Renderer('canvas', proton, canvas);
	renderer.onProtonUpdate = function() {
		context.fillStyle = "rgba(255, 255, 255, 0.1)";
		context.fillRect(0, 0, canvas.width, canvas.height);
	};

	renderer.start();
}

function tick() {
	requestAnimationFrame(tick);
	proton.update();
}


function leave(){
	crossZoneBehaviour.reset(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'dead');
}