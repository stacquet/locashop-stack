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
			login				: login
		};
		
		return service;
			
		function userInfos(){
			return $http.get('/api/auth/userInfos')
		}
		
		function logout(){
			return $http.get('/api/auth/logout');
		}
		
		function login(email,password){
			return $http.post('/api/auth/login',{'email':email,'password':password});
		}
    }       
})();
