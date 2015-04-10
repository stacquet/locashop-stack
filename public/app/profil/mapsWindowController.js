(function () {
    'use strict';	
	
	angular.module('locashopApp')
	.controller('MapsWindowController', MapsWindowController)

	MapsWindowController.$inject = ['mapsService'];
	function MapsWindowController($scope, mapsService) {
		//console.log($scope.vm.options.language);
		console.log('MapsWindowController');
		console.log($scope);
		$scope.place = {};
		$scope.showPlaceDetails = function(param) {
			console.log('showPlaceDetails');
			$scope.place = param;
		}
		$scope.saveAdresse = function(){
			console.log($scope.place);
			mapsService.setPlace($scope.place);
			$scope.$emit('MAJ_ADRESSE');
			$scope.selected.options.visible = false;
		}
	}
})();