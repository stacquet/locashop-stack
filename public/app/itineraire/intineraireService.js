(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.service('Map', function($q) {


			var itineraire= {
				init : init,
				search : search,
				addMarker : addMarker,
				getCurrentMarker: getCurrentMarker,
				calcRoute : calcRoute
			}
			return itineraire;

	    	function init(scope) {
	    		var markers = [];
	    		var inputStart = /** @type {HTMLInputElement} */(document.getElementById('pac-input-start'));
	    		var inputArrival = /** @type {HTMLInputElement} */(document.getElementById('pac-input-arrival'));
	    		var searchBoxStart = new google.maps.places.SearchBox(/** @type {HTMLInputElement} */(inputStart));
	    		var searchBoxArrival = new google.maps.places.SearchBox(/** @type {HTMLInputElement} */(inputArrival));
		        var options = {
		            center: new google.maps.LatLng(40.7127837, -74.00594130000002),
		            zoom: 13,
		            disableDefaultUI: true    
		        }
		        itineraire.map = new google.maps.Map(
		            document.getElementById("map"), options
		        );
		        itineraire.places = new google.maps.places.PlacesService(itineraire.map);

				google.maps.event.addListener(searchBoxStart, 'places_changed', function() {
				  var places = searchBoxStart.getPlaces();

				  if (places.length == 0) {
				    return;
				  }
				  for (var i = 0, marker; marker = markers[i]; i++) {
				    marker.setMap(null);
				  }

				  // For each place, get the icon, place name, and location.
				  markers = [];
				  var bounds = new google.maps.LatLngBounds();
				  for (var i = 0, place; place = places[i]; i++) {
				  	console.log(place);
				    var image = {
				      url: place.icon,
				      size: new google.maps.Size(71, 71),
				      origin: new google.maps.Point(0, 0),
				      anchor: new google.maps.Point(17, 34),
				      scaledSize: new google.maps.Size(25, 25)
				    };

				    // Create a marker for each place.
				    var marker = new google.maps.Marker({
				    	map: itineraire.map,
				    	icon: image,
				    	name: place.name,
						position: place.geometry.location,
		            	animation: google.maps.Animation.DROP
				    });
					var current_place  = place;
				    google.maps.event.addListener(marker, 'click', function() {
					    console.log('me');
					    
					    console.log(current_place);
					    scope.$broadcast('start_click',current_place);
					});

				    markers.push(marker);

				    bounds.extend(place.geometry.location);
				  }

				  itineraire.map.fitBounds(bounds);
				});

				google.maps.event.addListener(searchBoxArrival, 'places_changed', function() {
				  var places = searchBoxArrival.getPlaces();

				  if (places.length == 0) {
				    return;
				  }
				  for (var i = 0, marker; marker = markers[i]; i++) {
				    marker.setMap(null);
				  }

				  // For each place, get the icon, place name, and location.
				  markers = [];
				  var bounds = new google.maps.LatLngBounds();
				  for (var i = 0, place; place = places[i]; i++) {
				  	console.log(place);
				    var image = {
				      url: place.icon,
				      size: new google.maps.Size(71, 71),
				      origin: new google.maps.Point(0, 0),
				      anchor: new google.maps.Point(17, 34),
				      scaledSize: new google.maps.Size(25, 25)
				    };

				    // Create a marker for each place.
				    var marker = new google.maps.Marker({
				    	map: itineraire.map,
				    	icon: image,
				    	name: place.name,
						position: place.geometry.location,
		            	animation: google.maps.Animation.DROP
				    });
					var current_place  = place;
				    google.maps.event.addListener(marker, 'click', function() {
					    console.log('me');
					    
					    console.log(current_place);
					    scope.$broadcast('arrival_click',current_place);
					});

				    markers.push(marker);

				    bounds.extend(place.geometry.location);
				  }

				  itineraire.map.fitBounds(bounds);
				});

				google.maps.event.addListener(itineraire.map, 'bounds_changed', function() {
				  var bounds = itineraire.map.getBounds();
				  //searchBoxStart.setBounds(bounds);
				});
				
		    }

		    function calcRoute(start,end) {
				var directionsDisplay = new google.maps.DirectionsRenderer();
				directionsDisplay.setMap(itineraire.map);
	    		var directionsService = new google.maps.DirectionsService();
				var request = {
				    origin:start,
				    destination:end,
				    travelMode: google.maps.TravelMode.DRIVING
				};
				directionsService.route(request, function(response, status) {
				  if (status == google.maps.DirectionsStatus.OK) {
				    directionsDisplay.setDirections(response);
				  }
				});
			}

	    
	    	function search(str) {
		        var d = $q.defer();
		        itineraire.places.textSearch({query: str}, function(results, status) {
		            if (status == 'OK') {
		                d.resolve(results[0]);
		            }
		            else d.reject(status);
		        });

		        return d.promise;
		    }
	    
	    	function addMarker(res) {
		        if(itineraire.marker) itineraire.marker.setMap(null);
		        itineraire.marker = new google.maps.Marker({
		            map: itineraire.map,
		            position: res.geometry.location,
		            animation: google.maps.Animation.DROP
		        });
		        itineraire.map.setCenter(res.geometry.location);
		    }

		    function getCurrentMarker(){
		    	return itineraire.current_marker;
		    }

	});       
})();
