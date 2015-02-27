// dépriecé, ne sers plus
(function(){
	angular	
		.module('locashopApp')
		.directive('emailAvailable', emailAvailable);
			
		emailAvailable.$inject=['$http','$timeout'];
			
		function emailAvailable($http,$timeout){
		
			var directive = {
				checking : null,
				require : 'ngModel',
				link : link		
			}
		
			return directive;
			
			function link(scope, ele, attrs, c) {
			  scope.$watch(attrs.ngModel, function() {
				/*if (typeof checking == undefined) {
					checking = */$timeout(function(){
						$http.post('/api/inscription/checkEmailAvailable',{'email':attrs.emailAvailable})
							.success(function(data, status, headers, config) {
								c.$setValidity('emailAvailable', data.checkEmailAvailable);
							})
							.error(function(data, status, headers, config) {
							});
					},500);
				//}
			  });
			}
	  }
})();