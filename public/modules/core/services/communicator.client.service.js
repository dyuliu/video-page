'use strict';

angular.module('core').factory('communicator', ['$window', '$rootScope',
	function($window, $rootScope) {

		var ACTION_MESSAGE = 'actionHappened';

		//sentiment analysis
		var emitActionMessage = function(mes){
			$rootScope.$broadcast(ACTION_MESSAGE, mes);
		};

		var onActionMessage = function(scope, callback){
			scope.$on(ACTION_MESSAGE, function(event, mes){
				callback(mes);
			});
		};

		// Public API
		return {
			'emitActionMessage': emitActionMessage,
			'onActionMessage': onActionMessage,
		};
	}
]);
