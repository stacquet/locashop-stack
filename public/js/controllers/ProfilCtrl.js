// public/js/controllers/ProfilCtrl.js
angular.module('ProfilCtrl', ['flow'])
.controller('ProfilController', function($scope) {

    $scope.profil={
    	email : '',
    	nom : '',
    	prenom : '',
    	mobile : '',
    	fixe : '',
    	adresse : '',
    	presentation : {
    		la_ferme : '',
    		les_produits : '',
    		les_methodes :'',
    		photos : ''
    	}
    }
});
