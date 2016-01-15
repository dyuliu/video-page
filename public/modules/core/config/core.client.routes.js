'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/index.html'
		}).
		state('project-single', {
			url: '/project-single',
			templateUrl: 'modules/core/views/project-single.html'
		}).
		state('project', {
			url: '/projects',
			templateUrl: 'modules/core/views/projects.html'
		});
	}
]);
