// public/js/services/NerdService.js
angular.module('AuthentificationService', []).factory('Authentification', ['$http', function($http) {

    return {
	
		checkEmailAvailable : function(email,callback){
			return $http.post('/api/inscription/checkEmailAvailable',{'email':email})
						.success(function(data, status, headers, config) {
							return callback(data);
						});
		},
        // call to get all nerds
        validate : function(data, callback) {
            return $http.post('/api/local-signup',data)
						.success(function(data, status, headers, config) {
							if(data.statut==false){
								return callback(false,data);
							}
							else{
								return callback(true,data);
							}
						});
        },
		
		userInfos : function(callback){
			return $http.get('/api/login/userInfos')
				.success(function(data, status, headers, config) {
							return callback(data);
						});
		},
		
		logout : function(callback){
			return $http.get('/api/logout')
				.success(function(data, status, headers, config) {
							return callback(data);
						});
		},
		
		login : function(email,password,callback){
			return $http.post('/api/auth/login',{'email':email,'password':password})
						.success(function(data, status, headers, config) {
							if(data.statut==false){
								return callback(false,data);
							}
							else{
								return callback(true,data);
							}
						});
		}
    }       

}]);
