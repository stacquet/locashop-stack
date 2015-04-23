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
		vmMaps.logMap = logMap;
		vmMaps.editMode = true;
		vmMaps.toggleEditMode= toggleEditMode;
		
		vmMaps.userProfil={
			id_user : $stateParams.id_profil,
			Adresse : {}
		};
		
		function toggleEditMode(){
			vmMaps.editMode = !vmMaps.editMode;
		}
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
					latitude: 47.472955, 
					longitude: -0.554351
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
						_.each(newMarkers, function(marker) {
							marker.onClicked = function() {
								vmMaps.place = marker.adresse;
								$scope.showModal=true;
							};
						}); 
						$scope.map.markers = newMarkers;
						$scope.map.zoom= 12;
					}
				}
			}
		});
		init();
		function saveAdresse(){
			toggleModal();
			toggleEditMode();
			//vmMaps.userProfil.Adresse = vmMaps.place;
			console.log(vmMaps.place);
			for (var attrname in vmMaps.place) { vmMaps.userProfil.Adresse[attrname] = vmMaps.place[attrname]; console.log(vmMaps.userProfil.Adresse[attrname]);}
			console.log(vmMaps);
			$rootScope.busy = vmMaps.userProfil.Adresse.$save({id_user:$stateParams.id_profil});
			//mapsService.saveAdresse(vmMaps.userProfil);
		}
		function init(){
			$rootScope.busy = mapsService.get({id_user : $stateParams.id_profil}).$promise
				.then(function(data, status, headers, config){
					vmMaps.userProfil.Adresse=data;
					if(vmMaps.userProfil.Adresse){
						toggleEditMode();
						var bounds = new google.maps.LatLngBounds();
						var myPoint  = new google.maps.LatLng(vmMaps.userProfil.Adresse.coordonnee_y,vmMaps.userProfil.Adresse.coordonnee_x);
						bounds.extend(myPoint);
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
						var marker = {
							id:0,
							latitude: vmMaps.userProfil.Adresse.coordonnee_y,
							longitude: vmMaps.userProfil.Adresse.coordonnee_x
						};

						$scope.map.markers.push(marker);
						$scope.map.zoom= 12;
					}
				})
				.catch(function(err){
					vmMaps.userProfil.Adresse=new mapsService();
				})
				.finally(function(){
					console.log(vmMaps);
				});
			
		}
		function logMap(){
			console.log($scope.map);
		}
		function toggleModal(){
			$scope.showModal = !$scope.showModal;
		};
	}

})();