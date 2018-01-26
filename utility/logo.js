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
var createStep_google_imgsearch = function(params) {
	return function(params) {
		params.log('');
		params.log('Scan: Running step 4 - opening image search page');

		waiting = 1;
		var url = 'https://images.google.com/';

		// Set viewport to be short as there is endless scroll and avoid trigger additional page refreshes.
		page.viewportSize = { width: 480, height: 500 };
    // Important to use this customHeader, to support HTML5 on this page
    page.customHeaders = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0"
    };
		var x = function() {
			page.open(url, function(status) {
				Wait.waitFor(function() {
					return page.evaluate(function() {
						return document.getElementById('lga'); // document.getElementsByClassName('login-email').length > 0;
					});
				}, function(){
    			// page.render('./logs/' + params.uid + '_img_temp.jpg');
					params.log('Scan: Image Search Page loaded...');
					waiting = 0;
				},
				params.waitTimeout);
			});
		}
		setTimeout(x, 120000);
	};
}
var createStep_run_imgsearch = function(params, searchterm) {
	 return function(params) {
 		params.log('');
 		params.log('Scan: Running step 5 - run image search');

 		waiting = 1;
 		var output = page.evaluate(function(searchterm) {
      document.querySelectorAll('[name=q]')[0].value = '"' + searchterm + '" logo';
      document.querySelectorAll('[name=f]')[0].submit();

      return "";
 		}, searchterm);

		Wait.waitFor(function() {
			return page.evaluate(function() {
				return document.getElementById('ires'); // $('li.search-result > div').length === $('.search-results li').length;
			});
		}, function() {
			// page.render('./logs/' + params.uid + '_img_loaded.jpg');
			params.log('Scan: All search result records expanded.');
			waiting = 0;
		},
		params.waitTimeout);
 	}
}
var createStep_extract_img = function(params, searchterm) {
	 return function(params) {
 		params.log('');
 		params.log('Scan: Running step 5 - run image search');

 		waiting = 1;
 		var output = page.evaluate(function(searchterm) {

      var r = "";
      jQuery('#ires div[jscontroller] > a:lt(5)').each(function(index) {
        r += searchterm + ";" + index + ";";
        r += JSON.parse(jQuery(this).next().text()).ou + ";"; // URL

        var sizetext = jQuery(this).text();
        var m = (/\-(.*)$/g).exec(sizetext);
        if (m) r += m[1].trim() + ";"; // SOURCE domain
        else r += ";"

        m = (/([\d]+\s\×\s[\d]+)/g).exec(sizetext);
        if (m) {
          var dimensions = m[1].split('\×');
          for (var i = 0; i < dimensions.length; i++) dimensions[i] = dimensions[i].trim();
          r += dimensions[0] + ";";
          r += dimensions[1] + ";";
          r += dimensions[0] > dimensions[1] ? dimensions[0] / dimensions[1] : dimensions[1] / dimensions[0] + ";";
        }
        else r += ";;;";
        r += "\n";
      });

      return r;
 		}, searchterm);

    upload(output);

		Wait.waitFor(function() {
			return page.evaluate(function() {
				return true;
			});
		}, function() {
      // page.render('./logs/' + params.uid + '_img_loaded.jpg');
			params.log('Scan: All search result records expanded.');
			waiting = 0;
		},
		params.waitTimeout);
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
		 + "_" + ("0" + (today.getHours())).slice(-2) + ('0' + (today.getMinutes())).slice(-2) + 'h' + ("0" + (today.getSeconds())).slice(-2) + 's';
    path += '_logos.csv';
		params.log('Scan: Sending output to... ' + path);

		fs.touch(path);

		upload = function(content) {
			if (content.trim().length > 0) fs.write(path, content + '\n', 'a');
		};
	}
];
for (var i = 0; i < names.length; i++) {
  steps.push(createStep_google_imgsearch(params));
  steps.push(createStep_run_imgsearch(params, names[i]));
  steps.push(createStep_add_jquery(params));
  steps.push(createStep_extract_img(params, names[i]));
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
