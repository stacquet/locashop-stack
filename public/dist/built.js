angular
	.module('locashopApp', 
	['uiGmapgoogle-maps', 'llNotifier','cgBusy',
	'ngRoute','appRoutes']);// public/js/appRoutes.js
    angular.module('appRoutes', []).
		config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

			$routeProvider

				// home page
				.when('/', {
					templateUrl: 'app/home/home.html'
				})
				.when('/inscription', {
					templateUrl: 'app/inscription/inscription.html',
					controller:	'inscriptionController as vm'
				})
				
				.when('/login', {
					templateUrl: 'app/home/login.html'
				})
				;

				

			$locationProvider.html5Mode(true);

}]);

;(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('homeController', homeController);

    homeController.$inject = ['$rootScope','$location','notifier','homeService'];

	function homeController($rootScope,$location,notifier,homeService){
	
		var vm = this;
		
		vm.login=login;
		vm.logout=logout;
		
		initLogin();
		
		function login(){
			vm.busy = homeService.login(vm.user.email,vm.user.password)
				.success(function(data, status, headers, config){
					$rootScope.userInfos=data.user;
					$rootScope.isLoggedIn=true;
					$location.path('/');
				})
				.error(function(data, status, headers, config) {
					console.log(data);
					vm.messages=data.messages;
				});				
		}
		
		function initLogin(){
			if(!$rootScope.isLoggedIn){
				vm.busy = homeService.userInfos()
					.success(function(data, status, headers, config){
							$rootScope.userInfos=data;
							$rootScope.isLoggedIn=true;
						});
			}
		}

		function logout(){
			vm.busy = homeService.logout()
				.success(function(data, status, headers, config){
					$rootScope.userInfos=null;
					$rootScope.isLoggedIn=false;
					$location.path('/');
			});
		}
	}
	
})();;(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('homeService', homeService);
	
	homeService.$inject=['$http'];

    function homeService($http){
		
		var service = {
			userInfos			: userInfos,
			logout				: logout,
			login				: login
		};
		
		return service;
			
		function userInfos(){
			return $http.get('/api/auth/userInfos')
		}
		
		function logout(){
			return $http.get('/api/auth/logout');
		}
		
		function login(email,password){
			return $http.post('/api/auth/login',{'email':email,'password':password});
		}
    }       
})();
;(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('inscriptionController', inscriptionController);

    inscriptionController.$inject = ['$rootScope','$location','notifier','inscriptionService'];

	function inscriptionController($rootScope,$location,notifier,inscriptionService){
	
		var vm = this;

		// boolean qui assure l'égalité des 2 pwd entrés
		vm.passwordEquals = true;
		// boolean qui assure que l'email est disponible
		vm.emailAvailable = true;
		// message de chargement dynamique en fonction du type d'action
		vm.loadingMessage= 'loading';
		
		vm.checkPasswordEqual=checkPasswordEqual;
		vm.checkEmailAvailable=checkEmailAvailable;
		vm.localSignup=localSignup;
		
		//initLogin();

		// On vérifie que les 2 pwd sont égaux
		function checkPasswordEqual(){
			if(vm.user.password !== vm.user.passwordBis){
				vm.passwordEquals=false;
				notifier.notify('password différents');
				}
			else{
				vm.passwordEquals=true;
				}
		}
		// on vérifie que l'email est disponible
		function checkEmailAvailable(){
			vm.busy = inscriptionService.checkEmailAvailable(vm.user.email)
				.then(function(success){
					vm.emailAvailable = success.data.checkEmailAvailable;
				},
				function(err){
				});
			
		}
		
		function localSignup() {
		
			vm.loadingMessage='Inscription en base';
			vm.localSignup.promise = inscriptionService.localSignup(vm.user)
				.then(function(success){
					vm.loadingMessage='Envoi d\'un email de vérification';
					return inscriptionService.emailVerification();
					})
				.then(function(success){
					notifier.notify({template : 'Nous vous avons envoyez un mail pour confirmer votre inscription'});
				}
				,function(err){
					notifier.notify({template : 'Nous n\'avons pu vous envoyer un mail, veuillez contactez le support',type:'error'});
				});
		}
	}
})();

;(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('inscriptionService', inscriptionService);
	
	inscriptionService.$inject=['$http'];

    function inscriptionService($http){
		
		var service = {
			checkEmailAvailable : checkEmailAvailable,
			localSignup			: localSignup,
			emailVerification	: emailVerification
		};
		
		return service;
	
		function checkEmailAvailable(email){
			return $http.post('/api/inscription/checkEmailAvailable',{'email':email})
						.success(function(data, status, headers, config) {
							console.log(data);
							return data;
						})
						.error(function(data, status, headers, config) {
						});
		}

        function localSignup(data) {
            return $http.post('/api/auth/localSignup',data)
        }

        function emailVerification(){
        	return $http.get('/api/auth/emailVerification')
        }
    }       
})();
