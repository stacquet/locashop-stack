(function () {
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
