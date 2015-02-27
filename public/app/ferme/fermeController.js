(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('fermeController', fermeController);

    fermeController.$inject = ['$location','notifier','fermeService'];

	function fermeController($location,notifier,fermeService){
	
		var vm = this;	
		
		vm.userProfil={
			email : '',
			nom : '',
			prenom : '',
			mobile : '',
			fixe : '',
			adresse : '',
			presentation : {
				la_ferme : '',
				les_produits : '',
				les_methodes :'',
				photos : []
			}
		}
		vm.saveProfil=saveProfil;
		vm.init=init;
		
	   function saveProfil(){
			vm.busy = fermeService.saveProfil({userProfil : vm.userProfil})
				.success(function(data, status, headers, config){
					vm.saveOk=true;
				});
		}
		function init(){
			vm.busy = fermeService.getProfil()
				.success(function(data, status, headers, config){
					vm.userProfil=data;
				});
		}
	}
})();
