/****************************************************
 * Configuratory variables
****************************************************/
var fs = require('fs');
var inputs = fs.open('./input/distinct_companies.csv', 'r');
var names = [];
while(!inputs.atEnd()) {
    names.push(inputs.readLine());
}
inputs.close()
var upload = function() {};


/****************************************************
 * Define Steps Facilitator
****************************************************/
var createStep_open_new_search = function(params, searchterm) {
	return function(params) {
		params.log('');
		params.log('Scan: Running step 1 - opening page');

		waiting = 1;
		// var url = 'https://www.google.com/search?q="' + searchterm + '"';
    var url = 'https://www.google.com/search?q=' + searchterm;

		// Set viewport to be tall so that later search results show up fully
		page.viewportSize = { width: 480, height: 500 };
		var x = function() {
			page.open(url, function(status) {
				Wait.waitFor(function() {
					return page.evaluate(function() {
						return true;//document.getElementById('center_col'); // document.getElementsByClassName('login-email').length > 0;
					});
				}, function(){
					page.render('./logs/' + params.uid + '_scan_results.jpg');
					params.log('Scan: Results loaded...');
					waiting = 0;
				},
				params.waitTimeout);
			});
		}
		setTimeout(x, 120000);
	};
}
var createStep_add_jquery = function(params) {
  return function(params) {
    params.log('');
    params.log('Login: Running step 2 - loading jQuery');

    page.evaluate(function(p) {
      var imported = document.createElement('script');
      imported.src = 'https://code.jquery.com/jquery-3.2.1.min.js';
      document.head.appendChild(imported);
    }, params);

    waiting = 1;
    Wait.waitFor(function() {
      return page.evaluate(function(){
        return this.jQuery != undefined;
      });
    }, function() {
			page.render('./logs/' + params.uid + '_loaded.jpg');
      params.log('Login: Loaded jQuery.');
      waiting = 0;
    },
    params.waitTimeout);
  }
}
var createStep_extract_results = function(params) {
	 return function(params) {
 		params.log('');
 		params.log('Scan: Running step 3 - Extract Results');

 		waiting = 1;
 		var output = page.evaluate(function(p) {

 			var r = // $('body').html();/*
        jQuery('input[name="q"][title="Search"]').val() + ';'
        + jQuery('#rhs_block ._B5d').text() + ';'
        + jQuery('.kp-header').next('div').find('a').attr('data-href') + ';';

      // Get main search results
	  var websiteFound = 0;
    var rarr = [,,,,,,,,,]; // Website0,1,2,ShortDesc0,1,2,Wikipedia,LinkedIn,Bloomberg
      jQuery('body #ires > ol > div > h3:lt(7)').each(function(index) {
        var t = jQuery(this).text();
        /*
        if (t.indexOf('Wikipedia') > -1)
            r += ('WIKI: ='+ jQuery(this).parent().find('cite').text() + "|");
        else if (t.indexOf('LinkedIn') > -1)
            r += ('LinkedIn: =' + jQuery(this).parent().find('cite').text() + "|");
        else if (t.indexOf('Bloomberg') > -1)
            r += ('Bloomberg: =' + jQuery(this).parent().find('cite').text() + "|");
        else if (index < 3) {
            r += ('Website'  + websiteFound + ': =' + jQuery(this).parent().find('cite').text() + "|");
            var shortdesc = ('ShortDesc' + websiteFound + ' : ='+ jQuery(this).parent().find('span.st').text());
            shortdesc = shortdesc.replace(/[\r\n]+/g, ' ');
            shortdesc = shortdesc.replace(/[\s][\s]+/g, ' ');
            r += shortdesc + "|";
            websiteFound++;;
        } */
        var href = jQuery(this).find('a').attr('href');
        href = href.replace(/^.*\&url\=/gi,'').replace(/\&.*$/gi,'');
        if (t.indexOf('Wikipedia') > -1) rarr[6] = href;
        else if (t.indexOf('LinkedIn') > -1) rarr[7] = href;
        else if (t.indexOf('Bloomberg') > -1) rarr[8] = href;
        else if (index < 3) {
            rarr[websiteFound] = href;
            var shortdesc = jQuery(this).parent().find('span.st').text();
            shortdesc = shortdesc.replace(/[\r\n]+/g, ' ');
            shortdesc = shortdesc.replace(/[\s][\s]+/g, ' ');
            shortdesc = shortdesc.replace(/\"/g, '""');
            rarr[websiteFound + 3] = '"' + shortdesc + '"';
            websiteFound++;
        }
      });
      r += rarr.join(';');

      /* Get right-side information
      rarr = [,,,,,,,,,];
      jQuery('.g').find('._o0d').each(function(){
        var lhs = jQuery(this).find('._gS').text();
        var rhs = jQuery(this).find('.fl').text();
        if (lhs && rhs) r += lhs + '=' + rhs + '|';
      })

      // Get right-side logo
      r += jQuery('#rhs_block ._x8d img').attr('src');
      */

 			return { status: 0, data: r };
 		}, params);

 		upload(output.data);
 		waiting = output.status;
 	}
}


/****************************************************
 * Define Steps
****************************************************/
var steps = [
	function(params) {
		params.log('');
		params.log('Scan: Running step 0 - setup output file');

		var path = './data/output_' + today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + ("0" + (today.getDate())).slice(-2)
		 + "_" + ("0" + (today.getHours())).slice(-2) + ('0' + (today.getMinutes())).slice(-2) + 'h' + ("0" + (today.getSeconds())).slice(-2) + 's.csv';
		params.log('Scan: Sending output to... ' + path);

		fs.touch(path);

		upload = function(content) {
			if (content.trim().length > 0) fs.write(path, content + '\n', 'a');
		};
	}
];
for (var i = 0; i < names.length; i++) {
	steps.push(createStep_open_new_search(params, names[i]));
  steps.push(createStep_add_jquery(params));
	steps.push(createStep_extract_results(params));
}



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
