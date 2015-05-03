(function () {
    'use strict';

    angular	
		.module('locashopApp')
		.controller('itineraireController', itineraireController);

    itineraireController.$inject = ['Map','$rootScope','$scope'];

    function itineraireController(Map,$rootScope,$scope){
        var vmItineraire = this;
        
        vmItineraire.place = {};
        vmItineraire.start={};
        vmItineraire.arrival={};
        vmItineraire.calcRoute=calcRoute;

        $scope.showModal=false;

        $rootScope.$on('start_click', function(event,place) {
            console.log('start_click');
            vmItineraire.start = place;
            toggleModal();

          });

        $rootScope.$on('arrival_click', function(event,place) {
            console.log('arrival_click');
            vmItineraire.arrival = place;
            toggleModal();

          });
        function toggleModal(){
            $scope.$apply(function(scope){
                scope.showModal = !scope.showModal;
            });
        };            
        Map.init($rootScope);

        function calcRoute(){
            var start = new google.maps.LatLng(vmItineraire.start.geometry.location.A,vmItineraire.start.geometry.location.F);
            var arrival = new google.maps.LatLng(vmItineraire.arrival.geometry.location.A,vmItineraire.arrival.geometry.location.F);
            Map.calcRoute(start                ,      arrival    );
        }

    }

})();