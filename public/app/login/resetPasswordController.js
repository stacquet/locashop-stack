(function () {
    'use strict';

    angular
        .module('locashopApp')
        .controller('resetPasswordController', resetPasswordController);

    resetPasswordController.$inject = ['$rootScope','$timeout','$scope','$stateParams','$state','$upload','$q','notifier'];

	function resetPasswordController($rootScope,$timeout,$scope,$stateParams,$state,$upload,$q,notifier){
		var vmResetPassword = this;

		init();

		  


		function init(){
			
				
		}

	}


})();

