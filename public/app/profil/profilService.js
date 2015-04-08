(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('profilService', profilService);
	
	profilService.$inject=['$http','$resource'];

    function profilService($http,$resource){
		
		var profil = $resource('/api/profil/:id');
		
		return profil;
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