(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('userService', userService);
	
	userService.$inject=['$resource'];

    function userService($resource){
		
		var user = $resource('/api/user/:id');
		
		return user;
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
