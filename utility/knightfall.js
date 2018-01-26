/****************************************************
 * Configuratory variables
****************************************************/ 


/****************************************************
 * Define Steps
****************************************************/ 
var steps = [
	/*
	function(params) {
		params.log('');
		params.log('KNIGHTFALL: Running step 1');
		params.log('KNIGHTFALL: ... logging out');
		
		waiting = 1;
		var url = 'http://' + params.env + '.gic.com.sg:8000/EnterpriseController?actionType=logout';
		
		page.open(url, function(status){
			if (status == 'fail') {
				params.log('KNIGHTFALL: ... Error logging out');
				page.close();
				phantom.exit(1);
				phantom.quit();
			}
			
			Wait.waitFor(function() {
				return page.evaluate(function() {
					return document.getElementById('username') != undefined;
				});				
			}, function(){
				page.render('./logs/' + params.uid + '-logout.png');
				params.log('KNIGHTFALL: ... Nagivated, and rendered screenshot - logout.png');
				waiting = 0;
			},
			params.waitTimeout);
		});
	},
	*/
	function(params) {
		console.log('CONSOLE: 	Exiting Process...');
		page.close();
		phantom.exit(0);
		phamtom.quit();
	}
];



/****************************************************
 * Define Parameters
****************************************************/ 
var params = {
};


/****************************************************
 * Export Module
****************************************************/ 
module.exports = {
	steps: steps,
	params: params
}