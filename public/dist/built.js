angular
	.module('locashopApp', 
	['uiGmapgoogle-maps', 'llNotifier','cgBusy','ngImgCrop','ui.router','angularFileUpload',
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
							return fermeService.getProfil();
						}
					}*/
				})
				.state('profil', {
					url: '/profil/:id_profil',
					templateUrl: 'app/profil/profil.html'
				})
					.state('profil.infos', {
						url : '/infos',
						templateUrl: 'app/profil/profilInfo.html',
						controller : 'profilInfoController as vmProfil'
					})
					.state('profil.adresse', {
						url : '/adresse',
						templateUrl: 'app/profil/profilMaps.html',
						controller : 'profilMapsController as vmMaps'
					})
					.state('profil.mobile', {
						url : '/mobile',
						templateUrl: 'app/profil/profilMobile.html'
					})
				;
				
});

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
;(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('mapsService', mapsService);
	
	mapsService.$inject=['$http','$resource'];

    function mapsService($http,$resource){
		
		var maps = $resource('/api/user/:id_user/adresse/:id_adresse');
		
		return maps;

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
		console.log(scope);
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
        .controller('profilInfoController', profilInfoController);

    profilInfoController.$inject = ['$rootScope','$timeout','$scope','$stateParams','$upload','$q','notifier','profilService','mapsService'];

	function profilInfoController($rootScope,$timeout,$scope,$stateParams,$upload,$q,notifier,profilService,mapsService){
		var vmProfil = this;	
		vmProfil.uploadedImage='';
        vmProfil.croppedImage='';
        vmProfil.profilImage='';
        vmProfil.profilImageChanged=false;
		vmProfil.saveProfil=saveProfil;
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
		  
	   function saveProfil(){
			vmProfil.busy = upload().then(function(){
				notifier.notify({template : 'Sauvegarde OK'});
				},
				function(error){
					notifier.notify({template : error,type:'error'});
				});
		}

		function init(){
			$rootScope.busy = profilService.get({id : $stateParams.id_profil}).$promise
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
		
		/*$rootScope.$on('MAJ_ADRESSE', function() {
			console.log('Evénément reçu');
			console.log(mapsService.getPlace());
			vmProfil.userProfil.adresse = mapsService.getPlace();
			$scope.myAdress = mapsService.getPlace();
		});*/

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

})();;(function () {
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
