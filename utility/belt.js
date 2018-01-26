/****************************************************
 * Configuratory variables
****************************************************/


/****************************************************
 * Define Require Functions
 *
 * THIS IS WHERE YOU WORK!
 * Add more required scripts handler here, in requireHandler set.
 *
****************************************************/
var requireHandler = {

	'Scan' : function(run) {
		var r = require('./scan'); // Creates array of steps to apply search

		/* Queue the steps and parameters */
		run.runsteps = run.runsteps.concat(r.steps);
		run.runparams = concatJSON(run.runparams, r.params);
		console.log('CONSOLE: 	Imported Scan');

		return run;
	},

	'Logo' : function(run) {
		var r = require('./logo'); // Creates array of steps to apply search

		/* Queue the steps and parameters */
		run.runsteps = run.runsteps.concat(r.steps);
		run.runparams = concatJSON(run.runparams, r.params);
		console.log('CONSOLE: 	Imported Logo');

		return run;
	},

	'Knightfall' : function(run) {
		var r = require('./knightfall'); // Just elegently close phantomjs

		/* Alter its parameters */
		r.params.log = params.log;

		/* Queue the steps and parameters */
		run.runsteps = run.runsteps.concat(r.steps);
		run.runparams = concatJSON(run.runparams, r.params);
		console.log('CONSOLE: 	Imported knightfall');

		return run;
	}
};


// Helper function to merge 1 JSON keys into another JSON set
var concatJSON = function (runparams, newparams) {
	for (var key in newparams) {
		if (runparams.hasOwnProperty(key)) console.log('CONSOLE:	WARNING! Duplicate parameter key found: ' + key);
		else {
			runparams[key] = newparams[key];
		}
	}
	return runparams;
}



/****************************************************
 * Define Parameters
****************************************************/
var params = {
	log : function(msg) {}
};


/****************************************************
 * Export Module
****************************************************/
module.exports = {
	requireHandler: requireHandler,
	params: params
}
