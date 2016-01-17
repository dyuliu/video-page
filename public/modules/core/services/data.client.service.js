'use strict';

angular.module('core').factory('data', ['$http', function($http) {
    var dataService = {};

    dataService.getVideoList = function() {
        return $http.get('/data/videoList.json');
            //.success(function(data) {
            //console.log(data);
        //});
    };
    return dataService;
}]);
