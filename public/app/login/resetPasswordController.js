(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('resetPasswordController', resetPasswordController);

    resetPasswordController.$inject = ['$rootScope','$timeout','$scope','$stateParams','$state','$upload','$q','notifier','homeService'];

	function resetPasswordController($rootScope,$timeout,$scope,$stateParams,$state,$upload,$q,notifier,homeService){
		var vmResetPassword = this;

		vmResetPassword.initDone = false;
		vmResetPassword.changePassword = changePassword;

		init();

		function init(){
			if($stateParams.password_change_token) {
				$rootScope.busy = homeService.resetPassword($stateParams.password_change_token)
					.then(function(){
						console.log('ok');
						vmResetPassword.password_change_token=$stateParams.password_change_token;
					})
					.catch(function(){
						console.log('erreur');
						$state.go('404');
					})
					.finally(function(){
						vmResetPassword.initDone = true;
					})


			}		
		}

		function changePassword(){
			if(vmResetPassword.password && vmResetPassword.password_bis && vmResetPassword.password == vmResetPassword.password_bis){
				$rootScope.busy = homeService.changePassword(vmResetPassword.password_change_token, vmResetPassword.password)
					.then(function(){
						console.log('ok');						
					})
					.catch(function(){
						console.log('erreur');
						$state.go('404');
					});
			}
		}

	}


})();

