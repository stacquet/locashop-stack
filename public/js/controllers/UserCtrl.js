// public/js/controllers/UserCtrl.js
angular.module('UserCtrl', [])
.controller('UserController', function($scope,User) {

    $scope.users = User.getUsersList();
	
	
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
});
