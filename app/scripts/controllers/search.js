'use strict';
angular.module('TwangularApp')
	.controller('SearchCtrl', function($scope, $location, twitterConnectorService, angularFire, CUSTOMER_KEY, CUSTOMER_SECRET, FIREBASE_URL) {
		$scope.loading = 0;

		$scope.init = function() {
			twitterConnectorService.CheckAuthorize(CUSTOMER_KEY, CUSTOMER_SECRET, function(user) {
				$scope.user = user;
				var url = FIREBASE_URL + '/searchData/' + user.id;
				var promise = angularFire(url, $scope, 'searchHistory', []);

				promise.then(function() {
					//put the old posts to twittes and put the new ones on new. keep max 20 at all time
					angular.forEach($scope.searchHistory, function(value, key) {
						value.twittes = value.twittes ? value.twittes : [];
						value.newtwittes = value.newtwittes ? value.newtwittes : [];
						value.twittes =value.newtwittes.concat(value.twittes);
						value.twittes = value.twittes.splice(0, 20);
						value.newtwittes = [];
						$scope.loading++;
						twitterConnectorService.refreshTwittes(value.search_metadata.refresh_url, 20, function(tw, metadata) {
							value.newtwittes = tw;
							var newtw = value.newtwittes ? value.newtwittes.length : 0;
							value.twittes.splice(20 - newtw, newtw);
							value.search_metadata = metadata;
							$scope.loading--;
							$scope.$apply();
						});
					});
					$scope.closeAll();
				}); // promise.then
			}, function(){
				$location.path('/');
			}); // twitterConnectorService.VerifyAuthorize
		};
		$scope.loading++;
		$scope.init();
		$scope.loading--;

		$scope.signout = function() {
			twitterConnectorService.Logout();
		};

		$scope.closeAll = function() {
			angular.forEach($scope.searchHistory, function(value, key) {
				value.open = false;
			});
		};

		$scope.remove = function(index) {
			$scope.searchHistory.splice(index, 1);
		};

		$scope.search = function() {
			if (!$scope.seachForm.$valid){
				return;
			}
			$scope.loading++;
			var searchData = $scope.seachField;
			$scope.seachField = '';
			twitterConnectorService.searchTwittes(searchData, 20, function(tw, metadata) {
				$scope.closeAll();
				$scope.searchHistory.unshift({
					name: searchData,
					twittes: tw,
					search_metadata: metadata,
					open: true
				});
				$scope.searchHistory = $scope.searchHistory.splice(0, 5);
				$scope.loading--;
				$scope.$apply();
			});
		};
	});