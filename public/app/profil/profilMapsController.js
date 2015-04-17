(function () {
    'use strict';

	angular.module('locashopApp')
	.controller('profilMapsController', profilMapsController)
	.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
			GoogleMapApi.configure({
			// key: 'your api key',
			v: '3.16',
			libraries: 'places'
			});
	}])
	.run(['$templateCache', function ($templateCache) {
		$templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="form-control" type="text" placeholder="Rechercher votre adresse">');
	}]);
	
	profilMapsController.$inject= ['$rootScope','$scope','$stateParams', '$timeout', 'uiGmapLogger', '$http','uiGmapGoogleMapApi','mapsService','profilService'];

	function profilMapsController($rootScope,$scope, $stateParams,$timeout, $log, $http, GoogleMapApi,mapsService,profilService) {
		var vmMaps = this;
		$scope.showModal=false;
		vmMaps.saveAdresse = saveAdresse;
		console.log('profilMapsController');
		$log.doLog = true
		GoogleMapApi.then(function(maps) {
			maps.visualRefresh = true;
			$scope.defaultBounds = new google.maps.LatLngBounds(
				new google.maps.LatLng(40.82148, -73.66450),
				new google.maps.LatLng(40.66541, -74.31715));
			$scope.map.bounds = {
				northeast: {
					latitude:$scope.defaultBounds.getNorthEast().lat(),
					longitude:$scope.defaultBounds.getNorthEast().lng()
				},
				southwest: {
					latitude:$scope.defaultBounds.getSouthWest().lat(),
					longitude:-$scope.defaultBounds.getSouthWest().lng()
				}
			}
		$scope.searchbox.options.bounds = new google.maps.LatLngBounds($scope.defaultBounds.getNorthEast(), $scope.defaultBounds.getSouthWest());
		});
		angular.extend($scope, {
			selected: {
				options: {
					visible:false
				},
				templateurl:'window.tpl.html',
				templateparameter: {}
			},
			map: {
				control: {},
				center: { 
					latitude: /*vmMaps.userProfil.adresse?vmMaps.userProfil.adresse.geometry.location.k:*/47.472955, 
					longitude: /*vmMaps.userProfil.adresse?vmMaps.userProfil.adresse.geometry.location.B:*/-0.554351
				},
				zoom: 10,
				dragging: false,
				bounds: {},
				markers: [],
				idkey: 'place_id',
				events: {
					idle: function (map) {
					},
					dragend: function(map) {
						//update the search box bounds after dragging the map
						var bounds = map.getBounds();
						var ne = bounds.getNorthEast();
						var sw = bounds.getSouthWest();
						$scope.searchbox.options.bounds = new google.maps.LatLngBounds(sw, ne);
						//$scope.searchbox.options.visible = true;
					}
				}
			},
			searchbox: {
				template:'searchbox.tpl.html',
				position:'top-left',
				options: {
					bounds: {}
				},
				parentdiv:'profilMapsControllerParent',
				events: {
					places_changed: function (searchBox) {
						var places = searchBox.getPlaces()
						if (places.length == 0) {
							return;
						}
						// For each place, get the icon, place name, and location.
						var newMarkers = [];
						var bounds = new google.maps.LatLngBounds();
						for (var i = 0, place; place = places[i]; i++) {
							// Create a marker for each place.
							var marker = {
								id:i,
								place_id: place.place_id,
								name: place.name,
								latitude: place.geometry.location.lat(),
								longitude: place.geometry.location.lng(),
								options: {
								visible:false
								},
								templateurl:'window.tpl.html',
								templateparameter: place,
								adresse : place
							};
							newMarkers.push(marker);
							bounds.extend(place.geometry.location);
						}
						$scope.map.bounds = {
							northeast: {
								latitude: bounds.getNorthEast().lat(),
								longitude: bounds.getNorthEast().lng()
							},
							southwest: {
								latitude: bounds.getSouthWest().lat(),
								longitude: bounds.getSouthWest().lng()
							} 
						}
						$scope.map.zoom = 14;
						_.each(newMarkers, function(marker) {
							marker.onClicked = function() {
								console.log($scope);
								vmMaps.place = marker.adresse;
								$scope.showModal=true;
							};
						}); 
						$scope.map.markers = newMarkers;
					}
				}
			}
		});
		init();
		function saveAdresse(){
			toggleModal();
			/*mapsService.setPlace(vmMaps.place);
			$rootScope.$emit('MAJ_ADRESSE');*/
			vmMaps.userProfil.adresse = vmMaps.place;
			/*$rootScope.busy = mapsService.get({id_user : $stateParams.id_profil}).$promise
				.then(function(data, status, headers, config){
					vmProfil.userProfil=data;
					vmProfil.userProfil
					if(data.Photo) vmProfil.profilImage=data.Photo.chemin_webapp+"/"+data.Photo.uuid+".jpg";
				});*/
			vmMaps.userProfil.$save();
			//var toSave = 
		}
		
		function init(){
			$rootScope.busy = profilService.get({id : $stateParams.id_profil}).$promise
				.then(function(data, status, headers, config){
					vmMaps.userProfil=data;
					if(data.Photo) vmMaps.profilImage=data.Photo.chemin_webapp+"/"+data.Photo.uuid+".jpg";
					console.log(vmMaps);
					if(vmMaps.userProfil.adresse){
						var marker = {
							id:0,
							latitude: vmMaps.userProfil.adresse.geometry.location.k,
							longitude: vmMaps.userProfil.adresse.geometry.location.B,
							templateurl:'window.tpl.html'
						};
						$scope.map.markers.push(marker);
					}
				});
			
		}
		function toggleModal(){
			$scope.showModal = !$scope.showModal;
		};
	}

})();