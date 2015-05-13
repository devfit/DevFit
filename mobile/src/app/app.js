/** 
 * Wrap in IIFE to avoid pollution global scope.
 * See styleguide @ https://github.com/toddmotto/angularjs-styleguide
 */
(function() {
    angular.module('devfit', [
        'ionic',
        'ngCordova',
        'templates-app',
        'templates-common',
        'app.config',

        // Insert modules here
        'devfit.home'
    ])

    .run(function($ionicPlatform, $cordovaSplashscreen) {
        $ionicPlatform.ready(function() {
            $cordovaSplashscreen.hide();
        });
    })

    .config(['$urlRouterProvider', '$locationProvider', function($urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/home/lifts");
    }])

    .controller('AppController', function($scope) {

    });
})();