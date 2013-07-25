'use strict';

var app = angular.module('TwangularApp', ['ui.bootstrap', 'ngSanitize', 'firebase', 'angularMoment', 'ui.keypress']);

// --- CONSTANTS ---

app.constant('TWITTER_SEARCH_HASH','https://twitter.com/search?q=%23');
app.constant('TWITTER_SEARCH_USER','https://twitter.com/search?q=%23');
app.constant('CUSTOMER_KEY', 'IJGkZgJ0WSFp4QA2ExayVQ');
app.constant('CUSTOMER_SECRET', 'DNkdTuEGPwutXFjpxpkhsrzvvkibscLxyNkxjFmRoQ8');
app.constant('AUTHORIZE_PATH', '/search');
app.constant('FIREBASE_URL', 'https://twangularben.firebaseIO.com/');
app.constant('SEARCH_COUNT', 20);

// --- CONSTANTS END---

// -- route provider --

app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      }).when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

// -- route provider end --

// -- filters --

app.filter('entities', ['TWITTER_SEARCH_HASH', 'TWITTER_SEARCH_USER', function(TWITTER_SEARCH_HASH, TWITTER_SEARCH_USER) {
  return function(input) {
    var text = input.text;
    var retText = '';
    var startat = 0;
    var entities = [];
    var entitiesSort = [];
    if (input.entities) {
      for (var entity in input.entities) {
        entities.push(entity);
      }

      for (var i=0; i<entities.length; i++) {
        var a = input.entities[entities[i]];
        var b = entitiesSort;
        var res = [];
        var inxA=0;
        var inxB=0;
        while (inxA < a.length && inxB < b.length) {
          if (a[inxA].indices[0] < b[inxB].indices[0]) {
            res.push(a[inxA]);
            inxA++;
          } else {
            res.push(b[inxB]);
            inxB++;
          }
        }
        while (inxA < a.length) {
          res.push(a[inxA]);
          inxA++;
        }
        while (inxB < b.length) {
          res.push(b[inxB]);
          inxB++;
        }
        entitiesSort = res;
      }

      for (i=0; i < entitiesSort.length; i++) {
        var link = '#';
        if (entitiesSort[i].url) {
          link = entitiesSort[i].url;
        }
        else if (entitiesSort[i].text) {
          link = TWITTER_SEARCH_HASH +  entitiesSort[i].text;
        }
        else if (entitiesSort[i].screen_name){
          link = TWITTER_SEARCH_USER +  entitiesSort[i].screen_name;
        }
        retText += text.substring(startat,entitiesSort[i].indices[0]) + '<a target="_blank" href="' + link +'">' +
        (entitiesSort[i].display_url ? entitiesSort[i].display_url :
          (entitiesSort[i].screen_name ? '@'+entitiesSort[i].screen_name :
           (entitiesSort[i].text ? '#'+entitiesSort[i].text : ''))) +
        '</a>';
        startat = entitiesSort[i].indices[1];
      }
    }

    retText += text.substring(startat);
    return retText;
  };
}]);

// -- filters end--

// -- services --
app.service('twitterConnectorService', ['$location' ,'$rootScope', 'AUTHORIZE_PATH', 'FIREBASE_URL',
  function ($location, $rootScope, AUTHORIZE_PATH, FIREBASE_URL) {
    var cb = null;
    var auth = null;
    var dbRef = null;
    var userData = null;

    this.CheckAuthorize = function(customerKey, customerSecret, authorizedCB, notAuthorizedCB ) {
      dbRef = new Firebase(FIREBASE_URL);

      auth = new FirebaseSimpleLogin(dbRef, function(error, user) {
        if (error) {
          // an error occurred while attempting login
          console.log(error);
        } else if (user) {
          // user authenticated with Firebase
          userData = user;

          cb = new Codebird();
          cb.setConsumerKey(customerKey, customerSecret);
          cb.setToken(user.accessToken, user.accessTokenSecret);

          authorizedCB(userData);
        } else {
            // user is logged out
            console.log('User loged out');
            notAuthorizedCB();
        }
      });
    };

    this.Login = function() {
        if (auth) {
            auth.login('twitter', {
                rememberMe: true
            });
        }
        else {
            console.log('ERROR: you need to call CheckAuthorize first');
        }
    };

    this.Logout = function() {
        if (auth) {
            auth.logout();
        }
    };

    this.searchTwittes = function(search, count, callback) {
        var query = 'q=' + search;
        _searchTwittes(query, count, callback);
    };

    this.refreshTwittes = function(query, count, callback){
        _searchTwittes(query.replace(/\?(.*)/,'$1'), count, callback);
    }

    var _searchTwittes = function(search, count, callback) {
      cb.__call(
        'search_tweets',
        search + (count ? '&count=' + count : ''),
        function (reply) {
          console.debug(reply);
          if  (reply.httpstatus == 200) {
            callback(reply.statuses, reply.search_metadata);
          }
        },
        true // this parameter required
      );
    };
  }
  ]

// -- services end--
);