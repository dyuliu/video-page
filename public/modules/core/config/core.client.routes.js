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
		state('video-single', {
			url: '/video-single',
			templateUrl: 'modules/core/views/project-single.html'
		}).
		state('videos', {
			url: '/videos',
			templateUrl: 'modules/core/views/projects.html'
		}).
		state('about', {
			url: '/about',
			templateUrl: 'modules/core/views/about.html'
		});
	}
]);
