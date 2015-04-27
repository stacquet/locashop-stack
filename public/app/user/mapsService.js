(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('mapsService', mapsService);
	
	mapsService.$inject=['$resource'];

    function mapsService($resource){
		
		var maps = $resource('/api/user/:id_user/adresse');
		
		return maps;
    }       
})();
