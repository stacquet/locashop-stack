// public/js/controllers/NerdCtrl.js
angular.module('ProducteurCtrl', ['uiGmapgoogle-maps'])
.controller('ProducteurController', function($scope,$rootScope,Producteur,uiGmapGoogleMapApi) {

    $scope.tagline = 'Les producteurs sont ici !';
	
	$scope.chargement = function(){
		$scope.resultat=Producteur.chargement();
	};
	$scope.ajout_producteur = function(){
		console.log("clické !");
		Producteur.ajout_producteur();
	};
		
	$scope.producteur = {
		name : 'entrez votre nom',
		adresse : 'votre adresse'
	};
	$scope.updateProducteur = function(data) {
		console.log(data);
		Producteur.updateProducteur('nom',data);
	};
})
.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

