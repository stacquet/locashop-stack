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
			toggleModal();
			if(vmLogin.emailReset){
				$rootScope.busy = homeService.emailResetPassword(vmLogin.emailReset)
					.success(function(data, status, headers, config){
						notifier.notify({template : 'Nous vous avons envoyé un mail, consultez-le !'});
				})
				.error(function(data, status, headers, config) {
					console.log(data);
					vmLogin.messages=data.messages;
					if(status==404) notifier.notify({template : 'Email non trouvé',type:'error'});
					if(status==500) notifier.notify({template : 'Erreur interne',type:'error'});
				});
			}
		}
	}
	
})();