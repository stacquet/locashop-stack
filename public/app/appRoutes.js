// public/js/appRoutes.js
    angular.module('appRoutes', [] ).
		config(function($stateProvider, $urlRouterProvider) {
			// For any unmatched url, send to /
      		$urlRouterProvider.otherwise('/')

			$stateProvider
				.state('404', {
					url : '/404',
					templateUrl: '404.html'
				})
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
					templateUrl: 'app/login/login.html',
					controller : 'loginController as vmLogin'
				})
				.state('resetPassword' , {
					url : '/auth/resetPassword/:password_change_token',
					templateUrl: 'app/login/resetPassword.html',
					controller : 'resetPasswordController as vmResetPassword',

				})
				.state('ferme', {
					url : '/ferme/:id_ferme',
					templateUrl: 'app/ferme/ferme.html',
					controller : 'fermeController as vmFerme'
				})
					.state('ferme.infos', {
						url : '/infos',
						templateUrl: 'app/ferme/fermeInfos.html',
						controller : 'fermeInfoController as vmFermeInfo'
					})
					.state('ferme.catalogue', {
						url : '/catalogue',
						templateUrl: 'app/ferme/fermeCatalogue.html',
						controller : 'fermeCatalogueController as vmFermeCatalogue'
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

