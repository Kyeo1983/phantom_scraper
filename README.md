Webscrape Wiki and LinkedIn links via Google Search
===================================================

This webscrapper runs on phantomJS. Its framework is made to load in your own modules, and within each module, its own set of steps. A *module* is typically meant to perform one cohesive set of webscrapping actions.
For example, a module could be performing "Login", and its steps consist of first loading the login screen, then key in username and password, and then hitting the Login button.

Just for fun, I've likened the structure to a Batman theme. So the program begins with **origin.js** (think Batman Origins). Next, we load the required modules (as though his gadgets) via the utility belt, **utility/belt.js**.
And the last default module that executes is the **Knightfall** module (if you played Arkham Knight, you know what I mean).
This module basically helps you exit or log off gracefully from your webscrapping session.


Default Settings
=====
The default modules I've uploaded here are **Scan** and **Logo**. The former will run through a list of terms in the input file (**/input/distinct_companies.csv**) and execute Google Search,
then picks out from the top few results, any Wikipedia or LinkedIn links, and a couple of other result information. The results are delivered to **/data/** and logs are recorded along with screenshots in **/logs/**.
The latter reads input values similarly, and does Google Image Search. It picks out the top few image results, and output the image URL, sizes etc to the same output folder.

Every search executes with a lag of 2 minutes, it is to avoid congesting network calls to the websites that you're scraping. This threshold is configurable.


Setup
======
Clone this repository, and download PhantomJS <a href="http://phantomjs.org/download.html" target="_blank">here</a>. Place the **phantomJS.exe** on this repositories' top folder.


Demo
=====
Run this command to execute the **Scan**.
```
phantomjs.exe origin.js Scan
```

You can chain multiple modules together like:
```
phantomjs.exe origin.js Scan Logo
```

Recall that at the end of these module executions, **Knightfall** will run.


Customization
===============
##Parameters
The execution can take these arguments via the command prompt. The parameters goes into the respective variable that can be referenced from the modules and steps during runtime.

These defaults are in **origin.js**, you can go ahead to change them.
|Argument  | Description  | Variable|
|------------- | ------------- | -------------|  
|-p  | Password | params.password |
|-u  | Username | params.user |
|-e  | Environment | params.env |
|-i  | Batch number | params.uid |
|-t  | Timeout threshold for each step, defaults to 300s| params.password waitTimeout|

To use these arguments, call them during execution.
```
phantomjs.exe origin.js -t 200 Scan
```


###Modules
Create your modules into **/utility/**. You can update **knightfall.js** to exit your webscrape website accordingly. Go ahead to add more modules with similar structure as the example **scan.js** and **logo.js**.

Within the module, at the bottom of the code, you can define parameters local to that module.
```
var params = {...};
```

And then define the steps to export, typically these variables shouldn't change. So this part should remain.
```
module.exports = { steps: steps, params: params }
```

The **steps** array is the list of steps associated with this module, and this is where you keep adding functions that will eventually be ran one by one.

##Belt
After you're done defining your module, add it to **/utility/belt.js** by defining a command prompt argument name, to the module's steps.
```
var requireHandler = {
	'Scan' : function(run) {...}
}
``` 

Sample Output
=====
Output file
<img width="600px" src="https://github.com/Kyeo1983/scrape_wiki_linkedin_links/logs/linksoutput.jpg"/>

Screenshot
Output file
<img width="330px" src="https://github.com/Kyeo1983/scrape_wiki_linkedin_links/logs/20180126_1011h30s_loaded.jpg"/>
