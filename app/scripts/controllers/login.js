'use strict';

angular.module('TwangularApp').controller('LoginCtrl', function ($scope, $location, twitterConnectorService, CUSTOMER_KEY, CUSTOMER_SECRET) {
    $scope.loading = false;

    twitterConnectorService.CheckAuthorize(CUSTOMER_KEY, CUSTOMER_SECRET, function(user) {
        $location.path('/search');
        $scope.$apply();
    }, function(){$scope.loading = false;});

    $scope.signin = function() {
        $scope.loading = true;
        twitterConnectorService.Login(CUSTOMER_KEY,CUSTOMER_SECRET);
    };
});
