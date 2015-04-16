(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('profilController', profilController);

    profilController.$inject = ['$timeout','$scope','$stateParams','$upload','$q','notifier','profilService','mapsService'];

	function profilController($timeout,$scope,$stateParams,$upload,$q,notifier,profilService,mapsService){
		var vmProfil = this;	
		vmProfil.uploadedImage='';
        vmProfil.croppedImage='';
        vmProfil.profilImage='';
        vmProfil.profilImageChanged=false;
		vmProfil.saveProfil=saveProfil;
		vmProfil.checkAdresse=checkAdresse;
		vmProfil.upload=upload;
		vmProfil.crop=crop;
		vmProfil.dataURItoBlob=dataURItoBlob;
		vmProfil.toggleModal=toggleModal;
		vmProfil.updateProfilImage=updateProfilImage;
		vmProfil.userProfil={};

		$scope.showModal = false;
		function toggleModal(){
			$scope.showModal = !$scope.showModal;
		};
		init();

		vmProfil.options = {
		    language: 'en',
		    allowedContent: true,
		    entities: false
		  };

		function checkAdresse(){
			vmProfil.userProfil.adresse = mapsService.getPosition();
			console.log(vmProfil.userProfil.adresse);
			console.log(mapsService.getPosition());
		}
	   function saveProfil(){
			vmProfil.busy = upload().then(function(){
				notifier.notify({template : 'Sauvegarde OK'});
				},
				function(error){
					notifier.notify({template : error,type:'error'});
				});
		}

		function init(){
			vmProfil.busy = profilService.get({id : $stateParams.id_profil}).$promise
				.then(function(data, status, headers, config){
					vmProfil.userProfil=data;
					if(data.Photo) vmProfil.profilImage=data.Photo.chemin_webapp+"/"+data.Photo.uuid+".jpg";
				});
		}

		function upload() { 
			var deferred = $q.defer();
			var file = vmProfil.profilImageChanged?dataURItoBlob(vmProfil.profilImage):false;
			var dataForm = 	{
				url: '/api/profil/'+$stateParams.id_profil,
	            fields: {'userProfil' : vmProfil.userProfil},
	            file: file
			}
	        $upload.upload(dataForm).success(function (data, status, headers, config) {
	                    deferred.resolve();
	                }).error(function (data, status, headers, config) {
	                	console.log('pas bon');
	                    deferred.reject('error : '+data);
	                });
	        return deferred.promise;
	    }
		function crop(){
			if(vmProfil.files){
				console.log(vmProfil.files);
				var file=vmProfil.files[0];
	          	var reader = new FileReader();
	          	reader.onload = function (evt) {
		            $scope.$apply(function(){
		              vmProfil.uploadedImage=evt.target.result;
					  $scope.showModal = true;
		            });
		        }
	        	reader.readAsDataURL(file);
	        	
	        }
    	}
    	function updateProfilImage(){
    		vmProfil.profilImage=vmProfil.croppedImage;
    		vmProfil.profilImageChanged=true;
    		toggleModal();
    	}
    	$scope.$watch('vmProfil.files',function(){
          vmProfil.crop();
        });
		
		$scope.$on('MAJ_ADRESSE', function() {
			console.log('Evénément reçu');
			console.log(mapsService.getPlace());
			vmProfil.userProfil.adresse = mapsService.getPlace();
			$scope.myAdress = mapsService.getPlace();
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

