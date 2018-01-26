/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or 
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfiled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or 
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
var waitFor = function (testFx, onReady, timeOutMillis, onTimeout) {
	var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, // Default max timeout is 3 sec
		start = new Date().getTime(),
		condition = false,
		interval = setInterval(function() {
			if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
				// If not time-out yet and condition not yet fulfiled
				condition = (typeof(textFx) === "string" ? eval(testFx) : testFx()); // defensive code
			}
			else {
				if (!condition) {
					// If condition still not fulfilled (timeout but condition is 'false')
					console.log("'waitFor()' timeout");
					typeof(onTimeout) === 'string' ? eval(onTimeout) : onTimeout(); // Do what it's supposed to do when timeout
				}
				else {
					// Condition fulfilled (timeout and/or condition is 'true')
					console.log("'waitFor()' finished in " + (new Date().getTime() - start) + 'ms.');
					typeof(onReady) === 'string' ? eval(onReady) : onReady(); // Do what it's supposed to do once the condition is fulfilled
				}
				clearInterval(interval); // Stop this interval
			}
		}, 250); // repeat check every 250ms
};

module.exports = { 
	waitFor : waitFor
}