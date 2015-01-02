// public/js/services/UserService.js
angular.module('UserService', []).factory('User', ['$http', function($http) {

    return {
	
		
        // call to get all nerds
        getUsersList : function() {
            return $http.get('/api/auth/users');
        },

		ajout_producteur : function(){
			return $http.get('/producteurs/producteur_details');
		},

        // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
        create : function(nerdData) {
            return $http.post('/api/producteurs', producteurData);
        },

        // call to DELETE a nerd
        delete : function(id) {
            return $http.delete('/api/producteurs/' + id);
        },
		
		chargement : function(){
			(function(j){
				for (var i =0;i<j;i++){
					$http.get('/api/annees/2013').
					success(function(data, status, headers, config) {
						return data;
					}).
					error(function(data, status, headers, config) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
					});
				}
			})(1);
		},
		
		updateProducteur : function(type,data){
			return $http.post('api/producteur/update',{'donnees' : data});
		}
    }       

}]);
