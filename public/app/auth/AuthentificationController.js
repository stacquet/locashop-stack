(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('AuthentificationController', AuthentificationController);

    AuthentificationController.$inject = ['$location','notifier','AuthentificationService'];

	function AuthentificationController($location,notifier,AuthentificationService){
	
		var vm = this;
		// boolean qui contrôle l'appel au cookie pour le premier accès à l'appli
		vm.firstConnection=true;
		// boolean qui précise si l'utilisateur est authentifié ou non
		vm.isLoggedIn=false;
		// boolean qui assure l'égalité des 2 pwd entrés
		vm.passwordEquals = true;
		// boolean qui assure que l'email est disponible
		vm.emailAvailable = true;
		
		vm.checkPasswordEqual=checkPasswordEqual;
		vm.checkEmailAvailable=checkEmailAvailable;
		vm.submitForm=submitForm;
		vm.login=login;
		vm.logout=logout;
		
		initLogin();

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
			vm.checkEmailAvailable.promise = AuthentificationService.checkEmailAvailable(vm.user.email)
				.then(function(success){
					vm.emailAvailable = success.data.checkEmailAvailable;
				},
				function(err){
				});
			
		}
		
		function submitForm() {

			AuthentificationService.validate(vm.user)
				.then(function(success){
				}
				,function(err){
				});
								
			/*AuthentificationService.validate(vm.user,function(statut,data){
				if(statut){
					vm.isLoggedIn=true;
					vm.userInfos=data.user;
					AuthentificationService.emailVerification(vm.userInfos,function(err,data){
						if(err){ 
							notifier.notify({template : 'erreur interne',type:'error'});
						}
						else{
							$location.path('/');
						}
					});
					//
				}
				else{
					vm.loginMessages=data.loginMessages;
				}
			});*/
		}
		
		function login(){
			vm.login.promise = AuthentificationService.login(vm.user.email,vm.user.password)
				.then(function(success){
					vm.userInfos=success.user;
					vm.isLoggedIn=true;
					$location.path('/');
				},function(err){				
					vm.loginMessages=err.loginMessages;
				});				
		}
		
		function initLogin(){
			if(vm.firstConnection){
				AuthentificationService.userInfos()
					.then(function(success){
						if(success != ""){
							vm.userInfos=success;
							vm.isLoggedIn=true;
						}
						vm.firstConnection=false;
					},function(err){
					});
			}
		}

		function logout(){
			AuthentificationService.logout()
			.then(function(success){
				if(success.status="ok"){
					vm.userInfos=null;
					vm.isLoggedIn=false;
					}
				$location.path('/');
			}
			,function(err){
			});
		}
	}
})();

