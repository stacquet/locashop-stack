angular
	.module('locashopApp', 
	['uiGmapgoogle-maps', 'llNotifier','cgBusy','ngImgCrop','ui.router','angularFileUpload',
	'appRoutes','validationAdresseCtrl','ui.tinymce','ngResource']);// public/js/appRoutes.js
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
							return fermeService.getProfil();
						}
					}*/
				})
				.state('profil', {
					url: '/profil/:id_profil',
					templateUrl: 'app/profil/profil.html',
					controller : 'profilController as vm'
				})
					.state('profil.infos', {
						url : '/infos',
						templateUrl: 'app/profil/profilInfos.html'
					})
					.state('profil.coordonnees', {
						url : '/coordonnees',
						templateUrl: 'app/profil/profilCoordonnees.html'
					})
				;
				
});

;
angular.module("validationAdresseCtrl", ['uiGmapgoogle-maps']) 
.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
	GoogleMapApi.configure({
	// key: 'your api key',
	v: '3.16',
	libraries: 'places'
	}); 
}])
.run(['$templateCache', function ($templateCache) {
	$templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="form-control" type="text" placeholder="Rechercher votre adresse">');
	$templateCache.put('window.tpl.html', 
		'<div ng-controller="WindowCtrl" ng-init="showPlaceDetails(parameter)">'+
		'	{{place.name}}'+
		'	<div class="form-group">'+
		'            <div class="col-xs-offset-2 ">'+
		'              <a href="#" id="saveProfilButton" ng-click="saveAdresse()" class="btn btn-sm btn-success">Sauver <span class="glyphicon glyphicon-floppy-save"></span></a>'+
		'           </div>'+
		'         </div>'+
		'</div>');
}])
.controller('WindowCtrl', function ($scope, mapsService) {
	$scope.place = {};
	$scope.showPlaceDetails = function(param) {
		$scope.place = param;
	}
	$scope.saveAdresse = function(){
		console.log($scope.place);
		var adresse = $scope.place.geometry.location;
		mapsService.setPosition(adresse);
			/*.success(function(data, status, headers, config){
				console.log(data);
			});*/
	}
})
.controller("SearchBoxController",['$scope', '$timeout', 'uiGmapLogger', '$http','uiGmapGoogleMapApi'
	, function ($scope, $timeout, $log, $http, GoogleMapApi) {
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
				//position:'top-right',
				position:'top-left',
				options: {
					bounds: {}
				},
				parentdiv:'searchBoxParent',
				events: {
					places_changed: function (searchBox) {
						places = searchBox.getPlaces()
						if (places.length == 0) {
							return;
						}
						// For each place, get the icon, place name, and location.
						newMarkers = [];
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
								templateparameter: place
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
								marker.options.visible = false;
								return $scope.$apply();
							};
							marker.onClicked = function() {
								$scope.selected.options.visible = false;
								$scope.selected = marker;
								console.log(marker);
								$scope.selected.options.visible = true;
							};
						}); 
						$scope.map.markers = newMarkers;
						//$scope.searchbox.options.visible = false;
					}
				}
			}
		});
	}
]);;(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('fermeController', fermeController);

    fermeController.$inject = ['$location','notifier','fermeService','mapsService'];

	function fermeController($location,notifier,fermeService,mapsService){
	
		var vm = this;	

		vm.saveProfil=saveProfil;
		vm.checkAdresse=checkAdresse;

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
			vm.busy = fermeService.saveProfil({userProfil : vm.userProfil})
				.success(function(data, status, headers, config){
					notifier.notify({template : 'Sauvegarde OK'});
				})
				.error(function(data, status, headers, config){
					notifier.notify({template : 'Erreur à la savegarde',type:'error'});
				});
		}

		function init(){
			vm.busy = fermeService.getProfil()
				.success(function(data, status, headers, config){
					vm.userProfil=data;
				});
		}
	}


})();
;(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('mapsService',mapsService);
	
	//fermeService.$inject=['$http'];

    function mapsService(){
		
		var service ={
			position 		: {},
			getPosition 	: getPosition,
			setPosition		: setPosition
		};
		
		return service;
	
		function getPosition(){
			return service.position;
		}

        function setPosition(data) {
            service.position = data;
        }
    }       
})();
;(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('homeController', homeController);

    homeController.$inject = ['$rootScope','$location','notifier','homeService'];

	function homeController($rootScope,$location,notifier,homeService){
	
		var vm = this;
		
		vm.login=login;
		vm.logout=logout;
		
		initLogin();
		
		function login(){
			vm.busy = homeService.login(vm.user.email,vm.user.password)
				.success(function(data, status, headers, config){
					$rootScope.userInfos=data.user;
					$rootScope.isLoggedIn=true;
					$location.path('/');
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
			vm.busy = homeService.logout()
				.success(function(data, status, headers, config){
					$rootScope.userInfos=null;
					$rootScope.isLoggedIn=false;
					$location.path('/');
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
;angular
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
			//scope.$parent[attrs.visible] = true;
			scope.vm['showModal']=true;
			
		  });
		});

		$(element).on('hidden.bs.modal', function(){
		  scope.$apply(function(scope){
			//scope.$parent[attrs.visible] = false;
			scope.vm['showModal']=false;
		  });
		});
		
	}
      
};;(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('profilController', profilController);

    profilController.$inject = ['$timeout','$scope','$stateParams','$upload','$q','notifier','profilService','mapsService'];

	function profilController($timeout,$scope,$stateParams,$upload,$q,notifier,profilService,mapsService){
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
			vm.busy = upload().then(function(){
				notifier.notify({template : 'Sauvegarde OK'});
				},
				function(error){
					notifier.notify({template : error,type:'error'});
				});
		}

		function init(){
			vm.busy = profilService.get({id : $stateParams.id_profil}).$promise
				.then(function(data, status, headers, config){
					vm.userProfil=data;
					if(data.Photo) vm.profilImage=data.Photo.chemin_webapp+"/"+data.Photo.uuid+".jpg";
				});
		}

		function upload() { 
			var deferred = $q.defer();
			var file = vm.profilImageChanged?dataURItoBlob(vm.profilImage):false;
			var dataForm = 	{
				url: '/api/profil/'+$stateParams.id_profil,
	            fields: {'userProfil' : vm.userProfil},
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

;(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('profilService', profilService);
	
	profilService.$inject=['$http','$resource'];

    function profilService($http,$resource){
		
		var profil = $resource('/api/profil/:id');
		
		return profil;
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
