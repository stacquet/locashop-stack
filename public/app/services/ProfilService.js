// public/js/services/UserService.js
angular.module('ProfilService', []).factory('Profil', ['$http', function($http) {

    return {
	
        getProfil : function(callback) {
            $http.get('/api/user/profil')
				.success(function(data, status, headers, config) {
					return callback(null,data);
				})
				.error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					return callback(data,null);
				});
        },
        saveProfil : function(data,callback) {
            $http.post('/api/user/profil/save',data)
				.success(function(data, status, headers, config) {
					return callback(null,data);
				})
				.error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					return callback(data,null);
				});
        }
    }    

}]);
