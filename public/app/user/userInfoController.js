(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('userInfoController', userInfoController);

    userInfoController.$inject = ['$rootScope','$timeout','$scope','$stateParams','$state','$upload','$q','notifier','userService'];

	function userInfoController($rootScope,$timeout,$scope,$stateParams,$state,$upload,$q,notifier,userService){
		var vmUserInfo = this;
		vmUserInfo.uploadedImage='';
        vmUserInfo.croppedImage='';
        vmUserInfo.profilImage='';
        vmUserInfo.profilImageChanged=false;
		vmUserInfo.saveProfil=saveProfil;
		vmUserInfo.upload=upload;
		vmUserInfo.crop=crop;
		vmUserInfo.dataURItoBlob=dataURItoBlob;
		vmUserInfo.toggleModal=toggleModal;
		vmUserInfo.updateProfilImage=updateProfilImage;
		vmUserInfo.user={};
		vmUserInfo.initDone=false;

		$scope.showModal = false;
		function toggleModal(){
			console.log($scope);
			$scope.showModal = !$scope.showModal;
		};
		init();

		vmUserInfo.options = {
		    language: 'en',
		    allowedContent: true,
		    entities: false
		  };
		  
	   function saveProfil(){
			$rootScope.busy = upload().then(function(){
				//notifier.notify({template : 'Sauvegarde OK'});
				$state.go('user.adresse');
				},
				function(error){
					notifier.notify({template : error,type:'error'});
				});
		}

		function init(){
			$rootScope.busy = userService.get({id : $stateParams.id_user}).$promise
				.then(function(data, status, headers, config){
					vmUserInfo.user=data;
					if(data.Photo) vmUserInfo.profilImage=data.Photo.chemin_webapp+"/"+data.Photo.uuid+".jpg";
				})
				.finally(function(){
					vmUserInfo.initDone = true;
				});
				
		}

		function upload() { 
			var deferred = $q.defer();
			var file = vmUserInfo.profilImageChanged?dataURItoBlob(vmUserInfo.profilImage):false;
			var dataForm = 	{
				url: '/api/user/'+$stateParams.id_user,
	            fields: {'user' : vmUserInfo.user},
	            file: file
			}
	        $upload.upload(dataForm).success(function (data, status, headers, config) {
	                    deferred.resolve();
	                }).error(function (data, status, headers, config) {
	                    deferred.reject('error : '+data);
	                });
	        return deferred.promise;
	    }
		function crop(){
			if(vmUserInfo.files){
				var file=vmUserInfo.files[0];
	          	var reader = new FileReader();
	          	reader.onload = function (evt) {
		            $scope.$apply(function(){
		              vmUserInfo.uploadedImage=evt.target.result;
					  toggleModal();
		            });
		        }
	        	reader.readAsDataURL(file);
	        }
    	}
    	function updateProfilImage(){
    		vmUserInfo.profilImage=vmUserInfo.croppedImage;
    		vmUserInfo.profilImageChanged=true;
    		toggleModal();
    	}
    	$scope.$watch('vmUserInfo.files',function(){
          vmUserInfo.crop();
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

