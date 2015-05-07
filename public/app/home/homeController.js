(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('homeController', homeController);

    homeController.$inject = ['$timeout','$rootScope','$scope','$location','$state','notifier','homeService'];

	function homeController($timeout,$rootScope,$scope,$location,$state,notifier,homeService){
	
		var vm = this;
		$scope.showModal=false;
		vm.login=login;
		vm.logout=logout;
		vm.toggleModal = toggleModal;
		vm.resetDatabase = resetDatabase;
		
		initLogin();
		
		function login(){
			$rootScope.busy = homeService.login(vm.user.email,vm.user.password)
				.success(function(data, status, headers, config){
					$rootScope.userInfos=data.user;
					$rootScope.isLoggedIn=true;
					$state.go('home');
				})
				.error(function(data, status, headers, config) {
					console.log(data);
					vm.messages=data.messages;
				});				
		}
		
		function initLogin(){
			if(!$rootScope.isLoggedIn){
				$rootScope.busy = homeService.userInfos()
					.success(function(data, status, headers, config){
							$rootScope.userInfos=data;
							$rootScope.isLoggedIn=true;
						});
			}
		}

		function logout(){
			$rootScope.busy = homeService.logout()
				.success(function(data, status, headers, config){
					$rootScope.userInfos=null;
					$rootScope.isLoggedIn=false;
					$state.go('home');
			});
		}
		function toggleModal(){
			$timeout(function(){
				console.log($scope);
				$scope.showModal = !$scope.showModal;
				console.log('toggle');
			});
		}
		
		function resetDatabase(){
			$rootScope.busy = homeService.resetDatabase()
				.then(function(){
					
				})
				.catch(function(){
					
				});
		}
	}
	
})();