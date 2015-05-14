/** 
 * Wrap in IIFE to avoid pollution global scope.
 * See styleguide @ https://github.com/toddmotto/angularjs-styleguide
 */
(function() {
	/**
	 * Each section of the site has its own module. It probably also has
	 * submodules, though this boilerplate is too simple to demonstrate it. Within
	 * `src/app/home`, however, could exist several additional folders representing
	 * additional modules that would then be listed as dependencies of this one.
	 * For example, a `note` section could have the submodules `note.create`,
	 * `note.delete`, `note.edit`, etc.
	 *
	 * Regardless, so long as dependencies are managed correctly, the build process
	 * will automatically take take of the rest.
	 *
	 * The dependencies block here is also where component dependencies should be
	 * specified, as shown below.
	 */
	angular.module('devfit.home.edit', [
		// Load any modules that is related to home here
	])

	/**
	 * Each section or module of the site can also have its own routes. AngularJS
	 * will handle ensuring they are all available at run-time, but splitting it
	 * this way makes each module more "self-contained".
	 */
	.config(function config($stateProvider) {
		$stateProvider.state('home.edit', {
			url: '/edit',
			views: {
				'edit-tab': {
					controller: 'EditCtrl as vm',
					templateUrl: 'home/edit/edit.tpl.html'
				}
			}
		});
	})

	/**
	 * @ngInject
	 */
	.controller('EditCtrl', EditCtrl);

	function EditCtrl() {
		var vm = this;
		/*
		 *********************************************************
		 *
		 * Initialize
		 *
		 *********************************************************
		 */
		function init() {
			defineScopeVars();
			defineScopeFunctions();
			defineListeners();

		}

		/*
		 *********************************************************
		 *
		 * Define Scope Variables
		 *
		 *********************************************************
		 */
		function defineScopeVars() {

		}

		/*
		 *********************************************************
		 *
		 * Define Scope Functions
		 *
		 *********************************************************
		 */
		function defineScopeFunctions() {
			/**
			 * Save form service call
			 * Update numbers
			 * TODO
			 */
			vm.saveForm = function() {

			};
		}

		/*
		 *********************************************************
		 *
		 * Define Event Listeners
		 *
		 *********************************************************
		 */
		function defineListeners() {}




		// Initialize controller
		init();
	}
})();