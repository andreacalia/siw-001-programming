SIW-001 - Programming
===================

This project is an assignment developed for the course SIW001 - Programming in the <a href="http://mastergeotech.info/" alt="Master's web page">Master of Science in Geospatial Technologies</a>.

The source code of this project can be found in the correspondent <a href="https://github.com/andreacalia/siw-001-programming">Github</a> repository. The code is licensed under <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

If you like it, feel free to contact me&nbsp;&nbsp;<span class="fa fa-smile-o"></span>

Building Project
===================
Clone the git repo. Then: 
<pre>
	cd path/to/repo
	npm install
	bower install
	grunt serve
</pre>

In order to build the project you need npm, bower, grunt and sass installed in your system.
Once you have built it, you can use <code>grunt serve</code> or launch your favourite web server. Simple example:
<pre>
	cd app
	python3 -m http.server
</pre>

A demo of the application can be found <a href="http://andreacalia.github.io/master/programming/">HERE</a>.

**NOTE** This application uses the latest HTML5 features. It is highly recommended to test with **Chome/Chromium**.

Context
===================

MEIT is a mobile application that allows users to assess their emotional intelligence. The application is grounded in state of the art knowledge in psychology to grade the users emotional intelligence on a scale of 1–121 at hand of some simple visual tests.

For analysis reasons, some data about the registered user (given her permission) are collected: age group, gender, location, test scores, test dates, and some others.

For the purpose of this project, MEIT development team gave access to aggregated data per country. These data are conformal with the current privacy regulations.

Goal
===================

The goal of the assignment is to implement a 1-page Web Application that visualizes the aggregate demographic data that is obtained from the MEIT application. In particular, the average score and time to perform the test needs to be visualized on a map, grouped per country, continent, or custom grouping of countries (i.e., the user needs to be able to group countries). Furthermore, it needs to be possible to set certain parameters: gender, age range, date range and tests performed, whereby results should be(dynamically) updateable.

To accomplish the goal, a special Web Service has been provided. The parameters are specified in the <a href="http://en.wikipedia.org/wiki/Query_string">Query String</a> and the response is in <a href="http://www.json.org">JSON</a> format.

<p class="alert alert-info"><strong>Important!</strong> Note that this project is not intended to give the user a full featured analysis Web Application. Instead, the purpose is to demonstrate the knowledge to build modern Web Application in a real world scenario

How To Use It
===================

The first thing to do is to go to the <a href="<% print( Router.routes.dataManager() ); %>">Management</a> section. There, you can select and filter the data you want to visualize. Also, you can manage the groups of countries. A group of countries contains the aggregated data of all the countries it is composed of. You can create as many groups as you want.

Once you have selected the data you want to analyze, you can go either to the <a href="<% print( Router.routes.geo() ); %>">Geo</a> or <a href="<% print( Router.routes.geo() ); %>">Dashboard</a> section. The possible variables of the analysis are: time and score. Time represents the elapsed seconds to complete a test. Score is the result obtained by a user in a specific test.

In the Geo section you can visualize the gathered data in a <a href="https://developers.google.com/chart/interactive/docs/gallery/geochart">Geo Chart</a>. By default, the average time of each country is visualized. To change the analysis variable (time or test score) you have to use the switch in the <i>Data Filters</i> panel. In the <i>Group</i> panel you can enable or disable grouping. If grouping is disabled (default), the analysis variable is aggregated per country. If grouping is enabled, the variable is aggregated per group.

In the Dashboard section you can analyze each group of countries. In the panel <i>Group Selector</i> you can choose a group, then the analysis panel will show some information along with some statistics about the group. In the <i>Group Aggregated Data</i>, the mean time and score of the group are showed. The <i>Group Individuals Statistics</i> section includes the countries within the group that have the maximum and minimum score and time values. Finally, the <i>Group Components Detail</i> gives the detail of each country present in the group.

Technologies
===================

The educational purpose of this project is to show basic programming skills in Javascript. Additionally, I wanted to make the most of it so I decided to develop this project using some modern front-end frameworks and tools.

The framework behind this work is <a href="http://backbonejs.org/">BackboneJS</a>. It helps to give a structure of the Web Application providing models, collections and views. Also, it works out of the box with <a href="http://jquery.com/">jQuery</a> and <a href="http://underscorejs.org/">underscore.js</a>. The former is a well known feature-rich Javascript library that provides simple API for DOM manipulation, Ajax, event handling, etc. The latter is a library that adds some functional programming helpers to make Javascript programming a lot easier.

Besides, I used other CSS and Javascript libraries to improve the user experience and the application's look: <a href="http://getbootstrap.com/">Bootstrap</a>, <a href="http://bootswatch.com/flatly/">Flatly</a> (Bootstrap theme), <a href="http://fortawesome.github.io/Font-Awesome/">Font Awesome</a> (literally awesome scalable icons), <a href="http://daneden.github.io/animate.css/">Animate.css</a> (CSS animations made easy), <a href="http://www.bootstrap-switch.org/">Bootstrap Switch</a> (toggle switches for Bootstrap) and <a href="http://wavded.github.io/humane-js/">Humane.js</a> (simple yet complete notification system).

The styling is done using the <a href="http://sass-lang.com/">SASS</a> CSS extension language. Along with it, I included the <a href="http://compass-style.org/">Compass</a> extension to use some handy SASS helpers.

<a href="http://gruntjs.com/">Grunt</a> is used to take care of the building system (SCSS file compiling, livereload, etc.), while <a href="http://bower.io/">Bower</a> is used as a dependency management to load Javascript and CSS libraries (when available). Finally, <a href="http://requirejs.org/">RequireJS</a> is used to asynchronously load Javascript modules.


License
===================
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">SIW-001-Programming Project</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">Andrea Calia</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.
