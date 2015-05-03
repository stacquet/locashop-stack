// public/js/appRoutes.js
    angular.module('appRoutes', [] ).
		config(function($stateProvider, $urlRouterProvider) {
			// For any unmatched url, send to /
      		$urlRouterProvider.otherwise('/')

			$stateProvider
    			.state('home', {
    				url: '/',
					templateUrl: 'app/home/home.html'
				})
				.state('inscription', {
					url : '/inscription',
					templateUrl: 'app/inscription/inscription.html',
					controller:	'inscriptionController as vm'
				})
				.state('login', {
					url: '/login',
					templateUrl: 'app/home/login.html'
				})
				.state('ferme', {
					url : '/ferme',
					templateUrl: 'app/ferme/ferme.html',
					controller : 'fermeController as vm'/*,
					resolve : {
						ferme : function(fermeService){
							return fermeService.getuser();
						}
					}*/
				})
				.state('itineraire', {
					url : '/itineraire',
					templateUrl: 'app/itineraire/itineraire.html',
					controller : 'itineraireController as vmItineraire'
				})
				.state('user', {
					url: '/user/:id_user',
					templateUrl: 'app/user/user.html'
				})
					.state('user.infos', {
						url : '/infos',
						templateUrl: 'app/user/userInfo.html',
						controller : 'userInfoController as vmUserInfo'
					})
					.state('user.adresse', {
						url : '/adresse',
						templateUrl: 'app/user/userMaps.html',
						controller : 'userMapsController as vmUserMaps'
					})
					.state('user.mobile', {
						url : '/mobile',
						templateUrl: 'app/user/userMobile.html',
						controller : 'userMobileController as vmUserMobile'
					})
				;
				
});

