angular
	.module('locashopApp', 
	[/*'uiGmapgoogle-maps',*/ 'llNotifier','cgBusy','ngImgCrop','ui.router','angularFileUpload',
	'appRoutes','ui.tinymce','ngResource']);// public/js/appRoutes.js
    angular.module('appRoutes', [] ).
		config(function($stateProvider, $urlRouterProvider) {
			// For any unmatched url, send to /
      		$urlRouterProvider.otherwise('/')

			$stateProvider
    			.state('home', {
    				url: '/',
					templateUrl: 'app/home/home.html'
				})
				.state('inscription', {
					url : '/inscription',
					templateUrl: 'app/inscription/inscription.html',
					controller:	'inscriptionController as vm'
				})
				.state('login', {
					url: '/login',
					templateUrl: 'app/home/login.html'
				})
				.state('ferme', {
					url : '/ferme',
					templateUrl: 'app/ferme/ferme.html',
					controller : 'fermeController as vm'/*,
					resolve : {
						ferme : function(fermeService){
							return fermeService.getuser();
						}
					}*/
				})
				.state('itineraire', {
					url : '/itineraire',
					templateUrl: 'app/itineraire/itineraire.html',
					controller : 'itineraireController as vmItineraire'
				})
				.state('user', {
					url: '/user/:id_user',
					templateUrl: 'app/user/user.html'
				})
					.state('user.infos', {
						url : '/infos',
						templateUrl: 'app/user/userInfo.html',
						controller : 'userInfoController as vmUserInfo'
					})
					.state('user.adresse', {
						url : '/adresse',
						templateUrl: 'app/user/userMaps.html',
						controller : 'userMapsController as vmUserMaps'
					})
					.state('user.mobile', {
						url : '/mobile',
						templateUrl: 'app/user/userMobile.html',
						controller : 'userMobileController as vmUserMobile'
					})
				;
				
});

;(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('homeController', homeController);

    homeController.$inject = ['$rootScope','$location','$state','notifier','homeService'];

	function homeController($rootScope,$location,$state,notifier,homeService){
	
		var vm = this;
		
		vm.login=login;
		vm.logout=logout;
		
		initLogin();
		
		function login(){
			$rootScope.busy = homeService.login(vm.user.email,vm.user.password)
				.success(function(data, status, headers, config){
					$rootScope.userInfos=data.user;
					$rootScope.isLoggedIn=true;
					$state.go('home');
				})
				.error(function(data, status, headers, config) {
					console.log(data);
					vm.messages=data.messages;
				});				
		}
		
		function initLogin(){
			if(!$rootScope.isLoggedIn){
				vm.busy = homeService.userInfos()
					.success(function(data, status, headers, config){
							$rootScope.userInfos=data;
							$rootScope.isLoggedIn=true;
						});
			}
		}

		function logout(){
			$rootScope.busy = homeService.logout()
				.success(function(data, status, headers, config){
					$rootScope.userInfos=null;
					$rootScope.isLoggedIn=false;
					$state.go('home');
			});
		}
	}
	
})();;(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('homeService', homeService);
	
	homeService.$inject=['$http'];

    function homeService($http){
		
		var service = {
			userInfos			: userInfos,
			logout				: logout,
			login				: login
		};
		
		return service;
			
		function userInfos(){
			return $http.get('/api/home/userInfos')
		}
		
		function logout(){
			return $http.get('/api/home/logout');
		}
		
		function login(email,password){
			return $http.post('/api/home/login',{'email':email,'password':password});
		}
    }       
})();
;(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('inscriptionController', inscriptionController);

    inscriptionController.$inject = ['$location','notifier','inscriptionService'];

	function inscriptionController($location,notifier,inscriptionService){
	
		var vm = this;

		// boolean qui assure l'égalité des 2 pwd entrés
		vm.passwordEquals = true;
		// boolean qui assure que l'email est disponible
		vm.emailAvailable = true;
		// message de chargement dynamique en fonction du type d'action
		vm.loadingMessage= 'loading';
		// variable indiquant si le formulaire a été soumis
		vm.formSubmitted = false;
		vm.checkPasswordEqual=checkPasswordEqual;
		vm.checkEmailAvailable=checkEmailAvailable;
		vm.localSignup=localSignup;
		
		//initLogin();

		// On vérifie que les 2 pwd sont égaux
		function checkPasswordEqual(){
			vm.passwordEquals = (vm.user.password === vm.user.passwordBis);
		}
		// on vérifie que l'email est disponible
		function checkEmailAvailable(){
			vm.busy =inscriptionService.checkEmailAvailable(vm.user.email)
				.then(function(success){
					vm.emailAvailable = success.data.checkEmailAvailable;
					vm.userForm.email.$setValidity("notAvailable",vm.emailAvailable);
				},
				function(err){
				});
			
		}
		
		function localSignup() {
			vm.formSubmitted=true;
			checkPasswordEqual();
			if(vm.passwordEquals && vm.userForm.$valid){
			vm.busy = inscriptionService.checkEmailAvailable(vm.user.email)
				.then(function(success){
						vm.emailAvailable = success.data.checkEmailAvailable;
					})
				.then(function(success){
					if(vm.userForm.$valid && vm.emailAvailable){
						vm.loadingMessage='Inscription en base';
						vm.busy = inscriptionService.localSignup(vm.user)
							.then(function(success){
								vm.loadingMessage='Envoi d\'un email de vérification';
								return inscriptionService.emailVerification();
								})
							.then(function(success){
								notifier.notify({template : 'Nous vous avons envoyé un mail pour confirmer votre inscription'});
								$location.path('/');
							}
							,function(err){
								notifier.notify({template : 'Nous n\'avons pu vous envoyer un mail, veuillez contactez le support',type:'error'});
							});
					}
				});
			}
		}
	}
})();

;(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('inscriptionService', inscriptionService);
	
	inscriptionService.$inject=['$http'];

    function inscriptionService($http){
		
		var service = {
			checkEmailAvailable : checkEmailAvailable,
			localSignup			: localSignup,
			emailVerification	: emailVerification
		};
		
		return service;
	
		function checkEmailAvailable(email){
			return $http.post('/api/inscription/checkEmailAvailable',{'email':email})
						.success(function(data, status, headers, config) {
							console.log(data);
							return data;
						})
						.error(function(data, status, headers, config) {
						});
		}

        function localSignup(data) {
            return $http.post('/api/inscription/localSignup',data)
        }

        function emailVerification(){
        	return $http.get('/api/inscription/emailVerification')
        }
    }       
})();
;(function () {
    'use strict';

    angular	
		.module('locashopApp')
		.controller('itineraireController', itineraireController);

    itineraireController.$inject = ['Map','$rootScope','$scope'];

    function itineraireController(Map,$rootScope,$scope){
        var vmItineraire = this;
        
        vmItineraire.place = {};
        vmItineraire.start={};
        vmItineraire.arrival={};
        vmItineraire.calcRoute=calcRoute;

        $scope.showModal=false;

        $rootScope.$on('start_click', function(event,place) {
            console.log('start_click');
            vmItineraire.start = place;
            toggleModal();

          });

        $rootScope.$on('arrival_click', function(event,place) {
            console.log('arrival_click');
            vmItineraire.arrival = place;
            toggleModal();

          });
        function toggleModal(){
            $scope.$apply(function(scope){
                scope.showModal = !scope.showModal;
            });
        };            
        Map.init($rootScope);

        function calcRoute(){
            var start = new google.maps.LatLng(vmItineraire.start.geometry.location.A,vmItineraire.start.geometry.location.F);
            var arrival = new google.maps.LatLng(vmItineraire.arrival.geometry.location.A,vmItineraire.arrival.geometry.location.F);
            Map.calcRoute(start                ,      arrival    );
        }

    }

})();;(function () {
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
;(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('mobileService', mobileService);
	
	mobileService.$inject=['$resource'];

    function mobileService($resource){
		
		var mobile = {};

		mobile.entity = $resource('/api/user/:id_user/mobile');
		mobile.verify = $resource('/api/user/:id_user/mobile/verify');
		
		return mobile;
	
    }       
})();
;(function () {
    'use strict';

    angular
    .module('locashopApp')
    .directive('modal', modal);
		
function modal(){
	
	var directive ={
		template: '<div class="modal fade">' + 
			  '<div class="modal-dialog">' + 
				'<div class="modal-content">' + 
				  '<div class="modal-header">' + 
					'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
					'<h4 class="modal-title">{{ title }}</h4>' + 
				  '</div>' + 
				  '<div class="modal-body" ng-transclude></div>' + 
				'</div>' + 
			  '</div>' + 
			'</div>',
		  restrict: 'E',
		  transclude: true,
		  replace:true,
		  scope:false,
		  link: postLink 
	}
    return directive;
	
	function postLink(scope, element, attrs) {
		scope.title = attrs.title;

		scope.$watch(attrs.visible, function(value){
		  if(value == true){
			$(element).modal('show');
		  }
		  else{
			$(element).modal('hide');
		  }
		});
		
		$(element).on('shown.bs.modal', function(){
		  scope.$apply(function(scope){
			scope[attrs.visible] = true;
		  });
		});

		$(element).on('hidden.bs.modal', function(){
		  scope.$apply(function(scope){
			scope[attrs.visible] = false;
		  });
		});
		
	}
      
};

})();;(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('userInfoController', userInfoController);

    userInfoController.$inject = ['$rootScope','$timeout','$scope','$stateParams','$state','$upload','$q','notifier','userService','mapsService'];

	function userInfoController($rootScope,$timeout,$scope,$stateParams,$state,$upload,$q,notifier,userService,mapsService){
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
	                	console.log('pas bon');
	                    deferred.reject('error : '+data);
	                });
	        return deferred.promise;
	    }
		function crop(){
			if(vmUserInfo.files){
				console.log(vmUserInfo.files);
				var file=vmUserInfo.files[0];
	          	var reader = new FileReader();
	          	reader.onload = function (evt) {
		            $scope.$apply(function(){
		              vmUserInfo.uploadedImage=evt.target.result;
					  $scope.showModal = true;
		            });
		        }
	        	reader.readAsDataURL(file);
	        }
    	}
    	function updateProfilImage(){
    		vmUserInfo.profilImage=vmUserInfo.croppedImage;
    		vmUserInfo.profilImageChanged=true;
    		toggleModal();
			console.log(vmUserInfo.user);
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

;/*(function () {
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
	
	userMapsController.$inject= ['$rootScope','$scope','$stateParams', '$state','$timeout', 'uiGmapLogger', '$http','uiGmapGoogleMapApi','mapsService','userService'];

	function userMapsController($rootScope,$scope, $stateParams,$state,$timeout, $log, $http, GoogleMapApi,mapsService,userService) {
		var vmUserMaps = this;
		$scope.showModal=false;
		vmUserMaps.place_changed=false;
		vmUserMaps.saveAdresse = saveAdresse;
		vmUserMaps.logMap = logMap;
		vmUserMaps.editMode = 'edit'; // can take value read, edit, new
		vmUserMaps.initDone = false;
		
		vmUserMaps.user={
			id_user : $stateParams.id_user,
			Adresse : {}
		};
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
			vmUserMaps.editMode='read';
			console.log(vmUserMaps.place.formatted_address);
			vmUserMaps.user.Adresse["formatted_address"] = vmUserMaps.place.formatted_address;
			vmUserMaps.user.Adresse["latitude"]=vmUserMaps.place.geometry.location.k;
			vmUserMaps.user.Adresse["longitude"]=vmUserMaps.place.geometry.location.B;			
			$rootScope.busy = vmUserMaps.user.Adresse.$save({id_user:$stateParams.id_user})
				.then(function(){
					$state.go('user.mobile');
					vmUserMaps.place_changed=false;
				});

		}
		function init(){
			$rootScope.busy = mapsService.get({id_user : $stateParams.id_user}).$promise
				.then(function(data, status, headers, config){
					
					vmUserMaps.user.Adresse=data;
					if(vmUserMaps.user.Adresse){
						vmUserMaps.editMode='read';
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
					vmUserMaps.editMode='new';
				})
				.finally(function(){
					vmUserMaps.initDone=true;
				});
			
		}
		function logMap(){
			console.log($scope.map);
		}
		function toggleModal(){
			$scope.showModal = !$scope.showModal;
		};
	}

})();*/;(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('userMapsService', userMapsService);
	
	userMapsService.$inject=['$resource'];

    function userMapsService($resource){
		
		var maps = $resource('/api/user/:id_user/adresse');
		
		return maps;
    }       
})();
;(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('userMobileController', userMobileController);

    userMobileController.$inject = ['$rootScope','$timeout','$scope','$stateParams','$state','$upload','$q','notifier','mobileService'];

	function userMobileController($rootScope,$timeout,$scope,$stateParams,$state,$upload,$q,notifier,mobileService){
		var vmUserMobile 			= this;	
		vmUserMobile.user 			= {};
		vmUserMobile.initDone		= false;
		vmUserMobile.editMode		= 'edit';
		vmUserMobile.saveMobile		= saveMobile;
		vmUserMobile.verifyMobile	= verifyMobile;
		vmUserMobile.tokenEntered	= '';
		init();

		  
	   function saveMobile(){
	   		var mobile = new mobileService.entity({mobile : vmUserMobile.user.mobile});
			$rootScope.busy = mobile.$save({id_user:$stateParams.id_user})
				.then(function(){
					vmUserMobile.editMode='read';
					vmUserMobile.user.mobile_verified=false;
				});
		}

		function verifyMobile(){
	   		var verify = new mobileService.verify({tokenEntered : vmUserMobile.tokenEntered});
			$rootScope.busy = verify.$save({id_user:$stateParams.id_user})
				.then(function(data){
					vmUserMobile.user.mobile_verified=data.verify;
					vmUserMobile.editMode='read';
				});
		}

		function init(){
			$rootScope.busy = mobileService.entity.get({id_user : $stateParams.id_user}).$promise
				.then(function(data, status, headers, config){
					vmUserMobile.user=data;
					console.log(vmUserMobile.user);
					if(vmUserMobile.user.mobile) vmUserMobile.editMode='read';
				})
				.catch(function(err){
					vmUserMobile.user=new mobileService.entity();
					vmUserMobile.editMode='new';
				})
				.finally(function(){
					vmUserMobile.initDone=true;
				});
				
		}
	}


})();

;(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('userService', userService);
	
	userService.$inject=['$resource'];

    function userService($resource){
		
		var user = $resource('/api/user/:id');
		
		return user;
		/*var service = {
			getProfil 	: getProfil,
			saveProfil	: saveProfil,
			saveAdresse	: saveAdresse
		};
		
		return service;
	
		function getProfil(){
			return $http.get('/api/profil');
		}

        function saveProfil(data) {
            return $http.post('/api/user/profil/save',data);
        }

        function saveAdresse(data) {
            return $http.post('/api/user/adresse/save',data);
        }
		*/
    }       
})();
