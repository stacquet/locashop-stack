(function () {
    'use strict';

	angular.module('locashopApp')
	.controller('MapsController', MapsController)
	.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
			GoogleMapApi.configure({
			// key: 'your api key',
			v: '3.16',
			libraries: 'places'
			});
			console.log('config faite');
	}])
	.run(['$templateCache', function ($templateCache) {
		$templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="form-control" type="text" placeholder="Rechercher votre adresse">');
		$templateCache.put('window.tpl.html', 
			'<div class="form-horizontal" ng-controller="MapsWindowController" ng-init="showPlaceDetails(parameter)">'+
			'	<div class="form-group">'+
			'		<label for="email" class=" col-xs-6 control-label">Votre adresse</label>'+
			'		<div class="col-xs-6">'+
			'			<p class="form-control-static">{{place.formatted_address}}</p>'+
			'		</div>'+
			'	</div>'+
			'	<div class="form-group">'+
			'            <div class="col-xs-offset-5 ">'+
			'              <a ui-sref="profil.mobile" id="adresseButton" ng-click="saveAdresse()" class="btn btn-success">J\'habite ici ! </a>'+
			'            </div>'+
			'   </div>'+
			'</div>');
		console.log('run fait');
	}]);
	
	MapsController.$inject= ['$scope', '$timeout', 'uiGmapLogger', '$http','uiGmapGoogleMapApi'];

	function MapsController($scope, $timeout, $log, $http, GoogleMapApi) {
		$scope.showModal=false;
		console.log('MapsController');
		console.log($scope);
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
					latitude: /*$scope.vm.userProfil?$scope.vm.userProfil.adresse.geometry.location.k:*/47.472955, 
					longitude: /*$scope.vm.userProfil?$scope.vm.userProfil.adresse.geometry.location.B:*/-0.554351
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
				parentdiv:'MapsControllerParent',
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
							marker.closeClick = function() {
								$scope.selected.options.visible = false;
								//marker.options.visible = false;
								//return $scope.$apply();
							};
							marker.onClicked = function() {
								$scope.selected.options.visible = false;
								$scope.selected = marker;
								/*$scope.selected.options.visible = true;*/
								$scope.place = marker.adresse
								$scope.showModal=true;
							};
						}); 
						$scope.map.markers = newMarkers;
						//$scope.searchbox.options.visible = false;
					}
				}
			}
		});
	}

})();