(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('homeService', homeService);
	
	homeService.$inject=['$http'];

    function homeService($http){
		
		var service = {
			userInfos			: userInfos,
			logout				: logout,
			login				: login,
			emailResetPassword	: emailResetPassword,
			resetPassword 		: resetPassword,
			resetDatabase		: resetDatabase
		};
		
		return service;
			
		function userInfos(){
			return $http.get('/api/home/userInfos')
		}
		
		function logout(){
			return $http.get('/api/home/logout');
		}
		
		function login(email,password){
			return $http.post('/api/home/login',{'email':email,'password':password});
		}

		function emailResetPassword(email){
			return $http.get('/api/auth/emailResetPassword/'+email);
		}

		function resetPassword(password_change_token){
			return $http.get('api/auth/resetPassword/'+password_change_token);
		}
		
		function resetDatabase(){
			return $http.get('/api/admin/resetDatabase');
		}
    }       
})();
