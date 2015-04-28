(function () {
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
