'use strict';


angular.module('core').controller('ProjectController', ['$scope', '$http',
    function($scope, $http) {
        $scope.dataList = [];
        $scope.currentPage = 1;
        $scope.ITEMS_PER_PAGE = 9;
        $scope.dataLen = 0;
        $scope.curDataList = [];

        $http.get('data/videoList.json').success(function(data) {
            $scope.dataList = data;
            $scope.dataLen = $scope.dataList.length;
            $scope.curDataList = $scope.dataList.slice(($scope.currentPage - 1) * 9, Math.min($scope.dataLen, ($scope.currentPage - 1) * 9 + 9));
        });

        $scope.pageChanged = function() {
            $scope.curDataList = $scope.dataList.slice(($scope.currentPage - 1) * 9, Math.min($scope.dataLen, ($scope.currentPage - 1) * 9 + 9));
        };
    }
]);
