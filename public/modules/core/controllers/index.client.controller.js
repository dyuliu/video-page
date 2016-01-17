'use strict';


angular.module('core').controller('IndexController', ['$scope', '$http',
    function($scope, $http) {
        $scope.testDataList = [];

        $http.get('./data/videoList.json').success(function(data) {
            console.log(data);
        });
    }
]);
