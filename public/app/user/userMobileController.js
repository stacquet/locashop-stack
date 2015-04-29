(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('userMobileController', userMobileController);

    userMobileController.$inject = ['$rootScope','$timeout','$scope','$stateParams','$state','$upload','$q','notifier','mobileService'];

	function userMobileController($rootScope,$timeout,$scope,$stateParams,$state,$upload,$q,notifier,mobileService){
		var vmUserMobile 			= this;	
		vmUserMobile.user 			= {};
		vmUserMobile.initDone		= false;
		vmUserMobile.editMode		= 'edit';
		vmUserMobile.saveMobile		= saveMobile;
		vmUserMobile.verifyMobile	= verifyMobile;
		vmUserMobile.tokenEntered	= '';
		init();

		  
	   function saveMobile(){
	   		var mobile = new mobileService.entity({mobile : vmUserMobile.user.mobile});
			$rootScope.busy = mobile.$save({id_user:$stateParams.id_user})
				.then(function(){
					vmUserMobile.editMode='read';
				});
		}

		function verifyMobile(){
	   		var verify = new mobileService.verify({tokenEntered : vmUserMobile.tokenEntered});
			$rootScope.busy = verify.$save({id_user:$stateParams.id_user})
				.then(function(){
					vmUserMobile.editMode='read';
				});
		}

		function init(){
			$rootScope.busy = mobileService.entity.get({id_user : $stateParams.id_user}).$promise
				.then(function(data, status, headers, config){
					vmUserMobile.user=data;
					console.log(vmUserMobile.user);
					if(vmUserMobile.user.mobile) vmUserMobile.editMode='read';
				})
				.catch(function(err){
					vmUserMobile.user=new mobileService.entity();
					vmUserMobile.editMode='new';
				})
				.finally(function(){
					vmUserMobile.initDone=true;
				});
				
		}
	}


})();

