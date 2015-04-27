(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('userMobileController', userMobileController);

    userMobileController.$inject = ['$rootScope','$timeout','$scope','$stateParams','$state','$upload','$q','notifier','mobileService'];

	function userMobileController($rootScope,$timeout,$scope,$stateParams,$state,$upload,$q,notifier,mobileService){
		var vmUserMobile 			= this;	
		vmUserMobile.user 			={};
		vmUserMobile.ajax			=false;
		vmUserMobile.editMode		='edit';
		vmUserMobile.saveMobile		=saveMobile;
		init();

		  
	   function saveMobile(){
	   		console.log('saving mobile');
			$rootScope.busy = vmUserMobile.user.$save({id_user:$stateParams.id_user})
				.then(function(){
					//$state.go('user.mobile');
				});
		}

		function init(){
			$rootScope.busy = mobileService.get({id_user : $stateParams.id_user}).$promise
				.then(function(data, status, headers, config){
					vmUserMobile.user=data;
				})
				.catch(function(err){
					vmUserMobile.user=new mobileService();
					vmUserMobile.editMode='new';
				})
				.finally(function(){
					vmUserMobile.ajax=true;
				});
				
		}
	}


})();

