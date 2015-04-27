(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('mobileService', mobileService);
	
	mobileService.$inject=['$resource'];

    function mobileService($resource){
		
		var mobile = $resource('/api/user/:id_user/mobile');
		
		return mobile;
	
    }       
})();
