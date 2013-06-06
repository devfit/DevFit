'use strict';

angular.module('devfitApp', []).config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'views/main.html',
		controller : 'MainCtrl'
	}).otherwise({
		redirectTo : '/'
	});
});
