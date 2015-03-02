(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('fermeController', fermeController);

    fermeController.$inject = ['$location','notifier','fermeService','ferme'];

	function fermeController($location,notifier,fermeService,ferme){
	
		var vm = this;	

		vm.userProfil=ferme.data;
		vm.saveProfil=saveProfil;

		vm.options = {
		    language: 'en',
		    allowedContent: true,
		    entities: false
		  };


	   function saveProfil(){
			vm.busy = fermeService.saveProfil({userProfil : vm.userProfil})
				.success(function(data, status, headers, config){
					notifier.notify({template : 'Sauvegarde OK'});
				})
				.error(function(data, status, headers, config){
					notifier.notify({template : 'Erreur à la savegarde',type:'error'});
				});
		}
	}


})();
