jQuery(document).ready(function() {
	jQuery('.btn').click( function(){
    var target = jQuery(this).attr('data-target');
    jQuery('.popup' + target).addClass('active');
	});
	jQuery('.b-close').click( function(){
    jQuery(this).parent().removeClass('active');
	});
});

/*Particles*/
jQuery(document).ready(function() {
	var jWrapper = $('.particles-wrapper');
	var boundaries = { //topMin, leftMin, topMax, leftMax
		minTop: 0,
		minLeft: 0,
		maxTop: jWrapper.height(),
		maxLeft: jWrapper.width()
	};
	var particleBaseElement = 'div';
	var particleBaseClasses = ['particula', 'particle'];
	var particleIdClasses = ['moto', 'camio', 'cotxe'];
	var maxParticles = 15;
	var particlesArray = [];
	for (var i = 0; i < particleIdClasses.length; ++i) {
		particleAdd(particleIdClasses[i]);
	}
	var constantSpeed = 0.025; //Constant Speed in px/ms
	var maxDisplacement = {
		vertical: 20, //Max vertical movement in px
		horizontal: 50 //Max horizontal movement in px
	};
	var verticalDistanceMultiplier = 0.18; //Fraction of the maxheight that the particles will travel vertically
	var verticalDistance = verticalDistanceMultiplier*boundaries.maxTop;
	var minVerticalLimitMultiplier = 0.30;
	var minVerticalLimit = minVerticalLimitMultiplier*boundaries.maxTop;
	var frameCalls = 0;
	requestAnimationFrame(particleFrame);
	/*
	 * Animation frame function
	 */
	function particleFrame() {
		
		var nParticles = particlesArray.length;
		var currentParticle = null;
		for (var i = 0; i < nParticles; ++i) {
			particleMove(particlesArray[i], constantSpeed, boundaries, maxDisplacement);
		}
		if (particlesArray.length < maxParticles) {
			++frameCalls;
			if (frameCalls > 30) {
				frameCalls = 0;
				var randClass = particleIdClasses[Math.floor(Math.random() * particleIdClasses.length)];
				particleAdd(randClass);
			}
		}
		requestAnimationFrame(particleFrame);
	}
	/*
	 * Adds a new particle to the DOM and particles array with the given class
	 */
	function particleAdd(idClass) {
		var jParticle = jQuery(document.createElement(particleBaseElement));
		for (var i = 0; i < particleBaseClasses.length; ++i) {
			jParticle.addClass(particleBaseClasses[i]);
		}
		jParticle.addClass(idClass);
		jParticle.appendTo(jWrapper);
		particlesArray.push({
			jItem: jParticle,
			iTop: jParticle.position().top,
			iLeft: jParticle.position().left,
			isMoving: false,
			//positiveLeftWeight: Math.random(),
			positiveLeftWeight: 0.5,
			positiveTopWeight: 0.4,
			movedFrames: 0,
			minTop: Math.min(Math.random()*boundaries.maxTop, minVerticalLimit),
		});
	}
	/*
	 * Moves the particle if the particle is not moving already
	 */
	function particleMove(particle, speed, boundaries, maxDisplacement) {
		if (!particle.isMoving) {
			particle.isMoving = true;
			offsets = particleGetNewOffsets(particle, boundaries, maxDisplacement);
			dTop = offsets.dTop;
			dLeft = offsets.dLeft;
			var duration = particleGetTravelTime(dTop, dLeft, speed);
			particle.jItem.animate({
				top: "+=" + dTop,
				left: "+=" + dLeft,
			}, duration, 'linear', function() {
				particleUpdatePosition(particle, false);
			});
		}
	}
	/*
	 * Gets the duration of the animation based on given speed
	 */
	function particleGetTravelTime(dTop, dLeft, speed) {
		var ret = 0;
		if (speed != 0) {
			var distance = Math.sqrt(Math.pow(dTop, 2) + Math.pow(dLeft, 2));
			ret = distance/speed;
		}
		//console.log(ret);
		return ret;
	}
	/*
	 * Gets new offsets based on the particle's current position
	 */
	function particleGetNewOffsets(particle, boundaries, maxDisplacement) {
		//console.log(particle.minTop);
		if (particle.movedFrames != 0) {
			var negativeMaxTop, positiveMaxTop, negativeMaxLeft, positiveMaxLeft;
			negativeMaxTop = maxDisplacement.vertical*(1 - particle.positiveTopWeight);
			positiveMaxTop = maxDisplacement.vertical*particle.positiveTopWeight;
			positiveMaxLeft = maxDisplacement.horizontal*particle.positiveLeftWeight;
			negativeMaxLeft = maxDisplacement.horizontal*(1 - particle.positiveLeftWeight);
			var dTop = Math.random()*positiveMaxTop - Math.random()*negativeMaxTop;
			var dLeft = Math.random()*positiveMaxLeft - Math.random()*negativeMaxLeft;
			var newTop = particle.iTop + dTop;
			var newLeft = particle.iLeft + dLeft;
			if (newTop < particle.minTop) { 
				dTop = dTop - (newTop - particle.minTop);
				newTop = particle.iTop + dTop;
			}
			else if (newTop > boundaries.maxTop) {
				dTop = dTop - (newTop - boundaries.maxTop);
				newTop = particle.iTop + dTop;
			}
			if (newLeft < boundaries.minLeft) { 
				dLeft = dLeft - (newLeft - boundaries.minLeft);
				newLeft = particle.iLeft + dLeft
			}
			else if (newLeft > boundaries.maxLeft) {
				dLeft = dLeft - (newLeft - boundaries.minLeft);
				newLeft = particle.iLeft + dLeft
			}
		}
		else {
			var dTop = -1.0*verticalDistance;
			var dLeft = 0;
		}
		var ret = {
			dTop:  dTop,
			dLeft: dLeft,
		};
		//console.log(ret);
		return ret;
	}
	/*
	 * Updates position and sets particle as not moving
	 */
	function particleUpdatePosition(particle, setMoving = false){
		particle.iTop = particle.jItem.position().top;
		particle.iLeft = particle.jItem.position().left;
		particle.isMoving = setMoving;
		++particle.movedFrames;
	}
});