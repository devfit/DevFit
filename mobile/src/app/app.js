/** 
 * Wrap in IIFE to avoid pollution global scope.
 * See styleguide @ https://github.com/toddmotto/angularjs-styleguide
 */
(function() {
    angular.module('boilerplate-app', [
        'ionic',
        'ngCordova',
        'templates-app',
        'templates-common',

        // Insert modules here
        'boilerplate-app.home'
    ])

    .run(function($ionicPlatform, $cordovaSplashscreen) {
        $ionicPlatform.ready(function() {
            $cordovaSplashscreen.hide();
        });
    })

    .config(['$urlRouterProvider', '$locationProvider', function($urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/home");
    }])

    .controller('AppController', function($scope) {

    });
})();