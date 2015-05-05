(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('loginController', loginController);

    loginController.$inject = ['$timeout','$rootScope','$scope','$location','$state','notifier','homeService'];

	function loginController($timeout,$rootScope,$scope,$location,$state,notifier,homeService){
	
		var vmLogin = this;
		$scope.showModal=false;
		vmLogin.login=login;
		vmLogin.toggleModal = toggleModal;
		vmLogin.emailResetPassword=emailResetPassword;
				
		function login(){
			$rootScope.busy = homeService.login(vmLogin.user.email,vmLogin.user.password)
				.success(function(data, status, headers, config){
					$rootScope.userInfos=data.user;
					$rootScope.isLoggedIn=true;
					$state.go('home');
				})
				.error(function(data, status, headers, config) {
					console.log(data);
					vmLogin.messages=data.messages;
				});				
		}

		function toggleModal(){
			$timeout(function(){
				$scope.showModal = !$scope.showModal;
			});
		}

		function emailResetPassword(){
			$rootScope.loadingMessage='Envoi d\'un email pour réinitialiser le mot de passe';
			if(vmLogin.user.email){
				$rootScope.busy = homeService.emailResetPassword(vmLogin.user.email)
					.success(function(data, status, headers, config){
						notifier.notify({template : 'Envoi email OK'});
				})
				.error(function(data, status, headers, config) {
					console.log(data);
					vmLogin.messages=data.messages;
					notifier.notify({template : 'Envoi email KO',type:'error'});
				});
			}
		}
	}
	
})();