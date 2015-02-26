(function () {
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

