// public/js/controllers/ProfilCtrl.js
angular.module('ProfilCtrl', [])
.controller('ProfilController', function($scope,Profil) {

    $scope.userProfil={
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
    		photos : []
    	}
    }
    $scope.saveProfil = function(){
        Profil.saveProfil({userProfil : $scope.userProfil},function(err,data){
            if(err) console.log(err);
            $scope.saveOk=true; 
        });
    }
    Profil.getProfil(function(err,data){
        if(err) console.log(err);
        $scope.userProfil=data;
    });


	
	
});
