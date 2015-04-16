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
							return fermeService.getProfil();
						}
					}*/
				})
				.state('profil', {
					url: '/profil/:id_profil',
					templateUrl: 'app/profil/profil.html',
					controller : 'profilController as vm1'
				})
					.state('profil.infos', {
						url : '/infos',
						templateUrl: 'app/profil/profilInfos.html'
					})
					.state('profil.adresse', {
						url : '/adresse',
						templateUrl: 'app/profil/profilAdresse.html',
						controller : 'MapsController as vm2'
					})
					.state('profil.mobile', {
						url : '/mobile',
						templateUrl: 'app/profil/profilMobile.html'
					})
				;
				
});

