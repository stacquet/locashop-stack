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
	// On s'assure que le formulaire est valide
		if (isValid) {
			Authentification.validate($scope.user,function(statut,data){
				if(statut){
					$rootScope.isLoggedIn=true;
					$rootScope.userInfos=data.user;
					$location.path('/user/emailValidation');
				}
				else{
					$scope.loginMessages=data.loginMessages;
				}
			});
		}
	};
	
	$scope.login = function(){
		Authentification.login($scope.user.email,$scope.user.password,function(statut,data){
			if(statut){
				$rootScope.userInfos=data.user;
				$rootScope.isLoggedIn=true;
				$location.path('/');
			}
			else{
				$scope.loginMessages=data.loginMessages;
			}				
		});
	};
	if($rootScope.firstConnection){
		Authentification.userInfos(function(data){
				if(data != ""){
					$rootScope.userInfos=data;
					$rootScope.isLoggedIn=true;
				}
				$rootScope.firstConnection=false;
		});
	}

	$scope.logout = function(){
		Authentification.logout(function(data){
			if(data.status="ok"){
				$rootScope.userInfos=null;
				$rootScope.isLoggedIn=false;
				}
			$location.path('/');
			
		});
	};
});

