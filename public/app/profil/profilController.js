(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('profilController', profilController);

    profilController.$inject = ['$timeout','$scope','$upload','$q','notifier','profilService','mapsService'];

	function profilController($timeout,$scope,$upload,$q,notifier,profilService,mapsService){
		var vm = this;	

		vm.uploadedImage='';
        vm.croppedImage='';
        vm.profilImage='';
        vm.profilImageChanged=false;
		vm.saveProfil=saveProfil;
		vm.checkAdresse=checkAdresse;
		vm.upload=upload;
		vm.crop=crop;
		vm.dataURItoBlob=dataURItoBlob;
		vm.toggleModal=toggleModal;
		vm.updateProfilImage=updateProfilImage;

		vm.showModal = false;
		function toggleModal(){
			vm.showModal = !vm.showModal;
		};
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
	   		if(vm.profilImageChanged){
				vm.busy = upload().then(function(uploadSuccess){
						profilService.saveProfil({userProfil : vm.userProfil})
							.success(function(data, status, headers, config){
							notifier.notify({template : 'Sauvegarde OK'});
							})
							.error(function(data, status, headers, config){
								notifier.notify({template : 'Erreur à la savegarde',type:'error'});
							});
						},
						function(uploadError){
							notifier.notify({template : uploadError,type:'error'});
						});
			}
			else{
				vm.busy = profilService.saveProfil({userProfil : vm.userProfil})
							.success(function(data, status, headers, config){
							notifier.notify({template : 'Sauvegarde OK'});
							})
							.error(function(data, status, headers, config){
								notifier.notify({template : 'Erreur à la savegarde',type:'error'});
							});
			}

		}

		function init(){
			vm.busy = profilService.getProfil()
				.success(function(data, status, headers, config){
					vm.userProfil=data;
				});
		}

		function upload() { 
			var deferred = $q.defer();
			console.log('upload');
			var file = dataURItoBlob(vm.profilImage);
			console.log(file);
	        $upload.upload({
	                    url: 'upload/media',
	                    fields: {'username': $scope.username},
	                    file: file
	                }).progress(function (evt) {
	                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	                    deferred.notify('progress: ' + progressPercentage + '% ' + evt.config.file.name);
	                }).success(function (data, status, headers, config) {
	                    deferred.resolve('file ' + config.file.name + 'uploaded. Response: ' + data);
	                }).error(function (data, status, headers, config) {
	                	console.log('pas bon');
	                    deferred.reject('error : '+data);
	                });
	        return deferred.promise;
	    }
		function crop(){
			if(vm.files){
				console.log(vm.files);
				var file=vm.files[0];
	          	var reader = new FileReader();
	          	reader.onload = function (evt) {
		            $scope.$apply(function(){
		              vm.uploadedImage=evt.target.result;
					  vm.showModal = true;
		            });
		        }
	        	reader.readAsDataURL(file);
	        	
	        }
    	}
    	function updateProfilImage(){
    		vm.profilImage=vm.croppedImage;
    		vm.profilImageChanged=true;
    		toggleModal();
    	}
    	$scope.$watch('vm.files',function(){
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

