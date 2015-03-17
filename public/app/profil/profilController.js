(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('profilController', profilController);

    profilController.$inject = ['$timeout','$scope','$upload','$location','notifier','fermeService','mapsService'];

	function profilController($timeout,$scope,$upload,$location,notifier,fermeService,mapsService){
		var vm = this;	

		vm.myImage='';
        vm.myCroppedImage='';
		vm.saveProfil=saveProfil;
		vm.checkAdresse=checkAdresse;
		vm.upload=upload;
		vm.crop=crop;
		vm.dataURItoBlob=dataURItoBlob;

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

		function upload() { 
			console.log('upload');
			var file = dataURItoBlob(vm.myCroppedImage);
			console.log(file);
	                $upload.upload({
	                    url: 'upload/media',
	                    fields: {'username': $scope.username},
	                    file: file
	                }).progress(function (evt) {
	                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
	                }).success(function (data, status, headers, config) {
	                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
	                });
	    }
		function crop(){
			if(vm.files){
				console.log(vm.files);
				var file=vm.files[0];
	          	var reader = new FileReader();
	          	reader.onload = function (evt) {
		            $scope.$apply(function($scope){
		              vm.myImage=evt.target.result;
		            });
		        }
	        	reader.readAsDataURL(file);
	        	
	        }
    	}
    	$scope.$watch('vm.files',function(){
          console.log('Res image', vm.myImage);
          vm.crop();
        });

		function dataURItoBlob(dataURI) {
			var binary = atob(dataURI.split(',')[1]);
			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
			var array = [];
			for(var i = 0; i < binary.length; i++) {
			  array.push(binary.charCodeAt(i));
			}
			return new Blob([new Uint8Array(array)], {type: mimeString});
		  };
	}


})();

