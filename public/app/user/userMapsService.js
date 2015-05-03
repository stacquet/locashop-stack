(function () {
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
