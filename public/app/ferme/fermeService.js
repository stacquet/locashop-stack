(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('fermeService', fermeService);
	
	fermeService.$inject=['$http'];

    function fermeService($http){
		
		var service = {
			getProfil 	: getProfil,
			saveProfil	: saveProfil,
			saveAdresse	: saveAdresse
		};
		
		return service;
	
		function getProfil(){
			return $http.get('/api/ferme');
		}

        function saveProfil(data) {
            return $http.post('/api/user/profil/save',data);
        }

        function saveAdresse(data) {
            return $http.post('/api/user/adresse/save',data);
        }

    }       
})();
