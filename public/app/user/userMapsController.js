(function () {
    'use strict';

	angular.module('locashopApp')
	.controller('userMapsController', userMapsController);
	
	userMapsController.$inject= ['$rootScope','$scope','$stateParams', '$state','$timeout', '$http','MapsService','UserMapsService'];

	function userMapsController($rootScope,$scope, $stateParams,$state,$timeout, $http, MapsService,UserMapsService) {
		var vmUserMaps = this;
		$scope.showModal=false;
		vmUserMaps.place_changed=false;
		vmUserMaps.saveAdresse = saveAdresse;
		vmUserMaps.editMode = 'edit'; // can take value read, edit, new
		vmUserMaps.initDone = false;
		vmUserMaps.place={};
		
		vmUserMaps.user={
			id_user : $stateParams.id_user,
			Adresse : {}
		};
		
		init();
		function saveAdresse(){
			toggleModal();
			vmUserMaps.editMode='read';
			console.log(vmUserMaps.place.formatted_address);
			vmUserMaps.user.Adresse["formatted_address"] = vmUserMaps.place.formatted_address;
			vmUserMaps.user.Adresse["latitude"]=vmUserMaps.place.geometry.location.lat();
			vmUserMaps.user.Adresse["longitude"]=vmUserMaps.place.geometry.location.lng();			
			$rootScope.busy = vmUserMaps.user.Adresse.$save({id_user:$stateParams.id_user})
				.then(function(){
					$state.go('user.mobile');
					vmUserMaps.place_changed=false;
				});

		}
		function init(){
			MapsService.init($rootScope);
			$rootScope.busy = UserMapsService.get({id_user : $stateParams.id_user}).$promise
				.then(function(data, status, headers, config){
					
					vmUserMaps.user.Adresse=data;
					if(vmUserMaps.user.Adresse){
						vmUserMaps.editMode='read';
						var myPoint  = new google.maps.LatLng(vmUserMaps.user.Adresse.latitude,vmUserMaps.user.Adresse.longitude);
						var place = {
							name : vmUserMaps.user.Adresse.formatted_address,
							geometry : {
								location : myPoint
							}
						};
						MapsService.bounds = new google.maps.LatLngBounds();
						MapsService.bounds.extend(myPoint);
						MapsService.addMarker(place,false);
						MapsService.map.fitBounds(MapsService.bounds);
						MapsService.map.setZoom(10);
					}
				})
				.catch(function(err){
					vmUserMaps.user.Adresse=new UserMapsService();
					vmUserMaps.editMode='new';
				})
				.finally(function(){
					vmUserMaps.initDone=true;
				});
		}

		function toggleModal(){
			/*$scope.$apply(function(scope){
				scope.showModal = !scope.showModal;
			});		*/
			$timeout(function(){
				$scope.showModal = !$scope.showModal;
			});
		}
        $rootScope.$on('marker_click', function(event,place) {
            console.log('marker_click');
            vmUserMaps.place = place;
            toggleModal();

        });
	}

})();