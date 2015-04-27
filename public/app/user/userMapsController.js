(function () {
    'use strict';

	angular.module('locashopApp')
	.controller('userMapsController', userMapsController)
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
	
	userMapsController.$inject= ['$rootScope','$scope','$stateParams', '$timeout', 'uiGmapLogger', '$http','uiGmapGoogleMapApi','mapsService','userService'];

	function userMapsController($rootScope,$scope, $stateParams,$timeout, $log, $http, GoogleMapApi,mapsService,userService) {
		var vmUserMaps = this;
		$scope.showModal=false;
		vmUserMaps.place_changed=false;
		vmUserMaps.saveAdresse = saveAdresse;
		vmUserMaps.logMap = logMap;
		vmUserMaps.editMode = true;
		vmUserMaps.toggleEditMode= toggleEditMode;
		vmUserMaps.ajax = false;
		
		vmUserMaps.user={
			id_user : $stateParams.id_user,
			Adresse : {}
		};
		
		function toggleEditMode(){
			vmUserMaps.editMode = !vmUserMaps.editMode;
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
				parentdiv:'userMapsControllerParent',
				events: {
					places_changed: function (searchBox) {
						vmUserMaps.place_changed=true;
						console.log("vmUserMaps.place_changed : "+vmUserMaps.place_changed);
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
								vmUserMaps.place = marker.adresse;
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
			console.log(vmUserMaps.place.formatted_address);
			vmUserMaps.user.Adresse["formatted_address"] = vmUserMaps.place.formatted_address;
			vmUserMaps.user.Adresse["latitude"]=vmUserMaps.place.geometry.location.k;
			vmUserMaps.user.Adresse["longitude"]=vmUserMaps.place.geometry.location.B;			
			$rootScope.busy = vmUserMaps.user.Adresse.$save({id_user:$stateParams.id_user});
			vmUserMaps.place_changed=false;
		}
		function init(){
			$rootScope.busy = mapsService.get({id_user : $stateParams.id_user}).$promise
				.then(function(data, status, headers, config){
					
					vmUserMaps.user.Adresse=data;
					if(vmUserMaps.user.Adresse){
						toggleEditMode();
						var bounds = new google.maps.LatLngBounds();
						var myPoint  = new google.maps.LatLng(vmUserMaps.user.Adresse.latitude,vmUserMaps.user.Adresse.longitude);
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
							latitude: vmUserMaps.user.Adresse.latitude,
							longitude: vmUserMaps.user.Adresse.longitude
						};

						$scope.map.markers.push(marker);
						$scope.map.zoom= 12;
					}
				})
				.catch(function(err){
					vmUserMaps.user.Adresse=new mapsService();
				})
				.finally(function(){
					console.log(vmUserMaps);
					vmUserMaps.ajax=true;
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