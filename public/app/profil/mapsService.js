(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('mapsService', mapsService);
	
	mapsService.$inject=['$http','$resource'];

    function mapsService($http,$resource){
		
		/*var maps = $resource('/api/user/:id_user/adresse/:id_adresse');
		
		return maps;*/

		
		var service = {
			saveAdresse : saveAdresse,
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
