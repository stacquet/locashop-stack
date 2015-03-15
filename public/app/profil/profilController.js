(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('profilController', profilController);

    profilController.$inject = ['$scope','$location','notifier','fermeService','mapsService'];

	function profilController($scope,$location,notifier,fermeService,mapsService){
	
		var vm = this;	

		vm.myImage='';
        vm.myCroppedImage='';
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

		function handleFileSelect(evt) {
			console.log("handleFileSelect");
          var file=evt.currentTarget.files[0];
          var reader = new FileReader();
          reader.onload = function (evt) {
            $scope.$apply(function($scope){
              $scope.myImage=evt.target.result;
            });
          };
          reader.readAsDataURL(file);
        };
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
	}


})();
