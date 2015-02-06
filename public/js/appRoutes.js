// public/js/appRoutes.js
    angular.module('appRoutes', []).
		config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

			$routeProvider

				// home page
				.when('/', {
					templateUrl: 'views/home.html'
				})
				
				.when('/auth/login', {
					templateUrl: 'views/auth/login.html',
					controller:	'AuthentificationController'
				})

				.when('/auth/validationAdresse', {
					templateUrl: 'views/auth/validationAdresse.html',
					controller: 'SearchBoxController'
				})
				// nerds page that will use the NerdController
				.when('/producteurs', {
					templateUrl: 'views/producteurs.html',
					controller: 'ProducteurController'
				})
				.when('/auth/inscription', {
					templateUrl: 'views/auth/inscription.html'
				})
				
				.when('/producteurs/producteur_details', {
					templateUrl: 'views/producteur_details.html',
					controller: 'ProducteurController'
				})
				
				.when('/users', {
					templateUrl: 'views/users.html',
					controller: 'UserController'
				})
				
				.when('/user/producteur', {
					templateUrl: 'views/producteurs.html',
					controller: 'ProducteurController'
				})
				.when('/user/validationEmail', {
					templateUrl: 'views/auth/validationEmail.html',
					controller: 'AuthentificationController'
				})
				.otherwise({
					redirectTo: '/auth/facebook'
				});
				/*.validationAdresse('/user/validationAdresse', {
					templateUrl: 'views/validationAdresse.html',
					controller: 'SearchBoxController'
				})*/
				;

			$locationProvider.html5Mode(true);

}]);

