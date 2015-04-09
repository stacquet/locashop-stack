(function () {
    'use strict';
	
	angular	
		.module('locashopApp')
		.factory('mapsService',mapsService);
	
	//fermeService.$inject=['$http'];

    function mapsService(){
		
		var service ={
			place 			: {},
			getPlace 		: getPlace,
			setPlace		: setPlace
		};
		
		
		return service;
	
		function getPlace(){
			return service.place;
		}

        function setPlace(data) {
            service.place = data;
			console.log('MAJ Position : '+service.place);
        }
    }       
})();
