(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('fermeController', fermeController);

    fermeController.$inject = ['$location','notifier','fermeService','mapsService'];

	function fermeController($location,notifier,fermeService,mapsService){
	
		var vm = this;	

		vm.saveProfil=saveProfil;
		vm.checkAdresse=checkAdresse;

		init();

		vm.options = {
		    language: 'en',
		    allowedContent: true,
		    entities: false
		  };

		function checkAdresse(){
			vm.userProfil.adresse = mapsService.getPosition();
			console.log(vm.userProfil.adresse);
			console.log(mapsService.getPosition());
		}
	   function saveProfil(){
			vm.busy = fermeService.saveProfil({userProfil : vm.userProfil})
				.success(function(data, status, headers, config){
					notifier.notify({template : 'Sauvegarde OK'});
				})
				.error(function(data, status, headers, config){
					notifier.notify({template : 'Erreur à la savegarde',type:'error'});
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
