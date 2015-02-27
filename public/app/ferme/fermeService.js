(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('fermeService', fermeService);
	
	fermeService.$inject=['$http'];

    function fermeService($http){
		
		var service = {
			getProfil 	: getProfil,
			saveProfil	: saveProfil
		};
		
		return service;
	
		function getProfil(){
			return $http.get('/api/user/profil',{'email':email});
		}

        function saveProfil(data) {
            return $http.post('/api/user/profil/save',data);
        }
    }       
})();
