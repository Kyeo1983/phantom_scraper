/**************************************************
* Default Variables
**************************************************/
console.log('CONSOLE:	Setting default variables...')
var alsoLogToConsole = 1;
var today = new Date();

/* Variable used to Lock process to have it wait for activities to finish */
var waiting = 0
/* Variable for queue up steps and parameters associated with steps */
var run = {
	runsteps : [],
	runparams: {
		uid : '' + today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + ("0" + (today.getDate())).slice(-2) + "_" + ("0" + (today.getHours())).slice(-2) + ("0" + (today.getMinutes())).slice(-2) + 'h' + ("0" + (today.getSeconds())).slice(-2) + 's',
		waitTimeout : 300000
	}
}


/**************************************************
* Run Arguments
**************************************************/
console.log('CONSOLE:	Setting run arguments...');
var system = require('system');
var args = system.args;

// args = origin.js followed by input arguments
// remove the first token as that is origin.js, and remove any
// -p (password), -e (environment), -t (timeout) & -i (batch ID) tokens
var new_args = [];
for (var i = 1; i < args.length; i++) {
	if (args[i] == '-p') { i++; run.runparams.password = args[i]; }
	else if (args[i] == '-u') { i++; run.runparams.user = args[i]; }
	else if (args[i] == '-e') { i++; run.runparams.env = args[i]; }
	else if (args[i] == '-i') { i++; run.runparams.uid = args[i]; }
	else if (args[i] == '-t') { i++; run.runparams.waitTimeout = args[i]; }
	else new_args.push(args[i]);
}
args = new_args;



console.log('');
/**************************************************
* Configuratory variables
**************************************************/
var path = './logs/' + run.runparams.uid + '-scan.log';
console.log('CONSOLE:	output log path: ' + path);
var fs = require('fs');
fs.touch(path);
var file = fs.open(path, 'a');

var log = function(content) {
	fs.write(path, content + '\n', 'a');
	if (alsoLogToConsole) console.log('		' + content);
}


/* Initialise new webpage to bring navigations */
var page = new WebPage();
/* Define page navigation logging */
page.onNavigationRequested = function(url, type, willNavigate, main){
	log('GENERAL:	... Tying to navigate to ' + url);
	log('GENERAL: 	... Determine if it will navigate : ' + willNavigate);
}



console.log('');
/**************************************************
* Import required scripts
**************************************************/
console.log('CONSOLE:	Importing required scripts...');
var Wait = require('./utility/waitForv2'); // Utility to do process waiting
console.log('CONSOLE:	Imported waitForv2');
var Belt = require('./utility/belt'); // Utility to do import functional scripts
Belt.params.log = log;
console.log('CONSOLE:	Imported belt');



console.log('');
/**************************************************
* Import run scripts
**************************************************/
console.log('CONSOLE:	Importing run scripts...');
args.forEach(function(arg, i) {
	run = Belt.requireHandler[arg](run);
})
var numValidSteps = run.runsteps.length; // record number of real steps before Knightfall
Belt.requireHandler.Knightfall(run); // for closing phantomjs elegently

/* create a dup steps just for Knightfall if program ends abruptly */
var knightfallsteps = run.runsteps.slice(numValidSteps);



console.log('');
/**************************************************
* General Steps running framework
**************************************************/
console.log('CONSOLE: 	Defining general steps framework');
runSteps_i = function(i, steps, params) {
	if (i < steps.length) {
		console.log('');
		console.log('CONSOLE:	... running step ' + (i + 1));
		steps[i](params);
		console.log('CONSOLE:	... done running step ' + (i + 1));


		console.log('CONSOLE:	... waiting after step ' + (i + 1));
		Wait.waitFor(function(){
			return waiting === 0;
		}, function() {
			console.log('CONSOLE: 	... done waiting after step ' + (i + 1));
			runSteps_i(i + 1, steps, params);
		},
		params.waitTimeout
		, function() {
			/* timed out here, terminate process, call Knightfall */
			// check if it is Knightfall itself fail
			if (steps.length == knightfallsteps.length) {
				console.log('CONSOLE:	... Knightfall failed');
				phantom.exit(1);
			}
			else {
				console.log('CONSOLE:	... waiting timed-out, activating Knightfall');
				runSteps_i(0, knightfallsteps, params);
			}
		});
	}
};
runSteps = function(steps, params) { runSteps_i(0, steps, params); }


/**************************************************
* Begin!
**************************************************/
console.log('CONSOLE:	Beginning run!');
runSteps(run.runsteps, run.runparams);
