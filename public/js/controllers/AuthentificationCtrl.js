// public/js/controllers/NerdCtrl.js
angular.module('AuthentificationCtrl', ['uiGmapgoogle-maps'])
.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization,places'
    });
})
.controller('AuthentificationController', function($scope,$rootScope,$location,Authentification) {

	// boolean qui contrôle l'appel au cookie pour le premier accès à l'appli
	$rootScope.firstConnection=true;
	// boolean qui précise si l'utilisateur est authentifié ou non
	$rootScope.isLoggedIn=false;
	// boolean qui assure l'égalité des 2 pwd entrés
	$scope.passwordEquals = true;
	// boolean qui assure que l'email est disponible
	$scope.emailAvailable = true;

	// On vérifie que les 2 pwd sont égaux
	$scope.checkPasswordEqual = function(){
		if($scope.user.password !== $scope.user.passwordBis){
			$scope.passwordEquals=false;
			}
		else{
			$scope.passwordEquals=true;
			}
	};
	// on vérifie que l'email est disponible
	$scope.checkEmailAvailable = function(){
		Authentification.checkEmailAvailable($scope.user.email, function(data){
			$scope.emailAvailable= data.checkEmailAvailable;
		});
	
	};
	
	$scope.submitForm = function(isValid) {
	// check to make sure the form is completely valid
		if (isValid) {
			Authentification.validate($scope.user,function(statut,data){
				if(statut){
					$rootScope.isLoggedIn=true;
					$rootScope.userInfo=data.user;
					$location.path('/user/'+data.user.id);
				}
				else{
				$scope.loginMessages=data.loginMessages;
				}
			});
		}
	};
	
	$scope.login = function(){
		Authentification.login($scope.email,$scope.password,function(statut,data){
			if(statut){
				$rootScope.userInfo=data.user;
				$rootScope.isLoggedIn=true;
			}
			else{
				$scope.loginMessages=data.loginMessages;
			}				
		});
	};
	if($rootScope.firstConnection){
		Authentification.userInfo(function(data){
				if(data != ""){
					$rootScope.userInfo=data;
					$rootScope.isLoggedIn=true;
				}
				$rootScope.firstConnection=false;
		});
	}

	$scope.logout = function(){
		Authentification.logout(function(data){
			if(data.status="ok"){
				$rootScope.userInfo=null;
				$rootScope.isLoggedIn=false;
				}
			$location.path('/');
			
		});
	};
});

