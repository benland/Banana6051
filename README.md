Twangular
=========

This app was create as an Angular exercise.

Create an AngularJS application which provides the following functionality:

   	1. The user logs in using his Twitter account
	2. The user can then search (https://dev.twitter.com/docs/api/1.1/get/search/tweets) for tweets. The top 20 results
	   should be displayed.
	3. The user’s last 5 search results are saved, so that when the user closes the browser and reopens it, he can 
	   expand each saved query to see its results.
Things to consider:

	1. The UI is up to you – design it as you see fit (recommendation – bootstrap).
	2. When implementing the history – make sure the user can see data as soon as possible when expanding a previous query, while also making sure he’ll also see any changes in the results since the last query.

Demo:
=====

Working example of this app can be found at <http://twangular.comule.com>


This app uses the following:
============================

- AngularJS
- Twitter bootstrap
- AngularUI (Utils and bootstrap)
- CodeBird
- FireBase
- AngularFire
- ngSanitize
- angularMoment




**I used yeoman boilerplate to the head start.
During development I also used bower and grunt(also helped with deployment).**


Folders in this package (inside the app folder):
================

-   img - ajax loading images.

- scripts - all the angular scripts this application is using (not third party).

- Styles - ...

- Views - The Application views (search.html as the main search page and login.html as the login page).

    ##### There are some extra files and they are the configuration files for bower and grunt (They contains the package install and some other preferences).


Scripts Files explained:
========================

- app.js - The module main configuration file. contains :
	- The declaration of the modules the application is using.
	- The declaration of the constants the application is using.
	- The application routs.
	- New filter (entities) declaration - takes twitt object and make the relevant entities as links.
	- TwitterConnectorService - Service used to connect to twitter and the firebase according to the user.
		- Methods:
			- CheckAuthorize - Get the twitter application keys and and 2 function references one to do when connected and the other to do when disconnected. - this functions
			  are called when ever the connection state changes.
			- Login - Open the login page and if needed ask the user for credentials.
			- Logout - Logout.
			- searchTwittes - search for twittes. get a callback function when the search is completed.
			- refreshTwittes - refresh an existing search according to the refresh url.

- login.js - The login controller - has the sign in method.

- search.js - The search controller - The search main login - do the search and handle the history of the search.








Next to come (if I will have time):
===================================
Angular directive that is used to show user twitt and directive to show user details.

