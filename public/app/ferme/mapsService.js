(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('mapsService',mapsService);
	
	//fermeService.$inject=['$http'];

    function mapsService(){
		
		var service ={
			position 		: {},
			getPosition 	: getPosition,
			setPosition		: setPosition
		};
		
		return service;
	
		function getPosition(){
			return service.position;
		}

        function setPosition(data) {
            service.position = data;
        }
    }       
})();
