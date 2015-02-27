// public/js/appRoutes.js
    angular.module('appRoutes', []).
		config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

			$routeProvider

				// home page
				.when('/', {
					templateUrl: 'app/home/home.html'
				})
				.when('/inscription/inscription', {
					templateUrl: 'app/inscription/inscription.html',
					controller:	'inscriptionController as vm'
				})
				.when('/home/login', {
					templateUrl: 'app/home/login.html'
				})
				.when('/ferme/ferme', {
					templateUrl: 'app/ferme/ferme.html'
				})
				;
				

			$locationProvider.html5Mode(true);

}]);

