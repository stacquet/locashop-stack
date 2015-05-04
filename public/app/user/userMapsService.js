(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('UserMapsService', UserMapsService);
	
	UserMapsService.$inject=['$resource'];

    function UserMapsService($resource){
		
		var maps = $resource('/api/user/:id_user/adresse');
		
		return maps;
    }       
})();
