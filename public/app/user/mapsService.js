(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('mapsService', mapsService);
	
	mapsService.$inject=['$http','$resource'];

    function mapsService($http,$resource){
		
		var maps = $resource('/api/user/:id_user/adresse');
		
		return maps;

		
		/*var service = {
			saveAdresse : saveAdresse
		};
		
		return service;
	
		function saveAdresse(data){
			return $http.post('/api/user/1/adresse',{'userProfil':data})
						.success(function(data, status, headers, config) {
							console.log(data);
							return data;
						})
						.error(function(data, status, headers, config) {
						});
		}*/
    }       
})();
