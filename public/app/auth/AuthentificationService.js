(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('AuthentificationService', AuthentificationService);
	
	AuthentificationService.$inject=['$http'];

    function AuthentificationService($http){
		
		var service = {
			checkEmailAvailable : checkEmailAvailable,
			validate			: validate,
			emailVerification	: emailVerification,
			userInfos			: userInfos,
			logout				: login,
			login				: login
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

        function validate(data) {
            return $http.post('/api/local-signup',data)
					.success(function(data, status, headers, config) {
							return data;
					})
					.error(function(data, status, headers, config) {
					});

        }

        function emailVerification(data){
        	return $http.get('/api/emailVerification')
        				.success(function(data, status, headers, config) {
        					return data;
        				})
						.error(function(data, status, headers, config) {
						});
        }
		
		function userInfos(){
			return $http.get('/api/login/userInfos')
						.success(function(data, status, headers, config) {
							return data;
						})	
						.error(function(data, status, headers, config) {
						});
		}
		
		function logout(){
			return $http.get('/api/logout')
				.success(function(data, status, headers, config) {
							return data;
						})	
						.error(function(data, status, headers, config) {
						});
		}
		
		function login(email,password){
			return $http.post('/api/auth/login',{'email':email,'password':password})
						.success(function(data, status, headers, config) {
							return data;
						})	
						.error(function(data, status, headers, config) {
						});
		}
    }       
})();
