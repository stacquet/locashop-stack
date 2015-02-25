// public/js/appRoutes.js
    angular.module('appRoutes', []).
		config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

			$routeProvider

				// home page
				.when('/', {
					templateUrl: 'app/home/home.html'
				})
				.when('/auth/inscription', {
					templateUrl: 'app/auth/inscription.html',
					controller:	'AuthentificationController as vm'
				})
				
				.when('/auth/login', {
					templateUrl: 'app/auth/login.html',
					controller:	'AuthentificationController as vm'
				})
				;

				

			$locationProvider.html5Mode(true);

}]);

